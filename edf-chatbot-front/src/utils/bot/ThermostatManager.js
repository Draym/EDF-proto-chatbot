import HttpUtils from "../api/HttpUtils";

class ThermostatManager {

    static executeAction(action, sendMessage, updateThermostat) {
        if (action.api && action.value) {
            sendMessage("We are treating your demand...");

            HttpUtils.POST("/api/thermostat/request", {
                value: action.value,
                action: action.api
            }, function (result) {
                sendMessage("We have set the " + action.name + " to " + action.value);
                updateThermostat(action.name, action.value);
            }, function (result) {
                sendMessage("A problem has been encountered, your thermostat has not been modified");
            });
        } else {
            sendMessage(action.messages);
        }
    }

}

export default ThermostatManager;