// ─── Configurações globais ────────────────────────────────────────────────────
const LARGURA = 1080
const ALTURA  = 720

// Instâncias globais acessíveis por todos os módulos
let sceneManager
let chouchou
let fonteCustomizada

// ─── preload ──────────────────────────────────────────────────────────────────
// Chamado pelo p5 antes de tudo — ideal para carregar imagens e sons
function preload() {
  chouchou = new Chouchou()
  carregarSpritesChouchou(chouchou)
  carregarCenarios()
  carregarElementos()
  carregarSons();
  carregarPreviews();
  fonteCustomizada = loadFont('assets/fonts/Pou-RMR6.ttf')
}

// ─── setup ────────────────────────────────────────────────────────────────────
function setup() {
  createCanvas(LARGURA, ALTURA)
  textFont(fonteCustomizada)
  sceneManager = new SceneManager(chouchou)
}

// ─── draw ─────────────────────────────────────────────────────────────────────
// Loop principal — roda ~60x por segundo
function draw() {
  sceneManager.update()
  sceneManager.draw()
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
function mousePressed() {
  sceneManager.mousePressed()
}

function mouseReleased() {
  sceneManager.mouseReleased()
}
