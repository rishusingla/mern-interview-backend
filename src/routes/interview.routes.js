import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js'
import * as interviewController from "../controllers/interview.controller.js"
import upload from '../middleware/file.middleware.js';
const interviewRouter = Router();

/**
 * @route POST/api/interview/
 * @description Takes resume, JD,
 *  SD and returns interview Report as a response.
 * @access Private
 */

interviewRouter.post('/',authMiddleware,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @route GET/api/interview/:interviewId
 * @description get interview report by interviewId
 * @access Private
 */

interviewRouter.get('/report/:interviewId', authMiddleware, interviewController.getInterviewReportByIdController);

/**
 * @route GET/api/interview/
 * @description get all the interview reports of a loggedin user
 * @access Private
 */

interviewRouter.get('/',authMiddleware, interviewController.getAllReportsController)

/**
 * @route POST/api/interview/pdf/:id
 * @description returns the pdf of 
 * @access Private
 */
interviewRouter.get('/pdf/:interviewReportId', authMiddleware, interviewController.generateResumePdfController)

export default interviewRouter;