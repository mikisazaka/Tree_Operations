import { desenharGrafo } from "./grafo.js";
import { CaminhoMinimo } from "./CaminhoMinimo.js";

// Separando a lógica de desenho do grafo em um arquivo separado para melhor organização.

const cm = new CaminhoMinimo();

// Seletores do container de passos
const passoTexto = document.getElementById('passoTextoGrafo');
const btnPrevPasso = document.getElementById('prevPassoGrafo');
const btnNextPasso = document.getElementById('nextPassoGrafo');

let currentPassoGrafo = 0;

// Eventos dos botões de navegação dos passos
function atualizarPassoGrafo() {
  const passo = cm.passos[currentPassoGrafo];

  passoTexto.textContent = passo?.texto || "(Nenhum passo)";

  // Redesenha o grafo destacando a aresta se existir u/v
  desenharGrafo(window.matrixGlobal, "grafoCanvas", passo);

  btnPrevPasso.disabled = currentPassoGrafo === 0;
  btnNextPasso.disabled = currentPassoGrafo === cm.passos.length - 1;
}

// Escuta o evento customizado "matrixReady" disparado quando a matriz de adjacência está pronta
document.addEventListener("matrixReady", (e) => {
  const matrix = e.detail;
  window.matrixGlobal = matrix; // Salva a matriz globalmente para uso posterior
  console.log("Matriz recebida:", matrix);
  try {
    desenharGrafo(matrix, "grafoCanvas");

    // Deixa visível o botão de caminho mínimo após desenhar o grafo
    document.getElementById("botao-caminho-wrapper")
      .classList.remove("hidden");
  } catch (err) {
    console.error('Erro ao desenhar grafo:', err);
  }
});

// Adiciona evento ao clicar no botão "Gerar Caminho Mínimo"
document.getElementById("btnCaminhoMinimo").addEventListener("click", () => {

  // Usa a matriz original salva
  const matrix = window.matrixGlobal;

  // Calcula a MST usando Kruskal e obtém a lista de arestas
  const mstEdges = cm.kruskal(matrix);
  // Converte a lista de arestas de volta para uma matriz de adjacência
  const mstMatrix = cm.edgesToMatrix(mstEdges, matrix.length);

  // Desenha o caminho mínimo no outro canvas
  desenharGrafo(mstMatrix, "caminhoCanvas");

  // Configura o passo a passo
  currentPassoGrafo = 0;
  atualizarPassoGrafo();
});

// Eventos dos botões de navegação dos passos
// Atualiza o texto do passo atual ao clicar nos botões
btnPrevPasso.addEventListener("click", () => {
  if (currentPassoGrafo > 0) {
    currentPassoGrafo--;
    atualizarPassoGrafo();
  }
});

btnNextPasso.addEventListener("click", () => {
  if (currentPassoGrafo < cm.passos.length - 1) {
    currentPassoGrafo++;
    atualizarPassoGrafo();
  }
});