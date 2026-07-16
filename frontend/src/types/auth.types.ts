export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  pseudo: string;
  email: string;
  password: string;
  pictureUrl?: string | null;
}
