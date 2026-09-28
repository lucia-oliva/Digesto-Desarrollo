import express from "express";
import dashboardDB from "../services/dashboard.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/resumen",
  asyncHandler(async (req, res) => {
    const resumen = await dashboardDB.getDashboardCounts();
    return res.status(200).json(resumen);
  }),
);

export default router;