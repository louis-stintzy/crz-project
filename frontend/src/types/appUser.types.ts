export interface AppUserPublic {
  id: string;
  pseudo: string;
  email: string;
  pictureUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateAppUserInput {
  pseudo?: string;
  email?: string;
  password?: string;
  pictureUrl?: string | null;
}
