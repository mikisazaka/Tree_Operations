class No {
    constructor(valor) {
        this.valor = valor;
        this.filhos = [];
    }

    adicionarFilho(no, posicao) {
        if(this.filhos.length < 3 && posicao >= 0 && posicao <= this.filhos.length) {
            this.filhos.splice(posicao, 0, no);
            return true
        } return false;
    }
}