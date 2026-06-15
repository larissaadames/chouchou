// ─── SceneManager ─────────────────────────────────────────────────────────────
// Controla qual cena está ativa e repassa update/draw/eventos.
// ──────────────────────────────────────────────────────────────────────────────

class SceneManager {
  constructor(chouchou) {
    this.chouchou  = chouchou
    this.cenas     = {}
    this.cenaAtiva = null

    // Registra todas as cenas do jogo
    this.registrar('home',    new HomeScene(this))
    this.registrar('comodos', new ComodoScene(this, chouchou))

    // Cena inicial
    this.irPara('home')
  }

  registrar(nome, cena) {
    this.cenas[nome] = cena
  }

  irPara(nome) {
    if (this.cenaAtiva?.aoSair)   this.cenaAtiva.aoSair()
    this.cenaAtiva = this.cenas[nome]
    if (this.cenaAtiva?.aoEntrar) this.cenaAtiva.aoEntrar()
  }

  update()        { this.cenaAtiva?.update()        }
  draw()          { this.cenaAtiva?.draw()           }
  mousePressed()  { this.cenaAtiva?.mousePressed()   }
  mouseReleased() { this.cenaAtiva?.mouseReleased()  }
}

// ─── HomeScene ────────────────────────────────────────────────────────────────
// Tela inicial com o nome do jogo e botão de entrada.
// ──────────────────────────────────────────────────────────────────────────────

class HomeScene {
  constructor(manager) {
    this.manager = manager

    // Botão "Jogar"
    this.btn = { x: 0, y: 0, w: 200, h: 56 }
  }

  aoEntrar() {
    this.btn.x = width  / 2
    this.btn.y = height / 2 + 60
    console.log('[HomeScene] entrou')
  }

  update() {}

  draw() {
    background('#0d0d1a')

    // Estrelinhas decorativas de fundo
    this._estrelas()

    // Nome do jogo
    textAlign(CENTER, CENTER)
    noStroke()

    fill('#c084fc') // roxo suave
    textSize(64)
    textStyle(BOLD)
    text('Chouchou', width / 2, height / 2 - 100)
    textStyle(NORMAL)

    fill(255, 255, 255, 160)
    textSize(16)
    text('seu bichinho virtual', width / 2, height / 2 - 40)

    // Botão jogar
    this._desenharBotao(this.btn.x, this.btn.y, 'JOGAR ▶')
  }

  _estrelas() {
    // Estrelinhas fixas geradas com seed para não piscar
    randomSeed(42)
    fill(255, 255, 255, 80)
    noStroke()
    for (let i = 0; i < 60; i++) {
      const sx = random(width)
      const sy = random(height * 0.7)
      const sr = random(1, 3)
      ellipse(sx, sy, sr, sr)
    }
  }

  _desenharBotao(x, y, label) {
    const { w, h } = this.btn

    // Sombra
    fill(0, 0, 0, 60)
    noStroke()
    rect(x - w/2 + 4, y - h/2 + 4, w, h, 16)

    // Corpo
    fill('#7c3aed')
    rect(x - w/2, y - h/2, w, h, 16)

    // Brilho superior
    fill(255, 255, 255, 30)
    rect(x - w/2 + 4, y - h/2 + 4, w - 8, h/2 - 4, 12)

    // Texto
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(20)
    textStyle(BOLD)
    text(label, x, y)
    textStyle(NORMAL)
  }

  mousePressed() {
    const { x, y, w, h } = this.btn
    if (mouseX > x - w/2 && mouseX < x + w/2 &&
        mouseY > y - h/2 && mouseY < y + h/2) {
      this.manager.irPara('comodos')
    }
  }
}

// ─── ComodoScene ──────────────────────────────────────────────────────────────
// Shell que gerencia navegação entre cômodos.
// Cada cômodo é independente — só adicionar ao array para expandir.
// ──────────────────────────────────────────────────────────────────────────────

class ComodoScene {
  constructor(manager, chouchou) {
    this.manager   = manager
    this.chouchou  = chouchou
    this.indice    = 0

    // ── Lista de cômodos ──────────────────────────────────────────────────
    // Para adicionar um novo cômodo:
    //   1. Crie src/comodos/NomeDoComodo.js
    //   2. Adicione a tag <script> no index.html (antes do SceneManager)
    //   3. Instancie aqui: new NomeDoComodo(chouchou)
    this.comodos = [
      new Quarto(chouchou),
      new Cozinha(chouchou),
      new Banheiro(chouchou),
      new Jardim(chouchou),
      new SalaJogos(chouchou),
    ]

    // Áreas de toque dos botões do HUD (calculadas no aoEntrar)
    this.areaVoltar   = {}
    this.areaSetaEsq  = {}
    this.areaSetaDir  = {}
  }

  get comodoAtivo() {
    return this.comodos[this.indice]
  }

  irProximo() {
    this.indice = (this.indice + 1) % this.comodos.length
  }

  irAnterior() {
    this.indice = (this.indice - 1 + this.comodos.length) % this.comodos.length
  }

  aoEntrar() {
    // Inicializa a posição do Chouchou agora que o canvas existe
    this.chouchou.inicializar()

    // Calcula áreas de toque do HUD uma única vez
    this.areaVoltar  = { x: 12,            y: 14, w: 80,  h: 38 }
    this.areaSetaEsq = { x: width/2 - 140, y: 14, w: 42,  h: 38 }
    this.areaSetaDir = { x: width/2 + 98,  y: 14, w: 42,  h: 38 }

    console.log(`[ComodoScene] entrou → ${this.comodoAtivo.nome}`)
  }

