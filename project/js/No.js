class No {
    constructor(valor) {
        this.valor = valor;
        this.filhos = [];
    }

    adicionarFilho(no, posicao) {
        if(this.filhos.length < 3) {
            this.filhos.splice(posicao, 0, no);
        }
    }
}