
(function (window, $, _) {

    window.KeepStatusLib = window.KeepStatusLib | {}

    var _keepStatusLib = function() {};

    _keepStatusLib.prototype.Initialize = function () {
        var innerThis = KeepStatusLib;
        innerThis.BaseKeepDiv = "#keepstatus";
        innerThis.KeepUnderAttackLight = "#keep_ua_light";
        innerThis.KeepUnderAttackHeavy = "#keep_ua_heavy";
        innerThis.TownUnderAttackLight = "#town_ua_light";
        innerThis.TownUnderAttackHeavy = "#town_ua_heavy";
        innerThis.OutpostUnderAttackLight = "#outpost_ua_light";
        innerThis.OutpostUnderAttackHeavy = "#outpost_ua_heavy";
        innerThis.KeepOwners = {
            "Warden": { "left": "175px", "top": "150px" },
            "Rayles": { "left": "132px", "top": "270px" },
            "Glademist": { "left": "209px", "top": "227px" },
            "Ash": { "left": "255px", "top": "342px" },
            "Aleswell": { "left": "319px", "top": "227px" },
            "Dragonclaw": { "left": "390px", "top": "92px" },
            "Chalman": { "left": "458px", "top": "232px" },
            "Arrius": { "left": "557px", "top": "268px" },
            "Kingscrest": { "left": "575px", "top": "150px" },
            "Farragut": { "left": "668px", "top": "266px" },
            "BlueRoad": { "left": "525px", "top": "343px" },
            "Drakelowe": { "left": "615px", "top": "467px" },
            "Alessia": { "left": "444px", "top": "461px" },
            "Faregyl": { "left": "388px", "top": "550px" },
            "Roebeck": { "left": "328px", "top": "468px" },
            "Brindle": { "left": "163px", "top": "465px" },
            "BlackBoot": { "left": "316px", "top": "631px" },
            "Bloodmayne": { "left": "453px", "top": "630px" },
            "Nikel": { "left": "285px", "top": "423px" },
            "Sejanus": { "left": "511px", "top": "410px" },
            "Bleakers": { "left": "390px", "top": "218px" },
            "Winters": { "left": "453px", "top": "137px" },
            "Carmala": { "left": "166px", "top": "404px" },
            "Harluns": { "left": "624px", "top": "379px" },
            "Vlastarus": { "left": "232px", "top": "539px" },
            "Bruma": { "left": "364px", "top": "140px" },
            "Cropsford": { "left": "537px", "top": "513px" }
        };
        innerThis.KeepAttack = {
            "Warden": { "left": "165px", "top": "139px" },
            "Rayles": { "left": "116px", "top": "258px" },
            "Glademist": { "left": "199px", "top": "220px" },
            "Ash": { "left": "246px", "top": "338px" },
            "Aleswell": { "left": "311px", "top": "221px" },
            "Dragonclaw": { "left": "376px", "top": "82px" },
            "Chalman": { "left": "445px", "top": "223px" },
            "Arrius": { "left": "545px", "top": "257px" },
            "Kingscrest": { "left": "565px", "top": "141px" },
            "Farragut": { "left": "657px", "top": "263px" },
            "BlueRoad": { "left": "513px", "top": "339px" },
            "Drakelowe": { "left": "604px", "top": "464px" },
            "Alessia": { "left": "436px", "top": "455px" },
            "Faregyl": { "left": "375px", "top": "550px" },
            "Roebeck": { "left": "315px", "top": "460px" },
            "Brindle": { "left": "160px", "top": "460px" },
            "BlackBoot": { "left": "308px", "top": "626px" },
            "Bloodmayne": { "left": "442px", "top": "624px" }
        };
        innerThis.OutpostAttack = {
            "Nikel": { "left": "268px", "top": "409px" },
            "Sejanus": { "left": "499px", "top": "402px" },
            "Bleakers": { "left": "378px", "top": "213px" },
            "Winters": { "left": "447px", "top": "128px" },
            "Carmala": { "left": "156px", "top": "396px" },
            "Harluns": { "left": "620px", "top": "369px" }
        };
        innerThis.TownAttack = {
            "Vlastarus": { "left": "224px", "top": "531px" },
            "Bruma": { "left": "364px", "top": "135px" },
            "Cropsford": { "left": "533px", "top": "506px" }
        };
        innerThis.CreateKeepDivs();
        
        innerThis.CreateUADivs(innerThis.KeepAttack, innerThis.KeepUnderAttackLight )
        innerThis.CreateUADivs(innerThis.KeepAttack, innerThis.KeepUnderAttackHeavy )
        
        innerThis.CreateUADivs(innerThis.TownAttack, innerThis.TownUnderAttackLight )
        innerThis.CreateUADivs(innerThis.TownAttack, innerThis.TownUnderAttackHeavy )

        innerThis.CreateUADivs(innerThis.OutpostAttack, innerThis.OutpostUnderAttackLight )
        innerThis.CreateUADivs(innerThis.OutpostAttack, innerThis.OutpostUnderAttackHeavy )
    }

    _keepStatusLib.prototype.CreateUADivs = function( objects, baseObj ) {
        $.each(objects, function(index, element)  {
            $(baseObj).clone().css( element ).attr("id", baseObj.replace("#", "") + "_" + index).appendTo("body");
        });
    };

    _keepStatusLib.prototype.CreateKeepDivs = function() {
        var innerThis = KeepStatusLib;
        $.each(innerThis.KeepOwners, function(index, element)  {
            $(innerThis.BaseKeepDiv).clone().css( element ).attr("id", "keepstatus_" + index).appendTo("body").show();
        });
    };

    _keepStatusLib.prototype.Update = function( keepData ) {
        var innerThis = KeepStatusLib;
        if( typeof keepData === "undefined" ) {
            $.each(innerThis.KeepOwners, function(index) {
                $("#keepstatus_" + index).attr('class', 'keep'); // Clears out the colors
            });
            $(".ua").hide(); // Hides all the under attack status
        } else {
            $.each(keepData, function(index, element) {
                // Set Colors
                $("#keepstatus_" + element["Name"]).attr('class', 'keep').addClass('keep_' + element["Owners"]);
                // Set Under Attack
                var lightID = [element["Type"], "ua" , element["SiegeStatus"], element["Name"]].join("_");
                var heavyID = [element["Type"], "ua" , element["SiegeStatus"], element["Name"]].join("_");
                
                if(element["SiegeStatus"] === "none") {
                    $("#" + lightID).hide();
                    $("#" + heavyID).hide();
                } else {
                    // ex: #keep_ua_heavy_Roebeck, #outpost_ua_light_Harluns
                    var elementID = [element["Type"], "ua" , element["SiegeStatus"], element["Name"]].join("_");

                    if(elementID === lightID) {
                        $("#" + heavyID).hide();
                    } else {
                        $("#" + lightID).hide();
                    }
                    $("#" + elementID).show();
                }
            });
        }
    };



    window.KeepStatusLib = new _keepStatusLib();

})(window, jQuery, _);