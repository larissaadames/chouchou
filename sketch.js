// Dimensões do canvas — parecido com tela de celular
const LARGURA = 390
const ALTURA = 844

let sceneManager

function setup() {
    createCanvas(LARGURA, ALTURA)
    sceneManager = new SceneManager()
}

function draw() {
    sceneManager.update()
    sceneManager.draw()
}

// Repassa eventos de clique para a cena ativa
function mousePressed() {
    sceneManager.mousePressed()
}   