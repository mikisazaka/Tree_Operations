import { Arvore } from './Arvore.js';
import { No } from './No.js';

const arvore = new Arvore();

// Seletores de Elementos
const valorInserir = document.getElementById('valorInserir');
const localInsercao = document.getElementById('localInsercao');
const valorRemover = document.getElementById('valorRemover');
const btnInserir = document.getElementById('btnInserir');
const btnRemover = document.getElementById('btnRemover');
const treeArea = document.getElementById('treeArea');
const connectorLayer = document.getElementById('connectorLayer');
const posicaoInsercao = document.getElementById('posicaoInsercao');

/* Variáveis e seletores para o zoom */
const treeWrapper = document.querySelector('.tree-wrapper');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnResetZoom = document.getElementById('btnResetZoom');

// Seletores do container de passos
const passosContainer = document.querySelector('.passos-slider');
const passoTexto = document.getElementById('passoTexto');
const btnPrevPasso = document.getElementById('prevPasso');
const btnNextPasso = document.getElementById('nextPasso');

let currentZoom = 1.0;
const zoomStep = 0.1;
const minZoom = 0.3;
const maxZoom = 2.0;
let currentPasso = 0;

/* Função para aplicar o zoom */
function applyZoom() {
    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));
    const transform = `scale(${currentZoom})`;
    const origin = 'top center';
    treeArea.style.transform = transform;
    treeArea.style.transformOrigin = origin;
}

btnZoomIn.addEventListener('click', () => {
    currentZoom += zoomStep;
    applyZoom();
    requestAnimationFrame(() => {
        connectorLayer.innerHTML = '';
        desenharConexoes(treeArea.querySelector('.node'));
    });
});

btnZoomOut.addEventListener('click', () => {
    currentZoom -= zoomStep;
    applyZoom();
    requestAnimationFrame(() => {
        connectorLayer.innerHTML = '';
        desenharConexoes(treeArea.querySelector('.node'));
    });
});

btnResetZoom.addEventListener('click', () => {
    currentZoom = 1.0;
    applyZoom();
    requestAnimationFrame(() => {
        connectorLayer.innerHTML = '';
        desenharConexoes(treeArea.querySelector('.node'));
    });
});

btnInserir.addEventListener('click', () => {
    const valorStr = valorInserir.value?.trim();
    const localStr = localInsercao.value?.trim();
    const posicaoStr = posicaoInsercao.value?.trim();

    if (!valorStr) {
        alert('Insira um valor para inserir!');
        return;
    }

    const valor = parseInt(valorStr, 10);
    if (isNaN(valor)) {
        alert('O valor para inserir deve ser um número.');
        return;
    }

    if (!arvore.raiz) {
        arvore.raiz = new No(valor);
        arvore.passos.push(`Criada a raiz ${valor}`);
    } else {
        let paiValor;
        if (localStr) {
            paiValor = parseInt(localStr, 10);
            if (isNaN(paiValor)) {
                alert('O local (pai) deve ser um número.');
                return;
            }
        } else {
            paiValor = arvore.raiz.valor;
        }

        if (posicaoStr) {
            const pos = parseInt(posicaoStr, 10);
            if (isNaN(pos) || pos < 1 || pos > 3) {
                alert('Posição inválida. Insira 1, 2 ou 3.');
                return;
            }
            if (!arvore.inserir(paiValor, valor, pos)) {
                alert(`Falha ao inserir nó na posição ${pos}.`);
            }
        } else {
            let inserido = false;
            for (let pos = 1; pos <= 3; pos++) {
                if (arvore.inserir(paiValor, valor, pos)) {
                    inserido = true;
                    break;
                }
            }
            if (!inserido) {
                alert('Falha ao inserir nó. Verifique se o nó pai existe e se há posição disponível.');
            }
        }
    }

    valorInserir.value = '';
    localInsercao.value = '';
    posicaoInsercao.value = '';
    renderizarArvore();
    mostrarPassos();
});

btnRemover.addEventListener('click', () => {
    const valorStr = valorRemover.value?.trim();

    if (!valorStr) {
        alert('Insira o valor a ser removido!');
        return;
    }

    const valor = parseInt(valorStr, 10);
    if (isNaN(valor)) {
        alert('O valor a ser removido deve ser um número.');
        return;
    }

    const sucesso = arvore.remover(valor, arvore.raiz);

    if (!sucesso) {
        alert('Nó não encontrado ou remoção falhou.');
    }

    valorRemover.value = '';
    renderizarArvore();
    mostrarPassos();
});

