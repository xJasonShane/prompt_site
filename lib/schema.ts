import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const images = sqliteTable("images", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const metadata = sqliteTable("metadata", {
  id: text("id").primaryKey(),
  imageId: text("image_id").notNull().references(() => images.id),
  positivePrompt: text("positive_prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  model: text("model").notNull(),
  version: text("version"),
  steps: integer("steps").notNull(),
  cfg: integer("cfg").notNull(),
  seed: integer("seed").notNull(),
  sampler: text("sampler").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const loras = sqliteTable("loras", {
  id: text("id").primaryKey(),
  metadataId: text("metadata_id").notNull().references(() => metadata.id),
  name: text("name").notNull(),
  weight: integer("weight").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  images: many(images),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
  metadata: one(metadata, {
    fields: [images.id],
    references: [metadata.imageId],
  }),
}));

export const metadataRelations = relations(metadata, ({ one, many }) => ({
  image: one(images, {
    fields: [metadata.imageId],
    references: [images.id],
  }),
  loras: many(loras),
}));

export const lorasRelations = relations(loras, ({ one }) => ({
  metadata: one(metadata, {
    fields: [loras.metadataId],
    references: [metadata.id],
  }),
}));
