import Step from "./Step";

function Track(props) {
    return (
        <div className="flex flex-col items-stretch border-2 bg-slate-800 border-slate-800 font-['VT323']">
            <div>
                <div className="flex flex-row justify-between items-center px-2">
                    <h1 className="text-slate-100 text-2xl">{props.number.toString().padStart(2, "0")} {props.name}</h1>
                    <button className={`flex justify-center outline-none duration-75 items-center ${!props.muted ? "bg-slate-800 hover:bg-slate-700 text-red-500" : "bg-red-500 hover:bg-red-400 text-slate-800"} m-1 rounded-xl w-8 h-8 border-red-500 border-2 text-xl`} onMouseDown={(e) => props.muteHandler(props.number, e)}>
                        M
                    </button>
                </div>
                <div className="grid grid-cols-4 text-slate-300">
                    <div className="flex justify-center" title="Note">N</div>
                    <div className="flex justify-center" title="Octave">O</div>
                    <div className="flex justify-center" title="Velocity">V</div>
                    <div className="flex justify-center" title="Duration">D</div>
                </div>
            </div>
            
            <div className="flex flex-col flex-grow bg-slate-900 justify-between">
                {[...Array(16).keys()].map((i) => {
                    const currentTime = `${props.page ?? 0}:${~~(i/4)}:${i%4}`;
                    const step = props.sequence?.at(currentTime);
                    return <Step key={i} beat={i % 4 === 0} active={i + props.page * 16 === props.active} focused={props.focus[0] === props.number && props.focus[1] === i} step={step?.value} onClick={() => props.clickHandler([props.number, i])} />
                })}
            </div>
        </div>
    );
}

export default Track