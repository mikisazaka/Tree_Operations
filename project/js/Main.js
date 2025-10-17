
const valorInserir = document.getElementById('valorInserir');
const localInsercao = document.getElementById('localInsercao');
const valorRemover = document.getElementById('valorRemover');
const btnInserir = document.getElementById('btnInserir');
const btnRemover = document.getElementById('btnRemover');

btnInserir.addEventListener('click', () => {
    const valor = valorInserir.value;
    const local = localInsercao.value;
    if (valor === '') {
        alert('Insira um valor para inserir!');
        return;
    }
    console.log(`Inserir valor: ${valor}, no local: ${local || 'raiz'}`);
});

btnRemover.addEventListener('click', () => {
    const valor = valorRemover.value;
    if (valor === '') {
        alert('Insira o valor a ser removido!');
        return;
    }
    console.log(`Remover valor: ${valor}`);
});