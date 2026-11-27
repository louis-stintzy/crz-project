import multer from 'multer';

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024;

export const uploadProfilePicture = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PROFILE_PICTURE_SIZE,
    files: 1,
  },
}).single('picture');
