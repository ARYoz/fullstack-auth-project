import { logout } from '../services/api';
import styles from './Welcome.module.css';

const Welcome = ({ email, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className={styles['welcome-container']}>
      <div className={styles['welcome-card']}>
        <h1 className={styles['welcome-title']}>Welcome {email}</h1>
        <button 
          className={styles['logout-button']}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;

