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

//Função construtora do par de barreiras
//Recebe como parametros a altura da screen, abertura entre a barreira superior e inferior, posição inicial da barreira
function ParDeBarreiras(altura, abertura, x) {
  //Cria um novo elemento usando a função 1
  //Esse elemento irá envolver ambas as barreiras.
  this.elemento = novoElemento('div', 'par-de-barreiras');
  //Cria a barreira superior e inferior.
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);
  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);
  //Método que calcula a altura das barreiras aleatóriamente
  //A altura da screen do jogo está setada para 700px
  //Então informamos a altura do jogo, e quanto queremos de abertura.
  this.sortearAbertura = () => {
    //Desconta da altura do jogo a abertura e multiplica por um aleatório
    //A altura será entre 0 e 500
    const alturaSuperior = Math.random() * (altura - abertura);
    //Altura superior ja foi calculada, então tiramos da altura jogo a abertura e altura superior.
    //O que sobra é para a altura inferior.
    const alturaInferior = altura - abertura - alturaSuperior;
    // Seta a altura em cada barreira.
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  //Pega a posição atual do par de barreiras.
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
  //Seta uma nova posição para o par de barreiras.
  this.setX = (x) => (this.elemento.style.left = `${x}px`);
  //Pega a largura total do par de barreiras.
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

//Função construtora que controla as barreiras.
//Recebe como parametros a altura da screen, a abertura entre as barreiras, a largura da screen, o espaço entre as barreiras, e uma função para notificar os pontos.
function Barreiras(altura, largura, abertura, espaço, notificarPonto) {
  //Cria todos os pares de barreiras dentro de um array.
  this.pares = [
    //A função ParDeBarreiras recebe como argumento, a altura da tela, a abertura entre as barreiras e a posição inicial da barreira.
    //A posição inicial de cada barreira se dará pela largura da tela * o espaçamento entre as barreiras.
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaço),
    new ParDeBarreiras(altura, abertura, largura + espaço * 2),
    new ParDeBarreiras(altura, abertura, largura + espaço * 3),
  ];

  const deslocamento = 3;
  //Função que anima o deslocamento das barreiras
  this.animar = () => {
    //para cada de barreira seta a posição de x dele como a posição atual menos o deslocamento.
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);

      //quando o elemento sair da área do jogo
      //Verifica se a posição atual do elemento é menor que a largura negativa do elemento.
      //Caso seja, significa que o elemento saiu da tela.
      if (par.getX() < -par.getLargura()) {
        //Seta a nova posição do par de barreiras multiplicando o espaço entre as barreiras pela quantidade delas.
        //Assim as barreiras serão posicionadas no fim da fila.
        par.setX(par.getX() + espaço * this.pares.length);
        //Sorteira uma nova abertura para esse par.
        par.sortearAbertura();
      }

      //meio da screen
      const meio = largura / 2;
      //Quando cruzar a barreira cruzar o meio da tela, chamamos a função notificarPonto
      const cruzouOMeio =
        par.getX() + deslocamento >= meio && par.getX() < meio;

      cruzouOMeio && notificarPonto();
    });
  };
}

//Função de criação e animação do passaro.
function Passaro(alturaJogo) {
  let voando = false;
  //Cria o passaro
  this.elemento = novoElemento('img', 'passaro');
  //Seta a src do passaro
  this.elemento.src = 'imgs/dragon2.gif';

  //Pega a posição no eixo y do elemento passaro
  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
  //Seta a posição no eixo y do elemento passaro
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);
  //Adicionando o evento na janela
  window.onkeydown = (e) => {
    voando = true;
  };
  window.onkeyup = (e) => {
    voando = false;
  };
  window.addEventListener('mousedown', (e) => {
    voando = true;
  });
  window.addEventListener('mouseup', (e) => {
    voando = false;
  });

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5);
    const alturaMaxima = alturaJogo - this.elemento.clientHeight;

    if (novoY <= 0) {
      this.setY(0);
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };

  this.setY(alturaJogo / 2);
}

function Progresso() {
  this.elemento = novoElemento('span', 'progresso');
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
  this.resetButton = novoElemento('button', 'reset');
  this.resetButton.innerHTML = 'Restart ?';
  this.resetButton.addEventListener('click', initGame);
}

function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();
  //Caso a borda direita do elemento A esteja após tenha ultrapassado a borda esqueda do elemento b && a borda direita do elemento b tenha ultrapassado a borda esquerda do elemento a.
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
  let colidiu = false;

  barreiras.pares.forEach((parDeBarreiras) => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento;
      const inferior = parDeBarreiras.inferior.elemento;
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior);
    }
  });
  return colidiu;
}

function changeColors(areaDoJogo) {
  let cenario = 1;
  areaDoJogo.style.backgroundImage = `url(../imgs/cen${cenario}.jpeg)`;
  setInterval(() => {
    if (cenario < 6) {
      cenario++;
      areaDoJogo.style.backgroundImage = `url(../imgs/cen${cenario}.jpeg)`;
    } else {
      cenario = 1;
      areaDoJogo.style.backgroundImage = `url(../imgs/cen${cenario}.jpeg)`;
    }
  }, 20000);
}

function FlappyBird() {
  let pontos = 0;
  const areaDoJogo = document.querySelector('[wm-flappy]');
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;
  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 300, 400, () =>
    progresso.atualizarPontos(++pontos)
  );
  const passaro = new Passaro(altura);

  areaDoJogo.appendChild(passaro.elemento);
  barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));
  areaDoJogo.appendChild(progresso.elemento);

  changeColors(areaDoJogo);

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();
      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador);
        areaDoJogo.appendChild(progresso.resetButton);
      }
    }, 20);
  };
}

function initGame() {
  const areaDoJogo = document.querySelector('[wm-flappy]');
  areaDoJogo.innerHTML = '';
  new FlappyBird().start();
}
// new FlappyBird().start();
