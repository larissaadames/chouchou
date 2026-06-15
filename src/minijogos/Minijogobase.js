class MinijogoBase {
  constructor(manager, chouchou) {
    this.manager  = manager;
    this.chouchou = chouchou;
    
    // Máquina de estados: 'INICIO', 'A_JOGAR', 'GAMEOVER'
    this.estado = 'INICIO'; 
    this.pontuacao = 0;

    // Botão de sair padrão (canto superior esquerdo)
    this.btnSair = { x: 20, y: 20, w: 40, h: 40 };
  }

  // Métodos que a classe base controla (não precisas de lhes tocar nos minijogos)
  update() {
    if (this.estado === 'A_JOGAR') {
      this.atualizar(); // Chama a lógica do jogo específico
    }
  }

  draw() {
    push();
    if (this.estado === 'INICIO') {
      this._desenharEcraInicio();
    } 
    else if (this.estado === 'A_JOGAR') {
      this.desenhar(); // Chama os desenhos do jogo específico
      this._desenharUI();
    } 
    else if (this.estado === 'GAMEOVER') {
      this.desenhar(); // Mantém o jogo desenhado no fundo congelado
      this._desenharGameOver();
    }
    pop();
  }

  mousePressed() {
    // Verifica se clicou no botão de Sair
    if (mouseX > this.btnSair.x && mouseX < this.btnSair.x + this.btnSair.w &&
        mouseY > this.btnSair.y && mouseY < this.btnSair.y + this.btnSair.h) {
      this.sairDoJogo();
      return;
    }

    if (this.estado === 'INICIO') {
      this.pontuacao = 0;
      this.estado = 'A_JOGAR';
      this.iniciar(); // Prepara o jogo específico
    } 
    else if (this.estado === 'A_JOGAR') {
      this.clicar(); // Passa o clique para o jogo
    } 
    else if (this.estado === 'GAMEOVER') {
      // Clica para recomeçar
      this.estado = 'INICIO';
    }
  }

  // --- Funções de Ajuda ---
  darGameOver() {
    this.estado = 'GAMEOVER';
    // Aqui podes converter a pontuação em moedas e alegria
    let recompensa = Math.floor(this.pontuacao / 10);
    this.chouchou._alterarStat('humor', 20);
    // this.chouchou.adicionarMoedas(recompensa); // Futuramente
  }

  sairDoJogo() {
    // Quando tiveres o SceneManager pronto, voltas para a sala de jogos
    // this.manager.irPara('comodos'); 
    manager.irPara('comodos'); // Volta aos cómodos sem precisar de importar nada
    console.log("A sair do minijogo...");
  }

  // --- Ecrãs da UI Padrão ---
  _desenharEcraInicio() {
    background('#0f172a');
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(BOLD);
    text("Clica para Começar", width / 2, height / 2);
    this._desenharBtnSair();
  }

  _desenharUI() {
    fill(255);
    textAlign(RIGHT, TOP);
    textSize(24);
    textStyle(BOLD);
    text("Pontos: " + this.pontuacao, width - 20, 20);
    this._desenharBtnSair();
  }

  _desenharGameOver() {
    fill(0, 0, 0, 150); // Fundo escurecido
    rect(0, 0, width, height);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(20);
    text("Pontuação Final: " + this.pontuacao, width / 2, height / 2 + 10);
    textSize(16);
    text("Clica para tentar novamente", width / 2, height / 2 + 50);
    this._desenharBtnSair();
  }

  _desenharBtnSair() {
    fill('#ef4444');
    rect(this.btnSair.x, this.btnSair.y, this.btnSair.w, this.btnSair.h, 8);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text("<", this.btnSair.x + this.btnSair.w/2, this.btnSair.y + this.btnSair.h/2);
  }

  // --- MÉTODOS A SEREM SUBSTITUÍDOS PELOS JOGOS FILHOS ---
  iniciar() {}
  atualizar() {}
  desenhar() {}
  clicar() {}
}