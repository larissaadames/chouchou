// ─── FoodSystem ───────────────────────────────────────────────────────────────
// Gerencia todos os aspectos de alimentação do Chouchou.
//
// CONCEITOS PRINCIPAIS:
//
//   CATÁLOGO  → todas as comidas que existem no jogo (definidas aqui em baixo).
//               Cada entrada tem: id, nome, icone, cor, e quanto aumenta a fome.
//               Para adicionar uma comida nova ao jogo, basta adicionar no catálogo.
//
//   INVENTÁRIO → array de IDs que o jogador possui.
//               ['nitrogenio', 'fosforo', ...]
//               A loja (fase 8) só precisará fazer:
//                 foodSystem.inventario.push('fosforo')
//               E para remover:
//                 foodSystem.removerDoInventario('fosforo')
//
//   ITEM ATIVO → o elemento que está fixo na tela esperando ser arrastado.
//               Selecionado via menu da geladeira (ou aleatório no início).
//
// FLUXO DA MECÂNICA:
//   1. Jogador clica na geladeira → menu abre com os itens do inventário
//   2. Jogador clica num item → item aparece fixo no centro-baixo da tela
//   3. Jogador arrasta o item até o Chouchou → Chouchou come, fome aumenta
//   4. Item some, próximo item aleatório do inventário aparece
// ─────────────────────────────────────────────────────────────────────────────

// ── Catálogo global de comidas ────────────────────────────────────────────────
// Fica fora da classe para ser fácil de expandir sem mexer na lógica.
// Para adicionar um novo elemento: copie um bloco e ajuste os valores.
const CATALOGO_COMIDAS = {
  nitrogenio: {
    id:        'nitrogenio',
    nome:      'Nitrogênio',
    simbolo:   'N',
    cor:       '#4ade80',
    corEscura: '#15803d',
    fome:      +20,
    imagem:    null, // carregado em carregarElementos() no ChouchouLoader.js
  },

  // ── Próximos elementos (comentados — descomente quando quiser adicionar) ──
  // fosforo: {
  //   id: 'fosforo', nome: 'Fósforo', simbolo: 'P',
  //   cor: '#fb923c', corEscura: '#c2410c', fome: +15, imagem: null,
  // },
  // potassio: {
  //   id: 'potassio', nome: 'Potássio', simbolo: 'K',
  //   cor: '#a78bfa', corEscura: '#6d28d9', fome: +18, imagem: null,
  // },
  // calcio: {
  //   id: 'calcio', nome: 'Cálcio', simbolo: 'Ca',
  //   cor: '#f9a8d4', corEscura: '#be185d', fome: +12, imagem: null,
  // },
  // magnesio: {
  //   id: 'magnesio', nome: 'Magnésio', simbolo: 'Mg',
  //   cor: '#67e8f9', corEscura: '#0e7490', fome: +10, imagem: null,
  // },
  // enxofre: {
  //   id: 'enxofre', nome: 'Enxofre', simbolo: 'S',
  //   cor: '#fde047', corEscura: '#a16207', fome: +8, imagem: null,
  // },
}

// ─────────────────────────────────────────────────────────────────────────────

class FoodSystem {
  constructor(chouchou) {
    this.chouchou = chouchou

    // ── Inventário do jogador ─────────────────────────────────────────────────
    // Array de IDs. Começa com Nitrogênio para testar a mecânica.
    // Futuramente virá do SaveSystem (fase 7).
    this.inventario = ['nitrogenio']

    // ── Geladeira (área clicável) ─────────────────────────────────────────────
    // Posição definida em draw() quando width/height já existem.
    this.geladeira = { x: 0, y: 0, w: 70, h: 110, pronta: false }

    // ── Menu da geladeira ─────────────────────────────────────────────────────
    this.menuAberto = false
    this.opcoesMenu = [] // posições dos botões renderizados no menu

    // ── Item ativo (sendo exibido / arrastado) ────────────────────────────────
    this.itemAtivo = null   // { ...def do catálogo, x, y, fixoX, fixoY, arrastando }

    // Raio de colisão para detectar "chegou perto o suficiente do Chouchou"
    this.RAIO_COMER = 80
  }

  // ── API pública: inventário ────────────────────────────────────────────────

  // Adiciona um elemento ao inventário do jogador (ex: compra na loja)
  adicionarAoInventario(id) {
    if (!CATALOGO_COMIDAS[id]) {
      console.warn(`FoodSystem: "${id}" não existe no catálogo.`)
      return
    }
    if (!this.inventario.includes(id)) {
      this.inventario.push(id)
    }
  }

