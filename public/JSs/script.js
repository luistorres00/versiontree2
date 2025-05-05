//--------------------------------------------DECLARAÇÕES VARIAVEIS---------------------------------------------------------

let popupAberto = false;
let popup2Aberto = false;
let popupNumpadAberto = false;
let popupNumpadPasswordAberto = false;
let popupRodaDentada = false;
let popupConfiguracoes = false;
let popupFiltros = false;
let popupAdicionaObs = false;

// Gravar os detalhes da curva (se é Post ou Turn)
let detalheCurva = "NaN";
let detalheCorrida = 0;
// Atualizar o relógio a cada segundo
setInterval(updateClock, 1000);

//Verificar se o campo de pesquisa esta ativo
let campoPesquisa = false;

//Declarado URL's
const url = "http://localhost:16082/";

//-------------------------------------------------------DOC LISTENERS--------------------------------------------------------

//VALIDAÇÃO DE TOKEN!!!!!!!
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se a variável responseData existe na localStorage
  const responseData = localStorage.getItem("responseData");
  const userData = JSON.parse(responseData);
  if (!responseData) {
    // Se a variável responseData não existir, redirecione o usuário para index.html
    window.location.href = "http://localhost:5500/index.html";
  }

  localStorage.setItem("usertype", userData.usertype);
  localStorage.setItem("userID", userData.userID);
  updateHeaderWithLastRaceText();

  var posicaoScroll = localStorage.getItem("posicaoScroll");
  if (posicaoScroll) {
    setTimeout(() => {
      window.scrollTo(0, posicaoScroll);
    }, 100);
  }
  console.log(posicaoScroll);
});

// função que é ativada antes da página ser desligada
window.onbeforeunload = function (e) {
  localStorage.setItem("posicaoScroll", window.scrollY); // Guarda a posição na página do eixo vertical (Y)
};

// Definir se o campo de pesquisa está selecionado ou não
document.addEventListener("DOMContentLoaded", function () {
  loadPesquisaChoice();
  const pesquisaField = document.getElementById("pesquisa");
  if (!pesquisaField) {
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

// Impedir o refresh quando ao campo de pesquisa se encontra selecionado
// Chamar a função atualizarPagina a cada 5 segundos
setInterval(atualizarPagina, 1000);

// Função para obter a última corrida
function getLastStartedRace() {
  let registos = JSON.parse(localStorage.getItem("dadosTabela")) || [];
  let ultimaCorrida = 0;

  registos.forEach((linha) => {
    if (linha.curva === "Start" || linha.curva === "R-Start") {
      let numeroCorrida = parseInt(linha.corrida, 10);
      if (!isNaN(numeroCorrida) && numeroCorrida > ultimaCorrida) {
        ultimaCorrida = numeroCorrida;
      }
    }
  });

  console.log(`🔍 Última corrida encontrada: ${ultimaCorrida}`);
  return ultimaCorrida;
}

// Buffer para armazenar números digitados
let cameraInputBuffer = "";
let horaFixada = "";
let valorCameraBackup = ""; // 🔹 Guarda o valor temporário do cameraInput

// Captura eventos de teclado
document.addEventListener("keydown", function (e) {
  const cameraInput = document.getElementById("cameraNumber");
  const horainput = document.getElementById("horainput");
  const obsInput = document.getElementById("obsInput");
  const curvaInput = document.getElementById("curvaInput");
  const maxCurvas = parseInt(localStorage.getItem("numCurvasBD"), 10) || 19;

  // 🔹 Se o usuário está editando um campo, ignorar entrada numérica no cameraInput
  if (
    document.activeElement === horainput ||
    document.activeElement === obsInput ||
    document.activeElement === curvaInput ||
    document.activeElement === inputCorrida
  ) {
    console.log(
      "📝 Usuário está digitando em um campo manualmente. Ignorando entrada."
    );
    return;
  }

  // 🔹 Se um popup diferente do `popupNumpad` estiver aberto, ignorar entrada
  if (
    popup2Aberto ||
    popupNumpadPasswordAberto ||
    popupRodaDentada ||
    popupConfiguracoes
  ) {
    console.log("Outro popup já está aberto. Ignorando entrada numérica.");
    return;
  }

  // 🔹 Se um número for pressionado
  if (e.key >= "0" && e.key <= "9") {
    if (cameraInputBuffer === "") {
      horaFixada = obterHoraAtual();
      console.log(`🕒 Hora fixada: ${horaFixada}`);
    }

    cameraInputBuffer += e.key;

    if (parseInt(cameraInputBuffer, 10) > maxCurvas) {
      cameraInputBuffer = String(maxCurvas);
    }

    // 🔹 Atualiza o campo da câmera
    if (cameraInput) {
      cameraInput.value = cameraInputBuffer;
    }

    // 🔹 Se o popup já está aberto, apenas atualiza o input SEM abrir novamente
    if (popupNumpadAberto) {
      atualizarCameraInput();
      return;
    }

    // 🔹 Se o popup ainda não está aberto, abre e preenche o input
    abrirPopupNumpad();
    abrirPopup();
    obterHoraAtual();
    atualizarCameraInput();
  }

  // 🔹 Lógica para o botão "Turn" (passa número da câmera para curva)
  if (e.key === "t" || e.key === "T") {
    if (cameraInput) {
      let numericValue = cameraInput.value.match(/\d+/g); // 🔥 Captura apenas números
      if (numericValue) {
        curvaInput.value = numericValue + " Turn"; // 🔥 Adiciona "Turn"
        valorCameraBackup = numericValue; // 🔄 Guarda o número
        cameraInput.value = ""; // 🔄 Limpa o campo da câmera
        console.log(`✅ Valor "${numericValue}" transferido para curvaInput.`);
      }
    }
  }

  // 🔹 Lógica para o botão "Camera" (passa número da curva para câmera)
  if (e.key === "c" || e.key === "C") {
    if (curvaInput) {
      let numericValue = curvaInput.value.match(/\d+/g); // 🔥 Captura apenas números
      if (numericValue) {
        cameraInput.value = numericValue + " Cam"; // 🔥 Adiciona "Cam"
        curvaInput.value = ""; // 🔄 Limpa o campo de curva
        console.log(`📷 Valor "${numericValue}" transferido para cameraInput.`);
      }
    }
  }

  // 📌 Gerenciar eventos de corrida
  if (
    !popupAberto &&
    !popup2Aberto &&
    !popupNumpadAberto &&
    !popupNumpadPasswordAberto &&
    !popupRodaDentada &&
    !popupConfiguracoes
  ) {
    let redFlagCorrida = localStorage.getItem("redFlagCorrida");
    let ultimaCorridaStart = getLastStartedRace();
    if (document.readyState === "complete") {
      setTimeout(() => {
        if (e.key === "p" || e.key === "P") {
          iniciarOuReiniciarCorrida(redFlagCorrida, ultimaCorridaStart);
        } else if (e.key === "r" || e.key === "R") {
          localStorage.setItem("redFlagCorrida", ultimaCorridaStart);
          document.getElementById("curvaInput").value = "Red Flag";
          obterHoraAtual();
          adicionarLinha();
        } else if (e.key === "s" || e.key === "S") {
          document.getElementById("curvaInput").value = "Slow Flag";
          obterHoraAtual();
          adicionarLinha();
        }
      }, 300);
    }
  }

  // 🔹 Fechar popups ao pressionar ESC
  if (e.key === "Escape") {
    fecharPopupIndividual();
  }
});

// 🔹 Função para atualizar o campo da câmera no popup
function atualizarCameraInput() {
  setTimeout(() => {
    let cameraInputInside = document.getElementById("cameraNumber");
    if (cameraInputInside) {
      cameraInputInside.value = cameraInputBuffer;
    }
  }, 100);
}

// 🔹 Função para obter a hora atual
function obterHoraAtual() {
  let agora = new Date();
  return agora.toLocaleTimeString();
}

// 🔹 Função para fechar apenas o popup que estiver aberto
function fecharPopupIndividual() {
  console.log("ESC pressionado. Verificando popups para fechar...");

  if (popupNumpadAberto) {
    fecharPopupNumpad();
    popupNumpadAberto = false;
    limparBuffer();
    console.log("Popup numpad fechado.");
    return;
  }

  if (popupNumpadPasswordAberto) {
    fecharPopupNumpadPassword();
    popupNumpadPasswordAberto = false;
    console.log("Popup numpad password fechado.");
    return;
  }

  if (popup2Aberto) {
    fecharPopup2();
    popup2Aberto = false;
    console.log("Popup 2 fechado.");
    return;
  }

  if (popupAberto) {
    fecharPopup();
    popupAberto = false;
    limparBuffer();
    console.log("Popup principal fechado.");
    return;
  }

  console.log("Nenhum popup estava aberto.");
}

// 🔹 Função para limpar o buffer quando o popup é fechado sem inserir dados
function limparBuffer() {
  console.log("Limpando buffer...");
  cameraInputBuffer = "";
  const cameraInput = document.getElementById("cameraNumber");
  if (cameraInput) {
    cameraInput.value = "";
  }
}

// 📌 Segunda parte do código que gerencia corridas e eventos
document.addEventListener("keydown", function (e) {
  if (
    !popupAberto &&
    !popup2Aberto &&
    !popupNumpadAberto &&
    !popupNumpadPasswordAberto &&
    !popupRodaDentada &&
    !popupConfiguracoes &&
    !campoPesquisa
  ) {
    let redFlagCorrida = localStorage.getItem("redFlagCorrida");
    let ultimaCorridaStart = getLastStartedRace(); // 🔍 Busca a última corrida iniciada
    let corrida;

    if (document.readyState === "complete") {
      setTimeout(() => {
        if (e.key === "p" || e.key === "P") {
          let curvaInputValue = "Start"; // Padrão para nova corrida
          let obsValue = "";

          if (redFlagCorrida !== null && redFlagCorrida !== "null") {
            // 🔹 Verifica se existe Red Flag corretamente
            console.log("🚩 Red Flag detectada! Perguntando ao usuário...");

            let isNewRace = confirm(
              "Red Flag Detected! New race or Restart?\nOK for new race, Cancel for restart."
            );

            if (!isNewRace) {
              // 🔄 É um Restart, mantém a MESMA corrida
              corrida = parseInt(redFlagCorrida, 10);
              curvaInputValue = "R-Start"; // Indica reinício na curva
              obsValue = `Restart Race Nº:${corrida}`;

              // 🔄 Atualiza o obsInput no DOM
              let obsElement = document.getElementById("obsInput");
              if (obsElement) {
                obsElement.value = obsValue;
                console.log(`obsInput atualizado para: ${obsValue}`);
              } else {
                console.error("Elemento obsInput não encontrado no DOM.");
              }
            } else {
              // ➕ Se for uma nova corrida, pega o último Start e soma 1
              corrida = ultimaCorridaStart + 1;
              localStorage.setItem("numCorridas", corrida);
            }

            // 🔄 Agora pode remover a Red Flag, pois o valor foi utilizado
            localStorage.removeItem("redFlagCorrida");
          } else {
            // ➕ Se não há Red Flag, inicia a próxima corrida normal
            corrida = ultimaCorridaStart + 1;
            localStorage.setItem("numCorridas", corrida);
          }

          // 🔄 Atualizar o inputCorrida no DOM
          document.getElementById("inputCorrida").value = corrida;

          // 🔥 Adicionar linha à tabela
          document.getElementById("curvaInput").value = curvaInputValue;

          // 🔄 Se houver uma observação de Restart, ela será usada
          let obsInput = document.getElementById("obsInput");
          if (obsInput) obsInput.value = obsValue;

          obterHoraAtual();
          adicionarLinha();

          console.log(
            `Corrida: ${corrida}, Curva: ${curvaInputValue}, Último Start: ${ultimaCorridaStart}`
          );
        }

        // 🔴 Lidar com tecla "R" para Red Flag
        /*else if (e.key === "r" || e.key === "R") {
          console.log(`⚠️ Red Flag ativada! Salvando corrida ${ultimaCorridaStart}`);
          localStorage.setItem("redFlagCorrida", ultimaCorridaStart);
          document.getElementById("curvaInput").value = "Red Flag";
          obterHoraAtual();
          adicionarLinha();
          console.log(`Red Flag salva na corrida: ${ultimaCorridaStart}`);
        }*/
      }, 300);
    }
  }
});

//
document.addEventListener("DOMContentLoaded", function () {
  // é necessário um pequeno delay para a local storage atualizar devidamente
  setTimeout(() => {
    const dadosExistentes = localStorage.getItem("dadosTabela");
    const data = JSON.parse(dadosExistentes);
    //filtrarPorStart();
    let registo = 1;
    if (data != null) {
      data.forEach((item) => {
        registo++;
      });
    }
    localStorage.setItem("Numero de Registos", registo);
  }, 1000); // 1 second delay
});

//Verifica a nao validação de NFA e Report
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
  const reportCheckbox = document.getElementById("reportCheck");
  const nfaCheckbox = document.getElementById("nfacheck");

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
//
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
  carregarDadosNumpad();
  carregarObsOptions();
  setTimeout(() => {
    const numpadNum = JSON.parse(localStorage.getItem("numpadData"));
    numpadNum.forEach((item) => {
      if (item.corrida > 0) {
        document.getElementById("numberCorrida").value = Number(
          item.numberCorrida
        );
      } else {
        document.getElementById("numberCorrida").value = 1;
      }

      document.getElementById("numberCurvas").value = Number(
        item.numberButtons
      );
      document.getElementById("inputCorrida").value = Number(
        item.numberCorrida
      );
      localStorage.setItem("numCorridas", item.numberCorrida);
      localStorage.setItem("numCurvasBD", item.numberButtons);
      generateNumpad();
    });
    pesquisarCorrida(localStorage.getItem("corridaChoice"));
  }, 180);
});

//
document.addEventListener("DOMContentLoaded", function () {
  const pesquisaOptions = document.getElementById("pesquisaOptions");

  if (pesquisaOptions !== null) {
    pesquisaOptions.value = 1;
  } else {
    console.error("Elemento com ID 'pesquisaOptions' não encontrado.");
  }
});

// Chamar a função updateClock() para exibir a hora atual quando a página for carregada
window.addEventListener("load", updateClock);

// Chamar a função para rolar até o final da página quando a página for carregada
window.addEventListener("load", function () {
  scrollToBottomWithDelay();
});

//Muda o nome da corrida para a ultima da tabela
document.addEventListener("DOMContentLoaded", function () {
  updateHeaderWithLastRaceText();
});

// Verifica se a PWA já foi instalada
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  // Previne o comportamento padrão do browser
  e.preventDefault();
  // Armazena o evento para ser usado mais tarde
  deferredPrompt = e;
  // Exibe um botão ou elemento na interface do usuário para solicitar a instalação
  showInstallPrompt();
});

