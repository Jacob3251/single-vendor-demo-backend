import { Request, Response, NextFunction } from "express";
import { UserServices } from "./user.service";

/**
 * Handles the synchronization of a Firebase user with the local database.
 * This is typically called after a user signs up or logs in for the first time.
 */
const sync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore - The authMiddleware attaches firebaseUser to the request
    const firebaseUID = req.firebaseUser?.uid;
    if (!firebaseUID) {
      console.error("Auth middleware did not attach user to the request.");
      return res.status(500).json({
          success: false,
          error: { message: "User authentication data not found in request." },
        });
    }

    const { email, name, profileData } = req.body;
    const payload = { firebaseUID, email, name, profileData };
    
    const result = await UserServices.syncUser(payload);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { message: "User synchronization failed: user not found." },
      });
    }
    const plainUser = result.toJSON ? result.toJSON() : result;

    res.status(200).json({
      success: true,
      message: "User synchronized successfully",
      data: plainUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a paginated and searchable list of all users (Admin only).
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = {
      searchTerm: req.query.search as string | undefined,
      userType: req.query.userType as "ADMIN" | "SEO" | "GUEST" | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };
    const result = await UserServices.getAllUsers(options);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the role of a specific user (Admin only).
 */
const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ success: false, error: { message: "Invalid or missing userId parameter." } });
    }
    const result = await UserServices.updateUserRole(userId, userType);
    res
      .status(200)
      .json({ success: true, message: "User role updated.", data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a user from both the local database and Firebase (Admin only).
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ success: false, error: { message: "Invalid or missing userId parameter." } });
    }
    await UserServices.deleteUser(userId);
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};


/**
 * Gets the profile of the currently authenticated user.
 */
const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.firebaseUser?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: "Unauthorized: No user ID found in token." } });
    }

    const user = await UserServices.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: "User not found in database." } });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets the profile of a specific user by their ID (Admin only).
 * Used for the 'View Profile' button in the user management table.
 */
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ success: false, error: { message: "Invalid or missing userId parameter." } });
      }
      const user = await UserServices.getUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: { message: "User not found." } });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
};

export const UserControllers = {
  sync,
  getAll,
  updateUserRole,
  deleteUser,
  getMe,
  getUserById, // Exporting the new controller
};

