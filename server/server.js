const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const jsonV = require('../package.json');

let app;
let server;

module.exports.start = function () {
    console.log('Starting server...');
    console.log("Lauching FastaOV %s (Running on Node %s)", jsonV.version, process.version);

    app = express();
    server = http.createServer(app);

    const { Server } = require("socket.io");
    const io = new Server(server);

    io.sockets.setMaxListeners(25);

    console.log('Server started');
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    io.on('connection', function (socket) {
        console.log("New socket connection: ID %s with IP %s", socket.id, socket.handshake.address);
        
        socket.on('error', function (err) {
            console.log("Socket error: %s", err);
        });

        socket.on('disconnect', function () {
            console.log("Socket disconnected: ID %s with IP %s", socket.id, socket.handshake.address.address);
        });

        // socket.on('chat_message', function (data) {
        //     console.log("Message received: %s", data);
        //     io.emit('chat_message', data);
        // });

        socket.on('p1_select', function (data) {
            console.log("Map selected by P1: %s", data);
            io.emit('map_selected', "P1:" + data);
        });
        socket.on('p2_select', function (data) {
            console.log("Map selected by P2: %s", data);
            io.emit('map_selected', "P2:" + data);
        });


        
        // socket.on('message', function(data) {
        //     console.log("Socket %s sent message: %s", socket.id, data);
        //     io.emit('message', data);
        // });
        
        // socket.on('joinRoom', function(room, callback) {
        //     if (typeof room !== 'string') {
        //         throw new Error('Room must be a string');
        //     }
        //     if (Object.keys(socket.rooms).length > 1) {
        //         throw new Error('Socket is already in a room');
        //     }
        //     if (Object.keys(socket.rooms).indexOf(room) < 0) {
        //         console.log("Socket %s joining room %s", socket.id, room);
        //         socket.join(room);
        //     }
        //     if (typeof callback === 'function') {
        //         callback();
        //     }
        // });
    });
    
    
    console.log('Setting up express...');
    server.listen({
        host: 'localhost',
        port: 9090
    }, () => {
        console.log('FastaOV listening on port %s', server.address().port);

        app.use(express.static(path.join(__dirname, '../public')));
        app.get('/', (req, res) => { res.redirect('/graphics/'); });

        app.get('/dashboardp1/', (req, res) => {
            if (!req.url.endsWith('/')) {
                return res.redirect('/dashboard/');
            }
            res.sendFile(path.join(__dirname, '../public/dashboard/p1.html'));
        });

        app.get('/dashboardp2/', (req, res) => {
            if (!req.url.endsWith('/')) {
                return res.redirect('/dashboard/');
            }
            res.sendFile(path.join(__dirname, '../public/dashboard/p2.html'));
        });

        app.get('/graphics/', (req, res) => {
            if (!req.url.endsWith('/')) {
                return res.redirect('/graphics/');
            }
            res.sendFile(path.join(__dirname, '../public/dashboard/graphics.html'));
        });

        app.get('/*/', (req, res) => {
            res.status(404).send('404 Not found Hehehe Boy');
        });
    })
};

module.exports.stop = function () {
    console.log('Stopping server...');
    if (server) {
        server.close();
    }
    if (io) {
        io.close();
    }
    io = null;
    server = null;
    app = null;
}