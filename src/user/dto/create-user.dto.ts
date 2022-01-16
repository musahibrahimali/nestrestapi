
export class CreateUserDto{
    socialId?: string;
    username: string;
    password?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    salt?: string;
    phone?: string;
    address?: string;
    city?: string;
    profilePicture?: string;
    roles: string[];
    isAdmin: boolean;
}