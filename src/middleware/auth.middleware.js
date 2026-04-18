import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import tokenBlackListModel from '../models/blacklist.model.js';
import config from '../config/config.js'

async function authMiddleware(req, res,next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message:"Token not provided"
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const isBlackListed = await tokenBlackListModel.findOne({ token });

        if (isBlackListed) {
            return res.status(403).json({
                message:"Token is invalid"
            })
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}
export default authMiddleware;