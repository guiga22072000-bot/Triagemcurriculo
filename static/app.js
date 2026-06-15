// New analysis page
(function(){
  const form = document.getElementById('analyzeForm');
  if(!form) return;
  const input = document.getElementById('cvInput');
  const list = document.getElementById('fileList');
  const count = document.getElementById('fileCount');
  const dz = document.getElementById('dropzone');
  const overlay = document.getElementById('overlay');
  const progressText = document.getElementById('progressText');
  let files = [];

  document.getElementById('pickBtn').onclick = () => input.click();
  input.onchange = e => addFiles(e.target.files);

  ['dragenter','dragover'].forEach(ev => dz.addEventListener(ev, e => {e.preventDefault();dz.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev => dz.addEventListener(ev, e => {e.preventDefault();dz.classList.remove('drag')}));
  dz.addEventListener('drop', e => addFiles(e.dataTransfer.files));

  function addFiles(fl){
    for(const f of fl){
      if(f.size > 10*1024*1024){ alert(`${f.name} ultrapassa 10MB`); continue; }
      files.push(f);
    }
    render();
  }
  function render(){
    list.innerHTML = '';
    files.forEach((f,i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>📄 ${f.name} <small style="color:#94a3b8">(${(f.size/1024).toFixed(0)} KB)</small></span><button type="button" data-i="${i}">✕</button>`;
      list.appendChild(li);
    });
    count.textContent = `${files.length} SELECIONADO${files.length===1?'':'S'}`;
    list.querySelectorAll('button').forEach(b => b.onclick = () => { files.splice(+b.dataset.i,1); render(); });
  }

  // weights sum indicator
  const wInputs = form.querySelectorAll('.weights input');
  const sumEl = document.getElementById('sumW');
  function sumW(){
    let s=0; wInputs.forEach(i => s += parseInt(i.value||0));
    sumEl.textContent = s;
    sumEl.style.color = s===100 ? '' : '#dc2626';
    return s;
  }
  wInputs.forEach(i => i.oninput = sumW);
  sumW();

  form.onsubmit = async e => {
    e.preventDefault();
    if(files.length===0){ alert('Adicione ao menos um currículo.'); return; }
    if(sumW()!==100){ alert('A soma dos pesos deve ser 100%.'); return; }

    const fd = new FormData(form);
    fd.delete('cvs');
    files.forEach(f => fd.append('cvs', f));

    overlay.classList.remove('hidden');
    progressText.textContent = `Analisando ${files.length} currículo(s)…`;
    try{
      const res = await fetch('/api/analyze', {method:'POST', body: fd});
      const j = await res.json();
      if(!res.ok){ throw new Error(j.error || 'Erro'); }
      window.location.href = '/resultados';
    }catch(err){
      alert('Erro: ' + err.message);
      overlay.classList.add('hidden');
    }
  };
})();
