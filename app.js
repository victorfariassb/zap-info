let node = document.getElementById('output');
let count_unique_names = new Set()
let ol = document.querySelector("ol")
let ultima_msg = document.querySelector(".ultima-msg")

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
    let primeira_msg = trechos[0].split(/ (?:[01]\d|2[0123]):(?:[012345]\d) - /)[0]
    ultima_msg.innerHTML = "A mensagem mais antiga é de: " + primeira_msg
    count_occurrences(trechos)
    count_string(trechos, count_unique_names)
  };
  reader.readAsText(input.files[0]);
};

function count_occurrences(trechos) {
  let count_nomes = []
  for (let trecho of trechos) {
    // separamos depois da hora e de ' - '  
    trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
    if (Object.keys(trecho).length == 2) {
      // escolhemos como nome a segunda parte da msg, mas ainda falta tirar todo o conteúdo da msg
      let nome = trecho[1]
      // por isso, separamos novamente, mas agora pelo :
      nome = nome.split(':')
      if (nome.length == 2) {
        nome = nome[0]
        count_nomes.push(nome)
        count_unique_names.add(nome)
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
  var child = ol.lastElementChild; 
  while (child) {
    ol.removeChild(child);
    child = ol.lastElementChild;}
  for (let participante in count_nomes) {
    let p = document.createElement('li')
    p.innerHTML = participante + ": " + count_nomes[participante]
    node.appendChild(p)
  }
}

function count_string(trechos, participantes){
  let count_final = {}
  for (let name of participantes) {
    let count_string = 0
    for (let trecho of trechos) {
      trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
      if (Object.keys(trecho).length == 2) {
        let nome = trecho[1]
        nome = nome.split(':')
        if (nome.length == 2) {
          let conteudo = nome[1].length
          nome = nome[0]
          if (nome == name) {
            count_string += conteudo
          }
        }
      }
    }
    count_final[name] = count_string
  }

  var layout = {
    title: "Nº de caracteres digitados por integrante",
    showlegend: false,
  }
  
  var config = {responsive: true}

  var data = [
    {
      labels: Object.keys(count_final),
      values: Object.values(count_final),
      type: 'pie'
    }
  ];
    Plotly.newPlot('myDiv', data, layout, config);
}



