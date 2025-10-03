"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
// This middleware should be used AFTER the standard authMiddleware
const adminMiddleware = (req, res, next) => {
    // authMiddleware should have already attached the user object
    const user = req.user;
    if (!user || user.get('userType') !== 'ADMIN') {
        return res.status(403).send({ success: false, message: 'Forbidden: Access is restricted to administrators.' });
    }
    // If the user is an admin, proceed to the next handler
    next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=admin.middleware.js.map