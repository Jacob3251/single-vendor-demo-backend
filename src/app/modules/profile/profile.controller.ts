import { Request, Response, NextFunction } from 'express';
import { ProfileServices } from './profile.service';
import { updateProfileValidationSchema,UpdateProfileDto } from './profile.validation';

/**
 * Controller to get the profile of the currently authenticated user.
 */
const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.firebaseUser?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized: No user ID found in token." },
      });
    }

    const profile = await ProfileServices.getProfileByUserId(userId);

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Profile has not been created yet.",
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
/**
 * Controller to update (or create) the profile of the currently authenticated user.
 */
const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.firebaseUser?.uid;
    const userEmail = req.firebaseUser?.email;

    if (!userId || !userEmail) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized: No user ID or email found in token." },
      });
    }

   const validatedData: UpdateProfileDto = updateProfileValidationSchema.parse(req.body);

    // Add email to validatedData to match ProfileData type
    const profileData = { ...validatedData, email: userEmail };

    const profile = await ProfileServices.updateOrCreateProfile(userId, profileData, userEmail);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an admin to update any user's profile by their ID.
 */
const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const validatedData: UpdateProfileDto = updateProfileValidationSchema.parse(req.body);

    const profile = await ProfileServices.updateProfileByUserId(userId as string, validatedData);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully by admin.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const ProfileControllers = {
  getMyProfile,
  updateMyProfile,
  updateUserProfile,
};

