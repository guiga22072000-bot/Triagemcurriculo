(function(){
  const tbody = document.querySelector('#cands tbody');
  if(!tbody) return;
  const empty = document.getElementById('empty');
  const search = document.getElementById('search');
  const fJob = document.getElementById('fJob');
  const fLevel = document.getElementById('fLevel');
  const fStage = document.getElementById('fStage');
  const drawer = document.getElementById('drawer');
  const drawerBody = document.getElementById('drawerBody');
  document.getElementById('closeDrawer').onclick = () => drawer.classList.add('hidden');

  function initials(name){ return (name||'?').split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase(); }
  function levelClass(l){
    return {'Alta aderência':'lvl-high','Boa aderência':'lvl-good','Aderência parcial':'lvl-mid','Baixa aderência':'lvl-low'}[l]||'lvl-mid';
  }
  function fmtDate(s){ try{ const d=new Date(s); return d.toLocaleDateString('pt-BR'); }catch{return s;} }

  async function load(){
    const params = new URLSearchParams({
      q: search.value, job: fJob.value, level: fLevel.value, stage: fStage.value
    });
    const r = await fetch('/api/candidates?' + params);
    const data = await r.json();

    // jobs filter
    if(fJob.options.length <= 1){
      data.jobs.forEach(j => {
        const o = document.createElement('option'); o.value=j.id; o.textContent=j.title; fJob.appendChild(o);
      });
    }

    tbody.innerHTML = '';
    if(!data.candidates.length){ empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');

    data.candidates.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td><span class="avatar">${initials(c.name)}</span>
            <span><div class="cand-name">${c.name||''}</div><div class="cand-loc">${c.location||''}</div></span></td>
        <td>${c.whatsapp ? `<span class="wa">📱 ${c.whatsapp}</span>` : '<span class="cand-loc">—</span>'}</td>
        <td>${c.linkedin ? `<a class="li" href="${c.linkedin}" target="_blank">in LinkedIn</a>` : '<span class="cand-loc">—</span>'}</td>
        <td><div>${c.job_title||''}</div><div class="cand-loc">Cód: ${c.job_code||''}</div></td>
        <td style="text-align:center"><span class="score-badge ${levelClass(c.level)}">${c.score}%</span>
            <span class="score-text">${c.level}</span></td>
        <td>
          <select class="stage-select" data-id="${c.id}">
            ${['Novo','Triagem','Entrevista','Proposta','Contratado','Reprovado']
              .map(s => `<option ${s===c.stage?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>${fmtDate(c.created_at)}</td>
        <td>
          <button class="icon-btn" title="Ver" data-view="${c.id}">👁</button>
          <button class="icon-btn" title="Excluir" data-del="${c.id}">🗑</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.stage-select').forEach(s => s.onchange = async e => {
      await fetch(`/api/candidates/${s.dataset.id}/stage`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({stage: e.target.value})});
    });
    tbody.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if(!confirm('Excluir candidato?')) return;
      await fetch(`/api/candidates/${b.dataset.del}`, {method:'DELETE'});
      load();
    });
    tbody.querySelectorAll('[data-view]').forEach(b => b.onclick = async () => {
      const r = await fetch(`/api/candidates/${b.dataset.view}/detail`);
      const c = await r.json();
      const d = c.details || {};
      drawerBody.innerHTML = `
        <h2>${c.name||''}</h2>
        <p class="cand-loc">${c.location||''}</p>
        <p><strong>Vaga:</strong> ${c.job_title||''}</p>
        <p><strong>Compatibilidade:</strong> <span class="score-badge ${levelClass(c.level||'')}">${c.score}%</span></p>
        <p>${c.summary||''}</p>
        ${d.strengths?.length ? `<h3>Pontos fortes</h3><ul>${d.strengths.map(s=>`<li>${s}</li>`).join('')}</ul>`:''}
        ${d.gaps?.length ? `<h3>Lacunas</h3><ul>${d.gaps.map(s=>`<li>${s}</li>`).join('')}</ul>`:''}
        ${d.scores_breakdown ? `<h3>Pontuações por critério</h3><ul>${Object.entries(d.scores_breakdown).map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>`:''}
      `;
      drawer.classList.remove('hidden');
    });
  }

  [search,fJob,fLevel,fStage].forEach(el => el.addEventListener('input', load));
  load();
})();
