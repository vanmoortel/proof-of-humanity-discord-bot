const ENDPOINTS = {
  alive: {
    path: '/alive',
    endpoints: {
      getAlive: {
        path: '/',
      },
    },
  },
  user: {
    path: '/user',
    endpoints: {
      putUser: {
        path: '/',
      },
    },
  },
};

export default ENDPOINTS;
