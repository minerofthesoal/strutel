// ============================================================
//  ꩜  S T R U T E L  —  MakeCode Extension
//  A near 1-to-1 Strudel music language for micro:bit / MakeCode
//  Supports: sounds, notes, scales, effects, signals, patterns,
//            mini-notation, ADSR, reverb, delay, pan, and more.
// ============================================================

//% color="#7B2FBE"
//% icon="\uf001"
//% block="Strutel"
//% weight=100
namespace strutel {

    // ─────────────────────────────────────────────────────────
    //  INTERNAL STATE
    // ─────────────────────────────────────────────────────────

    let _bpm: number = 120;
    let _cpm: number = 30;          // cycles per minute (default)
    let _playing: boolean = false;
    let _patternQueue: StrutelPattern[] = [];
    let _globalGain: number = 1.0;

    // ─────────────────────────────────────────────────────────
    //  ENUMS  (all used in blocks)
    // ─────────────────────────────────────────────────────────

    /** Drum / percussion sounds */
    export enum DrumSound {
        //% block="bass drum (bd)"
        BassDrum = 0,
        //% block="snare drum (sd)"
        SnareDrum = 1,
        //% block="hi-hat (hh)"
        HiHat = 2,
        //% block="open hi-hat (oh)"
        OpenHiHat = 3,
        //% block="rimshot (rim)"
        Rimshot = 4,
        //% block="low tom (lt)"
        LowTom = 5,
        //% block="mid tom (mt)"
        MidTom = 6,
        //% block="high tom (ht)"
        HighTom = 7,
        //% block="ride cymbal (rd)"
        Ride = 8,
        //% block="crash cymbal (cr)"
        Crash = 9,
        //% block="clap (cp)"
        Clap = 10,
        //% block="closed hi-hat (chh)"
        ClosedHiHat = 11
    }

    /** Standard synth / melodic sounds */
    export enum SynthSound {
        //% block="sawtooth"
        Sawtooth = 0,
        //% block="square"
        Square = 1,
        //% block="triangle"
        Triangle = 2,
        //% block="sine"
        Sine = 3,
        //% block="piano"
        Piano = 4,
        //% block="casio"
        Casio = 5,
        //% block="metal"
        Metal = 6,
        //% block="jazz"
        Jazz = 7,
        //% block="wind"
        Wind = 8,
        //% block="space"
        Space = 9,
        //% block="insect"
        Insect = 10,
        //% block="crow"
        Crow = 11,
        //% block="east"
        East = 12,
        //% block="numbers"
        Numbers = 13,
        //% block="acoustic bass"
        AcousticBass = 14,
        //% block="electric guitar muted"
        ElectricGuitarMuted = 15,
        //% block="voice oohs"
        VoiceOohs = 16,
        //% block="accordion"
        Accordion = 17,
        //% block="xylophone"
        Xylophone = 18,
        //% block="synth bass"
        SynthBass = 19,
        //% block="synth strings"
        SynthStrings = 20,
        //% block="blown bottle"
        BlownBottle = 21
    }

    /** Drum machine banks */
    export enum DrumBank {
        //% block="Roland TR-909"
        RolandTR909 = 0,
        //% block="Roland TR-808"
        RolandTR808 = 1,
        //% block="Roland TR-707"
        RolandTR707 = 2,
        //% block="Roland TR-505"
        RolandTR505 = 3,
        //% block="Akai Linn"
        AkaiLinn = 4,
        //% block="Rhythm Ace"
        RhythmAce = 5,
        //% block="Visco Space Drum"
        ViscoSpaceDrum = 6,
        //% block="Casio RZ-1"
        CasioRZ1 = 7,
        //% block="Roland Compurhythm 1000"
        RolandCompurhythm1000 = 8
    }

    /** Musical note letters */
    export enum NoteLetterEnum {
        //% block="C"
        C = 0,
        //% block="C# / Db"
        Cs = 1,
        //% block="D"
        D = 2,
        //% block="D# / Eb"
        Ds = 3,
        //% block="E"
        E = 4,
        //% block="F"
        F = 5,
        //% block="F# / Gb"
        Fs = 6,
        //% block="G"
        G = 7,
        //% block="G# / Ab"
        Gs = 8,
        //% block="A"
        A = 9,
        //% block="A# / Bb"
        As = 10,
        //% block="B"
        B = 11
    }

    /** Scale modes */
    export enum ScaleMode {
        //% block="major"
        Major = 0,
        //% block="minor"
        Minor = 1,
        //% block="dorian"
        Dorian = 2,
        //% block="mixolydian"
        Mixolydian = 3,
        //% block="pentatonic major"
        PentatonicMajor = 4,
        //% block="pentatonic minor"
        PentatonicMinor = 5,
        //% block="lydian"
        Lydian = 6,
        //% block="phrygian"
        Phrygian = 7,
        //% block="locrian"
        Locrian = 8,
        //% block="harmonic minor"
        HarmonicMinor = 9,
        //% block="melodic minor"
        MelodicMinor = 10,
        //% block="whole tone"
        WholeTone = 11,
        //% block="diminished"
        Diminished = 12,
        //% block="chromatic"
        Chromatic = 13,
        //% block="blues"
        Blues = 14
    }

    /** LFO / Signal waveforms */
    export enum SignalWave {
        //% block="sine"
        Sine = 0,
        //% block="sawtooth (saw)"
        Saw = 1,
        //% block="square"
        Square = 2,
        //% block="triangle (tri)"
        Tri = 3,
        //% block="random (rand)"
        Rand = 4,
        //% block="perlin noise"
        Perlin = 5
    }

    /** Vowel filter types */
    export enum VowelFilter {
        //% block="A"
        A = 0,
        //% block="E"
        E = 1,
        //% block="I"
        I = 2,
        //% block="O"
        O = 3,
        //% block="U"
        U = 4
    }

    /** Playback direction for speed */
    export enum PlayDirection {
        //% block="forward"
        Forward = 1,
        //% block="backward"
        Backward = -1,
        //% block="double speed"
        Double = 2,
        //% block="half speed"
        Half = 0
    }

    /** Octave (1-8) */
    export enum OctaveEnum {
        //% block="1"
        Oct1 = 1,
        //% block="2"
        Oct2 = 2,
        //% block="3"
        Oct3 = 3,
        //% block="4"
        Oct4 = 4,
        //% block="5"
        Oct5 = 5,
        //% block="6"
        Oct6 = 6,
        //% block="7"
        Oct7 = 7,
        //% block="8"
        Oct8 = 8
    }

    // ─────────────────────────────────────────────────────────
    //  INTERNAL  CLASS  — StrutelPattern
    //  Represents a chainable pattern (mirrors Strudel API)
    // ─────────────────────────────────────────────────────────

    export class StrutelPattern {
        _miniNotation: string;
        _sound: string;
        _note: string;
        _n: string;
        _scale: string;
        _bank: DrumBank | -1;
        _gain: number;
        _gainPattern: string;
        _lpf: number;
        _lpfPattern: string;
        _hpf: number;
        _vowel: VowelFilter | -1;
        _delay: number;
        _delayTime: number;
        _delayFeedback: number;
        _room: number;
        _pan: number;
        _panPattern: string;
        _speed: number;
        _attack: number;
        _decay: number;
        _sustain: number;
        _release: number;
        _slow: number;
        _fast: number;
        _rev: boolean;
        _ply: number;
        _offTime: number;
        _offShift: number;
        _jux: boolean;
        _muted: boolean;
        _signalTarget: string;   // "gain" | "lpf" | "pan" | "speed" | ""
        _signalWave: SignalWave;
        _signalMin: number;
        _signalMax: number;
        _signalSpeed: number;

        constructor(miniNotation: string) {
            this._miniNotation = miniNotation;
            this._sound = "";
            this._note = "";
            this._n = "";
            this._scale = "";
            this._bank = -1;
            this._gain = 1.0;
            this._gainPattern = "";
            this._lpf = -1;
            this._lpfPattern = "";
            this._hpf = -1;
            this._vowel = -1;
            this._delay = 0;
            this._delayTime = 0.125;
            this._delayFeedback = 0.5;
            this._room = 0;
            this._pan = 0.5;
            this._panPattern = "";
            this._speed = 1;
            this._attack = 0.01;
            this._decay = 0.1;
            this._sustain = 0.5;
            this._release = 0.1;
            this._slow = 1;
            this._fast = 1;
            this._rev = false;
            this._ply = 1;
            this._offTime = 0;
            this._offShift = 0;
            this._jux = false;
            this._muted = false;
            this._signalTarget = "";
            this._signalWave = SignalWave.Sine;
            this._signalMin = 0;
            this._signalMax = 1;
            this._signalSpeed = 1;
        }

