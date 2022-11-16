
(function (window, $, _) {

    window.TrackingLib = window.TrackingLib | {}

    var _trackLib = function() {};

    _trackLib.prototype.Initialize = function () {
        var innerThis = TrackingLib;
        const ws = new WebSocket("wss://websocket.offlinerseso.com");
        ws.addEventListener("open", innerThis.onOpen);
        ws.addEventListener('message', innerThis.onMessageReceived);
        ws.addEventListener('close', innerThis.onClose);

        innerThis.trackingID = "null";
        innerThis.trackingIDs = [];
        innerThis.trackingIDInput = "#trackingID";
        innerThis.initializeTimestamp = Date.now();
        innerThis.timestamp = Date.now() - 30000;
        innerThis.webSocket = ws;
        innerThis.messageData = {};
        TrackingLib.onSanityTick();
        innerThis.sanityTimer = window.setInterval( function() {
            TrackingLib.onSanityTick();
        }, 1000);
    };

    _trackLib.prototype.SetTrackingID = function(trackingID) {
        var innerThis = TrackingLib,
            trackedObj = JSON.stringify({"trackingid": trackingID});

        innerThis.trackingID = trackingID;

        innerThis.waitForWSReady( function() {
            innerThis.webSocket.send(trackedObj);
            console.log("Sent: " + trackedObj);
        });
    };

    _trackLib.prototype.LoadTrackingIDFromURL = function() {
        var innerThis = TrackingLib,
            urlParams = window.location.search;

            if(urlParams.length > 0 && urlParams.indexOf("?") > -1) {
                urlParams = urlParams.replace("?", "");
                var trackingIDs = urlParams.split(",");
                innerThis.trackingIDs = trackingIDs;
            }

            if(innerThis.trackingIDs.length > 0) {
                $(innerThis.trackingIDInput).val(innerThis.trackingIDs[0]);
                innerThis.SetTrackingID(innerThis.trackingIDs[0]);
            }
    };

    _trackLib.prototype.onOpen = function() {
        console.log("Connected to WebSocket");
    };

    _trackLib.prototype.onClose = function() {
        console.log("WebSocket closed");
        console.log( "Timeout: " + parseInt(( Date.now() - TrackingLib.initializeTimestamp) / 1000 ));
    };

    _trackLib.prototype.onMessageReceived = function(event) {
        var innerThis = TrackingLib,
            string_arr = JSON.parse(event['data']).data,
            string = "";

        string_arr.forEach(element => {
            string+=String.fromCharCode(element);
        });
   
        if(string != "") {
            innerThis.timestamp = Date.now();
            var obj = JSON.parse(string);
            innerThis.messageData = obj;
            PositioningLib.SetPosition(obj);
            KeepStatusLib.Update(obj["keeps"]);
        }
    };

    _trackLib.prototype.onSanityTick = function() {
        // Check to see if the data is not stale
        var innerThis = TrackingLib,
            currentDate = Date.now(),
            secondDifference = parseInt(( currentDate - innerThis.timestamp) / 1000);

        if(innerThis.webSocket.readyState === 1 && secondDifference % 30 == 0) 
        {
            innerThis.webSocket.send("Heartbeat"); // Keep the websocket alive
            console.log("Sending Heartbeat");
        }

        if( secondDifference > 10 ) {
            innerThis.onTrackingLostTick();
            $("#favicon").attr("href","favicon_red.png");
            $("#pageTitle").html("OPS - Tracking Lost");
        } else {
            $("#crown_trackinglost").hide()
            $("#pageTitle").html("OPS - Tracking Found");
            $("#favicon").attr("href","favicon_green.png");
        }

    };

    _trackLib.prototype.onTrackingLostTick = function() {
        $("#crown_trackinglost").show();
        PositioningLib.SetPosition( PositioningLib.GetWaitingPosition() );
        KeepStatusLib.Update(undefined);
    };

    _trackLib.prototype.waitForWSReady = function (callback) {
        var innerThis = TrackingLib;
        setTimeout(
            function () {
                if (innerThis.webSocket.readyState === 1) {
                    if (callback != null){
                        callback();
                    }
                } else {
                    innerThis.waitForWSReady(callback);
                }
    
            }, 10);
    }


    window.TrackingLib = new _trackLib();

})(window, jQuery, _);