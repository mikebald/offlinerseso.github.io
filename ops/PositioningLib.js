
(function (window, $, _) {

    window.PositioningLib = window.PositioningLib | {}

    var _posLib = function() {};

    _posLib.prototype.Initialize = function () {
        this.previousData = {"x": "N/A", "y": "N/A", "angle": "0", "strength": "0"}
    }

    _posLib.prototype.GetWaitingPosition = function() {
        var majorAngles = [0, 45, 90, 135, 180, -135, -90, -45],
            randomNumber = parseInt(Math.random() * (majorAngles.length - 1) + 1),
            randomAngle = majorAngles[randomNumber - 1];
    
            return { "x": 100, "y": 600, "angle": randomAngle }
    };

    _posLib.prototype.SetPosition = function (PositionObj) {
        var innerThis = PositioningLib,
            xPos = PositionObj["x"],
            yPos = PositionObj["y"],
            angle = PositionObj["angle"],
            crownObj = $("#crown"),
            arrowObj = $("#crown_arrow"),
            angleObj = innerThis.GetAngleString(angle);

        crownObj.show();
        crownObj.offset({ "top": yPos, "left": xPos });
        innerThis.SetArrowPosition( arrowObj, xPos, yPos, angleObj );
    };

    _posLib.prototype.SetArrowPosition = function (ArrowObj, xPos, yPos, AngleObj) {
        var angleAdjustment = [ 
                {"x": 9, 	"y": -25, 	"Angle": -90},
                {"x": 40, 	"y": 7, 	"Angle": 0},
                {"x": -25, 	"y": 7, 	"Angle": 180},
                {"x": 9, 	"y": 40, 	"Angle": 90},
                {"x": 24, 	"y": -20,	"Angle": -45},
                {"x": -20, 	"y": -20,	"Angle": -135},
                {"x": 26, 	"y": 22,	"Angle": 45},
                {"x": -22, 	"y": 24,	"Angle": 135}
            ],
            yAdjustment = 0, xAdjustment = 0;				

        adjustmentObj = _.find(angleAdjustment, function(obj) { return obj["Angle"] === AngleObj["Angle"]; });
        
        if(typeof adjustmentObj !== "undefined") {
            xAdjustment = adjustmentObj["x"];
            yAdjustment = adjustmentObj["y"];
        }

        ArrowObj.show();
        ArrowObj.removeClass();
        ArrowObj.addClass(AngleObj["Class"]);
        ArrowObj.offset( {"top" : yPos + yAdjustment, "left": xPos + xAdjustment} );
    };


    _posLib.prototype.GetAngleString = function (Angle) {
        // Conversion: 	NW: -135	North -90	NE: -45
        // 					West: 180       East: 0
        //				SW: 135		South 90	SE: 45
        var majorAngles = [0, 45, 90, 135, 180, -135, -90, -45],
            majorDirections = [ 
                {"Class": "arrow_n", 	"Angle": -90},
                {"Class": "arrow_e", 	"Angle": 0},
                {"Class": "arrow_s", 	"Angle": 90},
                {"Class": "arrow_w", 	"Angle": 180},
                {"Class": "arrow_ne",	"Angle": -45},
                {"Class": "arrow_nw",	"Angle": -135},
                {"Class": "arrow_se",	"Angle": 45},
                {"Class": "arrow_sw",	"Angle": 135}
            ];
        
        // NormalizeAngle
        var closestAngle = majorAngles.reduce(function(prev, curr) {
            return (Math.abs(curr - Angle) < Math.abs(prev - Angle) ? curr : prev);
        });

        return _.find(majorDirections, function(obj) {
            if(obj["Angle"] == closestAngle) {
                return true;
            }
        });
    };

    window.PositioningLib = new _posLib();
})(window, jQuery, _);