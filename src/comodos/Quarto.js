// ─── Quarto ───────────────────────────────────────────────────────────────────
// Primeiro cômodo — onde o Chouchou passa a maior parte do tempo.
// ──────────────────────────────────────────────────────────────────────────────

class Quarto {
  constructor(chouchou) {
    this.nome      = 'Quarto'
    this.chouchou  = chouchou

    // ── Configurações do Armário ──────────────────────────────────────────────
    this.armario = {
      visualW: 250,          
      visualH: 250,          
      distanciaParede: 10,   
      distanciaChao: 120,    
      x: 0, 
      y: 0  
    }

    // ── Menu de Guarda-Roupa (Roupas e Chapéus) ───────────────────────────────
    this.menuAberto = false
    this.opcoesMenu = [] // Guarda a posição e os dados de todos os botões clicáveis
    
    // Separamos em duas listas para criar as duas colunas
    this.listaRoupas = [
      { id: 'camisa10', nome: 'Camisa 10',   tipo: 'roupa' },
      { id: 'saia',     nome: 'Saia',        tipo: 'roupa' },
      { id: 'terno',    nome: 'Terno',       tipo: 'roupa' },
      { id: 'nenhuma',  nome: 'Nenhuma Roupa', tipo: 'roupa' }
    ]

    this.listaChapeus = [
      { id: 'caule',    nome: 'Caule',        tipo: 'chapeu' },
      { id: 'lacinho',  nome: 'Lacinho',      tipo: 'chapeu' },
      { id: 'panela',   nome: 'Panela',       tipo: 'chapeu' },
      { id: 'nenhum',   nome: 'Nenhum Chapéu', tipo: 'chapeu' }
    ]
  }

  update() {}

  draw() {
    // ── Camada 1: Fundo do Quarto (Imagem PNG) ──────────────────────────────
    if (SPRITES_CENARIO.quarto) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.quarto, 0, 0, width, height)
    } else {
      background('#1a1a2e')
    }

    // ── Camada 2: Mobília (Armário) ─────────────────────────────────────────
    this._desenharArmario()

    // ── Camada 3: Chouchou ──────────────────────────────────────────────────
    this.chouchou.draw()

    // ── Camada 4: Menu Guarda-Roupa (Por cima de tudo) ──────────────────────
    if (this.menuAberto) {
      this._desenharMenu()
    }
  }

  _desenharArmario() {
    push()
    this.armario.x = width - this.armario.visualW - this.armario.distanciaParede
    this.armario.y = height - this.armario.visualH - this.armario.distanciaChao

    if (typeof SPRITES_OBJETOS !== 'undefined' && SPRITES_OBJETOS.armario) {
      imageMode(CORNER) 
      image(
        SPRITES_OBJETOS.armario,
        this.armario.x,
        this.armario.y,
        this.armario.visualW,
        this.armario.visualH
      )
    } else {
      fill('#8B4513')
      rect(this.armario.x, this.armario.y, this.armario.visualW, this.armario.visualH, 10)
    }

    // Dica visual
    if (frameCount % 60 < 30 && !this.menuAberto) {
      fill(255, 255, 255, 100)
      ellipse(this.armario.x + 30, this.armario.y + this.armario.visualH / 2, 10, 10)
    }
    pop()
  }

  _desenharMenu() {
    push()
    this.opcoesMenu = []

    // Configurações do painel duplo
    const colW   = 180            // Largura de cada coluna
    const menuW  = (colW * 2) + 60 // Duas colunas + margens
    const itemH  = 46             // Altura de cada botão
    
    // Descobre qual lista é maior para definir a altura do menu
    const maxLinhas = Math.max(this.listaRoupas.length, this.listaChapeus.length)
    const menuH     = (maxLinhas * itemH) + 80
    
    const menuX  = width / 2 - menuW / 2
    const menuY  = height / 2 - menuH / 2

    // Fundo principal do menu
    noStroke()
    fill(15, 23, 42, 230) // Azul escuro translúcido
    rect(menuX, menuY, menuW, menuH, 12)

    // Título Central
    fill(255)
    textAlign(CENTER, TOP)
    textSize(18)
    textStyle(BOLD)
    text('GUARDA-ROUPA', width / 2, menuY + 15)
    textStyle(NORMAL)

    // Subtítulos das colunas
    textSize(12)
    fill(200)
    text('ROUPAS', menuX + 20 + colW / 2, menuY + 45)
    text('CHAPÉUS', menuX + 40 + colW + colW / 2, menuY + 45)

    // ── Preenchendo a Coluna 1 (Roupas) ──────────────────────────────────────
    this.listaRoupas.forEach((item, i) => {
      let x = menuX + 20
      let y = menuY + 65 + (i * itemH)
      this._criarBotaoMenu(item, x, y, colW, 36)
    })

    // ── Preenchendo a Coluna 2 (Chapéus) ─────────────────────────────────────
    this.listaChapeus.forEach((item, i) => {
      let x = menuX + 40 + colW
      let y = menuY + 65 + (i * itemH)
      this._criarBotaoMenu(item, x, y, colW, 36)
    })

    pop()
  }

  // Função auxiliar para desenhar o botão e registrar o clique
  _criarBotaoMenu(item, x, y, w, h) {
    // Guarda na lista de cliques
    this.opcoesMenu.push({ ...item, x, y, w, h })

    // Efeito de passar o mouse por cima
    let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h
    fill(hover ? 100 : 40)
    rect(x, y, w, h, 8)

    // Texto
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(14)
    text(item.nome, x + w / 2, y + h / 2)
  }

  // ── Eventos de mouse ──────────────────────────────────────────────────────
  mousePressed() {
    if (this.menuAberto) {
      for (let btn of this.opcoesMenu) {
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
          this._equiparItem(btn)
          // this.menuAberto = false // (Se quiser que o menu continue aberto ao clicar, comente esta linha)
          return
        }
      }
      this.menuAberto = false
      return
    }

    if (mouseX > this.armario.x && mouseX < this.armario.x + this.armario.visualW &&
        mouseY > this.armario.y && mouseY < this.armario.y + this.armario.visualH) {
      this.menuAberto = true
      return
    }

    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
    }
  }

  // ── Lógica de equipar ─────────────────────────────────────────────────────
  _equiparItem(btn) {
    // Verifica se é uma roupa ou um chapéu e chama a função certa no Chouchou
    if (btn.tipo === 'roupa') {
      if (btn.id === 'nenhuma') {
        this.chouchou.setRoupa(null)
      } else if (typeof SPRITES_ROUPAS !== 'undefined' && SPRITES_ROUPAS[btn.id]) {
        this.chouchou.setRoupa(SPRITES_ROUPAS[btn.id])
      }
    } 
    else if (btn.tipo === 'chapeu') {
      if (btn.id === 'nenhum') {
        this.chouchou.setChapeu(null)
      } else if (typeof SPRITES_CHAPEU !== 'undefined' && SPRITES_CHAPEU[btn.id]) {
        this.chouchou.setChapeu(SPRITES_CHAPEU[btn.id])
      }
    }
  }
}