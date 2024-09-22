module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/contracted-services-client/',
      handler: 'contracted-service-client.getContractedServicesByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/contracted-service-client/',
      handler: 'contracted-service-client.getContractedServiceByID',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};