//fazer logout
document.addEventListener("DOMContentLoaded", function () {
  try {
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", function () {
      // Fazer solicitação para logout
      console.log("1");
      fetch("http://localhost:16082/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Inclua o token de autenticação no cabeçalho Authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Se o logout for bem-sucedido, limpe o token armazenado no localStorage
            localStorage.removeItem("responseData");
            // Redirecionar de volta para a página index.html
            window.location.href = "index.html";
          } else {
            // Se o logout falhar, exiba uma mensagem de erro
            console.error("Failed to logout");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  } catch (error) {
    console.error("Botao nao disponivel.");
  }
});

// test 15 second interval method

//--------------------------------------------------------FUNÇÕES-------------------------------------------------------------

//----------------------PAGINA----------------------
// Define a função para carregar os dados quando a página é carregada

function carregarDados() {
  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/getData";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Atualiza a tabela com os dados recebidos
      atualizarTabela(data);
      // Armazena os dados localmente para uso posterior
      localStorage.setItem("dadosTabela", JSON.stringify(data));
    })
    .catch((error) => console.error("Erro ao obter dados:", error));
}

//Muda o nome da corrida e adiciona na BD
function inputRace() {
  // Verificar se o usuário é admin
  const userType = localStorage.getItem("usertype");
  console.log(userType);

  if (userType !== "admin") {
    alert("Você não tem permissão para alterar o nome da corrida.");
    return; // Impede que o restante do código seja executado
  }

  const rname = prompt("Qual é o nome da corrida?");
  if (rname != null) {
    document.getElementById("header").innerHTML = rname;
    // Enviar o nome da corrida para o backend
    fetch("http://localhost:16082/addRace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ race: rname }), // Alterado de 'name' para 'race'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar corrida");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Corrida adicionada com sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao adicionar corrida:", error);
      });
  }
}

//Muda o nome da corrida para a ultima da tabela
function updateHeaderWithLastRaceText() {
  fetch("http://localhost:16082/getLRace")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter o texto da última corrida");
      }
      return response.json();
    })
    .then((data) => {
      const headerElement = document.getElementById("header");
      const headerClienteElement = document.getElementById("headerCliente");
      if (headerElement) {
        headerElement.innerHTML = data.lastRaceText;
      } else if (headerClienteElement) {
        headerClienteElement.innerHTML = data.lastRaceText;
      }
    })
    .catch((error) => {
      console.error("Erro ao obter o texto da última corrida:", error);
    });
}

//Alerta de WIP
function showWorkInProgress() {
  alert("Esta funcionalidade está em desenvolvimento!");
}

//limpar LocalStorage
function limparLS() {
  localStorage.clear();
  console.log("localStorage foi limpo.");
}

//abre o popup
function abrirPopup() {
  // Obter o número da última corrida iniciada
  const ultimaCorridaStart = getLastStartedRace();

  // Definir o valor no inputCorrida
  document.getElementById("inputCorrida").value = ultimaCorridaStart;

  // Abrir o popup normalmente
  document.getElementById("popup").style.display = "flex";
  popupAberto = true;
}

//abre o popup2
function abrirPopup2() {
  document.getElementById("popup2").style.display = "flex";
  popup2Aberto = true;

  // Adiciona novo listener
  document.addEventListener("keydown", handleEscape);

  function handleEscape(event) {
    if (event.key === "Escape") {
      fecharPopup2();
      // Remove o listener após fechar
      document.removeEventListener("keydown", handleEscape);
    }
  }
}
// Abre popup numpad
function abrirPopupNumpad() {
  const popupNumpad = document.getElementById("popupNumpad");
  if (popupNumpad) {
    popupNumpad.style.display = "flex";
  }
  popupNumpadAberto = true;
}

// Abrir popup password
function abrirPopupNumpadPassword() {
  const popupNumpadPassword = document.getElementById("numpad-password");
  if (popupNumpadPassword) {
    popupNumpadPassword.style.display = "flex";
  }
  popupNumpadPasswordAberto = true;
}

// Fechar popup rodaDentada
function abrirPopupRodaDentada() {
  const rodaDentada = document.getElementById("popupRodadentada");
  document.getElementById("popupRodadentada").style.display = "block";
  const userType = localStorage.getItem("usertype");
  console.log(userType);
  if (userType != "admin") {
    document.getElementById("numberCurvas").classList.add("hidden");
    document.getElementById("numberCorrida").classList.add("hidden");
    document.getElementById("butaoSettings").classList.add("hidden");
    document.getElementById("botaoLimparTabela").classList.add("hidden");
    document.getElementById("butaoGerarNumpad").classList.add("hidden");
    document.getElementById("labelConfig").classList.add("hidden");
  }
  popupRodaDentada = true;
}

