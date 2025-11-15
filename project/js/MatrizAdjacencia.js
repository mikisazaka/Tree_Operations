(function () {
  // Seletores
  const numInput = document.getElementById('numVertices');
  const btnGerar = document.getElementById('btnGerar');
  const container = document.getElementById('matriz-container');
  const btnExportar = document.getElementById('btnExportar');

  let matrix = []; 
  let n = parseInt(numInput ? numInput.value : 4, 10) || 4;

  // Converte índice numérico -> letra (A, B, C...)
  function indexToLetter(i) {
    return String.fromCharCode(65 + i);
  }

  function createEmptyMatrix(size) {
    const m = new Array(size);
    for (let i = 0; i < size; i++) {
      m[i] = new Array(size).fill(0);
    }
    return m;
  }

  function renderMatrixTable() {
    container.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'matriz-table';
    table.style.borderCollapse = 'collapse';

    // Cabeçalho (A, B, C...)
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    headRow.appendChild(document.createElement('th')); // canto vazio

    for (let j = 0; j < n; j++) {
      const th = document.createElement('th');
      th.textContent = indexToLetter(j);
      th.style.padding = '6px';
      headRow.appendChild(th);
    }

    thead.appendChild(headRow);
    table.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement('tbody');

    for (let i = 0; i < n; i++) {
      const tr = document.createElement('tr');

      // Label lateral (A, B, C...)
      const label = document.createElement('th');
      label.textContent = indexToLetter(i);
      label.style.padding = '6px';
      tr.appendChild(label);

      for (let j = 0; j < n; j++) {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '4px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = matrix[i][j];
        input.style.width = '60px';
        input.dataset.i = i;
        input.dataset.j = j;

        input.addEventListener('input', onCellInput);
        td.appendChild(input);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function onCellInput(e) {
    const input = e.target;
    const i = parseInt(input.dataset.i, 10);
    const j = parseInt(input.dataset.j, 10);
    let val = input.value;

    if (val === '') val = '0';
    const num = Number(val);
    if (Number.isNaN(num) || num < 0) {
      input.classList.add('invalid');
      return;
    } else {
      input.classList.remove('invalid');
    }

    matrix[i][j] = num;
    matrix[j][i] = num;

    const mirrorSelector = `input[data-i='${j}'][data-j='${i}']`;
    const mirrorInput = document.querySelector(mirrorSelector);
    if (mirrorInput) mirrorInput.value = num;
  }

  function gerar() {
    const val = parseInt(numInput.value, 10);
    if (!Number.isInteger(val) || val < 1) {
      alert('Informe um número inteiro válido.');
      return;
    }

    n = val;
    matrix = createEmptyMatrix(n);
    renderMatrixTable();
  }

  function exportMatrix() {
    const exported = matrix.map(row => row.slice());

    if (typeof window.receiveMatrix === 'function') {
      window.receiveMatrix(exported);
    }

    const event = new CustomEvent('matrixReady', { detail: exported });
    document.dispatchEvent(event);

    alert('Matriz enviada com sucesso!');
  }

  function init() {
    if (!container) {
      console.warn('Container #matriz-container não encontrado.');
      return;
    }

    matrix = createEmptyMatrix(n);
    renderMatrixTable();

    if (btnGerar) btnGerar.addEventListener('click', gerar);
    if (btnExportar) btnExportar.addEventListener('click', exportMatrix);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window._matrizAdj = {
    getMatrix: () => matrix,
    setMatrix: (m) => {
      matrix = m;
      n = m.length;
      renderMatrixTable();
    }
  };

})();
