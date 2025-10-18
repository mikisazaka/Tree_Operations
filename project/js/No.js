export class No {
    constructor(valor) {
        this.valor = valor;
        this.filhos = [null, null, null];
    }

adicionarFilho(no, posicao) {
        const indice = posicao - 1;

        if (indice < 0 || indice > 2) {
            return false;
        }
        if (this.filhos[indice] === null) {
            this.filhos[indice] = no;
            return true;
        }

        return false;
    }
}