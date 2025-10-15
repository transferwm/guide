<script>
(() => {
  const KEY = 'wmGuideAccepted';

  // Safe localStorage helpers
  const canStore = (() => {
    try { localStorage.setItem('__wm_test__','1'); localStorage.removeItem('__wm_test__'); return true; }
    catch { return false; }
  })();
  const getAccepted = () => canStore ? localStorage.getItem(KEY) === '1' : false;
  const setAccepted = () => { if (canStore) localStorage.setItem(KEY, '1'); };

  function buildOverlay(){
    const wrap = document.createElement('div');
    wrap.className = 'disclaimer-overlay';
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-modal','true');
    wrap.innerHTML = `
      <div class="disclaimer-modal">
        <h2>Student-built resource — please read</h2>
        <p>This site is created by students for students. It is <strong>unofficial</strong>. The
           <strong>William &amp; Mary Registrar</strong> and official W&amp;M pages are the final
           authority for transfer credit, policies, and degree requirements.</p>
        <ul>
          <li>Information here may change at any time.</li>
          <li>Always verify against official W&amp;M sources before making decisions.</li>
        </ul>

        <label class="disclaimer-dont">
          <input id="wm-dont" type="checkbox" />
          Don’t show again on this device
        </label>

        <div class="disclaimer-actions">
          <button id="wm-continue" class="btn primary">I understand — continue</button>
          <button id="wm-exit" class="btn" aria-label="Exit to official Registrar site">
            Exit to official Registrar
          </button>
        </div>
        <div class="disclaimer-meta">Choosing “Exit” will take you to the W&amp;M Registrar website.</div>
      </div>
    `;
    return wrap;
  }

  function redirectHome(){
    // Always route to Home after acknowledging (even if already there)
    window.location.href = 'index.html';
  }

  function showDisclaimer(){
    const overlay = buildOverlay();
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');

    const btnGo = overlay.querySelector('#wm-continue');
    const btnExit = overlay.querySelector('#wm-exit');
    const dont = overlay.querySelector('#wm-dont');

    // Focus the first meaningful control
    setTimeout(() => btnGo.focus(), 0);

    // Trap Tab focus inside the modal (simple trap)
    overlay.addEventListener('keydown', (e)=>{
      if(e.key !== 'Tab') return;
      const focusables = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const f = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length-1];
      if (e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    });

    btnGo.addEventListener('click', ()=>{
      if (dont.checked) setAccepted();
      // Remove overlay before redirect to avoid flash on slow nav
      document.body.classList.remove('modal-open');
      overlay.remove();
      redirectHome();
    });

    btnExit.addEventListener('click', ()=>{
      window.location.href = 'https://www.wm.edu/offices/registrar/';
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    if (!getAccepted()) showDisclaimer();
  });
})();
</script>
