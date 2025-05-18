function gerarResumo() {
  const texto = document.getElementById('inputText').value.trim();
  if (!texto) {
    alert('Por favor, cole algum texto para resumir.');
    return;
  }

  const frases = texto.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const palavras = texto.toLowerCase().split(/\W+/).filter(w => w.length > 3);

  const frequencia = {};
  palavras.forEach(p => frequencia[p] = (frequencia[p] || 0) + 1);

  const frasesPontuadas = frases.map(frase => {
    const palavrasFrase = frase.toLowerCase().split(/\W+/);
    const score = palavrasFrase.reduce((acc, p) => acc + (frequencia[p] || 0), 0);
    return { frase, score };
  });

  frasesPontuadas.sort((a, b) => b.score - a.score);

  const topFrases = frasesPontuadas.slice(0, Math.min(3, frasesPontuadas.length)).map(f => f.frase);

  document.getElementById('outputResumo').innerText = topFrases.join(' ');
}

let rotina = JSON.parse(localStorage.getItem('rotina')) || [];

function mostrarRotina() {
  const tbody = document.getElementById('rotinaCorpo');
  tbody.innerHTML = '';

  rotina.forEach(({ dia, materia, hora }, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dia}</td>
      <td>${materia}</td>
      <td>${hora}</td>
      <td><button onclick="removerRotina(${i})">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarRotina(event) {
  event.preventDefault();

  const dia = document.getElementById('diaSemana').value;
  const materia = document.getElementById('materiaInput').value.trim();
  const hora = document.getElementById('horaInput').value;

  if (!materia || !hora) {
    alert('Preencha matéria e hora.');
    return;
  }

  rotina.push({ dia, materia, hora });
  localStorage.setItem('rotina', JSON.stringify(rotina));
  mostrarRotina();
  event.target.reset();
}

function removerRotina(index) {
  rotina.splice(index, 1);
  localStorage.setItem('rotina', JSON.stringify(rotina));
  mostrarRotina();
}

mostrarRotina();

let metas = JSON.parse(localStorage.getItem('metas')) || [];

function mostrarMetas() {
  const ul = document.getElementById('listaMetas');
  ul.innerHTML = '';

  metas.forEach((meta, i) => {
    const li = document.createElement('li');
    li.textContent = meta;
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'X';
    btnExcluir.onclick = () => {
      metas.splice(i, 1);
      salvarMetas();
      mostrarMetas();
    };
    li.appendChild(btnExcluir);
    ul.appendChild(li);
  });

  document.getElementById('contadorMetas').textContent = `Metas: ${metas.length}`;
}

function salvarMetas() {
  localStorage.setItem('metas', JSON.stringify(metas));
}

function adicionarMeta(event) {
  event.preventDefault();
  const input = document.getElementById('metaInput');
  const texto = input.value.trim();

  if (!texto) {
    alert('Digite uma meta!');
    return;
  }

  metas.push(texto);
  salvarMetas();
  mostrarMetas();
  input.value = '';
}

mostrarMetas();
const btnCopiar = document.getElementById('btnCopiar');
const btnColar = document.getElementById('btnColar');
const outputResumo = document.getElementById('outputResumo');
const inputText = document.getElementById('inputText');
const msgResumo = document.getElementById('msgResumo');

btnCopiar.addEventListener('click', async () => {
  const texto = outputResumo.innerText.trim();
  if (!texto) {
    mostrarMensagem('Nada para copiar.', true);
    return;
  }
  try {
    await navigator.clipboard.writeText(texto);
    mostrarMensagem('Resumo copiado!', false);
  } catch {
    mostrarMensagem('Erro ao copiar.', true);
  }
});

btnColar.addEventListener('click', async () => {
  try {
    const texto = await navigator.clipboard.readText();
    if (!texto) {
      mostrarMensagem('Área de transferência vazia.', true);
      return;
    }
    inputText.value = texto;
    mostrarMensagem('Texto colado no campo.', false);
  } catch {
    mostrarMensagem('Não foi possível acessar a área de transferência.', true);
  }
});

function mostrarMensagem(msg, isErro) {
  msgResumo.innerText = msg;
  msgResumo.style.color = isErro ? '#e74c3c' : '#4caf50';
  setTimeout(() => {
    msgResumo.innerText = '';
  }, 2500);
}
