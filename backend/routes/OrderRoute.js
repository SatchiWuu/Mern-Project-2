import express from "express";
import { newOrder, get, getChartData } from "../controllers/OrderController.js";
import { upload } from "../utils/multer.js";
const router = express.Router();

router.post("/new/order", newOrder);
router.get("/chart", getChartData);
router.get("/", get);


export default router;
