/** Run in a fresh home page with agent-browser eval -b (base64 of this file). */
(async () => {
  const root = document.querySelector('[data-office-tour]');
  const waitFor = async (predicate, timeout = 6000) => {
    const end = performance.now() + timeout;
    while (!predicate()) {
      if (performance.now() > end) throw Error('Navigation timed out: ' + JSON.stringify({ ...root.dataset }));
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  };
  await waitFor(() => root.dataset.renderState === 'ready');
  if (root.dataset.intro !== 'chaos') throw Error('Run on a fresh home page');
  const wheel = deltaY => root.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
  const started = performance.now();
  wheel(60);
  await waitFor(() => root.dataset.phase === 'organizing', 500);
  const inertia = setInterval(() => wheel(10), 40);
  let introMs;
  try {
    await waitFor(() => root.dataset.intro === 'office', 3500);
    introMs = Math.round(performance.now() - started);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (root.dataset.destination !== '-1') throw Error('Inertia skipped the office');
  } finally {
    clearInterval(inertia);
  }
  await new Promise(resolve => setTimeout(resolve, 180));
  wheel(60);
  await waitFor(() => root.dataset.destination === '0', 500);
  await waitFor(() => root.dataset.phase === 'reading');
  return { introMs, wheel: 'passed', inertia: 'passed', freshWheel: 'passed' };
})()