  // Remove um elemento do inventário
  removerDoInventario(id) {
    this.inventario = this.inventario.filter(i => i !== id)
    // Se o item removido era o ativo, sorteia outro
    if (this.itemAtivo?.id === id) {
      this._sortearItemAtivo()
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  update() {
    // Inicializa a geladeira na primeira vez (width/height disponíveis aqui)
    if (!this.geladeira.pronta) {
      this.geladeira.x     = width - this.geladeira.w - 12
      this.geladeira.y     = height * 0.32
      this.geladeira.pronta = true

      // Sorteia o primeiro item automaticamente
      this._sortearItemAtivo()
    }

    // Segue o dedo/mouse enquanto arrasta
    if (this.itemAtivo?.arrastando) {
      this.itemAtivo.x = mouseX
      this.itemAtivo.y = mouseY

      // Abre a boca quando a comida está perto o suficiente
      const perto = dist(mouseX, mouseY, this.chouchou.x, this.chouchou.y) < this.RAIO_COMER
      this.chouchou.setEstado(perto ? 'bocaAberta' : 'idle')
    }
  }

  // ── Draw ──────────────────────────────────────────────────────────────────
  draw() {
    if (!this.geladeira.pronta) return

    push() // isola todo o estado gráfico do FoodSystem
    this._desenharGeladeira()
    if (this.menuAberto) this._desenharMenu()
    if (this.itemAtivo)  {
        this._desenharElemento(
        this.itemAtivo.x,
        this.itemAtivo.y,
        this.itemAtivo,
        this.itemAtivo.arrastando ? 1.1 : 1.0
      )
    }
    pop() // restaura textAlign, fill, stroke, etc. para o SceneManager
  }

  // ── Eventos de mouse ──────────────────────────────────────────────────────

  mousePressed() {
    // ── Clicou na geladeira → abre/fecha menu ────────────────────────────────
    if (this._dentroGeladeira(mouseX, mouseY)) {
      this.menuAberto = !this.menuAberto
      return
    }

    // ── Menu aberto → clicou num item do menu ────────────────────────────────
    if (this.menuAberto) {
      for (const opcao of this.opcoesMenu) {
        if (dist(mouseX, mouseY, opcao.x, opcao.y) < 32) {
          this._selecionarItem(opcao.id)
          this.menuAberto = false
          return
        }
      }
      // Clicou fora do menu → fecha
      this.menuAberto = false
      return
    }

    // ── Clicou no item ativo → inicia arrasto ────────────────────────────────
    if (this.itemAtivo && !this.itemAtivo.arrastando) {
      if (dist(mouseX, mouseY, this.itemAtivo.x, this.itemAtivo.y) < 40) {
        this.itemAtivo.arrastando = true
      }
    }
  }

  mouseReleased() {
    if (!this.itemAtivo?.arrastando) return

    // ── Verificar se soltou perto do Chouchou ────────────────────────────────
    if (dist(this.itemAtivo.x, this.itemAtivo.y,
              this.chouchou.x, this.chouchou.y) < this.RAIO_COMER) {
      this._alimentar(this.itemAtivo)
    } else {
      // Não chegou — volta para a posição fixa
      this.itemAtivo.x = this.itemAtivo.fixoX
      this.itemAtivo.y = this.itemAtivo.fixoY
    }

    this.itemAtivo.arrastando = false

    // Garante que o estado volta para idle se não comeu
    if (this.chouchou.estado === 'bocaAberta') {
      this.chouchou.setEstado('idle')
    }
  }

  // ── Privados: lógica ──────────────────────────────────────────────────────

  // Sorteia um item aleatório do inventário e o coloca na posição fixa
  _sortearItemAtivo() {
    if (this.inventario.length === 0) {
      this.itemAtivo = null
      return
    }

    const id  = this.inventario[floor(random(this.inventario.length))]
    const def = CATALOGO_COMIDAS[id]

    // Posição fixa: centro horizontal, próximo ao rodapé (acima da HUD)
    const fixoX = width / 2
    const fixoY = height - 140  // acima da barra de stats (72px) + margem

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false }
  }

  // Seleciona um item específico do menu
  _selecionarItem(id) {
    const def    = CATALOGO_COMIDAS[id]
    const fixoX  = width / 2
    const fixoY  = height - 140

    this.itemAtivo = { ...def, x: fixoX, y: fixoY, fixoX, fixoY, arrastando: false }
  }

  // Aplica o efeito de comer e sorteia próximo item
  _alimentar(item) {
    this.chouchou._alterarStat('fome', item.fome)
    this.chouchou.setEstado('comendo')
    setTimeout(() => this.chouchou.setEstado('idle'), 1200)

    // Pequeno delay para parecer que "engoliu" antes do próximo aparecer
    setTimeout(() => this._sortearItemAtivo(), 600)
    this.itemAtivo = null
  }

  // ── Privados: desenho ─────────────────────────────────────────────────────

  _desenharGeladeira() {
    const { x, y, w, h } = this.geladeira

    // Corpo
    noStroke()
    fill('#e2e8f0')
    rect(x, y, w, h, 8)

    // Franja superior (congelador)
    fill('#cbd5e1')
    rect(x, y, w, h * 0.35, 8, 8, 0, 0)

    // Alça esquerda
    fill('#94a3b8')
    rect(x + 8, y + h * 0.18, 6, 26, 3)
    rect(x + 8, y + h * 0.52, 6, 26, 3)

    // Detalhe brilho
    fill(255, 255, 255, 80)
    rect(x + w - 14, y + 6, 6, h - 12, 3)

    // Ícone de temperatura (termômetro simples)
    fill('#64748b')
    textAlign(CENTER, CENTER)
    textSize(18)
    text('🧊', x + w / 2 + 6, y + h * 0.18)

    // Indicador de que é clicável (piscada sutil)
    if (frameCount % 90 < 45) {
      fill(74, 222, 128, 180)
      ellipse(x + w - 10, y + 10, 10, 10)
    }
  }

  _desenharMenu() {
    this.opcoesMenu = [] // recalcula a cada frame

    const itens   = this.inventario
    const menuX   = this.geladeira.x - 130
    const menuY   = this.geladeira.y
    const itemH   = 52
    const menuW   = 120

    // Fundo do menu
    noStroke()
    fill(15, 23, 42, 220) // quase preto translúcido
    rect(menuX, menuY, menuW, itens.length * itemH + 16, 10)

    // Título
    fill(255, 255, 255, 150)
    textSize(10)
    textAlign(LEFT, TOP)
    text('ELEMENTOS', menuX + 10, menuY + 6)

    // Itens
    itens.forEach((id, i) => {
      const def = CATALOGO_COMIDAS[id]
      const cx  = menuX + menuW / 2
      const cy  = menuY + 24 + i * itemH + itemH / 2

      this.opcoesMenu.push({ id, x: cx, y: cy })

      // Fundo do item (destaque ao hover)
      const hover = dist(mouseX, mouseY, cx, cy) < 32
      fill(hover ? 80 : 30)
      rect(menuX + 8, cy - 20, menuW - 16, 40, 6)

      // Ícone do elemento (círculo com símbolo)
      fill(def.cor)
      ellipse(cx, cy - 4, 28, 28)
      fill('#fff')
      textSize(11)
      textAlign(CENTER, CENTER)
      text(def.simbolo, cx, cy - 4)

      // Nome
      fill(255, 255, 255, 200)
      textSize(9)
      text(def.nome, cx, cy + 14)
    })
  }

  _desenharElemento(x, y, def, escala = 1.0) {
    push()
    translate(x, y)
    scale(escala)
    noStroke()

    // Sombra
    fill(0, 0, 0, 40)
    ellipse(2, 4, 56, 56)

    if (def.imagem) {
      // PNG do elemento
      imageMode(CENTER)
      image(def.imagem, 0, 0, 80, 80)
    } else {
      // Fallback: círculo com símbolo químico
      fill(def.cor)
      ellipse(0, 0, 52, 52)

      // Brilho interno (só no fallback, ficaria estranho sobre PNG)
      fill(255, 255, 255, 60)
      ellipse(-8, -10, 20, 16)

      fill('#fff')
      textAlign(CENTER, CENTER)
      textSize(def.simbolo.length > 1 ? 14 : 18)
      textStyle(BOLD)
      text(def.simbolo, 0, 0)
      textStyle(NORMAL)
    }

    // Nome abaixo do ícone (sempre visível)
    fill(255, 255, 255, 200)
    textAlign(CENTER, CENTER)
    textSize(9)
    text(def.nome, 0, 50)

    pop()
  }

  // Helpers
  _dentroGeladeira(px, py) {
    const { x, y, w, h } = this.geladeira
    return px >= x && px <= x + w && py >= y && py <= y + h
  }
}
