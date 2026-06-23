class PopupMinijogos {
  constructor(chouchou) {
    this.chouchou = chouchou;
    this.aberto = false;
    this.btnFechar = { x: 0, y: 0, w: 40, h: 40 };

    this.scrollOffset = 0;
    this.arrastandoScroll = false;
    this.mouseAntigoScrollY = 0;
    this.jogoPressionado = null; 
    this.arrastou = false; 

    this.mensagemErro = "";
    this.tempoErro = 0;

    this.jogos = [
      { id: 'minigame_comida', nome: 'Food Drop',  imagem: SPRITES_PREVIEWS.jogocomida, x: 0, y: 0 },
      { id: 'minigame_queda',   nome: 'Queda Livre',imagem: SPRITES_PREVIEWS.jogoqueda, x: 0, y: 0 },
      //{ id: 'minigame_memoria', nome: 'Memória',    imagem: null, x: 0, y: 0 },
      //{ id: 'minigame_3',       nome: 'Corrida',    imagem: null, x: 0, y: 0 },
      //{ id: 'minigame_4',       nome: 'Batalha',    imagem: null, x: 0, y: 0 },
      //{ id: 'minigame_5',       nome: 'Pescaria',   imagem: null, x: 0, y: 0 }
    ];
  }

  update() {
    if (this.tempoErro > 0) {
      this.tempoErro--;
      
      // removemos o aviso imediatamente da tela sem esperar o timer zerar.
      if (this.chouchou.podeJogar().apto) {
        this.tempoErro = 0;
        this.mensagemErro = "";
      }
    }

    if (this.arrastandoScroll) {
      let deltaY = mouseY - this.mouseAntigoScrollY;
      if (Math.abs(deltaY) > 3) {
        this.arrastou = true;
        this.jogoPressionado = null;
      }
      this.scrollOffset += deltaY;
      this.mouseAntigoScrollY = mouseY;
      if (this.scrollOffset > 0) this.scrollOffset = 0;
    }
  }

  draw() {
    if (!this.aberto) return;

    push();
    // Fundo escurecido mais suave e confortável
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // Ajuste Geral de Margens externas da UI
    let margem = 45;
    let popW = width - margem * 2;
    let popH = height - margem * 2;
    let popX = margem;
    let popY = margem;

    // Fundo do Menu Principal
    fill('#8293bd');
    stroke('#3b82f6');
    strokeWeight(4);
    rect(popX, popY, popW, popH, 24); // Cantos mais arredondados e orgânicos
    noStroke();

    // Título Superior
    fill(255);
    textAlign(CENTER, TOP);
    textSize(24);
    textStyle(BOLD);
    text("MINIJOGOS", width / 2, popY + 30);

    // Botão Fechar 'X'
    this.btnFechar.x = popX + popW - 55;
    this.btnFechar.y = popY + 20;
    fill('#ef4444');
    rect(this.btnFechar.x, this.btnFechar.y, this.btnFechar.w, this.btnFechar.h, 12);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("X", this.btnFechar.x + this.btnFechar.w / 2, this.btnFechar.y + this.btnFechar.h / 2);

    // Área de Máscara/Corte (Clipping)
    let clipY = popY + 85;
    let clipH = popH - 115;
    
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(popX + 4, clipY, popW - 8, clipH);
    drawingContext.clip();

    // --- GRID CONFIGURATION (Aumentado o Espaçamento/Gap) ---
    let espaco = 24; // Aumentado para dar mais respiro entre os cards
    let colunas = 2; 
    
    // Calcula largura exata considerando os gaps laterais e centrais confortavelmente
    let larguraCard = (popW - (espaco * 3)) / 2;
    
    // MATEMÁTICA DA PARCELA VISÍVEL:
    // Fazemos a altura do card baseada no tamanho vertical da tela disponível, garantindo
    // que 2 linhas caibam inteiras e um pedaço da 3ª apareça no fundo da caixa de corte.
    let alturaCard = (clipH - (espaco * 2.4)) / 2; 

    let margemEsquerdaGrid = popX + espaco; 
    let maxLinhas = 0;

    for (let i = 0; i < this.jogos.length; i++) {
      let jogo = this.jogos[i];
      
      jogo.w = larguraCard;
      jogo.h = alturaCard;

      let col = i % colunas;
      let row = Math.floor(i / colunas);
      maxLinhas = Math.max(maxLinhas, row + 1);

      jogo.x = margemEsquerdaGrid + col * (jogo.w + espaco);
      jogo.y = clipY + 15 + row * (jogo.h + espaco) + this.scrollOffset;

      // Fundo do Card com feedback visual sutil
      fill(this.jogoPressionado === jogo ? '#43597c' : '#4a6083');
      stroke(this.jogoPressionado === jogo ? '#e6e6e6' : '#070707');
      strokeWeight(2);
      rect(jogo.x, jogo.y, jogo.w, jogo.h, 18);
      noStroke();

      // Mini-container interno para guardar a Imagem de demonstração
      let margemImg = 12;
      let textHeight = 45; // Espaço do rodapé
      let imgH = jogo.h - textHeight - margemImg * 2; 
      
      fill('#0f172a');
      rect(jogo.x + margemImg, jogo.y + margemImg, jogo.w - margemImg * 2, imgH, 12);
      
      if (jogo.imagem) {
        imageMode(CORNER);
        image(jogo.imagem, jogo.x + margemImg, jogo.y + margemImg, jogo.w - margemImg * 2, imgH);
      } else {
        fill(255, 60);
        textAlign(CENTER, CENTER);
        textSize(13);
        textStyle(NORMAL);
        text("Preview", jogo.x + jogo.w / 2, jogo.y + margemImg + imgH / 2);
      }

      // Rodapé de Texto do Card (Com uma leve caixinha de fundo para organização)
      fill('#27272a');
      rect(jogo.x + margemImg, jogo.y + jogo.h - 40, jogo.w - margemImg * 2, 28, 8);

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(14);
      textStyle(BOLD);
      text(jogo.nome, jogo.x + jogo.w / 2, jogo.y + jogo.h - 26);
      
      if (this.tempoErro > 0) {
        push();
        // Fundo vermelho de alerta, desenhado por cima de tudo
        fill(239, 68, 68, 220); 
        noStroke();
        rectMode(CENTER);
        rect(width / 2, height / 2, 280, 50, 16);
        
        // Texto branco
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        textStyle(BOLD);
        text(this.mensagemErro, width / 2, height / 2);
        pop();
        }

    }

    drawingContext.restore(); // Desativa janela de clipping

    //
    // --- LIMITADOR DE SCROLL ---
    let alturaTotalGrid = maxLinhas * (alturaCard + espaco) + 40;
    let minScroll = clipH - alturaTotalGrid;
    
    if (minScroll > 0) minScroll = 0; 
    if (this.scrollOffset < minScroll) this.scrollOffset = minScroll; 

    // Scrollbar lateral elegante e polida
    if (minScroll < 0) {
      let proporcaoTela = clipH / alturaTotalGrid;
      let tamanhoBarra = clipH * proporcaoTela;
      let posicaoBarra = map(this.scrollOffset, 0, minScroll, clipY + 5, clipY + clipH - tamanhoBarra - 5);
      fill(255, 255, 255, 40);
      rect(popX + popW - 12, posicaoBarra, 5, tamanhoBarra, 10);
    }
    pop();
  }

  mousePressed() {
    if (mouseX > this.btnFechar.x && mouseX < this.btnFechar.x + this.btnFechar.w &&
        mouseY > this.btnFechar.y && mouseY < this.btnFechar.y + this.btnFechar.h) {
      this.aberto = false;
      
      this.tempoErro = 0;
      this.mensagemErro = "";
      return;
    }

    let clipY = 45 + 85;
    let clipH = (height - 90) - 115;
    
    if (mouseY > clipY && mouseY < clipY + clipH) {
      for (let jogo of this.jogos) {
        if (mouseX > jogo.x && mouseX < jogo.x + jogo.w &&
            mouseY > jogo.y && mouseY < jogo.y + jogo.h) {
          this.jogoPressionado = jogo;
        }
      }
    }

    this.arrastandoScroll = true;
    this.mouseAntigoScrollY = mouseY;
    this.arrastou = false;
  }

  mouseReleased() {
    this.arrastandoScroll = false;
    
    if (this.jogoPressionado && !this.arrastou) {
      // 1. Pergunta ao Chouchou se ele pode jogar
      const condicao = this.chouchou.podeJogar();
      
      if (condicao.apto) {
        // Pode jogar: Abre a cena do minigame
        sceneManager.irPara(this.jogoPressionado.id);
        console.log("Abrir minijogo:", this.jogoPressionado.id);
      } else {
        // Não pode jogar: Mostra o erro e deixa o Chouchou triste
        this.mensagemErro = condicao.motivo;
        this.tempoErro = 120; // Fica visível por ~2 segundos (a 60 FPS)
        this.chouchou.setEstado('triste');
      }
    }
    this.jogoPressionado = null;
  }
}