/* Initialise the swagger architecture */
const swaggerOptions = {
    info:{
        title:'Card API Documentation',
        contact: {
            name: "Haider Ali",
            email: "haidar.ali030492@gmail.com"
        },
        version: "1.0.0"
    },
    schemes: ['http','https'],
    produces: [
        "application/json"
    ],
}
/* Swagger response messages and status code */
const SWAGGER_DEFAULT_RESPONSE_MESSAGES = [
	{ code: 200, message: "OK" },
	{ code: 400, message: "Bad Request" },
	{ code: 401, message: "Unauthorized" },
	{ code: 404, message: "Data Not Found" },
	{ code: 500, message: "Internal Server Error" }
];
/* Credit card validation with luhn Algorithm */
const validCreditCard = (value) => {
    try {
      let nCheck = 0, bEven = false;
      value = value.replace(/\D/g, "");
  
      for (var n = value.length - 1; n >= 0; n--) {
          var cDigit = value.charAt(n),
                  nDigit = parseInt(cDigit, 10);
  
          if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
  
          nCheck += nDigit;
          bEven = !bEven;
      }
      console.log('nCheck', nCheck)
      return (nCheck % 10) == 0;
    } catch (error) {
      console.error(error)
    }
}

/* Validation error handling */
const failActionFunction = async(request, h, error) => {
    try {
        let customErrorMessage;
        if (error.name === "ValidationError") {
            let feild = error.details[0].message.split(" ")[0]
            if(feild.replace(/"/g, "") === "cardNumber") {
                customErrorMessage = {
                    statusCode: 400,
                    message:feild.replace(/"/g, "")+ " length should be 13 to 19",
                    type: error.name
                };
            } else {
                customErrorMessage = {
                    statusCode: 400,
                    message: error.details[0].message.charAt(1).toUpperCase() + error.details[0].message.slice(2),
                    type: error.name
                };
            }
        } else {
            customErrorMessage = {
                statusCode: 400,
                message: error.output.payload.message,
                type: error.name
            };
        }
        
        customErrorMessage.message = customErrorMessage.message.replace(/"/g, "");
        customErrorMessage.message = customErrorMessage.message.replace("[", "");
        customErrorMessage.message = customErrorMessage.message.replace("]", "");
        var err = new Error();
        let errorToSend = Boom.boomify(err, { statusCode: error.statusCode });
        errorToSend.output.statusCode = 200;
        errorToSend.output.payload = {
            ...customErrorMessage,
            time: new Date().getTime()
        };
        return errorToSend;
    } catch (error) {
        return {statusCode: 404, message: "Bad Request"}
    }
};

exports.appUtils = {
    validCreditCard: validCreditCard,
    failActionFunction: failActionFunction,
    SWAGGER_DEFAULT_RESPONSE_MESSAGES: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
    swaggerOptions: swaggerOptions
}