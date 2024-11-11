-- CreateTable
CREATE TABLE "AirstrikePost" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "placename" TEXT NOT NULL,
    "posture" TEXT NOT NULL,
    "charege" INTEGER NOT NULL,
    "bounce" INTEGER NOT NULL,
    "throw" TEXT NOT NULL,
    "standingPositionImage" TEXT NOT NULL,
    "landmarkImage" TEXT NOT NULL,
    "favorite" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AirstrikePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AirstrikeFavoriteManager" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "AirstrikeFavoriteManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "AirstrikePost" ADD CONSTRAINT "AirstrikePost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirstrikeFavoriteManager" ADD CONSTRAINT "AirstrikeFavoriteManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirstrikeFavoriteManager" ADD CONSTRAINT "AirstrikeFavoriteManager_postId_fkey" FOREIGN KEY ("postId") REFERENCES "AirstrikePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
