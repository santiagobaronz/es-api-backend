'use strict';

module.exports = {
  getContractedServicesByUser: async (ctx) => {
    try {
      const data = await strapi.service("api::contracted-service-client.contracted-service-client").getContractedServicesByUser(ctx);
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Error al encontrar los servicios contratados", { moreDetails: err });
    }
  }, getContractedServiceByID: async (ctx) => {
    try {
      const data = await strapi.service("api::contracted-service-client.contracted-service-client").getContractedServiceByID(ctx);
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Error al encontrar el servicios solicitado", { moreDetails: err });
    }
  }
};