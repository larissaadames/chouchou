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

    this.recompensas = null; // Guardará o que o jogador ganhou na partida
  }

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
        return;
      }
      this.clicar(); 
    } 
    else if (this.estado === 'PAUSADO') {
      if (clicouNoBotao(this.btnContinuar)) {
        this.estado = 'A_JOGAR'; 
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

  // ── SISTEMA DE RECOMPENSAS ──────────────────────────────────────────────────
  darGameOver() {
    this.estado = 'GAMEOVER';
    this.chouchou._alterarStat('humor', 20); 

    // 1. Garante que o Chouchou tem uma carteira e inventário global
    if (this.chouchou.moedas === undefined) this.chouchou.moedas = 0;
    if (this.chouchou.inventario === undefined) {
      // Inventário inicial (quantidade de cada elemento)
      this.chouchou.inventario = { nitrogenio: 3, fosforo: 3, potassio: 3, calcio: 3, magnesio: 3, enxofre: 3 };
    }

    // 2. Calcula as recompensas
    let moedasGanhas = Math.floor(this.pontuacao / 5); 
    this.chouchou.moedas += moedasGanhas;

    let itensGanhos = [];
    
    // Só ganha itens se tiver feito mais de 20 pontos, para incentivar a jogar bem!
    if (this.pontuacao >= 20) {
      let qtdTiposSorteados = Math.floor(random(1, 4)); // Ganha de 1 a 3 TIPOS de itens diferentes
      let chavesCatalogo = Object.keys(CATALOGO_COMIDAS);

      for (let i = 0; i < qtdTiposSorteados; i++) {
        let idSorteado = random(chavesCatalogo);
        let qtdSorteada = Math.floor(random(1, 4)); // Ganha de 1 a 3 UNIDADES de cada tipo
        
        // Adiciona ao inventário global do bicho
        this.chouchou.inventario[idSorteado] += qtdSorteada;
        
        // Guarda para mostrar na tela
        itensGanhos.push({ def: CATALOGO_COMIDAS[idSorteado], qtd: qtdSorteada });
      }
    }

    this.recompensas = { moedas: moedasGanhas, itens: itensGanhos };
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
    text("Pontos: " + this.pontuacao, width - 20, 20);
    this._desenharBtnTopo(isGameOver); 
  }

  // ── TELA DE GAME OVER E RECIBO DE RECOMPENSAS ──────────────────────────────
  _desenharGameOver() {
    fill(0, 0, 0, 180); 
    rect(0, 0, width, height);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("GAME OVER", width / 2, height / 2 - 140);
    
    textSize(20);
    textStyle(NORMAL);
    text("Pontuação: " + this.pontuacao, width / 2, height / 2 - 100);

    // -- CAIXA DE RECOMPENSAS --
    if (this.recompensas) {
      fill(255, 255, 255, 20);
      rectMode(CENTER);
      rect(width / 2, height / 2 + 20, 320, 180, 16);
      rectMode(CORNER);

      fill(255);
      textSize(18);
      textStyle(BOLD);
      text("RECOMPENSAS:", width / 2, height / 2 - 40);

      textStyle(NORMAL);
      textSize(16);
      
      // Moedas
      fill('#facc15');
      text(`💰 +${this.recompensas.moedas} Moedas`, width / 2, height / 2 - 5);

      // Itens Sorteados
      let yItem = height / 2 + 25;
      if (this.recompensas.itens.length > 0) {
        for (let item of this.recompensas.itens) {
          fill(item.def.cor);
          text(`+ ${item.qtd} ${item.def.nome} (${item.def.simbolo})`, width / 2, yItem);
          yItem += 25;
        }
      } else {
        fill(150);
        text("(Faz mais pontos para ganhar comidas!)", width / 2, yItem + 10);
      }
    }

    fill(255);
    textSize(16);
    textStyle(NORMAL);
    text("Clica na tela para tentar de novo", width / 2, height / 2 + 140);
    
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