  update() {
    this.chouchou.update()
    this.comodoAtivo.update()
  }

  draw() {
    this.comodoAtivo.draw()  // fundo + cenário + Chouchou
    this._hudStats()         // barra de stats embaixo
    this._hud()              // HUD de navegação sempre por cima
  }

  // ── HUD de Stats (parte de baixo) ─────────────────────────────────────────
  // Exibe fome, humor e saúde numa faixa fixa acima da barra de navegação.
  // A altura da faixa é HUD_STATS_H = 72px, posicionada no rodapé do canvas.
  _hudStats() {
    const faixaH = 72
    const faixaY = height - faixaH

    // Fundo semi-transparente
    noStroke()
    fill(0, 0, 0, 160)
    rect(0, faixaY, width, faixaH)

    // Linha divisória sutil no topo da faixa
    stroke(255, 255, 255, 30)
    strokeWeight(1)
    line(0, faixaY, width, faixaY)
    noStroke()

    // ── Desenha cada stat ────────────────────────────────────────────────────
    // As 3 stats são distribuídas em colunas iguais dentro da faixa.
    const stats    = this.chouchou.stats
    const chaves   = Object.keys(stats)   // ['fome', 'humor', 'saude']
    const colunaW  = width / chaves.length
    const barraW   = colunaW * 0.72       // barra ocupa 72% da coluna
    const barraH   = 10
    const barraY   = faixaY + 44          // posição vertical da barra

    chaves.forEach((chave, i) => {
      const stat  = stats[chave]
      const cx    = colunaW * i + colunaW / 2  // centro X da coluna
      const pct   = stat.valor / stat.max       // 0.0 → 1.0

      // ── Ícone + nome ──────────────────────────────────────────────────────
      textAlign(CENTER, CENTER)
      noStroke()

      textSize(16)
      text(stat.icone, cx, faixaY + 14)

      fill(255, 255, 255, 200)
      textSize(11)
      text(chave.toUpperCase(), cx, faixaY + 30)

      // ── Barra de fundo (trilha) ───────────────────────────────────────────
      fill(255, 255, 255, 25)
      rect(cx - barraW / 2, barraY, barraW, barraH, 6)

      // ── Barra de preenchimento ────────────────────────────────────────────
      // A cor muda conforme o valor: crítico (< 25%) fica vermelho.
      const corBarra = pct < 0.25 ? '#ef4444' : stat.cor
      fill(corBarra)
      rect(cx - barraW / 2, barraY, barraW * pct, barraH, 6)

      // ── Valor numérico ────────────────────────────────────────────────────
      fill(255, 255, 255, 180)
      textSize(10)
      text(`${floor(stat.valor)}`, cx + barraW / 2 + 10, barraY + barraH / 2)
    })
  }

  // ── HUD ───────────────────────────────────────────────────────────────────
  _hud() {
    // Faixa do topo semi-transparente
    fill(0, 0, 0, 140)
    noStroke()
    rect(0, 0, width, 66)

    // ── Botão Voltar ──────────────────────────────────────────────────────
    const v = this.areaVoltar
    fill(255, 255, 255, 25)
    rect(v.x, v.y, v.w, v.h, 10)
    fill(255)
    noStroke()
    textAlign(CENTER, CENTER)
    textSize(13)
    text('← Voltar', v.x + v.w/2, v.y + v.h/2)

    // ── Seta esquerda ─────────────────────────────────────────────────────
    const se = this.areaSetaEsq
    fill(255, 255, 255, 25)
    rect(se.x, se.y, se.w, se.h, 10)
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(22)
    text('‹', se.x + se.w/2, se.y + se.h/2)

    // ── Nome do cômodo ────────────────────────────────────────────────────
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(17)
    textStyle(BOLD)
    text(this.comodoAtivo.nome, width/2, 33)
    textStyle(NORMAL)

    // Indicador  ex: "1 / 3"
    fill(255, 255, 255, 140)
    textSize(11)
    text(`${this.indice + 1} / ${this.comodos.length}`, width/2, 55)

    // ── Seta direita ──────────────────────────────────────────────────────
    const sd = this.areaSetaDir
    fill(255, 255, 255, 25)
    rect(sd.x, sd.y, sd.w, sd.h, 10)
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(22)
    text('›', sd.x + sd.w/2, sd.y + sd.h/2)
  }

  // ── Detecção de clique ────────────────────────────────────────────────────
  _dentroDA(area) {
    return mouseX > area.x && mouseX < area.x + area.w &&
            mouseY > area.y && mouseY < area.y + area.h
  }

  mousePressed() {
    if (this._dentroDA(this.areaVoltar)) {
      this.manager.irPara('home')
      return
    }
    if (this._dentroDA(this.areaSetaEsq)) {
      this.irAnterior()
      return
    }
    if (this._dentroDA(this.areaSetaDir)) {
      this.irProximo()
      return
    }

    // Repassa o clique para o cômodo (interações futuras)
    this.comodoAtivo.mousePressed()
  }

  mouseReleased() {
    // Repassa para o cômodo ativo (ex: soltar o regador no Jardim)
    this.comodoAtivo.mouseReleased?.()
  }
}