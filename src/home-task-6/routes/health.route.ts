import { Router } from "express";

const router = Router();

router.get("/health", async (req, res, next) => {
  res.status(200).json({
    message: "Application is healthy",
  });
});

export default router;
