"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebaseAdmin_1 = __importDefault(require("../../firebase/firebaseAdmin"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware hit for:", req.originalUrl);
    console.log("Auth header:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No auth header or invalid format");
        return res.status(401).send({ success: false, message: 'Unauthorized: No token provided.' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    // Fix 1: Check if idToken exists
    if (!idToken) {
        console.log("No token found after Bearer");
        return res.status(401).send({ success: false, message: 'Unauthorized: No token provided.' });
    }
    try {
        const decodedToken = await firebaseAdmin_1.default.auth().verifyIdToken(idToken);
        console.log("Firebase token verified for UID:", decodedToken.uid);
        // Fix 2: Explicitly handle undefined email
        req.firebaseUser = {
            uid: decodedToken.uid,
            email: typeof decodedToken.email === 'string' ? decodedToken.email : undefined,
        };
        const userFromDb = await user_model_1.default.findByPk(decodedToken.uid);
        console.log("User found in DB:", userFromDb ? "Yes" : "No");
        if (userFromDb) {
            console.log("User type:", userFromDb.get('userType'));
        }
        req.user = userFromDb;
        next();
    }
    catch (error) {
        console.error('Error verifying auth token:', error);
        return res.status(403).send({ success: false, message: 'Forbidden: Invalid token.' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map