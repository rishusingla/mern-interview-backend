import * as pdfParse from "pdf-parse";
import ai from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

export async function generateInterviewReportController(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await ai.generateInterviewReport({ resume: resumeContent.text, selfDescription, jobDescription });
    
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })
    res.status(201).json({
        message: "Interview report created successfully",
        interviewReport
    })
}

export async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    try {
        const findReport = await interviewReportModel.findOne({
            _id: interviewId,
            user:req.user.id
        });

        if (!findReport) {
            return res.status(400).json({
                message:"No report found for this user"
            })
        }

        return res.status(200).json({
            message: "Report returned successfully!",
            report:findReport
        })
    } catch (err) {
        console.log(err);
    }
}

export async function getAllReportsController(req, res){
    
    const allReports = await interviewReportModel.find({ user: req.user.id }).sort({createdAT:-1}).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if (allReports.length === 0) {
        return res.status(200).json({
            message:"No reports found!"
        })
    }
    return res.status(200).json({
        message: "Reports fetched successfully!",
        allReports
    })
}

export async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message:"Interview report not found!"
        })
    }

    const pdfBuffer=await ai.generateResumePdf({
        resume: interviewReport.resume,
        selfDescription: interviewReport.selfDescription,
        jobDescription:interviewReport.jobDescription
    })

    
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer);
}