module.exports = (plugin) => {
    plugin.controllers.user.updateMe = async (ctx) => {
        if (!ctx.state.user || !ctx.state.user.id) {
            return ctx.response.status = 401;
        }

        console.log('ctx.request.body:', ctx.request.body);
        // Extract only the fields that need to be updated from the request body
        const updatedUserData = {
            address1: ctx.request.body.address1 || ctx.state.user.address1,
            address2: ctx.request.body.address2 || ctx.state.user.address2,
            companyName: ctx.request.body.companyName || ctx.state.user.companyName,
            city: ctx.request.body.city || ctx.state.user.city,
            state: ctx.request.body.state || ctx.state.user.state,
            zipCode: ctx.request.body.zipCode || ctx.state.user.zipCode,
            country: ctx.request.body.country || ctx.state.user.country,
            // change the above code to reflect the fields you want the user to be able to update.
        };

        try {
            // Update the user data in the database
            await strapi.query('plugin::users-permissions.user').update({
                where: { id: ctx.state.user.id },
                data: updatedUserData,
            });
            ctx.response.status = 200;
        } catch (error) {
            console.error('Error updating user data:', error);
            ctx.response.status = 500;
        }
    };
    plugin.routes['content-api'].routes.push(
        {
            method: "PUT",
            path: "/user/me",
            handler: "user.updateMe",
            config: {
                prefix: "",
                policies: []
            }
        });
    return plugin;
}