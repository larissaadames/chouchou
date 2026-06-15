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
      this.chouchou.inventario = { nitrogenio: 3, fosforo: 3, potassio: 3, calcio: 3, magnesio: 3, enxofre: 3 };
    }
    
    this.itemAtivo = null;   
    this.RAIO_COMER = 80;
    this.iniciado = false; 
    
    // Trava para evitar que a comida apareça antes de ele terminar de mastigar
    this.esperandoNovaComida = false; 
  }

  update() {
    if (!this.iniciado) {
      this._sortearItemAtivo();
      this.iniciado = true;
    }

    // Só tenta repor a comida se a mesa estiver vazia E se NÃO estivermos esperando ele mastigar
    if (this.itemAtivo === null && !this.esperandoNovaComida) {
      let temComidaNoInventario = Object.values(this.chouchou.inventario).some(qtd => qtd > 0);
      if (temComidaNoInventario) {
        this._sortearItemAtivo();
      }
    }

    if (this.itemAtivo?.arrastando) {
      this.itemAtivo.x = mouseX;
      this.itemAtivo.y = mouseY;

      const perto = dist(mouseX, mouseY, this.chouchou.x, this.chouchou.y) < this.RAIO_COMER;

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
    
    let temComidaNoInventario = Object.values(this.chouchou.inventario).some(qtd => qtd > 0);

    if (this.itemAtivo) {
      this._desenharElemento(
        this.itemAtivo.x,
        this.itemAtivo.y,
        this.itemAtivo,
        this.itemAtivo.arrastando ? 1.1 : 1.0
      );

      let chavesDisponiveis = Object.keys(CATALOGO_COMIDAS).filter(id => this.chouchou.inventario[id] > 0);
      
      if (!this.itemAtivo.arrastando && chavesDisponiveis.length > 1) {
        fill(255, 150);
        textSize(28);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        
        text("<", this.itemAtivo.fixoX - 80, this.itemAtivo.fixoY);
        text(">", this.itemAtivo.fixoX + 80, this.itemAtivo.fixoY);
      }

    } 
    else if (!temComidaNoInventario && !this.esperandoNovaComida) {
      fill(255, 150);
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
      
      if (dist(mouseX, mouseY, this.itemAtivo.x, this.itemAtivo.y) < 40) {
        this.itemAtivo.arrastando = true;
        return true; 
      }

      let chavesDisponiveis = Object.keys(CATALOGO_COMIDAS).filter(id => this.chouchou.inventario[id] > 0);
      if (chavesDisponiveis.length > 1) {
        let btnEsqX = this.itemAtivo.fixoX - 80;
        let btnDirX = this.itemAtivo.fixoX + 80;
        let btnY = this.itemAtivo.fixoY;

        if (dist(mouseX, mouseY, btnEsqX, btnY) < 30) {
          this._mudarItem(-1, chavesDisponiveis);
          return true;
        }
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

    let idParaMostrar;
    if (this.itemAtivo && disponiveis.includes(this.itemAtivo.id)) {
       idParaMostrar = this.itemAtivo.id;
    } else {
       idParaMostrar = random(disponiveis);
    }
    
    const def = CATALOGO_COMIDAS[idParaMostrar];
    const fixoX = width / 2;
    const fixoY = 200;

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false };
  }

  _mudarItem(direcao, disponiveis) {
    let indexAtual = disponiveis.indexOf(this.itemAtivo.id);
    let novoIndex = (indexAtual + direcao + disponiveis.length) % disponiveis.length;
    let novoId = disponiveis[novoIndex];
    
    const def = CATALOGO_COMIDAS[novoId];
    const fixoX = width / 2;
    const fixoY = 200;

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false };
  }

  _alimentar(item) {
    if (this.chouchou.inventario[item.id] > 0) {
      this.chouchou.inventario[item.id] -= 1;
    }

    if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.nham) {
      let somNham = random(SONS_CHOUCHOU.nham);
      if (!somNham.isPlaying()) somNham.play();
    }

    this.chouchou._alterarStat('fome', item.fome);
    this.chouchou.setEstado('comendo');
    
    // Esconde a comida da mão e tranca a criação de novas comidas
    this.itemAtivo = null;
    this.esperandoNovaComida = true;
    
    // Espera a animação acabar para destravar
    setTimeout(() => {
      this.chouchou.setEstado('idle');
      this.esperandoNovaComida = false;
      this._sortearItemAtivo();
    }, 800);
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