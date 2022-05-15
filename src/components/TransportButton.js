function TransportButton(props) {
    return (
        <button onClick={props.callback} className="h-16 w-16 m-4 outline-none rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 active:border-[1px] border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75">
            <span className={props.active ? "material-icons text-green-400" : "material-icons"}>
                {props.icon}
            </span>
        </button>
    );
}

export default TransportButton;