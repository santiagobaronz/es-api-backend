module.exports = {
    getContractedServicesByUser: async (ctx) => {

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        try {
            const response = await strapi.db.query('api::contracted-service.contracted-service').findMany({
                where:{
                    customer: ctx.state.user.id
                }, populate: ['service']
            });

            if (!response) {
                return ctx.notFound('Servicios contratados no encontrados');
            }

            return response;

        } catch (err) {
            return err;
        }
    },

    getContractedServiceByID: async (ctx) => {

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        try {
            const response = await strapi.db.query('api::contracted-service.contracted-service').findOne({
                where:{
                    customer: ctx.state.user.id,
                    id: ctx.request.body.contractedServiceID
                }, populate: ['service']
            });

            if (!response) {
                return ctx.notFound('Servicio contratado no encontrado');
            }

            return response;

        } catch (err) {
            return err;
        }
    }
};