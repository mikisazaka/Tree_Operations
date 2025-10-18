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

let currentZoom = 1.0;
const zoomStep = 0.1;
const minZoom = 0.3;
const maxZoom = 2.0;

/* Função para aplicar o zoom */
function applyZoom() {

    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));

    const transform = `scale(${currentZoom})`;
    const origin = 'top center';

    treeArea.style.transform = transform;
    treeArea.style.transformOrigin = origin;

    connectorLayer.style.transform = transform;
    connectorLayer.style.transformOrigin = origin;
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
                alert(`Falha ao inserir nó na posição ${pos}. Verifique se o nó pai existe e se a posição está livre.`);
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
                alert('Falha ao inserir nó. Verifique se o nó pai existe e se há posição disponível (1..3).');
            }
        }
    }

    valorInserir.value = '';
    localInsercao.value = '';
    posicaoInsercao.value = '';
    renderizarArvore();
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
});

function renderizarArvore() {
    treeArea.innerHTML = '';
    connectorLayer.innerHTML = '';

    if (!arvore.raiz) {
        const p = document.createElement('p');
        p.className = 'empty-msg';
        p.textContent = '(A árvore está vazia)';
        treeArea.appendChild(p);

        // Reseta o tamanho do SVG
        connectorLayer.style.width = '100%';
        connectorLayer.style.height = '100%';
        return;
    }

    // 1. Aplica o zoom (para garantir que o treeArea já esteja com o zoom correto)
    applyZoom();

    // 2. Constrói o DOM
    const raizEl = criarElementoNo(arvore.raiz);
    treeArea.appendChild(raizEl);

    // 3. Espera o DOM ser desenhado
    requestAnimationFrame(() => {
        // 4. Mede o tamanho real do CONTEÚDO (scrollWidth)
        const contentWidth = treeArea.scrollWidth;
        const contentHeight = treeArea.scrollHeight;

        const wrapperWidth = treeWrapper.clientWidth;
        const wrapperHeight = treeWrapper.clientHeight;

        // 5. Ajusta o TAMANHO do SVG para ser tão grande quanto o conteúdo
        connectorLayer.style.width = `${Math.max(contentWidth, wrapperWidth)}px`;
        connectorLayer.style.height = `${Math.max(contentHeight, wrapperHeight)}px`;

        // 6. SÓ AGORA desenha as conexões
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

renderizarArvore();