function renderizarArvore() {
    treeArea.innerHTML = '';
    connectorLayer.innerHTML = '';

    if (!arvore.raiz) {
        const p = document.createElement('p');
        p.className = 'empty-msg';
        p.textContent = '(A árvore está vazia)';
        treeArea.appendChild(p);
        connectorLayer.style.width = '100%';
        connectorLayer.style.height = '100%';
        return;
    }

    applyZoom();

    const raizEl = criarElementoNo(arvore.raiz);
    treeArea.appendChild(raizEl);

    requestAnimationFrame(() => {
        const contentWidth = treeArea.scrollWidth;
        const contentHeight = treeArea.scrollHeight;
        const wrapperWidth = treeWrapper.clientWidth;
        const wrapperHeight = treeWrapper.clientHeight;

        connectorLayer.style.width = `${Math.max(contentWidth, wrapperWidth)}px`;
        connectorLayer.style.height = `${Math.max(contentHeight, wrapperHeight)}px`;
        desenharConexoes(raizEl);
    });
}

function criarElementoNo(no) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'node';
    nodeDiv.dataset.valor = no.valor;

    const valueDiv = document.createElement('div');
    valueDiv.className = 'value';
    valueDiv.textContent = no.valor;
    nodeDiv.appendChild(valueDiv);

    if (no.filhos && no.filhos.length > 0) {
        const filhosDiv = document.createElement('div');
        filhosDiv.className = 'children';

        let temFilhosReais = false;

        no.filhos.forEach(filho => {
            if (filho) {
                const filhoEl = criarElementoNo(filho);
                filhosDiv.appendChild(filhoEl);
                temFilhosReais = true;
            }
        });

        if (temFilhosReais) {
            nodeDiv.appendChild(filhosDiv);
        }
    }

    return nodeDiv;
}

function desenharConexoes(rootEl) {
    if (!rootEl) return;
    const nodes = rootEl.querySelectorAll('.node');
    const layerBox = connectorLayer.getBoundingClientRect();

    nodes.forEach(nodeEl => {
        const filhos = nodeEl.querySelectorAll(':scope > .children > .node');
        if (!filhos || filhos.length === 0) return;

        const paiBox = nodeEl.querySelector('.value').getBoundingClientRect();
        const paiX = paiBox.left + paiBox.width / 2 - layerBox.left;
        const paiY = paiBox.bottom - layerBox.top;

        filhos.forEach(filhoEl => {
            const filhoBox = filhoEl.querySelector('.value').getBoundingClientRect();
            const filhoX = filhoBox.left + filhoBox.width / 2 - layerBox.left;
            const filhoY = filhoBox.top - layerBox.top;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${paiX},${paiY} C ${paiX},${paiY + 40} ${filhoX},${filhoY - 40} ${filhoX},${filhoY}`;
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#999');
            path.setAttribute('fill', 'transparent');
            path.setAttribute('stroke-width', '2');
            connectorLayer.appendChild(path);
        });
    });
}

function mostrarPassos() {
    if (arvore.passos.length === 0) {
        passoTexto.textContent = '(Nenhum passo disponível)';
        return;
    }

    currentPasso = 0;
    atualizarPasso();
}

function atualizarPasso() {
    passoTexto.textContent = arvore.passos[currentPasso];

    const nos = treeArea.querySelectorAll('.node');
    nos.forEach(node => node.classList.remove('ativo'));

    const texto = arvore.passos[currentPasso];
    const match = texto.match(/nó\s+(\d+)/i);

    if (match) {
        const valorNo = match[1];
        const noEl = treeArea.querySelector(`.node[data-valor="${valorNo}"]`);
        if (noEl) {
            noEl.classList.add('ativo');
        }
    }
}

btnPrevPasso.addEventListener('click', () => {
    if (arvore.passos.length === 0) return;
    if (currentPasso > 0) {
        currentPasso--;
        atualizarPasso();
    }
});

btnNextPasso.addEventListener('click', () => {
    if (arvore.passos.length === 0) return;
    if (currentPasso < arvore.passos.length - 1) {
        currentPasso++;
        atualizarPasso();
    }
});

renderizarArvore();
