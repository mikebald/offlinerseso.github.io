// Importing the required modules
const WebSocketServer = require('ws');
const HttpsServer = require('https').createServer;
const fs = require("fs")

server = HttpsServer({
    cert: fs.readFileSync('cloudflare.crt'),
    key: fs.readFileSync('cloudflare.key')
})

// Creating a new websocket server
const wss = new WebSocketServer.Server({ server: server, clientTracking: true })
var wssClients = [];

// Create a way to identify clients
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

// Creating connection using websocket
wss.on("connection", ws => {
    // sending message
    ws.id = wss.getUniqueID();
    ws.lastMessage = "Connection : " + (new Date()).toLocaleTimeString('en-US');

    ws.on("message", data => {

        if(data == "Heartbeat") {
            ws.lastMessage = "Heartbeat : " + (new Date()).toLocaleTimeString('en-US');
            return;
        }

        ws.lastMessage = "Data : "  + (new Date()).toLocaleTimeString('en-US');
        
        wss.clients.forEach(function each(client) {
           if (client !== ws && client.readyState === 1) { // Open Readystate
			client.send(JSON.stringify(data));
		  }
		});
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        
    });
    // handling client connection error
    ws.onerror = function () {
        
    }
});

function writeClientUpdate() {
    console.clear();
    console.log((new Date()).toLocaleTimeString('en-US'));
    console.log("[WebSocketServer] -- Listening on port 443");
    var clients = [],
        count = 0;
    
    wss.clients.forEach(function each(client) {
        count++;
        clients.push({
            "State": (client.readyState === 1 ? "Open" : "Closed"),
            "ID": client.id,
            "Last Message": client.lastMessage
        });
    });

    console.table(clients);
}

server.listen( 443 );
writeClientUpdate();

setInterval(writeClientUpdate, 1000);