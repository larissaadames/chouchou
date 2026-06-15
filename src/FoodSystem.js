// ── Catálogo global de comidas ────────────────────────────────────────────────
const CATALOGO_COMIDAS = {
  nitrogenio: { id: 'nitrogenio', nome: 'Nitrogênio', simbolo: 'N', cor: '#4ade80', fome: +20, imagem: null },
  fosforo:    { id: 'fosforo',    nome: 'Fósforo',    simbolo: 'P', cor: '#fb923c', fome: +15, imagem: null },
  potassio:   { id: 'potassio',   nome: 'Potássio',   simbolo: 'K', cor: '#a78bfa', fome: +18, imagem: null },
  calcio:     { id: 'calcio',     nome: 'Cálcio',     simbolo: 'Ca',cor: '#f9a8d4', fome: +12, imagem: null },
  magnesio:   { id: 'magnesio',   nome: 'Magnésio',   simbolo: 'Mg',cor: '#67e8f9', fome: +10, imagem: null },
  enxofre:    { id: 'enxofre',    nome: 'Enxofre',    simbolo: 'S', cor: '#fde047', fome: +8,  imagem: null }
}

// ── FoodSystem ───────────────────────────────────────────────────────────────
class FoodSystem {
  constructor(chouchou) {
    this.chouchou = chouchou;
    
    // Configura o inventário inicial global
    if (this.chouchou.inventario === undefined) {
      this.chouchou.inventario = { nitrogenio: 1, fosforo: 1, potassio: 1, calcio: 1, magnesio: 1, enxofre: 1};
    }
    
    this.itemAtivo = null;   
    this.RAIO_COMER = 80;
    this.iniciado = false; 
  }

