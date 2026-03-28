import { useCallback, useRef } from "react";

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (
      freq: number,
      endFreq: number,
      duration: number,
      vol: number,
      type: OscillatorType = "sine",
    ) => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          endFreq,
          ctx.currentTime + duration,
        );
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration,
        );
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Silently ignore audio errors
      }
    },
    [enabled, getCtx],
  );

  const playNumber = useCallback(() => play(1200, 800, 0.05, 0.1), [play]);
  const playPlus = useCallback(() => play(880, 660, 0.07, 0.12), [play]);
  const playMinus = useCallback(() => play(660, 550, 0.07, 0.1), [play]);
  const playMultiply = useCallback(() => play(500, 400, 0.09, 0.13), [play]);
  const playDivide = useCallback(() => play(1400, 300, 0.08, 0.1), [play]);
  const playNeutral = useCallback(() => play(700, 600, 0.06, 0.08), [play]);

  const playEquals = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      [0, 0.12, 0.24].forEach((offset, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(
          [523, 659, 784][i],
          ctx.currentTime + offset,
        );
        gain.gain.setValueAtTime(0.15, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + offset + 0.15,
        );
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.15);
      });
    } catch {
      // Silently ignore audio errors
    }
  }, [enabled, getCtx]);

  const playError = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Silently ignore audio errors
    }
  }, [enabled, getCtx]);

  // Keep playClick as alias for neutral
  const playClick = playNeutral;

  return {
    playClick,
    playNumber,
    playPlus,
    playMinus,
    playMultiply,
    playDivide,
    playNeutral,
    playEquals,
    playError,
  };
}
