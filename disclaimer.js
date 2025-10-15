(() => {
  const KEY_PERSIST = 'wmGuideAccepted';     // localStorage (forever)
  const KEY_SESSION = 'wmGuideSeenSession';  // sessionStorage (current tab/session)

  // Storage helpers
  const canLocal = (() => { try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); return true; } catch { return false; }})();
  const canSession = (() => { try { sessionStorage.setItem('__t','1'); sessionStorage.removeItem('__t'); return true; } catch { return false; }})();
  const getPersist = () => canLocal   ? localStorage.getItem(KEY_PERSIST) === '1' : false;
  const setPersist = () => { if (canLocal)   localStorage.setItem(KEY_PERSIST, '1'); };
  const getSession = () => canSession ? sessionStorage.getItem(KEY_SESSION) === '1' : false;
  const setSession = () => { if (canSession) sessionStorage.setItem(KEY_SESSION, '1'); };

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
          <button id="wm-continue" class="btn primary" type="button">I understand — continue</button>
          <button id="wm-exit" class="btn" type="button" aria-label="Exit to official Registrar site">
            Exit to official Registrar
          </button>
        </div>
        <div class="disclaimer-meta">Choosing “Exit” will take you to the W&amp;M Registrar website.</div>
      </div>
    `;
    return wrap;
  }

  function redirectHome(){
    // On GitHub Pages you might already be on index.html; if so, don't navigate.
    const here = location.pathname.split('/').pop() || 'index.html';
    if (here.toLowerCase() !== 'index.html') {
      location.href = 'index.html';
    }
  }

  function showDisclaimer(){
    const overlay = buildOverlay();
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');

    const btnGo = overlay.querySelector('#wm-continue');
    const btnExit = overlay.querySelector('#wm-exit');
    const dont   = overlay.querySelector('#wm-dont');

    setTimeout(() => btnGo.focus(), 0);

    // Focus trap (simple)
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
      // Always remember for this session so it won't re-open on redirect
      setSession();
      // Persist forever only if they checked the box
      if (dont.checked) setPersist();

      document.body.classList.remove('modal-open');
      overlay.remove();
      redirectHome();
    });

    btnExit.addEventListener('click', ()=>{
      location.href = 'https://www.wm.edu/offices/registrar/';
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    // Show if neither persisted nor acknowledged in this session
    if (!(getPersist() || getSession())) showDisclaimer();
  });
})();
