import { useState, useEffect } from 'react';
import { validateEmail, validatePassword, validateOTP } from '../utils/validation';
import { signup, verifyOTP } from '../services/api';
import styles from './Signup.module.css';

const Signup = ({ email: initialEmail, password: initialPassword, onSignupSuccess, onBack }) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

 
  useEffect(() => {
    if (initialEmail && initialPassword) {
      sendOTP();
    }
  }, []);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
  
    setEmailError('');
    setPasswordError('');
    
  
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
    }
    
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error);
    }
    
  
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }
    
   
    await sendOTP();
  };

  const sendOTP = async () => {
    setIsSendingOTP(true);
    try {
      await signup(email, password);
      setIsSendingOTP(false);
      setShowOTPForm(true);
    } catch (error) {
      setIsSendingOTP(false);
      alert(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setOtpError('');
    
  
    const otpValidation = validateOTP(otp);
    if (!otpValidation.isValid) {
      setOtpError(otpValidation.error);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await verifyOTP(email, otp);
   
      onSignupSuccess(response.email || email);
    } catch (error) {
      if (error.message === 'Invalid or expired OTP' || error.statusCode === 400) {
        setOtpError('* Invalid or expired OTP');
      } else {
        setOtpError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  if (isSendingOTP) {
    return (
      <div className={styles['signup-container']}>
        <div className={styles['signup-card']}>
          <div className={styles['loading-spinner']}>Sending OTP to your email...</div>
        </div>
      </div>
    );
  }

  
  if (!showOTPForm) {
    return (
      <div className={styles['signup-container']}>
        <div className={styles['signup-card']}>
          <h1 className={styles['signup-title']}>Sign Up</h1>
          
          <form onSubmit={handleSignupSubmit} className={styles['signup-form']} noValidate>
            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={emailError ? styles['input-error'] : ''}
                placeholder="email@domain.com"
              />
              {emailError && <div className={styles['error-message']}>{emailError}</div>}
            </div>
            
            <div className={styles['form-group']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                className={passwordError ? styles['input-error'] : ''}
                placeholder="Enter your password (min 8 characters)"
              />
              {passwordError && <div className={styles['error-message']}>{passwordError}</div>}
            </div>
            
            <div className={styles['button-group']}>
              <button 
                type="button"
                className={styles['back-button']}
                onClick={onBack}
                disabled={isLoading}
              >
                Back
              </button>
              <button 
                type="submit" 
                className={styles['verify-button']}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className={styles['signup-container']}>
      <div className={styles['signup-card']}>
        <h1 className={styles['signup-title']}>Sign Up</h1>
        <p className={styles['signup-subtitle']}>We've sent an OTP to {email}</p>
        
        <form onSubmit={handleSubmit} className={styles['signup-form']} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setOtpError('');
              }}
              className={otpError ? styles['input-error'] : ''}
              placeholder="Enter OTP"
              maxLength="6"
            />
            {otpError && <div className={styles['error-message']}>{otpError}</div>}
          </div>
          
          <div className={styles['button-group']}>
            <button 
              type="button"
              className={styles['back-button']}
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </button>
            <button 
              type="submit" 
              className={styles['verify-button']}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

