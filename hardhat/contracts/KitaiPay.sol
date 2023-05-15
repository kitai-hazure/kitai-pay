// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error KitaiPay__PaymentAlreadyCompleted();
error KitaiPay__PaymentAlreadyCancelled();
error KitaiPay__EthAmountMismatch();
error KitaiPay__TokenAmountMismatch();
error KitaiPay__EmptyTokenArray();
error KitaiPay__InvalidInput();
error KitaiPay__OnlyOwner();

// NOTE: TokenDetails has unique token addresses
// NOTE: User addresses inside TokenDetails are not unique

struct TokenSender {
    address user;
    uint256 amount;
    bool hasCompleted;
}
struct TokenReceiver {
    address user;
    uint256 amount;
}

struct TokenDetails {
    address tokenAddress;
    TokenSender[] senders;
    TokenReceiver[] receivers;
}

struct Payment {
    TokenDetails[] tokenDetails;
    address owner;
    uint256 paymentId;
    string description;
    bool completed;
    bool cancelled;
}

contract KitaiPay {
    Payment[] private _payments;

    function hasDuplicates(
        TokenDetails[] memory tokenDetails
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < tokenDetails.length; i++) {
            for (uint256 j = i + 1; j < tokenDetails.length; j++) {
                if (
                    tokenDetails[i].tokenAddress == tokenDetails[j].tokenAddress
                ) return true;
            }
        }
        return false;
    }

    function checkTokenAmounts(
        TokenDetails[] memory tokenDetails
    ) internal pure returns (bool) {
        if (tokenDetails.length == 0) revert KitaiPay__EmptyTokenArray();
        TokenDetails memory ethDetails = tokenDetails[0];
        if (ethDetails.tokenAddress != address(0))
            revert KitaiPay__InvalidInput();
        for (uint256 i = 0; i < tokenDetails.length; i++) {
            TokenDetails memory tokenDetail = tokenDetails[i];
            uint256 totalTokenSent = 0;
            uint256 totalTokenReceived = 0;
            for (uint256 j = 0; j < tokenDetail.senders.length; j++) {
                totalTokenSent += tokenDetail.senders[j].amount;
            }
            for (uint256 j = 0; j < tokenDetail.receivers.length; j++) {
                totalTokenReceived += tokenDetail.receivers[j].amount;
            }
            if (totalTokenSent != totalTokenReceived) {
                return false;
            }
        }
        return true;
    }

    function createPayment(
        TokenDetails[] memory tokenDetails,
        string memory description
    ) public payable {
        if (!checkTokenAmounts(tokenDetails))
            revert KitaiPay__TokenAmountMismatch();

        // TODO: Check if user's share was sent along with the transaction

        if (hasDuplicates(tokenDetails)) revert KitaiPay__InvalidInput();

        Payment storage createdPayment = _payments.push();
        createdPayment.cancelled = false;
        createdPayment.completed = false;
        createdPayment.description = description;
        createdPayment.owner = msg.sender;
        createdPayment.paymentId = _payments.length - 1;

        for (uint256 i = 0; i < tokenDetails.length; i++) {
            TokenDetails storage createdTokenDetail = createdPayment
                .tokenDetails
                .push();
            createdTokenDetail.tokenAddress = tokenDetails[i].tokenAddress;
            for (uint256 j = 0; j < tokenDetails[i].senders.length; j++) {
                TokenSender storage createdSender = createdTokenDetail
                    .senders
                    .push();
                createdSender.user = tokenDetails[i].senders[j].user;
                createdSender.amount = tokenDetails[i].senders[j].amount;
                if (createdSender.amount == 0) revert KitaiPay__InvalidInput();
                createdSender.hasCompleted = false;
            }
            for (uint256 j = 0; j < tokenDetails[i].receivers.length; j++) {
                TokenReceiver storage createdReceiver = createdTokenDetail
                    .receivers
                    .push();
                createdReceiver.user = tokenDetails[i].receivers[j].user;
                createdReceiver.amount = tokenDetails[i].receivers[j].amount;
                if (createdReceiver.amount == 0)
                    revert KitaiPay__InvalidInput();
            }
        }
    }

    function cancelPayment(uint256 paymentId) public {
        Payment storage payment = _payments[paymentId];
        if (payment.completed) {
            revert KitaiPay__PaymentAlreadyCompleted();
        }
        if (payment.cancelled) {
            revert KitaiPay__PaymentAlreadyCancelled();
        }
        if (payment.owner != msg.sender) {
            revert KitaiPay__OnlyOwner();
        }
        payment.cancelled = true;
        // TODO: refund
    }

    function addShareToPayment(uint256 paymentId) public payable {
        Payment storage payment = _payments[paymentId];
        if (payment.completed) {
            revert KitaiPay__PaymentAlreadyCompleted();
        }
        if (payment.cancelled) {
            revert KitaiPay__PaymentAlreadyCancelled();
        }
        // TODO: check if user has completed his share
        // TODO: add share to payment
        // TODO: check if payment is completed
        // TODO: if completed, transfer tokens to receivers
    }

    function getPayment(
        uint256 paymentId
    ) public view returns (Payment memory) {
        return _payments[paymentId];
    }
}
