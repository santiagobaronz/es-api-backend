export default {
    routes: [
        {
            method: 'GET',
            path: '/invoices/me',
            handler: 'api::invoice.invoice.myInvoices',
        }
    ]
}