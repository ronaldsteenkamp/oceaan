  // ---- sound -------------------------------------------------------------
  const audio = { ac: null, on: false };

  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ac = new AC();
    audio.ac = ac;
    audio.master = ac.createGain();
    audio.master.gain.value = 0;
    audio.master.connect(ac.destination);
    // a long, dark reverb makes everything sound far away and wet
    const len = Math.floor(ac.sampleRate * 3), imp = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = imp.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    audio.verb = ac.createConvolver();
    audio.verb.buffer = imp;
    const vg = ac.createGain(); vg.gain.value = 0.7;
    audio.verb.connect(vg); vg.connect(audio.master);
    audio.dry = ac.createGain(); audio.dry.gain.value = 0.6; audio.dry.connect(audio.master);
    // the low rumble of the sea
    const nb = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate), nd = nb.getChannelData(0);
    let lv = 0;
    for (let i = 0; i < nd.length; i++) { lv = (lv + 0.02 * (Math.random() * 2 - 1)) / 1.02; nd[i] = lv * 3.5; }
    const src = ac.createBufferSource(); src.buffer = nb; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 360;
    const lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.frequency.value = 0.06; lg.gain.value = 140;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    const ng = ac.createGain(); ng.gain.value = 0.55;
    src.connect(lp); lp.connect(ng); ng.connect(audio.master); src.start();
    audio.next = { bubble: 0, song: 0, whistle: 0, note: 2 };
    return true;
  }

  function tone(o) {
    const ac = audio.ac;
    if (!ac || !audio.on) return;
    if (!o.freqs.every(([f, at]) => isFinite(f) && isFinite(at)) || !isFinite(o.gain) || !isFinite(o.dur)) return;
    const now = ac.currentTime + (o.delay || 0);
    const osc = ac.createOscillator();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.freqs[0][0], now);
    for (const [f, at] of o.freqs.slice(1)) osc.frequency.linearRampToValueAtTime(f, now + at);
    const g = ac.createGain();
    const attack = o.attack || 0.01, release = o.release || 0.05;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(o.gain, now + attack);
    g.gain.setValueAtTime(o.gain, now + Math.max(attack, o.dur - release));
    g.gain.linearRampToValueAtTime(0.0001, now + o.dur);
    let node = osc;
    if (o.lp) { const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = o.lp; osc.connect(f); node = f; }
    if (o.vib) {
      const l = ac.createOscillator(), lg = ac.createGain();
      l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1];
      l.connect(lg); lg.connect(osc.frequency);
      l.start(now); l.stop(now + o.dur);
    }
    node.connect(g);
    const wetAmt = o.verb == null ? 0.5 : o.verb;
    const wet = ac.createGain(); wet.gain.value = wetAmt; g.connect(wet); wet.connect(audio.verb);
    const dry = ac.createGain(); dry.gain.value = 1 - wetAmt; g.connect(dry); dry.connect(audio.dry);
    osc.start(now);
    osc.stop(now + o.dur + 0.05);
  }

  const sfxBubble = () => { const f = 300 + Math.random() * 700; tone({ freqs: [[f, 0], [f * 2.4, 0.07]], dur: 0.09, gain: 0.08, attack: 0.005, release: 0.04, verb: 0.4 }); };
  const sfxWhale = () => { const f = 160 + Math.random() * 160; tone({ freqs: [[f, 0], [f * 2.1, 1.2], [f * 0.8, 2.6], [f * 1.5, 3.6]], dur: 3.8, gain: 0.2, attack: 0.5, release: 0.8, lp: 1400, vib: [4.5, 6], verb: 0.8 }); };
  const sfxWhistle = () => { const f = 2400 + Math.random() * 1200; tone({ freqs: [[f, 0], [f * 1.5, 0.15], [f * 1.1, 0.35]], dur: 0.4, gain: 0.03, attack: 0.02, release: 0.1, verb: 0.5 }); };
  const sfxRumble = amt => tone({ type: "sawtooth", freqs: [[38, 0], [30, 4]], dur: 4.5, gain: 0.25 * amt, attack: 1.5, release: 2, lp: 140, verb: 0.6 });
  const sfxChest = () => [0, 0.08, 0.16, 0.26].forEach((d, i) => tone({ type: "triangle", freqs: [[1200 + i * 300, 0]], dur: 0.25, gain: 0.05, delay: d, attack: 0.005, release: 0.2, verb: 0.7 }));

  function noiseBurst(o) {
    const ac = audio.ac;
    if (!ac || !audio.on) return;
    const now = ac.currentTime, len = Math.floor(ac.sampleRate * o.dur);
    const b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = b;
    const f = ac.createBiquadFilter(); f.type = o.type || "lowpass"; f.frequency.value = o.freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(o.gain, now + (o.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, now + o.dur);
    src.connect(f); f.connect(g); g.connect(audio.dry);
    const w = ac.createGain(); w.gain.value = 0.5; g.connect(w); w.connect(audio.verb);
    src.start(now); src.stop(now + o.dur);
  }
  const sfxClick = () => tone({ type: "square", freqs: [[2200, 0], [500, 0.03]], dur: 0.04, gain: 0.07, attack: 0.002, release: 0.02, verb: 0.3 });
  const sfxSquirt = () => noiseBurst({ type: "highpass", freq: 2500, dur: 0.18, gain: 0.08 });
  const sfxThunder = () => noiseBurst({ freq: 220, dur: 3, gain: 0.5, attack: 0.05 });

  function audioTick() {
    if (!audio.on || !audio.ac) return;
    try { audioStep(); } catch (e) { /* a sound that fails is skipped; the ocean keeps moving */ }
  }
  function audioStep() {
    const now = audio.ac.currentTime, n = audio.next, v = scene.visitor;
    if (now > n.bubble) { sfxBubble(); n.bubble = now + 0.3 + Math.random() * 2.2; }
    if (v && (v.type === "whale" || v.type === "humpback") && now > n.song) { sfxWhale(); n.song = now + 5 + Math.random() * 6; }
    if (v && v.type === "dolphins" && now > n.whistle) { sfxWhistle(); n.whistle = now + 0.5 + Math.random() * 1.4; }
    if (now > n.note) { playNote(); n.note = now + (restMode ? 5 : 3.5) + Math.random() * 4; }
  }

  // A slow, soft melody. Each water has its own scale; at night it drops an octave.
  const SCALES = {
    rif: [0, 2, 4, 7, 9, 12, 14], diepzee: [0, 3, 5, 7, 10], noordzee: [0, 2, 3, 7, 9, 12],
    kelpwoud: [0, 2, 5, 7, 9, 12], ijszee: [0, 4, 7, 11, 14, 19],
    mangrove: [0, 2, 3, 7, 8, 12], grot: [0, 1, 5, 7, 8], lagune: [0, 2, 4, 7, 9, 11, 14], sargasso: [0, 2, 5, 7, 10, 12],
  };
  const ROOT = { rif: 261.6, diepzee: 110, noordzee: 196, kelpwoud: 220, ijszee: 329.6, mangrove: 174.6, grot: 130.8, lagune: 293.7, sargasso: 164.8 };
  function playNote() {
    const sc = SCALES[water.name] || SCALES.rif;
    const f = (ROOT[water.name] || ROOT.rif) * Math.pow(2, sc[Math.floor(Math.random() * sc.length)] / 12) * (night > 0.6 ? 0.5 : 1);
    tone({ type: "triangle", freqs: [[f, 0]], dur: 4.5, gain: 0.035, attack: 1.2, release: 2.8, lp: 1600, verb: 0.85 });
    if (Math.random() < 0.4) tone({ type: "sine", freqs: [[f * 1.5, 0]], dur: 4, gain: 0.02, attack: 1.5, release: 2.2, verb: 0.9, delay: 0.6 });
  }
  const sfxInk = () => noiseBurst({ freq: 600, dur: 0.5, gain: 0.12, attack: 0.02 });
  const sfxDig = () => noiseBurst({ freq: 350, dur: 0.7, gain: 0.25, attack: 0.03 });
  const sfxShiny = () => [0, 0.07, 0.14, 0.21, 0.32].forEach((d, i) => tone({ type: "triangle", freqs: [[1568 * Math.pow(2, [0, 4, 7, 12, 16][i] / 12), 0]], dur: 0.5, gain: 0.04, delay: d, attack: 0.005, release: 0.4, verb: 0.8 }));

  function setVolume(v) {
    volume = v;
    store.set("oceaan-volume", v);
    if (audio.ac && audio.on) audio.master.gain.setTargetAtTime(volume, audio.ac.currentTime, 0.1);
  }

  soundBtn.addEventListener("click", () => {
    if (!audio.ac && !initAudio()) { soundBtn.disabled = true; soundBtn.dataset.tip = L("Geluid werkt hier niet", "Sound does not work here"); soundBtn.setAttribute("aria-label", soundBtn.dataset.tip); return; }
    audio.on = !audio.on;
    audio.ac.resume();
    audio.master.gain.setTargetAtTime(audio.on ? volume : 0, audio.ac.currentTime, 0.3);
    const label = audio.on ? L("Geluid uitzetten (G)", "Turn sound off (G)") : L("Geluid aanzetten (G)", "Turn sound on (G)");
    soundBtn.classList.toggle("is-on", audio.on);
    soundBtn.dataset.tip = label;
    soundBtn.setAttribute("aria-label", label);
    soundBtn.setAttribute("aria-pressed", String(audio.on));
  });

