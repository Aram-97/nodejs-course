import express from "express";
import AppRoutes from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { PORT } from "./env";

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

app.use(AppRoutes);
app.use(errorHandler);
