let node = document.getElementById('output');
let count_nomes = []
let count_unique_names = new Set()
let count_final = {}

var openFile = function (event) {
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
    count_occurrences(trechos)
    count_string(trechos, count_unique_names)
  };
  reader.readAsText(input.files[0]);
};

function count_occurrences(trechos) {
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
  for (let participante in count_nomes) {
    let p = document.createElement('li')
    p.innerHTML = participante + ": " + count_nomes[participante]
    node.appendChild(p)
  }
}

function count_string(trechos, participantes){
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

  var data = [
    {
      x: Object.keys(count_final),
      y: Object.values(count_final),
      type: 'bar'
    }
  ];
  
  Plotly.newPlot('myDiv', data);
}



