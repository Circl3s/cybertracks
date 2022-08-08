import React from "react";
import * as Tone from "tone";

import utils from "./utils";

import Toolbar from "./components/Toolbar";
import Veil from "./components/Veil";
import TransportButton from "./components/TransportButton";
import Measurer from "./components/Measurer";
import Track from "./components/Track";
import Tempo from "./components/Tempo";
import LED from "./components/LED";
import Rack from "./components/Rack";
import DefaultParameterField from "./components/DefaultParameterField";
import Paginator from "./components/Paginator";
import HelpOverlay from "./components/HelpOverlay";
import DrumTrack from "./components/DrumTrack"

import linnKick from "./assets/LinnDrum Bass.wav";
import linnSnare from "./assets/LinnDrum Snare Tune 24.wav";
import linnHhClosed from "./assets/LinnDrum HiHat Decay 8.wav";


const globalComp = new Tone.Compressor(-20, 4).toDestination();

const ducking = new Tone.Gain(1).connect(globalComp);

const synthReverbSend = new Tone.Reverb(2).connect(ducking);
const synthDelaySend = new Tone.FeedbackDelay("8n", 0.5).connect(ducking);

const drumMute = new Tone.Gain(1).connect(globalComp);

const drumMeter = new Tone.Meter().connect(drumMute);

const drums = new Tone.Sampler({
  C5: linnKick,
  D5: linnSnare,
  E5: linnHhClosed,
}).connect(drumMeter);

const bassMute = new Tone.Gain(1).connect(ducking)

const bassMeter = new Tone.Meter().connect(bassMute);

const bass1dist = new Tone.Distortion(0.8).connect(bassMeter);

const bass1 = new Tone.MonoSynth({
  oscillator: {
    type: "fatsawtooth",
  },
  envelope: {
    attack: 0.01,
    decay: "8n",
    sustain: 0,
    release: 0.1
  },
}).connect(bass1dist);

const bass2filter = new Tone.Filter("2000Hz", "lowpass").connect(bassMeter);

const bass2dist = new Tone.Distortion(1.0).connect(bass2filter);

const bass2 = new Tone.MonoSynth({
  oscillator: {
    type: "fatsawtooth",
    count: 2,
    detune: 66

  },
  envelope: {
    attack: 0.01,
    decay: 0,
    sustain: 1,
    release: 0.01
  },
}).connect(bass2dist);

const bassPatches = [
  bass1,
  bass2,
]

const arpMute = new Tone.Gain(1).connect(ducking).connect(synthReverbSend);

const arpMeter = new Tone.Meter().connect(arpMute);

const arp1 = new Tone.MonoSynth({
  oscillator: {
    type: "sawtooth"
  },
  envelope: {
    attack: 0.01,
    decay: "16n",
    sustain: 0,
    release: 0.1
  },
}).connect(arpMeter);

const arpPatches = [
  arp1,
]

const leadMute = new Tone.Gain(1).connect(ducking).connect(synthReverbSend)

const leadMeter = new Tone.Meter().connect(leadMute);

const lead1 = new Tone.DuoSynth({
  vibratoRate: 8,
  vibratoAmount: 0.3,
  harmonicity: 1.5,
  voice0: {
    volume: -10,
    portamento: 0.05,
    oscillator: {
      type: "sawtooth"
    },
    filterEnvelope: {
      attack: 0.5,
      decay: 0.5,
      sustain: 0.5,
      release: 0.5,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2
    },
    envelope: {
      attack: 0.01,
      decay: "8n",
      sustain: 0,
      release: 0.1
    }
  },
}).connect(leadMeter);

