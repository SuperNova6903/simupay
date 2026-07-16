-- Store a hash of the active refresh token so it can be rotated and revoked.
ALTER TABLE "User" ADD COLUMN "refreshToken" TEXT;
