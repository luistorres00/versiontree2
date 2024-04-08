define(function () {
  function preencherPopupComDetalhes(detalhes) {
    // Armazena os detalhes no localStorage
    localStorage.setItem("detalhesPopup", JSON.stringify(detalhes));

    // Verifica se os detalhes são válidos
    if (detalhes) {
      // Obtém os elementos do popup
      const curvaInput = document.getElementById("curvaInput2");
      const horainput = document.getElementById("horainput2");
      const videoCheck = document.getElementById("videoCheck2");
      const reportCheck = document.getElementById("reportCheck2");
      const obsInput = document.getElementById("obsInput2");

      // Verifica se os elementos existem no DOM
      if (curvaInput && horainput && videoCheck && reportCheck && obsInput) {
        // Atribui os valores dos detalhes aos campos do popup
        curvaInput.value = detalhes.curva || "";
        horainput.value = detalhes.hora || "";
        videoCheck.checked = detalhes.video || false;
        reportCheck.checked = detalhes.report || false;
        obsInput.value = detalhes.obs || "";
      } else {
        console.error(
          "Um ou mais elementos do popup não foram encontrados no DOM."
        );
      }
    } else {
      console.error("Detalhes inválidos.");
    }
  }

  function generateNumpad() {
    //Se já existir um numpad gerado, não acrescenta mais um
    if (document.getElementById("numpad-table") == null) {
      const num = document.getElementById("numberCurvas").value;
      generatedNumber = num;
      const numpadDiv = document.getElementById("numpad");
      const numpadTable = document.createElement("table");
      numpadTable.id = "numpad-table";
      let numpadRow = document.createElement("tr");
      numpadRow.classList.add("numpad-row");
      numpadTable.appendChild(numpadRow);
      numpadDiv.appendChild(numpadTable);
      // De acordo com o numero recebido gera 2 buttoes por linha
      for (let i = 1; i <= num; i++) {
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
      //Esconder o botão e textbox.
      /* editarNumpad(); */
      //Guardar ultimo numero de curvas guardado
      localStorage.setItem("numCurves", num);
    } else {
      //Caso já exista uma, remover e adicionar novo input
      const num = document.getElementById("numberCurvas").value;
      generatedNumber = num;
      const numpadTable = document.getElementById("numpad-table");
      numpadTable.innerHTML = "";
      let numpadRow = document.createElement("tr");
      numpadRow.classList.add("numpad-row");
      numpadTable.appendChild(numpadRow);
      // De acordo com o numero recebido gera 2 buttoes por linha
      for (let i = 1; i <= num; i++) {
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
      localStorage.setItem("numCurves", num);
      /* editarNumpad(); */
    }
  }

  function generateNumpad2() {
    //Se já existir um numpad gerado, não acrescenta mais um
    if (document.getElementById("numpad-table2") == null) {
      const num = document.getElementById("numberCurvas").value;
      generatedNumber = num;
      const numpadDiv = document.getElementById("numpad2");
      const numpadTable = document.createElement("table");
      numpadTable.id = "numpad-table2";
      let numpadRow = document.createElement("tr");
      numpadRow.classList.add("numpad-row");
      numpadTable.appendChild(numpadRow);
      numpadDiv.appendChild(numpadTable);
      // De acordo com o numero recebido gera 2 buttoes por linha
      for (let i = 1; i <= num; i++) {
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
      //Esconder o botão e textbox.
      /*  editarNumpad();
      editarNumpad2(); */
      //Guardar ultimo numero de curvas guardado
      localStorage.setItem("numCurves", num);
    } else {
      //Caso já exista uma, remover e adicionar novo input
      const num = document.getElementById("numberCurvas").value;
      generatedNumber = num;
      const numpadTable = document.getElementById("numpad-table2");
      numpadTable.innerHTML = "";
      let numpadRow = document.createElement("tr");
      numpadRow.classList.add("numpad-row");
      numpadTable.appendChild(numpadRow);
      // De acordo com o numero recebido gera 2 buttoes por linha
      for (let i = 1; i <= num; i++) {
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
      localStorage.setItem("numCurves", num);
      /* editarNumpad();
      editarNumpad2(); */
    }
  }

  // Define a função para carregar os dados quando a página é carregada
  function carregarDados() {
    // Faz uma requisição GET para obter os dados do servidor quando a página é carregada

    // Definir o IP/URL para onde enviar os dados
    //IP config casa
    const url = "http://localhost:3000/getData";
    //IP casa Luís
    //const url = "http://localhost:3000/getData";
    //IP config WFR
    //const url = "http://192.168.1.136:3000/getData";
    //IP CORRIDAS
    //const url = "http://192.168.1.53:3000/getData";

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
      }
      // Adicione mais verificações para outros popups, se necessário
      else {
        console.error("Erro: Nenhum popup aberto.");
      }
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

  return {
    preencherPopupComDetalhes,
    generateNumpad,
    generateNumpad2,
    carregarDados,
    handleEnterKey,
    generatePositionButtons,
    updateClock,
  };
});
