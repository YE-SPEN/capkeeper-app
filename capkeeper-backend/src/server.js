import path from 'path';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import routes from './routes/index.js';
import { db } from './database.js';
import fs from 'fs';
import admin from 'firebase-admin';

// Log to verify that the script is running
console.log('Starting server initialization...');

// Resolve the credentials path and read the credentials file
const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
console.log(`Resolved credentials path: ${credentialsPath}`);

const credentials = JSON.parse(fs.readFileSync(credentialsPath));
console.log('Credentials loaded successfully');

// Initialize Firebase admin
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});
console.log('Firebase admin initialized');

const distDir = fs.existsSync('./dist') ? './dist' : '../dist/capkeeper-app';

let server;

const start = async () => {
    server = Hapi.server({
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        routes: {
            cors: true
        }
    });

    console.log('Server configuration set');

    // Log each route being registered
    routes.forEach(route => {
        if (route.method && route.path) {
            server.route(route);
            console.log('Registered route: ', route);
        } else {
            console.error('Invalid route object:', route);
        }
    });

    await server.register(Inert);
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler:  {
            directory: {
                path: `${distDir}/capkeeper-app`,
                index: ['index.html'],
                redirectToSlash: true
            }
        }
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (fs.existsSync(distDir)) {
        }
        if (response.isBoom && response.output.statusCode === 404) {
            try {
                return h.file(`${distDir}/capkeeper-app/index.html`, {
                    confine: false
                });
            } catch (e) {
                console.log(e);
            }
        }
        return h.continue;
    });

    try {
        await db.connect();

        await server.start();
        console.log(`Server is listening on ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection:', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');

    try {
        await server.stop({ timeout: 10000 });
        await db.end(); 
        console.log('Server stopped');
    } catch (err) {
        console.error('Error stopping server:', err);
    }

    process.exit(0);
});

// Start the server
start();
console.log('Server initialization script complete');

server.events.on('response', (request) => {
    console.log(`Request received: ${request.method.toUpperCase()} ${request.path} - Status: ${request.response.statusCode}`);
});
