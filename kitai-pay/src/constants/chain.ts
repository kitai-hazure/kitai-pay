import { Token } from '../types/payments';

const TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET: Token[] = [
  {
    name: 'Ether',
    symbol: 'ETH',
    address: '0x244f21e2cDB60e9B6C9aEbB96FFe04489831F881',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    name: 'Matic Token',
    symbol: 'MATIC',
    address: '0x244f21e2cDB60e9B6C9aEbB96FFe04489831F881',
    image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    address: '0x557278364B136a8D7686016b1930c8C7136d8af9',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    name: 'AAVE Token',
    symbol: 'AAVE',
    address: '0x390a1A406B9BCcF9d065Bd799fDfbA7Ce8d47eA2',
    image: 'https://cryptologos.cc/logos/aave-aave-logo.png',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x7379a261bC347BDD445484A91648Abf4A2BDEe5E',
    image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
];

// const TOKEN_OPTIONS_POLYGON: Token[] = [
//   {
//     name: 'Matic Token',
//     symbol: 'MATIC',
//     // address:
//     image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
//   },
//   {
//     name: 'USDC',
//     symbol: 'USDC',
//     // address
//     image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
//   },
//   {
//     name: 'Dai Stablecoin',
//     symbol: 'DAI',
//     // address
//     image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
//   },
//   {
//     name: 'Wrapped BTC',
//     symbol: 'WBTC',
//     // address
//     image: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
//   },
//   {
//     name: 'ChainLink Token',
//     symbol: 'LINK',
//     // address
//     image: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
//   },
//   {
//     name: 'AAVE Token',
//     symbol: 'AAVE',
//     // address
//     image: 'https://cryptologos.cc/logos/aave-aave-logo.png',
//   },
//   {
//     name: 'Uniswap',
//     symbol: 'UNI',
//     // address
//     image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
//   },
// ]

// const IS_ZKEVM = true;
// IF not ZKEVM, return other
export const CHAIN_DETAILS = {
  ID: 1442,
  NAME: 'Polygon ZKEVM',
  TOKENS: TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET,
  DEFAULT_TOKEN: TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET[0],
  DEFAULT_TOKEN_AMOUNT: '1',
};
