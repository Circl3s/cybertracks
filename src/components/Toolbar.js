function Toolbar(props) {
    return (
        <div className="h-20 flex flex-row items-center justify-between bg-slate-800 text-slate-50">
            {props.children}
        </div>
    );
}

export default Toolbar;