function Paginator(props) {
    return (
        <div className="p-4 flex flex-col items-center justify-start font-['VT323'] bg-slate-800 text-slate-50 h-full">
            <h1 className="text-2xl">Pages</h1>
            <input type="checkbox" id="checkbox" className="mt-4 outline-none" checked={props.follow} onChange={props.onChange} />
            <label htmlFor="checkbox" className="flex flex-col items-center justify-center">
                Follow
            </label>
            <div className="flex flex-col items-center justify-start">
            {[...Array(props.pages).keys()].map((i) => {
                return <button key={i} className={`w-full h-min m-4 outline-none rounded-lg ${props.activePage === i ? "bg-green-700 hover:bg-green-600 active:bg-green-800" : "bg-slate-700 hover:bg-slate-600 active:bg-slate-800"} border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75`} onClick={() => props.viewCallback(i)}>
                    <span>
                        {props.viewingPage === i ? `>${i}<` : i}
                    </span>
                </button>
            })}
                <div className="flex flex-stretch">
                    <button className={`flex flex-stretch h-min m-1 px-2 outline-none rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-800 border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75 disabled:opacity-25`} onClick={() => props.removePageCallback()} disabled={props.pages === 1}>
                        <span>
                            -
                        </span>
                    </button>
                    <button className={`flex flex-stretch h-min m-1 px-2 outline-none rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-800 border-[1px] border-transparent active:border-slate-700 shadow-md active:shadow-inner flex justify-center items-center duration-75 disabled:opacity-25`} onClick={() => props.addPageCallback()} disabled={props.pages === 8}>
                        <span>
                            +
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Paginator;