// 1 - Função que cria um novo elemento, recebendo como parametro sua tag e uma class a ser adicionada.

function novoElemento(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

//Função construtora de cada barreira como individuo.
//Caso receba o parametro como true, a barreira criada será em ordem invertida.
function Barreira(reversa = false) {
  //Faz a chamada da função 1 criando um wrapper que envolverá a borda e o corpo.
  this.elemento = novoElemento('div', 'barreira');
  //Faz a chamada da função 1 e cria a borda e o corpo da barreira.
  const borda = novoElemento('div', 'borda');
  const corpo = novoElemento('div', 'corpo');
  //Adiciona ao wrapper o corpo e borda, caso o parametro recebido seja false.
  //Barreira superior
  this.elemento.appendChild(reversa ? corpo : borda);
  //Barreira inferior
  this.elemento.appendChild(reversa ? borda : corpo);
  //Seta a altura do corpo da barreira.
  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

function ParDeBarreiras(altura, abertura, x) {
  this.elemento = novoElemento('div', 'par-de-barreiras');
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);
  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
  this.setX = (x) => (this.elemento.style.left = `${x}px`);
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

// const b = new ParDeBarreiras(700, 200, 400);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

function Barreiras(altura, largura, abertura, espaço, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaço),
    new ParDeBarreiras(altura, abertura, largura + espaço * 2),
    new ParDeBarreiras(altura, abertura, largura + espaço * 3),
  ];

  const deslocamento = 3;
  this.animar = () => {
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);

      //quando o elemento sair da área do jogo

      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaço * this.pares.length);
        par.sortearAbertura();
      }

      const meio = largura / 2;
      const cruzouOMeio =
        par.getX() + deslocamento >= meio && par.getX() < meio;

      cruzouOMeio && notificarPonto();
    });
  };
}

const barreiras = new Barreiras(700, 1200, 200, 400);
const areaDoJogo = document.querySelector('[wm-flappy]');
barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));
setInterval(() => {
  barreiras.animar();
}, 20);
