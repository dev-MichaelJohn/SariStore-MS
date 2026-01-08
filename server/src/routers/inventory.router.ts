import { Router } from "express";
import InventoryController from "../controllers/inventory.controller";

const InventoryRouter = Router();

InventoryRouter.get("/", InventoryController.GetAllInventories);
InventoryRouter.get("/:id", InventoryController.GetInventoryById);

InventoryRouter.patch("/:id", InventoryController.UpdateInventory);

export default InventoryRouter;
