export default {
    routes: [
        {
            method: 'GET',
            path: '/invoices/me',
            handler: 'api::invoice.invoice.myInvoices',
        },
        {
            method: 'POST',
            path: '/invoices/selected',
            handler: 'api::invoice.invoice.getSelectedInvoice',
        },
        {
            method: 'POST',
            path: '/email/send/invoice',
            handler: 'api::invoice.invoice.sendPDF',
        },
        {
            method: 'POST',
            path: '/invoices/authorize/payment',
            handler: 'api::invoice.invoice.authorizeInvoice',
        },
        {
            method: 'POST',
            path: '/email/send/paymentConfirmation',
            handler: 'api::invoice.invoice.sendPaymentConfirmation',
        }
    ]
}