import { Router } from "express";
import { authRoutes } from "../module/Auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes, //'here has to set the route module that has to import first'
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route)); // This will automatically loop routes that added in the moduleRoutes array

export default router;
