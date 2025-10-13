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
}