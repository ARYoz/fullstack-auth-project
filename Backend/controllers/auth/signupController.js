import User from '../../models/User.js';
import { generateOTP, getOTPExpiry } from '../../utils/otp.js';
import { sendOTPEmail } from '../../utils/email.js';
import { validateEmail, validatePassword } from '../../utils/validation.js';


export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Processing signup for: ${email}`);

    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.error });
    }

  
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }

    
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    console.log(`OTP generated: ${otp}`);

    try {
      if (user) {
        
        user.password = password; 
        user.otp = {
          code: otp,
          expiresAt: otpExpiry,
        };
        user.isVerified = false; 
        await user.save();
      } else {
        
        user = new User({
          email: email.toLowerCase(),
          password,
          otp: {
            code: otp,
            expiresAt: otpExpiry,
          },
          isVerified: false,
        });
        await user.save();
      }
    } catch (saveError) {
      
      if (saveError.code === 11000) {
      
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          if (user.isVerified) {
            return res.status(400).json({ message: 'User already exists. Please login instead.' });
          }
         
          user.password = password; 
          user.otp = {
            code: otp,
            expiresAt: otpExpiry,
          };
          user.isVerified = false;
          await user.save();
        } else {
          throw saveError;
        }
      } else {
        throw saveError; 
      }
    }

  
    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailError) {
      console.error('Failes to send OTP email', emailError.message);

      if (process.env.NODE_ENV === 'development') {
        console.log(`\n ============================================`);
        console.log(` OTP for ${user.email}: ${otp}`);
        console.log(`============================================\n`);
      }
    }
    res.json({
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

