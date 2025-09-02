import express from "express";
import dashboardDB from "../services/dashboard.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/resumen",
  asyncHandler(async (req, res) => {
    try {
      const resumen = await dashboardDB.getDashboardCounts();
      res.status(200).json(resumen);
    } catch (error) {
      console.error("Error al obtener resumen del dashboard:", error);
      res.status(500).json({ error: "Error al obtener datos del dashboard" });
    }
  })
);

export default router;
