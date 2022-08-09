import React from "react";

class Rack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: -100
        }
    }

    updateValue = (value) => {
        this.setState({value: value});
    }

    reset = (e) => {
        if (e.button == 1) {
            e.preventDefault();
            e.target.value = 1.0;
            this.props.changeVolume(this.props.number, 1.0)
        }
    }

    render() {
        return (
            <div className="p-4 flex flex-col w-full justify-start font-['VT323'] bg-slate-800 text-slate-50 border-b-2 border-slate-700">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col w-full">
                        <h1 className="text-slate-100 text-2xl">{this.props.number.toString().padStart(2, "0")} {this.props.name}</h1>
                        <div className="flex flex-row w-full items-center justify-between">
                            <div className="flex flex-row items-center">
                                <span>Patch: </span>
                                {[...Array(4).keys()].map((i) => {
                                    return <input key={i} type="button" className={`h-8 w-8 mx-2 cursor-pointer outline-none rounded-lg ${this.props.activePatch === i ? "bg-green-700 hover:bg-green-600 active:bg-green-800" : "bg-slate-700 hover:bg-slate-600 active:bg-slate-800"} border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75`} value={i} onClick={() => this.props.changePatch(i)} />
                                })}
                            </div>
                            <div className="flex flex-row items-center">
                                <input type="button" className={`h-8 w-8 mx-2 cursor-pointer outline-none rounded-lg ${this.props.activeReverb ? "bg-blue-700 hover:bg-blue-600 active:bg-blue-800" : "bg-slate-700 hover:bg-slate-600 active:bg-slate-800"} border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75`} value="R" title="Reverb send" onClick={() => this.props.reverbHandler(this.props.number)} />
                                {this.props.number !== 0 &&
                                    <input type="button" className={`h-8 w-8 mx-2 cursor-pointer outline-none rounded-lg ${this.props.activeDucking ? "bg-green-700 hover:bg-green-600 active:bg-green-800" : "bg-slate-700 hover:bg-slate-600 active:bg-slate-800"} border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75`} value="D" title="Ducking" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-row my-2 w-full h-2 bg-slate-900 rounded-lg">
                    <div className={`flex flex-row ${!this.props.muted ? "bg-green-400" : "bg-slate-600"} rounded-lg`} style={{width: this.state.value + 100 + "%"}} />
                    <input className="absolute -top-1 w-full" type="range" min="0" max="1.25" step="0.01" defaultValue="1" onChange={(e) => this.props.changeVolume(this.props.number, e.target.value)} onMouseDown={this.reset} />
                </div>
            </div>
        )
    }
}

export default Rack;