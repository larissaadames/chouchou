class SceneManager {
    constructor() {
        this.cenas = {}
        this.cenaAtiva = null

        this.registrar('home', new HomeScene(this))
        this.registrar('comodos', new ComodoScene(this))
        this.irPara('home')
    }

    registrar(nome, cena) {
        this.cenas[nome] = cena
    }

    irPara(nome) {
        if (this.cenaAtiva?.aoSair) this.cenaAtiva.aoSair()
        this.cenaAtiva = this.cenas[nome]
        if (this.cenaAtiva?.aoEntrar) this.cenaAtiva.aoEntrar()
    }

    update() { this.cenaAtiva?.update() }
    draw()   { this.cenaAtiva?.draw()   }
    mousePressed() { this.cenaAtiva?.mousePressed() }
    }

    // ── HOME ────────────────────────────────────────────────────────────────────

    class HomeScene {
    constructor(manager) { this.manager = manager }

    aoEntrar() { console.log('Home') }
    update() {}

    draw() {
        background('#0f3460')

        fill('#e94560')
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(52)
        text('POU', width / 2, height / 2 - 120)

        fill(255)
        textSize(18)
        text('uma releitura', width / 2, height / 2 - 70)

        this._botao(width / 2, height / 2 + 40, 'JOGAR')
    }

    _botao(x, y, label) {
        const w = 180, h = 52
        fill(0, 0, 0, 60)
        noStroke()
        rect(x - w/2 + 4, y - h/2 + 4, w, h, 14)
        fill('#e94560')
        rect(x - w/2, y - h/2, w, h, 14)
        fill(255)
        textSize(20)
        textAlign(CENTER, CENTER)
        text(label, x, y)
    }

    mousePressed() {
        const w = 180, h = 52
        const x = width / 2, y = height / 2 + 40
        if (mouseX > x - w/2 && mouseX < x + w/2 &&
            mouseY > y - h/2 && mouseY < y + h/2) {
        this.manager.irPara('comodos')
        }
    }
    }

    // ── GERENCIADOR DE CÔMODOS ───────────────────────────────────────────────────

    class ComodoScene {
    constructor(manager) {
        this.manager = manager
        this.indice  = 0  // qual cômodo está visível agora

        // lista de cômodos — só adicionar aqui quando criar um novo
        this.comodos = [
        new Quarto(),
        new Cozinha(),
        new Banheiro(),
        ]
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

    aoEntrar() { console.log('Cômodos') }

    update() {
        this.comodoAtivo.update()
    }

    draw() {
        this.comodoAtivo.draw()   // deixa o cômodo desenhar o fundo e conteúdo
        this._hud()               // HUD fica por cima de tudo
    }

    // HUD: barra do topo com nome e setas, botão voltar
    _hud() {
        // faixa do topo
        fill(0, 0, 0, 120)
        noStroke()
        rect(0, 0, width, 64)

        // botão voltar
        fill(255, 255, 255, 30)
        rect(12, 14, 70, 36, 10)
        fill(255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(13)
        text('← Voltar', 47, 32)

        // seta esquerda
        fill(255, 255, 255, 40)
        rect(width/2 - 130, 14, 36, 36, 8)
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(18)
        text('‹', width/2 - 112, 33)

        // nome do cômodo
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(17)
        textStyle(BOLD)
        text(this.comodoAtivo.nome, width/2, 32)
        textStyle(NORMAL)

        // indicador de posição  ex: "2 / 3"
        fill(255, 255, 255, 150)
        textSize(11)
        text(`${this.indice + 1} / ${this.comodos.length}`, width/2, 54)

        // seta direita
        fill(255, 255, 255, 40)
        rect(width/2 + 94, 14, 36, 36, 8)
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(18)
        text('›', width/2 + 112, 33)
    }

    mousePressed() {
        // botão voltar
        if (mouseX > 12 && mouseX < 82 && mouseY > 14 && mouseY < 50) {
        this.manager.irPara('home')
        return
        }

        // seta esquerda
        if (mouseX > width/2 - 130 && mouseX < width/2 - 94 &&
            mouseY > 14 && mouseY < 50) {
        this.irAnterior()
        return
        }

        // seta direita
        if (mouseX > width/2 + 94 && mouseX < width/2 + 130 &&
            mouseY > 14 && mouseY < 50) {
        this.irProximo()
        return
        }

        // repassa o clique para o cômodo (para interações futuras)
        this.comodoAtivo.mousePressed()
    }
}