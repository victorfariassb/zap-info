let node = document.getElementById('output');
let node2 = document.getElementById("output2")
let count_unique_names = new Set()
let ultima_msg = document.querySelector(".ultima-msg")
let titulo1 = document.querySelector(".titulo-1")
let titulo2 = document.querySelector(".titulo-2")

var openFile = function (event) {
  count_unique_names.clear()
  // vamos primeiro pegar o arquivo que foi selecionado pelo usuário
  var input = event.target;
  // aqui criamos a função que irá ler o arquivo
  var reader = new FileReader();
  // ao carregar, faça o seguinte:
  reader.onload = function () {
    // o text vai ser o resultado da leitura do arquivo
    let text = reader.result;
    // separarmos o texto por cada '\n'
    let trechos = text.split('\n')
    titulo1.style.display = "block"
    titulo2.style.display = "block"
    node.style.display = "block"
    node2.style.display = "block"

    count_occurrences(trechos)
    count_string(trechos, count_unique_names)
  };
  reader.readAsText(input.files[0]);
};

function count_occurrences(trechos) {
  let count_nomes = []
  for (let trecho of trechos) {
    // separamos depois da hora e de ' - '  
    if (trecho[0] == '[') {
      trecho = trecho.substr(1)
      trecho = trecho.split(/((( )([01]\d|2[0-9])):([0-9]\d)):([0-9]\d)(] )/)
      if (Object.keys(trecho).length == 9) {
        let nome = trecho[8]
        let data = trecho[0].substr(-4, 4)
        if (data == new Date().getFullYear() - 1) {
          nome = nome.split(':')
          if (nome.length == 2) {
            nome = nome[0]
            if (nome.includes("mudou o nome de") == false) {
              count_nomes.push(nome)
              count_unique_names.add(nome)
            }
          }
        }
      }
    }
    else {
      trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
      if (Object.keys(trecho).length == 2) {
        // escolhemos como nome a segunda parte da msg, mas ainda falta tirar todo o conteúdo da msg
        let nome = trecho[1]
        let data = trecho[0].substr(-5, 4)
        if (data == new Date().getFullYear() - 1) {
          // por isso, separamos novamente, mas agora pelo :
          nome = nome.split(':')
          if (nome.length == 2) {
            nome = nome[0]
            if (nome.includes("mudou o nome de") == false) {
              count_nomes.push(nome)
              count_unique_names.add(nome)
            }
          }
        }
      }
    }
  }
  // aqui nós contamos as ocorrências
  count_nomes = count_nomes.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});
  // depois organizamos da maior para a menor
  count_nomes = Object.fromEntries(Object.entries(count_nomes).sort(([, a], [, b]) => b - a))
  // e criamos a lista no HMTL
  var child = node.lastElementChild;
  while (child) {
    node.removeChild(child);
    child = node.lastElementChild;
  }
  for (let participante in count_nomes) {
    let li = document.createElement('li')
    li.innerHTML = participante + ": " + count_nomes[participante].toLocaleString('pt-BR')
    node.appendChild(li)
  }

  let sliced = Object.fromEntries(Object.entries(count_nomes).slice(0, 5))

  var layout = {
    title: "<b>Os 5 que mais falaram</b>",
    font: {
      family: 'Roboto, sans-serif'
    },
    showlegend: false,
    paper_bgcolor: "#dcf8c6",
    plot_bgcolor: "#dcf8c6",
  }

  var config = {
    responsive: true,
    displayModeBar: false
  }

  var data = [
    {
      x: Object.keys(sliced),
      y: Object.values(sliced),
      type: 'bar',
      marker: {
        color: '#25D366'
      }
    }
  ];
  Plotly.newPlot('myDiv', data, layout, config);
}

function count_string(trechos, participantes) {
  let count_final = {}
  for (let name of participantes) {
    let count_string = 0
    for (let trecho of trechos) {
      if (trecho[0] == '[') {
        trecho = trecho.substr(1)
        trecho = trecho.split(/((( )([01]\d|2[0-9])):([0-9]\d)):([0-9]\d)(] )/)
        if (Object.keys(trecho).length == 9) {
          let nome = trecho[8]
          let data = trecho[0].substr(-4, 4)
          if (data == new Date().getFullYear() - 1) {
            nome = nome.split(':')
            if (nome.length == 2) {
              let conteudo = nome[1].length
              nome = nome[0]
              let data = trecho[0].substr(-4, 4)
              if (data == new Date().getFullYear() - 1) {
                if (nome == name) {
                  count_string += conteudo
                }
              }
            }
          }
        }
      }
      else {
        trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
        if (Object.keys(trecho).length == 2) {
          let nome = trecho[1]
          nome = nome.split(':')
          if (nome.length == 2) {
            let conteudo = nome[1].length
            nome = nome[0]
            let data = trecho[0].substr(-5, 4)
            if (data == new Date().getFullYear() - 1) {
              if (nome == name) {
                count_string += conteudo
              }
            }
          }
        }
      }
    }
    count_final[name] = count_string
    // depois organizamos da maior para a menor
    count_final = Object.fromEntries(Object.entries(count_final).sort(([, a], [, b]) => b - a))
    // e criamos a lista no HMTL
    var child = node2.lastElementChild;
    while (child) {
      node2.removeChild(child);
      child = node2.lastElementChild;
    }
    for (let participante in count_final) {
      let p = document.createElement('li')
      p.innerHTML = participante + ": " + count_final[participante].toLocaleString('pt-BR')
      node2.appendChild(p)
    }

    var layout = {
      title: "<b>Participantes por % de caracteres enviados</b>",
      font: {
        family: 'Roboto, sans-serif'
      },
      showlegend: false,
      paper_bgcolor: "#dcf8c6",
    }


    var config = {
      responsive: true,
      staticPlot: true
    }

    var data = [
      {
        labels: Object.keys(count_final),
        parents: Array.apply("", Array(Object.keys(count_final).length)).map(function () { }),
        values: Object.values(count_final),
        type: 'treemap',
        textinfo: "label+value+percent",

      }
    ];
    Plotly.newPlot('myDiv2', data, layout, config);
  }
}


function count_emoji(trechos) {
  let count_emoji = []
  for (let trecho of trechos) {
    trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
    if (Object.keys(trecho).length == 2) {
      let conteudo = trecho[1]
      conteudo = conteudo.split(':')
      if (conteudo.length == 2) {
        conteudo = conteudo[1].split(' ')
        for (let palavra of Object.values(conteudo)) {
          let emoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
          var result = palavra.match(emoji)
          if (!!result) {
            count_emoji.push(result[0])
          }
        }
      }
    }
  }
  count_emoji = count_emoji.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});
  // depois organizamos da maior para a menor
  count_emoji = Object.fromEntries(Object.entries(count_emoji).sort(([, a], [, b]) => b - a))

}