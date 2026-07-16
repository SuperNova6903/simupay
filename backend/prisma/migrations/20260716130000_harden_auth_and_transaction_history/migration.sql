-- Make the stored value's purpose explicit and support the transaction-history query.
ALTER TABLE "User" RENAME COLUMN "refreshToken" TO "hashedRefreshToken";

CREATE INDEX "Transaction_senderId_createdAt_idx" ON "Transaction"("senderId", "createdAt");
CREATE INDEX "Transaction_receiverId_createdAt_idx" ON "Transaction"("receiverId", "createdAt");
