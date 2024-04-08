define(function () {
  //Verificar password dar input de curvas
  function checkPassword() {
    numpadPassword = "WFR2012";
    console.log(document.getElementById("numpadUnlock").value);
    if (document.getElementById("numpadUnlock").value == numpadPassword) {
      generateNumpad();
      fecharPopupNumpadPassword();
    } else {
      window.alert("Código introduzido errado!");
      fecharPopupNumpadPassword();
    }
  }

  function checkPassword2() {
    numpadPassword = "WFR2012";
    console.log(document.getElementById("numpadUnlock2").value);
    if (document.getElementById("numpadUnlock2").value == numpadPassword) {
      generateNumpad2();
      fecharPopupNumpadPassword();
    } else {
      window.alert("Código introduzido errado!");
      fecharPopupNumpadPassword();
    }
  }

  /* Fazer update dos indices quando as linhas trocarem de lugar*/
  function updatePosition() {
    // Obtém os dados da linha atualizados do localStorage
    const updatedDataString1 = localStorage.getItem("LinhaPosition1");
    console.log(updatedDataString1);
    const updatedDataString2 = localStorage.getItem("LinhaPosition2");
    console.log(updatedDataString2);
    // Verifica se há dados no localStorage
    if (updatedDataString1 && updatedDataString2) {
      const updatedData1 = JSON.parse(updatedDataString1);
      console.log(updatedData1);

      // Define o ID do documento a ser atualizado (obtido do localStorage)
      const id = updatedData1._id;
      console.log(id);
      // Definir o IP/URL para onde enviar os dados
      //Ip casa
      const url = `http://localhost:3000/updateData/${id}`;
      //IP casa Luís
      //const url = `http://localhost/updateData/${id}`;
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
      console.log(updatedData2);

      // Define o ID do documento a ser atualizado (obtido do localStorage)
      const id2 = updatedData2._id;
      console.log(id2);
      // Definir o IP/URL para onde enviar os dados
      //Ip casa
      const url2 = `http://localhost:3000/updateData/${id2}`;
      //IP casa Luís
      //const url = `http://localhost/updateData/${id}`;
      //IP config WFR
      //const url = `http://192.168.1.148:3000/updateData/${id}`;
      //const url = `http://192.168.1.136:3000/updateData/${id}`;
      //IP CORRIDAS
      //const url = "http://192.168.1.53:3000/updateData/";
      console.log(url2);
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
      console.error(
        "Nenhum dos dados encontrados no localStorage para enviar."
      );
    }
  }

  return { checkPassword, checkPassword2, updatePosition };
});