const leadPatches = [
  lead1,
]

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      began: false,
      showHelp: false,
      playing: false,
      paused: false,
      time: "0:0:0",
      bpm: 110,
      pages: 4,
      activePage: 0,
      viewingPage: 0,
      autoFollow: true,
      activeStep: 0,
      selected: [0, 0],
      defaultOctave: 4,
      defaultVelocity: 1,
      defaultDuration: 1,
      mutes: [
        false,
        false,
        false,
        false,
        false
      ],
      activePatchMap: [
        0,
        0,
        0,
        0,
        0
      ],
      sequences: {
        "00 Ducking": [
          ["0:0:0", "C5"],
          ["0:1:0", "C5"],
          ["0:2:0", "C5"],
          ["0:3:0", "C5"],
          ["1:0:0", "C5"],
          ["1:1:0", "C5"],
          ["1:2:0", "C5"],
          ["1:3:0", "C5"],
          ["2:0:0", "C5"],
          ["2:1:0", "C5"],
          ["2:2:0", "C5"],
          ["2:3:0", "C5"],
          ["3:0:0", "C5"],
          ["3:1:0", "C5"],
          ["3:2:0", "C5"],
          ["3:3:0", "C5"],
        ],
        "01-0 Kick": [
          ["0:0:0", "C5"],     
          ["0:1:0", "C5"], 
          ["0:2:0", "C5"], 
          ["0:3:0", "C5"], 
          ["1:0:0", "C5"], 
          ["1:1:0", "C5"], 
          ["1:2:0", "C5"], 
          ["1:3:0", "C5"], 
          ["2:0:0", "C5"], 
          ["2:1:0", "C5"], 
          ["2:2:0", "C5"], 
          ["2:3:0", "C5"], 
          ["3:0:0", "C5"], 
          ["3:1:0", "C5"], 
          ["3:2:0", "C5"], 
          ["3:3:0", "C5"],
          ["3:3:1", "C5"], 
          ["3:3:3", "C5"], 
        ],
        "01-1 Snare": [
          ["0:1:0", "D5"],
          ["0:3:0", "D5"],
          ["1:1:0", "D5"], 
          ["1:2:2", "D5"],
          ["1:3:0", "D5"],
          ["2:1:0", "D5"], 
          ["2:3:0", "D5"],
          ["3:1:0", "D5"], 
          ["3:3:0", "D5"], 
        ],
        "01-2 Hi-Hat": [
          ["0:0:2", "E5"],
          ["0:1:2", "E5"],
          ["0:2:2", "E5"],
          ["0:3:2", "E5"],
          ["1:0:2", "E5"],
          ["1:1:2", "E5"],
          ["1:2:2", "E5"],
          ["1:3:2", "E5"],
          ["2:0:2", "E5"],
          ["2:1:2", "E5"],
          ["2:2:2", "E5"],
          ["2:3:2", "E5"],
          ["3:0:2", "E5"],
          ["3:1:2", "E5"],
          ["3:2:2", "E5"],
          ["3:3:2", "E5"],
        ],
        "01-3 Perc": [

        ],
        "02 Bass": [
          {time: "0:0:0", note: "A1", velocity: 1, duration: 2},
          {time: "0:0:2", note: "A2", velocity: 1, duration: 2},
          {time: "0:0:4", note: "A1", velocity: 1, duration: 2},
          {time: "0:0:6", note: "A2", velocity: 1, duration: 2},
          {time: "0:0:8", note: "A1", velocity: 1, duration: 1},
          {time: "0:0:9", note: "A1", velocity: 0.5, duration: 1},
          {time: "0:0:10", note: "A2", velocity: 1, duration: 1},
          {time: "0:0:11", note: "A2", velocity: 0.5, duration: 1},
          {time: "0:0:12", note: "A1", velocity: 1, duration: 2},
          {time: "0:0:14", note: "A2", velocity: 1, duration: 2},
          {time: "1:0:0", note: "A1", velocity: 1, duration: 2},
          {time: "1:0:2", note: "A2", velocity: 1, duration: 2},
          {time: "1:0:4", note: "A1", velocity: 1, duration: 2},
          {time: "1:0:6", note: "A2", velocity: 1, duration: 2},
          {time: "1:0:8", note: "A1", velocity: 1, duration: 1},
          {time: "1:0:9", note: "A1", velocity: 0.5, duration: 1},
          {time: "1:0:10", note: "A2", velocity: 1, duration: 1},
          {time: "1:0:11", note: "A2", velocity: 0.5, duration: 1},
          {time: "1:0:12", note: "C2", velocity: 1, duration: 2},
          {time: "1:0:14", note: "C3", velocity: 1, duration: 2},
          {time: "2:0:0", note: "F1", velocity: 1, duration: 2},
          {time: "2:0:2", note: "F2", velocity: 1, duration: 2},
          {time: "2:0:4", note: "F1", velocity: 1, duration: 2},
          {time: "2:0:6", note: "F2", velocity: 1, duration: 2},
          {time: "2:0:8", note: "F1", velocity: 1, duration: 1},
          {time: "2:0:9", note: "F1", velocity: 0.5, duration: 1},
          {time: "2:0:10", note: "F2", velocity: 1, duration: 1},
          {time: "2:0:11", note: "F2", velocity: 0.5, duration: 1},
          {time: "2:0:12", note: "F1", velocity: 1, duration: 2},
          {time: "2:0:14", note: "F2", velocity: 1, duration: 2},
          {time: "3:0:0", note: "F1", velocity: 1, duration: 2},
          {time: "3:0:2", note: "F2", velocity: 1, duration: 2},
          {time: "3:0:4", note: "F1", velocity: 1, duration: 2},
          {time: "3:0:6", note: "F2", velocity: 1, duration: 2},
          {time: "3:0:8", note: "F1", velocity: 1, duration: 1},
          {time: "3:0:9", note: "F1", velocity: 0.5, duration: 1},
          {time: "3:0:10", note: "F2", velocity: 1, duration: 1},
          {time: "3:0:11", note: "F2", velocity: 0.5, duration: 1},
          {time: "3:0:12", note: "F1", velocity: 1, duration: 2},
          {time: "3:0:14", note: "F2", velocity: 1, duration: 2},
        ],
        "03 Lead": [
          {time: "0:0:0", note: "F4", velocity: 0.2, duration: 6},
          {time: "0:0:6", note: "E4", velocity: 0.2, duration: 6},
          {time: "0:0:12", note: "A3", velocity: 0.2, duration: 4},
          {time: "1:0:0", note: "F4", velocity: 0.2, duration: 6},
          {time: "1:0:6", note: "E4", velocity: 0.2, duration: 6},
          {time: "1:0:12", note: "A4", velocity: 0.2, duration: 4},
          {time: "2:0:0", note: "C5", velocity: 0.2, duration: 6},
          {time: "2:0:6", note: "A4", velocity: 0.2, duration: 6},
          {time: "2:0:12", note: "F4", velocity: 0.2, duration: 4},
          {time: "3:0:0", note: "E4", velocity: 0.2, duration: 6},
          {time: "3:0:6", note: "F4", velocity: 0.2, duration: 6},
          {time: "3:0:12", note: "C4", velocity: 0.2, duration: 4},
        ],
        "04 Arp": [
          {time: "0:0:0", note: "A4", velocity: 1, duration: 1},
          {time: "0:0:1", note: "C5", velocity: 1, duration: 1},
          {time: "0:0:2", note: "E5", velocity: 1, duration: 1},
          {time: "0:0:3", note: "A5", velocity: 1, duration: 1},
          {time: "0:1:0", note: "C5", velocity: 1, duration: 1},
          {time: "0:1:1", note: "E5", velocity: 1, duration: 1},
          {time: "0:1:2", note: "A5", velocity: 1, duration: 1},
          {time: "0:1:3", note: "C6", velocity: 1, duration: 1},
          {time: "0:2:0", note: "E5", velocity: 1, duration: 1},
          {time: "0:2:1", note: "A5", velocity: 1, duration: 1},
          {time: "0:2:2", note: "C6", velocity: 1, duration: 1},
          {time: "0:2:3", note: "E6", velocity: 1, duration: 1},
          {time: "0:3:0", note: "A5", velocity: 1, duration: 1},
          {time: "0:3:1", note: "C6", velocity: 1, duration: 1},
          {time: "0:3:2", note: "E6", velocity: 1, duration: 1},
          {time: "0:3:3", note: "A6", velocity: 1, duration: 1},
          {time: "1:0:0", note: "A4", velocity: 1, duration: 1},
          {time: "1:0:1", note: "C5", velocity: 1, duration: 1},
          {time: "1:0:2", note: "E5", velocity: 1, duration: 1},
          {time: "1:0:3", note: "A5", velocity: 1, duration: 1},
          {time: "1:1:0", note: "C5", velocity: 1, duration: 1},
          {time: "1:1:1", note: "E5", velocity: 1, duration: 1},
          {time: "1:1:2", note: "A5", velocity: 1, duration: 1},
          {time: "1:1:3", note: "C6", velocity: 1, duration: 1},
          {time: "1:2:0", note: "E5", velocity: 1, duration: 1},
          {time: "1:2:1", note: "A5", velocity: 1, duration: 1},
          {time: "1:2:2", note: "C6", velocity: 1, duration: 1},
          {time: "1:2:3", note: "E6", velocity: 1, duration: 1},
          {time: "1:3:0", note: "A5", velocity: 1, duration: 1},
          {time: "1:3:1", note: "C6", velocity: 1, duration: 1},
          {time: "1:3:2", note: "E6", velocity: 1, duration: 1},
          {time: "1:3:3", note: "A6", velocity: 1, duration: 1},
          {time: "2:0:0", note: "A4", velocity: 1, duration: 1},
          {time: "2:0:1", note: "C5", velocity: 1, duration: 1},
          {time: "2:0:2", note: "E5", velocity: 1, duration: 1},
          {time: "2:0:3", note: "A5", velocity: 1, duration: 1},
          {time: "2:1:0", note: "C5", velocity: 1, duration: 1},
          {time: "2:1:1", note: "E5", velocity: 1, duration: 1},
          {time: "2:1:2", note: "A5", velocity: 1, duration: 1},
          {time: "2:1:3", note: "C6", velocity: 1, duration: 1},
          {time: "2:2:0", note: "E5", velocity: 1, duration: 1},
          {time: "2:2:1", note: "A5", velocity: 1, duration: 1},
          {time: "2:2:2", note: "C6", velocity: 1, duration: 1},
          {time: "2:2:3", note: "E6", velocity: 1, duration: 1},
          {time: "2:3:0", note: "A5", velocity: 1, duration: 1},
          {time: "2:3:1", note: "C6", velocity: 1, duration: 1},
          {time: "2:3:2", note: "E6", velocity: 1, duration: 1},
          {time: "2:3:3", note: "A6", velocity: 1, duration: 1},
          {time: "3:0:0", note: "A4", velocity: 1, duration: 1},
          {time: "3:0:1", note: "C5", velocity: 1, duration: 1},
          {time: "3:0:2", note: "E5", velocity: 1, duration: 1},
          {time: "3:0:3", note: "A5", velocity: 1, duration: 1},
          {time: "3:1:0", note: "C5", velocity: 1, duration: 1},
          {time: "3:1:1", note: "E5", velocity: 1, duration: 1},
          {time: "3:1:2", note: "A5", velocity: 1, duration: 1},
          {time: "3:1:3", note: "C6", velocity: 1, duration: 1},
          {time: "3:2:0", note: "E5", velocity: 1, duration: 1},
          {time: "3:2:1", note: "A5", velocity: 1, duration: 1},
          {time: "3:2:2", note: "C6", velocity: 1, duration: 1},
          {time: "3:2:3", note: "E6", velocity: 1, duration: 1},
          {time: "3:3:0", note: "A5", velocity: 1, duration: 1},
          {time: "3:3:1", note: "C6", velocity: 1, duration: 1},
          {time: "3:3:2", note: "E6", velocity: 1, duration: 1},
          {time: "3:3:3", note: "A6", velocity: 1, duration: 1},

        ]
      }
    }

    this.tempoLED = React.createRef();
    this.drumRack = React.createRef();
    this.bassRack = React.createRef();
    this.leadRack = React.createRef();
    this.arpRack = React.createRef();
    this.keysRack = React.createRef();

    this.duckSeq = new Tone.Part((time, note) => {
      ducking.gain.setValueAtTime(0, time);
      ducking.gain.linearRampToValueAtTime(1, "+8n");
    }, this.state.sequences["00 Ducking"]).start(0);

    this.kickSeq = new Tone.Part((time, note) => {
      drums.triggerAttackRelease(note, "16n", time);
    }, this.state.sequences["01-0 Kick"]).start(0);

    this.snareSeq = new Tone.Part((time, note) => {
      drums.triggerAttackRelease(note, "16n", time);
    }, this.state.sequences["01-1 Snare"]).start(0);

    this.hihatSeq = new Tone.Part((time, note) => {
      drums.triggerAttackRelease(note, "16n", time);
    }, this.state.sequences["01-2 Hi-Hat"]).start(0);

    this.percSeq = new Tone.Part((time, note) => {
      drums.triggerAttackRelease(note, "16n", time);
    }, this.state.sequences["01-3 Perc"]).start(0);
    
    this.bassSeq = new Tone.Part((time, value) => {
      bassPatches[this.state.activePatchMap[1]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["02 Bass"]).start(0);
    
    this.arpSeq = new Tone.Part((time, value) => {
      arpPatches[this.state.activePatchMap[3]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["04 Arp"]).start(0);

    this.leadSeq = new Tone.Part((time, value) => {
      leadPatches[this.state.activePatchMap[2]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["03 Lead"]).start(0);

    this.trackMap = [
      null,
      this.bassSeq,
      this.leadSeq,
      this.arpSeq,
      null
    ]

    this.instrumentMap = [
      drums,
      bassPatches,
      leadPatches,
      arpPatches,
      null
    ]

    this.muteNodes = [
      drumMute,
      bassMute,
      leadMute,
      arpMute,
      null
    ]
    
  }

  updateDefaultOctave = (n) => {
    this.setState({defaultOctave: utils.clamp(n, 0, 9)});
  }

  updateDefaultVelocity = (n) => {
    this.setState({defaultVelocity: utils.clamp(n, 0.1, 1)});
  }

  updateDefaultDuration = (n) => {
    this.setState({defaultDuration: utils.clamp(n, 1, 16)});
  }

  moveTo = (n) => {
    this.setState({selected: n});
  }

  moveLeft = () => {
    this.setState({
      selected: [this.state.selected[0] === 0 ? this.trackMap.length - 1 : this.state.selected[0] - 1, this.state.selected[1]]
    });
  }

  moveRight = () => {
    this.setState({
      selected: [this.state.selected[0] === this.trackMap.length - 1 ? 0 : this.state.selected[0] + 1, this.state.selected[1]]
    });
  }

  moveUp = () => {
    this.setState({
      selected: [this.state.selected[0], this.state.selected[1] === 0 ? 15 : this.state.selected[1] - 1]
    });
  }

  moveDown = () => {
    this.setState({
      selected: [this.state.selected[0], this.state.selected[1] === 15 ? 0 : this.state.selected[1] + 1]
    });
  }

  changeDrumPatch = (n) => {
    this.setState({activePatchMap: 
      [
        n, 
        this.state.activePatchMap[1], 
        this.state.activePatchMap[2], 
        this.state.activePatchMap[3], 
        this.state.activePatchMap[4]
      ]
    });
  }

  changeBassPatch = (n) => {
    this.setState({activePatchMap: 
      [
        this.state.activePatchMap[0], 
        n, 
        this.state.activePatchMap[2], 
        this.state.activePatchMap[3], 
        this.state.activePatchMap[4]
      ]
    });
  }

  changeLeadPatch = (n) => {
    this.setState({activePatchMap: 
      [
        this.state.activePatchMap[0], 
        this.state.activePatchMap[1], 
        n, 
        this.state.activePatchMap[3], 
        this.state.activePatchMap[4]
      ]
    });
  }

  changeArpPatch = (n) => {
    this.setState({activePatchMap: 
      [
        this.state.activePatchMap[0], 
        this.state.activePatchMap[1], 
        this.state.activePatchMap[2],
        n, 
        this.state.activePatchMap[4], 
      ]
    });
  }

  previewNote = (instrument, note) => {
    this.instrumentMap[instrument][this.state.activePatchMap[instrument]].triggerAttackRelease(note, "16n");
  }

  keyboardHandler = (e) => {
    const oldNote = this.trackMap[this.state.selected[0]]?.at(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
    e.preventDefault();
    if (e.key === "F5") {
      window.location.reload();
      return;
    }
    if (!this.state.began) {
      this.begin();
      return;
    }
    switch (true) {
      //? Transport
      case (e.key === " "):
        if (this.state.playing) {
          if (e.ctrlKey) {
            this.pause();
          } else {
            this.stop();
          }
        } else {
          this.play();
        }
        break;
    
      //? Cursor movement
      case (e.key === "ArrowLeft"):
        this.moveLeft();
        break;
      case (e.key === "ArrowRight"):
        this.moveRight();
        break;
      case (e.key === "ArrowUp"):
        this.moveUp();
        break;
      case (e.key === "ArrowDown"):
        this.moveDown();
        break;

      //? Rest/Delete
      case (e.key === "Backspace" || e.key === "Delete"):
        this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
        if (e.key === "Delete") {
          this.moveDown();
        } else {
          this.setState({selected: this.state.selected});
        }
        break;
      //? Change page
      case (e.key === "PageDown"):
        this.changeView((this.state.viewingPage + 1) % this.state.pages);
        break;
      case (e.key === "PageUp"):
        this.changeView((this.state.viewingPage - 1 + this.state.pages) % this.state.pages);
        break;
      //? Change octave / velocity
      case ([...Array(10).keys()].map(String).includes(e.key)):
        const newVelocity = (parseInt(e.key) + 1) / 10;
        if (oldNote) {
          if (e.ctrlKey) {
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: oldNote.value.note, 
              velocity: newVelocity, 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
          } else {
            const newNote = oldNote.value.note.replace(/[0-9]/, e.key);
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: newNote, 
              velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
            if (!this.state.playing) {
              this.previewNote(this.state.selected[0], newNote);
            }
          }
          this.moveDown();
        }
        if (e.ctrlKey) {
          this.updateDefaultVelocity(newVelocity);
        } else {
          this.updateDefaultOctave(e.key);
        }
        break;
      //? Octave/velocity down
      case (e.key === "-"):
        if (oldNote) {
          if (e.ctrlKey) {
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: oldNote.value.note, 
              velocity: utils.clamp((oldNote.value.velocity - 0.1).toFixed(1), 0.1, 1), 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
            this.updateDefaultVelocity((oldNote.value.velocity - 0.1).toFixed(1));
          } else {
            const newOctave = parseInt(oldNote.value.note.match(/[0-9]/)[0]) - 1
            const newNote = oldNote.value.note.replace(/[0-9]/, newOctave);
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: newNote, 
              velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
            if (!this.state.playing) {
              this.previewNote(this.state.selected[0], newNote);
            }
            this.updateDefaultOctave(newOctave);
          }
        } else {
          if (e.ctrlKey) {
            this.updateDefaultVelocity((this.state.defaultVelocity - 0.1).toFixed(1));
          } else {
            this.updateDefaultOctave(this.state.defaultOctave - 1);
          }
        }
        break;
      //? Octave/velocity up
      case (e.key === "="):
        if (oldNote) {
          if (e.ctrlKey) {
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: oldNote.value.note, 
              velocity: utils.clamp((parseFloat(oldNote.value.velocity) + 0.1).toFixed(1), 0.1, 1.0), 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
            this.updateDefaultVelocity((parseFloat(oldNote.value.velocity) + 0.1).toFixed(1));
          } else {
            const newOctave = parseInt(oldNote.value.note.match(/[0-9]/)[0]) + 1
            const newNote = oldNote.value.note.replace(/[0-9]/, newOctave);
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              note: newNote, 
              velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
            if (!this.state.playing) {
              this.previewNote(this.state.selected[0], newNote);
            }
            this.updateDefaultOctave(newOctave);
          }
        } else {
          if (e.ctrlKey) {
            this.updateDefaultVelocity((parseFloat(this.state.defaultVelocity) + 0.1).toFixed(1));
          } else {
            this.updateDefaultOctave(this.state.defaultOctave + 1);
          }
        }
        break;
      default:
        //? Add/edit note
        const note = utils.keyboardToNote(e.key, this.state.defaultOctave);
        if (note) {
          const oldNote = this.trackMap[this.state.selected[0]].at(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
            note: note, 
            velocity: oldNote?.value.velocity ?? this.state.defaultVelocity, 
            duration: oldNote?.value.duration ?? this.state.defaultDuration
          });
          if (!this.state.playing) {
            this.previewNote(this.state.selected[0], note);
          }
          this.moveDown();
          break;
        }
        break;
    }
  }

  getActiveStepIndex = () => {
    const { time } = this.state;
    const [pages, beats, steps] = time.split(":").map(Number);
    return pages * 16 + beats * 4 + steps;
  }

  componentDidMount() {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = this.state.pages + "m";
    
    Tone.Transport.bpm.value = this.state.bpm;
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        const activePage = parseInt(Tone.Transport.position.split(":")[0]);
        this.setState({time: Tone.Transport.position.split(".")[0], activePage: activePage, viewingPage: this.state.autoFollow ? activePage : this.state.viewingPage});
      }, time);
    }, "16n");
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        this.tempoLED.current.blinkLed();
      }, time);
    }, "4n");

    setInterval(() => {
      this.drumRack.current.updateValue(drumMeter.getValue());
      this.bassRack.current.updateValue(bassMeter.getValue());
      this.leadRack.current.updateValue(leadMeter.getValue());
      this.arpRack.current.updateValue(arpMeter.getValue());
    }, 33);

    document.addEventListener("keydown", this.keyboardHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyboardHandler);
    this.kickSeq.dispose();
    this.snareSeq.dispose();
    this.hihatSeq.dispose();
    this.percSeq.dispose();
    this.bassSeq.dispose();
    this.arpSeq.dispose();
    this.leadSeq.dispose();
    this.duckSeq.dispose();
  }

  componentDidUpdate() {
    this.muteNodes[0].gain.value = !this.state.mutes[0];
    this.muteNodes[1].gain.value = !this.state.mutes[1];
    this.muteNodes[2].gain.value = !this.state.mutes[2];
    this.muteNodes[3].gain.value = !this.state.mutes[3];
    // this.muteNodes[4].gain.value = !this.state.mutes[4];
  }

  begin = () => {
    Tone.start();
    this.setState({
      began: true
    });
  }

  play = () => {
    Tone.Transport.start();
    this.setState({
      playing: true,
      paused: false,
    });
  }

  pause = () => {
    Tone.Transport.pause();
    this.setState({
      playing: false,
      paused: true,
    });
  }

  stop = () => {
    Tone.Transport.stop();
    this.setState({
      playing: false,
      paused: false,
      time: "0:0:0",
      activePage: 0
    });
  }

  changeBPM = (e) => {
    Tone.Transport.bpm.value = e.target.value;
    this.setState({bpm: e.target.value});
  }

  changeAutoFollow = (e) => {
    this.setState({autoFollow: e.target.checked});
  }

  changeView = (i) => {
    this.setState({viewingPage: i});
  }

  addPage = () => {
    this.setState((state, props) => {
      Tone.Transport.loopEnd = state.pages + 1 + "m";
      return {
        pages: state.pages + 1,
      };
    });
  }

  mute = (n) => {
    this.setState((state, props) => {
      let newMutes = state.mutes;
      newMutes[n] = !newMutes[n];
      return {
        mutes: newMutes
      };
    });
  }

  render() {
    const step = this.getActiveStepIndex();
    return (
      <div className="h-full flex flex-col items-stretch">
        <HelpOverlay onClick={() => this.setState({showHelp: false})} show={this.state.showHelp} />
        <Veil callback={this.begin} visible={this.state.began} />
        <Toolbar>
          <div className="flex flex-row items-center w-1/3">
            <h1 className="m-4 text-2xl font-['Major_Mono_Display']" onClick={() => this.setState({showHelp: true})}>cybertrAcks</h1>
            <div className="flex flex-row items-center">
              <DefaultParameterField min="0" max="9" name="Octave" value={this.state.defaultOctave} color="red" onChange={(e) => this.updateDefaultOctave(e.currentTarget.value)} />
              <DefaultParameterField min="0" max="9" name="Velocity" value={this.state.defaultVelocity * 10 - 1} color="green" onChange={(e) => this.updateDefaultVelocity((parseInt(e.currentTarget.value) + 1) / 10)} />
              <DefaultParameterField min="1" max="64" name="Octave" value={this.state.defaultDuration} color="blue" onChange={(e) => this.updateDefaultDuration(e.currentTarget.value)} />
            </div>
          </div>
          <div className="flex flex-row justify-center items-center justify-self-center">
            <Measurer time={this.state.time} />
            <TransportButton icon="play_arrow" active={this.state.playing} callback={this.play} />
            <TransportButton icon="pause" active={this.state.paused} callback={this.pause} />
            <TransportButton icon="stop" callback={this.stop} />
          </div>
          <div className="flex flex-row justify-end items-center w-1/3 h-full">
            <LED ref={this.tempoLED} />
            <Tempo value={this.state.bpm} onChange={this.changeBPM}></Tempo>
          </div>
        </Toolbar>
        <div className="flex flex-col flex-grow w-full items-stretch">
          <div className="flex flex-row flex-grow items-stretch">
            <DrumTrack number={0} name="Drums" focus={this.state.selected} sequences={[this.duckSeq, this.kickSeq, this.snareSeq, this.hihatSeq, this.percSeq]} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[0]} muteHandler={this.mute}></DrumTrack>
            <Track number={1} name="Bass" focus={this.state.selected} sequence={this.bassSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[1]} muteHandler={this.mute}></Track>
            <Track number={2} name="Lead" focus={this.state.selected} sequence={this.leadSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[2]} muteHandler={this.mute}></Track>
            <Track number={3} name="Arp" focus={this.state.selected} sequence={this.arpSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[3]} muteHandler={this.mute}></Track>
            <Track number={4} name="Keys" focus={this.state.selected} active={step} clickHandler={this.moveTo} muted={this.state.mutes[4]}></Track>
            <Paginator pages={this.state.pages} addPageCallback={this.addPage} activePage={this.state.activePage} viewingPage={this.state.viewingPage} follow={this.state.autoFollow} onChange={this.changeAutoFollow} viewCallback={this.changeView} />
            <div className="flex w-full flex-col justify-self-stretch bg-slate-800">
              <Rack ref={this.drumRack} number={0} name="Drums" activePatch={this.state.activePatchMap[0]} changePatch={this.changeDrumPatch} muted={this.state.mutes[0]} />
              <Rack ref={this.bassRack} number={1} name="Bass" activePatch={this.state.activePatchMap[1]} changePatch={this.changeBassPatch} muted={this.state.mutes[1]} />
              <Rack ref={this.leadRack} number={2} name="Lead" activePatch={this.state.activePatchMap[2]} changePatch={this.changeLeadPatch} muted={this.state.mutes[2]} />
              <Rack ref={this.arpRack} number={3} name="Arp" activePatch={this.state.activePatchMap[3]} changePatch={this.changeArpPatch} muted={this.state.mutes[3]} />
              <Rack number={4} name="Keys" activePatch={this.state.activeKeysPatch} muted={this.state.mutes[4]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
