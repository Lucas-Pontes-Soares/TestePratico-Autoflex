ALTER TABLE "products_materials" RENAME COLUMN "user_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "user_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "raw_materials" RENAME COLUMN "user_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "products_materials" DROP CONSTRAINT "products_materials_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "raw_materials" DROP CONSTRAINT "raw_materials_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products_materials" ADD COLUMN "updated_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "raw_materials" ADD COLUMN "updated_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products_materials" ADD CONSTRAINT "products_materials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_materials" ADD CONSTRAINT "products_materials_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_materials" ADD CONSTRAINT "raw_materials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_materials" ADD CONSTRAINT "raw_materials_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;