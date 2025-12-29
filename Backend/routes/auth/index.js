import express from 'express';
import loginRouter from './login.js';
import signupRouter from './signup.js';
import verifyOTPRouter from './verifyOTP.js';
import userRouter from './user.js';

const router = express.Router();


router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/verify-otp', verifyOTPRouter);
router.use('/me', userRouter);

export default router;

