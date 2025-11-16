export function desenharGrafo(matrix) {
  // Pega o canvas onde o grafo será desenhado
  const canvas = document.getElementById("grafoCanvas");
  const ctx = canvas.getContext("2d"); // Ferramenta que permite desenhar no canvas

  const n = matrix.length; // Quantidade de vértices (linhas da matriz)
  const radius = 20;       // Tamanho dos círculos dos vértices

  // Define o tamanho da área onde o grafo será exibido
  canvas.width = 800;
  canvas.height = 500;

  // Limpa qualquer desenho anterior
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // POSICIONAR OS VÉRTICES EM CÍRCULO
  // Centro do canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  // Raio do círculo onde os vértices serão distribuídos
  const R = 180;

  const vertices = [];

  // Calcula a posição de cada vértice ao redor de um círculo
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI; // Divide o círculo igualmente
    vertices.push({
      label: String.fromCharCode(65 + i), // A, B, C, D...
      x: centerX + R * Math.cos(angle),   // Posição X
      y: centerY + R * Math.sin(angle),   // Posição Y
    });
  }

  // DESENHAR ARESTAS (LIGAÇÕES NORMAIS)
  ctx.font = "bold 14px Arial";
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {    // Evita desenhar duas vezes a mesma aresta
      const peso = matrix[i][j];         // Peso na matriz
      if (peso !== 0) {                  // Se não é zero, existe ligação
        const v1 = vertices[i];
        const v2 = vertices[j];

        // Desenha a linha entre dois vértices
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);          // Começa no vértice 1
        ctx.lineTo(v2.x, v2.y);          // Vai até o vértice 2
        ctx.strokeStyle = "#0f0f0fff";   // Cor da linha
        ctx.lineWidth = 2;
        ctx.stroke();

        // Escreve o peso no meio da linha
        const mx = (v1.x + v2.x) / 2;
        const my = (v1.y + v2.y) / 2;

        ctx.fillStyle = "#29003bff";
        ctx.fillText(peso, mx + 8, my - 8);
      }
    }
  }

  // DESENHAR LOOPS (LIGAÇÕES DO VÉRTICE PARA ELE MESMO)
  for (let i = 0; i < n; i++) {
    const peso = matrix[i][i];
    if (peso !== 0) {
      const v = vertices[i];

      // Ângulo do vértice no círculo
      const angle = (i / n) * 2 * Math.PI;

      // Distância do loop para o vértice
      const offset = 28;

      // Posição do loop baseada no ângulo
      const loopX = v.x + Math.cos(angle) * offset;
      const loopY = v.y + Math.sin(angle) * offset;

      // Desenha o loop
      ctx.beginPath();
      ctx.arc(loopX, loopY, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "#0f0f0fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Escreve o peso
      ctx.fillStyle = "#29003bff";
      ctx.font = "bold 14px Arial";
      ctx.fillText(peso, loopX + 20, loopY - 20);
    }
  }


  // DESENHAR OS VÉRTICES
  for (const v of vertices) {
    // Desenha o círculo do vértice
    ctx.beginPath();
    ctx.arc(v.x, v.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#9890d8";
    ctx.fill();
    ctx.strokeStyle = "#481253";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Desenha a letra dentro do círculo (A, B, C…)
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(v.label, v.x, v.y);
  }
}
