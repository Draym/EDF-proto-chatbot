import HttpUtils from "../api/HttpUtils";
import TLogs from "../TLogs";

class ThermostatManager {

    static executeAction(action, sendMessage) {
        if (action.api && action.value) {
            sendMessage("We are treating your demand...");

            HttpUtils.POST("/api/thermostat/request", {
                value: action.value,
                action: action.api
            }, function (result) {
                sendMessage("We have set the " + action.name + " to " + action.value);
            }, function (result) {
                sendMessage("A problem has been encountered, your thermostat has not been modified");
            })
        } else {
            sendMessage(action.messages);
        }
    }

}

export default ThermostatManager;