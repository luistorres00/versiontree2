define(function () {
  // Alterar a coluna de pesquisa no campo de pesquisa
  function mudaPesquisa() {
    const pesquisaChoice = document.getElementById("pesquisaOptions");
    const pesquisa = document.getElementById("pesquisa");
    console.log(pesquisaChoice.value);
    if (!pesquisaChoice) {
      console.log("Não há select");
    } else {
      pesquisaChoice.addEventListener("change", function () {
        if (pesquisaChoice.value == 1) {
          pesquisa.onkeyup = function () {
            pesquisarTabelaPost();
          };
        } else if (pesquisaChoice.value == 2) {
          console.log("Selected2!");
          pesquisa.onkeyup = function () {
            pesquisarTabelaHour();
          };
        } else if (pesquisaChoice.value == 3) {
          console.log("Selected3!");
          pesquisa.onkeyup = function () {
            pesquisarTabelaObs();
          };
        }
      });
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

    // Loop through all table rows, and hide those who don't match the search query
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

  function pesquisarTabelaHour() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("pesquisa");
    filter = input.value.toUpperCase();
    table = document.getElementById("tabela");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
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

  function pesquisarTabelaPost() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("pesquisa");
    filter = input.value.toUpperCase();
    table = document.getElementById("tabela");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
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
  /*  Escolher o tipo de pesquisa */
  function pesquisaEscolhaPost() {
    const choice = getElementById("pesquisaObs");
    choice.classList.add("hidden");
    const actualChoice = getElementById("pesquisaPost");
    actualChoice.classList.remove("hidden");
  }

  function pesquisaEscolhaPostObs() {
    const choice = getElementById("pesquisaPost");
    choice.classList.add("hidden");
    const actualChoice = getElementById("pesquisaObs");
    actualChoice.classList.remove("hidden");
  }

  return {
    mudaPesquisa,
    pesquisaEscolhaPost,
    pesquisarTabelaHour,
    pesquisarTabelaPost,
    pesquisaEscolhaPostObs,
    pesquisarTabelaObs,
  };
});
