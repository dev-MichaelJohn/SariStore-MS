import { Router } from "express";
import InventoryController from "../controllers/inventory.controller";

const InventoryRouter = Router();

InventoryRouter.get("/");
InventoryRouter.get("/:id", InventoryController.GetInventoryById)
