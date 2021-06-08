import ENDPOINTS from '../common/endpoints';
import alive from './alive';
import user from './user';

const loadRouters = (app) => {
  app.use(ENDPOINTS.alive.path, alive);
  app.use(ENDPOINTS.user.path, user);
};

export default loadRouters;
