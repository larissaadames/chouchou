class Banheiro {
    constructor() {
        this.nome = 'Banheiro'
    }

    update() {}

    draw() {
        background('#1a2a2d')

        // chão
        fill('#1e3a3e')
        noStroke()
        rect(0, height * 0.75, width, height * 0.25)

        // placeholder banheira
        fill('#2a4a50')
        rect(width/2 - 80, height * 0.5, 160, 80, 16)
        fill('#3a6a72')
        rect(width/2 - 74, height * 0.53, 148, 50, 12)

        fill(255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(13)
        text('[ Banheiro ]', width / 2, height * 0.38)
    }

    mousePressed() {}
}