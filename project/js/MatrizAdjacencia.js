// MatrizAdjacencia.js
(function () {
  // Seletores
  const numInput = document.getElementById('numVertices');
  const btnGerar = document.getElementById('btnGerar');
  const container = document.getElementById('matriz-container');
  const btnExportar = document.getElementById('btnExportar');

  let matrix = []; // matriz interna (array de arrays)
  let n = parseInt(numInput ? numInput.value : 4, 10) || 4;

  // Cria matriz NxN inicializada com 0 ou Infinity (use 0 para sem aresta)
  function createEmptyMatrix(size) {
    const m = new Array(size);
    for (let i = 0; i < size; i++) {
      m[i] = new Array(size).fill(0);
    }
    return m;
  }

  // Renderiza tabela editável
  function renderMatrixTable() {
    container.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'matriz-table';
    table.style.borderCollapse = 'collapse';

    // cabeçalho
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('th')); // canto vazio
    for (let j = 0; j < n; j++) {
      const th = document.createElement('th');
      th.textContent = j; // ou letras A,B...
      th.style.padding = '6px';
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    // corpo
    const tbody = document.createElement('tbody');
    for (let i = 0; i < n; i++) {
      const tr = document.createElement('tr');
      const label = document.createElement('th');
      label.textContent = i;
      label.style.padding = '6px';
      tr.appendChild(label);

      for (let j = 0; j < n; j++) {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '4px';

        // se for diagonal, pode deixar readOnly = true (peso 0)
        if (i === j) {
          td.textContent = '0';
        } else {
          const input = document.createElement('input');
          input.type = 'number';
          input.min = '0';
          input.value = matrix[i][j];
          input.style.width = '60px';
          input.dataset.i = i;
          input.dataset.j = j;

          // evento de alteração
          input.addEventListener('input', onCellInput);
          td.appendChild(input);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Trata input, atualiza matriz e espelha
  function onCellInput(e) {
    const input = e.target;
    const i = parseInt(input.dataset.i, 10);
    const j = parseInt(input.dataset.j, 10);
    let val = input.value;

    // validar: aceitar vazio (interpreta como 0) ou número >=0
    if (val === '') val = '0';
    const num = Number(val);
    if (Number.isNaN(num) || num < 0) {
      input.classList.add('invalid');
      return;
    } else {
      input.classList.remove('invalid');
    }

    matrix[i][j] = num;
    // espelhar: se entrada A->B mudou, atualiza B->A
    matrix[j][i] = num;

    // Atualiza o input espelhado na tabela, se existir
    const mirrorSelector = `input[data-i='${j}'][data-j='${i}']`;
    const mirrorInput = document.querySelector(mirrorSelector);
    if (mirrorInput) mirrorInput.value = num;
  }

  // Gera matriz com base no número informado
  function gerar() {
    const val = parseInt(numInput.value, 10);
    if (!Number.isInteger(val) || val < 1) {
      alert('Informe um número inteiro de vértices válido.');
      return;
    }
    n = val;
    matrix = createEmptyMatrix(n);
    renderMatrixTable();
  }

  // Exporta a matriz (ex.: clique em "Enviar matriz")
  function exportMatrix() {
    // pode-se converter 0 em null ou Infinity dependendo do que Arvore.js espera
    const exported = matrix.map(row => row.slice()); // cópia

    // Se existir uma função global receiveMatrix, chama-a
    if (typeof window.receiveMatrix === 'function') {
      window.receiveMatrix(exported);
    }

    // Também dispara evento customizado para listeners (Main.js escuta)
    const event = new CustomEvent('matrixReady', { detail: exported });
    document.dispatchEvent(event);

    // feedback ao usuário
    alert('Matriz enviada com sucesso!');
  }

  // Inicialização
  function init() {
    if (!container) {
      console.warn('Container #matriz-container não encontrado no HTML.');
      return;
    }
    // criar matriz inicial
    matrix = createEmptyMatrix(n);
    renderMatrixTable();

    // listeners nos botões
    if (btnGerar) btnGerar.addEventListener('click', gerar);
    if (btnExportar) btnExportar.addEventListener('click', exportMatrix);
  }

  // roda quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // exporta utilidades para debug
  window._matrizAdj = {
    getMatrix: () => matrix,
    setMatrix: (m) => {
      matrix = m;
      n = m.length;
      renderMatrixTable();
    }
  };

})();
