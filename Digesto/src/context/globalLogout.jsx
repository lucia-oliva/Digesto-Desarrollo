let globalLogout = null;

export const getGlobalLogout = () => globalLogout;

export const setGlobalLogout = (fn) => {
  globalLogout = fn;
};
