function sixteenthsToNotation(t) {
    return `0:0:${t}`;
}

function notationToSixteenths(t) {
    const [page, beat, sixteenth] = t.split(":");
    return parseInt(page) * 16 * 4 + parseInt(beat) * 4 + parseInt(sixteenth);
}

function keyboardToNote(key, octave) {
    octave = parseInt(octave);
    switch (key) {
        case "z":
            return "C" + octave;
        case "s":
            return "C#" + octave;
        case "x":
            return "D" + octave;
        case "d":
            return "D#" + octave;
        case "c":
            return "E" + octave;
        case "v":
            return "F" + octave;
        case "g":
            return "F#" + octave;
        case "b":
            return "G" + octave;
        case "h":
            return "G#" + octave;
        case "n":
            return "A" + octave;
        case "j":
            return "A#" + octave;
        case "m":
            return "B" + octave;
        case ",":
            return "C" + (octave + 1);
        case "l":
            return "C#" + (octave + 1);
        case ".":
            return "D" + (octave + 1);
        case ";":
            return "D#" + (octave + 1);
        case "/":
            return "E" + (octave + 1); 
        default:
            break;
    }
}

const drumLetters = ["q", "w", "e", "r", "t", "y"];

function keyboardToDrum(key) {
    switch (key) {
        case "q":
            return "C5";
        case "w":
            return "C5";
        case "e":
            return "D5";
        case "r":
            return "E5";
        case "t":
            return "F5";
        case "y":
            return "G5";
        default:
            break;
    }
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export default {sixteenthsToNotation, notationToSixteenths, keyboardToNote, clamp, drumLetters, keyboardToDrum};