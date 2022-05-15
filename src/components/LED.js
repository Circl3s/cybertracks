import React from "react";

class LED extends React.Component {
    constructor() {
        super();
        this.state = {
            color: "red",
            on: false
        }
    }

    blinkLed = (color = "red") => {
        this.setState({on: true, color: color});
        setTimeout(this.turnOff, 100);
    }

    turnOff = () => {
        this.setState({on: false});
    }

    render() {
        return (
            <div className={`m-2 h-2 w-2 rounded-full ${this.state.on ? "bg-red-500 shadow-md shadow-red-500" : "bg-black"}`}></div>
        )
    }
    
}

export default LED;