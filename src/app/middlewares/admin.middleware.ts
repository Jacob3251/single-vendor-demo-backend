import { Request, Response, NextFunction } from 'express';

// This middleware should be used AFTER the standard authMiddleware
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // authMiddleware should have already attached the user object
  const user = req.user;

  if (!user || user.get('userType') !== 'ADMIN') {
    return res.status(403).send({ success: false, message: 'Forbidden: Access is restricted to administrators.' });
  }
  
  // If the user is an admin, proceed to the next handler
  next();
};

