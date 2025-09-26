
// El Bosque Farm — Logo animado + botón menú móvil (no rompe estructura existente)
(function(){
  function injectLogo(anchor){
    if(!anchor) return;
    anchor.classList.add('logo','logo--animated');
    anchor.setAttribute('aria-label','El Bosque Farm');
    // Mantener href si existe; si no, apuntar a index.html
    if(!anchor.getAttribute('href')) anchor.setAttribute('href','index.html');
    anchor.innerHTML = `
      <svg class="logo__badge" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g-badge" x1="0" x2="1">
            <stop offset="0" stop-color="var(--verde-medio)"/>
            <stop offset="1" stop-color="var(--verde-claro)"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="12" ry="12" fill="url(#g-badge)"></rect>
        <mask id="m-b">
          <rect x="0" y="0" width="64" height="64" fill="white"/>
          <circle cx="40" cy="22" r="12" fill="black"/>
          <circle cx="40" cy="43" r="12" fill="black"/>
          <rect x="46" y="8" width="16" height="48" fill="black"/>
        </mask>
        <rect x="2" y="2" width="60" height="60" rx="12" ry="12" fill="var(--verde-oscuro)" mask="url(#m-b)"></rect>
        <g class="leaf" transform="translate(21 13)">
          <rect x="9.5" y="16" width="3" height="9" rx="1.5" fill="var(--verde-muy-claro)"/>
          <ellipse cx="11" cy="14" rx="7" ry="8" fill="var(--verde-muy-claro)"/>
          <ellipse cx="5"  cy="19" rx="5" ry="6" fill="var(--verde-claro)"/>
        </g>
        <g class="chicken" transform="translate(15 40)" fill="var(--verde-muy-claro)">
          <circle cx="8" cy="6" r="5"/>
          <path d="M2,10 C5,7 11,7 14,10 12,12 10,13 8,13 6,13 4,12 2,10Z"/>
          <rect x="7" y="13" width="2" height="3" rx="1"/>
          <circle cx="12" cy="4" r="1.2"/>
        </g>
        <g class="cow" transform="translate(22 30)" fill="var(--verde-muy-claro)">
          <rect x="0" y="0" width="26" height="10" rx="4"/>
          <rect x="3" y="10" width="2.4" height="7" rx="1"/>
          <rect x="12" y="10" width="2.4" height="7" rx="1"/>
          <path d="M26,2 l6,2 -2,3 -4,-1 Z"/>
        </g>
      </svg>
      <span class="logo__text" aria-hidden="true">
        <span>E</span><span>L</span><span class="sp">&nbsp;</span>
        <span>B</span><span>O</span><span>S</span><span>Q</span><span>U</span><span>E</span>
        <span class="sp">&nbsp;</span>
        <span>F</span><span>A</span><span>R</span><span>M</span>
      </span>`;
  }

  function ensureMobileMenu(header){
    if(!header) return;
    // Get first <nav> inside header
    var nav = header.querySelector('nav');
    if(!nav) return;
    nav.classList.add('js-mobile-nav-target');
    // If toggle exists, skip
    if(header.querySelector('.js-mobile-nav-toggle')) return;
    var btn = document.createElement('button');
    btn.className = 'js-mobile-nav-toggle';
    btn.setAttribute('aria-label','Abrir menú');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path></svg>';
    // Insert after first child (habitualmente el logo)
    if (header.firstElementChild) {
      header.insertBefore(btn, header.firstElementChild.nextSibling);
    } else {
      header.appendChild(btn);
    }
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('nav--open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var header = document.querySelector('header');
    // Try to detect an existing logo anchor
    var logoAnchor = header ? header.querySelector('a.logo, .logo a, a[aria-label*="logo i"], a[title*="logo"], a[href*="index"]') : null;
    if(!logoAnchor && header){
      // Create one if none
      var a = document.createElement('a');
      a.href = 'index.html';
      header.insertBefore(a, header.firstChild);
      logoAnchor = a;
    }
    if(logoAnchor) injectLogo(logoAnchor);
    ensureMobileMenu(header);

    // Hover to re-ignite text animation
    var logo = document.querySelector('.logo--animated');
    if(logo){
      logo.addEventListener('mouseenter', function(){
        var letters = logo.querySelectorAll('.logo__text span');
        letters.forEach(function(l){ l.style.animation='none'; l.offsetHeight; l.style.animation=''; });
      });
    }
  });
})();
