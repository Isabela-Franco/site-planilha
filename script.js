 let planilhaAtual = null;
 // Define os botões e adiciona eventos
  const btnAdd = document.getElementById("btnAdd");
  const btnSalvar = document.getElementById("btnSalvar");



  if (btnAdd) btnAdd.addEventListener("click", adicionarLinha);
  if (btnSalvar) btnSalvar.addEventListener("click", salvarPlanilha);


// FUNÇÃO: Adicionar Linha
function adicionarLinha() {
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>
      <input type="text" name="descricao" placeholder="Descrição">
    </td>
    <td>
      <select name="tipo" onchange="calcularTotal()">
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
    </td>
    <td>
      <input type="number" name="valor" step="0.01" placeholder="0.00" oninput="calcularTotal()">
    </td>
  `;
  tabela.appendChild(tr);
}


// FUNÇÃO: Calcular Total
function calcularTotal() {
  const tabela = document.getElementById("tabela-hoje");
  const totalSpan = document.getElementById("total");
  if (!tabela || !totalSpan) return;

  let total = 0;
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach(tr => {
    const tipoInput = tr.querySelector('select[name="tipo"]');
    const valorInput = tr.querySelector('input[name="valor"]');
    if (!tipoInput || !valorInput) return;

    const tipo = tipoInput.value.trim().toLowerCase();
    const valor = parseFloat(valorInput.value) || 0;

    if (tipo === "entrada") total += valor;
    if (tipo === "saida") total -= valor;
  });

  totalSpan.innerText = total.toFixed(2);
}


// FUNÇÃO: Salvar Planilha
function salvarPlanilha() {
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  const linhas = tabela.querySelectorAll("tr");
  const dados = [];

  linhas.forEach(tr => {
    const descricao = tr.querySelector('input[name="descricao"]')?.value;
    const tipo = tr.querySelector('select[name="tipo"]')?.value.trim().toLowerCase();
    const valor = tr.querySelector('input[name="valor"]')?.value;
    if (descricao && tipo && valor) dados.push({ descricao, tipo, valor });
  });

  if (dados.length === 0) {
    alert("Nada para salvar");
    return;
  }

  const inputNome = document.getElementById("nome-planilha");
  const nome = inputNome.value.trim();
  if (!nome) {
    alert("Por favor, insira um nome para a planilha.");
    return;
  }
  const chave = "planilha-" + nome;
  localStorage.setItem(chave, JSON.stringify(dados));
  planilhaAtual = chave; // atualiza a planilha atual

  carregarDias();
  alert("Planilha salva!");
}


// FUNÇÃO: Carregar Dias na Aba Lateral
function carregarDias() {
  const listaDias = document.getElementById("lista-dias");
  if (!listaDias) return;
  listaDias.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave.startsWith("planilha-")) {
      const dia = chave.replace("planilha-", "");
      const li = document.createElement("li");
      li.innerText = dia;
      li.style.cursor = "pointer";
      li.onclick = () => carregarPlanilha(chave);
      listaDias.appendChild(li);
    }
  }
}


// FUNÇÃO: Carregar Planilha de um Dia
function carregarPlanilha(chave) {
  planilhaAtual = chave; // guarda a planilha atual
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  tabela.innerHTML = "";
  const dados = JSON.parse(localStorage.getItem(chave));

  dados.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <input type="text" name="descricao" value="${item.descricao}">
      </td>
      <td>
        <select name="tipo" onchange="calcularTotal()">
          <option value="entrada" ${item.tipo === "entrada" ? "selected" : ""}>Entrada</option>
          <option value="saida" ${item.tipo === "saida" ? "selected" : ""}>Saída</option>
        </select>
      </td>
      <td>
        <input type="number" name="valor" value="${item.valor}" step="0.01" oninput="calcularTotal()">
      </td>
    `;
    tabela.appendChild(tr);
  });

  calcularTotal();
}

// FUNÇÃO EXCLUIR PLANILHA
function excluirPlanilha() {
  if (!planilhaAtual) {
    alert("Nenhuma planilha carregada para excluir.");
    return;
  }
  const confirmar = confirm("Tem certeza que deseja excluir esta planilha?");
  if (!confirmar) return

  localStorage.removeItem(planilhaAtual);
  planilhaAtual = null;
  //LIMPA A TABELA
  const tabela = document.getElementById("tabela-hoje");
  tabela.innerHTML = "";
  document.getElementById("total").innerText = "0.00";
  carregarDias();
  alert("Planilha excluída com sucesso.");
}



// EVENTOS AO CARREGAR A PÁGINA

window.onload = () => {

  // Carrega dias no menu lateral
  carregarDias();
 
};