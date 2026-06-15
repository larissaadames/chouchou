class Loja {
  constructor(chouchou) {
    this.nome = 'Loja';
    this.chouchou = chouchou;
    
    // Desloca o Chouchou cerca de 35% da tela para a esquerda
    this.deslocamentoChouchou = width * 0.40; 
    this.escalaChouchou = 1.25; 

    // ── CONFIGURAÇÕES DA LOJA ORIGINAIS PRESURVADAS ──
    // Hitbox base do Porta-Malas
    this.areaPortaMalas = { x: width * 0.40, y: height * 0.31, w: 420, h: 220 };
    
    // Quanto a fileira de CIMA deve se deslocar para a DIREITA (em pixels)
    this.deslocamentoFileiraTopo = 70;

    // Hitboxes das Lanternas (Botões de Página)
    this.lanternaEsq = { x: width * 0.37, y: height * 0.72, raio: 60 }; 
    this.lanternaDir = { x: width * 0.75, y: height * 0.72, raio: 60 }; 

    // ── SISTEMA DE PÁGINAS ──
    this.paginaAtual = 0;
    this.itensPorPagina = 4;

    if (this.chouchou.moedas === undefined) this.chouchou.moedas = 0;
    if (this.chouchou.itensComprados === undefined) this.chouchou.itensComprados = [];

    // Garante que o pet tem a sua própria cor base registrada como comprada por padrão
    if (!this.chouchou.itensComprados.includes('cor_bege')) {
      this.chouchou.itensComprados.push('cor_bege');
    }

    // ── CATÁLOGO DE ITENS COMPLETO (6 Roupas/Chapéus + 12 Cores) ──
    this.catalogo = [
      

      // Itens originais mantidos
      { id: 'camisa10', nome: 'Camisa 10', tipo: 'roupa',  preco: 50,  imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.camisa10 : null },
      { id: 'saia',     nome: 'Saia',      tipo: 'roupa',  preco: 60,  imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.saia : null },
      { id: 'terno',    nome: 'Terno',     tipo: 'roupa',  preco: 120, imagem: typeof SPRITES_ROUPAS !== 'undefined' ? SPRITES_ROUPAS.terno : null },
      { id: 'caule',    nome: 'Caule',     tipo: 'chapeu', preco: 30,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.caule : null },
      { id: 'lacinho',  nome: 'Lacinho',   tipo: 'chapeu', preco: 40,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.lacinho : null },
      { id: 'panela',   nome: 'Panela',    tipo: 'chapeu', preco: 80,  imagem: typeof SPRITES_CHAPEU !== 'undefined' ? SPRITES_CHAPEU.panela : null },

      // As 12 Cores Básicas adicionadas ao escopo
      { id: 'cor_bege',    nome: 'Padrão',   tipo: 'cor', preco: 0,   rgb: {r: 50, g: 100, b: 50} }, 
      { id: 'cor_amarelo', nome: 'Amarelo',  tipo: 'cor', preco: 20,  rgb: {r: 250, g: 204, b: 21} },
      { id: 'cor_laranja', nome: 'Laranja',  tipo: 'cor', preco: 25,  rgb: {r: 249, g: 115, b: 22} },
      { id: 'cor_vermelho',nome: 'Vermelho', tipo: 'cor', preco: 30,  rgb: {r: 239, g: 68, b: 68} },
      { id: 'cor_rosa',    nome: 'Rosa',     tipo: 'cor', preco: 35,  rgb: {r: 236, g: 72, b: 153} },
      { id: 'cor_roxo',    nome: 'Roxo',     tipo: 'cor', preco: 40,  rgb: {r: 168, g: 85, b: 247} },
      { id: 'cor_azul',    nome: 'Azul',     tipo: 'cor', preco: 30,  rgb: {r: 59, g: 130, b: 246} },
      { id: 'cor_ciano',   nome: 'Ciano',    tipo: 'cor', preco: 35,  rgb: {r: 6, g: 182, b: 212} },
      { id: 'cor_verde',   nome: 'Verde',    tipo: 'cor', preco: 30,  rgb: {r: 34, g: 197, b: 94} },
      { id: 'cor_marrom',  nome: 'Marrom',   tipo: 'cor', preco: 20,  rgb: {r: 139, g: 69, b: 19} },
      { id: 'cor_cinza',   nome: 'Cinza',    tipo: 'cor', preco: 15,  rgb: {r: 156, g: 163, b: 175} },
      { id: 'cor_branco',  nome: 'Branco',   tipo: 'cor', preco: 50,  rgb: {r: 245, g: 245, b: 245} }
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
      fill('#ef4444'); rect(width - 450, height - 250, 400, 200, 20);
    }
    pop();

    // ── 4. ITENS NO PORTA-MALAS (Calcula e renderiza a Grid) ──
    this._desenharCatalogo();

    // ── 5. UI de Moedas do Jogador ──
    push();
    fill(0, 0, 0, 150);
    rect(width - 160, 60, 140, 45, 20);
    fill('#facc15');
    textAlign(RIGHT, CENTER);
    textSize(22);
    textStyle(BOLD);
    text(`Moedas: ${this.chouchou.moedas}`, width - 40, 82);
    pop();

    // ── 6. VISUALIZADOR DE HITBOXES ──
    let mostrarHitboxes = false; 
    if (mostrarHitboxes) {
      push();
      stroke('#22c55e'); strokeWeight(2); fill(34, 197, 94, 40);
      rect(this.areaPortaMalas.x, this.areaPortaMalas.y, this.areaPortaMalas.w, this.areaPortaMalas.h);
      
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

      // ── MÁGICA DO DESALINHAMENTO ORIGINAL PRESERVADO ──
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

      // ── TRATAMENTO VISUAL PARA CORES OU IMAGENS ──
      if (item.tipo === 'cor') {
        // Se for uma amostra de cor, desenha uma bolha circular com a tonalidade RGB
        fill(item.rgb.r, item.rgb.g, item.rgb.b);
        stroke('#f8fafc');
        strokeWeight(2);
        ellipse(x + itemW / 2, y + itemH / 2 - 10, 42, 42);
        noStroke();
        
        // Se já comprou, aplica uma película escura translúcida sobre o círculo de cor
        if (jaComprado) {
          fill(0, 0, 0, 120);
          ellipse(x + itemW / 2, y + itemH / 2 - 10, 42, 42);
        }
      } 
      else if (item.imagem) {
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
        text(`${item.preco}`, x + itemW / 2, y + itemH - 12);
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

    // ── PRIORIDADE 3: Chouchou ──
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
      
      // Lógica de Equipar Dinamicamente Estendida para as Cores
      if (item.tipo === 'roupa') this.chouchou.sprites.roupa = item.imagem;
      if (item.tipo === 'chapeu') this.chouchou.sprites.chapeu = item.imagem;
      if (item.tipo === 'cor') this.chouchou.setCor(item.rgb.r, item.rgb.g, item.rgb.b);

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