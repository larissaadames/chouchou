class MinijogoBase {
  constructor(manager, chouchou) {
    this.chouchou = chouchou;
    
    this.estado = 'INICIO'; 
    this.pontuacao = 0;

    this.btnTopoEsq = { x: 20, y: 20, w: 40, h: 40 };
    
    let meioX = width / 2;
    let meioY = height / 2;
    this.btnContinuar = { x: meioX - 100, y: meioY - 30, w: 200, h: 50 };
    this.btnSairPausa = { x: meioX - 100, y: meioY + 40, w: 200, h: 50 };

    this.recompensas = null; 
  }

  // ── CICLO DE VIDA (Chamado automaticamente pelo SceneManager) ──
  aoEntrar() {
    this.estado = 'INICIO';
    this.pontuacao = 0;
    this.recompensas = null;
  }

  // Ganchos customizáveis para os efeitos sonoros das subclasses
  aoPausar() {}
  aoRetomar() {}

  update() {
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
      this.desenhar(); 
      this._desenharUI(false); 
    } 
    else if (this.estado === 'PAUSADO') {
      this.desenhar(); 
      this._desenharUI(false); 
      this._desenharEcraPausa(); 
    }
    else if (this.estado === 'GAMEOVER') {
      this.desenhar(); 
      this._desenharGameOver();
    }
    pop();
  }

  mousePressed() {
    const clicouNoBotao = (btn) => {
      return mouseX > btn.x && mouseX < btn.x + btn.w &&
             mouseY > btn.y && mouseY < btn.y + btn.h;
    };

    if (this.estado === 'INICIO') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.sairDoJogo(); 
        return;
      }
      this.pontuacao = 0;
      this.recompensas = null;
      this.estado = 'A_JOGAR';
      this.iniciar();
    } 
    else if (this.estado === 'A_JOGAR') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.estado = 'PAUSADO'; 
        this.aoPausar(); // <--- CORREÇÃO: Avisa o minijogo para pausar a música
        return;
      }
      this.clicar(); 
    } 
    else if (this.estado === 'PAUSADO') {
      if (clicouNoBotao(this.btnContinuar)) {
        this.estado = 'A_JOGAR'; 
        this.aoRetomar(); // <--- CORREÇÃO: Avisa o minijogo para continuar a música
        return;
      }
      if (clicouNoBotao(this.btnSairPausa)) {
        this.sairDoJogo(); 
        return;
      }
    }
    else if (this.estado === 'GAMEOVER') {
      if (clicouNoBotao(this.btnTopoEsq)) {
        this.sairDoJogo();
        return;
      }
      this.estado = 'INICIO';
    }
  }

  darGameOver() {
    this.estado = 'GAMEOVER';

    let multiplicador = Math.floor(this.pontuacao / 20);

    let ganhoHumor = 10 + multiplicador;
    let perdaFome = -(5 + multiplicador);
    let perdaHidratacao = -(5 + Math.floor(multiplicador * 1.5));
    let perdaEnergia = -(10 + (multiplicador * 2));

    this.chouchou._alterarStat('humor', ganhoHumor);
    this.chouchou._alterarStat('fome', perdaFome);
    this.chouchou._alterarStat('hidratação', perdaHidratacao);
    this.chouchou._alterarStat('energia', perdaEnergia);

    if (this.chouchou.moedas === undefined) this.chouchou.moedas = 0;
    let moedasGanhas = Math.floor(this.pontuacao / 5); 
    this.chouchou.moedas += moedasGanhas;

    if (this.chouchou.inventario === undefined) {
      this.chouchou.inventario = { nitrogenio: 3, fosforo: 3, potassio: 3, calcio: 3, magnesio: 3, enxofre: 3 };
    }

    let itensGanhos = [];
    let qtdElementosGanhos = Math.floor(this.pontuacao / 100);

    if (qtdElementosGanhos > 0) {
      let chavesCatalogo = Object.keys(CATALOGO_COMIDAS);

      for (let i = 0; i < qtdElementosGanhos; i++) {
        let idSorteado = random(chavesCatalogo);
        
        this.chouchou.inventario[idSorteado] += 1;
        
        let itemExistente = itensGanhos.find(item => item.def.id === idSorteado);
        if (itemExistente) {
          itemExistente.qtd += 1;
        } else {
          itensGanhos.push({ def: CATALOGO_COMIDAS[idSorteado], qtd: 1 });
        }
      }
    }

    this.recompensas = { 
      moedas: moedasGanhas, 
      itens: itensGanhos,
      humor: ganhoHumor,
      fome: perdaFome,
      hidratacao: perdaHidratacao,
      energia: perdaEnergia
    };
  }

  sairDoJogo() {
    sceneManager.irPara('comodos'); 
  }

  _desenharEcraInicio() {
    background('#0f172a');
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(NORMAL);
    text("Clica para Começar", width / 2, height / 2);
    this._desenharBtnTopo(true); 
  }

  _desenharUI(isGameOver) {
    fill(255);
    textAlign(RIGHT, TOP);
    textSize(24);
    textStyle(NORMAL);
    text("Pontuação: " + this.pontuacao, width - 20, 20);
    this._desenharBtnTopo(isGameOver); 
  }

  _desenharGameOver() {
    fill(0, 0, 0, 180); 
    rect(0, 0, width, height);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("GAME OVER", width / 2, 80); 
    
    textSize(20);
    textStyle(NORMAL);
    text("Pontuação: " + this.pontuacao, width / 2, 120);

    if (this.recompensas) {
      let qtdItens = this.recompensas.itens.length;
      let alturaCaixa = 160 + (qtdItens > 0 ? qtdItens * 28 : 28); 
      
      fill(255, 255, 255, 20);
      rectMode(CENTER);
      rect(width / 2, height / 2 + 10, 480, alturaCaixa, 16);
      rectMode(CORNER);

      let topoCaixa = (height / 2 + 10) - (alturaCaixa / 2);

      fill(255);
      textSize(18);
      textStyle(BOLD);
      text("RECOMPENSAS:", width / 2, topoCaixa + 25);

      textStyle(NORMAL);
      textSize(16);
      
      fill('#facc15');
      text(`+${this.recompensas.moedas} Moedas`, width / 2, topoCaixa + 55);

      let yItem = topoCaixa + 85;
      if (this.recompensas.itens.length > 0) {
        for (let item of this.recompensas.itens) {
          fill(item.def.cor);
          text(`+ ${item.qtd} ${item.def.nome} (${item.def.simbolo})`, width / 2, yItem);
          yItem += 28;
        }
      } else {
        fill(150);
        text("(Faz 100 pontos para ganhar uma comida!)", width / 2, yItem);
        yItem += 28;
      }

      fill(255, 180);
      textSize(13);
      text(`Humor +${this.recompensas.humor}  |  Energia ${this.recompensas.energia}  |  Hidratação ${this.recompensas.hidratacao}  |  Fome ${this.recompensas.fome}`, width / 2, topoCaixa + alturaCaixa - 25);
    }

    fill(255);
    textSize(16);
    textStyle(NORMAL);
    text("Clica na tela para tentar de novo", width / 2, height - 60);
    
    this._desenharBtnTopo(true); 
  }

  _desenharEcraPausa() {
    fill(0, 0, 0, 180); 
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(NORMAL);
    text("PAUSADO", width / 2, height / 2 - 100);

    let bc = this.btnContinuar;
    fill('#3b82f6');
    rect(bc.x, bc.y, bc.w, bc.h, 12);
    fill(255);
    textSize(20);
    text("Continuar", bc.x + bc.w/2, bc.y + bc.h/2);

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
    text(isSair ? "<" : "||", b.x + b.w/2, b.y + b.h/2);
  }

  iniciar() {}
  atualizar() {}
  desenhar() {}
  clicar() {}
}