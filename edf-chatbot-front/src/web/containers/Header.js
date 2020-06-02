import React, {Component} from 'react';
import "./Header.scss";
import moment from 'moment';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment().format("DD MMM YYYY"),

        }
    }

    render() {
        return (
            < div
        className = "App-header" >
            < div
        className = "content-width" >
            < img
        id = "edf-energy-logo"
        src = "https://dev.edflabs.net/thermostat/web/images/edf_energy_logo_linear.png"
        alt = "logo" / >
            < div
        id = "information-container" >
            < span
        className = "date" > {this.state.date} < /span>
            < /div>
            < /div>
            < /div>
    )
    }
}

export default Header;