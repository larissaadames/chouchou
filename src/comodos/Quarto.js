class Quarto {
    constructor() {
        this.nome = 'Quarto'
    }

    update() {}

    draw() {
        background('#1a1a2e')

        // chão
        fill('#2d2d44')
        noStroke()
        rect(0, height * 0.75, width, height * 0.25)

        // placeholder da cama
        fill('#3a3a5c')
        rect(40, height * 0.55, 160, 90, 8)
        fill('#5a5a8a')
        rect(40, height * 0.55, 160, 30, 8)

        // placeholder do POU (centro)
        fill('#e94560')
        ellipse(width / 2, height * 0.55, 110, 110)
        fill(255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(13)
        text('[ POU ]', width / 2, height * 0.55)
    }

    mousePressed() {}
}