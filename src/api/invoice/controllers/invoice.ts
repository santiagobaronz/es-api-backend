/**
 * invoice controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
    async myInvoices(ctx) {

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        try {
            const response = await strapi.db.query('api::invoice.invoice').findMany({
                where: {
                    customer: ctx.state.user.id
                }
            });

            if (!response) {
                return ctx.notFound('Facturas no encontrados');
            }

            return response;

        } catch (err) {
            return err;
        }
    }
}));