// Fechar popup rodaDentada
function abrirPopupConfiguracoes() {
  document.getElementById("popupConfiguracoes").style.display = "block";
  popupConfiguracoes = true;
}

// abrir popup para Observações adicionais
function abrirPopupAdicionaObservacoes() {
  document.getElementById("popupAdicionaObservações").style.display = "block";
  popupAdicionaObs = true;
}

// Fechar popup filtros
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
  resetPositionButtons();

  popup2Aberto = false;
  //location.reload();
}

// Fecha o popup Numpad
function fecharPopupNumpad() {
  const popupNumpad = document.getElementById("popupNumpad");
  if (popupNumpad) {
    popupNumpad.style.display = "none";
  }
  popupNumpadAberto = false;
}

// Fechar popup password
function fecharPopupNumpadPassword() {
  const popupNumpadPassword = document.getElementById("numpad-password");
  if (popupNumpadPassword) {
    popupNumpadPassword.style.display = "none";
  }
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
  popupConfiguracoes = false;
}

// Fecha o popup para acrescentar Observações
function fecharPopupAdicionaObservacoes() {
  document.getElementById("popupAdicionaObservações").style.display = "none";

  popupAdicionaObs = false;
}

// Fechar popup Filtros
function fecharPopupFiltros() {
  document.getElementById("popupFiltros").style.display = "none";
  popupFiltros = false;
}

// Dar reset aos botoes de posição
function resetPositionButtons() {
  const popupEdit = document.getElementById("popupEdit");
  const botaoUp = document.getElementById("buttonUp");
  const botaoDown = document.getElementById("buttonDown");
  popupEdit.removeChild(botaoUp);
  popupEdit.removeChild(botaoDown);
}

// Adicionar tratamento de erros para requisições fetch
function refreshPage() {
  carregarDados(); // Chama a função para carregar os dados ao carregar a página
}

//função para atualizar a pagina
function getData() {
  // Verifica se os popups estão abertos
  if (
    popupAberto ||
    popup2Aberto ||
    campoPesquisa ||
    popupConfiguracoes ||
    popupFiltros
  ) {
    return Promise.resolve(null); // Retorna uma promessa resolvida com null se algum popup estiver aberto
  }

  const url = "http://localhost:16082/getData";

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao obter dados:", error);
      return null;
    });
}

function atualizarPagina() {
  getData().then((data) => {
    if (data) {
      const dadosAntigos = localStorage.getItem("dadosTabela");
      const dadosNovos = JSON.stringify(data);

      // Verifica se há novos dados comparando com os dados armazenados localmente
      if (dadosNovos !== dadosAntigos) {
        // Atualiza os dados na Local Storage
        localStorage.setItem("dadosTabela", dadosNovos);
        // Recarrega a página
        location.reload();
      }
    }
  });
}

// Função para rolar até o final da página (última linha da tabela) com um pequeno atraso
/* function scrollToBottomWithDelay() {
  setTimeout(function () {
    var table = document.getElementById("tabela"); // ID da sua tabela
    if (table) {
      var lastRow = table.rows[table.rows.length - 1];
      if (lastRow) {
        lastRow.scrollIntoView();
      }
    }
  }, 100); // Ajuste o valor do atraso conforme necessário
} */

//atualiza o relogio
function updateClock() {
  var now = new Date();
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");
  var seconds = now.getSeconds().toString().padStart(2, "0");
  var timeString = hours + ":" + minutes + ":" + seconds;

  var clockElement = document.getElementById("clock");
  if (clockElement) {
    clockElement.textContent = timeString;
  }

  // Obter a data atual e formatá-la
  var options = { day: "numeric", month: "short", year: "numeric" };
  var dateString = now.toLocaleDateString("en-UK", options);

  // Exibir a data abaixo do relógio
  var dateElement = document.getElementById("date");
  if (dateElement) {
    dateElement.textContent = dateString;
  }
}

// Na página de cliente, troca a exibição da Tabela para o Numpad
function trocarParaNumpad() {
  const tableContainer = document.querySelector(".table-container");
  const tabelaIcon = document.getElementById("iconTabela");
  const numpad = document.getElementById("numpad");
  const numpadIcon = document.getElementById("iconNumpad");
  const headerText = document.getElementById("currentOptionHeader");

  headerText.textContent = "List:";
  tableContainer.style.display = "none";
  tabelaIcon.classList.remove("hidden");
  numpad.style.display = "block";
  numpadIcon.classList.add("hidden");
}

// Na página de cliente, troca a exibição do Numpad para a Tabela
function trocarParaTabela() {
  const tableContainer = document.querySelector(".table-container");
  const tabelaIcon = document.getElementById("iconTabela");
  const numpad = document.getElementById("numpad");
  const numpadIcon = document.getElementById("iconNumpad");
  const headerText = document.getElementById("currentOptionHeader");

  headerText.textContent = "Numpad:";
  tableContainer.style.display = "block";
  tabelaIcon.classList.add("hidden");
  numpad.style.display = "none";
  numpadIcon.classList.remove("hidden");
}

//install prompt do PWA
function showInstallPrompt() {
  // Exibe um botão ou elemento na interface do usuário para solicitar a instalação
  const installButton = document.getElementById("logo");
  installButton.addEventListener("click", () => {
    // Exibe o prompt de instalação
    deferredPrompt.prompt();
    // Aguarda o usuário interagir com o prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou a instalação da PWA");
      } else {
        console.log("Usuário recusou a instalação da PWA");
      }
      // Limpa o objeto deferredPrompt para que o prompt não seja mostrado novamente
      deferredPrompt = null;
    });
  });
}

//----------------------TABELA----------------------

// Adicionadar função para adicionar nova linha à tabela
function adicionarLinha() {
  const registos = JSON.parse(localStorage.getItem("dadosTabela")) || [];
  const arrayCorridas =
    JSON.parse(localStorage.getItem("opcoesCorridas")) || [];
  const arrayRFlag = JSON.parse(localStorage.getItem("dadosTabela")) || [];
  const numpadDBData = JSON.parse(localStorage.getItem("numpadData")) || [];
  let corrida = document.getElementById("inputCorrida")?.value || 0;
  const userType = localStorage.getItem("usertype");

  if (userType === "user") {
    if (!corrida) {
      numpadDBData.forEach((item) => {
        corrida = item.numberCorrida;
      });
    }
  } else {
    if (!corrida) {
      numpadDBData.forEach((item) => {
        corrida = item.numberCorrida;
      });
    } else {
      if (corrida > 0) {
        updateNumpad(corrida);
      } else {
        updateNumpad(1);
      }
    }
  }
  if (corrida <= 0) {
    corrida = 1;
  }

  const tabela = document.querySelector("tbody");
  const novaLinha = document.createElement("tr");

  const camera = document.getElementById("cameraNumber")?.value || "";
  const curvaInput = document.getElementById("curvaInput");
  let curva = curvaInput ? curvaInput.value : "";
  const hora = document.getElementById("horainput")?.value || "";
  const video = document.getElementById("videoCheck")?.checked || false;
  const nfa = document.getElementById("nfaCheck")?.checked || false;
  const report = document.getElementById("reportCheck")?.checked || false;
  const priority = document.getElementById("priorityCheck")?.checked || false;
  const obsInput = document.getElementById("obsInput");
  let obs = obsInput ? obsInput.value : "";
  const obsDropDown = document.getElementById("obsInputSelect")?.value || "";
  const userID = localStorage.getItem("userID");

  if (obs !== "" && obsDropDown !== "") {
    obs = obs + " - " + obsDropDown;
  } else if (obs === "" && obsDropDown !== "") {
    obs = obsDropDown;
  }

  // Adicionar a corrida às observações se for Start
  if (curva === "Start" && !obs.includes("Race nº:")) {
    obs =
      `Race Nº:${corrida}\n` +
      (obsInput?.value || "") +
      (document.getElementById("obsInputSelect2")?.value || "");
  }

  // Lógica para Restart Race
  if (arrayRFlag.length > 0) {
    const ultimaLinha = arrayRFlag[arrayRFlag.length - 1];
    if (
      ultimaLinha.curva === "Red Flag" &&
      arrayCorridas.includes(Number(corrida))
    ) {
      window.alert("Race Restarted");
      console.log("Race Restart Detected");

      // Atualizar o campo obsInput com Restart Race
      if (obsInput) {
        obsInput.value = `Restart Race Nº:${corrida}`;
        console.log(`Updated obsInput with: Restart Race Nº:${corrida}`);
        obs = obsInput.value; // Atualizar o valor de `obs`
      } else {
        console.error(
          "Elemento obsInput não encontrado no DOM para atualização."
        );
      }
    }
  }
  const newData = {
    corrida: corrida,
    camera: camera,
    curva: curva,
    hora: hora,
    video: video,
    report: report,
    nfa: nfa,
    priority: priority,
    obs: obs,
    userID: userID,
  };

  registos.push(newData);
  localStorage.setItem("dadosTabela", JSON.stringify(registos));
  localStorage.setItem("novaLinhaData", JSON.stringify(newData));
  enviarJson();
  location.reload();
}

// Adicionar tabela cliente (para impedir que clientes possam alterar o numero da corrida na tabela)

//envio dados para servidor
function enviarJson() {
  // Recuperar os dados do localStorage
  const localStorageData = localStorage.getItem("novaLinhaData");
  console.log(localStorageData);

  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/addData";

  // Verificar se existem dados no localStorage
  if (localStorageData) {
    const parsedData = JSON.parse(localStorageData);
    // Enviar os dados para o servidor
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) =>
        console.error("Erro ao enviar dados para o servidor:", error)
      );
  } else {
    console.log("Nenhum dado encontrado no localStorage.");
  }
}

