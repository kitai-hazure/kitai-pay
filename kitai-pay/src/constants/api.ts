const BASE_URL = 'http://192.168.29.124:8080';
const REST_API_URL = `${BASE_URL}/api`;
const GRAPHQL_URL = `${BASE_URL}/graphql`;

export const API = {
  BASE_URL,
  REST_API_URL,
  GRAPHQL_URL,
  // @dev Third Web adds a /login to the given path
  THIRDWEB_LOGIN: `${REST_API_URL}/thirdweb`,
};
