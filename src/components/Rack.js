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

    render() {
        return (
            <div className="p-4 flex flex-col w-full justify-start font-['VT323'] bg-slate-800 text-slate-50 border-b-2 border-slate-700">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col w-1/2">
                        <h1 className="text-slate-100 text-2xl">{this.props.number.toString().padStart(2, "0")} {this.props.name}</h1>
                        <div className="flex flex-row items-center">
                            <span>Patch: </span>
                            {[...Array(4).keys()].map((i) => {
                                return <input key={i} type="button" className={`h-8 w-8 mx-2 cursor-pointer outline-none rounded-lg ${this.props.activePatch === i ? "bg-green-700 hover:bg-green-600 active:bg-green-800" : "bg-slate-700 hover:bg-slate-600 active:bg-slate-800"} border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75`} value={i} onClick={() => this.props.changePatch(i)} />

                            })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row my-2 w-full h-2 bg-slate-900 rounded-lg">
                    <div className={`flex flex-row ${!this.props.muted ? "bg-green-400" : "bg-slate-600"} rounded-lg`} style={{width: this.state.value + 100 + "%"}} />
                </div>
            </div>
        )
    }
}

export default Rack;