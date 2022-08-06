function DrumStep(props) {
    const duck = props.step[0] ? "#" : "-"
    const kick = props.step[1] ? "#" : "-"
    const snare = props.step[2] ? "#" : "-"
    const hihat = props.step[3] ? "#" : "-"
    const perc = props.step[4] ? "#" : "-"
return (
    <div className={`m-1 grid grid-cols-5 text-[2.5vh] rounded-lg text-slate-100 font-['VT323'] border-slate-800 ${props.beat ? "border-y-2" : ""} ${props.focused ? "bg-slate-700" : props.active ? "bg-slate-800" : ""}`} onClick={props.onClick}>
        <span className="mx-4 text-slate-200">{duck}</span>
        <span className="mx-4 text-slate-200">{kick}</span>
        <span className="mx-4 text-slate-200">{snare}</span>
        <span className="mx-4 text-slate-200">{hihat}</span>
        <span className="mx-4 text-slate-200">{perc}</span>
    </div>
);
}

export default DrumStep;