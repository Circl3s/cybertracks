function Veil(props) {
    return props.visible ? (<div className="hidden"></div>) : (
        <div onClick={props.callback} className="absolute w-full h-full z-10 flex flex-col justify-center items-center bg-slate-800 text-slate-50">
            <h1 className="text-4xl font-['Major_Mono_Display']">cybertrAcks</h1>
            <h2 className="text-2xl font-['VT323']">Click to begin</h2>
        </div>
    );
}

export default Veil;