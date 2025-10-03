import Profile from './profile.model';
import { Transaction as SequelizeTransaction } from "sequelize";

// Interface for the data needed to create/update a profile.
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode: string;
  county?: string | null;
}

/**
 * Retrieves a user's profile by their user ID (Firebase UID).
 */
const getProfileByUserId = async (userId: string) => {
  const profile = await Profile.findOne({ where: { userId } });
  return profile;
};

/**
 * Updates an existing profile or creates a new one if it doesn't exist.
 * This function is now transaction-aware and handles guest/manual profiles (where userId is null).
 */
const updateOrCreateProfile = async (
  userId: string | null,
  profileData: ProfileData,
  userEmail: string,
  transaction?: SequelizeTransaction
) => {
  console.log(`Creating/updating profile for userId: ${userId}, email: ${userEmail}`);
  
  // Use email to find the profile if userId is null (for manual orders)
  const whereClause = userId ? { userId } : { email: userEmail };
  let profile = await Profile.findOne({ where: whereClause, transaction });

  // Determine if the profile is "complete" based on required fields
  const isComplete = !!(
    profileData.firstName &&
    profileData.lastName &&
    profileData.phoneNumber &&
    profileData.addressLine1 &&
    profileData.city &&
    profileData.postalCode
  );

  

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
  } else {
    console.log(` -> Profile doesn't exist, creating new one...`);
    // If no profile exists, create a new one
    profile = await Profile.create(
      {
        userId, // Can be null for manual orders
        ...profileData,
        email: userEmail, // Ensure email is set (overwrites profileData.email if present)
        isComplete,
      },
      { transaction }
    );
    
    console.log(` -> New profile created successfully`);
  }

  return profile;
};

/**
 * Updates a profile by userId. Intended for admin use.
 */
const updateProfileByUserId = async (userId: string, profileData: Partial<ProfileData>) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) {
    throw new Error('Profile not found for this user.');
  }

  // Determine if the profile is now complete based on the incoming data and existing data
  const isComplete = !!(
    (profileData.firstName || profile.get('firstName')) &&
    (profileData.lastName || profile.get('lastName')) &&
    (profileData.phoneNumber || profile.get('phoneNumber')) &&
    (profileData.addressLine1 || profile.get('addressLine1')) &&
    (profileData.city || profile.get('city')) &&
    (profileData.postalCode || profile.get('postalCode'))
  );

  await profile.update({ ...profileData, isComplete });
  return profile;
};

export const ProfileServices = {
  getProfileByUserId,
  updateOrCreateProfile,
  updateProfileByUserId,
};