//Funçao para dar update á linha selecionada da tabela
function updateLinha() {
  // Captura os valores atualizados dos campos do pop-up
  let corrida = document.getElementById("inputCorrida2").value;
  const camera = document.getElementById("cameraNumber2").value;
  let curva = document.getElementById("curvaInput2").value;
  const hora = document.getElementById("horainput2").value;
  const video = document.getElementById("videoCheck2").checked;
  const report = document.getElementById("reportCheck2").checked;
  const priority = document.getElementById("priorityCheck2").checked;
  const nfa = document.getElementById("nfacheck2").checked;
  let obs = document.getElementById("obsInput2").value;
  let obsDropDown = document.getElementById("obsInputSelect2").value;

  // Caso tenham sido Post ou Turn anteriormente
  if (!curva.includes("P") && !curva.includes("Turn")) {
    if (detalheCurva == "P" || detalheCurva == "Turn") {
      curva += detalheCurva;
    }
  }
  // Corrida nunca pode ser 0
  if (corrida == 0) {
    corrida = 1;
  }
  if (curva == "Start") {
    if (obs.includes(`Race Nº:${detalheCorrida}`)) {
      obs = obs.replace(`Race Nº:${detalheCorrida}`, `Race Nº:${corrida}`);
    }
  } else {
    if (obs != "" && obsDropDown != "") {
      obs = obs + " - " + obsDropDown;
    } else if (obs == "" && obsDropDown != "") {
      obs = obsDropDown;
    }
  }

  // Cria um objeto com os dados atualizados
  const updatedData = {
    corrida: corrida,
    camera: camera,
    curva: curva,
    hora: hora,
    video: video,
    report: report,
    nfa: nfa,
    priority: priority,
    obs: obs,
  };

  // Recupera o ID dos detalhes armazenados no localStorage
  const detalhes = JSON.parse(localStorage.getItem("detalhesPopup"));
  if (detalhes && detalhes._id) {
    // Adiciona o ID aos dados atualizados
    updatedData._id = detalhes._id;
  } else {
    console.error(
      "Erro: ID não encontrado nos detalhes armazenados no localStorage."
    );
    return; // Encerra a função se o ID não estiver disponível
  }

  // Armazena os dados atualizados no localStorage
  localStorage.setItem("novaLinhaData", JSON.stringify(updatedData));

  // Oculta o formulário de edição
  document.getElementById("popup").style.display = "none";

  envUpJson();
}

//Envio dos dados actualizados para a BD
function envUpJson() {
  // Obtém os dados atualizados do localStorage
  const updatedDataString = localStorage.getItem("novaLinhaData");
  // Verifica se há dados no localStorage
  if (updatedDataString) {
    const updatedData = JSON.parse(updatedDataString);

    // Define o ID do documento a ser atualizado (obtido do localStorage)
    const id = updatedData._id;
    // Definir o IP/URL para onde enviar os dados
    const url = `http://localhost:16082/updateData/${id}`;
    // Envia os dados atualizados para o servidor
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados atualizados com sucesso:", data);

        // Limpa os dados do localStorage após a atualização
        localStorage.removeItem("novaLinhaData");
        location.reload();
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar dados atualizados para o servidor:",
          error
        );
      });
  } else {
    console.error("Nenhum dado encontrado no localStorage para enviar.");
  }
}

//Apaga a linha
function deleteLinha() {
  // Recupera o ID dos detalhes armazenados no localStorage
  const detalhes = JSON.parse(localStorage.getItem("detalhesPopup"));
  // Verifica se o ID está disponível nos detalhes
  if (detalhes && detalhes._id) {
    // Faz uma solicitação DELETE para excluir a linha com o ID especificado
    fetch(`http://localhost:16082/dropData/${detalhes._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Linha excluída com sucesso.");
          // Se a linha foi excluída com sucesso, você pode tomar alguma ação adicional aqui, como recarregar a página ou atualizar a tabela
        } else {
          console.error("Erro ao excluir linha:", response.status);
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir linha:", error);
      });
  } else {
    console.error(
      "Erro: ID não encontrado nos detalhes armazenados no localStorage."
    );
  }
}

//Dar fetch do usuário
function fetchUser(userID) {
  if (!userID) {
    console.error(
      "Erro: ID não encontrado nos detalhes armazenados no localStorage."
    );
    return Promise.reject("User ID not provided");
  }

  return fetch(`http://localhost:16082/auth/fetchUser/${userID}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro ao procurar usuário: " + response.status);
      }
    })
    .then((data) => {
      console.log("Usuário encontrado!", data);
      return data.username;
    });
}

// Atualiza a tabela com os dados recebidos
function atualizarTabela(data) {
  const tabela = document.getElementById("tabela");

  // Limpa apenas as linhas de dados da tabela, mantendo o cabeçalho
  while (tabela.rows.length > 1) {
    tabela.deleteRow(1);
  }

  // Adiciona linhas à tabela com os dados recebidos
  data.forEach((item) => {
    const novaLinha = document.createElement("tr");

    // Aplica as classes de cor com base no valor de "curva"
    if (item.curva === "Start") {
      novaLinha.classList.add("post-start");
    } else if (item.curva === "R-Start") {
      novaLinha.classList.add("post-rstart");
    } else if (item.curva === "Slow Flag") {
      novaLinha.classList.add("post-slow");
    } else if (item.curva === "Red Flag") {
      novaLinha.classList.add("post-redflag");
    }

    // Aplica a cor da linha com base na presença de Report ou NFA
    if (item.report === true) {
      novaLinha.classList.add("report-true"); // Classe CSS para Report verdadeiro
    }
    if (item.nfa === true) {
      novaLinha.classList.add("nfa-true"); // Classe CSS para NFA verdadeiro
    }
    if (item.priority) {
      novaLinha.classList.add("priority-set");
    }

    // Criação das células
    const IdCell = document.createElement("td");
    IdCell.classList.add("hidden");
    IdCell.textContent = `${item._id}`;

    const CameraCell = document.createElement("td");
    CameraCell.textContent = `${item.camera} (Loading...)`;

    const CurvaCell = document.createElement("td");
    CurvaCell.textContent = `${item.curva}`;

    const HoraCell = document.createElement("td");
    HoraCell.textContent = `${item.hora}`;

    // Video Checkbox
    const VideoCell = document.createElement("td");
    const VideosCheck = document.createElement("input");
    VideosCheck.type = "checkbox";
    VideosCheck.checked = item.video === true;
    VideosCheck.disabled = true;
    VideoCell.appendChild(VideosCheck);

    // Report Checkbox
    const ReportCell = document.createElement("td");
    const ReportCheck = document.createElement("input");
    ReportCheck.type = "checkbox";
    ReportCheck.checked = item.report === true;
    ReportCheck.disabled = true;
    ReportCell.appendChild(ReportCheck);

    // NFA Checkbox
    const NFACell = document.createElement("td");
    const NFACheck = document.createElement("input");
    NFACheck.type = "checkbox";
    NFACheck.checked = item.nfa === true;
    NFACheck.disabled = true;
    NFACell.appendChild(NFACheck);

    // Obs
    const ObsCell = document.createElement("td");
    ObsCell.textContent = `${item.obs}`;

    // Editar
    const EditarCell = document.createElement("td");
    const ImageEditCell = document.createElement("img");
    ImageEditCell.src = "images/pen.png";
    ImageEditCell.alt = "Editar";
    ImageEditCell.onclick = function () {
      abrirDetalhes(`${item._id}`);
    };
    EditarCell.appendChild(ImageEditCell);

    // Botões Up/Down (escondidos)
    const ButtonsCell = document.createElement("td");
    ButtonsCell.id = "positionButton";
    ButtonsCell.classList.add("hidden"); // Esconde o botão
    const ButtonUp = document.createElement("button");
    ButtonUp.classList.add("buttaoUpDown", "hidden"); // Esconde o botão
    ButtonUp.textContent = "↑";
    ButtonUp.onclick = function () {
      moveUp(this);
    };
    const ButtonDown = document.createElement("button");
    ButtonDown.classList.add("buttaoUpDown", "hidden"); // Esconde o botão
    ButtonDown.textContent = "↓";
    ButtonDown.onclick = function () {
      moveDown(this);
    };
    ButtonsCell.appendChild(ButtonUp);
    ButtonsCell.appendChild(ButtonDown);

    const CorridaCell = document.createElement("td");
    CorridaCell.classList.add("hidden");
    CorridaCell.textContent = `${item.corrida}`;

    // Adiciona as células à nova linha
    novaLinha.appendChild(IdCell);
    novaLinha.appendChild(CameraCell);
    novaLinha.appendChild(CurvaCell);
    novaLinha.appendChild(HoraCell);
    novaLinha.appendChild(VideoCell);
    novaLinha.appendChild(ReportCell);
    novaLinha.appendChild(NFACell);
    novaLinha.appendChild(ObsCell);
    novaLinha.appendChild(EditarCell);
    novaLinha.appendChild(ButtonsCell);
    novaLinha.appendChild(CorridaCell);

    // Adiciona a nova linha à tabela
    tabela.appendChild(novaLinha);

    fetchUser(item.userID)
      .then((username) => {
        CameraCell.textContent = `${item.camera} (${username})`;
      })
      .catch((error) => {
        console.error("Erro ao buscar username:", error);
        CameraCell.textContent = `${item.camera} (Desconhecido)`;
      });
  });

  // Chama a função para ordenar as linhas por hora crescente
  ordenarPorHoraCrescente(tabela.querySelectorAll("tr"));
}

