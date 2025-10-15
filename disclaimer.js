(function(){
  const KEY = 'wm_transfer_disclaimer_v1';
  if (location.search.includes('resetDisclaimer=1')) localStorage.removeItem(KEY);
  if (localStorage.getItem(KEY) === 'accepted') return;

  document.body.classList.add('modal-open');
  const overlay = document.createElement('div');
  overlay.className = 'disclaimer-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','disc-title');

  overlay.innerHTML = `
    <div class="disclaimer-modal">
      <h2 id="disc-title">Student-built resource — please read</h2>
      <p>This site is created by students for students. It is <strong>unofficial</strong>. 
      The <strong>William &amp; Mary Registrar and official W&amp;M pages are the final authority</strong> for transfer credit, policies, and degree requirements.</p>
      <ul>
        <li>Information here may change at any time.</li>
        <li>Always verify against official W&amp;M sources before making decisions.</li>
      </ul>
      <div class="disclaimer-actions">
        <button id="disc-accept" class="btn primary">I understand — continue</button>
        <button id="disc-exit" class="btn" aria-describedby="disc-explain">Exit to official Registrar</button>
      </div>
      <div id="disc-explain" class="disclaimer-meta">
        Choosing “Exit” will take you to the W&amp;M Registrar website.
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const acceptBtn = overlay.querySelector('#disc-accept');
  const exitBtn   = overlay.querySelector('#disc-exit');

  const focusables = overlay.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0], last = focusables[focusables.length-1];
  first && first.focus();

  overlay.addEventListener('keydown', (e)=>{
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') { e.preventDefault(); }
  });

  acceptBtn.addEventListener('click', ()=>{
    localStorage.setItem(KEY,'accepted');
    document.body.classList.remove('modal-open');
    overlay.remove();
  });

  exitBtn.addEventListener('click', ()=>{
    window.location.href = 'https://www.wm.edu/offices/registrar/';
  });
})();
