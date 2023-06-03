import { expect } from "chai";
// @ts-ignore
import { ethers } from "hardhat";

const TOKENS = [
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
];
const AMOUNTS = [1, 2, 3, 4, 5];

const GET_PAYMENT_INPUT = (otherAccounts: any) => {
  var PAYMENT_OBJECT = {};

  var PAYMENT_SENDERS = [];
  var PAYMENT_RECEIVERS = [];

  for (let i = 0; i < otherAccounts.length / 2; i++) {
    const objectToInsert = {
      user: otherAccounts[i].address,
      amount: AMOUNTS[i % AMOUNTS.length],
      token: TOKENS[i % TOKENS.length],
    };
    PAYMENT_SENDERS.push(objectToInsert);
  }

  for (let i = otherAccounts.length / 2; i < otherAccounts.length; i++) {
    const objectToInsert = {
      user: otherAccounts[i].address,
      amount: AMOUNTS[i % AMOUNTS.length],
      token: TOKENS[i % TOKENS.length],
    };
    PAYMENT_RECEIVERS.push(objectToInsert);
  }

  // @ts-ignore
  PAYMENT_OBJECT["senders"] = PAYMENT_SENDERS;
  // @ts-ignore
  PAYMENT_OBJECT["receivers"] = PAYMENT_RECEIVERS;

  return PAYMENT_OBJECT;
};

const GET_SIGNATURE = (payment_object: any, payment_id: number) => {
  const abiCoder = new ethers.utils.AbiCoder();

  var SIGNATURE = ethers.utils.keccak256(
    abiCoder.encode(["uint256"], [payment_id])
  );

  for (let i = 0; i < payment_object["senders"].length; i++) {
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["bytes32"], [SIGNATURE])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["address"], [payment_object["senders"][i]["user"]])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["address"], [payment_object["senders"][i]["token"]])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["uint256"], [payment_object["senders"][i]["amount"]])
    );
  }

  for (let i = 0; i < payment_object["receivers"].length; i++) {
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["bytes32"], [SIGNATURE])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["address"], [payment_object["receivers"][i]["user"]])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["address"], [payment_object["receivers"][i]["token"]])
    );
    SIGNATURE = ethers.utils.keccak256(
      abiCoder.encode(["uint256"], [payment_object["receivers"][i]["amount"]])
    );
  }

  return SIGNATURE;
};

describe("KitaiPay", function () {
  let OWNER: any;
  let OTHER_ACCOUNT: any;
  let KITAI_PAY: any;

  this.beforeEach(async function () {
    const KitaiPay = await ethers.getContractFactory("KitaiPay");
    KITAI_PAY = await KitaiPay.deploy();
    await KITAI_PAY.deployed();
    console.log("KitaiPay deployed to:", KITAI_PAY.address);
    [OWNER, ...OTHER_ACCOUNT] = await ethers.getSigners();
  });

  describe("Validations", function () {
    it("Should ensure the hash validity", async () => {
      const PAYMENT_ID = 1;
      // @ts-ignore
      const PAYMENT = GET_PAYMENT_INPUT([OWNER, ...OTHER_ACCOUNT]);
      const SIGNATURE = GET_SIGNATURE(PAYMENT, PAYMENT_ID);

      await KITAI_PAY.addPaymentSignature(PAYMENT_ID, SIGNATURE);

      var WRONG_PAYMENT: any = PAYMENT;
      WRONG_PAYMENT["senders"][0]["amount"] = 100;

      expect(await KITAI_PAY.ensureHashValidity(PAYMENT_ID, PAYMENT)).to.not.be
        .reverted;

      expect(await KITAI_PAY.ensureHashValidity(PAYMENT_ID, WRONG_PAYMENT)).to
        .be.reverted;
    });
  });

  describe("Payment", function () {
    it("Should add the payment signature", async () => {
      const PAYMENT_ID = 1;
      // @ts-ignore
      const PAYMENT = GET_PAYMENT_INPUT([OWNER, ...OTHER_ACCOUNT]);
      const SIGNATURE = GET_SIGNATURE(PAYMENT, PAYMENT_ID);

      await KITAI_PAY.addPaymentSignature(PAYMENT_ID, SIGNATURE);
    });

    it("Should create a payment", async () => {
      const PAYMENT_ID = 1;
      // @ts-ignore
      const PAYMENT = GET_PAYMENT_INPUT([OWNER, ...OTHER_ACCOUNT]);
      const SIGNATURE = GET_SIGNATURE(PAYMENT, PAYMENT_ID);

      await KITAI_PAY.addPaymentSignature(PAYMENT_ID, SIGNATURE);

      const PAYMENT_DESCRIPTION = "THIS IS A TEST PAYMENT";
      await KITAI_PAY.createPayment(
        PAYMENT_ID,
        PAYMENT,
        PAYMENT_DESCRIPTION,
        false // owner is sending 1 ETH according to the payment
      );
      const payment = await KITAI_PAY.getPaymentDetails(PAYMENT_ID);
      expect(payment.length).to.equal(6);
      expect(payment.owner).to.equal(OWNER.address);
      expect(payment.description).to.equal(PAYMENT_DESCRIPTION);
      expect(payment.completed).to.equal(false);
      expect(payment.cancelled).to.equal(false);
    });
  });
});