        /** Set the sound name */
        sound(name: string): StrutelPattern {
            this._sound = name; return this;
        }

        /** Set pitched note(s) — mini-notation string */
        note(n: string): StrutelPattern {
            this._note = n; return this;
        }

        /** Set sample/scale index pattern */
        n(pattern: string): StrutelPattern {
            this._n = pattern; return this;
        }

        /** Set scale (e.g. "C:minor") */
        scale(s: string): StrutelPattern {
            this._scale = s; return this;
        }

        /** Set drum machine bank */
        bank(b: DrumBank): StrutelPattern {
            this._bank = b; return this;
        }

        /** Set overall gain (volume 0–2) */
        gain(g: number): StrutelPattern {
            this._gain = g; return this;
        }

        /** Set gain from a mini-notation pattern string */
        gainPat(pattern: string): StrutelPattern {
            this._gainPattern = pattern; return this;
        }

        /** Low-pass filter cutoff frequency (Hz) */
        lpf(freq: number): StrutelPattern {
            this._lpf = freq; return this;
        }

        /** Low-pass filter pattern string */
        lpfPat(pattern: string): StrutelPattern {
            this._lpfPattern = pattern; return this;
        }

        /** High-pass filter cutoff frequency (Hz) */
        hpf(freq: number): StrutelPattern {
            this._hpf = freq; return this;
        }

        /** Vowel filter */
        vowel(v: VowelFilter): StrutelPattern {
            this._vowel = v; return this;
        }

        /** Delay (wet amount 0–1) */
        delay(amount: number): StrutelPattern {
            this._delay = amount; return this;
        }

        /** Delay time in seconds */
        delayTime(t: number): StrutelPattern {
            this._delayTime = t; return this;
        }

        /** Delay feedback (0–1) */
        delayFeedback(fb: number): StrutelPattern {
            this._delayFeedback = fb; return this;
        }

        /** Room / reverb (0–4) */
        room(amount: number): StrutelPattern {
            this._room = amount; return this;
        }

        /** Stereo pan (0 = left, 0.5 = center, 1 = right) */
        pan(p: number): StrutelPattern {
            this._pan = p; return this;
        }

        /** Pan from mini-notation string */
        panPat(pattern: string): StrutelPattern {
            this._panPattern = pattern; return this;
        }

        /** Playback speed multiplier (negative = reverse) */
        speed(s: number): StrutelPattern {
            this._speed = s; return this;
        }

        /** Attack time in seconds */
        attack(a: number): StrutelPattern {
            this._attack = a; return this;
        }

        /** Decay time in seconds */
        decay(d: number): StrutelPattern {
            this._decay = d; return this;
        }

        /** Sustain level (0–1) */
        sustain(s: number): StrutelPattern {
            this._sustain = s; return this;
        }

        /** Release time in seconds */
        release(r: number): StrutelPattern {
            this._release = r; return this;
        }

        /** ADSR shorthand — "attack:decay:sustain:release" */
        adsr(notation: string): StrutelPattern {
            let parts = notation.split(":");
            if (parts.length >= 1) this._attack = parseFloat(parts[0]) || 0.01;
            if (parts.length >= 2) this._decay = parseFloat(parts[1]) || 0.1;
            if (parts.length >= 3) this._sustain = parseFloat(parts[2]) || 0.5;
            if (parts.length >= 4) this._release = parseFloat(parts[3]) || 0.1;
            return this;
        }

        /** Slow down (divide cycle speed) */
        slow(factor: number): StrutelPattern {
            this._slow = Math.max(0.01, factor); return this;
        }

        /** Speed up (multiply cycle speed) */
        fast(factor: number): StrutelPattern {
            this._fast = Math.max(0.01, factor); return this;
        }

        /** Reverse the pattern */
        rev(): StrutelPattern {
            this._rev = true; return this;
        }

        /** Play each event n times (polyrhythm) */
        ply(n: number): StrutelPattern {
            this._ply = Math.max(1, n); return this;
        }

        /** Offset a copy and modify — simplified: shifts pitch by semitones */
        off(cycleOffset: number, semitoneShift: number): StrutelPattern {
            this._offTime = cycleOffset;
            this._offShift = semitoneShift;
            return this;
        }

        /** Split stereo: play original left, reversed right */
        jux(): StrutelPattern {
            this._jux = true; return this;
        }

        /** Mute this pattern (like _$ in Strudel) */
        mute(): StrutelPattern {
            this._muted = true; return this;
        }

        /** Unmute this pattern */
        unmute(): StrutelPattern {
            this._muted = false; return this;
        }

        /** Modulate a parameter with a signal wave */
        signal(target: string, wave: SignalWave, minVal: number, maxVal: number, speed: number): StrutelPattern {
            this._signalTarget = target;
            this._signalWave = wave;
            this._signalMin = minVal;
            this._signalMax = maxVal;
            this._signalSpeed = speed;
            return this;
        }

        /** Build a human-readable description of this pattern */
        describe(): string {
            let parts: string[] = [];
            parts.push("pattern: \"" + this._miniNotation + "\"");
            if (this._sound) parts.push("sound: " + this._sound);
            if (this._note) parts.push("note: " + this._note);
            if (this._scale) parts.push("scale: " + this._scale);
            if (this._lpf > 0) parts.push("lpf: " + this._lpf + "Hz");
            if (this._delay > 0) parts.push("delay: " + this._delay);
            if (this._room > 0) parts.push("room: " + this._room);
            if (this._rev) parts.push("reversed");
            if (this._muted) parts.push("[MUTED]");
            return parts.join(" | ");
        }

