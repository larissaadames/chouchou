class PopupMinijogos {
  constructor() {
    this.aberto = false;
    this.btnFechar = { x: 0, y: 0, w: 40, h: 40 };

    this.scrollOffset = 0;
    this.arrastandoScroll = false;
    this.mouseAntigoScrollY = 0;
    this.jogoPressionado = null; 
    this.arrastou = false; 

    this.jogos = [
      { id: 'minigame_pulo',    nome: 'Pulo Nuvem', imagem: null, x: 0, y: 0, w: 110, h: 140 },
      { id: 'minigame_memoria', nome: 'Memória',    imagem: null, x: 0, y: 0, w: 110, h: 140 },
      { id: 'minigame_3',       nome: 'Corrida',    imagem: null, x: 0, y: 0, w: 110, h: 140 },
      { id: 'minigame_4',       nome: 'Batalha',    imagem: null, x: 0, y: 0, w: 110, h: 140 },
      { id: 'minigame_5',       nome: 'Pescaria',   imagem: null, x: 0, y: 0, w: 110, h: 140 }
    ];
  }

  update() {
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
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    let margem = 40;
    let popW = width - margem * 2;
    let popH = height - margem * 2;
    let popX = margem;
    let popY = margem;

    fill('#0f172a');
    stroke('#3b82f6');
    strokeWeight(4);
    rect(popX, popY, popW, popH, 20);
    noStroke();

    fill(255);
    textAlign(CENTER, TOP);
    textSize(22);
    textStyle(BOLD);
    text("MINIJOGOS", width / 2, popY + 30);

    this.btnFechar.x = popX + popW - 55;
    this.btnFechar.y = popY + 15;
    fill('#ef4444');
    rect(this.btnFechar.x, this.btnFechar.y, this.btnFechar.w, this.btnFechar.h, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("X", this.btnFechar.x + this.btnFechar.w / 2, this.btnFechar.y + this.btnFechar.h / 2);

    let clipY = popY + 80;
    let clipH = popH - 100;
    
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(popX, clipY, popW, clipH);
    drawingContext.clip();

    let espaco = 15;
    let colunas = Math.floor(popW / (this.jogos[0].w + espaco));
    if (colunas < 1) colunas = 1; 
    let margemEsquerdaGrid = popX + (popW - (colunas * this.jogos[0].w + (colunas - 1) * espaco)) / 2;
    
    let maxLinhas = 0;

    for (let i = 0; i < this.jogos.length; i++) {
      let jogo = this.jogos[i];
      let col = i % colunas;
      let row = Math.floor(i / colunas);
      maxLinhas = Math.max(maxLinhas, row + 1);

      jogo.x = margemEsquerdaGrid + col * (jogo.w + espaco);
      jogo.y = clipY + 15 + row * (jogo.h + espaco) + this.scrollOffset;

      fill(this.jogoPressionado === jogo ? '#475569' : '#334155');
      rect(jogo.x, jogo.y, jogo.w, jogo.h, 15);

      let margemImg = 10;
      let imgH = jogo.h - 45; 
      fill('#1e293b');
      rect(jogo.x + margemImg, jogo.y + margemImg, jogo.w - margemImg*2, imgH, 8);
      
      if (jogo.imagem) {
        imageMode(CORNER);
        image(jogo.imagem, jogo.x + margemImg, jogo.y + margemImg, jogo.w - margemImg*2, imgH);
      } else {
        fill(255, 100);
        textAlign(CENTER, CENTER);
        textSize(12);
        textStyle(NORMAL);
        text("Imagem", jogo.x + jogo.w / 2, jogo.y + margemImg + imgH / 2);
      }

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(14);
      textStyle(BOLD);
      text(jogo.nome, jogo.x + jogo.w / 2, jogo.y + jogo.h - 22);
    }

    drawingContext.restore(); 

    let alturaTotalGrid = maxLinhas * (this.jogos[0].h + espaco) + 40;
    let minScroll = clipH - alturaTotalGrid;
    
    if (minScroll > 0) minScroll = 0; 
    if (this.scrollOffset < minScroll) this.scrollOffset = minScroll; 

    if (minScroll < 0) {
      let proporcaoTela = clipH / alturaTotalGrid;
      let tamanhoBarra = clipH * proporcaoTela;
      let posicaoBarra = map(this.scrollOffset, 0, minScroll, clipY, clipY + clipH - tamanhoBarra);
      fill(255, 255, 255, 50);
      rect(popX + popW - 12, posicaoBarra, 6, tamanhoBarra, 4);
    }
    pop();
  }

  mousePressed() {
    if (mouseX > this.btnFechar.x && mouseX < this.btnFechar.x + this.btnFechar.w &&
        mouseY > this.btnFechar.y && mouseY < this.btnFechar.y + this.btnFechar.h) {
      this.aberto = false;
      return;
    }

    let clipY = 40 + 80;
    let clipH = (height - 80) - 100;
    
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
      console.log("Abrir minijogo:", this.jogoPressionado.id);
      // Aqui você vai chamar a mudança de cena no futuro
    }
    this.jogoPressionado = null;
  }
}