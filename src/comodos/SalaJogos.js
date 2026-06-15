// ─── Sala de Jogos ────────────────────────────────────────────────────────────
class SalaJogos {
  constructor(chouchou) {
    this.nome      = 'Sala de Jogos'
    this.chouchou  = chouchou

    // Importamos os objetos separadamente!
    this.bola = new Bola();
    this.popup = new PopupMinijogos(this.chouchou);

    // Hitbox da TV para abrir o menu
    this.hitboxTV = { x: width / 2 - 150, y: 50, w: 300, h: 200 };
  }

  update() {
    // Se o popup estiver aberto, atualizamos apenas ele e travamos a física da bola
    if (this.popup.aberto) {
      this.popup.update();
      return;
    }

    // Caso contrário, atualiza a física da bola
    this.bola.update();
  }

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    push(); 
    imageMode(CORNER);
    if (SPRITES_CENARIO.salajogos) {
      image(SPRITES_CENARIO.salajogos, 0, 0, width, height);
    } else {
      background('#a88d52'); 
    }
    pop(); 

    // ── Componentes ─────────────────────────────────────────────────────────
    this.chouchou.draw();
    this.bola.draw();
    
    // O Popup sempre se desenha por último (se estiver aberto)
    this.popup.draw();
  }

  mousePressed() {
    // 1. Se o menu estiver aberto, repassa o clique para ele e cancela o resto
    if (this.popup.aberto) {
      this.popup.mousePressed();
      return; 
    }

    // 2. Se clicar na TV, abre o Menu e cancela o resto
    let tv = this.hitboxTV;
    if (mouseX > tv.x && mouseX < tv.x + tv.w && mouseY > tv.y && mouseY < tv.y + tv.h) {
      this.popup.aberto = true;
      return; 
    }

    // 3. Checa clique na Bola. Se a bola pegou o clique, ela retorna 'true'
    let pegouABola = this.bola.mousePressed();
    if (pegouABola) {
      return; 
    }

    // 4. Se não pegou a bola e nem clicou na TV, faz carinho no Chouchou
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar();
    }
  }

  mouseReleased() {
    // Repassa o evento "soltar mouse" para o elemento certo
    if (this.popup.aberto) {
      this.popup.mouseReleased();
    } else {
      this.bola.mouseReleased();
    }
  }
}