PARA ADICIONAR ATRIBUTOS:

São só 2 lugares para mexer, ambos no `Chouchou.js`:

### 1. Adicionar em `this.stats`

```js
this.stats = {
  fome:       { valor: 80, max: 100, cor: '#f97316', icone: '🍖' },
  humor:      { valor: 60, max: 100, cor: '#a855f7', icone: '⭐' },
  saude:      { valor: 90, max: 100, cor: '#22c55e', icone: '💚' },
  hidratacao: { valor: 70, max: 100, cor: '#38bdf8', icone: '💧' }, // ← azul claro
  felicidade: { valor: 75, max: 100, cor: '#facc15', icone: '😊' }, // ← amarelo
}
```

Só isso. A HUD já vai exibir as duas novas stats automaticamente, porque o `_hudStats()` no `SceneManager` usa `Object.keys(stats)` — ele lê qualquer chave que existir no objeto, sem precisar ser avisado.

---

### ⚠️ Um detalhe importante: 5 colunas na HUD

Com 5 stats, cada coluna vai ficar bem estreita (390px ÷ 5 = 78px por coluna). Vai funcionar, mas pode ficar apertado.:

- **Opção A** — reduzir o `textSize` dos ícones e nomes na `_hudStats()`


Quer testar como fica primeiro e ajustar depois?



Para adicionar comodo é só adicionar o comodo.js dentro do folder comodos -> adicionar o comodo no index.js e adicionar ele no this.comodos do SceneManager.js.

---

### 2. Adicionar novos elementos

Quando quiser adicionar Fósforo por exemplo, são 3 passos:

**`FoodSystem.js`** — descomentar no catálogo:
```js
fosforo: {
  id: 'fosforo', nome: 'Fósforo', simbolo: 'P',
  cor: '#fb923c', corEscura: '#c2410c', fome: +15,
  imagem: null,
},
```

**`ChouchouLoader.js`** — carregar o PNG:
```js
CATALOGO_COMIDAS.fosforo.imagem = loadImage('assets/sprites/elementos/fosforo_P.png')
```

**`FoodSystem.js`** — adicionar ao inventário do jogador:
```js
this.inventario = ['nitrogenio', 'fosforo']
```

Pronto — o menu da geladeira já vai exibir os dois automaticamente.