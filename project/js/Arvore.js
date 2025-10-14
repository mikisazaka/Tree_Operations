class Arvore {
    constructor() {
        this.raiz = null;
    }

    buscar(no, valor) {
        if (no === null) return null;

        if (no.valor == valor) return no;

        for (let i = 0; i < no.filhos.length; i++) {
            const resultado = this.buscar(no.filhos[i], valor);
            if (resultado !== null) {
                return resultado;
            }
        }

        return null;
    }

    remover(valor, no) {
        if (no === this.raiz && no.valor === valor) {
            this.raiz = null;
            return true;
        }

        if (no === null) return false;

        for (let i = 0; i < no.filhos.length; i++) {
            const filho = no.filhos[i];

            if (filho.valor === valor) {
                const noRemovido = no.filhos[i];
                no.filhos.splice(i, 1, ...noRemovido.filhos);
                return true;
            }
            if (this.remover(valor, filho)) {
                return true;
            }
        }
        return false;
    }
}