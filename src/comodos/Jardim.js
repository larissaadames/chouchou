// ─── Jardim ───────────────────────────────────────────────────────────────────
// Cômodo externo onde o Chouchou pode ser hidratado com o regador.
// Mecânica: arrastar o regador até o Chouchou solta gotinhas e aumenta
// o stat de hidratação — inspirado no chuveiro do Pou original.
// ──────────────────────────────────────────────────────────────────────────────

class Jardim {
  constructor(chouchou) {
    this.nome     = 'Jardim'
    this.chouchou = chouchou

    // ── Regador ───────────────────────────────────────────────────────────────
    this.regador = {
      x:         90,   // posição inicial (canto esquerdo)
      y:         0,    // definido no primeiro draw() quando height existe
      origemX:   90,   // posição de repouso — para onde volta ao soltar
      origemY:   0,
      w:         100,
      h:         88,
      arrastando: false,
    }

    // ── Partículas de água ────────────────────────────────────────────────────
    // Cada gota: { x, y, vy, alpha }
    this.gotas = []

    // Cooldown para não aumentar a hidratação a cada frame
    this._cooldown = 0
  }

  // ── update ────────────────────────────────────────────────────────────────
  update() {
    // Segue o mouse enquanto arrasta
    if (this.regador.arrastando) {
      this.regador.x = mouseX
      this.regador.y = mouseY

      // ── Emite gotas quando o bico está acima do Chouchou ─────────────────
      const bico = this._posicaoBico()
      const dentroAlcance = dist(bico.x, bico.y, this.chouchou.x, this.chouchou.y) < 90

      if (dentroAlcance) {
        // Spawna 2 gotas por frame
        for (let i = 0; i < 2; i++) {
          this.gotas.push({
            x:     bico.x + random(-8, 8),
            y:     bico.y,
            vy:    random(3, 6),
            alpha: 255,
          })
        }

        // Aumenta hidratação com cooldown (a cada 30 frames ≈ 0.5s)
        this._cooldown--
        if (this._cooldown <= 0) {
          this.chouchou._alterarStat('hidratacao', +5)
          this.chouchou.setEstado('feliz')
          setTimeout(() => this.chouchou.setEstado('idle'), 800)
          this._cooldown = 30
        }
      }
    }

    // ── Atualiza gotas existentes ─────────────────────────────────────────
    for (const g of this.gotas) {
      g.y     += g.vy
      g.alpha -= 8
    }
    // Remove gotas invisíveis
    this.gotas = this.gotas.filter(g => g.alpha > 0)
  }

  // ── draw ──────────────────────────────────────────────────────────────────
  draw() {
    // Inicializa y do regador na primeira vez (height já existe aqui)
    if (this.regador.origemY === 0) {
      this.regador.origemY = height * 0.58
      this.regador.y       = height * 0.58
    }

    // ── Fundo: jardim ensolarado ───────────────────────────────────────────
    background('#87CEEB') // céu azul

    // Grama
    noStroke()
    fill('#4ade80')
    rect(0, height * 0.70, width, height * 0.30)

    // Grama mais escura (chão)
    fill('#16a34a')
    rect(0, height * 0.75, width, height * 0.25)

    // ── Sol ───────────────────────────────────────────────────────────────
    fill('#fde047')
    noStroke()
    ellipse(width - 70, 90, 70, 70)
    // Raios
    stroke('#fde047')
    strokeWeight(3)
    for (let a = 0; a < TWO_PI; a += PI / 4) {
      const r1 = 42, r2 = 58
      line(
        width - 70 + cos(a) * r1, 90 + sin(a) * r1,
        width - 70 + cos(a) * r2, 90 + sin(a) * r2
      )
    }
    noStroke()

    // ── Flores decorativas ────────────────────────────────────────────────
    this._flor(60,  height * 0.70, '#f472b6')
    this._flor(110, height * 0.68, '#fb923c')
    this._flor(width - 60,  height * 0.70, '#a78bfa')
    this._flor(width - 110, height * 0.68, '#34d399')

    // ── Arbustos de fundo ─────────────────────────────────────────────────
    fill('#15803d')
    ellipse(40,        height * 0.62, 90, 60)
    ellipse(width - 40, height * 0.62, 90, 60)
    fill('#16a34a')
    ellipse(40,        height * 0.60, 70, 50)
    ellipse(width - 40, height * 0.60, 70, 50)

    // ── Chouchou ──────────────────────────────────────────────────────────
    this.chouchou.draw()

    // ── Gotas de água ─────────────────────────────────────────────────────
    noStroke()
    for (const g of this.gotas) {
      fill(96, 165, 250, g.alpha) // azul claro
      ellipse(g.x, g.y, 6, 9)
    }

    // ── Regador ───────────────────────────────────────────────────────────
    this._desenharRegador(this.regador.x, this.regador.y)

    // ── Dica inicial ──────────────────────────────────────────────────────
    if (!this.regador.arrastando && this.gotas.length === 0) {
      fill(255, 255, 255, 180)
      noStroke()
      textAlign(CENTER, CENTER)
      textSize(13)
      text('Arraste o regador até o Chouchou 💧', width / 2, height * 0.88)
    }
  }

