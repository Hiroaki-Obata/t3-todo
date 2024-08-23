ALTER TABLE "post" RENAME TO "todo";--> statement-breakpoint
ALTER TABLE "todo" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "todo" DROP CONSTRAINT "post_created_by_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "completed" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "todo" USING btree ("title");