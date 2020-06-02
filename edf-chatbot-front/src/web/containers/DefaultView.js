import React, {Component} from 'react';
import Dashboard from "../views/Dashboard";
import Header from "./Header";

class DefaultView extends Component {

    render() {
        // usually i do routing here
        return (
            < div >
            < Header / >
            < Dashboard / >
            < /div>);
    }
}

export default DefaultView;