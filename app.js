let node = document.getElementById('output');

var openFile = function(event) {
    var input = event.target;
  
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      var trechos = text.split('\n')
      var count = []
      for (let trecho of trechos ) {
        trecho = trecho.split(/(?:[01]\d|2[0123]):(?:[012345]\d) - /)
        if (Object.keys(trecho).length == 2) {
            let nome = trecho[1]
            nome = nome.split(':')
            if (nome.length == 2) {
                nome = nome[0]
                count.push(nome)
            }
        }
    }  
    count = count.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
    count = Object.fromEntries(Object.entries(count).sort(([,a],[,b]) => b-a))
    
    for (let participante in count) {
        let p = document.createElement('li')
        p.innerHTML = participante + ": " + count[participante]
        node.appendChild(p)
    }
    };
    reader.readAsText(input.files[0]);
  };
