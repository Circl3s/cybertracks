function DefaultParameterField(props) {
    return (
        <div title={props.name} className={`text-xl font-['VT323'] m-2 p-1 rounded-lg h-min bg-${props.color ?? "slate"}-500`}>
            <input className="w-min px-1 bg-transparent outline-none" type="number" min={props.min} max={props.max} value={props.value} onChange={props.onChange} />
        </div>
    );
}

export default DefaultParameterField;