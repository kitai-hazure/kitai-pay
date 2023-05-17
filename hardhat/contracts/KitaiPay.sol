// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error KitaiPay__PaymentAlreadyCompleted();
error KitaiPay__PaymentAlreadyCancelled();
error KitaiPay__OnlyContractOwnerAllowed();
error KitaiPay__OnlyPaymentOwnerAllowed();
error KitaiPay__NotEnoughBalance();
error KitaiPay__NotASenderOfThisPayment();
error KitaiPay__ShareAlreadyAdded();
error KitaiPay__ShareNotAdded();
error KitaiPay__InvalidSignature();
error KitaiPay__InvalidPaymentId();
error KitaiPay__InternalContractError();

struct PaymentInputUnit {
    address user;
    address token;
    uint256 amount;
}

struct CreatePaymentInput {
    PaymentInputUnit[] senders;
    PaymentInputUnit[] receivers;
}

struct PaymentItem {
    address token;
    uint256 amount;
}

struct Payment {
    address owner;
    uint256 paymentId;
    string description;
    bool completed;
    bool cancelled;
    uint256 paymentsCompleted;
}

contract KitaiPay {
    event PaymentCreated(uint256 indexed paymentId, address indexed owner);
    event PaymentCompleted(uint256 indexed paymentId);
    event PaymentCancelled(uint256 indexed paymentId);
    event PaymentShareAdded(uint256 indexed paymentId, address indexed user);
    event PaymentShareRemoved(uint256 indexed paymentId, address indexed user);

    // @dev The owner of the contract.
    address private immutable _owner;

    // @dev The payment data, paymentId => Payment
    mapping(uint256 => Payment) private _payments;

    // @dev The payment signature, paymentId => bytes32
    mapping(uint256 => bytes32) private _paymentSignature;

    // @dev The payment senders, paymentId => address[]
    mapping(uint256 => address[]) private _paymentSenders;

    // @dev The payment sender items, paymentId => sender address => PaymentItem[]
    mapping(uint256 => mapping(address => PaymentItem[]))
        private _paymentSenderItems;

    // @dev The payment sender statuses, paymentId => sender address => bool
    mapping(uint256 => mapping(address => bool)) private _paymentSenderStatuses;

    // @dev The payment receivers, paymentId => address[]
    mapping(uint256 => address[]) private _paymentReceivers;

    // @dev The payment receiver items, paymentId => receiver address => PaymentItem[]
    mapping(uint256 => mapping(address => PaymentItem[]))
        private _paymentReceiverItems;

    /*
     * @dev The constructor sets the owner of the contract to the sender account.
     */
    constructor() {
        _owner = msg.sender;
    }

    /*
     * @dev Checks if the hash generated from the payment data is valid.
     * @param paymentId The payment id.
     * @param input The payment data input.
     */
    function ensureHashValidity(
        uint256 paymentId,
        CreatePaymentInput memory input
    ) public view {
        bytes32 generatedHash = keccak256(abi.encodePacked(paymentId));
        for (uint256 i = 0; i < input.senders.length; i++) {
            generatedHash = keccak256(
                abi.encodePacked(
                    generatedHash,
                    input.senders[i].user,
                    input.senders[i].token,
                    input.senders[i].amount
                )
            );
        }
        for (uint256 i = 0; i < input.receivers.length; i++) {
            generatedHash = keccak256(
                abi.encodePacked(
                    generatedHash,
                    input.receivers[i].user,
                    input.receivers[i].token,
                    input.receivers[i].amount
                )
            );
        }
        if (generatedHash != _paymentSignature[paymentId]) {
            revert KitaiPay__InvalidSignature();
        }
    }

    /*
     * @dev Checks if the sender is the owner of the contract.
     */
    function ensureIsOwner() internal view {
        if (msg.sender != _owner) {
            revert KitaiPay__OnlyContractOwnerAllowed();
        }
    }

    /*
     * @dev Checks if the sender is the owner of the payment.
     * @param paymentId The payment id.
     */
    function ensureIsPaymentOwner(uint256 paymentId) internal view {
        if (msg.sender != _payments[paymentId].owner) {
            revert KitaiPay__OnlyPaymentOwnerAllowed();
        }
    }

    /*
     * @dev Checks if the payment is valid, not completed and not cancelled.
     * @param paymentId The payment id.
     */
    function ensureIsValidPayment(uint256 paymentId) internal view {
        if (_paymentSenders[paymentId].length == 0) {
            revert KitaiPay__InvalidPaymentId();
        }
        if (_payments[paymentId].completed) {
            revert KitaiPay__PaymentAlreadyCompleted();
        }
        if (_payments[paymentId].cancelled) {
            revert KitaiPay__PaymentAlreadyCancelled();
        }
    }

    /*
     * @dev Checks if the sender is a sender of the payment.
     * @param paymentId The payment id.
     */
    function ensureIsSender(uint256 paymentId) internal view {
        if (_paymentSenderItems[paymentId][msg.sender].length == 0) {
            revert KitaiPay__NotASenderOfThisPayment();
        }
    }

    /*
     * @dev Creates a new payment if the hash generated from the payment data is valid.
     * @param paymentId The payment id.
     * @param input The payment data input.
     * @param description The payment description.
     * @param hasAddedShare The payer has added a share.
     */
    function createPayment(
        uint256 paymentId,
        CreatePaymentInput memory input,
        string memory description,
        bool hasAddedShare
    ) public payable {
        ensureHashValidity(paymentId, input);

        for (uint256 i = 0; i < input.senders.length; i++) {
            _paymentSenders[paymentId].push(input.senders[i].user);
            _paymentSenderItems[paymentId][input.senders[i].user].push(
                PaymentItem({
                    token: input.senders[i].token,
                    amount: input.senders[i].amount
                })
            );
        }

        for (uint256 i = 0; i < input.receivers.length; i++) {
            _paymentReceivers[paymentId].push(input.receivers[i].user);
            _paymentReceiverItems[paymentId][input.receivers[i].user].push(
                PaymentItem({
                    token: input.receivers[i].token,
                    amount: input.receivers[i].amount
                })
            );
        }

        _payments[paymentId] = Payment({
            owner: msg.sender,
            paymentId: paymentId,
            description: description,
            completed: false,
            cancelled: false,
            paymentsCompleted: 0
        });

        if (hasAddedShare) {
            addUserShare(paymentId);
        }

        emit PaymentCreated(paymentId, msg.sender);
    }

    /*
     * @dev Adds a sender's share to the payment.
     * @param paymentId The payment id.
     */
    function addUserShare(uint256 paymentId) public payable {
        ensureIsValidPayment(paymentId);
        ensureIsSender(paymentId);

        if (_paymentSenderStatuses[paymentId][msg.sender]) {
            revert KitaiPay__ShareAlreadyAdded();
        }

        PaymentItem[] memory senderItems = _paymentSenderItems[paymentId][
            msg.sender
        ];
        if (msg.value < senderItems[0].amount) {
            revert KitaiPay__NotEnoughBalance();
        }

        payable(address(this)).transfer(senderItems[0].amount);
        for (uint256 i = 1; i < senderItems.length; i++) {
            IERC20 token = IERC20(senderItems[i].token);
            if (
                !token.transferFrom(
                    msg.sender,
                    address(this),
                    senderItems[i].amount
                )
            ) {
                revert KitaiPay__NotEnoughBalance();
            }
        }

        _paymentSenderStatuses[paymentId][msg.sender] = true;
        _payments[paymentId].paymentsCompleted += 1;

        if (
            _payments[paymentId].paymentsCompleted ==
            _paymentSenders[paymentId].length
        ) {
            sendReceiversShare(paymentId);
            _payments[paymentId].completed = true;

            emit PaymentCompleted(paymentId);
        }

        emit PaymentShareAdded(paymentId, msg.sender);
    }

    /*
     * @dev Sends the user's share to the back to the user.
     * @param paymentId The payment id.
     */
    function returnUserShare(uint256 paymentId) public {
        ensureIsValidPayment(paymentId);
        ensureIsSender(paymentId);

        if (!_paymentSenderStatuses[paymentId][msg.sender]) {
            revert KitaiPay__ShareNotAdded();
        }

        PaymentItem[] memory senderItems = _paymentSenderItems[paymentId][
            msg.sender
        ];
        payable(msg.sender).transfer(senderItems[0].amount);
        for (uint256 i = 1; i < senderItems.length; i++) {
            IERC20 token = IERC20(senderItems[i].token);
            if (
                !token.transferFrom(
                    address(this),
                    msg.sender,
                    senderItems[i].amount
                )
            ) {
                revert KitaiPay__InternalContractError();
            }
        }

        _paymentSenderStatuses[paymentId][msg.sender] = false;
        _payments[paymentId].paymentsCompleted -= 1;

        emit PaymentShareRemoved(paymentId, msg.sender);
    }

    /*
     * @dev Sends the receivers' share to the receivers and completes the payment.
     * @param paymentId The payment id.
     */
    function sendReceiversShare(uint256 paymentId) public {
        ensureIsValidPayment(paymentId);
        address[] memory receivers = _paymentReceivers[paymentId];
        for (uint256 i = 0; i < receivers.length; i++) {
            PaymentItem[] memory receiverItems = _paymentReceiverItems[
                paymentId
            ][receivers[i]];
            payable(receivers[i]).transfer(receiverItems[0].amount);
            for (uint256 j = 1; j < receiverItems.length; j++) {
                IERC20 token = IERC20(receiverItems[j].token);
                if (
                    !token.transferFrom(
                        address(this),
                        receivers[i],
                        receiverItems[j].amount
                    )
                ) {
                    revert KitaiPay__InternalContractError();
                }
            }
        }
    }

    /*
     * @dev Cancels a payment.
     * @param paymentId The payment id.
     */
    function cancelPayment(uint256 paymentId) public {
        ensureIsValidPayment(paymentId);
        ensureIsPaymentOwner(paymentId);

        if (_paymentSenderStatuses[paymentId][msg.sender]) {
            revert KitaiPay__ShareAlreadyAdded();
        }

        _payments[paymentId].cancelled = true;

        for (uint256 i = 0; i < _paymentSenders[paymentId].length; i++) {
            address sender = _paymentSenders[paymentId][i];
            if (!_paymentSenderStatuses[paymentId][sender]) {
                continue;
            }
            PaymentItem[] memory senderItems = _paymentSenderItems[paymentId][
                sender
            ];
            payable(sender).transfer(senderItems[0].amount);
            for (uint256 j = 1; j < senderItems.length; j++) {
                IERC20 token = IERC20(senderItems[j].token);
                if (
                    !token.transferFrom(
                        address(this),
                        sender,
                        senderItems[j].amount
                    )
                ) {
                    revert KitaiPay__InternalContractError();
                }
            }
        }

        emit PaymentCancelled(paymentId);
    }

    /*
     * @dev Adds a signature to a payment.
     * @param paymentId The payment id.
     * @param signature The signature.
     */
    function addPaymentSignature(uint256 paymentId, bytes32 signature) public {
        ensureIsValidPayment(paymentId);
        ensureIsOwner();

        if (_paymentSignature[paymentId] != 0x0) {
            revert KitaiPay__InvalidPaymentId();
        }

        _paymentSignature[paymentId] = signature;
    }
}
