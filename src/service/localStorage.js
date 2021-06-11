const tokenName = "token";

const setToken = (token) => {
  return localStorage.setItem(tokenName, token);
};
const getToken = () => {
  return localStorage.getItem(tokenName);
};
const clearToken = () => {
  return localStorage.removeItem(tokenName);
};

const service = { setToken, getToken, clearToken };

export default service;