export const shortenedAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const shortenedSenderID = (id: string) => {
  return `#${id.slice(-4)}`;
};
