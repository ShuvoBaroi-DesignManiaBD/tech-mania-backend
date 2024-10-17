export type TSignInData = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  email: string;
  id?: string;
  role: string;
};
