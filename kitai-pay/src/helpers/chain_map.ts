import { TOKEN_OPTIONS_POLYGON } from '../constants/chain';

export const getTokenDetails = (tokenAddress: string) => {
  const tokenToReturn = TOKEN_OPTIONS_POLYGON.find(
    token => token.address === tokenAddress,
  );
  if (!tokenToReturn) {
    throw new Error(`Token ${tokenAddress} not found`);
  }
  return tokenToReturn;
};

export const getDisplayAmount = (amount: number) => {
  const newAmount = amount / 1e18;
  return newAmount.toFixed(5);
};
