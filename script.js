// Initialize particles.js background (particles.js must be loaded via CDN before this script)
function initParticles(){
  if(typeof particlesJS !== 'function') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ['#7ce3ff','#ffb86b','#9be15d'] },
      shape: { type: 'circle' },
      opacity: { value: 0.7, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1.5, direction: 'none', random: false, straight: false, out_mode: 'out' },
      line_linked: { enable: true, distance: 120, color: '#6fbcdc', opacity: 0.15, width: 1 }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initParticles();
});
/* Site utilities: copy to clipboard and open external links */
function copyToClipboard(text){
  if(!text) return Promise.reject(new Error('No text'));
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text);
  }
  return new Promise((res, rej)=>{
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); document.body.removeChild(ta); res(); }catch(e){ document.body.removeChild(ta); rej(e); }
  });
}

function showToast(message, ms=1800){
  let el = document.getElementById('site-toast');
  if(!el){ el = document.createElement('div'); el.id = 'site-toast'; el.style.position='fixed'; el.style.right='16px'; el.style.bottom='16px'; el.style.padding='8px 12px'; el.style.background='rgba(0,0,0,0.8)'; el.style.color='#fff'; el.style.borderRadius='6px'; el.style.zIndex=9999; document.body.appendChild(el); }
  el.textContent = message; el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(()=>{ el.style.transition='opacity 260ms'; el.style.opacity='0'; }, ms);
}

document.addEventListener('DOMContentLoaded', ()=>{
  // wire up data-action controls (open-link, copy)
  document.body.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;
    const action = el.dataset.action;
    if(action === 'copy'){
      e.preventDefault();
      const text = el.dataset.copy || '';
      copyToClipboard(text).then(()=> showToast('Copied to clipboard')).catch(()=> showToast('Copy failed'));
      return;
    }
    if(action === 'open-link'){
      e.preventDefault();
      const url = el.dataset.url;
      if(!url) return;
      window.open(url, '_blank', 'noopener');
    }
  });
});
