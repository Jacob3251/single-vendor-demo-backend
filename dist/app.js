"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Remove this line: import cors from "cors";
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const index_1 = __importDefault(require("./app/modules/index"));
const app = (0, express_1.default)();
// Manual CORS middleware (replaces cors package)
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://afrowhite.com',
        'https://www.afrowhite.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4173',
        'http://127.0.0.1:5173'
    ];
    const origin = req.headers.origin;
    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, x-stripe-signature');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
// Stripe webhook route with raw body parsing (before JSON parsing)
app.use('/api/v1/payments/webhook', express_1.default.raw({ type: 'application/json' }));
// Apply JSON parsing to all other routes
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payments/webhook') {
        // Skip JSON parsing for webhook - it already has raw body middleware above
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use(express_1.default.urlencoded({ extended: true }));
// Use the main router for all API routes
app.use("/api/v1", index_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        Message: "E-commerce Backend is Running",
    });
});
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map