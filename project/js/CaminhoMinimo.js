export class CaminhoMinimo {
  constructor() {
    this.passos = [];
  }

  // Para reiniciar os passos antes de uma nova execução
  resetarPassos() {
    this.passos = [];
  }

  // Converte uma matriz de adjacência (simétrica) em uma lista de arestas.
  // matrix: array NxN onde 0 = sem aresta, >0 = peso da aresta entre i e j
  matrixToEdges(matrix) {
    const edges = [];                 // cria array que vai armazenar as arestas (objetos {u, v, peso})
    const n = matrix.length;          // número de vértices (tamanho da matriz)

    for (let i = 0; i < n; i++) {     // percorre cada linha i (vértice i)
      for (let j = i + 1; j < n; j++) { // percorre somente j > i para não duplicar arestas (grafo não-direcionado)
        const peso = matrix[i][j];     // obtém o peso da aresta entre i e j
        if (peso !== 0) {              // se peso for diferente de zero, existe aresta
          edges.push({ u: i, v: j, peso }); // adiciona objeto representando a aresta à lista
          this.passos.push({
            texto: `Aresta encontrada: (${i}, ${j}) com peso ${peso}`,
            u: i,
            v: j
          });
        }
      }
    }

    this.passos.push({
      texto: `Total de ${edges.length} arestas carregadas.`
    });
    return edges;                     // retorna a lista de arestas
  }

  edgesToMatrix(edges, n) {
    // Cria uma matriz n x n preenchida com zeros
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    // Para cada aresta, atualiza os dois lados da matriz (simétrica)
    for (const { u, v, peso } of edges) {
      matrix[u][v] = peso;
      matrix[v][u] = peso;
    }

    return matrix;
  }

  // Implementação do algoritmo de Kruskal que retorna a lista de arestas da MST
  kruskal(matrix) {
    this.resetarPassos();          // limpa os passos antes de iniciar
    const n = matrix.length;          // número de vértices
    const edges = this.matrixToEdges(matrix); // extrai todas as arestas da matriz

    // Ordena arestas pelo peso em ordem crescente (menor peso primeiro),
    // porque Kruskal adiciona arestas do menor para o maior evitando ciclos.
    this.passos.push({
      texto: "Ordenando arestas por peso..."
    });
    edges.sort((a, b) => a.peso - b.peso);
    this.passos.push({
      texto:
        "Arestas ordenadas: " +
        edges.map(e => `(${e.u},${e.v})=${e.peso}`).join(", ")
    });

    this.passos.push({
      texto: "Inicializando estrutura Union-Find"
    });

    // Estrutura Union-Find (Disjoint Set) para detectar ciclos eficientemente
    const parent = [];                // parent[i] = representante/chefe do conjunto de i
    const rank = [];                  // rank[i] = "altura aproximada" da árvore do conjunto (usado para otimizar union)
    for (let i = 0; i < n; i++) {     // inicializa cada vértice como seu próprio conjunto
      parent[i] = i;                  // cada nó é inicialmente seu próprio pai
      rank[i] = 0;                    // rank começa em 0
      this.passos.push({
        texto: `Criado conjunto inicial contendo apenas o vértice ${i}.`
      });
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
      const { u, v, peso } = edge;
      this.passos.push({
        texto: `Avaliando aresta (${u},${v}) com peso ${peso}`,
        u,
        v
      });

      const rootU = find(u);
      const rootV = find(v);

      this.passos.push({
        texto: `- Vértice ${u} pertence ao conjunto ${rootU}`
      });
      this.passos.push({
        texto: `- Vértice ${v} pertence ao conjunto ${rootV}`
      });

      if (rootU !== rootV) {
        this.passos.push({
          texto: `Como são conjuntos diferentes, a aresta não cria ciclo.`,
          u,
          v
        });
        this.passos.push({
          texto: `Aresta (${u},${v}) com peso ${peso} foi adicionada na MST.`,
          u,
          v
        });

        union(u, v);
        mst.push(edge);

        this.passos.push({
          texto: `Conjuntos unidos: agora ${rootU} e ${rootV} pertencem ao mesmo componente.`
        });

        if (mst.length === n - 1) {
          this.passos.push({
            texto: "MST completa!"
          });
          break;
        }
      } else {
        this.passos.push({
          texto: `A aresta (${u},${v}) criaria um ciclo. Ela foi descartada.`,
          u,
          v
        });
      }
    }

    this.passos.push({
      texto: "Kruskal finalizado."
    });
    return mst;                      // retorna a lista de arestas que compõem a MST (ou floresta mínima, se desconexo)
  }
}