
var Boom = require('boom')
const RedisClient = require("../../utils/RedisClient");
RedisClient.redisClient.init()

/**
 * @function addCard
 * @description save the credit card details, into the redis with 0 balance.
 */
const addCard = async(payload)=>{
    try {
        payload['balance'] = 0
        RedisClient.redisClient.storeList(JSON.stringify(payload))
        return { statusCode: 200, data: payload, message: "Card Added Successfully"}
    } catch (error) {
        return { statusCode: 400, data: {}, message: "Bad Request"}
    }
}

/**
 * @function cardList
 * @description Getting credit card list from the redis.
 */
const cardList = async()=>{
    try {
        let step1 = await RedisClient.redisClient.getList();
        return { statusCode: 200, data: step1, message: "Cards List"}
    } catch (error) {
        return { statusCode: 400, data: {}, message: "Bad Request"}
    }
}
exports.cardController = {
    addCard: addCard,
    cardList: cardList
}


