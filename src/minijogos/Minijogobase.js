class MinijogoBase {
  constructor(manager, chouchou) {
    this.chouchou = chouchou;
    
    // Estados possíveis: 'INICIO', 'A_JOGAR', 'PAUSADO', 'GAMEOVER'
    this.estado = 'INICIO'; 
    this.pontuacao = 0;

    // Botão fixo no canto superior esquerdo (Serve como "Sair" ou "Pausar" dependendo do estado)
    this.btnTopoEsq = { x: 20, y: 20, w: 40, h: 40 };
    
    // Botões do Menu de Pausa (Calculados no centro do ecrã)
    let meioX = width / 2;
    let meioY = height / 2;
    this.btnContinuar = { x: meioX - 100, y: meioY - 30, w: 200, h: 50 };
    this.btnSairPausa = { x: meioX - 100, y: meioY + 40, w: 200, h: 50 };
  }

  // ── LÓGICA PRINCIPAL ────────────────────────────────────────────────────────
  update() {
    // A física do jogo (atualizar) SÓ roda se o estado for 'A_JOGAR'.
    // Portanto, quando está 'PAUSADO', o jogo congela magicamente!
    if (this.estado === 'A_JOGAR') {
      this.atualizar(); 
    }
  }

  draw() {
    push();
    if (this.estado === 'INICIO') {
      this._desenharEcraInicio();
    } 
    else if (this.estado === 'A_JOGAR') {
      this.desenhar(); // Visual do minijogo
      this._desenharUI(false); // false = mostra botão de pausa '||'
    } 
    else if (this.estado === 'PAUSADO') {
      this.desenhar(); // Continua a desenhar o jogo congelado no fundo
      this._desenharUI(false); 
      this._desenharEcraPausa(); // Desenha a tela preta por cima
    }
    else if (this.estado === 'GAMEOVER') {
      this.desenhar(); 
      this._desenharGameOver();
    }
    pop();
  }

  // ── CLIQUES DO RATO ─────────────────────────────────────────────────────────
  mousePressed() {
    // Função auxiliar para verificar se clicou num botão específico
    const clicouNoBotao = (btn) => {
      return mouseX > btn.x && mouseX < btn.x + btn.w &&
             mouseY > btn.y && mouseY < btn.y + btn.h;
    };

    if (this.estado === 'INICIO') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.sairDoJogo(); // Voltar aos cómodos
        return;
      }
      // Se não clicou em sair, clica para começar
      this.pontuacao = 0;
      this.estado = 'A_JOGAR';
      this.iniciar();
    } 
    else if (this.estado === 'A_JOGAR') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.estado = 'PAUSADO'; // PAUSA O JOGO
        return;
      }
      this.clicar(); // Repassa o clique para pular, atirar, etc.
    } 
    else if (this.estado === 'PAUSADO') {
      if (clicouNoBotao(this.btnContinuar)) {
        this.estado = 'A_JOGAR'; // DESPAUSA O JOGO
        return;
      }
      if (clicouNoBotao(this.btnSairPausa)) {
        this.sairDoJogo(); // ABANDONA A PARTIDA
        return;
      }
    }
    else if (this.estado === 'GAMEOVER') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.sairDoJogo();
        return;
      }
      // Tentar de novo
      this.estado = 'INICIO';
    }
  }

  // ── AÇÕES GLOBAIS ───────────────────────────────────────────────────────────
  darGameOver() {
    this.estado = 'GAMEOVER';
    let recompensa = Math.floor(this.pontuacao / 10);
    this.chouchou._alterarStat('humor', 20); // Deixa o bicho feliz por ter jogado
  }

  sairDoJogo() {
    // Usa a variável global sceneManager para voltar ao ecrã dos cómodos
    sceneManager.irPara('comodos'); 
  }

  // ── DESENHOS DA INTERFACE (UI) ──────────────────────────────────────────────
  _desenharEcraInicio() {
    background('#0f172a');
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(NORMAL);
    text("Clica para Começar", width / 2, height / 2);
    this._desenharBtnTopo(true); // true = Ícone de Sair (<)
  }

  _desenharUI(isGameOver) {
    fill(255);
    textAlign(RIGHT, TOP);
    textSize(24);
    textStyle(NORMAL);
    text("Pontos: " + this.pontuacao, width - 20, 20);
    this._desenharBtnTopo(isGameOver); 
  }

  _desenharGameOver() {
    fill(0, 0, 0, 160); // Escurece o jogo no fundo
    rect(0, 0, width, height);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(NORMAL);
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(20);
    text("Pontuação Final: " + this.pontuacao, width / 2, height / 2 + 10);
    textSize(16);
    text("Clica para tentar novamente", width / 2, height / 2 + 50);
    this._desenharBtnTopo(true); // Mostra Ícone de Sair (<)
  }

  _desenharEcraPausa() {
    fill(0, 0, 0, 180); // Fundo escuro cobrindo tudo
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(NORMAL);
    text("PAUSADO", width / 2, height / 2 - 100);

    // Botão Continuar
    let bc = this.btnContinuar;
    fill('#3b82f6');
    rect(bc.x, bc.y, bc.w, bc.h, 12);
    fill(255);
    textSize(20);
    text("Continuar", bc.x + bc.w/2, bc.y + bc.h/2);

    // Botão Sair
    let bs = this.btnSairPausa;
    fill('#ef4444');
    rect(bs.x, bs.y, bs.w, bs.h, 12);
    fill(255);
    text("Sair do Jogo", bs.x + bs.w/2, bs.y + bs.h/2);
  }

  _desenharBtnTopo(isSair) {
    let b = this.btnTopoEsq;
    fill(isSair ? '#ef4444' : '#334155');
    rect(b.x, b.y, b.w, b.h, 8);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(isSair ? 20 : 16);
    textStyle(NORMAL);
    
    // Se for ecrã de sair (GameOver/Inicio) desenha uma Seta "<"
    // Se for durante o jogo, desenha um símbolo de pausa "||"
    text(isSair ? "<" : "||", b.x + b.w/2, b.y + b.h/2);
  }

  // ── MÉTODOS A SEREM SUBSTITUÍDOS PELOS JOGOS (HERANÇA) ────────────────────
  iniciar() {}
  atualizar() {}
  desenhar() {}
  clicar() {}
}