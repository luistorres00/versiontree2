define(function () {
  function inputRace() {
    const rname = prompt("Qual é o nome da corrida?");
    if (rname != null) {
      document.getElementById("header").innerHTML = rname;
    }
  }

  //limpar LocalStorage
  function limparLS() {
    localStorage.clear();
    console.log("localStorage foi limpo.");
  }

  // Função para abrir o pop-up com os detalhes da linha correspondente
  function abrirDetalhes(id) {
    const data = JSON.parse(localStorage.getItem("dadosTabela")); // Obtemos os dados da localStorage
    const detalhes = data.find((item) => item._id === id); // Encontramos o item com o id correspondente
    if (detalhes) {
      // Se encontrarmos os detalhes, preenchemos o pop-up e o exibimos
      preencherPopupComDetalhes(detalhes);
      generatePositionButtons(detalhes);
      abrirPopup2();
    } else {
      console.error("Detalhes não encontrados para o ID:", id);
    }
  }

  //abre o popup
  function abrirPopup() {
    document.getElementById("popup").style.display = "block";
    popupAberto = true;
  }

  //abre o popup2
  function abrirPopup2() {
    document.getElementById("popup2").style.display = "block";
    popup2Aberto = true;
  }

  // Abre popup numpad
  function abrirPopupNumpad() {
    document.getElementById("popupNumpad").style.display = "block";
    popupNumpadAberto = true;
  }
  // Abrir popup password
  function abrirPopupNumpadPassword() {
    document.getElementById("numpad-password").style.display = "block";
    popupNumpadPasswordAberto = true;
  }
  // Abrir popup rodaDentada
  function abrirPopupRodaDentada() {
    document.getElementById("popupRodadentada").style.display = "block";
    popupRodaDentada = true;
  }

  // Abrir popup rodaDentada
  function abrirPopupConfiguracoes() {
    document.getElementById("popupConfiguracoes").style.display = "block";
    popupConfiguracoes = true;
  }

  // Abrir popup filtros
  function abrirPopupFiltros() {
    document.getElementById("popupFiltros").style.display = "block";
    popupFiltros = true;
  }

  //fecha o popup
  function fecharPopup() {
    document.getElementById("popup").style.display = "none";
    popupAberto = false;
    //location.reload();
  }

  //fecha o pupup2
  function fecharPopup2() {
    document.getElementById("popup2").style.display = "none";
    const popupEdit = document.getElementById("popupEdit");
    const botaoUp = document.getElementById("buttonUp");
    const botaoDown = document.getElementById("buttonDown");
    popupEdit.removeChild(botaoUp);
    popupEdit.removeChild(botaoDown);

    popup2Aberto = false;
    //location.reload();
  }
  // Fecha o popup Numpad
  function fecharPopupNumpad() {
    document.getElementById("popupNumpad").style.display = "none";

    popupNumpadAberto = false;
  }
  // Fechar popup password
  function fecharPopupNumpadPassword() {
    document.getElementById("numpad-password").style.display = "none";
    popupNumpadPasswordAberto = false;
  }

  // Fechar popup rodaDentada
  function fecharPopupRodaDentada() {
    document.getElementById("popupRodadentada").style.display = "none";
    popupRodaDentada = false;
  }

  // Fechar popup Configuracoes
  function fecharPopupConfiguracoes() {
    document.getElementById("popupConfiguracoes").style.display = "none";
    popupRodaDentada = false;
  }

  // Fechar popup Filtros
  function fecharPopupFiltros() {
    document.getElementById("popupFiltros").style.display = "none";
    popupFiltros = false;
  }

  function trocarParaNumpad() {
    const tabela = document.getElementById("tabela");
    const tabelaIcon = document.getElementById("iconTabela");
    const numpad = document.getElementById("numpad");
    const numpadIcon = document.getElementById("iconNumpad");
    const headerText = document.getElementById("currentOptionHeader");

    headerText.textContent = "Tabela:";
    tabela.classList.add("hidden");
    tabelaIcon.classList.remove("hidden");
    numpad.classList.remove("hidden");
    numpadIcon.classList.add("hidden");
  }

  function editarNumpad() {
    const numpadButton = document.getElementById("botao-numpad-editar");
    const numpadTextBox = document.getElementById("numberCurvas");
    const numpadGenerateButton = document.getElementById("botao-numpad");
    numpadButton.classList.toggle("hidden");
    numpadTextBox.classList.toggle("hidden");
    numpadGenerateButton.classList.toggle("hidden");
  }

  function editarNumpad2() {
    const numpadButton = document.getElementById("botao-numpad-editar");
    const numpadTextBox = document.getElementById("numberCurvas");
    const numpadGenerateButton = document.getElementById("botao-numpad");
    numpadButton.classList.toggle("hidden");
    numpadTextBox.classList.toggle("hidden");
    numpadGenerateButton.classList.toggle("hidden");
  }

  // Função para carregar o mesmo número introduzido no numpad(quando é feito reload)
  function carregarNumpad() {
    document.getElementById("numberCurvas").value =
      localStorage.getItem("numCurves");
    generateNumpad();
  }

  function carregarNumpad2() {
    console.log(localStorage.getItem("numCurves"));
    document.getElementById("numberCurvas").value =
      localStorage.getItem("numCurves");
    generateNumpad2();
  }

  // Adicionar tratamento de erros para requisições fetch
  function refreshPage() {
    carregarDados(); // Chama a função para carregar os dados ao carregar a página
  }

  function atualizarPagina() {
    if (!popupAberto && !popup2Aberto) {
      // Lógica para atualizar a página
      location.reload();
    }
  }

  // Adicionada a função para atualizar o estado do checkbox no localStorage
  function atualizarEstadoCheckbox(checkbox) {
    const estadoAtual = checkbox.dataset.estado;
    checkbox.dataset.estado = estadoAtual === "0" ? "1" : "0";
    localStorage.setItem(
      `checkbox_${checkbox.parentElement.parentElement.rowIndex}`,
      checkbox.dataset.estado
    );
  }

  // Função para rolar até o final da página (última linha da tabela) com um pequeno atraso
  function scrollToBottomWithDelay() {
    setTimeout(function () {
      var table = document.getElementById("tabela"); // ID da sua tabela
      if (table) {
        var lastRow = table.rows[table.rows.length - 1];
        if (lastRow) {
          lastRow.scrollIntoView();
        }
      }
    }, 100); // Ajuste o valor do atraso conforme necessário
  }

  return {
    inputRace,
    limparLS,
    abrirDetalhes,
    abrirPopup,
    abrirPopup2,
    abrirPopupNumpad,
    abrirPopupNumpadPassword,
    abrirPopupRodaDentada,
    abrirPopupConfiguracoes,
    abrirPopupFiltros,
    fecharPopup,
    fecharPopup2,
    fecharPopupNumpad,
    fecharPopupNumpadPassword,
    fecharPopupRodaDentada,
    fecharPopupConfiguracoes,
    fecharPopupFiltros,
    trocarParaNumpad,
    editarNumpad,
    editarNumpad2,
    carregarNumpad,
    carregarNumpad2,
    refreshPage,
    atualizarPagina,
    atualizarEstadoCheckbox,
    scrollToBottomWithDelay,
  };
});