  update() {
    if (!this.iniciado) {
      this._sortearItemAtivo();
      this.iniciado = true;
    }

    if (this.itemAtivo?.arrastando) {
      this.itemAtivo.x = mouseX;
      this.itemAtivo.y = mouseY;

      const perto = dist(mouseX, mouseY, this.chouchou.x, this.chouchou.y) < this.RAIO_COMER;

      // Abre a boca e faz barulho de fome ("nhaa")
      if (perto && this.chouchou.estado !== 'bocaAberta') {
        if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.nhaa) {
          let somNhaa = random(SONS_CHOUCHOU.nhaa);
          !somNhaa.isPlaying() ? somNhaa.play() : somNhaa.stop() && somNhaa.play();
        }
      }

      this.chouchou.setEstado(perto ? 'bocaAberta' : 'idle');
    }
  }

  draw() {
    push();
    
    // 1. Verifica se existe pelo menos 1 unidade de QUALQUER comida no inventário inteiro
    let temComidaNoInventario = Object.values(this.chouchou.inventario).some(qtd => qtd > 0);

    if (this.itemAtivo) {
      this._desenharElemento(
        this.itemAtivo.x,
        this.itemAtivo.y,
        this.itemAtivo,
        this.itemAtivo.arrastando ? 1.1 : 1.0
      );

      // ── SETAS DE NAVEGAÇÃO (< e >) ──
      // Só desenha as setas se não estiver a segurar a comida e se houver mais de 1 tipo disponível
      let chavesDisponiveis = Object.keys(CATALOGO_COMIDAS).filter(id => this.chouchou.inventario[id] > 0);
      
      if (!this.itemAtivo.arrastando && chavesDisponiveis.length > 1) {
        fill(255, 150);
        textSize(28);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        
        // Seta Esquerda
        text("<", this.itemAtivo.fixoX - 80, this.itemAtivo.fixoY);
        
        // Seta Direita
        text(">", this.itemAtivo.fixoX + 80, this.itemAtivo.fixoY);
      }

    } 
    // 2. O AVISO SÓ APARECE SE O INVENTÁRIO ESTIVER REALMENTE VAZIO
    else if (!temComidaNoInventario) {
      fill(255, 255, 255);
      textAlign(CENTER, CENTER);
      textSize(18);
      textStyle(BOLD);
      text("Falta Comida!\nVá jogar para ganhar mais.", width / 2, 200);
      textStyle(NORMAL);
    }
    pop();
  }

  mousePressed() {
    if (this.itemAtivo && !this.itemAtivo.arrastando) {
      
      // Verifica se clicou EXATAMENTE na comida para arrastar
      if (dist(mouseX, mouseY, this.itemAtivo.x, this.itemAtivo.y) < 40) {
        this.itemAtivo.arrastando = true;
        return true; 
      }

      // Verifica se clicou nas SETAS laterais
      let chavesDisponiveis = Object.keys(CATALOGO_COMIDAS).filter(id => this.chouchou.inventario[id] > 0);
      if (chavesDisponiveis.length > 1) {
        let btnEsqX = this.itemAtivo.fixoX - 80;
        let btnDirX = this.itemAtivo.fixoX + 80;
        let btnY = this.itemAtivo.fixoY;

        // Clicou na Seta Esquerda
        if (dist(mouseX, mouseY, btnEsqX, btnY) < 30) {
          this._mudarItem(-1, chavesDisponiveis);
          return true;
        }
        // Clicou na Seta Direita
        if (dist(mouseX, mouseY, btnDirX, btnY) < 30) {
          this._mudarItem(1, chavesDisponiveis);
          return true;
        }
      }
    }
    return false; 
  }

  mouseReleased() {
    if (!this.itemAtivo?.arrastando) return;

    if (dist(this.itemAtivo.x, this.itemAtivo.y, this.chouchou.x, this.chouchou.y) < this.RAIO_COMER) {
      this._alimentar(this.itemAtivo);
    } else {
      // Se soltar fora da boca, a comida volta para a mesa
      this.itemAtivo.x = this.itemAtivo.fixoX;
      this.itemAtivo.y = this.itemAtivo.fixoY;
    }

    if (this.itemAtivo) this.itemAtivo.arrastando = false;

    if (this.chouchou.estado === 'bocaAberta') {
      this.chouchou.setEstado('idle');
    }
  }

  _sortearItemAtivo() {
    let chavesCatalogo = Object.keys(CATALOGO_COMIDAS);
    let disponiveis = chavesCatalogo.filter(id => this.chouchou.inventario[id] > 0);

    if (disponiveis.length === 0) {
      this.itemAtivo = null; 
      return;
    }

    // Lógica inteligente: tenta manter a mesma comida na mesa depois de ele comer, 
    // se o jogador ainda tiver mais daquela mesma comida no inventário.
    let idParaMostrar;
    if (this.itemAtivo && disponiveis.includes(this.itemAtivo.id)) {
       idParaMostrar = this.itemAtivo.id;
    } else {
       idParaMostrar = random(disponiveis); // Se a que ele estava a comer acabou, sorteia outra
    }
    
    const def = CATALOGO_COMIDAS[idParaMostrar];
    const fixoX = width / 2;
    const fixoY = 200;

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false };
  }

  // NOVA FUNÇÃO: Roda o inventário para o lado escolhido
  _mudarItem(direcao, disponiveis) {
    let indexAtual = disponiveis.indexOf(this.itemAtivo.id);
    
    // Matemática mágica para fazer o loop "dar a volta" se chegar ao fim da lista
    let novoIndex = (indexAtual + direcao + disponiveis.length) % disponiveis.length;
    let novoId = disponiveis[novoIndex];
    
    const def = CATALOGO_COMIDAS[novoId];
    const fixoX = width / 2;
    const fixoY = 200;

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false };
  }

  _alimentar(item) {
    // Subtrai do inventário global
    if (this.chouchou.inventario[item.id] > 0) {
      this.chouchou.inventario[item.id] -= 1;
    }

    // Som de comer
    if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.nham) {
      let somNham = random(SONS_CHOUCHOU.nham);
      if (!somNham.isPlaying()) somNham.play();
    }

    this.chouchou._alterarStat('fome', item.fome);
    this.chouchou.setEstado('comendo');
    
    setTimeout(() => this.chouchou.setEstado('idle'), 800);
    
    // Esconde a comida da mão do jogador e espera o fim da animação para pôr outra na mesa
    this.itemAtivo = null;
    setTimeout(() => this._sortearItemAtivo(), 800);
  }

  _desenharElemento(x, y, def, escala = 1.0) {
    push();
    translate(x, y);
    scale(escala);
    noStroke();

    if (def.imagem) {
      imageMode(CENTER);
      image(def.imagem, 0, 0, 52, 52);
    } else {
      fill(def.cor);
      ellipse(0, 0, 52, 52);
      fill(255, 255, 255, 60);
      ellipse(-8, -10, 20, 16);
      fill('#fff');
      textAlign(CENTER, CENTER);
      textSize(def.simbolo.length > 1 ? 14 : 18);
      textStyle(BOLD);
      text(def.simbolo, 0, 0);
      textStyle(NORMAL);
    }

    fill(0, 0, 0, 200);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(def.nome, 0, 40);

    // ── BADGE DE QUANTIDADE ──
    let qtd = this.chouchou.inventario[def.id] || 0;
    
    fill('#ef4444'); 
    ellipse(22, -22, 22, 22);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    text(qtd, 22, -22); 

    pop();
  }
}