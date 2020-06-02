import React, {Component} from 'react';
import {Widget, addResponseMessage, addUserMessage} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import {ImgLibrary} from "../../utils/storage/ImgLibrary";
import ContextStorage from "../../utils/storage/ContextStorage";
import EStorageKey from "../../utils/enum/EStorageKey";
import ThermostatManager from "../../utils/bot/ThermostatManager";
import MsgInterpretation from "../../utils/bot/MsgInterpretation";
import TLogs from "../../utils/TLogs";
import TObject from "../../utils/TObject";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.msgInterpretor = new MsgInterpretation();
        let thermostat = ContextStorage.GET(EStorageKey.THERMO);
        if (!thermostat) {
            thermostat = {
                period1: {
                    start: 0.0,
                    end: 0.0,
                    point: 0
                },
                period2: {
                    start: 0.0,
                    end: 0.0,
                    point: 0
                },
                idle: 0,
                setPoint: 0
            }
        }

        this.state = {
            thermostat: thermostat
        };

        this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
        this.updateThermostat = this.updateThermostat.bind(this);
        this.addChatMessage = this.addChatMessage.bind(this);
    }

    componentDidMount() {
        this.addChatMessage('Hello, welcome to your Thermostat assistant!');
        this.addChatMessage('What would you like to do ?');
    }

    updateThermostat(thermostat) {
        this.setState({thermostat: TObject.merge(this.state.thermostat, thermostat)});
        ContextStorage.SET(EStorageKey.THERMO, thermostat);
    }

    handleNewUserMessage(newMessage) {
        console.log('New message incoming!', newMessage);

        if (newMessage === "clear" || newMessage === "no" || newMessage === "quit") {
            this.msgInterpretor.clear();
            this.addChatMessage('What would you like to do ?');
            return;
        }

        let action = this.msgInterpretor.parseAction(newMessage);

        TLogs.p("Action: ", action);
        if (action.isValid) {
            let thermostat = ThermostatManager.executeAction(action, this.addChatMessage);
            this.updateThermostat(thermostat);
        } else {
            for (let i in action.messages) {
                this.addChatMessage(action.messages[i]);
            }
        }
    };

    addChatMessage(message) {
        if (Array.isArray(message)) {
            for (let i in message) {
                addResponseMessage(message[i]);
            }
        } else {
            addResponseMessage(message);
        }
    }

    render() {
        return (
            <div className="content-width">
                <div className="row">
                    <div className="col-md-12">

                    </div>
                    <div className="col-md-12">
                        <div className="col-md-6">

                        </div>
                        <div className="col-md-6">

                        </div>
                    </div>
                </div>
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                    profileAvatar={ImgLibrary.bot.src}
                    subtitle="Thermostat Assistant"
                    handleSubmit={() => {
                        return true;
                    }}/>
            </div>
        )
    }
}

export default Dashboard;