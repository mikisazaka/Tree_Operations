import { desenharGrafo } from "./grafo.js";

// Separando a lógica de desenho do grafo em um arquivo separado para melhor organização.

// Escuta o evento customizado "matrixReady" disparado quando a matriz de adjacência está pronta
document.addEventListener("matrixReady", (e) => {
  const matrix = e.detail;
  console.log("Matriz recebida:", matrix);
  try {
    desenharGrafo(matrix);
  } catch (err) {
    console.error('Erro ao desenhar grafo:', err);
  }
});
