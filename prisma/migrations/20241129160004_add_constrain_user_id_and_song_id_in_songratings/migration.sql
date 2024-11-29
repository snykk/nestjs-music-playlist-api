/*
  Warnings:

  - A unique constraint covering the columns `[userId,songId]` on the table `song_ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "song_ratings_userId_songId_key" ON "song_ratings"("userId", "songId");
