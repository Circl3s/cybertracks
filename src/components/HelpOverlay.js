function HelpOverlay(props) {
    const legend = [
        {
            key: "space",
            desc: "Play / Stop",
            tip: "You can also use the graphical buttons on the top"
        },
        {
            key: "ctrl + space",
            desc: "Pause / Resume",
            tip: "You can also use the graphical buttons on the top"
        },
        {
            key: "up/down/left/right",
            desc: "Move cursor",
            tip: "You can also click on any step to move the cursor to it"
        },
        {
            key: "Page Up/Page Down",
            desc: "Previous / Next page",
            tip: `You can also use the Pages section to the right of the tracker`
        },
        {
            key: "Backspace",
            desc: "Clear step",
            tip: "For rest-style input, see DELETE"
        },
        {
            key: "Delete",
            desc: "Clear step and progress",
            tip: `Also know as "inputting a rest"`
        },
        {
            key: "0-9",
            desc: "Change octave",
            tip: "If highlighting a note, other than changing the default octave for new notes, it will modify that note and progress"
        },
        {
            key: "+/-",
            desc: "Octave up / down",
            tip: "If highlighting a note, other than changing the default octave for new notes, it will modify that note and progress"
        },
        {
            key: "ctrl + 0-9",
            desc: "Change velocity",
            tip: "Mnemonic: Velocity CONTROLs the loudness of the note\nIf highlighting a note, other than changing the default velocity for new notes, it will modify that note and progress"
        },
        {
            key: "ctrl + +/-",
            desc: "Velocity up / down",
            tip: "Mnemonic: Velocity CONTROLs the loudness of the note\nIf highlighting a note, other than changing the default velocity for new notes, it will modify that note and progress"
        },
        {
            key: "shift + 0-9",
            desc: "Change length",
            tip: "Mnemonic: Length SHIFTs the end of the note\nIf highlighting a note, other than changing the default length for new notes, it will modify that note and progress"
        },
        {
            key: "shift + +/-",
            desc: "Length up / down",
            tip: "Mnemonic: Length SHIFTs the end of the note\nIf highlighting a note, other than changing the default length for new notes, it will modify that note and progress"
        }
    ]
    return (
        <div onClick={props.onClick} className={`absolute z-10 w-full h-full text-slate-50 bg-slate-900 bg-opacity-80 flex flex-col justify-start items-center ${props.show ? "" : "hidden"} overflow-y-auto`}>
            <h1 className="text-4xl font-['Major_Mono_Display'] mt-2">cybertrAcks</h1>
            <div className="flex flex-row items-center font-['VT323']">
                <button className="flex flex-row items-center text-slate-50 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 m-2 p-2 rounded-md shadow-md duration-75" onClick={props.exportCallback}>
                    <span className="material-icons -ml-1 mr-1">file_download</span> Save
                </button>
                <button className="flex flex-row items-center text-slate-50 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 m-2 p-2 rounded-md shadow-md duration-75" onClick={props.importCallback}>
                    <span className="material-icons -ml-1 mr-1">file_upload</span> Load
                </button>
            </div>
            <p className="font-['VT323'] text-xl m-1">(Hover over the controls to see additional tips)</p>
            {legend.map(({ key, desc, tip }) => (
                <p key={key} className="font-['VT323'] text-xl m-1" title={tip}><kbd className="bg-slate-800 text-xl p-1 rounded-md font-['VT323'] uppercase">{key}</kbd>: {desc}</p>
            ))}
            <p className="font-['VT323'] text-xl m-1">Input new notes by pressing the following keys:</p>
            <div className="flex flex-row text-slate-50 font-['VT323'] text-xl pl-1 z-20 uppercase">
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">s</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">d</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md opacity-0">f</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">g</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">h</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">j</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md opacity-0">k</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">l</div>
                <div className="bg-slate-800 px-2 py-4 m-1 rounded-md">;</div>
            </div>
            <div className="flex flex-row text-slate-900 font-['VT323'] text-xl relative -top-8 uppercase">
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">z</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">x</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">c</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">v</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">b</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">n</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">m</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">,</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">.</div>
                <div className="bg-slate-50 px-2 py-4 m-1 rounded-md">/</div>
            </div>
            <div className="flex flex-row font-['VT323'] text-xl">
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Ducking
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        Q
                    </div>
                </div>
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Kick
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        W
                    </div>
                </div>
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Snare
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        E
                    </div>
                </div>
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Hi-Hat
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        R
                    </div>
                </div>
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Percussion
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        T
                    </div>
                </div>
                <div className="flex flex-col m-2">
                    <div className="bg-slate-700 p-2 rounded-t-md flex flex-col items-center">
                        Crash
                    </div>
                    <div className="bg-slate-800 p-2 rounded-b-md flex flex-col items-center">
                        Y
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelpOverlay;
