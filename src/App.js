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
import linnPerc from "./assets/LinnDrum Conga Tuning 8.wav";
import linnCrash from "./assets/LinnDrum Crash.wav"

const globalComp = new Tone.Compressor(-20, 4).toDestination();

const ducking = new Tone.Gain(1).connect(globalComp);

const reverbSend = new Tone.Reverb(3).connect(ducking);
// const synthDelaySend = new Tone.FeedbackDelay("8n", 0.5).connect(ducking);

const drumReverbGate = new Tone.Gain(0).connect(reverbSend);

const drumMeter = new Tone.Meter().connect(drumReverbGate).connect(globalComp);

const drumMute = new Tone.Gain(1).connect(drumMeter);

const drums1 = new Tone.Sampler({
  C5: linnKick,
  D5: linnSnare,
  E5: linnHhClosed,
  F5: linnPerc,
  G5: linnCrash
}).connect(drumMute);

const drumPatches = [
  drums1
];

const bassReverbGate = new Tone.Gain(0).connect(reverbSend);

const bassMeter = new Tone.Meter().connect(bassReverbGate).connect(ducking);

const bassMute = new Tone.Gain(1).connect(bassMeter);

const bass1dist = new Tone.Distortion(0.8).connect(bassMute);

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

const bass2filter = new Tone.Filter("2000Hz", "lowpass").connect(bassMute);

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

const arpReverbGate = new Tone.Gain(1).connect(reverbSend);

const arpMeter = new Tone.Meter().connect(arpReverbGate).connect(ducking);

const arpMute = new Tone.Gain(1).connect(arpMeter);

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
}).connect(arpMute);

const arpPatches = [
  arp1,
]

const leadReverbGate = new Tone.Gain(1).connect(reverbSend);

const leadMeter = new Tone.Meter().connect(leadReverbGate).connect(ducking);

const leadMute = new Tone.Gain(1).connect(leadMeter);

const leadPre = new Tone.Gain(0.5).connect(leadMute);

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
}).connect(leadPre);

const leadPatches = [
  lead1,
]

const keysReverbGate = new Tone.Gain(1).connect(reverbSend);

const keysMeter = new Tone.Meter().connect(keysReverbGate).connect(ducking);

const keysMute = new Tone.Gain(1).connect(keysMeter);

const keysPre = new Tone.Gain(0.5).connect(keysMute)

const keysChorus = new Tone.Chorus(20, 4, 4).connect(keysPre)

const keysVibrato = new Tone.Vibrato(4, 0.1).connect(keysChorus);

const keys1 = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: "sawtooth"
  },
  filter: {
    frequency: 400,
    type: "lowpass",
    rolloff: -24,
    Q: 0
  },
  filterEnvelope: {
    attack: 0.005,
    decay: 2,
    sustain: 0,
    release: 3,
    baseFrequency: 400,
    octaves: 4,
    exponent: 1
  },
  envelope: {
    attack: 0.01,
    decay: 2,
    sustain: 0,
    release: 3,
  }
}).connect(keysVibrato);

