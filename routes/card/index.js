const Joi = require('joi');
const { cardController } = require('../../controllers/cards');
const { appUtils } = require('../../utils/appUtils');
const router = [
    {
    path:'/add_card',
    method:'POST',
    options:{
         handler: async (request, h) => {
            try {
                if(appUtils.validCreditCard(request.payload.cardNumber)) {
                    let result = await cardController.addCard(request.payload)
                    return result
                } else {
                    return { statusCode: 404, data:[], message: 'Card validation failed'}
                }
            } catch (error) {
                return { statusCode: 400, data: error, message: 'Bad Request'}
            }
        },
        description:"Add card details",
        notes:'Add Card Details',
        tags:['api'],
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                cardNumber: Joi.string().min(13).max(19).required(),
                limit: Joi.number().required()
            }),
            failAction: appUtils.failActionFunction
        },
        plugins: {
            "hapi-swagger": {
                responseMessages: appUtils.SWAGGER_DEFAULT_RESPONSE_MESSAGES
            }
        }
     }
}, {
    path: '/cards_list',
    method: 'GET',
    options: {
        handler: async (request, h) => {
            try {
                let result = await cardController.cardList()
                return result
            } catch (error) {
                return { statusCode: 400, data: error, message: 'Bad Request'}
            }
        },
        description:"Card list",
        notes:'Card List',
        tags:['api']
    }
}
]

module.exports = router;
