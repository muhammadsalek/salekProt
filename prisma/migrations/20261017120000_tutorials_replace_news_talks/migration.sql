-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "youtubeChannelId" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- DropTable
DROP TABLE "NewsItem";

-- DropTable
DROP TABLE "Talk";

-- DropEnum
DROP TYPE "TalkType";

