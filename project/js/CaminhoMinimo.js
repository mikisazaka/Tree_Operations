// Converte uma matriz de adjacência (simétrica) em uma lista de arestas.
// matrix: array NxN onde 0 = sem aresta, >0 = peso da aresta entre i e j
function matrixToEdges(matrix) {
  const edges = [];                 // cria array que vai armazenar as arestas (objetos {u, v, peso})
  const n = matrix.length;          // número de vértices (tamanho da matriz)

  for (let i = 0; i < n; i++) {     // percorre cada linha i (vértice i)
    for (let j = i + 1; j < n; j++) { // percorre somente j > i para não duplicar arestas (grafo não-direcionado)
      const peso = matrix[i][j];     // obtém o peso da aresta entre i e j
      if (peso !== 0) {              // se peso for diferente de zero, existe aresta
        edges.push({ u: i, v: j, peso }); // adiciona objeto representando a aresta à lista
      }
    }
  }
  return edges;                     // retorna a lista de arestas
}

// Implementação do algoritmo de Kruskal que retorna a lista de arestas da MST
function kruskal(matrix) {
  const n = matrix.length;          // número de vértices
  const edges = matrixToEdges(matrix); // extrai todas as arestas da matriz

  // Ordena arestas pelo peso em ordem crescente (menor peso primeiro),
  // porque Kruskal adiciona arestas do menor para o maior evitando ciclos.
  edges.sort((a, b) => a.peso - b.peso);

  // Estrutura Union-Find (Disjoint Set) para detectar ciclos eficientemente
  const parent = [];                // parent[i] = representante/chefe do conjunto de i
  const rank = [];                  // rank[i] = "altura aproximada" da árvore do conjunto (usado para otimizar union)
  for (let i = 0; i < n; i++) {     // inicializa cada vértice como seu próprio conjunto
    parent[i] = i;                  // cada nó é inicialmente seu próprio pai
    rank[i] = 0;                    // rank começa em 0
  }

  // find com compressão de caminho: encontra o representante do conjunto que contém x
  function find(x) {
    if (parent[x] !== x) {          // enquanto x não for o representante
      parent[x] = find(parent[x]);  // aplica compressão de caminho (encurta a rota para o representante)
    }
    return parent[x];               // retorna representante do conjunto
  }

  // union por rank: une os conjuntos de x e y; retorna true se uniu, false se já estavam unidos
  function union(x, y) {
    const rootX = find(x);          // representante de x
    const rootY = find(y);          // representante de y

    if (rootX === rootY) return false; // se já têm mesmo representante, já estão conectados -> evitamos ciclo

    // Anexa a árvore menor (rank menor) à árvore maior (rank maior) para manter árvores rasas
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;        // rootY se torna pai de rootX
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;        // rootX se torna pai de rootY
    } else {
      parent[rootY] = rootX;        // arbitrariamente escolhe rootX como novo pai
      rank[rootX]++;                // e incrementa o rank de rootX, pois a altura pode ter aumentado
    }
    return true;                    // união realizada com sucesso
  }

  // Array que vai armazenar as arestas escolhidas para a MST
  const mst = [];

  // Percorre as arestas em ordem crescente de peso e tenta adicioná-las
  for (const edge of edges) {
    if (union(edge.u, edge.v)) {   // tenta unir os conjuntos das duas pontas da aresta
      mst.push(edge);              // se a união foi bem-sucedida (não formaria ciclo), guarda a aresta na MST

      if (mst.length === n - 1) break; // otimização: uma MST em grafo conexo tem exatamente n-1 arestas
    }
  }

  return mst;                      // retorna a lista de arestas que compõem a MST (ou floresta mínima, se desconexo)
}
