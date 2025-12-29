import User from '../../models/User.js';
import { generateToken } from '../../utils/jwt.js';
import { isOTPExpired } from '../../utils/otp.js';
import { validateEmail } from '../../utils/validation.js';


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

  
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    
    if (isOTPExpired(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    
    const token = generateToken({ email: user.email, userId: user._id });

    res.json({
      message: 'Signup successful',
      token,
      email: user.email,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

