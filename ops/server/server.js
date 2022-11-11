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
wss.on("connection", (ws, req) => {
    // sending message
    ws.id = wss.getUniqueID();
    ws.lastMessage = "Connection : " + (new Date()).toLocaleTimeString('en-US');
    ws.lastDate = (new Date());
    ws.ipAddress = req.headers['x-forwarded-for'].split(',')[0].trim();
    ws.city = req.headers['cf-ipcity']
    ws.trackingID = undefined
    ws.hostID = undefined

    ws.on("message", data => {

        if(data == "Heartbeat") {
            ws.lastMessage = "Heartbeat : " + (new Date()).toLocaleTimeString('en-US');
            ws.lastDate = (new Date());
            return;
        }

        if(typeof data["trackingid"] !== "undefined") {
            ws.trackingID = data["trackingid"];
        }

        ws.lastMessage = "Data : "  + (new Date()).toLocaleTimeString('en-US');
        ws.address = req.headers['True-Client-IP'] || req.socket.remoteAddress;
        
        wss.clients.forEach(function each(client) {
           if (client !== ws && client.readyState === 1) { // Open Readystate
            
            if(typeof data["hostid"] !== "undefined" && client.trackingID == data["hostid"]) {
                client.send(JSON.stringify(data));
            }
          
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
            "ID": client.id,
            "Tracking": client.trackingID || client.hostID,
            "IP": client.ipAddress,
            "City": client.city,
            "Last Message": client.lastMessage
        });

        // Timeout
        if( Math.floor(((new Date()) - clients.lastDate) / (1000*60)) > 2 ) {
            client.close();
        }

    });

    console.table(clients);
}

server.listen( 443 );
writeClientUpdate();

setInterval(writeClientUpdate, 1000);