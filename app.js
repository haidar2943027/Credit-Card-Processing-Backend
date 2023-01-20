'use strict';
require('dotenv').config();

const Inert = require('inert');
const Vision = require('vision');

const HapiSwagger = require('hapi-swagger');

const server = require('./config/server');
const baseRouter = require('./routes');
const { appUtils } = require('./utils/appUtils');


const init = async () => {

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: appUtils.swaggerOptions
        }
    ])

    await server.register(baseRouter, {
		routes:{
			prefix:'/api'
		}
	});

    server.events.on('response', function (request) {
        console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();