        /** Trigger this pattern (queues for playback) */
        play(): void {
            if (!this._muted) {
                _patternQueue.push(this);
                _triggerPattern(this);
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    //  INTERNAL HELPERS
    // ─────────────────────────────────────────────────────────

    const SCALE_INTERVALS: { [key: number]: number[] } = {
        0:  [0,2,4,5,7,9,11],    // major
        1:  [0,2,3,5,7,8,10],    // minor
        2:  [0,2,3,5,7,9,10],    // dorian
        3:  [0,2,4,5,7,9,10],    // mixolydian
        4:  [0,2,4,7,9],          // pentatonic major
        5:  [0,3,5,7,10],         // pentatonic minor
        6:  [0,2,4,6,7,9,11],    // lydian
        7:  [0,1,3,5,7,8,10],    // phrygian
        8:  [0,1,3,5,6,8,10],    // locrian
        9:  [0,2,3,5,7,8,11],    // harmonic minor
        10: [0,2,3,5,7,9,11],    // melodic minor
        11: [0,2,4,6,8,10],      // whole tone
        12: [0,2,3,5,6,8,9,11],  // diminished
        13: [0,1,2,3,4,5,6,7,8,9,10,11], // chromatic
        14: [0,3,5,6,7,10]       // blues
    };

    const DRUM_SOUNDS_MIDI: number[] = [36,38,42,46,37,41,43,45,51,49,39,44];
    const NOTE_SEMITONES: number[] = [0,1,2,3,4,5,6,7,8,9,10,11];

    function _noteLetterToMidi(noteLetter: NoteLetterEnum, octave: number): number {
        return 12 + (octave * 12) + NOTE_SEMITONES[noteLetter];
    }

    function _scaleDegreeMidi(degree: number, root: NoteLetterEnum, octave: number, scale: ScaleMode): number {
        let intervals = SCALE_INTERVALS[scale];
        let len = intervals.length;
        let oct = Math.floor(degree / len);
        let idx = ((degree % len) + len) % len;
        return _noteLetterToMidi(root, octave) + (oct * 12) + intervals[idx];
    }

    function _midiToFreq(midi: number): number {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function _signalValue(wave: SignalWave, phase: number): number {
        switch (wave) {
            case SignalWave.Sine:   return 0.5 + 0.5 * Math.sin(phase * 2 * Math.PI);
            case SignalWave.Saw:    return phase % 1;
            case SignalWave.Square: return (phase % 1) < 0.5 ? 1 : 0;
            case SignalWave.Tri:    let p = phase % 1; return p < 0.5 ? p * 2 : 2 - p * 2;
            case SignalWave.Rand:   return Math.random();
            case SignalWave.Perlin: return 0.5 + 0.5 * Math.sin(phase * 1.7 + Math.sin(phase * 3.1));
            default:               return 0.5;
        }
    }

    function _triggerPattern(p: StrutelPattern): void {
        // On micro:bit: render to LED or tone output
        // Plays a representative tone for the pattern
        if (p._muted) return;

        let freq = 440;
        if (p._note) {
            let midiNum = parseInt(p._note);
            if (!isNaN(midiNum)) freq = _midiToFreq(midiNum);
        }

        let durationMs = Math.round((60000 / _bpm) * (p._slow / p._fast));
        let vol = Math.round(Math.min(255, p._gain * _globalGain * 255));

        // micro:bit tone output
        music.playTone(freq, durationMs);
    }

    // ─────────────────────────────────────────────────────────
    //  ██████╗ ██╗      ██████╗  ██████╗██╗  ██╗███████╗
    //  ██╔══██╗██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝
    //  ██████╔╝██║     ██║   ██║██║     █████╔╝ ███████╗
    //  ██╔══██╗██║     ██║   ██║██║     ██╔═██╗ ╚════██║
    //  ██████╔╝███████╗╚██████╔╝╚██████╗██║  ██╗███████║
    //  ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝
    //
    //   ===  PUBLIC BLOCK API  ===
    // ─────────────────────────────────────────────────────────

    // ── TEMPO ─────────────────────────────────────────────────

    /**
     * Set tempo in beats per minute
     * @param bpm tempo in BPM eg: 120
     */
    //% blockId="strutel_setbpm"
    //% block="Strutel set BPM to %bpm"
    //% bpm.min=20 bpm.max=300 bpm.defl=120
    //% group="Tempo" weight=100
    //% color="#7B2FBE"
    export function setBPM(bpm: number): void {
        _bpm = Math.max(20, Math.min(300, bpm));
    }

    /**
     * Set tempo in cycles per minute (Strudel-style)
     * Default = 30 cpm (= 120 BPM in 4/4)
     * @param cpm cycles per minute eg: 30
     */
    //% blockId="strutel_setcpm"
    //% block="Strutel set CPM to %cpm"
    //% cpm.min=1 cpm.max=300 cpm.defl=30
    //% group="Tempo" weight=99
    //% color="#7B2FBE"
    export function setCPM(cpm: number): void {
        _cpm = Math.max(1, Math.min(300, cpm));
        _bpm = _cpm * 4;  // 1 cycle = 1 bar in 4/4
    }

    /**
     * Get the current BPM
     */
    //% blockId="strutel_getbpm"
    //% block="Strutel current BPM"
    //% group="Tempo" weight=98
    //% color="#7B2FBE"
    export function getBPM(): number { return _bpm; }

    /**
     * Get the current CPM (cycles per minute)
     */
    //% blockId="strutel_getcpm"
    //% block="Strutel current CPM"
    //% group="Tempo" weight=97
    //% color="#7B2FBE"
    export function getCPM(): number { return _cpm; }

    // ── GLOBAL CONTROL ────────────────────────────────────────

    /**
     * Set global volume (0–2)
     * @param gain volume 0 to 2 eg: 1
     */
    //% blockId="strutel_setgain"
    //% block="Strutel global volume %gain"
    //% gain.min=0 gain.max=2 gain.defl=1
    //% group="Global" weight=95
    //% color="#7B2FBE"
    export function setGlobalGain(gain: number): void {
        _globalGain = Math.max(0, Math.min(2, gain));
    }

    /**
     * Stop all playing patterns
     */
    //% blockId="strutel_stopall"
    //% block="Strutel stop all"
    //% group="Global" weight=90
    //% color="#7B2FBE"
    export function stopAll(): void {
        _patternQueue = [];
        _playing = false;
        music.stopAllSounds();
    }

    /**
     * Clear all queued patterns
     */
    //% blockId="strutel_clearpatterns"
    //% block="Strutel clear all patterns"
    //% group="Global" weight=89
    //% color="#7B2FBE"
    export function clearPatterns(): void {
        _patternQueue = [];
    }

    // ── CREATE A PATTERN (sound / s) ──────────────────────────

    /**
     * Create a sound pattern from mini-notation text.
     * Use spaces to sequence, commas for parallel, brackets for sub-sequences.
     * Examples: "bd hh sd hh"  |  "bd*4, [~ cp]*2"  |  "<bd rim>"
     * @param miniNotation the mini-notation string eg: "bd hh sd hh"
     */
    //% blockId="strutel_sound"
    //% block="sound %miniNotation"
    //% group="Create Pattern" weight=100
    //% color="#9B59B6"
    export function sound(miniNotation: string): StrutelPattern {
        let p = new StrutelPattern(miniNotation);
        p._sound = miniNotation;
        return p;
    }

    /**
     * Create a note pattern using MIDI numbers or note letters (e.g. "c e g b" or "48 52 55")
     * @param notePattern mini-notation of notes eg: "c e g b"
     */
    //% blockId="strutel_note"
    //% block="note %notePattern"
    //% group="Create Pattern" weight=99
    //% color="#9B59B6"
    export function note(notePattern: string): StrutelPattern {
        let p = new StrutelPattern(notePattern);
        p._note = notePattern;
        return p;
    }

    /**
     * Create a scale-degree pattern (pair with .scale())
     * @param degreePattern mini-notation of scale degrees eg: "0 2 4 7"
     */
    //% blockId="strutel_n"
    //% block="n %degreePattern"
    //% group="Create Pattern" weight=98
    //% color="#9B59B6"
    export function n(degreePattern: string): StrutelPattern {
        let p = new StrutelPattern(degreePattern);
        p._n = degreePattern;
        return p;
    }

    /**
     * Create a pattern from a stack of patterns played in parallel (like stack() in Strudel)
     * @param patterns array of StrutelPattern
     */
    //% blockId="strutel_stack"
    //% block="stack patterns %p1 and %p2"
    //% group="Create Pattern" weight=95
    //% color="#9B59B6"
    export function stack(p1: StrutelPattern, p2: StrutelPattern): StrutelPattern {
        p1.play();
        p2.play();
        return p1; // return first for further chaining
    }

    // ── NOTE HELPERS ──────────────────────────────────────────

    /**
     * Play a note by letter and octave
     * @param note note letter A-G
     * @param octave octave number 1-8
     */
    //% blockId="strutel_playnote"
    //% block="play note %note octave %octave"
    //% group="Notes" weight=100
    //% color="#2980B9"
    export function playNote(note: NoteLetterEnum, octave: OctaveEnum): void {
        let midi = _noteLetterToMidi(note, octave);
        let freq = _midiToFreq(midi);
        let dur = Math.round(60000 / _bpm);
        music.playTone(freq, dur);
    }

    /**
     * Play a MIDI note number
     * @param midiNote MIDI note number 0-127 eg: 60
     * @param durationMs duration in ms eg: 500
     */
    //% blockId="strutel_playmidi"
    //% block="play MIDI note %midiNote for %durationMs ms"
    //% midiNote.min=0 midiNote.max=127 midiNote.defl=60
    //% durationMs.min=10 durationMs.max=5000 durationMs.defl=500
    //% group="Notes" weight=99
    //% color="#2980B9"
    export function playMidiNote(midiNote: number, durationMs: number): void {
        let freq = _midiToFreq(Math.max(0, Math.min(127, midiNote)));
        music.playTone(freq, durationMs);
    }

    /**
     * Get frequency (Hz) for a note letter and octave
     * @param note note letter
     * @param octave octave number
     */
    //% blockId="strutel_notefreq"
    //% block="frequency of note %note octave %octave"
    //% group="Notes" weight=98
    //% color="#2980B9"
    export function noteFrequency(note: NoteLetterEnum, octave: OctaveEnum): number {
        return Math.round(_midiToFreq(_noteLetterToMidi(note, octave)));
    }

    /**
     * Convert MIDI number to frequency in Hz
     * @param midiNote MIDI number eg: 69
     */
    //% blockId="strutel_miditofreq"
    //% block="MIDI %midiNote to Hz"
    //% midiNote.min=0 midiNote.max=127 midiNote.defl=69
    //% group="Notes" weight=97
    //% color="#2980B9"
    export function midiToHz(midiNote: number): number {
        return Math.round(_midiToFreq(midiNote));
    }

    // ── SCALES ────────────────────────────────────────────────

    /**
     * Get the MIDI note for a scale degree
     * @param degree scale degree (0-based) eg: 0
     * @param root root note
     * @param octave octave
     * @param scale scale mode
     */
    //% blockId="strutel_scaledegree"
    //% block="scale degree %degree root %root octave %octave scale %scale"
    //% degree.min=0 degree.max=24 degree.defl=0
    //% group="Scales" weight=100
    //% color="#27AE60"
    export function scaleDegree(degree: number, root: NoteLetterEnum, octave: OctaveEnum, scale: ScaleMode): number {
        return _scaleDegreeMidi(degree, root, octave, scale);
    }

    /**
     * Play a scale degree as a tone
     * @param degree scale degree eg: 0
     * @param root root note
     * @param octave octave
     * @param scale scale mode
     * @param durationMs duration in ms eg: 400
     */
    //% blockId="strutel_playscaledegree"
    //% block="play scale degree %degree root %root octave %octave scale %scale for %durationMs ms"
    //% degree.min=0 degree.max=24 degree.defl=0
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=400
    //% group="Scales" weight=99
    //% color="#27AE60"
    export function playScaleDegree(degree: number, root: NoteLetterEnum, octave: OctaveEnum, scale: ScaleMode, durationMs: number): void {
        let midi = _scaleDegreeMidi(degree, root, octave, scale);
        music.playTone(_midiToFreq(midi), durationMs);
    }

    /**
     * Play a full scale ascending
     * @param root root note
     * @param octave starting octave
     * @param scale scale mode
     * @param noteDuration each note duration in ms eg: 300
     */
    //% blockId="strutel_playscale"
    //% block="play %scale scale root %root octave %octave each note %noteDuration ms"
    //% noteDuration.min=50 noteDuration.max=2000 noteDuration.defl=300
    //% group="Scales" weight=98
    //% color="#27AE60"
    export function playScale(root: NoteLetterEnum, octave: OctaveEnum, scale: ScaleMode, noteDuration: number): void {
        let intervals = SCALE_INTERVALS[scale];
        for (let i = 0; i < intervals.length; i++) {
            let midi = _noteLetterToMidi(root, octave) + intervals[i];
            music.playTone(_midiToFreq(midi), noteDuration);
        }
    }

    /**
     * Get scale intervals array (for advanced usage)
     * @param scale scale mode
     */
    //% blockId="strutel_getscaleintervals"
    //% block="scale intervals for %scale"
    //% group="Scales" weight=97
    //% color="#27AE60"
    export function getScaleIntervals(scale: ScaleMode): number[] {
        return SCALE_INTERVALS[scale].slice();
    }

    // ── DRUM PATTERNS ─────────────────────────────────────────

    /**
     * Play a drum sound
     * @param drum drum hit type
     */
    //% blockId="strutel_playdrum"
    //% block="play drum %drum"
    //% group="Drums" weight=100
    //% color="#E74C3C"
    export function playDrum(drum: DrumSound): void {
        // Map to approximate frequencies for micro:bit piezo buzzer
        let freqs = [80, 200, 8000, 6000, 300, 120, 150, 180, 600, 500, 250, 9000];
        let durs  = [80, 100, 40,   120,  60,  100, 100, 100, 200, 300, 80,  30];
        let idx = Math.min(drum, freqs.length - 1);
        music.playTone(freqs[idx], durs[idx]);
    }

    /**
     * Play a drum sequence from mini-notation (bd=bass, sd=snare, hh=hihat, -=rest)
     * @param notation drum mini-notation eg: "bd hh sd hh"
     * @param tempo BPM eg: 120
     */
    //% blockId="strutel_drumsequence"
    //% block="drum sequence %notation at %tempo BPM"
    //% tempo.min=40 tempo.max=300 tempo.defl=120
    //% group="Drums" weight=99
    //% color="#E74C3C"
    export function drumSequence(notation: string, tempo: number): void {
        let tokens = notation.split(" ");
        let stepMs = Math.round(60000 / tempo);
        for (let t of tokens) {
            let tok = t.toLowerCase().trim();
            if (tok === "-" || tok === "~" || tok === "") {
                basic.pause(stepMs);
            } else if (tok === "bd") { music.playTone(80, 80); basic.pause(stepMs - 80);
            } else if (tok === "sd") { music.playTone(200, 100); basic.pause(stepMs - 100);
            } else if (tok === "hh") { music.playTone(8000, 40); basic.pause(stepMs - 40);
            } else if (tok === "oh") { music.playTone(6000, 120); basic.pause(stepMs - 120);
            } else if (tok === "rim") { music.playTone(300, 60); basic.pause(stepMs - 60);
            } else if (tok === "cp") { music.playTone(250, 80); basic.pause(stepMs - 80);
            } else if (tok === "cr") { music.playTone(500, 300); basic.pause(stepMs - 300);
            } else if (tok === "rd") { music.playTone(600, 200); basic.pause(stepMs - 200);
            } else { basic.pause(stepMs); }
        }
    }

    /**
     * Play a repeating kick-snare-hihat pattern for N cycles
     * @param kickPattern kick pattern eg: "x - - -"
     * @param snarePattern snare pattern eg: "- - x -"
     * @param hihatPattern hihat pattern eg: "x x x x"
     * @param cycles number of cycles to play eg: 4
     * @param tempo BPM eg: 120
     */
    //% blockId="strutel_drumkit"
    //% block="drum kit kick %kickPattern snare %snarePattern hihat %hihatPattern for %cycles cycles at %tempo BPM"
    //% cycles.min=1 cycles.max=32 cycles.defl=4
    //% tempo.min=40 tempo.max=300 tempo.defl=120
    //% group="Drums" weight=98
    //% color="#E74C3C"
    export function drumKit(kickPattern: string, snarePattern: string, hihatPattern: string, cycles: number, tempo: number): void {
        let kicks  = kickPattern.split(" ");
        let snares = snarePattern.split(" ");
        let hihats = hihatPattern.split(" ");
        let steps = Math.max(kicks.length, Math.max(snares.length, hihats.length));


        let stepMs = Math.round((60000 / tempo) / Math.max(1, steps / 4));

        for (let c = 0; c < cycles; c++) {
            for (let i = 0; i < steps; i++) {
                let k = kicks[i % kicks.length];
                let s = snares[i % snares.length];
                let h = hihats[i % hihats.length];
                if (k === "x" || k === "X") music.playTone(80, 70);
                if (s === "x" || s === "X") music.playTone(200, 90);
                if (h === "x" || h === "X") music.playTone(8000, 30);
                basic.pause(stepMs);
            }
        }
    }

    // ── EFFECTS ───────────────────────────────────────────────

    /**
     * Apply a delay effect — returns a delay duration in ms
     * @param delayAmount wet amount 0–1 eg: 0.5
     * @param delayTimeMs delay time in ms eg: 125
     */
    //% blockId="strutel_delay"
    //% block="delay amount %delayAmount time %delayTimeMs ms"
    //% delayAmount.min=0 delayAmount.max=1 delayAmount.defl=50
    //% delayTimeMs.min=10 delayTimeMs.max=2000 delayTimeMs.defl=125
    //% group="Effects" weight=100
    //% color="#F39C12"
    export function calcDelay(delayAmount: number, delayTimeMs: number): number {
        return Math.round(delayTimeMs * Math.max(0, Math.min(1, delayAmount)));
    }

    /**
     * Play a tone with simulated delay effect
     * @param freq frequency in Hz eg: 440
     * @param durationMs note duration eg: 400
     * @param delayAmount delay wet mix 0-1 eg: 0.5
     * @param delayTimeMs delay repeat time in ms eg: 125
     * @param feedback delay feedback 0-1 eg: 0.4
     */
    //% blockId="strutel_playwithdelay"
    //% block="play %freq Hz for %durationMs ms | delay %delayAmount time %delayTimeMs ms feedback %feedback"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=400
    //% delayAmount.min=0 delayAmount.max=100 delayAmount.defl=50
    //% delayTimeMs.min=10 delayTimeMs.max=2000 delayTimeMs.defl=125
    //% feedback.min=0 feedback.max=90 feedback.defl=40
    //% group="Effects" weight=99
    //% color="#F39C12"
    export function playWithDelay(freq: number, durationMs: number, delayAmount: number, delayTimeMs: number, feedback: number): void {
        music.playTone(freq, durationMs);
        let wet = delayAmount / 100;
        let fb  = feedback / 100;
        let vol = wet;
        let t = delayTimeMs;
        // Simulate echoes with 4 taps
        for (let i = 0; i < 4 && vol > 0.05; i++) {
            basic.pause(t);
            // Represent lower volume by shorter duration
            music.playTone(freq, Math.round(durationMs * vol));
            vol *= fb;
        }
    }

    /**
     * Simulate room reverb by repeating a tone with decay
     * @param freq frequency Hz eg: 440
     * @param durationMs initial duration eg: 300
     * @param roomSize room size 0–4 eg: 1
     */
    //% blockId="strutel_room"
    //% block="play %freq Hz for %durationMs ms with room size %roomSize"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% roomSize.min=0 roomSize.max=4 roomSize.defl=1
    //% group="Effects" weight=98
    //% color="#F39C12"
    export function playWithRoom(freq: number, durationMs: number, roomSize: number): void {
        music.playTone(freq, durationMs);
        let taps = Math.min(Math.round(roomSize * 2), 6);
        for (let i = 1; i <= taps; i++) {
            basic.pause(Math.round(30 * i * roomSize));
            music.playTone(freq, Math.round(durationMs / (i + 1)));
        }
    }

    /**
     * LPF simulation — returns adjusted tone frequency for a low-pass feel
     * (On micro:bit: lower LPF = muffled = lower frequency multiplier)
     * @param freq original frequency Hz eg: 440
     * @param lpfCutoff low-pass cutoff Hz eg: 800
     */
    //% blockId="strutel_lpf"
    //% block="apply LPF cutoff %lpfCutoff Hz to %freq Hz"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% lpfCutoff.min=100 lpfCutoff.max=20000 lpfCutoff.defl=800
    //% group="Effects" weight=97
    //% color="#F39C12"
    export function applyLPF(freq: number, lpfCutoff: number): number {
        // Clamp frequency to simulate low-pass
        return Math.min(freq, lpfCutoff);
    }

    /**
     * HPF simulation — clamp minimum frequency
     * @param freq original frequency Hz eg: 440
     * @param hpfCutoff high-pass cutoff Hz eg: 200
     */
    //% blockId="strutel_hpf"
    //% block="apply HPF cutoff %hpfCutoff Hz to %freq Hz"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% hpfCutoff.min=20 hpfCutoff.max=10000 hpfCutoff.defl=200
    //% group="Effects" weight=96
    //% color="#F39C12"
    export function applyHPF(freq: number, hpfCutoff: number): number {
        return Math.max(freq, hpfCutoff);
    }

    // ── ADSR ENVELOPE ─────────────────────────────────────────

    /**
     * Play a tone with full ADSR envelope control
     * @param freq frequency Hz eg: 440
     * @param attackMs attack time ms eg: 50
     * @param decayMs decay time ms eg: 100
     * @param sustainLevel sustain level 0-100 eg: 70
     * @param sustainMs sustain time ms eg: 200
     * @param releaseMs release time ms eg: 100
     */
    //% blockId="strutel_adsr"
    //% block="play %freq Hz | attack %attackMs ms decay %decayMs ms sustain level %sustainLevel %% time %sustainMs ms release %releaseMs ms"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% attackMs.min=0 attackMs.max=2000 attackMs.defl=50
    //% decayMs.min=0 decayMs.max=2000 decayMs.defl=100
    //% sustainLevel.min=0 sustainLevel.max=100 sustainLevel.defl=70
    //% sustainMs.min=0 sustainMs.max=5000 sustainMs.defl=200
    //% releaseMs.min=0 releaseMs.max=2000 releaseMs.defl=100
    //% group="ADSR" weight=100
    //% color="#8E44AD"
    export function playADSR(freq: number, attackMs: number, decayMs: number, sustainLevel: number, sustainMs: number, releaseMs: number): void {
        let total = attackMs + decayMs + sustainMs + releaseMs;
        music.playTone(freq, total);
        // micro:bit can't modulate volume mid-note, but we document the phases
        basic.pause(total);
    }

    /**
     * Shorthand ADSR string parser — "attack:decay:sustain:release"
     * Returns total duration in ms
     * @param adsrString ADSR notation eg: "0.1:0.1:0.5:0.2"
     * @param freq frequency Hz eg: 440
     */
    //% blockId="strutel_adsrstring"
    //% block="play %freq Hz with ADSR %adsrString"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% group="ADSR" weight=99
    //% color="#8E44AD"
    export function playADSRString(freq: number, adsrString: string): void {
        let parts = adsrString.split(":");
        let a = parts.length > 0 ? (parseFloat(parts[0]) * 1000) || 50 : 50;
        let d = parts.length > 1 ? (parseFloat(parts[1]) * 1000) || 100 : 100;
        let s = parts.length > 2 ? parseFloat(parts[2]) * 100 || 70 : 70;
        let r = parts.length > 3 ? (parseFloat(parts[3]) * 1000) || 100 : 100;
        let total = Math.round(a + d + 200 + r);  // 200ms default sustain
        music.playTone(freq, total);
    }

    // ── SIGNALS / LFO ─────────────────────────────────────────

    /**
     * Get a signal value (0–1) for a given waveform and phase
     * @param wave waveform type
     * @param phase phase 0–100 eg: 50
     */
    //% blockId="strutel_signal"
    //% block="signal %wave at phase %phase %%"
    //% phase.min=0 phase.max=100 phase.defl=50
    //% group="Signals" weight=100
    //% color="#1ABC9C"
    export function signalValue(wave: SignalWave, phase: number): number {
        return Math.round(_signalValue(wave, phase / 100) * 100);
    }

    /**
     * Scale a signal value to a given range
     * @param signalVal signal value 0-100
     * @param minVal minimum output eg: 200
     * @param maxVal maximum output eg: 2000
     */
    //% blockId="strutel_signalrange"
    //% block="signal %signalVal %% scaled to %minVal – %maxVal"
    //% signalVal.min=0 signalVal.max=100
    //% group="Signals" weight=99
    //% color="#1ABC9C"
    export function signalRange(signalVal: number, minVal: number, maxVal: number): number {
        let t = Math.max(0, Math.min(100, signalVal)) / 100;
        return Math.round(minVal + t * (maxVal - minVal));
    }

    /**
     * Modulate frequency using a signal over time
     * Plays 8 tone steps with LFO-modulated pitch
     * @param baseFreq center frequency Hz eg: 440
     * @param wave LFO waveform
     * @param freqRange modulation depth in Hz eg: 50
     * @param stepMs each step duration ms eg: 100
     */
    //% blockId="strutel_modulatepitch"
    //% block="modulate pitch base %baseFreq Hz wave %wave depth ±%freqRange Hz step %stepMs ms"
    //% baseFreq.min=20 baseFreq.max=10000 baseFreq.defl=440
    //% freqRange.min=1 freqRange.max=2000 freqRange.defl=50
    //% stepMs.min=10 stepMs.max=500 stepMs.defl=100
    //% group="Signals" weight=98
    //% color="#1ABC9C"
    export function modulatePitch(baseFreq: number, wave: SignalWave, freqRange: number, stepMs: number): void {
        for (let i = 0; i < 8; i++) {
            let phase = i / 8;
            let mod = _signalValue(wave, phase);
            let freq = Math.round(baseFreq - freqRange + mod * freqRange * 2);
            music.playTone(Math.max(20, freq), stepMs);
        }
    }

    /**
     * Modulate volume using a signal (plays 8 steps with varying volume-length)
     * @param freq frequency Hz eg: 440
     * @param wave LFO waveform
     * @param stepMs each step duration ms eg: 100
     */
    //% blockId="strutel_modulategain"
    //% block="modulate volume %freq Hz wave %wave step %stepMs ms"
    //% freq.min=20 freq.max=20000 freq.defl=440
    //% stepMs.min=10 stepMs.max=500 stepMs.defl=100
    //% group="Signals" weight=97
    //% color="#1ABC9C"
    export function modulateGain(freq: number, wave: SignalWave, stepMs: number): void {
        for (let i = 0; i < 8; i++) {
            let phase = i / 8;
            let vol = _signalValue(wave, phase);
            // Simulate gain by scaling duration (higher vol = longer audible)
            let dur = Math.max(5, Math.round(stepMs * vol));
            music.playTone(freq, dur);
            basic.pause(stepMs - dur);
        }
    }

    // ── PATTERN MODIFIERS ─────────────────────────────────────

    /**
     * Reverse a number array (simulate .rev())
     * @param arr the array to reverse
     */
    //% blockId="strutel_rev"
    //% block="reverse %arr"
    //% group="Pattern Modifiers" weight=100
    //% color="#E67E22"
   export function rev(arr: number[]): number[] {
    let copy = arr.slice();
    copy.reverse();
    return copy;
}

    /**
     * Speed up a sequence — plays each note faster
     * @param notes array of MIDI note numbers
     * @param factor speed multiplier eg: 2
     * @param baseDuration base note duration ms eg: 400
     */
    //% blockId="strutel_fast"
    //% block="play %notes fast x%factor base %baseDuration ms"
    //% factor.min=1 factor.max=16 factor.defl=2
    //% baseDuration.min=50 baseDuration.max=2000 baseDuration.defl=400
    //% group="Pattern Modifiers" weight=99
    //% color="#E67E22"
    export function playFast(notes: number[], factor: number, baseDuration: number): void {
        let dur = Math.max(10, Math.round(baseDuration / Math.max(1, factor)));
        for (let midiNote of notes) {
            music.playTone(_midiToFreq(midiNote), dur);
        }
    }

    /**
     * Slow down a sequence
     * @param notes array of MIDI note numbers
     * @param factor slow factor eg: 2
     * @param baseDuration base note duration ms eg: 400
     */
    //% blockId="strutel_slow"
    //% block="play %notes slow x%factor base %baseDuration ms"
    //% factor.min=1 factor.max=16 factor.defl=2
    //% baseDuration.min=50 baseDuration.max=2000 baseDuration.defl=400
    //% group="Pattern Modifiers" weight=98
    //% color="#E67E22"
    export function playSlow(notes: number[], factor: number, baseDuration: number): void {
        let dur = Math.round(baseDuration * Math.max(1, factor));
        for (let midiNote of notes) {
            music.playTone(_midiToFreq(midiNote), dur);
        }
    }

    /**
     * Ply — play each note n times in the same slot
     * @param notes array of MIDI notes
     * @param plyCount how many times to repeat each eg: 2
     * @param durationMs total slot duration ms eg: 400
     */
    //% blockId="strutel_ply"
    //% block="ply %notes x%plyCount slot %durationMs ms"
    //% plyCount.min=1 plyCount.max=8 plyCount.defl=2
    //% durationMs.min=50 durationMs.max=2000 durationMs.defl=400
    //% group="Pattern Modifiers" weight=97
    //% color="#E67E22"
    export function plyNotes(notes: number[], plyCount: number, durationMs: number): void {
        let dur = Math.max(10, Math.round(durationMs / Math.max(1, notes.length * plyCount)));
        for (let midiNote of notes) {
            for (let p = 0; p < plyCount; p++) {
                music.playTone(_midiToFreq(midiNote), dur);
            }
        }
    }

    /**
     * Add offset to all notes in an array (transpose)
     * @param notes array of MIDI numbers
     * @param semitones semitone shift eg: 7
     */
    //% blockId="strutel_addnotes"
    //% block="transpose %notes by %semitones semitones"
    //% semitones.min=-24 semitones.max=24 semitones.defl=7
    //% group="Pattern Modifiers" weight=96
    //% color="#E67E22"
    export function addNotes(notes: number[], semitones: number): number[] {
        return notes.map(n => Math.max(0, Math.min(127, n + semitones)));
    }

    /**
     * Off — copy and shift a note array by N steps
     * @param notes original array of MIDI notes
     * @param offsetSteps how many steps to offset eg: 2
     * @param semitoneShift pitch shift for the copy eg: 5
     */
    //% blockId="strutel_off"
    //% block="off %notes offset %offsetSteps steps shift %semitoneShift semitones"
    //% offsetSteps.min=0 offsetSteps.max=16 offsetSteps.defl=2
    //% semitoneShift.min=-24 semitoneShift.max=24 semitoneShift.defl=5
    //% group="Pattern Modifiers" weight=95
    //% color="#E67E22"
    export function offNotes(notes: number[], offsetSteps: number, semitoneShift: number): number[] {
        let result: number[] = [];
        for (let i = 0; i < notes.length; i++) {
            let srcIdx = ((i - offsetSteps) + notes.length * 4) % notes.length;
            result.push(Math.max(0, Math.min(127, notes[srcIdx] + semitoneShift)));
        }
        return result;
    }

    // ── SEQUENCES & PATTERNS ──────────────────────────────────

    /**
     * Play an array of MIDI notes in sequence
     * @param notes array of MIDI note numbers
     * @param durationMs each note duration ms eg: 300
     */
    //% blockId="strutel_playnotes"
    //% block="play notes %notes each %durationMs ms"
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% group="Sequences" weight=100
    //% color="#3498DB"
    export function playNotes(notes: number[], durationMs: number): void {
        for (let midiNote of notes) {
            music.playTone(_midiToFreq(midiNote), durationMs);
        }
    }

    /**
     * Play notes with rest slots (use -1 for rest)
     * @param notes array of MIDI notes (-1 = rest)
     * @param durationMs each slot duration ms eg: 300
     */
    //% blockId="strutel_playwithrests"
    //% block="play notes with rests %notes each %durationMs ms"
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% group="Sequences" weight=99
    //% color="#3498DB"
    export function playNotesWithRests(notes: number[], durationMs: number): void {
        for (let midiNote of notes) {
            if (midiNote < 0) {
                basic.pause(durationMs);
            } else {
                music.playTone(_midiToFreq(midiNote), durationMs);
            }
        }
    }

    /**
     * Alternate between two note arrays (< > in mini-notation)
     * Returns the array for the current cycle
     * @param arrayA first array
     * @param arrayB second array
     * @param cycle current cycle number eg: 0
     */
    //% blockId="strutel_alternate"
    //% block="alternate %arrayA and %arrayB at cycle %cycle"
    //% cycle.min=0 cycle.max=1000 cycle.defl=0
    //% group="Sequences" weight=98
    //% color="#3498DB"
    export function alternate(arrayA: number[], arrayB: number[], cycle: number): number[] {
        return cycle % 2 === 0 ? arrayA : arrayB;
    }

    /**
     * Euclidean rhythm — distribute k hits across n steps
     * Returns array of 1s (hit) and 0s (rest)
     * @param hits number of hits eg: 3
     * @param steps total steps eg: 8
     */
    //% blockId="strutel_euclidean"
    //% block="euclidean rhythm %hits hits in %steps steps"
    //% hits.min=1 hits.max=32 hits.defl=3
    //% steps.min=1 steps.max=32 steps.defl=8
    //% group="Sequences" weight=97
    //% color="#3498DB"
    export function euclidean(hits: number, steps: number): number[] {
        // Bjorklund algorithm
        let pattern: number[] = [];
        let bucket = 0;
        for (let i = 0; i < steps; i++) {
            bucket += hits;
            if (bucket >= steps) { pattern.push(1); bucket -= steps; }
            else { pattern.push(0); }
        }
        return pattern;
    }

    /**
     * Play a euclidean rhythm pattern using a base note
     * @param hits number of hits eg: 3
     * @param steps total steps eg: 8
     * @param midiNote MIDI note to trigger eg: 36
     * @param stepMs ms per step eg: 125
     */
    //% blockId="strutel_playeuclidean"
    //% block="play euclidean %hits/%steps on MIDI %midiNote step %stepMs ms"
    //% hits.min=1 hits.max=32 hits.defl=3
    //% steps.min=2 steps.max=32 steps.defl=8
    //% midiNote.min=0 midiNote.max=127 midiNote.defl=36
    //% stepMs.min=30 stepMs.max=1000 stepMs.defl=125
    //% group="Sequences" weight=96
    //% color="#3498DB"
    export function playEuclidean(hits: number, steps: number, midiNote: number, stepMs: number): void {
        let pattern = euclidean(hits, steps);
        for (let bit of pattern) {
            if (bit) music.playTone(_midiToFreq(midiNote), Math.round(stepMs * 0.8));
            basic.pause(stepMs);
        }
    }

    /**
     * Loop a note sequence N times
     * @param notes array of MIDI notes
     * @param times number of loops eg: 4
     * @param durationMs each note duration ms eg: 300
     */
    //% blockId="strutel_loopnotes"
    //% block="loop %notes x%times each %durationMs ms"
    //% times.min=1 times.max=64 times.defl=4
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% group="Sequences" weight=95
    //% color="#3498DB"
    export function loopNotes(notes: number[], times: number, durationMs: number): void {
        for (let t = 0; t < times; t++) {
            for (let midiNote of notes) {
                music.playTone(_midiToFreq(midiNote), durationMs);
            }
        }
    }

    // ── MINI-NOTATION UTILITIES ───────────────────────────────

    /**
     * Count tokens in mini-notation string (space-separated)
     * @param miniNotation the pattern string eg: "bd hh sd hh"
     */
    //% blockId="strutel_countTokens"
    //% block="count steps in %miniNotation"
    //% group="Mini-Notation" weight=100
    //% color="#95A5A6"
    export function countSteps(miniNotation: string): number {
        return miniNotation.split(" ").filter(t => t.length > 0).length;
    }

    /**
     * Get step duration in ms given BPM and step count
     * @param bpm tempo eg: 120
     * @param steps steps per cycle eg: 8
     */
    //% blockId="strutel_stepDuration"
    //% block="step duration at %bpm BPM with %steps steps"
    //% bpm.min=20 bpm.max=300 bpm.defl=120
    //% steps.min=1 steps.max=64 steps.defl=8
    //% group="Mini-Notation" weight=99
    //% color="#95A5A6"
    export function stepDuration(bpm: number, steps: number): number {
        return Math.round((60000 / bpm) * 4 / Math.max(1, steps));
    }

    /**
     * Build a note name string (e.g. "C4", "F#3")
     * @param note note letter
     * @param octave octave
     */
    //% blockId="strutel_notename"
    //% block="note name %note octave %octave"
    //% group="Mini-Notation" weight=98
    //% color="#95A5A6"
    export function noteName(note: NoteLetterEnum, octave: OctaveEnum): string {
        let names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
        return names[note] + octave;
    }

    /**
     * Parse a note name string to MIDI number ("C4" = 60)
     * @param noteStr note string eg: "C4"
     */
    //% blockId="strutel_parsenote"
    //% block="parse note %noteStr to MIDI"
    //% group="Mini-Notation" weight=97
    //% color="#95A5A6"
    export function parseNoteToMidi(noteStr: string): number {
        let noteMap: { [key: string]: number } = {
            "C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,
            "E":4,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,
            "Ab":8,"A":9,"A#":10,"Bb":10,"B":11
        };
        let s = noteStr.trim();
        // Try 2-char note name first (C#, Db, etc)
        let letter = s.length >= 2 ? s.slice(0, 2) : s.slice(0, 1);
        let oct = s.length >= 2 ? parseInt(s.slice(s.length >= 3 ? 2 : 1)) : 4;
        let semitone = noteMap[letter];
        if (semitone === undefined) {
            letter = s.slice(0, 1);
            semitone = noteMap[letter] || 0;
            oct = parseInt(s.slice(1)) || 4;
        }
        return 12 + (oct * 12) + semitone;
    }

    // ── STACKS (multi-pattern playback) ───────────────────────

    /**
     * Play two MIDI note arrays in parallel (stack)
     * @param notesA first voice MIDI notes
     * @param notesB second voice MIDI notes
     * @param durationMs note duration ms eg: 300
     */
    //% blockId="strutel_stacktwo"
    //% block="stack voice A %notesA and voice B %notesB each %durationMs ms"
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% group="Stacks" weight=100
    //% color="#C0392B"
    export function stackTwo(notesA: number[], notesB: number[], durationMs: number): void {
        let len = Math.max(notesA.length, notesB.length);
        for (let i = 0; i < len; i++) {
            let a = notesA[i % notesA.length];
            let b = notesB[i % notesB.length];
            // Play chord (micro:bit plays one tone at a time — play both briefly)
            if (a >= 0) music.playTone(_midiToFreq(a), Math.round(durationMs / 2));
            if (b >= 0) music.playTone(_midiToFreq(b), Math.round(durationMs / 2));
        }
    }

    /**
     * Play three MIDI note arrays as a three-voice stack
     * @param notesA voice 1
     * @param notesB voice 2
     * @param notesC voice 3
     * @param durationMs note duration ms eg: 300
     */
    //% blockId="strutel_stackthree"
    //% block="stack 3 voices %notesA %notesB %notesC each %durationMs ms"
    //% durationMs.min=50 durationMs.max=4000 durationMs.defl=300
    //% group="Stacks" weight=99
    //% color="#C0392B"
    export function stackThree(notesA: number[], notesB: number[], notesC: number[], durationMs: number): void {
        let len = Math.max(notesA.length, Math.max(notesB.length, notesC.length));

        let sliceDur = Math.round(durationMs / 3);
        for (let i = 0; i < len; i++) {
            if (notesA[i % notesA.length] >= 0) music.playTone(_midiToFreq(notesA[i % notesA.length]), sliceDur);
            if (notesB[i % notesB.length] >= 0) music.playTone(_midiToFreq(notesB[i % notesB.length]), sliceDur);
            if (notesC[i % notesC.length] >= 0) music.playTone(_midiToFreq(notesC[i % notesC.length]), sliceDur);
        }
    }

    // ── CHORDS & HARMONY ──────────────────────────────────────

    /**
     * Build a major triad from a root MIDI note
     * @param rootMidi root MIDI note eg: 60
     */
    //% blockId="strutel_majorchord"
    //% block="major triad from MIDI %rootMidi"
    //% rootMidi.min=0 rootMidi.max=115 rootMidi.defl=60
    //% group="Chords" weight=100
    //% color="#16A085"
    export function majorChord(rootMidi: number): number[] {
        return [rootMidi, rootMidi + 4, rootMidi + 7];
    }

    /**
     * Build a minor triad
     * @param rootMidi root MIDI note eg: 60
     */
    //% blockId="strutel_minorchord"
    //% block="minor triad from MIDI %rootMidi"
    //% rootMidi.min=0 rootMidi.max=115 rootMidi.defl=60
    //% group="Chords" weight=99
    //% color="#16A085"
    export function minorChord(rootMidi: number): number[] {
        return [rootMidi, rootMidi + 3, rootMidi + 7];
    }

    /**
     * Build a dominant 7th chord
     * @param rootMidi root MIDI note eg: 60
     */
    //% blockId="strutel_dom7chord"
    //% block="dominant 7th from MIDI %rootMidi"
    //% rootMidi.min=0 rootMidi.max=115 rootMidi.defl=60
    //% group="Chords" weight=98
    //% color="#16A085"
    export function dom7Chord(rootMidi: number): number[] {
        return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 10];
    }

    /**
     * Play a chord (arpeggiated on micro:bit)
     * @param notes chord note array (MIDI)
     * @param durationMs total chord duration ms eg: 400
     * @param arpeggiate spread notes over duration?
     */
    //% blockId="strutel_playchord"
    //% block="play chord %notes total %durationMs ms arpeggiate %arpeggiate"
    //% durationMs.min=100 durationMs.max=4000 durationMs.defl=400
    //% group="Chords" weight=97
    //% color="#16A085"
    export function playChord(notes: number[], durationMs: number, arpeggiate: boolean): void {
        if (arpeggiate) {
            let dur = Math.round(durationMs / Math.max(1, notes.length));
            for (let midiNote of notes) {
                if (midiNote >= 0) music.playTone(_midiToFreq(midiNote), dur);
            }
        } else {
            // Play all rapidly (simulate chord)
            let dur = Math.round(durationMs / notes.length);
            for (let midiNote of notes) {
                if (midiNote >= 0) music.playTone(_midiToFreq(midiNote), dur);
            }
        }
    }

    // ── UTILITY ───────────────────────────────────────────────

    /**
     * Convert BPM to cycle duration in ms
     * @param bpm tempo eg: 120
     */
    //% blockId="strutel_bpmtocycle"
    //% block="cycle duration ms at %bpm BPM"
    //% bpm.min=20 bpm.max=300 bpm.defl=120
    //% group="Utility" weight=100
    //% color="#7F8C8D"
    export function bpmToCycleMs(bpm: number): number {
        return Math.round(60000 / bpm * 4);  // 1 cycle = 1 bar
    }

    /**
     * Random number in range (useful for generative music)
     * @param min minimum value eg: 0
     * @param max maximum value eg: 100
     */
    //% blockId="strutel_randrange"
    //% block="random %min to %max"
    //% group="Utility" weight=99
    //% color="#7F8C8D"
    export function randRange(min: number, max: number): number {
        return Math.round(min + Math.random() * (max - min));
    }

    /**
     * Wrap a number within a range (for cyclic patterns)
     * @param value the value to wrap eg: 13
     * @param max range maximum eg: 12
     */
    //% blockId="strutel_wrap"
    //% block="wrap %value within 0 to %max"
    //% group="Utility" weight=98
    //% color="#7F8C8D"
    export function wrapValue(value: number, max: number): number {
        return ((value % max) + max) % max;
    }

    /**
     * Lerp (linear interpolation) between two values
     * @param a start value eg: 0
     * @param b end value eg: 100
     * @param t interpolation 0-100 eg: 50
     */
    //% blockId="strutel_lerp"
    //% block="lerp %a to %b at %t %%"
    //% t.min=0 t.max=100 t.defl=50
    //% group="Utility" weight=97
    //% color="#7F8C8D"
    export function lerp(a: number, b: number, t: number): number {
        return Math.round(a + (b - a) * (Math.max(0, Math.min(100, t)) / 100));
    }

    /**
     * Show current Strutel info on LED display
     */
    //% blockId="strutel_showinfo"
    //% block="Strutel show info"
    //% group="Utility" weight=90
    //% color="#7F8C8D"
   console.log("S " + _bpm + "bpm");


    /**
     * Generate a random melody in a scale
     * @param length melody length eg: 8
     * @param root root note
     * @param octave octave
     * @param scale scale mode
     */
    //% blockId="strutel_randmelody"
    //% block="random %length note melody root %root octave %octave scale %scale"
    //% length.min=2 length.max=32 length.defl=8
    //% group="Utility" weight=85
    //% color="#7F8C8D"
    export function randomMelody(length: number, root: NoteLetterEnum, octave: OctaveEnum, scale: ScaleMode): number[] {
        let intervals = SCALE_INTERVALS[scale];
        let result: number[] = [];
        let base = _noteLetterToMidi(root, octave);
        for (let i = 0; i < length; i++) {
            let deg = Math.floor(Math.random() * intervals.length);
            result.push(base + intervals[deg]);
        }
        return result;
    }

    // ──────────────────────────────────────────────────────────
    //  PATTERN BUILDER — Chainable Block API
    //  These blocks create a StrutelPattern and set properties
    // ──────────────────────────────────────────────────────────

    /**
     * Create a new StrutelPattern from mini-notation
     * @param miniNotation the pattern string eg: "bd hh sd hh"
     */
    //% blockId="strutel_newpattern"
    //% block="new pattern %miniNotation"
    //% group="Pattern Builder" weight=100
    //% color="#7B2FBE"
    export function newPattern(miniNotation: string): StrutelPattern {
        return new StrutelPattern(miniNotation);
    }

    /**
     * Set sound on a pattern
     * @param pattern the pattern
     * @param soundName sound name eg: "piano"
     */
    //% blockId="strutel_pset_sound"
    //% block="%pattern set sound %soundName"
    //% group="Pattern Builder" weight=99
    //% color="#7B2FBE"
    export function patternSetSound(pattern: StrutelPattern, soundName: string): StrutelPattern {
        return pattern.sound(soundName);
    }

    /**
     * Set gain on a pattern
     * @param pattern the pattern
     * @param gain volume 0–2 eg: 1
     */
    //% blockId="strutel_pset_gain"
    //% block="%pattern set gain %gain"
    //% gain.min=0 gain.max=200 gain.defl=100
    //% group="Pattern Builder" weight=98
    //% color="#7B2FBE"
    export function patternSetGain(pattern: StrutelPattern, gain: number): StrutelPattern {
        return pattern.gain(gain / 100);
    }

    /**
     * Set LPF on a pattern
     * @param pattern the pattern
     * @param freq cutoff frequency Hz eg: 800
     */
    //% blockId="strutel_pset_lpf"
    //% block="%pattern set LPF %freq Hz"
    //% freq.min=100 freq.max=20000 freq.defl=800
    //% group="Pattern Builder" weight=97
    //% color="#7B2FBE"
    export function patternSetLPF(pattern: StrutelPattern, freq: number): StrutelPattern {
        return pattern.lpf(freq);
    }

    /**
     * Set delay on a pattern
     * @param pattern the pattern
     * @param amount delay wet 0-100 eg: 50
     */
    //% blockId="strutel_pset_delay"
    //% block="%pattern set delay %amount %%"
    //% amount.min=0 amount.max=100 amount.defl=50
    //% group="Pattern Builder" weight=96
    //% color="#7B2FBE"
    export function patternSetDelay(pattern: StrutelPattern, amount: number): StrutelPattern {
        return pattern.delay(amount / 100);
    }

    /**
     * Set reverb (room) on a pattern
     * @param pattern the pattern
     * @param amount reverb 0-400 eg: 100
     */
    //% blockId="strutel_pset_room"
    //% block="%pattern set room %amount"
    //% amount.min=0 amount.max=400 amount.defl=100
    //% group="Pattern Builder" weight=95
    //% color="#7B2FBE"
    export function patternSetRoom(pattern: StrutelPattern, amount: number): StrutelPattern {
        return pattern.room(amount / 100);
    }

    /**
     * Set scale on a pattern
     * @param pattern the pattern
     * @param root root note
     * @param octave octave
     * @param mode scale mode
     */
    //% blockId="strutel_pset_scale"
    //% block="%pattern set scale root %root octave %octave mode %mode"
    //% group="Pattern Builder" weight=94
    //% color="#7B2FBE"
    export function patternSetScale(pattern: StrutelPattern, root: NoteLetterEnum, octave: OctaveEnum, mode: ScaleMode): StrutelPattern {
        let names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
        let modeNames = ["major","minor","dorian","mixolydian","pentatonic","pentatonic",
                         "lydian","phrygian","locrian","harmonic","melodic","whole",
                         "diminished","chromatic","blues"];
        return pattern.scale(names[root] + octave + ":" + modeNames[mode]);
    }

    /**
     * Set slow factor on a pattern
     * @param pattern the pattern
     * @param factor slow divisor eg: 2
     */
    //% blockId="strutel_pset_slow"
    //% block="%pattern slow x%factor"
    //% factor.min=1 factor.max=16 factor.defl=2
    //% group="Pattern Builder" weight=93
    //% color="#7B2FBE"
    export function patternSlow(pattern: StrutelPattern, factor: number): StrutelPattern {
        return pattern.slow(factor);
    }

    /**
     * Set fast factor on a pattern
     * @param pattern the pattern
     * @param factor speed multiplier eg: 2
     */
    //% blockId="strutel_pset_fast"
    //% block="%pattern fast x%factor"
    //% factor.min=1 factor.max=16 factor.defl=2
    //% group="Pattern Builder" weight=92
    //% color="#7B2FBE"
    export function patternFast(pattern: StrutelPattern, factor: number): StrutelPattern {
        return pattern.fast(factor);
    }

    /**
     * Reverse a pattern
     * @param pattern the pattern to reverse
     */
    //% blockId="strutel_pset_rev"
    //% block="%pattern reversed"
    //% group="Pattern Builder" weight=91
    //% color="#7B2FBE"
    export function patternRev(pattern: StrutelPattern): StrutelPattern {
        return pattern.rev();
    }

    /**
     * Set ply on a pattern
     * @param pattern the pattern
     * @param count ply count eg: 2
     */
    //% blockId="strutel_pset_ply"
    //% block="%pattern ply x%count"
    //% count.min=1 count.max=8 count.defl=2
    //% group="Pattern Builder" weight=90
    //% color="#7B2FBE"
    export function patternPly(pattern: StrutelPattern, count: number): StrutelPattern {
        return pattern.ply(count);
    }

    /**
     * Mute a pattern
     * @param pattern the pattern to mute
     */
    //% blockId="strutel_pset_mute"
    //% block="mute %pattern"
    //% group="Pattern Builder" weight=89
    //% color="#7B2FBE"
    export function patternMute(pattern: StrutelPattern): StrutelPattern {
        return pattern.mute();
    }

    /**
     * Play a StrutelPattern
     * @param pattern pattern to play
     */
    //% blockId="strutel_playpattern"
    //% block="play pattern %pattern"
    //% group="Pattern Builder" weight=85
    //% color="#7B2FBE"
    export function playPattern(pattern: StrutelPattern): void {
        pattern.play();
    }

    /**
     * Describe a pattern as a string (for debugging)
     * @param pattern the pattern
     */
    //% blockId="strutel_describepattern"
    //% block="describe %pattern"
    //% group="Pattern Builder" weight=80
    //% color="#7B2FBE"
    export function describePattern(pattern: StrutelPattern): string {
        return pattern.describe();
    }

}

// ============================================================
//  END OF STRUTEL EXTENSION
//  ꩜  strutel — Strudel-inspired music for MakeCode
// ============================================================
