const tabela = document.getElementById('tabela');
const totalSpan = document.getElementById('total');
const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener("click", adicionarLinha)

function adicionarLinha() {
    const linha = document.createElement('tr');

    linha.innerHTML = `
        <td><input type="text" class="descricao"></td>
        <td>
            <select class="tipo">
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
            </select>
        </td>
        <td><input type="number" step="0.01" class="valor"></td>
        `;

        linha.querySelector(".valor").addEventListener("input", calcularTotal);
        linha.querySelector(".tipo").addEventListener("change", calcularTotal);
    tabela.appendChild(linha);

} 
function calcularTotal() {
    let total = 0;
    
    for (let linha of tabela.rows){
        const tipo = linha.cells[2].querySelector('select').value;
    
    let valorTexto = linha.cells[3].querySelector('input').value;
    valorTexto = valorTexto.replace(',', '.');
        const valor = Number(valorTexto) || 0;

        if (tipo === 'entrada') {
            total += valor;
        } else  {
            total -= valor;
        }
    }
   
    totalSpan.textContent = total.toFixed(2);
}

function salvarDados() {
    const dados = [];
    document.querySelectorAll('#tabela tbody tr').forEach(linha => {
        dados.push({
            descricao: linha.querySelector('input[type="text"]').value,
            tipo: linha.querySelector('select').value,
            valor: linha.querySelector('input[type="number"]').value 
        });
    });
    localStorage.setItem("anotacoesFinanceiras", JSON.stringify(dados));
}
function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("anotacoesFinanceiras")) || [];

    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><input type="text" value="${item.descricao}"></td>
            <td>
            <select>
                <option value="entrada" ${item.tipo === 'entrada' ? 'selected' : ''}>Entrada</option>
                <option value="saida" ${item.tipo === 'saida' ? 'selected' : ''}>Saída</option>
            </select>
            </td>
            <td><input type="number" step="0.01" value="${item.valor.toFixed(2)}"></td>
        `;
        tabela.appendChild(linha);
    });
calcularTotal();

} 
