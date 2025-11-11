import { pgTable, uuid, varchar, date, timestamp, index } from "drizzle-orm/pg-core";
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
});

export const Operator = pgTable("operators", {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id").notNull().references(() => Person.id),
    code: varchar("code", { length: 11 }).notNull().unique().$defaultFn(() => GenerateOperatorCode()),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
}, (table) => [
    index("code_idx").on(table.code)
]);

export const ProductCategory = pgTable("product_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull().unique(),
});

export const Product = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").notNull().references(() => ProductCategory.id),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    unitType: varchar("unit_type", { length: 128 }).notNull(),
    costPrice: varchar("cost_price", { length: 64 }).notNull(),
    sellPrice: varchar("sell_price", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const Inventory = pgTable("inventories", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => Product.id),
    quantity: varchar("quantity", { length: 64 }).notNull(),
    reorderLevel: varchar("reorder_level", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});