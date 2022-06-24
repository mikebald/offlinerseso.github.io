
(function (window, $, _) {

    window.TrackingLib = window.TrackingLib | {}

    var _trackLib = function() {};

    _trackLib.prototype.Initialize = function () {
        var innerThis = TrackingLib;
        const ws = new WebSocket("wss://websocket.offlinerseso.com");
        ws.addEventListener("open", innerThis.onOpen);
        ws.addEventListener('message', innerThis.onMessageReceived);

        innerThis.timestamp = Date.now() - 30000;
        TrackingLib.onSanityTick();
        innerThis.sanityTimer = window.setInterval( function() {
            TrackingLib.onSanityTick();
        }, 1000);
    };

    _trackLib.prototype.onOpen = function() {
        console.log("Connected to WebSocket");
    };

    _trackLib.prototype.onMessageReceived = function(event) {
        var innerThis = TrackingLib,
            string_arr = JSON.parse(event['data']).data,
            string = "";

        string_arr.forEach(element => {
            string+=String.fromCharCode(element);
        });
    
        var obj = JSON.parse(string);
        PositioningLib.SetPosition(obj);
        innerThis.timestamp = Date.now();
    };

    _trackLib.prototype.onSanityTick = function() {
        // Check to see if the data is not stale
        var innerThis = TrackingLib,
            currentDate = Date.now(),
            secondDifference = ( currentDate - innerThis.timestamp) / 1000;

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
    }


    window.TrackingLib = new _trackLib();

})(window, jQuery, _);