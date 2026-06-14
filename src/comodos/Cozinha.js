class Cozinha {
    constructor() {
        this.nome = 'Cozinha'
    }

    update() {}

    draw() {
        background('#1e2d1e')

        // chão
        fill('#2a3d2a')
        noStroke()
        rect(0, height * 0.75, width, height * 0.25)

        // balcão
        fill('#4a6741')
        rect(0, height * 0.58, width, 60)

        // placeholder fogão
        fill('#2e4a2e')
        rect(width/2 - 50, height * 0.48, 100, 80, 6)
        fill('#e94560')
        ellipse(width/2 - 20, height * 0.52, 28, 28)
        ellipse(width/2 + 20, height * 0.52, 28, 28)

        fill(255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(13)
        text('[ Cozinha ]', width / 2, height * 0.35)
    }

    mousePressed() {}
}