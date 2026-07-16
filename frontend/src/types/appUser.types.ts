import type { RegisterInput } from "./auth.types";

export interface AppUserPublic {
  id: string;
  pseudo: string;
  email: string;
  pictureUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export type UpdateAppUserInput = Partial<RegisterInput>;
