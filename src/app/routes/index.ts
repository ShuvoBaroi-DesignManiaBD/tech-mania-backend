import { Router } from "express";
import { authRoutes } from "../module/Auth/auth.route";
import { userRoutes } from "../module/User/user.route";
import { postRoutes } from "../module/Post/post.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes, 
  },
  {
    path: "/posts",
    route: postRoutes, 
  },
  {
    path: "/users",
    route: userRoutes, 
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route)); // This will automatically loop routes that added in the moduleRoutes array

export default router;