// Função para ordenar os dados por hora crescente
function ordenarPorHoraCrescente(dados) {
  // Transforma a coleção de linhas (exceto a primeira) em um array
  const arrayDeDados = Array.from(dados).slice(1); // Remove a linha de cabeçalho

  // Ordena as linhas com base na hora
  arrayDeDados.sort((a, b) => {
    const horaA = a.cells[3].textContent.split(":").map(Number); // Obtém a hora da célula 3
    const horaB = b.cells[3].textContent.split(":").map(Number);

    // Compara as horas, minutos e segundos
    if (horaA[0] !== horaB[0]) {
      return horaA[0] - horaB[0];
    } else if (horaA[1] !== horaB[1]) {
      return horaA[1] - horaB[1];
    } else {
      return (horaA[2] || 0) - (horaB[2] || 0); // Comparação de segundos
    }
  });

  // Reorganiza as linhas da tabela com os dados ordenados
  const tabela = dados[0].parentElement;
  arrayDeDados.forEach((linha) => tabela.appendChild(linha)); // Anexa as linhas ordenadas de volta à tabela
}

// Adicionada a função para limpar a tabela
function limparTabela() {
  // Mensagem de confirmação
  if (!confirm("Tem certeza de que deseja apagar a tabela?")) {
    location.reload();
    return; // Se o usuário cancelar, sair da função
  }

  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/dropData";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      location.reload;
      console.log(data.message); // Mensagem retornada pelo servidor
    })
    .catch((error) => {
      console.error("Erro ao apagar dados:", error);
    });
}

//----------------------NUMPAD----------------------

// Ir buscar dados numpad a database
function carregarDadosNumpad() {
  // Faz uma requisição GET para obter os dados do servidor quando a página é carregada

  // Definir o IP/URL para onde enviar os dados
  const endpoint = "getDataNumpad";
  const furl = url + endpoint;

  fetch(furl)
    .then((response) => response.json())
    .then((data) => {
      // Atualiza a tabela com os dados recebidos
      // Armazena os dados localmente para uso posterior
      localStorage.setItem("numpadData", JSON.stringify(data));
      const databaseNum = JSON.parse(localStorage.getItem("numpadData"));
      console.log(databaseNum);
      if (databaseNum) {
        databaseNum.forEach((item) => {
          if (item.numberButtons != null || item.numberButtons != undefined) {
            document.getElementById("numberCurvas").value = item.numberButtons;
          }
        });
      } else {
        document.getElementById("numberCurvas").value =
          localStorage.getItem("numCurves");
      }
    })
    .catch((error) => console.error("Erro ao obter dados:", error));

  //Preencher com os dados do numpad onload
}

// Adicionar numero ao numpad
function adicionarNumpadNum() {
  const numpadNumber = document.getElementById("numberCurvas").value;
  let corridaNumber;
  // Se tiver recebido alteração por um input na corrida(popup de criação)
  corridaNumber = document.getElementById("numberCorrida").value;

  const newNum = {
    numberButtons: numpadNumber,
    numberCorrida: corridaNumber,
  };
  localStorage.setItem("novoNumpadNum", JSON.stringify(newNum));
  // Eliminar o anterior
  eliminarNumpadNum();
  enviarJsonNumpad();
}

//Envia o num de numpad á BD
function enviarJsonNumpad() {
  // Recuperar os dados do localStorage
  const localStorageData = localStorage.getItem("novoNumpadNum");

  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/addDataNumpad";

  // Verificar se existem dados no localStorage
  if (localStorageData) {
    const parsedData = JSON.parse(localStorageData);
    // Enviar os dados para o servidor
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) =>
        console.error("Erro ao enviar dados para o servidor:", error)
      );
  } else {
    console.log("Nenhum dado encontrado no localStorage.");
  }
}

function updateNumpad(corrida) {
  // Captura os valores atualizados dos campos do pop-up
  const numpadNumber = document.getElementById("numberCurvas").value;
  let corridaNumber;
  if (corrida <= 0) {
    corridaNumber = 1;
  } else {
    corridaNumber = corrida;
  }

  // Se tiver recebido alteração por um input na corrida(popup de criação)

  const updatedNumpadData = {
    numberButtons: numpadNumber,
    numberCorrida: corridaNumber,
  };

  // Recupera o ID dos detalhes armazenados no localStorage
  const detalhesNumpad = JSON.parse(localStorage.getItem("numpadData"));
  console.log(detalhesNumpad.id);
  detalhesNumpad.forEach((item) => {
    updatedNumpadData._id = item._id;
  });
  // Armazena os dados atualizados no localStorage
  localStorage.setItem("updatedNumpadData", JSON.stringify(updatedNumpadData));

  envUpNumpadJson();
}

function envUpNumpadJson() {
  // Obtém os dados atualizados do localStorage
  const updatedDataString = localStorage.getItem("updatedNumpadData");
  // Verifica se há dados no localStorage
  if (updatedDataString) {
    const updatedData = JSON.parse(updatedDataString);

    // Define o ID do documento a ser atualizado (obtido do localStorage)
    const id = updatedData._id;
    // Definir o IP/URL para onde enviar os dados
    const url = `http://localhost:16082/updateNumpad/${id}`;
    // Envia os dados atualizados para o servidor
    console.log(updatedData);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados atualizados com sucesso:", data);

        // Limpa os dados do localStorage após a atualização
        localStorage.removeItem("updatedNumpadData");
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar dados atualizados para o servidor:",
          error
        );
      });
  } else {
    console.error("Nenhum dado encontrado no localStorage para enviar.");
  }
}

// Dar reset ao numero de numpad
function eliminarNumpadNum() {
  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/dropDataNumpad";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //location.reload;
      console.log(data.message); // Mensagem retornada pelo servidor
    })
    .catch((error) => {
      console.error("Erro ao apagar dados:", error);
    });
}

// Preencher informação com a curva quando utilizar Numpad
function obterCurvaNum(curva) {
  document.getElementById("curvaInput").value = document.getElementById(
    `curva${curva}`
  ).value;
}

// Gera o numpad na página baseado no numero armazenado na localStorage(este é alcançado pelo valor na database)
function generateNumpad() {
  //Se já existir um numpad gerado, não acrescenta mais um
  // Gerar Número de curvas no numpad
  let generatedNumber;
  if (document.getElementById("numpad-table") == null) {
    const num = document.getElementById("numberCurvas").value;
    const databaseNum = Number(localStorage.getItem("numCurvasBD"));
    if (databaseNum) {
      generatedNumber = databaseNum;
    } else {
      generatedNumber = num;
    }
    const numpadDiv = document.getElementById("numpad");
    const numpadTable = document.createElement("table");
    numpadTable.id = "numpad-table";
    let numpadRow = document.createElement("tr");
    numpadRow.classList.add("numpad-row");
    numpadTable.appendChild(numpadRow);
    numpadDiv.appendChild(numpadTable);
    // De acordo com o numero recebido gera 2 buttoes por linha
    for (let i = 1; i <= generatedNumber; i++) {
      const numpadCell = document.createElement("td");
      numpadCell.classList.add("numpad-cell");
      const numpadButton = document.createElement("button");
      numpadButton.classList.add("numpad-Button");
      numpadButton.textContent = i;
      numpadButton.id = `curva${i}`;
      numpadButton.onclick = function () {
        abrirPopupNumpad();
        abrirPopup();
        obterHoraAtual();
        obterCurvaNum(i);
      };
      numpadButton.value = i;
      numpadCell.appendChild(numpadButton);
      numpadRow.appendChild(numpadCell);
      //A cada 2 celulas, fecha e abro uma linha nova
      if (i % 2 == 0 && i != num) {
        numpadRow = document.createElement("tr");
        numpadRow.classList.add("numpad-row");
        numpadTable.appendChild(numpadRow);
      }
    }

    //Guardar ultimo numero de curvas guardado
    if (generatedNumber != num) {
      localStorage.setItem("numCurves", generatedNumber);
    } else {
      localStorage.setItem("numCurves", num);
    }
  } else {
    //Caso já exista uma, remover e adicionar novo input
    const num = document.getElementById("numberCurvas").value;
    const databaseNum = localStorage.getItem("numCurvasBD");
    console.log(databaseNum);
    if (databaseNum != undefined || databaseNum != null) {
      generatedNumber = databaseNum;
    } else {
      generatedNumber = num;
    }
    const numpadTable = document.getElementById("numpad-table");
    numpadTable.innerHTML = "";
    let numpadRow = document.createElement("tr");
    numpadRow.classList.add("numpad-row");
    numpadTable.appendChild(numpadRow);
    // De acordo com o numero recebido gera 2 buttoes por linha
    for (let i = 1; i <= generatedNumber; i++) {
      const numpadCell = document.createElement("td");
      numpadCell.classList.add("numpad-cell");
      const numpadButton = document.createElement("button");
      numpadButton.classList.add("numpad-Button");
      numpadButton.textContent = i;
      numpadButton.id = `curva${i}`;
      numpadButton.onclick = function () {
        abrirPopupNumpad();
        abrirPopup();
        obterHoraAtual();
        obterCurvaNum(i);
      };
      numpadButton.value = i;
      numpadCell.appendChild(numpadButton);
      numpadRow.appendChild(numpadCell);
      //A cada 2 celulas, fecha e abro uma linha nova
      if (i % 2 == 0 && i != num) {
        numpadRow = document.createElement("tr");
        numpadRow.classList.add("numpad-row");
        numpadTable.appendChild(numpadRow);
      }
    }
    if (generatedNumber != num) {
      localStorage.setItem("numCurves", generatedNumber);
    } else {
      localStorage.setItem("numCurves", num);
    }
  }
}

//----------------------PESQUISA----------------------

