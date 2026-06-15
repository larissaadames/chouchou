// ─── ChouchouLoader ───────────────────────────────────────────────────────────
// Carrega todos os sprites, fundos e objetos do jogo.
// Todas as funções aqui são chamadas dentro do preload() do p5.js.
// ──────────────────────────────────────────────────────────────────────────────



function carregarSpritesChouchou(chouchou) {

  // ── Corpo (cor aplicada via tint) ─────────────────────────────────────────
  chouchou.sprites.corpo = {
    idle:       [loadImage('assets/sprites/corpo/idle01.png')],
    feliz:      [loadImage('assets/sprites/corpo/idle01.png')],
    bocaAberta: [loadImage('assets/sprites/corpo/idle01.png')],
    comendo:    [loadImage('assets/sprites/corpo/idle01.png')],
    triste:     [loadImage('assets/sprites/corpo/idle01.png')],
    dormindo:   [loadImage('assets/sprites/corpo/idle01.png')],
  }

  // ── Expressões (desenhadas por cima do corpo, sem tint) ───────────────────
  chouchou.sprites.expressao = {
    idle:       loadImage('assets/sprites/expressoes/ccBravo.png'),
    feliz:      loadImage('assets/sprites/expressoes/ccFeliz.png'),
    bocaAberta: loadImage('assets/sprites/expressoes/ccBocaAberta.png'),
    comendo:  [ loadImage('assets/sprites/expressoes/ccBocaAberta.png'),
                loadImage('assets/sprites/expressoes/ccBocaFechada.png') ],
    triste:     loadImage('assets/sprites/expressoes/ccMal.png'),
    dormindo:   null,
  }

  chouchou.sprites.roupa  = null
  chouchou.sprites.chapeu = null
}

// ── Fundos e objetos de cenário ───────────────────────────────────────────────
// Objeto global acessível pelos cômodos.
const SPRITES_CENARIO = {}

function carregarCenarios() {
  SPRITES_CENARIO.laboratorio    = loadImage('assets/sprites/fundos/laboratorio.png')
  SPRITES_CENARIO.quarto         = loadImage('assets/sprites/fundos/quarto.png')
  SPRITES_CENARIO.jardim         = loadImage('assets/sprites/fundos/jardim.png')
  SPRITES_CENARIO.salajogos      = loadImage('assets/sprites/fundos/salajogos.png')
  SPRITES_CENARIO.food_drop       = loadImage('assets/sprites/fundos/food_drop.png')
}

// ── Elementos químicos ────────────────────────────────────────────────────────
// Para adicionar um novo elemento: descomente no CATALOGO_COMIDAS (FoodSystem.js)
// e adicione a linha loadImage correspondente aqui.
let SPRITES_OBJETOS = {};
let SPRITES_ROUPAS = {};
let SPRITES_CHAPEU = {};

function carregarElementos() {
  CATALOGO_COMIDAS.nitrogenio.imagem = loadImage('assets/sprites/elementos/nitrogenio_N.png')
  CATALOGO_COMIDAS.fosforo.imagem    = loadImage('assets/sprites/elementos/fosforo_P.png')
  CATALOGO_COMIDAS.potassio.imagem   = loadImage('assets/sprites/elementos/potassio_K.png')
  CATALOGO_COMIDAS.calcio.imagem     = loadImage('assets/sprites/elementos/calcio_Ca.png')
  CATALOGO_COMIDAS.magnesio.imagem   = loadImage('assets/sprites/elementos/magnesio_Mg.png')
  CATALOGO_COMIDAS.enxofre.imagem    = loadImage('assets/sprites/elementos/enxofre_S.png')

  SPRITES_OBJETOS.regador            = loadImage('assets/sprites/objetos/regador.png')
  SPRITES_OBJETOS.armario            = loadImage('assets/sprites/objetos/armario.png')
  SPRITES_OBJETOS.disparervilha = loadImage('assets/sprites/objetos/disparervilha.png')
  SPRITES_OBJETOS.sol = loadImage('assets/sprites/objetos/sol.png')

  SPRITES_ROUPAS.camisa10 = loadImage('assets/sprites/roupas/camisa10.png')
  SPRITES_ROUPAS.saia     = loadImage('assets/sprites/roupas/saia.png')
  SPRITES_ROUPAS.terno    = loadImage('assets/sprites/roupas/terno.png')
  SPRITES_CHAPEU.caule   = loadImage('assets/sprites/chapeu/caule.png');
  SPRITES_CHAPEU.lacinho = loadImage('assets/sprites/chapeu/lacinho.png');
  SPRITES_CHAPEU.panela  = loadImage('assets/sprites/chapeu/panela.png');

}
const SPRITES_PREVIEWS = {}

function carregarPreviews(){
  SPRITES_PREVIEWS.jogocomida = loadImage('assets/sprites/previews/food_drop.png');
  // SPRITES_PREVIEWS.jogoqueda = loadImage('assets/sprites/previews/free_fall.png');

}

// SONS DO CHOUCHOU --------------------------------------------- 

const SONS_CHOUCHOU = {}

function carregarSons() {

// Array com os sons de toque/carinho
  SONS_CHOUCHOU.nhaa = [
    loadSound('assets/sounds/chouchou/som_nhaa_01.wav'),
    loadSound('assets/sounds/chouchou/som_nhaa_02.wav')
  ];

  // Array com as variações de mastigação
  SONS_CHOUCHOU.nham = [
    loadSound('assets/sounds/chouchou/som_nham_01.wav'),
    loadSound('assets/sounds/chouchou/som_nham_02.wav'),
    loadSound('assets/sounds/chouchou/som_nham_03.wav'),
    loadSound('assets/sounds/chouchou/som_nham_04.wav')
  ];

  SONS_CHOUCHOU.musica_fooddrop = loadSound('assets/sounds/songs/fooddrop.mp3');
  SONS_CHOUCHOU.game_over = loadSound('assets/sounds/effects/game-over.mp3');
  SONS_CHOUCHOU.sun_pickup = loadSound('assets/sounds/effects/sun-pickup.mp3');
  SONS_CHOUCHOU.free_fall = loadSound('assets/sounds/songs/free-fall.mp3');
}




