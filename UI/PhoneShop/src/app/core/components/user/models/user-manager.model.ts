import { Role } from "../../role/models/role.model";

export interface UserManager{
    id: string;
    email: string;
    userName: string;
    lastLogin: string;
    isActive : boolean;
    phoneNumber: string;
    roles: Role[];
}