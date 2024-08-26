ALTER TYPE "status" ADD VALUE '保留';--> statement-breakpoint
ALTER TABLE "todo" ALTER COLUMN "title" SET NOT NULL;