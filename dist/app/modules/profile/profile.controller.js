"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileControllers = void 0;
const profile_service_1 = require("./profile.service");
const profile_validation_1 = require("./profile.validation");
/**
 * Controller to get the profile of the currently authenticated user.
 */
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.firebaseUser?.uid;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized: No user ID found in token." },
            });
        }
        const profile = await profile_service_1.ProfileServices.getProfileByUserId(userId);
        if (!profile) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Profile has not been created yet.",
            });
        }
        res.status(200).json({ success: true, data: profile });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to update (or create) the profile of the currently authenticated user.
 */
const updateMyProfile = async (req, res, next) => {
    try {
        const userId = req.firebaseUser?.uid;
        const userEmail = req.firebaseUser?.email;
        if (!userId || !userEmail) {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized: No user ID or email found in token." },
            });
        }
        const validatedData = profile_validation_1.updateProfileValidationSchema.parse(req.body);
        // Add email to validatedData to match ProfileData type
        const profileData = { ...validatedData, email: userEmail };
        const profile = await profile_service_1.ProfileServices.updateOrCreateProfile(userId, profileData, userEmail);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller for an admin to update any user's profile by their ID.
 */
const updateUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const validatedData = profile_validation_1.updateProfileValidationSchema.parse(req.body);
        const profile = await profile_service_1.ProfileServices.updateProfileByUserId(userId, validatedData);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully by admin.",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.ProfileControllers = {
    getMyProfile,
    updateMyProfile,
    updateUserProfile,
};
//# sourceMappingURL=profile.controller.js.map