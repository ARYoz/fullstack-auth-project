import express from 'express';
import { verifyOTP } from '../../controllers/auth/verifyOTPController.js';

const router = express.Router();


router.post('/', verifyOTP);

export default router;