const keysPatches = [
  keys1
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
      volumes: [
        1.0,
        1.0,
        1.0,
        1.0,
        1.0
      ],
      reverb: [
        false,
        false,
        true,
        true,
        true
      ],
      ducking: [
        null,
        true,
        true,
        true,
        true
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
          {time: "0:0:0", note: "C5"},
          {time: "0:1:0", note: "C5"},
          {time: "0:2:0", note: "C5"},
          {time: "0:3:0", note: "C5"},
          {time: "1:0:0", note: "C5"},
          {time: "1:1:0", note: "C5"},
          {time: "1:2:0", note: "C5"},
          {time: "1:3:0", note: "C5"},
          {time: "2:0:0", note: "C5"},
          {time: "2:1:0", note: "C5"},
          {time: "2:2:0", note: "C5"},
          {time: "2:3:0", note: "C5"},
          {time: "3:0:0", note: "C5"},
          {time: "3:1:0", note: "C5"},
          {time: "3:2:0", note: "C5"},
          {time: "3:3:0", note: "C5"},
        ],
        "01-0 Kick": [
          {time: "0:0:0", note: "C5"},     
          {time: "0:1:0", note: "C5"}, 
          {time: "0:2:0", note: "C5"}, 
          {time: "0:3:0", note: "C5"}, 
          {time: "1:0:0", note: "C5"}, 
          {time: "1:1:0", note: "C5"}, 
          {time: "1:2:0", note: "C5"}, 
          {time: "1:3:0", note: "C5"}, 
          {time: "2:0:0", note: "C5"}, 
          {time: "2:1:0", note: "C5"}, 
          {time: "2:2:0", note: "C5"}, 
          {time: "2:3:0", note: "C5"}, 
          {time: "3:0:0", note: "C5"}, 
          {time: "3:1:0", note: "C5"}, 
          {time: "3:2:0", note: "C5"}, 
          {time: "3:3:0", note: "C5"},
          {time: "3:3:1", note: "C5"}, 
          {time: "3:3:3", note: "C5"}, 
        ],
        "01-1 Snare": [
          {time: "0:1:0", note: "D5"},
          {time: "0:3:0", note: "D5"},
          {time: "1:1:0", note: "D5"}, 
          {time: "1:2:2", note: "D5"},
          {time: "1:3:0", note: "D5"},
          {time: "2:1:0", note: "D5"}, 
          {time: "2:3:0", note: "D5"},
          {time: "3:1:0", note: "D5"}, 
          {time: "3:3:0", note: "D5"}, 
        ],
        "01-2 Hi-Hat": [
          {time: "0:0:2", note: "E5"},
          {time: "0:1:2", note: "E5"},
          {time: "0:2:2", note: "E5"},
          {time: "0:3:2", note: "E5"},
          {time: "1:0:2", note: "E5"},
          {time: "1:1:2", note: "E5"},
          {time: "1:2:2", note: "E5"},
          {time: "1:3:2", note: "E5"},
          {time: "2:0:2", note: "E5"},
          {time: "2:1:2", note: "E5"},
          {time: "2:2:2", note: "E5"},
          {time: "2:3:2", note: "E5"},
          {time: "3:0:2", note: "E5"},
          {time: "3:1:2", note: "E5"},
          {time: "3:2:2", note: "E5"},
          {time: "3:3:2", note: "E5"},
        ],
        "01-3 Perc": [
          {time: "0:0:3", note: "F5"},
          {time: "0:0:6", note: "F5"},
          {time: "0:0:11", note: "F5"},
          {time: "0:0:14", note: "F5"},
          {time: "0:0:19", note: "F5"},
          {time: "0:0:22", note: "F5"},
          {time: "0:0:27", note: "F5"},
          {time: "0:0:30", note: "F5"},
          {time: "0:0:35", note: "F5"},
          {time: "0:0:38", note: "F5"},
          {time: "0:0:43", note: "F5"},
          {time: "0:0:46", note: "F5"},
          {time: "0:0:51", note: "F5"},
          {time: "0:0:54", note: "F5"},
          {time: "0:0:59", note: "F5"},
          {time: "0:0:62", note: "F5"}
        ],
        "01-4 Crash": [
          {time: "0:0:0", note: "G5"}
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
          {time: "0:0:0", note: "F4", velocity: 0.6, duration: 6},
          {time: "0:0:6", note: "E4", velocity: 0.6, duration: 6},
          {time: "0:0:12", note: "A3", velocity: 0.6, duration: 4},
          {time: "1:0:0", note: "F4", velocity: 0.6, duration: 6},
          {time: "1:0:6", note: "E4", velocity: 0.6, duration: 6},
          {time: "1:0:12", note: "A4", velocity: 0.6, duration: 4},
          {time: "2:0:0", note: "C5", velocity: 0.6, duration: 6},
          {time: "2:0:6", note: "A4", velocity: 0.6, duration: 6},
          {time: "2:0:12", note: "F4", velocity: 0.6, duration: 4},
          {time: "3:0:0", note: "E4", velocity: 0.6, duration: 6},
          {time: "3:0:6", note: "F4", velocity: 0.6, duration: 6},
          {time: "3:0:12", note: "C4", velocity: 0.6, duration: 4},
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
        ],
        "05 Keys": [
          {time: "1:1:0", note: "C6", velocity: 0.6, duration: 8},
          {time: "1:2:0", note: "B5", velocity: 0.6, duration: 8},
          {time: "1:3:0", note: "G5", velocity: 0.6, duration: 8},
          {time: "2:0:0", note: "A5", velocity: 0.6, duration: 8},
        ]
      }
    }

    this.tempoLED = React.createRef();
    this.drumRack = React.createRef();
    this.bassRack = React.createRef();
    this.leadRack = React.createRef();
    this.arpRack = React.createRef();
    this.keysRack = React.createRef();

    this.duckSeq = new Tone.Part((time, value) => {
      ducking.gain.setValueAtTime(0, time);
      ducking.gain.linearRampToValueAtTime(1, `+${Tone.Time(Tone.Time("8n")).toSeconds() - 0.05}`);
    }, this.state.sequences["00 Ducking"]).start(0);

    this.kickSeq = new Tone.Part((time, value) => {
      drumPatches[this.state.activePatchMap[0]].triggerAttackRelease(value.note, "16n", time);
    }, this.state.sequences["01-0 Kick"]).start(0);

    this.snareSeq = new Tone.Part((time, value) => {
      drumPatches[this.state.activePatchMap[0]].triggerAttackRelease(value.note, "16n", time);
    }, this.state.sequences["01-1 Snare"]).start(0);

    this.hihatSeq = new Tone.Part((time, value) => {
      drumPatches[this.state.activePatchMap[0]].triggerAttackRelease(value.note, "16n", time);
    }, this.state.sequences["01-2 Hi-Hat"]).start(0);

    this.percSeq = new Tone.Part((time, value) => {
      drumPatches[this.state.activePatchMap[0]].triggerAttackRelease(value.note, "16n", time);
    }, this.state.sequences["01-3 Perc"]).start(0);

    this.crashSeq = new Tone.Part((time, value) => {
      drumPatches[this.state.activePatchMap[0]].triggerAttackRelease(value.note, "1n", time, 0.4);
    }, this.state.sequences["01-4 Crash"]).start(0);
    
    this.bassSeq = new Tone.Part((time, value) => {
      bassPatches[this.state.activePatchMap[1]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["02 Bass"]).start(0);

    this.leadSeq = new Tone.Part((time, value) => {
      leadPatches[this.state.activePatchMap[2]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["03 Lead"]).start(0);
    
    this.arpSeq = new Tone.Part((time, value) => {
      arpPatches[this.state.activePatchMap[3]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["04 Arp"]).start(0);

    this.keysSeq = new Tone.Part((time, value) => {
      keysPatches[this.state.activePatchMap[4]].triggerAttackRelease(value.note, utils.sixteenthsToNotation(value.duration), time, value.velocity);
    }, this.state.sequences["05 Keys"]).start(0);

    this.trackMap = [
      null,
      this.bassSeq,
      this.leadSeq,
      this.arpSeq,
      this.keysSeq
    ];

    this.instrumentMap = [
      drumPatches,
      bassPatches,
      leadPatches,
      arpPatches,
      keysPatches
    ];

    this.drumMap = [
      this.duckSeq,
      this.kickSeq,
      this.snareSeq,
      this.hihatSeq,
      this.percSeq,
      this.crashSeq
    ];

    this.muteNodes = [
      drumMute,
      bassMute,
      leadMute,
      arpMute,
      keysMute
    ];
    
    this.reverbNodes = [
      drumReverbGate,
      bassReverbGate,
      leadReverbGate,
      arpReverbGate,
      keysReverbGate
    ]
  }

  updateDefaultOctave = (n) => {
    this.setState({defaultOctave: utils.clamp(n, 0, 9)});
  }

  updateDefaultVelocity = (n) => {
    this.setState({defaultVelocity: utils.clamp(n, 0.1, 1)});
  }

  updateDefaultDuration = (n) => {
    this.setState({defaultDuration: utils.clamp(n, 1, 64)});
  }

  moveTo = (n) => {
    this.setState({selected: n});
  }

  moveInPlace = () => {
    this.setState((state, props) => {
      return {selected: state.selected}
    });
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

  changeKeysPatch = (n) => {
    this.setState({activePatchMap: 
      [
        this.state.activePatchMap[0], 
        this.state.activePatchMap[1], 
        this.state.activePatchMap[2],
        this.state.activePatchMap[3], 
        n, 
      ]
    });
  }

  previewNote = (instrument, note) => {
    this.instrumentMap[instrument][this.state.activePatchMap[instrument]].triggerAttackRelease(note, "16n");
  }

  keyboardHandler = (e) => {
    if (document.activeElement?.tagName.toLowerCase() === "input") {
      if (e.key === "Enter") {
        document.activeElement?.blur();
      }
      return;
    }
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
        if (this.state.selected[0] === 0) {
          this.duckSeq.remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16))
          this.kickSeq.remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16))
          this.snareSeq.remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16))
          this.hihatSeq.remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16))
          this.percSeq.remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16))
        } else {
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
        }
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
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
              note: oldNote.value.note, 
              velocity: newVelocity, 
              duration: oldNote.value.duration ?? this.state.defaultDuration
            });
          } else {
            const newNote = oldNote.value.note.replace(/[0-9]/, e.key);
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
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
      //? Change length
      case (utils.lengthLetters.includes(e.key)):
        const newDuration = utils.lengthLetters.indexOf(e.key) + 1;
        if (oldNote) {
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
            time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
            note: oldNote.value.note, 
            velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
            duration: newDuration
          });
          this.moveDown();
        }
        this.updateDefaultDuration(newDuration);
        break;
      //? Octave/velocity down
      case (e.key === "-"):
        if (oldNote) {
          if (e.ctrlKey) {
            this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
            this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
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
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
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
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
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
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
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
      //? Length down
      case (e.key === "_"):
        if (oldNote) {
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
            time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
            note: oldNote.value.note, 
            velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
            duration: utils.clamp((oldNote.value.duration - 1), 1, 64)
          });
          this.updateDefaultDuration(oldNote.value.duration - 1);
        } else {
          this.updateDefaultDuration(this.state.defaultDuration - 1);
        }
        break;
      //? Length up
      case (e.key === "+"):
        if (oldNote) {
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
            time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
            note: oldNote.value.note, 
            velocity: oldNote.value.velocity ?? this.state.defaultVelocity, 
            duration: utils.clamp((oldNote.value.duration + 1), 1, 64)
          });
          this.updateDefaultDuration(oldNote.value.duration + 1);
        } else {
          this.updateDefaultDuration(this.state.defaultDuration + 1);
        }
        break;
      default:
        //? Add/edit note
        const note = utils.keyboardToNote(e.key, this.state.defaultOctave);
        if (note) {
          const oldNote = this.trackMap[this.state.selected[0]].at(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          this.trackMap[this.state.selected[0]].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
            time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
            note: note, 
            velocity: oldNote?.value.velocity ?? this.state.defaultVelocity, 
            duration: oldNote?.value.duration ?? this.state.defaultDuration
          });
          if (!this.state.playing) {
            this.previewNote(this.state.selected[0], note);
          }
          this.moveDown();
        } else if (utils.drumLetters.includes(e.key)) {
          const drum = utils.keyboardToDrum(e.key)
          const index = utils.drumLetters.indexOf(e.key);
          const oldNote = this.drumMap[index].at(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          if (oldNote) {
            this.drumMap[index].remove(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16));
          } else {
            this.drumMap[index].add(utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16), {
              time: utils.sixteenthsToNotation(this.state.selected[1] + this.state.viewingPage * 16),
              note: drum
            });
          }
        }
        this.moveInPlace();
        break;
    }
  }

  getActiveStepIndex = () => {
    const { time } = this.state;
    const [pages, beats, steps] = time.split(":").map(Number);
    return pages * 16 + beats * 4 + steps;
  }

  updateMeters = () => {
    this.drumRack.current.updateValue(drumMeter.getValue());
    this.bassRack.current.updateValue(bassMeter.getValue());
    this.leadRack.current.updateValue(leadMeter.getValue());
    this.arpRack.current.updateValue(arpMeter.getValue());
    this.keysRack.current.updateValue(keysMeter.getValue());
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

    this.meterInterval = setInterval(this.updateMeters, 33);

    document.addEventListener("keydown", this.keyboardHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyboardHandler);
    clearInterval(this.meterInterval);
    this.kickSeq.dispose();
    this.snareSeq.dispose();
    this.hihatSeq.dispose();
    this.percSeq.dispose();
    this.crashSeq.dispose();
    this.bassSeq.dispose();
    this.arpSeq.dispose();
    this.leadSeq.dispose();
    this.keysSeq.dispose();
    this.duckSeq.dispose();
  }

  componentDidUpdate() {
    this.muteNodes[0].gain.value = this.state.volumes[0] * !this.state.mutes[0];
    this.muteNodes[1].gain.value = this.state.volumes[1] * !this.state.mutes[1];
    this.muteNodes[2].gain.value = this.state.volumes[2] * !this.state.mutes[2];
    this.muteNodes[3].gain.value = this.state.volumes[3] * !this.state.mutes[3];
    this.muteNodes[4].gain.value = this.state.volumes[4] * !this.state.mutes[4];

    this.reverbNodes[0].gain.value = this.state.reverb[0];
    this.reverbNodes[1].gain.value = this.state.reverb[1];
    this.reverbNodes[2].gain.value = this.state.reverb[2];
    this.reverbNodes[3].gain.value = this.state.reverb[3];
    this.reverbNodes[4].gain.value = this.state.reverb[4];
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

  removePage = () => {
    this.setState((state, props) => {
      Tone.Transport.loopEnd = state.pages - 1 + "m";
      return {
        pages: state.pages - 1,
      };
    });
  }

  mute = (n, click) => {
    this.setState((state, props) => {
      return {
        mutes: click?.button === 1 ? state.mutes.map((v, i) => i === n ? v : !v) : state.mutes.map((v, i) => i === n ? !v : v)
      };
    });
  }

  toggleReverb = (n) => {
    this.setState((state, props) => {
      return {
        reverb: state.reverb.map((v, i) => i === n ? !v : v)
      };
    });
  }

  changeVolume = (n, value) => {
    document.activeElement?.blur();
    this.setState((state, props) => {
      let newVolumes = state.volumes;
      newVolumes[n] = value;
      return {
        volumes: newVolumes
      }
    }); 
  }

  // dumb

  export = () => {
    let state = this.state;
    state.sequences["00 Ducking"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.duckSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["00 Ducking"].push(val);
      }
    }
    state.sequences["01-0 Kick"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.kickSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["01-0 Kick"].push(val);
      }
    }
    state.sequences["01-1 Snare"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.snareSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["01-1 Snare"].push(val);
      }
    }
    state.sequences["01-2 Hi-Hat"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.hihatSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["01-2 Hi-Hat"].push(val);
      }
    }
    state.sequences["01-3 Perc"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.percSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["01-3 Perc"].push(val);
      }
    }
    state.sequences["01-4 Crash"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.crashSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["01-4 Crash"].push(val);
      }
    }
    state.sequences["02 Bass"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.bassSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["02 Bass"].push(val);
      }
    }
    state.sequences["03 Lead"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.leadSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["03 Lead"].push(val);
      }
    }
    state.sequences["04 Arp"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.arpSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["04 Arp"].push(val);
      }
    }
    state.sequences["05 Keys"] = [];
    for (let i = 0; i < 128; i++) {
      let val = this.keysSeq.at(`0:0:${i}`)?.value;
      if (val) {
        state.sequences["05 Keys"].push(val);
      }
    }

    state.showHelp = false;
    state.playing = false;
    state.paused = false;
    state.time = "0:0:0";

    const blob = new Blob([JSON.stringify(state)], {type: 'application/json'});
    const elem = document.createElement("a");
    elem.href = URL.createObjectURL(blob, {oneTimeOnly: true});
    elem.download = "untitled.json.cbt";
    elem.style.display = "none";
    elem.click();
  }

  import = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".cbt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const newState = JSON.parse(reader.result);
        this.duckSeq.clear();
        newState.sequences["00 Ducking"].forEach(event => {
          this.duckSeq.add(event);
        });
        this.kickSeq.clear();
        newState.sequences["01-0 Kick"].forEach(event => {
          this.kickSeq.add(event);
        });
        this.snareSeq.clear();
        newState.sequences["01-1 Snare"].forEach(event => {
          this.snareSeq.add(event);
        });
        this.hihatSeq.clear();
        newState.sequences["01-2 Hi-Hat"].forEach(event => {
          this.hihatSeq.add(event);
        });
        this.percSeq.clear();
        newState.sequences["01-3 Perc"].forEach(event => {
          this.percSeq.add(event);
        });
        this.crashSeq.clear();
        newState.sequences["01-4 Crash"].forEach(event => {
          this.crashSeq.add(event);
        });
        this.bassSeq.clear();
        newState.sequences["02 Bass"].forEach(event => {
          this.bassSeq.add(event);
        });
        this.leadSeq.clear();
        newState.sequences["03 Lead"].forEach(event => {
          this.leadSeq.add(event);
        });
        this.arpSeq.clear();
        newState.sequences["04 Arp"].forEach(event => {
          this.arpSeq.add(event);
        });
        this.keysSeq.clear();
        newState.sequences["05 Keys"].forEach(event => {
          this.keysSeq.add(event);
        });

        this.drumRack.current.updateVolumeSlider(newState.volumes[0]);
        this.bassRack.current.updateVolumeSlider(newState.volumes[1]);
        this.leadRack.current.updateVolumeSlider(newState.volumes[2]);
        this.arpRack.current.updateVolumeSlider(newState.volumes[3]);
        this.keysRack.current.updateVolumeSlider(newState.volumes[4]);

        this.setState(newState);
      });
      reader.readAsText(file);
      e.target.value = null;
    }
    input.click();
  }

  render() {
    const step = this.getActiveStepIndex();
    return (
      <div className="h-full flex flex-col items-stretch">
        <HelpOverlay onClick={() => this.setState({showHelp: false})} exportCallback={this.export} importCallback={this.import} show={this.state.showHelp} />
        <Veil callback={this.begin} visible={this.state.began} />
        <Toolbar>
          <div className="flex flex-row items-center w-1/3">
            <h1 className="m-4 text-2xl font-['Major_Mono_Display']" onClick={() => this.setState({showHelp: true})}>cybertrAcks</h1>
            <div className="flex flex-row items-center">
              <DefaultParameterField min="0" max="9" name="Octave" value={this.state.defaultOctave} color="red" onChange={(e) => this.updateDefaultOctave(e.currentTarget.value)} />
              <DefaultParameterField min="0" max="9" name="Velocity" value={this.state.defaultVelocity * 10 - 1} color="green" onChange={(e) => this.updateDefaultVelocity((parseInt(e.currentTarget.value) + 1) / 10)} />
              <DefaultParameterField min="1" max="64" name="Length" value={this.state.defaultDuration} color="blue" onChange={(e) => this.updateDefaultDuration(e.currentTarget.value)} />
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
            <DrumTrack number={0} name="Drums" focus={this.state.selected} sequences={[this.duckSeq, this.kickSeq, this.snareSeq, this.hihatSeq, this.percSeq, this.crashSeq]} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[0]} muteHandler={this.mute}></DrumTrack>
            <Track number={1} name="Bass" focus={this.state.selected} sequence={this.bassSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[1]} muteHandler={this.mute}></Track>
            <Track number={2} name="Lead" focus={this.state.selected} sequence={this.leadSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[2]} muteHandler={this.mute}></Track>
            <Track number={3} name="Arp" focus={this.state.selected} sequence={this.arpSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[3]} muteHandler={this.mute}></Track>
            <Track number={4} name="Keys" focus={this.state.selected} sequence={this.keysSeq} active={step} page={this.state.viewingPage} clickHandler={this.moveTo} muted={this.state.mutes[4]} muteHandler={this.mute}></Track>
            <Paginator pages={this.state.pages} addPageCallback={this.addPage} removePageCallback={this.removePage} activePage={this.state.activePage} viewingPage={this.state.viewingPage} follow={this.state.autoFollow} onChange={this.changeAutoFollow} viewCallback={this.changeView} />
            <div className="flex w-full flex-col justify-self-stretch bg-slate-800">
              <Rack ref={this.drumRack} number={0} name="Drums" patches={drumPatches.length} activePatch={this.state.activePatchMap[0]} activeReverb={this.state.reverb[0]} reverbHandler={this.toggleReverb} changePatch={this.changeDrumPatch} changeVolume={this.changeVolume} muted={this.state.mutes[0]} />
              <Rack ref={this.bassRack} number={1} name="Bass" patches={bassPatches.length} activePatch={this.state.activePatchMap[1]} activeReverb={this.state.reverb[1]} reverbHandler={this.toggleReverb} activeDucking={this.state.ducking[1]} changePatch={this.changeBassPatch} changeVolume={this.changeVolume} muted={this.state.mutes[1]} />
              <Rack ref={this.leadRack} number={2} name="Lead" patches={leadPatches.length} activePatch={this.state.activePatchMap[2]} activeReverb={this.state.reverb[2]} reverbHandler={this.toggleReverb} activeDucking={this.state.ducking[2]} changePatch={this.changeLeadPatch} changeVolume={this.changeVolume} muted={this.state.mutes[2]} />
              <Rack ref={this.arpRack} number={3} name="Arp" patches={arpPatches.length} activePatch={this.state.activePatchMap[3]} activeReverb={this.state.reverb[3]} reverbHandler={this.toggleReverb} activeDucking={this.state.ducking[3]} changePatch={this.changeArpPatch} changeVolume={this.changeVolume} muted={this.state.mutes[3]} />
              <Rack ref={this.keysRack} number={4} name="Keys" patches={keysPatches.length} activePatch={this.state.activePatchMap[4]} activeReverb={this.state.reverb[4]} reverbHandler={this.toggleReverb} activeDucking={this.state.ducking[4]} changeVolume={this.changeVolume} muted={this.state.mutes[4]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
