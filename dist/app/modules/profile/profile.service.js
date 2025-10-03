"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileServices = void 0;
const profile_model_1 = __importDefault(require("./profile.model"));
/**
 * Retrieves a user's profile by their user ID (Firebase UID).
 */
const getProfileByUserId = async (userId) => {
    const profile = await profile_model_1.default.findOne({ where: { userId } });
    return profile;
};
/**
 * Updates an existing profile or creates a new one if it doesn't exist.
 * This function is now transaction-aware and handles guest/manual profiles (where userId is null).
 */
const updateOrCreateProfile = async (userId, profileData, userEmail, transaction) => {
    console.log(`Creating/updating profile for userId: ${userId}, email: ${userEmail}`);
    // Use email to find the profile if userId is null (for manual orders)
    const whereClause = userId ? { userId } : { email: userEmail };
    let profile = await profile_model_1.default.findOne({ where: whereClause, transaction });
    // Determine if the profile is "complete" based on required fields
    const isComplete = !!(profileData.firstName &&
        profileData.lastName &&
        profileData.phoneNumber &&
        profileData.addressLine1 &&
        profileData.city &&
        profileData.postalCode);
    if (profile) {
        console.log(` -> Profile exists, updating...`);
        // If the profile exists, update it
        await profile.update({
            ...profileData,
            isComplete,
            // Ensure userId is set if it wasn't before
            userId: userId || profile.get('userId')
        }, { transaction });
        console.log(` -> Profile updated successfully`);
    }
    else {
        console.log(` -> Profile doesn't exist, creating new one...`);
        // If no profile exists, create a new one
        profile = await profile_model_1.default.create({
            userId, // Can be null for manual orders
            ...profileData,
            email: userEmail, // Ensure email is set (overwrites profileData.email if present)
            isComplete,
        }, { transaction });
        console.log(` -> New profile created successfully`);
    }
    return profile;
};
/**
 * Updates a profile by userId. Intended for admin use.
 */
const updateProfileByUserId = async (userId, profileData) => {
    const profile = await profile_model_1.default.findOne({ where: { userId } });
    if (!profile) {
        throw new Error('Profile not found for this user.');
    }
    // Determine if the profile is now complete based on the incoming data and existing data
    const isComplete = !!((profileData.firstName || profile.get('firstName')) &&
        (profileData.lastName || profile.get('lastName')) &&
        (profileData.phoneNumber || profile.get('phoneNumber')) &&
        (profileData.addressLine1 || profile.get('addressLine1')) &&
        (profileData.city || profile.get('city')) &&
        (profileData.postalCode || profile.get('postalCode')));
    await profile.update({ ...profileData, isComplete });
    return profile;
};
exports.ProfileServices = {
    getProfileByUserId,
    updateOrCreateProfile,
    updateProfileByUserId,
};
//# sourceMappingURL=profile.service.js.map