//----------------------------------------------------------------------------vPROTOTYPO PESQUISAR COM CORRIDA SELECTEDv--------------------------------------------
/* function atualizarTabelaPesquisa(data, numCorrida){
  const tabela = document.getElementById("tabela");
  const tabelaPesquisa = document.getElementById("tabelaCorrida");
 
   // Limpa apenas as linhas de dados da tabela, mantendo o cabeçalho
   while (tabelaPesquisa.rows.length > 1) {
     tabelaPesquisa.deleteRow(1);
   }
 
   // Adiciona linhas à tabela com os dados recebidos
   var counter = 1;
 if(numCorrida){
    tabela.classList.add("hidden")
    tabelaPesquisa.classList.remove("hidden")
   data.forEach((item) => {
     if(item.corrida==numCorrida){
 
     const novaLinha = document.createElement("tr");
     novaLinha.innerHTML = `
       <td class="hidden">${item._id}</td>
       <td contenteditable="false">${item.camera}</td>
       <td contenteditable="false">${item.curva}</td>
       <td contenteditable="false">${item.hora}</td>
       <td contenteditable="false"><input type="checkbox" ${
         item.video ? "checked" : ""
       } disabled></td>
       <td contenteditable="false"><input type="checkbox" ${
         item.report ? "checked" : ""
       } disabled></td>
       <td contenteditable="false"><input type="checkbox" ${
         item.nfa ? "checked" : ""
       } disabled></td>
       <td contenteditable="false">${item.obs}</td>
       <td id="tdlg"><img src="images/pen.png" alt="Editar" id="editlg" onclick="abrirDetalhes('${
         item._id
       }')"></td>
       <td id="positionButton" class="hidden"><button class="buttaoUpDown" id="buttonUp${
         item._id
       }" onclick="moveUp(this)">↑</button><button class="buttaoUpDown"  id="buttonDown${
       item._id
     }" onclick="moveDown(this)">↓</button>
      <td class="hidden">${item.corrida}</td>
       `;
 
     // Adiciona classes CSS com base nos valores de report e nfa
     if (item.report) {
       novaLinha.classList.add("report-true");
     }
     if (item.nfa) {
       novaLinha.classList.add("nfa-true");
     }
     if (item.priority) {
       novaLinha.classList.add("priority-set");
     }
     if (item.curva == "Start") {
       novaLinha.classList.add("post-start");
     }
     if (item.curva == "Slow Flag") {
       novaLinha.classList.add("post-slow");
     }
     if (item.curva == "Red Flag") {
       novaLinha.classList.add("post-redflag");
     }
     }
     counter++;
     tabelaPesquisa.appendChild(novaLinha);
   });
 }else{
    tabela.classList.remove("hidden")
    tabelaPesquisa.classList.add("hidden")
 }
 
 }
 */

//----------------------------------------------------------------------------^PROTOTYPO PESQUISAR COM CORRIDA SELECTED ^-------------------------------------------

//Quando a página acaba de carregar verifica o indice máximo corrente

//Função que muda a pesquisa quando o usuário seleciona uma opção no menu de filtros (Lupa)
function mudaPesquisa() {
  let pesquisaChoice = document.getElementById("pesquisaOptions");
  const historyChoice = localStorage.getItem("pesquisaChoice");
  const pesquisa = document.getElementById("pesquisa");
  const searchFiltro = document.getElementById("searchFiltro");

  pesquisaChoice.addEventListener("change", function () {
    const selectedOption =
      pesquisaChoice.options[pesquisaChoice.selectedIndex].text;
    searchFiltro.textContent = selectedOption;
    localStorage.setItem("labelPesquisa", selectedOption);
    localStorage.setItem("pesquisaChoice", pesquisaChoice.value);

    if (pesquisaChoice.value == 1) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaPost();
      };
    } else if (pesquisaChoice.value == 2) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaHour();
      };
    } else if (pesquisaChoice.value == 3) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaObs();
      };
    }
  });
}

// Carregar a pesquisa selecionada anteriormente
function loadPesquisaChoice() {
  let pesquisaChoice = document.getElementById("pesquisaOptions");
  const choice = localStorage.getItem("pesquisaChoice");
  const pesquisa = document.getElementById("pesquisa");
  const searchFiltro = document.getElementById("searchFiltro");
  searchFiltro.textContent = localStorage.getItem("labelPesquisa");

  if (choice != null) {
    pesquisaChoice.value = choice;
    if (pesquisaChoice.value == 1) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaPost();
      };
    } else if (pesquisaChoice.value == 2) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaHour();
      };
    } else if (pesquisaChoice.value == 3) {
      pesquisa.onkeyup = function () {
        pesquisarTabelaObs();
      };
    }
  }
}

