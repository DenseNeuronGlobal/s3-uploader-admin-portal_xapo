export interface IUser {
  username: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
}

export interface IUserSimple {
  Username: string;
  email: string;
  email_verified: string;
  Enabled: boolean;
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  UserStatus?: string;
}

export interface IUserAttributes {
  [key: string]: string | boolean | undefined;
}
