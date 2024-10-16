/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path"; // Import path module for resolving paths
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(cors({
  origin: ["https://tech-mania.shuvobaroi.com", "http://localhost:3100", "http://localhost:3101", "https://tech-mania.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.options("*", cors());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router); // /api/v1 will prefix all the routes

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Tech Mania API!");
});

app.use(globalErrorHandler); // This is connected with the globalErrorhandler.ts file at the middleware folder.

app.use(notFound); // This is connected with the notFound.ts file at the middleware folder.

export default app;
