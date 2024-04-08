/*require([
  "./dbacess",
  "./numpad",
  "./pesquisa",
  "./tabela",
  "./pagina",
], function (dbacess, numpad, pesquisa, tabela, pagina) {
  console.log("modulos ok");

  //login
  dbacess.checkPassword();
  dbacess.checkPassword2();
  dbacess.updatePosition();

  //numpad
  numpad.preencherPopupComDetalhes();
  numpad.generateNumpad();
  numpad.generateNumpad2();
  numpad.carregarDados();
  numpad.handleEnterKey();
  numpad.generatePositionButtons();
  numpad.updateClock();

  //pesquisa
  pesquisa.mudaPesquisa();
  pesquisa.pesquisaEscolhaPost();
  pesquisa.pesquisarTabelaHour();
  pesquisa.pesquisarTabelaPost();
  pesquisa.pesquisaEscolhaPostObs();
  pesquisa.pesquisarTabelaObs();

  //tabela
  tabela.adicionarCameraOrPost();
  tabela.adicionarLinha();
  tabela.atualizarHoraAtual();
  tabela.atualizarTabela();
  tabela.updateLinha();
  tabela.deleteLinha();
  tabela.limparTabela();
  tabela.trocarParaTabela();
  tabela.moveDown();
  tabela.moveUp();
  tabela.obterCurvaNum();
  tabela.obterStartOrRF();

  //pagina

  pagina.inputRace();
  pagina.limparLS();
  pagina.abrirDetalhes();
  pagina.abrirPopup();
  pagina.abrirPopup2();
  pagina.abrirPopupNumpad();
  pagina.abrirPopupNumpadPassword();
  pagina.abrirPopupRodaDentada();
  pagina.abrirPopupConfiguracoes();
  pagina.abrirPopupFiltros();
  pagina.fecharPopup();
  pagina.fecharPopup2();
  pagina.fecharPopupNumpad();
  pagina.fecharPopupNumpadPassword();
  pagina.fecharPopupRodaDentada();
  pagina.fecharPopupConfiguracoes();
  pagina.fecharPopupFiltros();
  pagina.trocarParaNumpad();
  pagina.editarNumpad();
  pagina.editarNumpad2();
  pagina.carregarNumpad();
  pagina.carregarNumpad2();
  pagina.refreshPage();
  pagina.atualizarPagina();
  pagina.atualizarEstadoCheckbox();
  pagina.scrollToBottomWithDelay();
});*/
/*
require(["pagina"], function (pagina) {
  // Adicione um ouvinte de evento ao elemento com id "filtroImg"
  document.getElementById("filtroImg").addEventListener("click", function () {
    // Chame as funções desejadas quando o elemento for clicado
    console.log("carrega");
    pagina.abrirPopupFiltros();
    pagina.mudaPesquisa();
  });
});*/

let popupAberto = false;
let popup2Aberto = false;
let popupNumpadAbero = false;
let popupNumpadPasswordAberto = false;
let popupRodaDentada = false;
let popupConfiguracoes = false;
let popupFiltros = false;

//Verificar se o campo de pesquisa esta ativo
let campoPesquisa = false;

// Gerar Número de curvas no numpad

let generatedNumber = 0;
let numpadLinhas;

document.addEventListener("DOMContentLoaded", function () {
  // é necessário um pequeno delay para a local storage atualizar devidamente
  setTimeout(() => {
    const dadosExistentes = localStorage.getItem("dadosTabela");
    const data = JSON.parse(dadosExistentes);
    console.log(data);
    let indiceMaximo = 1;
    if (data != null) {
      data.forEach((item) => {
        indiceMaximo++;
      });
    }
    console.log(indiceMaximo);
    localStorage.setItem("indiceCorrente", indiceMaximo);
  }, 1000); // 1 second delay
});

