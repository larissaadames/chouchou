class Quarto {
  constructor(chouchou) {
    this.nome      = 'Quarto'
    this.chouchou  = chouchou

    if (this.chouchou.itensComprados === undefined) this.chouchou.itensComprados = [];
    if (!this.chouchou.itensComprados.includes('cor_bege')) this.chouchou.itensComprados.push('cor_bege');

    // ── Configurações do Armário ──────────────────────────────────────────────
    this.armario = { visualW: 250, visualH: 250, distanciaParede: 10, distanciaChao: 120, x: 0, y: 0 };
    
    // ── Configurações do Botão de Cores ───────────────────────────────────────
    this.btnPaleta = { x: 30, y: height / 2 - 40, w: 80, h: 80 };

    // ── Menus ─────────────────────────────────────────────────────────────────
    this.menuAberto = false; // Guarda-roupa
    this.menuCoresAberto = false; // Pintura
    this.opcoesMenu = []; 
    this.opcoesCores = []; 

    // Listas do Guarda-Roupa
    this.listaRoupas = [
      { id: 'camisa10', nome: 'Camisa 10', tipo: 'roupa' },
      { id: 'saia',     nome: 'Saia',      tipo: 'roupa' },
      { id: 'terno',    nome: 'Terno',     tipo: 'roupa' },
      { id: 'nenhuma',  nome: 'Nenhuma',   tipo: 'roupa' }
    ]
    this.listaChapeus = [
      { id: 'caule',    nome: 'Caule',   tipo: 'chapeu' },
      { id: 'lacinho',  nome: 'Lacinho', tipo: 'chapeu' },
      { id: 'panela',   nome: 'Panela',  tipo: 'chapeu' },
      { id: 'nenhum',   nome: 'Nenhum',  tipo: 'chapeu' }
    ]

    // A Lista de Cores (Exatamente igual à Loja para sincronia perfeita)
    this.listaCores = [
      { id: 'cor_bege',    nome: 'Padrão',   rgb: {r: 50, g: 100, b: 50} },
      { id: 'cor_amarelo', nome: 'Amarelo',  rgb: {r: 250, g: 204, b: 21} },
      { id: 'cor_laranja', nome: 'Laranja',  rgb: {r: 249, g: 115, b: 22} },
      { id: 'cor_vermelho',nome: 'Vermelho', rgb: {r: 239, g: 68, b: 68} },
      { id: 'cor_rosa',    nome: 'Rosa',     rgb: {r: 236, g: 72, b: 153} },
      { id: 'cor_roxo',    nome: 'Roxo',     rgb: {r: 168, g: 85, b: 247} },
      { id: 'cor_azul',    nome: 'Azul',     rgb: {r: 59, g: 130, b: 246} },
      { id: 'cor_ciano',   nome: 'Ciano',    rgb: {r: 6, g: 182, b: 212} },
      { id: 'cor_verde',   nome: 'Verde',    rgb: {r: 34, g: 197, b: 94} },
      { id: 'cor_marrom',  nome: 'Marrom',   rgb: {r: 139, g: 69, b: 19} },
      { id: 'cor_cinza',   nome: 'Cinza',    rgb: {r: 156, g: 163, b: 175} },
      { id: 'cor_branco',  nome: 'Branco',   rgb: {r: 245, g: 245, b: 245} },
    ];
  }

  update() {}

  draw() {
    if (SPRITES_CENARIO.quarto) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.quarto, 0, 0, width, height)
    } else {
      background('#1a1a2e')
    }

    this._desenharArmario()
    this._desenharBotaoPaleta()

    this.chouchou.draw()

    // Controla qual menu está aberto para evitar confusão visual
    if (this.menuAberto) {
      this._desenharMenuArmario()
    } else if (this.menuCoresAberto) {
      this._desenharMenuCores()
    }
  }

  _desenharArmario() {
    push()
    this.armario.x = width - this.armario.visualW - this.armario.distanciaParede
    this.armario.y = height - this.armario.visualH - this.armario.distanciaChao

    if (typeof SPRITES_OBJETOS !== 'undefined' && SPRITES_OBJETOS.armario) {
      imageMode(CORNER); 
      image(SPRITES_OBJETOS.armario, this.armario.x, this.armario.y, this.armario.visualW, this.armario.visualH);
    } else {
      fill('#8B4513'); rect(this.armario.x, this.armario.y, this.armario.visualW, this.armario.visualH, 10);
    }

    if (frameCount % 60 < 30 && !this.menuAberto) {
      fill(255, 255, 255, 100); ellipse(this.armario.x + 30, this.armario.y + this.armario.visualH / 2, 10, 10);
    }
    pop()
  }
  _desenharBotaoPaleta() {
    push()
    const b = this.btnPaleta

    if (SPRITES_CENARIO.godet) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.godet, b.x, b.y, b.w, b.h)
    } else {
      // Fallback enquanto PNG não carrega
      fill(255, 255, 255, 200)
      stroke('#94a3b8'); strokeWeight(3)
      rect(b.x, b.y, b.w, b.h, 20)
      noStroke()
      fill('#ef4444'); ellipse(b.x + 25, b.y + 30, 20, 20)
      fill('#3b82f6'); ellipse(b.x + 55, b.y + 30, 20, 20)
      fill('#facc15'); ellipse(b.x + 40, b.y + 55, 20, 20)
    }

    // Dica pulsante
    if (frameCount % 60 < 30 && !this.menuCoresAberto) {
      noStroke()
      fill(255, 255, 255, 150)
      ellipse(b.x + b.w + 10, b.y + 20, 10, 10)
    }
    pop()
  }
  _desenharMenuArmario() {
    push()
    this.opcoesMenu = []

    const colW = 180; const itemH = 46;
    const menuW = (colW * 2) + 60;
    const maxLinhas = Math.max(this.listaRoupas.length, this.listaChapeus.length);
    const menuH = (maxLinhas * itemH) + 80;
    const menuX = width / 2 - menuW / 2;
    const menuY = height / 2 - menuH / 2;

    noStroke(); fill(15, 23, 42, 230);
    rect(menuX, menuY, menuW, menuH, 12);

    fill(255); textAlign(CENTER, TOP); textSize(18); textStyle(BOLD);
    text('GUARDA-ROUPA', width / 2, menuY + 15);

    textStyle(NORMAL); textSize(12); fill(200);
    text('ROUPAS', menuX + 20 + colW / 2, menuY + 45);
    text('CHAPÉUS', menuX + 40 + colW + colW / 2, menuY + 45);

    this.listaRoupas.forEach((item, i) => {
      this._criarBotaoArmario(item, menuX + 20, menuY + 65 + (i * itemH), colW, 36);
    })
    this.listaChapeus.forEach((item, i) => {
      this._criarBotaoArmario(item, menuX + 40 + colW, menuY + 65 + (i * itemH), colW, 36);
    })
    pop()
  }

  _criarBotaoArmario(item, x, y, w, h) {
    let isOpcaoVazia = (item.id === 'nenhuma' || item.id === 'nenhum');
    let foiComprado = this.chouchou.itensComprados.includes(item.id);
    let podeEquipar = isOpcaoVazia || foiComprado;

    this.opcoesMenu.push({ ...item, x, y, w, h, podeEquipar });
    let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
    
    fill(podeEquipar ? (hover ? 100 : 40) : color(20, 20, 20, 150));
    rect(x, y, w, h, 8);

    textAlign(CENTER, CENTER); textSize(14);
    if (podeEquipar) {
      fill(255); text(item.nome, x + w / 2, y + h / 2);
    } else {
      fill(120); text(`🔒 ${item.nome}`, x + w / 2, y + h / 2);
    }
  }

  _desenharMenuCores() {
    push();
    this.opcoesCores = [];

    // Grid 4 colunas x 3 linhas
    let colunas = 4;
    let tamanhoItem = 60;
    let espaco = 20;
    let menuW = (colunas * tamanhoItem) + ((colunas + 1) * espaco);
    let linhas = Math.ceil(this.listaCores.length / colunas);
    let menuH = (linhas * tamanhoItem) + ((linhas + 1) * espaco) + 50; 
    
    let menuX = width / 2 - menuW / 2;
    let menuY = height / 2 - menuH / 2;

    // Fundo do Menu
    noStroke(); fill(15, 23, 42, 230);
    rect(menuX, menuY, menuW, menuH, 12);

    // Título
    fill(255); textAlign(CENTER, TOP); textSize(18); textStyle(BOLD);
    text('PALETA DE CORES', width / 2, menuY + 15);

    // Renderização dos Itens
    let startX = menuX + espaco;
    let startY = menuY + 60;

    for (let i = 0; i < this.listaCores.length; i++) {
      let item = this.listaCores[i];
      let col = i % colunas;
      let row = Math.floor(i / colunas);
      
      let x = startX + col * (tamanhoItem + espaco);
      let y = startY + row * (tamanhoItem + espaco);

      let foiComprado = this.chouchou.itensComprados.includes(item.id);
      
      // Guarda hitbox para clicar
      this.opcoesCores.push({ ...item, x, y, w: tamanhoItem, h: tamanhoItem, podeEquipar: foiComprado });

      let hover = mouseX > x && mouseX < x + tamanhoItem && mouseY > y && mouseY < y + tamanhoItem;

      // Desenha o círculo de Cor
      fill(item.rgb.r, item.rgb.g, item.rgb.b);
      stroke(hover && foiComprado ? '#facc15' : '#e2e8f0');
      strokeWeight(hover && foiComprado ? 4 : 2);
      ellipse(x + tamanhoItem/2, y + tamanhoItem/2, tamanhoItem, tamanhoItem);

      // Cadeado se não tiver comprado
      if (!foiComprado) {
        noStroke();
        fill(0, 0, 0, 180); // Película escura
        ellipse(x + tamanhoItem/2, y + tamanhoItem/2, tamanhoItem, tamanhoItem);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(24);
        text("X", x + tamanhoItem/2, y + tamanhoItem/2);
      }
    }
    pop();
  }

  mousePressed() {
    // ── 1. Interação com o Menu de Armário Aberto ──
    if (this.menuAberto) {
      for (let btn of this.opcoesMenu) {
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
          this._equiparItem(btn);
          return true;
        }
      }
      this.menuAberto = false; // Fecha se clicar fora
      return true;
    }

    // ── 2. Interação com o Menu de Cores Aberto ──
    if (this.menuCoresAberto) {
      for (let btn of this.opcoesCores) {
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
          this._equiparCor(btn);
          return true;
        }
      }
      this.menuCoresAberto = false; // Fecha se clicar fora
      return true;
    }

    // ── 3. Clique no Armário (Abre o Guarda-Roupa) ──
    if (mouseX > this.armario.x && mouseX < this.armario.x + this.armario.visualW &&
        mouseY > this.armario.y && mouseY < this.armario.y + this.armario.visualH) {
      this.menuAberto = true;
      this.menuCoresAberto = false; // Garante que o outro fecha
      return true;
    }

    // ── 4. Clique na Paleta da Parede (Abre a Pintura) ──
    if (mouseX > this.btnPaleta.x && mouseX < this.btnPaleta.x + this.btnPaleta.w &&
        mouseY > this.btnPaleta.y && mouseY < this.btnPaleta.y + this.btnPaleta.h) {
      this.menuCoresAberto = true;
      this.menuAberto = false; // Garante que o outro fecha
      return true;
    }

    // ── 5. Fazer Carinho no Pet ──
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar();
    }
  }

  _equiparItem(btn) {
    if (!btn.podeEquipar) return; 

    if (btn.tipo === 'roupa') {
      if (btn.id === 'nenhuma') this.chouchou.setRoupa(null);
      else if (typeof SPRITES_ROUPAS !== 'undefined' && SPRITES_ROUPAS[btn.id]) {
        this.chouchou.setRoupa(SPRITES_ROUPAS[btn.id]);
      }
    } 
    else if (btn.tipo === 'chapeu') {
      if (btn.id === 'nenhum') this.chouchou.setChapeu(null);
      else if (typeof SPRITES_CHAPEU !== 'undefined' && SPRITES_CHAPEU[btn.id]) {
        this.chouchou.setChapeu(SPRITES_CHAPEU[btn.id]);
      }
    }
  }

  _equiparCor(btn) {
    if (!btn.podeEquipar) return; // Barreira de Segurança
    this.chouchou.setCor(btn.rgb.r, btn.rgb.g, btn.rgb.b);
  }
}