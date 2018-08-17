function driver(callback, ms=0) {
  let stopped = true;
  let then = 0;
  let ticks = 0;

  function start() {
    if (stopped) {
      then = performance.now();
      stopped = false;
      requestAnimationFrame(loop);
    }
  }

  function stop() {
    stopped = true;
  }

  function loop(now) {
    if (stopped) return;
    requestAnimationFrame(loop);
    let delta = now - then;

    if (delta > ms) {
      then = now;
      callback(delta);
      ticks += 1;
    }
  }

  return { start, stop, ticks: () => ticks };
}

export default driver
