
export const saveToken = (token) => {
  const expiryTime = Date.now() + parseInt(import.meta.env.VITE_JWT_EXPIRY_MINUTES) * 60 * 1000;
  localStorage.setItem(import.meta.env.JWT_KEY, token);
  localStorage.setItem(import.meta.env.JWT_EXPIRY_KEY, expiryTime.toString());
};


export const getToken = () => {
  const token = localStorage.getItem(import.meta.env.JWT_KEY);
  const expiryTime = localStorage.getItem(import.meta.env.JWT_EXPIRY_KEY);
  
  if (!token || !expiryTime) {
    return null;
  }
  
 
  if (Date.now() > parseInt(expiryTime)) {
    removeToken();
    return null;
  }
  
  return token;
};


export const removeToken = () => {
  localStorage.removeItem(import.meta.env.JWT_KEY);
  localStorage.removeItem(import.meta.env.JWT_EXPIRY_KEY);
};


export const isAuthenticated = () => {
  return getToken() !== null;
};

