import { Token } from '../types/payments';
import kitaipayContract from '../contracts/KitaiPay.json';

// const TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET: Token[] = [
//   {
//     name: 'Matic Token',
//     symbol: 'MATIC',
//     address: '0x244f21e2cDB60e9B6C9aEbB96FFe04489831F881',
//     image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
//   },
//   {
//     name: 'USDC',
//     symbol: 'USDC',
//     address: '0x557278364B136a8D7686016b1930c8C7136d8af9',
//     image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
//   },
//   {
//     name: 'AAVE Token',
//     symbol: 'AAVE',
//     address: '0x390a1A406B9BCcF9d065Bd799fDfbA7Ce8d47eA2',
//     image: 'https://cryptologos.cc/logos/aave-aave-logo.png',
//   },
//   {
//     name: 'Tether USD',
//     symbol: 'USDT',
//     address: '0x7379a261bC347BDD445484A91648Abf4A2BDEe5E',
//     image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
//   },
// ];

export const TOKEN_OPTIONS_POLYGON: Token[] = [
  {
    name: 'Matic Token',
    symbol: 'MATIC',
    address: '0x0000000000000000000000000000000000000000',
    image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  {
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    image:
      'https://res.cloudinary.com/drlni3r6u/image/upload/v1685861341/wmatic_snj1qp.png',
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    address: '0x19D66Abd20Fb2a0Fc046C139d5af1e97F09A695e',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x91E5D0c39e3F2de1d8CbbeccA3604f6704fB3494',
    image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    name: 'ChainLink Token',
    symbol: 'LINK',
    address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    image: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  },
];

// const IS_ZKEVM = true;
// IF not ZKEVM, return other
// export const CHAIN_DETAILS = {
//   ID: 1442,
//   NAME: 'Polygon ZKEVM',
//   TOKENS: TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET,
//   DEFAULT_TOKEN: TOKEN_OPTIONS_POLYGON_ZKEVM_TESTNET[0],
//   CONTRACT_ADDRESS: '0x0b371bB8e7ba0414B138a8a09E93b593c83AE6D7',
//   CONTRACT_ABI: kitaipayContract.abi,
// };

export const CHAIN_DETAILS = {
  ID: 80001,
  NAME: 'Polygon Mumbai',
  TOKENS: TOKEN_OPTIONS_POLYGON,
  DEFAULT_TOKEN: TOKEN_OPTIONS_POLYGON[0],
  CONTRACT_ADDRESS: '0x69b2251C09F4c927a5485eCbD59187F833248f36',
  CONTRACT_ABI: kitaipayContract.abi,
};
