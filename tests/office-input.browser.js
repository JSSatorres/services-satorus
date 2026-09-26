/** Run in a fresh home page with agent-browser eval -b (base64 of this file). */
(async () => {
  const root = document.querySelector('[data-office-tour]');
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const waitFor = async (predicate, timeout, message) => {
    const start = performance.now();
    while (!predicate()) {
      check(performance.now() - start < timeout, message);
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  };
  const swipe = (distance) => {
    const touch = (y) => new Touch({ identifier: 1, target: root, clientX: 190, clientY: y });
    root.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(500)] }));
    root.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [touch(500 - distance)] }));
    root.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch(500 - distance)], touches: [] }));
  };
  await waitFor(() => root.dataset.renderState === 'ready', 15000, '3D scene did not load');
  check(root.dataset.intro === 'chaos', 'Run this check on a fresh home page');
  swipe(12);
  check(root.dataset.intro === 'chaos', 'A small accidental movement started navigation');
  const started = performance.now();
  swipe(48);
  await waitFor(() => root.dataset.phase === 'organizing', 500, 'A short deliberate swipe did not start the desk transition');
  swipe(100);
  await waitFor(() => root.dataset.intro === 'office', 3500, 'The desk-to-office transition took longer than 3.5 seconds');
  const introMs = Math.round(performance.now() - started);
  check(root.dataset.destination === '-1', 'A gesture during travel skipped the office');
  swipe(48);
  await waitFor(() => root.dataset.destination === '0', 500, 'A fresh swipe after arriving at the office was swallowed');
  await waitFor(() => root.dataset.phase === 'reading', 6000, 'The first section did not open');
  const panel = document.querySelector('[data-office-panel="0"]');
  panel.scrollTop = 100;
  swipe(48);
  check(root.dataset.destination === '0', 'Reading scroll skipped the panel content');
  panel.scrollTop = 0;
  swipe(-48);
  await waitFor(() => root.dataset.destination === '-1', 500, 'Reverse swipe at the top did not return to the office');
  return { introMs, shortSwipe: 'passed', noSkippedOffice: 'passed', immediateNextGesture: 'passed', reading: 'passed', reverse: 'passed' };
})()
