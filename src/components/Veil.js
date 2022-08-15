function Veil(props) {
    return props.visible ? (<div className="hidden"></div>) : (
        <div onClick={props.callback} className="absolute p-16 w-[100vw] h-[100vh] z-10 flex flex-col justify-center items-center bg-slate-800 text-slate-50">
            <h1 className="text-4xl font-['Major_Mono_Display'] p-2">cybertrAcks</h1>
            {props.unsupported
                ? <h2 className="text-2xl font-['VT323'] text-center">
                    <p>
                        <span className="material-icons text-green-500 p-2">desktop_windows</span>
                        <span className="material-icons text-green-500 p-2">computer</span>
                        <span className="material-icons text-yellow-500 p-2">tablet</span>
                        <span className="material-icons text-red-500 p-2">mobile_off</span>
                    </p>
                    <p className="text-red-500">This app is currently only supported on high resolution landscape screens.<br />
                    Physical keyboard and mouse or trackpad are required.
                    </p>
                </h2>
                : <h2 className="text-2xl font-['VT323']">Click to begin</h2>
            }
        </div>
    );
}

export default Veil;