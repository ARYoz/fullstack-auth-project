import express from 'express';
import { signup } from '../../controllers/auth/signupController.js';

const router = express.Router();


router.post('/', (req, res, next) => {
  signup(req, res, next);
});

export default router;