document.addEventListener("DOMContentLoaded", function () {
  const reportCheckbox = document.getElementById("reportCheck2");
  const nfaCheckbox = document.getElementById("nfacheck2");

  reportCheckbox.addEventListener("click", function () {
    if (this.checked && nfaCheckbox.checked) {
      /*alert(
        "Erro: Não é possível selecionar 'Report' e 'NFA' simultaneamente."
      );*/
      nfaCheckbox.checked = false; // Desmarca o checkbox "NFA"
    }
  });

  nfaCheckbox.addEventListener("click", function () {
    if (this.checked && reportCheckbox.checked) {
      /*alert(
        "Erro: Não é possível selecionar 'NFA' e 'Report' simultaneamente."
      );*/
      reportCheckbox.checked = false; // Desmarca o checkbox "Report"
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const horaInput = document.getElementById("horainput2");

  // Adiciona um evento de alteração ao campo de entrada de hora
  horaInput.addEventListener("change", function () {
    let inputValue = this.value;

    // Substitui o ponto por 0
    inputValue = inputValue.replace(/\./g, "0");

    // Remove quaisquer caracteres não numéricos do valor de entrada
    inputValue = inputValue.replace(/\D/g, "");

    // Verifica se o valor de entrada tem exatamente 6 caracteres
    if (inputValue.length === 6) {
      // Extrai as partes da hora (horas, minutos e segundos) do valor de entrada
      const hours = inputValue.substring(0, 2);
      let minutes = inputValue.substring(2, 4);
      let seconds = inputValue.substring(4, 6);

      // Converte para números inteiros
      minutes = parseInt(minutes);
      seconds = parseInt(seconds);

      // Ajusta os minutos e segundos para manterem-se dentro do intervalo de 0 a 59
      minutes = Math.min(minutes, 59);
      seconds = Math.min(seconds, 59);

      // Formata os minutos e segundos para terem dois dígitos
      minutes = minutes.toString().padStart(2, "0");
      seconds = seconds.toString().padStart(2, "0");

      // Formata o valor de entrada para o formato xx:xx:xx
      inputValue = hours + ":" + minutes + ":" + seconds;
    } else if (inputValue.length === 5) {
      // Se o valor de entrada tem 5 caracteres, assumimos que está no formato "HHMM"
      const hours = inputValue.substring(0, 2);
      let minutes = inputValue.substring(2, 3);
      let seconds = inputValue.substring(3, 5);

      // Ajusta os minutos e segundos para terem dois dígitos
      minutes = minutes.padStart(2, "0");
      seconds = seconds.padStart(2, "0");

      // Formata o valor de entrada para o formato xx:xx:xx
      inputValue = hours + ":" + minutes + ":" + seconds;
    }

    // Define o valor formatado de volta ao campo de entrada
    this.value = inputValue;
  });
});

// Certifique-se de que a função carregarDados() é chamada após o carregamento da página
document.addEventListener("DOMContentLoaded", function () {
  carregarDados();
});

document.addEventListener("DOMContentLoaded", function () {
  const pesquisaField = document.getElementById("pesquisa");
  if (!pesquisaField) {
    console.log(pesquisaField);
    console.log("Campo não encontrado");
  } else {
    pesquisaField.addEventListener("focus", function () {
      console.log("focused on it");
      campoPesquisa = true;
    });
    pesquisaField.addEventListener("focusout", function () {
      console.log("unfocused on it");
      campoPesquisa = false;
    });
  }
});

//Atalhos para o numpad (no numpad físico) até 9
document.addEventListener("keydown", function (e) {
  //Vai buscar o numero currente de curvas definido
  numpadNumbers = localStorage.getItem("numCurves");
  botaoEditar = document.getElementById("botao-numpad-editar");
  console.log("eh");

  // Caso nenhum dos popus estejam abertos
  if (
    popupAberto == false &&
    popup2Aberto == false &&
    popupNumpadAbero == false &&
    popupNumpadPasswordAberto == false &&
    popupRodaDentada == false &&
    popupConfiguracoes == false &&
    campoPesquisa == false
  ) {
    for (let i = 1; i <= numpadNumbers; i++) {
      if (e.key === `${i}`) {
        abrirPopupNumpad();
        abrirPopup();
        obterHoraAtual();
        obterCurvaNum(i);
      }
    }
  }

  if (e.key === "Escape") {
    fecharPopup();
    fecharPopup2();
    fecharPopupNumpad();
    fecharPopupNumpadPassword();
  }
});

// Adicione um ouvinte de evento de teclado ao documento
document.addEventListener("keydown", handleEnterKey);

document.getElementById("pesquisaOptions").value = 1;
console.log(document.getElementById("pesquisaOptions").value);

document.addEventListener("DOMContentLoaded", function () {
  const pesquisaField = document.getElementById("pesquisa");
  if (!pesquisaField) {
    console.log(pesquisaField);
    console.log("Campo não encontrado");
  } else {
    pesquisaField.addEventListener("focus", function () {
      console.log("focused on it");
      campoPesquisa = true;
    });
    pesquisaField.addEventListener("focusout", function () {
      console.log("unfocused on it");
      campoPesquisa = false;
    });
  }
});

//Atalhos para o numpad (no numpad físico) até 9
document.addEventListener("keydown", function (e) {
  //Vai buscar o numero currente de curvas definido
  numpadNumbers = localStorage.getItem("numCurves");
  botaoEditar = document.getElementById("botao-numpad-editar");
  console.log("eh");

  // Caso nenhum dos popus estejam abertos
  if (
    popupAberto == false &&
    popup2Aberto == false &&
    popupNumpadAbero == false &&
    popupNumpadPasswordAberto == false &&
    popupRodaDentada == false &&
    popupConfiguracoes == false &&
    campoPesquisa == false
  ) {
    for (let i = 1; i <= numpadNumbers; i++) {
      if (e.key === `${i}`) {
        abrirPopupNumpad();
        abrirPopup();
        obterHoraAtual();
        obterCurvaNum(i);
      }
    }
  }

  if (e.key === "Escape") {
    fecharPopup();
    fecharPopup2();
    fecharPopupNumpad();
    fecharPopupNumpadPassword();
  }
});

// Adicione um ouvinte de evento de teclado ao documento
document.addEventListener("keydown", handleEnterKey);

document.getElementById("pesquisaOptions").value = 1;
console.log(document.getElementById("pesquisaOptions").value);

// Chamar a função para rolar até o final da página quando a página for carregada
window.addEventListener("load", function () {
  scrollToBottomWithDelay();
});

// Atualizar o relógio a cada segundo
//setInterval(updateClock, 1000);

// Chamar a função updateClock() para exibir a hora atual quando a página for carregada
window.addEventListener("load", updateClock);

// Chamar a função atualizarPagina a cada 5 segundos
//setInterval(atualizarPagina, 10000);
