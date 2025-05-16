let globalLogout = () => {};

export const useGlobalLogout = () => globalLogout;

export const setGlobalLogout = (logoutFn) => {
  globalLogout = logoutFn;
};

