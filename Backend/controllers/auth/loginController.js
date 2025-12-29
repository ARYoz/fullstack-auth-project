import User from '../../models/User.js';
import { generateToken } from '../../utils/jwt.js';
import { validateEmail, validatePassword } from '../../utils/validation.js';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.error });
    }

   
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

   
    const token = generateToken({ email: user.email, userId: user._id });

    res.json({
      message: 'Login successful',
      token,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

