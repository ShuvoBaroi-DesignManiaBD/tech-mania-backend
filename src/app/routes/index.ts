import { Router } from 'express';
import { authRoutes } from '../module/Auth/auth.route';
import { userRoutes } from '../module/User/user.route';
import { postRoutes } from '../module/Post/post.route';
import { commentRoutes } from '../module/Comment/comment.route';
import { voteRoutes } from '../module/Vote/vote.route';
import { statisticsRoutes } from '../module/Statistics/statistics.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/votes',
    route: voteRoutes,
  },
  {
    path: '/comments',
    route: commentRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/statistics',
    route: statisticsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route)); // This will automatically loop routes that added in the moduleRoutes array

export default router;
