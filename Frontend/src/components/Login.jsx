import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validation';
import { login, signup } from '../services/api';
import styles from './Login.module.css';

const Login = ({ onLoginSuccess, onStartSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();


    setEmailError('');
    setPasswordError('');
    setLoginError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error);
    }


    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);

      onLoginSuccess(response.email || email);
    } catch (error) {

      const errorMessage = error.message || error.error || '';
      const statusCode = error.statusCode || error.status;

      if (
        errorMessage.toLowerCase().includes('not found') ||
        errorMessage.toLowerCase().includes("don't have you") ||
        statusCode === 404
      ) {
        const shouldSignup = window.confirm('We don\'t have you in our systems, would you like to sign up?');
        if (shouldSignup) {

          onStartSignup('', '');
        }
      } else if (

        errorMessage.toLowerCase().includes('verify') ||
        errorMessage.toLowerCase().includes('verification')
      ) {

        setLoginError('* Please verify your email first. Check your inbox for OTP.');
      } else if (
        errorMessage.toLowerCase().includes('invalid password') ||
        statusCode === 401
      ) {

        setLoginError('* Invalid email or password');
      } else if (
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('password') ||
        errorMessage.toLowerCase().includes('email') ||
        statusCode === 400
      ) {

        setLoginError('* Invalid email or password');
      } else {
        setLoginError(errorMessage || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <h1 className={styles['login-title']}>Login</h1>

        <form onSubmit={handleSubmit} className={styles['login-form']} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email</label>
            {loginError && (
              <div className={styles['error-message']}>{loginError}</div>
            )}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setLoginError('');
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
                setLoginError('');
              }}
              className={passwordError ? styles['input-error'] : ''}
              placeholder="Enter your password"
            />
            {passwordError && <div className={styles['error-message']}>{passwordError}</div>}
          </div>

          <button
            type="submit"
            className={styles['login-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

