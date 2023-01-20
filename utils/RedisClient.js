let redis = require('redis')
let config = {
    PORT: 6379, 
    SERVER: "localhost",
    SET: "card_details"
 }

var clinet;
class RedisClient {
    init() {
        clinet = redis.createClient(config.PORT, config.SERVER, { disable_resubscribing: true });
          clinet.on("ready", function () {
            console.log("Redis is ready");
        });
    
        clinet.on("error", function (error) {
            console.log("Redis is ready", error);
            console.log("Error in Redis");
        });
    }
    storeList(value) {
        return clinet.rpush(config.SET, value, function (error, reply) {
            if (error) {
                console.log(error);
            }
            return reply;
        });
    }
    getList() {
        return new Promise(function (resolve, reject) {
            clinet.lrange(config.SET, 0, -1, function (error, items) {
                if (error) {
                    console.log(error);
                }
                let entries = [];
                items.forEach((item) => {
                    entries.push(JSON.parse(item));
                });
                resolve(entries);
            });
        });
    }
}


exports.RedisClient = RedisClient;
exports.redisClient = new RedisClient();