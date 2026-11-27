-- Add a durable reference to the profile picture stored in S3.
-- The legacy picture_url column is kept temporarily
-- until the backend and frontend have been migrated.

BEGIN;

ALTER TABLE app_user
ADD COLUMN IF NOT EXISTS picture_key TEXT;

COMMIT;