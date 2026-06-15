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
    this.chouchou = chouchou
    
    // Lista de elementos que o jogador possui
    this.inventario = ['nitrogenio', 'fosforo', 'potassio', 'calcio', 'magnesio', 'enxofre']
    
    this.itemAtivo = null   
    this.RAIO_COMER = 80
    this.iniciado = false 
  }

  adicionarAoInventario(id) {
    if (!CATALOGO_COMIDAS[id]) return
    if (!this.inventario.includes(id)) {
      this.inventario.push(id)
    }
  }

  removerDoInventario(id) {
    this.inventario = this.inventario.filter(i => i !== id)
    if (this.itemAtivo?.id === id) {
      this._sortearItemAtivo()
    }
  }

  update() {
    if (!this.iniciado) {
      this._sortearItemAtivo()
      this.iniciado = true
    }

    if (this.itemAtivo?.arrastando) {
      this.itemAtivo.x = mouseX
      this.itemAtivo.y = mouseY

      const perto = dist(mouseX, mouseY, this.chouchou.x, this.chouchou.y) < this.RAIO_COMER
      this.chouchou.setEstado(perto ? 'bocaAberta' : 'idle')
    }
  }

  draw() {
    push()
    if (this.itemAtivo) {
      this._desenharElemento(
        this.itemAtivo.x,
        this.itemAtivo.y,
        this.itemAtivo,
        this.itemAtivo.arrastando ? 1.1 : 1.0
      )
    }
    pop()
  }

  mousePressed() {
    if (this.itemAtivo && !this.itemAtivo.arrastando) {
      // Verifica se clicou num raio de 40px no centro da comida
      if (dist(mouseX, mouseY, this.itemAtivo.x, this.itemAtivo.y) < 40) {
        this.itemAtivo.arrastando = true
        return true 
      }
    }
    return false 
  }

  mouseReleased() {
    if (!this.itemAtivo?.arrastando) return

    if (dist(this.itemAtivo.x, this.itemAtivo.y,
              this.chouchou.x, this.chouchou.y) < this.RAIO_COMER) {
      this._alimentar(this.itemAtivo)
    } else {
      this.itemAtivo.x = this.itemAtivo.fixoX
      this.itemAtivo.y = this.itemAtivo.fixoY
    }

    this.itemAtivo.arrastando = false

    if (this.chouchou.estado === 'bocaAberta') {
      this.chouchou.setEstado('idle')
    }
  }

  _sortearItemAtivo() {
    if (this.inventario.length === 0) {
      this.itemAtivo = null
      return
    }

    const id  = this.inventario[floor(random(this.inventario.length))]
    const def = CATALOGO_COMIDAS[id]

    // Nasce no centro superior da tela
    const fixoX = width / 2
    const fixoY = 200

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false }
  }

  _alimentar(item) {
    this.chouchou._alterarStat('fome', item.fome)
    this.chouchou.setEstado('comendo')
    
    setTimeout(() => this.chouchou.setEstado('idle'), 1200)
    setTimeout(() => this._sortearItemAtivo(), 600)
    
    this.itemAtivo = null
  }

  _desenharElemento(x, y, def, escala = 1.0) {
    push()
    translate(x, y)
    scale(escala)
    noStroke()

    // Sombra
    // fill(0, 0, 0, 40)
    // ellipse(2, 4, 56, 56)

    if (def.imagem) {
      imageMode(CENTER)
      image(def.imagem, 0, 0, 52, 52)
    } else {
      fill(def.cor)
      ellipse(0, 0, 52, 52)
      fill(255, 255, 255, 60)
      ellipse(-8, -10, 20, 16)
      fill('#fff')
      textAlign(CENTER, CENTER)
      textSize(def.simbolo.length > 1 ? 14 : 18)
      textStyle(BOLD)
      text(def.simbolo, 0, 0)
      textStyle(NORMAL)
    }

    fill(0, 0, 0, 200)
    textAlign(CENTER, CENTER)
    textSize(9)
    text(def.nome, 0, 34)
    pop()
  }
}