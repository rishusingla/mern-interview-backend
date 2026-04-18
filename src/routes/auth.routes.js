import { Router } from 'express';
import * as authController from '../controllers/auth.controllers.js'
import authMiddleware from '../middleware/auth.middleware.js'

const authRouter = Router();
/**
 * REGISTER
 * @route POST/api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);

/**
 * LOGIN
 * @route POST/api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUser)

/**
 * LOGOUT
 * @route GET/app/auth/logout
 * @description Logouts user and adds token in blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logout)

/**
 * @route GET/api/auth/get-me
 * @description provide user details
 * @access Public
 */
authRouter.get('/get-me', authMiddleware,authController.getMe)

export default authRouter;
