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
        this.state = {
            thermostat: {
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
        };
        let thermostat = ContextStorage.GET(EStorageKey.THERMO);
        if (thermostat) {
            this.state.thermostat = TObject.merge(this.state.thermostat, thermostat);
        }

        this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
        this.updateThermostat = this.updateThermostat.bind(this);
        this.addChatMessage = this.addChatMessage.bind(this);
        this.toPeriodTime = this.toPeriodTime.bind(this);
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
        if (newMessage === "clear" || newMessage === "no" || newMessage === "quit") {
            this.msgInterpretor.clear();
            this.addChatMessage('What would you like to do ?');
            return;
        }

        let action = this.msgInterpretor.parseAction(newMessage);

        TLogs.p("Action: ", action);
        if (action.isValid) {
            ThermostatManager.executeAction(action, this.addChatMessage, (name, value) => {
                let thermostat = {};
                let index = 1;
                let keys = name.split("1");
                if (keys.length === 1) {
                    keys = name.split("2");
                    index = 2;
                }
                if (keys.length === 2) {
                    thermostat[keys[0] + index] = {};
                    thermostat[keys[0] + index][keys[1]] = value;
                } else {
                    thermostat[name] = value;
                }
                this.updateThermostat(thermostat);
            });
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

    toPeriodTime(value) {
        let min = (value - Math.floor(value)).toFixed(2);
        let hour = value - min;
        min = (60 * min).toFixed(0);
        return hour + ":" + (min < 10 ? "0" + min : min);
    }

    render() {
        return (
            <div className="content-width">
                <div className="row">
                    <div className="col-md-12">
                        <div id="content-container">
                            <div id="controls-container">
                                <h2 id="controls-header">Heating Schedules</h2>
                                <div className="heating-schedule">
                                    <div className="left-box">
                                        <span className="heating-schedule-label">Heating schedule 1</span>
                                        <div className="heating-schedule-periods">
                                            <span
                                                id="heating-period-1-start">{this.toPeriodTime(this.state.thermostat.period1.start)}</span> - <span
                                            id="heating-period-1-end">{this.toPeriodTime(this.state.thermostat.period1.end)}</span>
                                        </div>
                                    </div>
                                    <div className="right-box flex-box-container">
                                        <div>
                                            <img className="heating-image"
                                                 src="https://dev.edflabs.net/thermostat/web/images/heating.png"
                                                 alt="heating"/>
                                            <span className="setpoint"
                                                  id="heating-period-1-setpoint">{this.state.thermostat.period1.point}</span><span
                                            className="heating-period-celsius">°</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="heating-schedule">
                                    <div className="left-box">
                                        <span className="heating-schedule-label">Heating schedule 2</span>
                                        <div className="heating-schedule-periods">
                                            <span
                                                id="heating-period-2-start">{this.toPeriodTime(this.state.thermostat.period2.start)}</span> - <span
                                            id="heating-period-2-end">{this.toPeriodTime(this.state.thermostat.period2.end)}</span>
                                        </div>
                                    </div>
                                    <div className="right-box flex-box-container">
                                        <div>
                                            <img className="heating-image"
                                                 src="https://dev.edflabs.net/thermostat/web/images/heating.png"
                                                 alt="heating"/>
                                            <span className="setpoint"
                                                  id="heating-period-2-setpoint">{this.state.thermostat.period2.point}</span><span
                                            className="heating-period-celsius">°</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="heating-schedule">
                                    <div className="left-box">
                                        <span className="heating-schedule-label">Idle temperature</span>
                                    </div>
                                    <div className="right-box flex-box-container">
                                        <div>
                                            <img className="heating-image"
                                                 src="https://dev.edflabs.net/thermostat/web/images/heating.png"
                                                 alt="heating"/>
                                            <span className="setpoint"
                                                  id="idle-temperature">{this.state.thermostat.idle}</span><span
                                            className="heating-period-celsius">°</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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