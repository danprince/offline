import createDriver from "./driver";

let ctx = new AudioContext();

let volume = ctx.createGain();
volume.connect(ctx.destination);
volume.gain.value = 0.5;

let a = Math.pow(2, 1 / 12);
let note = n => 60 * Math.pow(a, n);
let scale = Array.from({ length: 72 }).map((_, i) => note(i));

function play(song, velocity, offset, bpm) {
  let ms = (60 / bpm * 1000) / 4;
  let cursor = 0;

  let osc = ctx.createOscillator();
  let gain = ctx.createGain();
  gain.connect(volume);
  osc.connect(gain);

  let driver = createDriver(step, ms);

  function step() {
    let n = song[cursor];
    let v = velocity[cursor];
    osc.frequency.value = scale[offset + n];

    // remove the popping sound by adjusting gain over 15ms
    gain.gain.setTargetAtTime(v / 10, ctx.currentTime, 0.015);

    if (++cursor >= song.length) cursor = 0;
  }

  driver.start();
  osc.start();
}

let bpm = 120;

//play(
//  [0, 0, 4, 0, 6, 0],
//  [9, 1, 6, 1, 9, 1],
//  0,
//  bpm
//);
//
