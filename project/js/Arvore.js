class Arvore {
    constructor() {
        this.raiz = null;
        this.passos = [];
    }

    inserir(valorPai, valor, posicao) {
        this.passos = [];
        const noPai = this.buscar(this.raiz, valorPai);

        if (noPai !== null) {
            this.passos.push('Nó pai encontrado!');
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
            this.passos.push(`Nó ${valor} não encontrado`);
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
        this.passos = [];

        if (no == null) {
            this.passos.push("Árvore vazia!");
            return false;
        }

        if (no === this.raiz && no.valor === valor) {
            this.passos.push(`Removendo a raiz ${valor}`);

            if (no.filhos.length === 0) {
                this.raiz = null;
                this.passos.push(`Árvore novamente vazia`);
            } else {
                const novoRaiz = no.filhos[0];
                novoRaiz.filhos.push(...no.filhos.slice(1));
                this.raiz = novoRaiz;
                this.passos.push(`Novo nó raiz é ${novoRaiz.valor}. Os demais filhos continuam como filhos da nova raiz`);
            }
            return true;
        }

        for (let i = 0; i < no.filhos.length; i++) {
            const filho = no.filhos[i];
            this.passos.push(`Visitando o nó filho ${filho.valor}`);

            if (filho.valor === valor) {
                this.passos.push(`Removendo nó ${valor}`);

                if (filho.filhos.length === 0) {
                    no.filhos.splice(i, 1);
                    this.passos.push(`Nó folha ${valor} removido`);
                } else {
                    const novoNo = filho.filhos[0];
                    novoNo.filhos.push(...filho.filhos.slice(1));
                    no.filhos[i] = novoNo;
                    this.passos.push(`Nó ${valor} substituído por ${novoNo.valor}. Os demais filhos continuam como filhos do novo nó pai`);
                }
                return true;
            }

            if (this.remover(valor, filho)) {
                return true;
            }
        }

        this.passos.push(`Nó ${valor} não encontrado!`);
        return false;
    }
}