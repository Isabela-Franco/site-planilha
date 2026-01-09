 let planilhaAtual = null;
 // Define os botões e adiciona eventos
  const btnAdd = document.getElementById("btnAdd");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnAddObs = document.getElementById("btnAddObs")



  if (btnAdd) btnAdd.addEventListener("click", adicionarLinha);
  if (btnSalvar) btnSalvar.addEventListener("click", salvarPlanilha);
  if(btnAddObs) btnAddObs.addEventListener("click", adicionarObservacao);


// FUNÇÃO: Adicionar Linha
function adicionarLinha() {
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" name="data" placeholder="DD/MM/AAAA"></td>
    <td><input type="text" name="descricao" placeholder="Descrição"></td>
    <td>
      <select name="tipo" onchange="calcularTotal()">
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
    </td>
    <td>
      <input type="number" name="valor" step="0.01" placeholder="0.00" oninput="calcularTotal()">
    </td>
    <td><input type="button" onclick="excluirLinha(this)">Excluir</td>
    
  `;
  tabela.appendChild(tr);

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir"
  btnExcluir.textContent = "btn-excluir"
  btnExcluir.onclick = () => {
    tr.remove();
    btnExcluir.remove();
    calcularTotal();

  };
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
  totalSpan.classList.remove("positivo", "negativo", "zero");
  if (total > 0) {
  totalSpan.classList.add("positivo");
  } else if (total < 0) {
    totalSpan.classList.add("negativo");
  }else {
    totalSpan.classList.add("zero");
  }
}


// FUNÇÃO: Salvar Planilha
function salvarPlanilha() {
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  const linhas = tabela.querySelectorAll("tr");
  const dados = [];

  linhas.forEach(tr => {
    const data = tr.querySelector('input[name="data"]')?.value;
    const descricao = tr.querySelector('input[name="descricao"]')?.value;
    const tipo = tr.querySelector('select[name="tipo"]')?.value.trim().toLowerCase();
    const valor = tr.querySelector('input[name="valor"]')?.value;
    if (data && descricao && tipo && valor) dados.push({data, descricao, tipo, valor });
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
  planilhaAtual = chave; // atualiza a planilha atua
  
  const anotacao = [];
  document.querySelectorAll("#lista-observacoes input").forEach(input =>{
    if (input.value.trim())
      anotacao.push(input.value.trim());
  });
  localStorage.setItem(chave, JSON.stringify({ dados, anotacao }));
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
  const nome = chave.replace("planilha-", "");
  document.getElementById("nome-planilha").value = nome;
  const tabela = document.getElementById("tabela-hoje");
  if (!tabela) return;

  tabela.innerHTML = "";
  const planilha = JSON.parse(localStorage.getItem(chave));
  const anotacao = planilha.anotacao || [];
  const dados = planilha.dados;
  const texarea = document.getElementById("anotacao");
  if (texarea) texarea.value = anotacao;
  const listaObs = document.getElementById("lista-observacoes");
  listaObs.innerHTML = "";

  dados.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" name="data" value="${item.data}"></td>
      <td><input type="text" name="descricao" value="${item.descricao}"></td>
      <td>
        <select name="tipo" onchange="calcularTotal()">
          <option value="entrada" ${item.tipo === "entrada" ? "selected" : ""}>Recebeu</option>
          <option value="saida" ${item.tipo === "saida" ? "selected" : ""}>Pagou</option>
        </select>
      </td>
      <td>
        <input type="number" name="valor" value="${item.valor}" step="0.01" oninput="calcularTotal()">
      </td>
      
    `;
  
 

  anotacao.forEach(texto => {
  const div = document.createElement("div");
  div.className = "obs-item";
  div.innerHTML = `
    <input type="text" value="${texto}"></input
    `;
  listaObs.appendChild(div);
});

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
  document.getElementById("lista-observacoes").innerHTML = "";

  carregarDias();
  alert("Planilha excluída com sucesso.");
}

//EXCLUIR LINHA
function excluirLinha(botao){
    const tr = botao.closest("tr")
    if (!tr) return;
    tr.remove();
    calcularTotal()

}

function adicionarObservacao() {
  const lista = document.getElementById("lista-observacoes");
  if (!lista) return;

  const div = document.createElement("div");
  div.className = "obs-item";

  div.innerHTML = `
    <input type="text" placeholder="Digite uma observação"></input
    
  `;

  lista.appendChild(div);
}



// EVENTOS AO CARREGAR A PÁGINA

window.onload = () => {

  // Carrega dias no menu lateral
  carregarDias();
 
};