  // ── Desenha o regador com formas p5 ───────────────────────────────────────
  _desenharRegador(x, y) {
    push()
    translate(x, y)
    scale(1.6) // dobra o tamanho visual sem reescrever cada coordenada

    noStroke()

    // Cabo (retângulo inclinado)
    fill('#92400e')
    rect(-28, -10, 34, 12, 4)

    // Corpo principal (balde)
    fill('#38bdf8')
    rect(-10, -22, 38, 30, 6)

    // Detalhe brilho no corpo
    fill(255, 255, 255, 60)
    rect(-6, -18, 12, 20, 4)

    // Alça do cabo (semicírculo)
    noFill()
    stroke('#92400e')
    strokeWeight(5)
    arc(-20, -10, 24, 28, -HALF_PI, HALF_PI)
    noStroke()

    // Bico (tubo saindo do lado direito)
    fill('#0284c7')
    rect(26, -8, 22, 8, 0, 4, 4, 0)

    // Ponta do bico (roseta com furinhos)
    fill('#0369a1')
    ellipse(50, -4, 14, 14)
    fill('#7dd3fc')
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TWO_PI
      ellipse(50 + cos(a) * 3.5, -4 + sin(a) * 3.5, 2.5, 2.5)
    }
    ellipse(50, -4, 2.5, 2.5)

    pop()
  }

  // ── Posição do bico do regador (ponta de onde sai a água) ─────────────────
  _posicaoBico() {
    // O scale(1.6) desloca o bico — compensamos multiplicando a offset pelo fator
    return { x: this.regador.x + 50 * 1.6, y: this.regador.y - 4 * 1.6 }
  }

  // ── Florzinha decorativa ───────────────────────────────────────────────────
  _flor(x, y, cor) {
    noStroke()
    // Caule
    fill('#15803d')
    rect(x - 2, y, 4, 22)
    // Pétalas
    fill(cor)
    for (let a = 0; a < TWO_PI; a += PI / 3) {
      ellipse(x + cos(a) * 9, y - 4 + sin(a) * 9, 10, 10)
    }
    // Centro
    fill('#fde047')
    ellipse(x, y - 4, 11, 11)
  }

  // ── Eventos de mouse ──────────────────────────────────────────────────────
  mousePressed() {
    const r = this.regador
    // Verifica se clicou perto do regador (área generosa para toque mobile)
    if (dist(mouseX, mouseY, r.x, r.y) < 80) {
      r.arrastando = true
    }

    // Toque no Chouchou diretamente
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
    }
  }

  mouseReleased() {
    // Solta o regador e volta para a posição de repouso
    this.regador.arrastando = false
    this.regador.x = this.regador.origemX
    this.regador.y = this.regador.origemY
    this._cooldown = 0
  }
}
