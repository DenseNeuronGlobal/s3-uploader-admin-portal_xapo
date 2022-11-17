export interface IUser {
  username: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
}

export interface IUserSimple {
  Username: string;
  name: string;
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

export interface IAttribute {
  Name: string;
  Value: string;
}

export interface IUsersResponse extends IUserSimple {
  Attributes: IAttribute[];
}

export interface IUserResponse extends IUserSimple {
  UserAttributes: IAttribute[];
}

export interface IUserIdentity {
  identityId: string;
  username: string;
}