/* Adiciona função filtragem*/
function pesquisarTabelaObs() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("pesquisa");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabela");
  tr = table.getElementsByTagName("tr");

  // Loop para percorrer cada linha da tabela, e verificar o conteudo na celula de index especificado(td e o indice é a coluna)
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[7]; //Escolha de qual a coluna onde a pesquisa vai incidir 5->Observações
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Pesquisar pela Hora
function pesquisarTabelaHour() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("pesquisa");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabela");
  tr = table.getElementsByTagName("tr");

  // Loop para percorrer cada linha da tabela, e verificar o conteudo na celula de index especificado(td e o indice é a coluna)
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3]; //Escolha de qual a coluna onde a pesquisa vai incidir 1->Hour
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Seleção da corrida no menu de filtros(Por enquanto se o usuário escrever na barra de pesquisa, esta função leva overwrite e são exibidos todos os registo de acordo com a pesquisa)
function pesquisarCorrida(corridaLastChoice) {
  var input, filter, table, tr, td, i, txtValue;
  const searchCorrida = document.getElementById("searchCorrida");

  if (corridaLastChoice) {
    //se receber um parametro com um valor
    input = corridaLastChoice;
    filter = input;
    if (corridaLastChoice != "") {
      searchCorrida.textContent = ` | Race Nº ${corridaLastChoice}`;
    } else {
      searchCorrida.textContent = ` | All Races`;
    }
  } else {
    input = document.getElementById("pesquisaCorrida");
    localStorage.setItem("corridaChoice", input.value);
    filter = input.value.toUpperCase();
    if (filter != "") {
      searchCorrida.textContent = ` | Race Nº ${localStorage.getItem(
        "corridaChoice"
      )}`;
    } else {
      searchCorrida.textContent = ` | All Races`;
    }
  }
  table = document.getElementById("tabela");
  tr = table.getElementsByTagName("tr");
  console.log(filter);
  // Loop para percorrer cada linha da tabela, e nessa linha verificar o conteudo de uma celula(td) de uma coluna especifica
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[10]; //Escolha de qual a coluna onde a pesquisa vai incidir 1->Hour
    if (td) {
      // Se essa coluna existir
      txtValue = td.textContent || td.innerText; // Obter o seu conteudo
      if (filter == "") {
        // Verificar se está vazio (ou seja mostrar todas as corridas)
        tr[i].style.display = "";
      } else if (txtValue.trim() === filter) {
        //  Se se verificar o valor exato mostra, senão esconde
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Pesquisar na tabela pelo campo Turn/Post
function pesquisarTabelaPost() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("pesquisa");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabela");
  tr = table.getElementsByTagName("tr");

  // Loop para percorrer cada linha da tabela, e verificar o conteudo na celula de index especificado(td e o indice é a coluna)
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2]; //Escolha de qual a coluna onde a pesquisa vai incidir 0->Post
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//----------------------POPUPs----------------------

// Adicionada a função para atualizar o estado do checkbox no localStorage
function atualizarEstadoCheckbox(checkbox) {
  const estadoAtual = checkbox.dataset.estado;
  checkbox.dataset.estado = estadoAtual === "0" ? "1" : "0";
  localStorage.setItem(
    `checkbox_${checkbox.parentElement.parentElement.rowIndex}`,
    checkbox.dataset.estado
  );
}

// Função para abrir o pop-up com os detalhes da linha correspondente
function abrirDetalhes(id) {
  const data = JSON.parse(localStorage.getItem("dadosTabela")); // Obtemos os dados da localStorage
  const detalhes = data.find((item) => item._id === id); // Encontramos o item com o id correspondente
  if (detalhes) {
    // Se encontrarmos os detalhes, preenchemos o pop-up e o exibimos
    if (popup2Aberto == true) {
      resetPositionButtons();
    }

    preencherPopupComDetalhes(detalhes);
    generatePositionButtons(detalhes);
    abrirPopup2();
  } else {
    console.error("Detalhes não encontrados para o ID:", id);
  }
}
//preenche o popup com os detalhes da linha
function preencherPopupComDetalhes(detalhes) {
  // Armazena os detalhes no localStorage
  localStorage.setItem("detalhesPopup", JSON.stringify(detalhes));

  // Verifica se os detalhes são válidos
  if (detalhes) {
    // Obtém os elementos do popup
    const cameraInput = document.getElementById("cameraNumber2");
    const curvaInput = document.getElementById("curvaInput2");
    const horainput = document.getElementById("horainput2");
    const videoCheck = document.getElementById("videoCheck2");
    const reportCheck = document.getElementById("reportCheck2");
    const priorityCheck = document.getElementById("priorityCheck2");
    const obsInput = document.getElementById("obsInput2");
    const nfaCheck = document.getElementById("nfacheck2");
    const corridaInput = document.getElementById("inputCorrida2");

    // Verifica se os elementos existem no DOM
    if (
      curvaInput &&
      horainput &&
      videoCheck &&
      reportCheck &&
      nfaCheck &&
      obsInput &&
      cameraInput &&
      priorityCheck &&
      corridaInput
    ) {
      // Atribui os valores dos detalhes aos campos do popup
      corridaInput.value = detalhes.corrida || "";
      cameraInput.value = detalhes.camera || "";
      curvaInput.value = detalhes.curva || "";
      horainput.value = detalhes.hora || "";
      videoCheck.checked = detalhes.video || false;
      nfaCheck.checked = detalhes.nfa || false;
      reportCheck.checked = detalhes.report || false;
      priorityCheck.checked = detalhes.priority || false;
      obsInput.value = detalhes.obs || "";

      //Guardar o input da curva anterior Turn ou Post
      if (curvaInput.value.includes("P")) {
        detalheCurva = "P";
      } else if (curvaInput.value.includes("Turn")) {
        detalheCurva = "Turn";
      }

      //Para poder retirar e substituir nas obs quando mudam a corrida
      detalheCorrida = detalhes.corrida;
    } else {
      console.error(
        "Um ou mais elementos do popup não foram encontrados no DOM."
      );
    }
  } else {
    console.error("Detalhes inválidos.");
  }
}
// Função para criar os botões de troca de posição da linha selecionada
function generatePositionButtons(detalhes) {
  const popupEdit = document.getElementById("popupEdit");
  const originalUp = document.getElementById(`buttonUp${detalhes._id}`);
  const originalDown = document.getElementById(`buttonDown${detalhes._id}`);
  const buttonUp = document.createElement("button");
  buttonUp.classList.add("buttaoUpDown");
  buttonUp.textContent = "↑";
  buttonUp.id = `buttonUp`;
  buttonUp.addEventListener("click", () => {
    originalUp.click();
  });

  const buttonDown = document.createElement("button");
  buttonDown.classList.add("buttaoUpDown");
  buttonDown.textContent = "↓";
  buttonDown.id = `buttonDown`;
  buttonDown.addEventListener("click", () => {
    originalDown.click();
  });

  popupEdit.appendChild(buttonUp);
  popupEdit.appendChild(buttonDown);
}
// Adicionar o evento de editar a hora
function editarHora() {
  const celulaHora = event.target;
  celulaHora.setAttribute("contenteditable", "true");
  celulaHora.style.color = "#";
  celulaHora.classList.remove("hora-editavel");
}

// Adicionar a função para obter a hora atual formatada
function obterHoraAtual() {
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");
  const segundos = agora.getSeconds().toString().padStart(2, "0");
  const hour = `${horas}:${minutos}:${segundos}`;
  document.getElementById("horainput").value = hour;
}

//Red Flag e Start
function obterStartOrRF(valor) {
  document.getElementById("curvaInput").value = document.getElementById(
    `race${valor}`
  ).value;
}

function adicionarCameraOrPost(opcao) {
  const cameraInput = document.getElementById("cameraNumber");
  const curvaInput = document.getElementById("curvaInput");

  if (opcao === "Turn") {
    if (cameraInput.value.trim() !== "") {
      valorCameraBackup = cameraInput.value; // Armazena o valor antes de limpar
      curvaInput.value = `Turn ${cameraInput.value}`; // Transfere com "Turn"
      cameraInput.value = ""; // Limpa o campo da câmera
      console.log(
        `✅ Valor "${valorCameraBackup}" transferido para curvaInput com "Turn".`
      );
    } else {
      console.warn("⚠️ Nenhum valor na câmera para transferir!");
    }
  } else if (opcao === "Camera") {
    if (curvaInput.value.trim() !== "") {
      cameraInput.value = `Cam ${valorCameraBackup}`; // Restaura com "Cam"
      curvaInput.value = ""; // Limpa o campo da curva
      console.log(
        `🔄 Valor restaurado para cameraInput com "Cam": "${cameraInput.value}"`
      );
    } else {
      console.warn(
        "⚠️ Nenhum valor em curvaInput para restaurar para a câmera!"
      );
    }
  }
}

//Verificar password dar input de curvas
function checkPassword() {
  numpadPassword = "wfr2019.";
  if (document.getElementById("numpadUnlock").value == numpadPassword) {
    adicionarNumpadNum();
    generateNumpad();
    fecharPopupNumpadPassword();
    fecharPopupRodaDentada();
  } else {
    window.alert("Código introduzido errado!");
    fecharPopupNumpadPassword();
    fecharPopupRodaDentada();
  }
}

// Função para determinar qual ação executar com base no popup aberto
function handleEnterKey(e) {
  if (e.key === "Enter") {
    // Verifica se o popup regular está aberto
    if (popupAberto) {
      adicionarLinha();
      fecharPopup();
    }
    // Verifica se o popup2 está aberto
    else if (popup2Aberto) {
      updateLinha();
      fecharPopup2();
    } else if (popupNumpadPasswordAberto) {
      checkPassword();
    }
    // Adicione mais verificações para outros popups, se necessário
    else {
      console.error("Erro: Nenhum popup aberto.");
    }
  }
}

// Adicione um ouvinte de evento de teclado ao documento
document.addEventListener("keydown", handleEnterKey);

// Mover a linha para cima
function moveUp(button) {
  //Vai buscar a celula do botão, e depois a linha dessa célula
  var row = button.parentNode.parentNode; //Vai buscar o celula do botão, e depois a linha dessa célula
  const idLinha = row.cells[0].textContent;
  var table = row.parentNode;

  const dadosExistentes = localStorage.getItem("dadosTabela");
  const data = JSON.parse(dadosExistentes);
  var LinhaDados1;
  var LinhaDados2;
  var rowIndex = Array.from(table.rows).indexOf(row); //Procura o indice do elemento row dem relação á tabela. Podia só usar o rowIndex = row.rowIndex
  var tablePosition; // Variável para saber a posição no loop (e ir buscar o anterior na tabela mais tarde)
  var numCiclo = 1;
  var allowNext = false; // Variavel para executar o segundo if (entrada seguinte)
  if (rowIndex > 1) {
    if (data != null) {
      data.forEach((item) => {
        //Por cada item já armazenado na tabela
        if (item._id == idLinha) {
          //Vai buscar o id da linha onde foi primido o botao

          LinhaDados1 = { ...item }; // Como o valor LinhaDados1 passa por referencia ao item, quando o item era alterado, alterava o LinhaDados1 também, {...}->spread, utilizando o operador spread, cria-se uma copia do objecto para utilizar sem que o seu valor seja alterado.

          tablePosition = numCiclo; //Guarda a posição da linha onde foi primido o botao
          allowNext = true; // Para adquirir os dados do que vem a seguir
          //localStorage.setItem('LinhaPosition1',JSON.stringify(item))
        }
        numCiclo++;
      });

      const linhaAnterior = table.rows[tablePosition - 1]; // Ir buscar a linha da tabela anterior
      const idLinhaAnterior = linhaAnterior.cells[0].textContent; // Ir buscar o Id da linha anterior

      data.forEach((item) => {
        // Ciclo para encontrar os dados da linha anterior
        if (item._id == idLinhaAnterior) {
          LinhaDados2 = { ...item };
        }
      });

      data.forEach((item) => {
        // Ciclo para fazer a troca

        if (item._id == LinhaDados1._id) {
          //Vai buscar o objecto com o mesmo e ID e substituir pelos contéudos do qual pretende trocar

          item.camera = LinhaDados2.camera;
          item.curva = LinhaDados2.curva;
          item.hora = LinhaDados2.hora;
          item.video = LinhaDados2.video;
          item.report = LinhaDados2.report;
          item.nfa = LinhaDados2.nfa;
          item.priority = LinhaDados2.priority;
          item.obs = LinhaDados2.obs;
          item.__v = LinhaDados2.__v;
          localStorage.setItem("LinhaPosition1", JSON.stringify(item));
        }
        if (item._id == LinhaDados2._id) {
          //Vai buscar o objecto com o mesmo e ID e substituir pelos contéudos do qual pretende trocar
          item.corrida = LinhaDados1.corrida;
          item.camera = LinhaDados1.camera;
          item.curva = LinhaDados1.curva;
          item.hora = LinhaDados1.hora;
          item.video = LinhaDados1.video;
          item.report = LinhaDados1.report;
          item.nfa = LinhaDados1.nfa;
          item.priority = LinhaDados1.priority;
          item.obs = LinhaDados1.obs;
          item.__v = LinhaDados1.__v;
          localStorage.setItem("LinhaPosition2", JSON.stringify(item));
        }
      });

      updatePosition();
    }
  } else {
    console.log("No row before the current row");
  }
}

// Mover a linha para baixo
function moveDown(button) {
  var row = button.parentNode.parentNode; //Vai buscar o celula do botão, e depois a linha dessa célula
  const idLinha = row.cells[0].textContent;
  var table = row.parentNode;

  const dadosExistentes = localStorage.getItem("dadosTabela");
  const data = JSON.parse(dadosExistentes);
  var LinhaDados1;
  var LinhaDados2;
  var rowIndex = Array.from(table.rows).indexOf(row); //Procura o indice do elemento row dem relação á tabela. Podia só usar o rowIndex = row.rowIndex
  var allowNext = false; // Variavel para executar o segundo if (entrada seguinte)
  if (rowIndex < table.rows.length - 1) {
    if (data != null) {
      data.forEach((item) => {
        //Por cada item já armazenado na tabela

        if (item._id == idLinha) {
          //Vai buscar o id da linha anterior
          LinhaDados1 = { ...item }; // Como o valor LinhaDados1 passa por referencia ao item, quando o item era alterado, alterava o LinhaDados1 também, {...}->spread, utilizando o operador spread, cria-se uma copia do objecto para utilizar sem que o seu valor seja alterado.
          allowNext = true; // Para adquirir os dados do que vem a seguir
          //localStorage.setItem('LinhaPosition1',JSON.stringify(item))
        } else if (allowNext == true) {
          //Vai buscar o indice corrente e retira uma posição(passa para cima)
          LinhaDados2 = { ...item };
          allowNext = false;
          //item.indice-=1;
          //localStorage.setItem('LinhaPosition2',JSON.stringify(item))
        }
      });

      data.forEach((item) => {
        //Ciclo para substituir

        if (item._id == LinhaDados1._id) {
          //Vai buscar o objecto com o mesmo e ID e substituir pelos contéudos do qual pretende trocar
          item.corrida = LinhaDados2.corrida;
          item.camera = LinhaDados2.camera;
          item.curva = LinhaDados2.curva;
          item.hora = LinhaDados2.hora;
          item.video = LinhaDados2.video;
          item.report = LinhaDados2.report;
          item.nfa = LinhaDados2.nfa;
          item.priority = LinhaDados2.priority;
          item.obs = LinhaDados2.obs;
          item.__v = LinhaDados2.__v;
          localStorage.setItem("LinhaPosition1", JSON.stringify(item));
        }
        if (item._id == LinhaDados2._id) {
          //Vai buscar o objecto com o mesmo e ID e substituir pelos contéudos do qual pretende trocar
          item.corrida = LinhaDados1.corrida;
          item.camera = LinhaDados1.camera;
          item.curva = LinhaDados1.curva;
          item.hora = LinhaDados1.hora;
          item.video = LinhaDados1.video;
          item.report = LinhaDados1.report;
          item.nfa = LinhaDados1.nfa;
          item.priority = LinhaDados1.priority;
          item.obs = LinhaDados1.obs;
          item.__v = LinhaDados1.__v;
          localStorage.setItem("LinhaPosition2", JSON.stringify(item));
        }
        updatePosition();
      });
      //
    }
  } else {
    console.log("No row after the current row");
  }
}

// Fazer update dos indices quando as linhas trocarem de lugar
function updatePosition() {
  // Obtém os dados da linha atualizados do localStorage
  const updatedDataString1 = localStorage.getItem("LinhaPosition1");
  const updatedDataString2 = localStorage.getItem("LinhaPosition2");
  // Verifica se há dados no localStorage
  if (updatedDataString1 && updatedDataString2) {
    const updatedData1 = JSON.parse(updatedDataString1);

    // Define o ID do documento a ser atualizado (obtido do localStorage)
    const id = updatedData1._id;
    // Definir o IP/URL para onde enviar os dados
    const url = `http://localhost:16082/updateData/${id}`;
    // Envia os dados atualizados para o servidor
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData1),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados atualizados com sucesso:", data);

        // Limpa os dados do localStorage após a atualização
        localStorage.removeItem("LinhaPosition1");
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar dados atualizados para o servidor:",
          error
        );
      });

    //Processo da outra linha
    const updatedData2 = JSON.parse(updatedDataString2);

    // Define o ID do documento a ser atualizado (obtido do localStorage)
    const id2 = updatedData2._id;

    // Definir o IP/URL para onde enviar os dados
    const url2 = `http://localhost:16082/updateData/${id2}`;

    // Envia os dados atualizados para o servidor
    fetch(url2, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData2),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados atualizados com sucesso:", data);

        // Limpa os dados do localStorage após a atualização
        localStorage.removeItem("LinhaPosition2");
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar dados atualizados para o servidor:",
          error
        );
      });
    location.reload();
  } else {
    console.error("Nenhum dos dados encontrados no localStorage para enviar.");
  }
}

