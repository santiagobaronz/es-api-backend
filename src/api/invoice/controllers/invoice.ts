/**
 * invoice controller
 */

import { factories } from '@strapi/strapi'
import { testingTemplate } from '../../../templates/testing';
import { invoicePDF } from '../../../templates/invoicePDF';
import { paymentConfirmationPDF } from '../../../templates/paymentConfirmationPDF';

export default factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
    async myInvoices(ctx) {

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        try {
            const response = await strapi.db.query('api::invoice.invoice').findMany({
                where: {
                    customer: ctx.state.user.id
                }, populate: ['invoiceDetails']
            });

            if (!response) {
                return ctx.notFound('Facturas no encontradas');
            }

            return response;

        } catch (err) {
            return err;
        }
    },

    async getSelectedInvoice(ctx) {
        if (!ctx.state.user || !ctx.state.user.id) {
            return (ctx.response.status = 401);
        }

        try {
            const response = await strapi.db.query('api::invoice.invoice').findOne({
                where: {
                    customer: ctx.state.user.id,
                    invoiceNumber: ctx.request.body.invoiceNumber
                },
                populate: {
                    invoiceDetails: true,
                    customer: {
                        select: ['email', 'userDocumentID', 'phoneNumber', 'companyName', 'address1', 'city', 'state', 'zipCode', 'country', 'firstName', 'lastName', 'documentType']
                    }
                }
            });

            if (!response) {
                return ctx.notFound('La factura que buscas no pudo ser encontrada');
            }

            return response;

        } catch (err) {
            return err;
        }
    },

    async sendPDF(ctx) {
        const { files } = ctx.request;
        const { invoiceInformation } = ctx.request.body;

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        const finalInvoice = JSON.parse(invoiceInformation);

        if (!files || !files.file) {
            return ctx.badRequest('No file uploaded.');
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return ctx.badRequest('No valid file found.');
        }

        const info = await strapi.plugins['email'].services.email.send({
            to: finalInvoice.customer.email,
            from: '"Facturación Espectrosoft" <info@espectrosoft.com>',
            subject: `Llegó tu factura de Espectrosoft`,
            html: invoicePDF(finalInvoice.customer.firstName, finalInvoice.invoiceNumber),
            attachments: [
                {
                    filename: file.originalFilename,
                    path: file.filepath,
                }
            ],
        });

        return ctx.send({ success: true });
    },

    async authorizeInvoice(ctx) {
        const { invoiceNumber, paymentMethod } = ctx.request.body;

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        try {
            const response = await strapi.db.query('api::invoice.invoice').update({
                where: {
                    customer: ctx.state.user.id,
                    invoiceNumber: invoiceNumber
                },
                data: {
                    invoiceStatus: 'Paid',
                    paymentMethod: paymentMethod,
                    paidAt: new Date(),
                }, populate: {
                    invoiceDetails: true,
                    customer: {
                        select: ['email', 'userDocumentID', 'phoneNumber', 'companyName', 'address1', 'city', 'state', 'zipCode', 'country', 'firstName', 'lastName', 'documentType']
                    }
                }
            });

            if (!response) {
                return ctx.notFound('La factura a modificar no fue encontrada');
            }

            return response;

        } catch (err) {
            return err;
        }
    }, async sendPaymentConfirmation(ctx) {

        const { files } = ctx.request;
        const { invoiceInformation } = ctx.request.body;

        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        const invoiceData = JSON.parse(invoiceInformation);

        if (!files || !files.file) {
            return ctx.badRequest('No file uploaded.');
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return ctx.badRequest('No valid file found.');
        }

        const info = await strapi.plugins['email'].services.email.send({
            to: ctx.state.user.email,
            from: '"Facturación Espectrosoft" <info@espectrosoft.com>',
            subject: `Recibimos el pago de tu factura`,
            html: paymentConfirmationPDF(ctx.state.user.firstName, invoiceData.invoiceNumber),
            attachments: [
                {
                    filename: file.originalFilename,
                    path: file.filepath,
                }
            ],
        });

        return ctx.send({ success: true });
    }
}));
