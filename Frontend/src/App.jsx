import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import { isAuthenticated, getToken } from './utils/jwt';
import { getCurrentUser, checkBackendConnection } from './services/api';
import styles from './App.module.css';

function App() {
  const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const checkAuth = async () => {
     
      const connectionCheck = await checkBackendConnection();
      if (!connectionCheck.connected) {
        console.warn('Backend connection failed:', connectionCheck.error);
        
      }

      if (isAuthenticated()) {
        try {
        
          const userData = await getCurrentUser();
          if (userData && userData.email) {
            setUser(userData.email);
          }
        } catch (error) {
        
          console.error('Failed to get user info:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (email) => {
    setUser(email);
    setIsSigningUp(false);
  };

  const handleStartSignup = (email, password) => {
    setSignupEmail(email);
    setSignupPassword(password);
    setIsSigningUp(true);
  };

  const handleSignupSuccess = (email) => {
    setUser(email);
    setIsSigningUp(false);
  };

  const handleBackFromSignup = () => {
    setIsSigningUp(false);
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    setIsSigningUp(false);
    setSignupEmail('');
    setSignupPassword('');
  };

  if (isLoading) {
  return (
      <div className={styles['app-loading']}>
        <div className={styles['loading-spinner']}>Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Welcome email={user} onLogout={handleLogout} />;
  }

  if (isSigningUp) {
    return (
      <Signup
        email={signupEmail}
        password={signupPassword}
        onSignupSuccess={handleSignupSuccess}
        onBack={handleBackFromSignup}
      />
    );
  }

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onStartSignup={handleStartSignup}
    />
  );
}

export default App;
