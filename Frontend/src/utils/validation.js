
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: '* Required Field' };
  }
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const parts = email.split('@');
  
  if (parts.length !== 2) {
    return { isValid: false, error: '* Invalid Email' };
  }
  
  const [emailName, domain] = parts;
  

  if (!domain.endsWith('.com')) {
    return { isValid: false, error: '* Invalid Email' };
  }
  
  
  const domainParts = domain.split('.');
  if (domainParts.length !== 2 || domainParts[0].length === 0) {
    return { isValid: false, error: '* Invalid Email' };
  }
  
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '* Invalid Email' };
  }
  
  return { isValid: true, error: '' };
};


export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: '* Required Field' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: '* Password must be 8+ characters' };
  }
  
  return { isValid: true, error: '' };
};


export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, error: '* Required Field' };
  }
  
  return { isValid: true, error: '' };
};

