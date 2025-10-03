import Profile from './profile.model';
import { Transaction as SequelizeTransaction } from "sequelize";
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
export declare const ProfileServices: {
    getProfileByUserId: (userId: string) => Promise<Profile | null>;
    updateOrCreateProfile: (userId: string | null, profileData: ProfileData, userEmail: string, transaction?: SequelizeTransaction) => Promise<Profile>;
    updateProfileByUserId: (userId: string, profileData: Partial<ProfileData>) => Promise<Profile>;
};
export {};
//# sourceMappingURL=profile.service.d.ts.map