//Função que vai buscar o numero de corridas á localStorage(após a análise de todas as corridas de numero diferente na tabela)
function carregarOpcoesCorrida() {
  analisarCorridas();
  const selectCorrida = document.getElementById("pesquisaCorrida");
  const numCorridas = JSON.parse(localStorage.getItem("opcoesCorridas"));
  const maxCorridas = Math.max(...numCorridas);
  console.log(maxCorridas);
  if (!popupFiltros) {
    for (let i = 1; i <= maxCorridas; i++) {
      if (numCorridas.includes(i)) {
        const option = document.createElement("option");
        option.value = i;
        option.id = `corrida${i}`;
        option.textContent = `Race nº ${i}`;
        selectCorrida.appendChild(option);
      }
    }
  }
}

// Analisa todos os numeros diferentes de corridas na coluna de corridas
function analisarCorridas() {
  var table, tr, td, i, txtValue, setNumCorridas;
  setNumCorridas = new Set();
  table = document.getElementById("tabela");
  tr = table.getElementsByTagName("tr");
  // Loop para percorrer cada linha da tabela, e verificar o conteudo na celula de index especificado(td e o indice é a coluna)
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[10]; // access the 10th column
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (i !== 0) {
        setNumCorridas.add(Number(txtValue));
      }
    }
  }
  console.log(Array.from(setNumCorridas));
  localStorage.setItem(
    "opcoesCorridas",
    JSON.stringify(Array.from(setNumCorridas))
  );
}

// Impedir que a lista seja replicada caso o usuario feixe a janela e abra outra vez(dá clear da lista aquando do fecho da janela)
function resetCorridas() {
  const selectCorrida = document.getElementById("pesquisaCorrida");
  selectCorrida.innerHTML = '<option value="">Race</option>';
}

// Carregar opções para Obs
function carregarObsOptions() {
  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/getObsOptions";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Atualiza a tabela com os dados recebidos
      atualizarObsOptions(data);
      // Armazena os dados localmente para uso posterior
      localStorage.setItem("obsOptions", JSON.stringify(data));
    })
    .catch((error) => console.error("Erro ao obter dados:", error));
}

// Adicionar Acontecimentos as observacoes
function adicionarObsOptions() {
  const descricao = document.getElementById("newObs").value;

  const newData = {
    descricao: descricao,
  };

  localStorage.setItem("newOption", JSON.stringify(newData));
  enviarObsOptionJson();
}

function enviarObsOptionJson() {
  const localStorageData = localStorage.getItem("newOption");
  console.log(localStorageData);

  // Definir o IP/URL para onde enviar os dados
  const url = "http://localhost:16082/addObsOptions";

  // Verificar se existem dados no localStorage
  if (localStorageData) {
    const parsedData = JSON.parse(localStorageData);
    // Enviar os dados para o servidor
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) =>
        console.error("Erro ao enviar dados para o servidor:", error)
      );
  } else {
    console.log("Nenhum dado encontrado no localStorage.");
  }
}

// Ir buscar acontecimentos para observações
function atualizarObsOptions(data) {
  const selectObs = document.getElementById("obsInputSelect");
  const selectOBSUpdate = document.getElementById("obsInputSelect2");
  const obsOptions = JSON.parse(localStorage.getItem("obsOptions"));

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.descricao;
    option.textContent = item.descricao;
    selectObs.appendChild(option);
  });

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.descricao;
    option.textContent = item.descricao;
    selectOBSUpdate.appendChild(option);
  });
}

// Function to adjust the time input by a specified number of minutes
// Used by buttons in the popup to subtract time
function adjustTime(minutes) {
  // Get the current time input value
  const timeInput = document.getElementById("horainput");
  let currentTime = timeInput.value;

  // If the time input has a value
  if (currentTime) {
    // Split the time into hours, minutes, and seconds
    const timeParts = currentTime.split(":");
    let hours = parseInt(timeParts[0], 10);
    let mins = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    // Add the specified number of minutes to the current time
    mins += minutes;

    // If the minutes are less than 0, subtract 1 from the hours and add 60 to the minutes
    if (mins < 0) {
      hours -= 1;
      mins += 60;
    }

    // If the hours are less than 0, set them to 23
    if (hours < 0) {
      hours = 23;
    }

    // Format the time to HH:MM:SS
    const adjustedTime = `${String(hours).padStart(2, "0")}:${String(
      mins
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // Update the time input value
    timeInput.value = adjustedTime;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Referência aos botões
  const buttonMinus1Lap = document.getElementById("button-minus1"); // Botão -1 Lap
  const buttonMinus2Laps = document.getElementById("button-minus2"); // Botão -2 Laps
  const obsInput = document.getElementById("obsInput"); // Campo de observações

  // Verificar se o campo obsInput existe
  if (!obsInput) {
    console.error("O campo com o ID 'obsInput' não foi encontrado.");
    return; // Impede que o código continue se o campo não for encontrado
  }

  // Evento para o botão -1 Lap
  buttonMinus1Lap.addEventListener("click", function () {
    console.log("Botão -1 Lap clicado"); // Log para depuração
    //if (obsInput) {
    // Verifica se "-1 Lap" já está no campo de observações
    //if (!obsInput.value.includes("-1 Lap")) {
    //obsInput.value += " -1 Lap"; // Adiciona o texto ao campo se não existir
    //console.log("-1 Lap adicionado ao campo obsInput");
    //} else {
    //console.log("-1 Lap já existe no campo obsInput");
    // }
    //}
  });

  // Evento para o botão -2 Laps
  buttonMinus2Laps.addEventListener("click", function () {
    console.log("Botão -2 Laps clicado"); // Log para depuração
    // if (obsInput) {
    // Verifica se "-2 Laps" já está no campo de observações
    //  if (!obsInput.value.includes("-2 Laps")) {
    //  obsInput.value += " -2 Laps"; // Adiciona o texto ao campo se não existir
    // console.log("-2 Laps adicionado ao campo obsInput");
    //} else {
    // console.log("-2 Laps já existe no campo obsInput");
    // }
    //  }
    //});
  });

  // Função para resetar a corrida
  function resetCorrida() {
    // Resetando o número da corrida no localStorage
    localStorage.setItem("numCorridas", 1);

    // Atualizando o campo de input com o número da corrida 1
    document.getElementById("inputCorrida").value = 1;

    // (Opcional) Resetar o campo de observações
    document.getElementById("obsInput").value = "";

    console.log("Corrida foi resetada para 1!");
  }

  // Certifique-se de que o código JavaScript seja executado quando o DOM estiver pronto
  document.addEventListener("DOMContentLoaded", function () {
    // Adicionando o listener para o botão "Clear Data"
    document
      .getElementById("botaoLimparTabela")
      .addEventListener("click", function () {
        resetCorrida(); // Chama a função de reset
      });
  });
});
