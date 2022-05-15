function Tempo(props) {
    return (
        <div className="text-2xl font-['VT323'] m-4 p-2 rounded-lg h-min bg-slate-700">
            <input className="w-16 px-1 bg-transparent outline-none" type="number" name="BPM" id="" defaultValue={props.value} onChange={props.onChange} />BPM
        </div>
    );
}

export default Tempo;