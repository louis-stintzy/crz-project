import { Router } from 'express';
import clothesRoutes from './clothes.routes';
import appUserRoutes from './appUser.routes';
import authRoutes from './auth.routes';

const v1Router = Router();

v1Router.get('/', (_req, res) => {
  res.send('API v1 is working!');
});

// TODO(auth): protect app_user routes before exposing the API publicly.
// Current CRUD routes allow unauthenticated clients to list, update, or delete users.
// DELETE /users/:id is especially sensitive because app_user has cascading relations
// with user-owned resources such as closets, tags, and outfits.
// Planned fix: add JWT authentication middleware and ownership/admin checks.
v1Router.use('/auth', authRoutes);
v1Router.use('/users', appUserRoutes);
v1Router.use('/clothes', clothesRoutes);

export default v1Router;
