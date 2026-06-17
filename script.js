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

/* Changelogs: simple localStorage-backed editor */
const CL_KEY = 'westpvp_changelogs_v1';
function loadChangelogs(){
  try{const raw = localStorage.getItem(CL_KEY); return raw?JSON.parse(raw):[] }catch(e){return[]}
}
function saveChangelogs(list){
  localStorage.setItem(CL_KEY, JSON.stringify(list));
}
function renderChangelogs(){
  const container = document.getElementById('changelog-list');
  if(!container) return;
  const list = loadChangelogs();
  if(list.length===0){ container.innerHTML = '<p class="muted">No changelog entries yet.</p>'; return }
  container.innerHTML = list.map(entry=>`
    <div class="cl-entry" data-id="${entry.id}">
      <div class="cl-header"><strong>${escapeHtml(entry.title)}</strong><span class="cl-date">${escapeHtml(entry.date||'')}</span></div>
      <div class="cl-body">${escapeHtml(entry.body).replace(/\n/g,'<br>')}</div>
      <div class="cl-actions"><button class="btn" data-action="delete" data-id="${entry.id}">Delete</button></div>
    </div>
  `).join('');
}

function addChangelog(title,date,body){
  const list = loadChangelogs();
  list.unshift({ id: Date.now().toString(36), title, date: date||new Date().toISOString().slice(0,10), body });
  saveChangelogs(list);
  renderChangelogs();
}

function deleteChangelog(id){
  let list = loadChangelogs();
  list = list.filter(i=>i.id!==id);
  saveChangelogs(list);
  renderChangelogs();
}

function exportChangelogs(){
  const list = loadChangelogs();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'westpvp-changelogs.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }

document.addEventListener('DOMContentLoaded', ()=>{
  renderChangelogs();
  const form = document.getElementById('changelog-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = document.getElementById('cl-title').value.trim();
      const date = document.getElementById('cl-date').value;
      const body = document.getElementById('cl-body').value.trim();
      if(!title||!body) return;
      addChangelog(title,date,body);
      form.reset();
    });
  }
  const listEl = document.getElementById('changelog-list');
  if(listEl){
    listEl.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-action="delete"]');
      if(btn) deleteChangelog(btn.dataset.id);
    });
  }
  const exportBtn = document.getElementById('export-cl'); if(exportBtn) exportBtn.addEventListener('click', exportChangelogs);
  const clearBtn = document.getElementById('clear-cl'); if(clearBtn) clearBtn.addEventListener('click', ()=>{ if(confirm('Clear all changelog entries?')){ localStorage.removeItem(CL_KEY); renderChangelogs(); } });
});
