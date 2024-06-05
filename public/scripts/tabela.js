
  //Adicionar Camera ou Post no field Curva/Post
  export function adicionarCameraOrPost(opcao) {
    if (opcao != "Camera") {
      document.getElementById("cameraNumber").value = "";
      document.getElementById("curvaInput").value += document.getElementById(
        `opcao${opcao}`
      ).value;
    } else {
      document.getElementById("cameraNumber").value =
        document.getElementById("curvaInput").value;
      document.getElementById("curvaInput").value = "";
    }
  }

  // Adicionar a função para atualizar a hora atual em uma linha
  export function atualizarHoraAtual(linha) {
    const celulaHora = linha.querySelector(".hora-editavel");
    celulaHora.innerText = obterHoraAtual();
  }

  export function adicionarLinha() {
    const tabela = document.querySelector("tbody");
    const novaLinha = document.createElement("tr");

    // Capturar os valores dos campos do pop-up
    const camera = document.getElementById("cameraNumber").value;
    const curva = document.getElementById("curvaInput").value;
    const hora = document.getElementById("horainput").value;
    const video = document.getElementById("videoCheck").checked;
    const report = document.getElementById("reportCheck").checked;
    const priority = document.getElementById("priorityCheck").checked;
    const obs = document.getElementById("obsInput").value;

    // Se report for 0, definir nfa como 1
    let nfa = false;
    if (!report) {
      nfa = null;
    }

    // Armazenar os dados no localStorage
    const newData = {
      camera: camera,
      curva: curva,
      hora: hora,
      video: video,
      report: report,
      nfa: nfa,
      priority: priority,
      obs: obs,
    };
    console.log(newData);

    // Convertendo para JSON e armazenando no localStorage
    localStorage.setItem("novaLinhaData", JSON.stringify(newData));
    enviarJson();
    location.reload();
  }

  //envio dados para servidor
  export function enviarJson() {
    // Recuperar os dados do localStorage
    const localStorageData = localStorage.getItem("novaLinhaData");
    console.log(localStorageData);

    // Definir o IP/URL para onde enviar os dados
    //IP config casa
    const url = "http://192.168.1.148:3000/addData";
    //IP config casa Luís
    //const url ="http:// 192.168.1.148:3000/addData";
    //IP config WFR
    //const url = "http://192.168.1.148:3000/addData";
    //const url = "http://192.168.1.136:3000/addData";
    //IP CORRIDAS
    //const url = "http://192.168.1.53:3000/addData";

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

  export function updateLinha() {
    // Captura os valores atualizados dos campos do pop-up
    const camera = document.getElementById("cameraNumber2").value;
    const curva = document.getElementById("curvaInput2").value;
    const hora = document.getElementById("horainput2").value;
    const video = document.getElementById("videoCheck2").checked;
    const report = document.getElementById("reportCheck2").checked;
    const priority = document.getElementById("priorityCheck2").checked;
    const nfa = document.getElementById("nfacheck2").checked;
    const obs = document.getElementById("obsInput2").value;

    // Cria um objeto com os dados atualizados
    const updatedData = {
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

  export function envUpJson() {
    // Obtém os dados atualizados do localStorage
    const updatedDataString = localStorage.getItem("novaLinhaData");
    console.log(updatedDataString);
    // Verifica se há dados no localStorage
    if (updatedDataString) {
      const updatedData = JSON.parse(updatedDataString);
      console.log(updatedData);

      // Define o ID do documento a ser atualizado (obtido do localStorage)
      const id = updatedData._id;
      console.log(id);
      // Definir o IP/URL para onde enviar os dados
      //Ip casa
      const url = `http://192.168.1.148:3000/updateData/${id}`;
      //IP casa Luís
      //const url = `http://192.168.1.148/updateData/${id}`;
      //IP config WFR
      //const url = `http://192.168.1.148:3000/updateData/${id}`;
      //const url = `http://192.168.1.136:3000/updateData/${id}`;
      //IP CORRIDAS
      //const url = "http://192.168.1.53:3000/updateData/";
      console.log(url);
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

  export function deleteLinha() {
    // Recupera o ID dos detalhes armazenados no localStorage
    const detalhes = JSON.parse(localStorage.getItem("detalhesPopup"));
    console.log(detalhes._id);
    // Verifica se o ID está disponível nos detalhes
    if (detalhes && detalhes._id) {
      // Faz uma solicitação DELETE para excluir a linha com o ID especificado
      fetch(`http://192.168.1.148:3000/dropData/${detalhes._id}`, {
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

  // Atualiza a tabela com os dados recebidos
  export function atualizarTabela(data) {
    const tabela = document.getElementById("tabela");

    // Limpa apenas as linhas de dados da tabela, mantendo o cabeçalho
    while (tabela.rows.length > 1) {
      tabela.deleteRow(1);
    }

    // Adiciona linhas à tabela com os dados recebidos
    var counter = 1;
    data.forEach((item) => {
      const novaLinha = document.createElement("tr");
      novaLinha.innerHTML = `
        <td class="hidden">${item._id}</td>
        <td contenteditable="true">${item.camera}</td>
        <td contenteditable="true">${item.curva}</td>
        <td contenteditable="true">${item.hora}</td>
        <td contenteditable="true"><input type="checkbox" ${
          item.video ? "checked" : ""
        } disabled></td>
        <td contenteditable="true"><input type="checkbox" ${
          item.report ? "checked" : ""
        } disabled></td>
        <td contenteditable="true"><input type="checkbox" ${
          item.nfa ? "checked" : ""
        } disabled></td>
        <td contenteditable="true">${item.obs}</td>
        <td id="tdlg"><img src="/images/pen.png" alt="Editar" id="editlg" onclick="abrirDetalhes('${
          item._id
        }')"></td>
        <td id="positionButton" class="hidden"><button class="buttaoUpDown" id="buttonUp${
          item._id
        }" onclick="moveUp(this)">↑</button><button class="buttaoUpDown"  id="buttonDown${
        item._id
      }" onclick="moveDown(this)">↓</button>
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
      if (item.curva == "Curva") {
        novaLinha.classList.add("post-curva");
      }
      if (item.curva == "Camera") {
        novaLinha.classList.add("post-camera");
      }

      console.log(counter);
      counter++;
      tabela.appendChild(novaLinha);
    });
  }

  // Adicionada a função para limpar a tabela
  export function limparTabela() {
    // Mensagem de confirmação
    if (!confirm("Tem certeza de que deseja apagar a tabela?")) {
      return; // Se o usuário cancelar, sair da função
      //location.reload;
    }

    // Definir o IP/URL para onde enviar os dados
    //IP config casa
    const url = "http://192.168.1.148:3000/dropData";
    //IP casa Luís
    //const url = "http://192.168.1.148/dropData";
    //IP config WFR
    //const url = "http://192.168.1.136:3000/dropData";
    //IP CORRIDAS
    //const url = "http://192.168.1.53:3000/dropData";

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

  export function trocarParaTabela() {
    const tabela = document.getElementById("tabela");
    const tabelaIcon = document.getElementById("iconTabela");
    const numpad = document.getElementById("numpad");
    const numpadIcon = document.getElementById("iconNumpad");
    const headerText = document.getElementById("currentOptionHeader");

    headerText.textContent = "Numpad:";
    tabela.classList.remove("hidden");
    tabelaIcon.classList.add("hidden");
    numpad.classList.add("hidden");
    numpadIcon.classList.remove("hidden");
  }

  // Mover a linha para cima
  export function moveUp(button) {
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
            LinhaDados2 = { ...item }; // Ir buscar dados da linha anterior
          }
        });

        data.forEach((item) => {
          // Ciclo para fazer a troca

          if (item._id == LinhaDados1._id) {
            //Vai buscar o objecto com o mesmo e ID e substituir pelos contéudos do qual pretende trocar

            item.camera = LinhaDados2.camera;
            item.curva = LinhaDados2.curva;
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

            item.camera = LinhaDados1.camera;
            item.curva = LinhaDados1.curva;
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
  export function moveDown(button) {
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

            item.camera = LinhaDados2.camera;
            item.indice = LinhaDados2.indice;
            item.curva = LinhaDados2.curva;
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

            item.camera = LinhaDados1.camera;
            item.indice = LinhaDados1.indice;
            item.curva = LinhaDados1.curva;
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

  // Preencher informação com a curva quando utilizar Numpad
  export function obterCurvaNum(curva) {
    document.getElementById("curvaInput").value = document.getElementById(
      `curva${curva}`
    ).value;
    //adicionarLinha();
  }

  // Adicionar a função para obter a hora atual formatada
  export function obterHoraAtual() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, "0");
    const minutos = agora.getMinutes().toString().padStart(2, "0");
    const segundos = agora.getSeconds().toString().padStart(2, "0");
    const hour = `${horas}:${minutos}:${segundos}`;
    document.getElementById("horainput").value = hour;
  }

  //Red Flag e Start
  export function obterStartOrRF(valor) {
    document.getElementById("curvaInput").value = document.getElementById(
      `race${valor}`
    ).value;
    console.log(numpadLinhas);
    //adicionarLinha();
  }
