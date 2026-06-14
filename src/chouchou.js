class Pou {
    constructor() {
        // cor do corpo (usuário pode mudar depois)
        this.cor = { r: 180, g: 130, b: 80 } // marrom padrão igual ao POU original

        // estado atual
        this.estado = 'idle' // idle | feliz | comendo | triste | dormindo

        // animação
        this.frameAtual   = 0
        this.frameTimer   = 0
        this.frameDuracao = 12 // quantos frames do p5 cada sprite fica visível

        // posição (centralizado)
        this.x = width  / 2
        this.y = height / 2

        // sprites carregados no preload (por estado)
        // this.sprites é preenchido pelo PouLoader — veja abaixo
        this.sprites = {
        corpo:    {},   // { idle: [img, img], dormindo: [img] ... }
        expressao: {},  // { feliz: img, triste: img ... }
        roupa:     null
        }
    }

    setEstado(novoEstado) {
        if (this.estado === novoEstado) return
        this.estado    = novoEstado
        this.frameAtual = 0   // reinicia animação ao trocar estado
        this.frameTimer = 0
    }

    setCor(r, g, b) {
        this.cor = { r, g, b }
    }

    update() {
        // avança o frame da animação
        this.frameTimer++
        if (this.frameTimer >= this.frameDuracao) {
        this.frameTimer = 0
        const frames = this.sprites.corpo[this.estado] ?? []
        if (frames.length > 0) {
            this.frameAtual = (this.frameAtual + 1) % frames.length
        }
        }
    }

    draw() {
        const frames    = this.sprites.corpo[this.estado] ?? []
        const expressao = this.sprites.expressao[this.estado] ?? null
        const roupa     = this.sprites.roupa

        push() // isola transformações
        imageMode(CENTER)

        // 1. corpo base com a cor do usuário
        if (frames.length > 0) {
        tint(this.cor.r, this.cor.g, this.cor.b)
        image(frames[this.frameAtual], this.x, this.y)
        noTint()
        } else {
        // placeholder enquanto não tem sprite
        this._placeholder()
        }

        // 2. expressão por cima (sem tint — mantém as cores originais)
        if (expressao) image(expressao, this.x, this.y)

        // 3. roupa por cima de tudo
        if (roupa) image(roupa, this.x, this.y)

        pop()
    }

    // desenhado enquanto os sprites não existem ainda
    _placeholder() {
        tint(this.cor.r, this.cor.g, this.cor.b)
        noStroke()
        ellipse(this.x, this.y, 120, 120)
        noTint()
        fill(30)
        ellipse(this.x - 20, this.y - 10, 18, 20)
        ellipse(this.x + 20, this.y - 10, 18, 20)
        fill(255)
        ellipse(this.x - 16, this.y - 12, 8, 10)
        ellipse(this.x + 24, this.y - 12, 8, 10)
    }
}