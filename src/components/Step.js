function Step(props) {
        const noteString = props.step?.note;
        var note = noteString?.slice(0, noteString.length - 1) ?? "--";
        var octave = noteString?.slice(noteString.length - 1) ?? "-";
        var velocity = (props.step?.velocity ?? 0) * 10 - 1;
        var duration = props.step?.duration.toString() ?? "--";
    return (
        <div className={`m-1 grid grid-cols-4 text-[2.5vh] rounded-lg text-slate-100 font-['VT323'] border-slate-800 ${props.beat ? "border-y-2" : ""} ${props.focused ? "bg-slate-700" : props.active ? "bg-slate-800" : ""}`} onClick={props.onClick}>
            <span className="mx-4 text-slate-200">{note.padEnd(2, "_")}</span>
            <span className="mx-4 text-red-400">{octave}</span>
            <span className="mx-4 text-green-400">{velocity.toString()[0]}</span>
            <span className="mx-4 text-blue-400">{duration}</span>
        </div>
    );
}

export default Step;