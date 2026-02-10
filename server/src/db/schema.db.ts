import { pgTable, uuid, varchar, date, timestamp, index, real, integer } from "drizzle-orm/pg-core";
import { GenerateOperatorCode } from "../lib/operator.lib";

export const Person = pgTable("persons", {
    id: uuid("id").primaryKey().defaultRandom(),
    birthdate: date("birthdate", {mode: "date"}).notNull(),
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    middleName: varchar("middle_name", { length: 256 }),
    suffix: varchar("suffix", { length: 256 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
});

export const Operator = pgTable("operators", {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id").notNull().references(() => Person.id),
    code: varchar("code", { length: 11 }).notNull().unique().$defaultFn(() => GenerateOperatorCode()),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    index("code_idx").on(table.code),
]);

export const ProductCategory = pgTable("product_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    description: varchar("name", { length: 256 }).notNull(),
}, (table) => [
    index("product_category_name_idx").on(table.name),
]);

export const Product = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").notNull().references(() => ProductCategory.id),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    unitType: varchar("unit_type", { length: 128 }).notNull(),
    costPrice: real("cost_price").notNull(),
    sellPrice: real("sell_price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    index("category_id_idx").on(table.categoryId),
    index("name_idx").on(table.name),
]);

export const Inventory = pgTable("inventories", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => Product.id),
    quantity: integer("quantity").notNull(),
    reorderLevel: integer("reorder_level").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    index("inventory_product_id_idx").on(table.productId),
]);
