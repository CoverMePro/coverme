export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
  role?: string;
  companyId?: string;
  isOwner?: boolean;
  vacationHours?: number;
  seniorityDate?: Date;
  location?: string;
}
