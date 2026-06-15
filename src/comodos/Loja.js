class Loja {
  constructor(chouchou) {
    this.nome = 'Loja';
    this.chouchou = chouchou;
    
    // Desloca o Chouchou cerca de 35% da tela para a esquerda
    this.deslocamentoChouchou = width * 0.35; 
    this.escalaChouchou = 1.25; 

    // ── CONFIGURAÇÕES DA LOJA (Ajuste os valores de acordo com o seu PNG) ──
    // Hitbox base do Porta-Malas
    this.areaPortaMalas = { x: width * 0.40, y: height * 0.31, w: 420, h: 220 };
    
    // Quanto a fileira de CIMA deve se deslocar para a DIREITA (em pixels)
    this.deslocamentoFileiraTopo =70;

    // Hitboxes das Lanternas (Botões de Página)
    this.lanternaEsq = { x: width * 0.37, y: height * 0.72, raio: 60 }; 
    this.lanternaDir = { x: width * 0.75, y: height * 0.72, raio: 60 }; 

    // ── SISTEMA DE PÁGINAS ──
    this.paginaAtual = 0;
    this.itensPorPagina = 4;

    if (this.chouchou.moedas === undefined) this.chouchou.moedas = 0;
    if (this.chouchou.itensComprados === undefined) this.chouchou.itensComprados = [];

    // ── CATÁLOGO DE ITENS ──
    this.catalogo = [
      { id: 'camisa10', nome: 'Camisa 10', tipo: 'roupa',  preco: 50,  imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.camisa10 : null },
      { id: 'saia',     nome: 'Saia',      tipo: 'roupa',  preco: 60,  imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.saia : null },
      { id: 'terno',    nome: 'Terno',     tipo: 'roupa',  preco: 120, imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.terno : null },
      { id: 'caule',    nome: 'Caule',     tipo: 'chapeu', preco: 30,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.caule : null },
      { id: 'lacinho',  nome: 'Lacinho',   tipo: 'chapeu', preco: 40,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.lacinho : null },
      { id: 'panela',   nome: 'Panela',    tipo: 'chapeu', preco: 80,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.panela : null }
    ];

    this.totalPaginas = Math.ceil(this.catalogo.length / this.itensPorPagina);
  }

  update() {}

  draw() {
    // ── 1. Fundo do Cenário ──
    push();
    if (typeof SPRITES_CENARIO !== 'undefined' && SPRITES_CENARIO.loja) {
      imageMode(CORNER);
      image(SPRITES_CENARIO.loja, 0, 0, width, height);
    } else {
      background('#475569'); 
    }
    pop();

    // ── 2. Chouchou (Atrás do carro) ──
    push();
    translate(-this.deslocamentoChouchou, -60);
    scale(this.escalaChouchou);
    this.chouchou.draw();
    pop();

    // ── 3. O Carro da Loja ──
    push();
    if (typeof SPRITES_OBJETOS !== 'undefined' && SPRITES_OBJETOS.carro) {
      imageMode(CORNER); 
      image(SPRITES_OBJETOS.carro, 0, 0, width, height); 
    } else {
      // Fallback visual de depuração
      fill('#ef4444'); rect(width - 450, height - 250, 400, 200, 20);
    }
    pop();

    // ── 4. ITENS NO PORTA-MALAS (Calcula e renderiza a Grid) ──
    this._desenharCatalogo();

    // ── 5. UI de Moedas do Jogador ──
    push();
    fill(0, 0, 0, 150);
    rect(width - 160, 20, 140, 45, 20);
    fill('#facc15');
    textAlign(RIGHT, CENTER);
    textSize(22);
    textStyle(BOLD);
    text(`Moedas: ${this.chouchou.moedas}`, width - 40, 42);
    pop();

    // ── 6. VISUALIZADOR DE HITBOXES (Ativado para você calibrar as posições) ──
    let mostrarHitboxes = false; // Altere para false quando terminar a calibração
    if (mostrarHitboxes) {
      push();
      // Área geral do porta-malas (Verde)
      stroke('#22c55e'); strokeWeight(2); fill(34, 197, 94, 40);
      rect(this.areaPortaMalas.x, this.areaPortaMalas.y, this.areaPortaMalas.w, this.areaPortaMalas.h);
      
      // Lanternas Traseiras (Vermelho)
      stroke('#ef4444'); fill(239, 68, 68, 50);
      ellipse(this.lanternaEsq.x, this.lanternaEsq.y, this.lanternaEsq.raio * 2);
      ellipse(this.lanternaDir.x, this.lanternaDir.y, this.lanternaDir.raio * 2);
      pop();
    }
  }

  _desenharCatalogo() {
    push();
    let pm = this.areaPortaMalas;
    
    let indexInicio = this.paginaAtual * this.itensPorPagina;
    let indexFim = min(indexInicio + this.itensPorPagina, this.catalogo.length);
    let itensDaPagina = this.catalogo.slice(indexInicio, indexFim);

    let colunas = 2;
    let espacoX = 10;
    let espacoY = 30;
    let itemW = (pm.w - espacoX) / colunas;
    let itemH = (pm.h - espacoY) / 2;

    for (let i = 0; i < itensDaPagina.length; i++) {
      let item = itensDaPagina[i];
      let col = i % colunas;
      let row = floor(i / colunas);

      // ── MÁGICA DO DESALINHAMENTO ──
      // Se for a fileira de cima (row === 0), adiciona o deslocamento para a direita
      let offsetFileira = (row === 0) ? this.deslocamentoFileiraTopo : 0;

      let x = pm.x + col * (itemW + espacoX) + offsetFileira;
      let y = pm.y + row * (itemH + espacoY);

      let jaComprado = this.chouchou.itensComprados.includes(item.id);

      // Card do item
      fill(0, 0, 0, 180);
      stroke(jaComprado ? '#22c55e' : '#4755694b');
      strokeWeight(0);
      rect(x, y, itemW, itemH, 12);
      noStroke();

      // Sprite do Item
      if (item.imagem) {
        imageMode(CENTER);
        if (jaComprado) tint(255, 100); 
        image(item.imagem, x + itemW / 2, y + itemH / 2 - 10, itemW * 0.5, itemH * 0.5);
        noTint();
      } else {
        fill(255, 40);
        ellipse(x + itemW / 2, y + itemH / 2 - 10, 40, 40);
      }

      // Textos
      fill(jaComprado ? '#86efac' : 255);
      textAlign(CENTER, CENTER);
      textSize(14);
      textStyle(BOLD);
      text(item.nome, x + itemW / 2, y + itemH - 30);

      textSize(12);
      if (jaComprado) {
        fill('#22c55e');
        text("COMPRADO", x + itemW / 2, y + itemH - 12);
      } else {
        fill('#facc15');
        text(`💰 ${item.preco}`, x + itemW / 2, y + itemH - 12);
      }

      // Salva a hitbox real (já deslocada) para a checagem do clique
      item.hitbox = { x, y, w: itemW, h: itemH };
    }

    // Paginação centralizada com base no meio do porta-malas
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(NORMAL);
    text(`Pág ${this.paginaAtual + 1} de ${this.totalPaginas}`, pm.x + pm.w / 2 + (this.deslocamentoFileiraTopo / 2), pm.y + pm.h + 20);
    
    pop();
  }

  mousePressed() {
    // ── PRIORIDADE 1: Lanternas do Carro (Páginas) ──
    // Estão na camada mais alta da interface do carro, bloqueiam cliques de fundo
    if (dist(mouseX, mouseY, this.lanternaEsq.x, this.lanternaEsq.y) < this.lanternaEsq.raio) {
      this.paginaAtual = (this.paginaAtual - 1 + this.totalPaginas) % this.totalPaginas;
      if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.sun_pickup) SONS_CHOUCHOU.sun_pickup.play();
      return true;
    }

    if (dist(mouseX, mouseY, this.lanternaDir.x, this.lanternaDir.y) < this.lanternaDir.raio) {
      this.paginaAtual = (this.paginaAtual + 1) % this.totalPaginas;
      if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.sun_pickup) SONS_CHOUCHOU.sun_pickup.play();
      return true;
    }

    // ── PRIORIDADE 2: Itens expostos na mala ──
    let indexInicio = this.paginaAtual * this.itensPorPagina;
    let indexFim = min(indexInicio + this.itensPorPagina, this.catalogo.length);
    let itensDaPagina = this.catalogo.slice(indexInicio, indexFim);

    for (let item of itensDaPagina) {
      if (item.hitbox && 
          mouseX > item.hitbox.x && mouseX < item.hitbox.x + item.hitbox.w &&
          mouseY > item.hitbox.y && mouseY < item.hitbox.y + item.hitbox.h) {
            
        this._tentarComprar(item);
        return true;
      }
    }

    // ── PRIORIDADE 3: Chouchou (Apenas se o clique errou tudo o que estava no carro!) ──
    let mouseXCompensado = (mouseX + this.deslocamentoChouchou) / this.escalaChouchou;
    let mouseYCompensated = (mouseY + 60) / this.escalaChouchou;

    if (this.chouchou.foiTocado(mouseXCompensado, mouseYCompensated)) {
      this.chouchou.tocar();
      return true; 
    }
  }

  _tentarComprar(item) {
    if (this.chouchou.itensComprados.includes(item.id)) return;

    if (this.chouchou.moedas >= item.preco) {
      this.chouchou.moedas -= item.preco;
      this.chouchou.itensComprados.push(item.id);
      
      if (item.tipo === 'roupa') this.chouchou.sprites.roupa = item.imagem;
      if (item.tipo === 'chapeu') this.chouchou.sprites.chapeu = item.imagem;

      this.chouchou.setEstado('feliz');
      setTimeout(() => this.chouchou.setEstado('idle'), 1000);

      if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.sun_pickup) {
        SONS_CHOUCHOU.sun_pickup.play();
      }
    } else {
      this.chouchou.setEstado('triste');
      setTimeout(() => this.chouchou.setEstado('idle'), 1000);
      
      if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.game_over) {
         SONS_CHOUCHOU.game_over.play(); 
      }
    }
  }

  mouseReleased() {}
}