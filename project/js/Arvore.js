import { No } from "./No.js";

export class Arvore {
    constructor() {
        this.raiz = null;
        this.passos = [];
    }

    inserir(valorPai, valor, posicao) {
        this.passos = [];
        const noPai = this.buscar(this.raiz, valorPai);

        if (noPai !== null) {
            const novoNo = new No(valor);

            if (noPai.adicionarFilho(novoNo, posicao)) {
                this.passos.push(`Inserindo o nó ${valor} na posição ${posicao} do nó pai ${valorPai}`);
                return true;
            } else {
                this.passos.push('Não foi possível inserir o nó. Para inserção correta, lembre-se que cada nó ' +
                    'possui um limite de 3 filhos e que a posição precisa estar nesse intervalo de valores (entre 1 e 3)');
                return false;
            }
        } this.passos.push('Nó pai não encontrado');
        return false;
    }

    // Inicia com nó raiz como parâmetro
    buscar(no, valor) {
        if (no === null) {
            return null;
        }

        this.passos.push(`Visitando nó ${no.valor}`);

        if (no.valor == valor) {
            this.passos.push(`Nó ${no.valor} encontrado!`);
            return no;
        }

        for (let i = 0; i < no.filhos.length; i++) {
            const resultado = this.buscar(no.filhos[i], valor);
            if (resultado !== null) {
                return resultado;
            }
        }

        return null;
    }

    // Nó pai é substituído pelo nó filho da esquerda
    // Recebe como parâmetro o nó pai e o valor do nó a ser removido
    remover(valor, no) {
        // Reiniciamos os passos no início da chamada principal
        if (no === this.raiz) {
            this.passos = [];
        }

        if (no === null) {
            this.passos.push("Árvore vazia!");
            return false;
        }

        // Caso 1: Removendo a raiz
        if (no === this.raiz && no.valor === valor) {
            this.passos.push(`Removendo a raiz ${valor}`);
            // Encontra o primeiro filho válido para ser a nova raiz
            const novaRaiz = no.filhos.find(f => f !== null) || null;

            if (novaRaiz === null) {
                this.raiz = null;
                this.passos.push(`Árvore novamente vazia`);
            } else {
                // Remove a nova raiz da lista de filhos para não ser adicionada a si mesma
                const outrosFilhos = no.filhos.filter(f => f !== novaRaiz && f !== null);
                // Adiciona os filhos restantes aos filhos da nova raiz (encontrando slots livres)
                outrosFilhos.forEach(outroFilho => {
                    for (let i = 1; i <= 3; i++) {
                        if (novaRaiz.adicionarFilho(outroFilho, i)) break;
                    }
                });
                this.raiz = novaRaiz;
                this.passos.push(`Novo nó raiz é ${novaRaiz.valor}. Os demais filhos foram realocados.`);
            }
            return true;
        }

        // Caso 2: Buscando o nó para remover nos filhos
        for (let i = 0; i < no.filhos.length; i++) {
            const filho = no.filhos[i];

            // --- CORREÇÃO IMPORTANTE AQUI ---
            // Só processa se o filho não for null
            if (filho) {
                this.passos.push(`Visitando o nó filho ${filho.valor} do pai ${no.valor}`);

                // Se o filho atual é o que queremos remover
                if (filho.valor === valor) {
                    this.passos.push(`Removendo nó ${valor}`);
                    const filhosDoRemovido = filho.filhos.filter(f => f !== null);

                    // Substitui o filho removido pelo primeiro de seus próprios filhos (se houver)
                    const substituto = filhosDoRemovido.length > 0 ? filhosDoRemovido[0] : null;
                    no.filhos[i] = substituto;

                    if (substituto) {
                        const outrosFilhos = filhosDoRemovido.slice(1);
                        outrosFilhos.forEach(outroFilho => {
                            for (let j = 1; j <= 3; j++) {
                                if (substituto.adicionarFilho(outroFilho, j)) break;
                            }
                        });
                        this.passos.push(`Nó ${valor} substituído por ${substituto.valor}. Os demais filhos foram realocados.`);
                    } else {
                        no.filhos[i] = null; // Se não tinha filhos, apenas remove
                        this.passos.push(`Nó folha ${valor} removido`);
                    }
                    return true;
                }

                // Chamada recursiva para os níveis mais baixos
                if (this.remover(valor, filho)) {
                    return true;
                }
            }
        }

        return false;
    }
}