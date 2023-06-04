import { PaymentItemInput } from 'payments';
import { PaymentInputStruct, PaymentInputUnit } from '../hooks';
import { shortenedAddress } from './text';
import { ethers } from 'ethers';

export const convertToPaymentInput = ({
  senderDetails,
  receiverDetails,
}: {
  senderDetails: PaymentItemInput[];
  receiverDetails: PaymentItemInput[];
}): PaymentInputStruct => {
  const input: PaymentInputStruct = {
    receivers: [],
    senders: [],
  };
  const senderSet = new Set<string>();
  senderDetails.forEach(sender => {
    if (!ethers.utils.isAddress(sender.address)) {
      throw new Error(`
        Invalid sender address ${sender.address}
      `);
    }

    let ethToken: PaymentInputUnit = {
      amount: 0,
      token: '0x0000000000000000000000000000000000000000',
      user: sender.address,
    };

    sender.tokenDetails.forEach(token => {
      if (!ethers.utils.isAddress(token.token.address)) {
        throw new Error(`
          Invalid token ${token.token.name} for sender ${shortenedAddress(
          sender.address,
        )}
      `);
      }

      const tokenSet = new Set<string>();
      if (
        token.token.address === '0x0000000000000000000000000000000000000000'
      ) {
        ethToken = {
          user: sender.address,
          amount: parseFloat(token.amount) * 1e18,
          token: token.token.address,
        };
      } else {
        try {
          parseFloat(token.amount) * 1e18;
        } catch (err) {
          throw new Error(
            `Invalid amount for sender ${shortenedAddress(
              sender.address,
            )} and token ${shortenedAddress(token.token.name)}`,
          );
        }
        if (parseFloat(token.amount) === 0) {
          throw new Error(
            `Invalid token amount for sender ${shortenedAddress(
              sender.address,
            )} and token ${token.token.name}`,
          );
        }
        input.senders.push({
          user: sender.address,
          amount: parseFloat(token.amount) * 1e18,
          token: token.token.address,
        });
      }
      if (!tokenSet.has(token.token.address)) {
        tokenSet.add(token.token.address);
      } else {
        throw new Error(`
          Duplicate token ${shortenedAddress(
            token.token.name,
          )} found for sender ${shortenedAddress(sender.address)}
        `);
      }
    });

    ethToken = {
      amount: 0 * 1e18,
      token: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', // CHAINLINK ADDRESS TEMPORARY
      user: ethToken.user,
    };
    input.senders = [ethToken, ...input.senders];

    if (!senderSet.has(sender.address)) {
      senderSet.add(sender.address);
    } else {
      throw new Error(
        `Duplicate sender ${shortenedAddress(sender.address)} found`,
      );
    }
  });

  const receiverSet = new Set<string>();
  receiverDetails.forEach(receiver => {
    if (!ethers.utils.isAddress(receiver.address)) {
      throw new Error(`
        Invalid receiver address ${receiver.address}
      `);
    }

    let ethToken: PaymentInputUnit = {
      amount: 0,
      token: '0x0000000000000000000000000000000000000000',
      user: receiver.address,
    };

    receiver.tokenDetails.forEach(token => {
      if (!ethers.utils.isAddress(token.token.address)) {
        throw new Error(`
          Invalid token ${token.token.name} for receiver ${shortenedAddress(
          receiver.address,
        )}
      `);
      }

      const tokenSet = new Set<string>();

      if (
        token.token.address === '0x0000000000000000000000000000000000000000'
      ) {
        ethToken = {
          user: receiver.address,
          amount: parseFloat(token.amount) * 1e18,
          token: token.token.address,
        };
      } else {
        try {
          parseFloat(token.amount) * 1e18;
        } catch (err) {
          throw new Error(
            `Invalid amount for receiver ${shortenedAddress(
              receiver.address,
            )} and token ${shortenedAddress(token.token.name)}`,
          );
        }

        if (parseFloat(token.amount) === 0) {
          throw new Error(
            `Invalid token amount for receiver ${shortenedAddress(
              receiver.address,
            )} and token ${token.token.name}`,
          );
        }

        input.receivers.push({
          user: receiver.address,
          amount: parseFloat(token.amount) * 1e18,
          token: token.token.address,
        });
      }
      if (!tokenSet.has(token.token.address)) {
        tokenSet.add(token.token.address);
      } else {
        throw new Error(`
          Duplicate token ${shortenedAddress(
            token.token.name,
          )} found for receiver ${shortenedAddress(receiver.address)}
        `);
      }
    });

    ethToken = {
      amount: 0 * 1e18,
      token: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', // CHAINLINK ADDRESS TEMPORARY
      user: ethToken.user,
    };
    input.receivers = [ethToken, ...input.receivers];

    if (!receiverSet.has(receiver.address)) {
      receiverSet.add(receiver.address);
    } else {
      throw new Error(
        `Duplicate receiver ${shortenedAddress(receiver.address)} found`,
      );
    }
  });

  if (input.senders.length === 0) {
    throw new Error('No senders found');
  }
  if (input.receivers.length === 0) {
    throw new Error('No receivers found');
  }

  const senderTokenAmounts = new Map<string, number>();
  input.senders.forEach(sender => {
    const tokenAmount = senderTokenAmounts.get(sender.token);
    if (tokenAmount !== undefined) {
      senderTokenAmounts.set(sender.token, tokenAmount + sender.amount);
    } else {
      senderTokenAmounts.set(sender.token, sender.amount);
    }
  });

  const receiverTokenAmounts = new Map<string, number>();
  input.receivers.forEach(receiver => {
    const tokenAmount = receiverTokenAmounts.get(receiver.token);
    if (tokenAmount !== undefined) {
      receiverTokenAmounts.set(receiver.token, tokenAmount + receiver.amount);
    } else {
      receiverTokenAmounts.set(receiver.token, receiver.amount);
    }
  });

  senderTokenAmounts.forEach((amount, token) => {
    const receiverAmount = receiverTokenAmounts.get(token);
    if (receiverAmount === undefined) {
      throw new Error(
        `No receiver found for token ${shortenedAddress(token)} found`,
      );
    }
    if (amount !== receiverAmount) {
      throw new Error(
        `Token ${shortenedAddress(
          token,
        )} amount mismatch between senders and receivers`,
      );
    }
  });

  console.log('input', input);
  return input;
};
