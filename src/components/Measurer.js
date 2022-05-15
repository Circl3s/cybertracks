function Measurer(props) {
    return (
        <div className="text-2xl font-['VT323'] m-4 p-2 rounded-lg h-min bg-slate-700">
            <span>{props.time}</span>
        </div>
    );
}

export default Measurer;