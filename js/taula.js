import Alerta from './alerta.js';
import Card from './card.js';
import VistaJugador from './vistaJugador.js';

/**
 * Classe vista
 */
export default class Taula {
  /**
     * Inicialitzar la taula amb els jugadors i les funcionalitats del joc
     * @param {Game} game
     */
  constructor(game) { // fer una vista per cada jugador
    this.game = game;
    this.jugadors = [
      new VistaJugador(1),
      new VistaJugador(2),
    ];
    this.isDescart = false;
  };

  /**
     * Carregar l'inici del joc
     */
  carrega() {
    const text = 'És un juego de corte familiar en el que nuestro objetivo ' +
        'es conseguir aislar un cuerpo sano y erradicar ' +
        'el virus antes de que cualquier otra ' +
        'persona lo consiga. Este juego no entiende de ' +
        'ética y todo es válido para conseguir ' +
        'la victoria. Consigue cuatro órganos sanos de ' +
        'distinto color. Elimina los virus e ' +
        'inmuniza tus órganos para que no se puedan ' +
        'contagiar. Sabotea a tus rivales para ser ' +
        'la primera persona en tener los cuatro órganos sanos.';
    const alerta = new Alerta('Joc del Virus',
        text,
        'Un Jugador',
        'Dos Jugadors',
        () => {
          this.game.iniciar(true);
          this.iniciar();
        }, () => {
          this.game.iniciar(false);
          this.iniciar();
        });
    alerta.afegir();
  };

  /**
     * Iniciar el joc mostrant les cartes inicials i escoltant events de cada
     * element de cada jugador
     */
  iniciar() {
    this.initDragAndDrop();
    this.game.jugadors.forEach((jugador) => {
      this.mostrarCartesJugador(jugador.deck, jugador.num);
    });
  };

  /**
     * Mostrar la carta a una baralla de el jugador indicat
     * @param {Deck} deck
     * @param {number} nJugador
     */
  mostrarCartesJugador(deck, nJugador) {
    console.log(this.game.deck.length, this.game.deck);
    const eJugador = this.getCartesJugador(nJugador);

    while (eJugador.childNodes.length > 0) {
      eJugador.removeChild(eJugador.childNodes[0]);
    }

    for (let i = 0; i < deck.length; i++) {
      const eCard = this.generarCarta(deck.get(i));
      eCard.setAttribute('class', 'carta-' + (i + 1));
      eCard.setAttribute('draggable', 'true');

      eJugador.appendChild(eCard);
      this.afegirEventsCard(eCard, nJugador);
    };
  };

  /**
     * Mostrar la carta a una baralla de el jugador indicat
     * @param {Card} card
     * @param {number} nColumn
     * @param {number} nJugador
     */
  mostrarCartaCos(card, nColumn, nJugador) {
    const eCosJugador = this.getCosJugador(nJugador);
    const eCard = this.generarCarta(card);
    eCosJugador[nColumn].appendChild(eCard);
  };

  /**
     * Generar l'element html de carta
     * @param {Card} card
     * @return {HTMLImageElement}
     */
  generarCarta(card) {
    const img = document.createElement('img');
    img.setAttribute('data-suit', card.suit);
    img.setAttribute('data-color', card.color);
    img.setAttribute('src', card.img);

    return img;
  };

  /**
     * Afegir els events necessaris a una carta nova
     * @param {HTMLImageElement} eCard
     * @param {number} nCosJugador
     */
  afegirEventsCard(eCard, nCosJugador) {
    const eCosJugador = this.getCosJugador(nCosJugador);

    eCard.addEventListener('dragstart', (e) => {
      const suit = e.target.getAttribute('data-suit');
      const nJugador = (
          e.target.parentNode.parentNode.parentNode.getAttribute('id') ===
          'jugador1') ? 1 : 2;
      const id = Number((e.target.getAttribute('class')).slice(-1));

      e.dataTransfer.setData('id', id);
      e.dataTransfer.setData('suit', suit);
      e.dataTransfer.setData('color', e.target.getAttribute('data-color'));
      e.dataTransfer.setData('src', e.target.getAttribute('src'));
      e.dataTransfer.setData('jugador', nJugador);

      const card = this.getCardFromDataTransfer(e.dataTransfer);

      if (!this.isDescart) {
        if (suit === 'organ' || suit === 'medicina') { // aixo a game
          const rows = this.game.obtenirJugades(card, nCosJugador, nJugador);
          rows.forEach((row) => {
            eCosJugador[row].setAttribute('style',
                'box-shadow: 0 0 20px grey;');
          });
        } else {
          this.jugadors.forEach((jugador) => {
            if (jugador.num !== nCosJugador) {
              const rows = this.game.obtenirJugades(card,
                  jugador.num, nJugador);
              rows.forEach((row) => {
                jugador.cos[row].setAttribute('style',
                    'box-shadow: 0 0 20px grey;');
              });
            };
          });
        };
      };
    });

    eCard.addEventListener('dragend', (e) => {
      const suit = e.target.getAttribute('data-suit');

      if (suit === 'organ' || suit === 'medicina') {
        eCosJugador.forEach((row) => {
          if (row.hasAttribute('style')) row.removeAttribute('style');
        });
      } else {
        this.jugadors.forEach((jugador) => {
          if (jugador.num !== nCosJugador) {
            jugador.cos.forEach((row) => {
              if (row.hasAttribute('style')) row.removeAttribute('style');
            });
          };
        });
      };
    });
  };

  /**
     * @param {VistaJugador} jugador
     */
  removeStylePastPlayer(jugador) {
    jugador.torn.setAttribute('style', 'display: none');
    jugador.descart.removeAttribute('style');
  };

  /**
     * @param {VistaJugador} jugador
     */
  applyStyleCurrentPlayer(jugador) {
    jugador.torn.removeAttribute('style');
    jugador.descart.setAttribute('style', 'box-shadow: 0 0 20px yellow;');
  };

  /**
     *
     */
  changeTorn() {
    if (this.game.isGameOver) {
      alert('Ha guanyat el jugador ' + this.game.winner);
    } else {
      this.isDescart = false;
      const gJugador = this.game.jugadors[this.game.torn - 1];
      const vJugador = this.jugadors[this.game.torn - 1];
      const torn = this.game.changeTorn();
      console.log('change torn');
      if (!this.game.unJugador) {
        this.removeStylePastPlayer(vJugador);
        this.applyStyleCurrentPlayer(this.jugadors[torn - 1]);
      } else if (torn === 2) this.jugarOrdinador();

      this.mostrarCartesJugador(gJugador.deck, gJugador.num);
    };
  };

  /**
     * Iniciar els listeners bàsics per poder posar el drag and drop en marxa
     */
  initDragAndDrop() {
    this.jugadors.forEach((jugador) => {
      if (jugador.num === 1) {
        jugador.descart.setAttribute('style', 'box-shadow: 0 0 20px yellow;');
        jugador.torn.removeAttribute('style');
      };

      jugador.torn.addEventListener('click', () => {
        if (this.game.torn !== 2 || !this.game.unJugador) this.changeTorn();
      });

      jugador.descart.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      jugador.descart.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });

      jugador.descart.addEventListener('drop', (e) => {
        if (this.game.torn !== 2 || !this.game.unJugador) {
          this.isDescart = true;
          const idCard = Number(e.dataTransfer.getData('id'));
          const nJugador = jugador.num;
          this.descartarCarta(nJugador, idCard);
        };
      });

      jugador.cos.forEach((row) => this.initDropRowListeners(row, jugador.num));
    });
  };

  /**
     * @param {HTMLElement} row
     * @param {number} nCosJugador
     */
  initDropRowListeners(row, nCosJugador) {
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    row.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    row.addEventListener('drop', (e) => {
      if (!this.isDescart) {
        const nJugador = Number(e.dataTransfer.getData('jugador'));
        const card = this.getCardFromDataTransfer(e.dataTransfer);
        const nRow = Number((e.target instanceof HTMLImageElement) ?
            e.target.parentNode.getAttribute('id') :
            e.target.getAttribute('id')) - 1;
        const idCard = Number(e.dataTransfer.getData('id'));
        const nDeletedColumns = this.game.tirarCarta(idCard,
            nRow, nCosJugador, nJugador);

        if (nDeletedColumns !== -1) {
          const gJugador = this.game.jugadors[nJugador - 1];
          this.mostrarCartaCos(card, nRow, nCosJugador);
          this.eliminarCartes(nCosJugador, nRow, nDeletedColumns);


          if (this.game.isGameOver) {
            this.alertaGuanyador(nJugador);
          } else {
            this.mostrarCartesJugador(gJugador.deck, gJugador.num);

            if (this.game.unJugador) {
              this.jugarOrdinador();
            } else {
              const vJugador = this.jugadors[nJugador - 1];
              this.removeStylePastPlayer(vJugador);
              this.applyStyleCurrentPlayer(this.jugadors[this.game.torn - 1]);
            };
          };
        };
      };
    });
  };

  /**
     * Funcionalitat per que jugui l'ordinador
     */
  jugarOrdinador() {
    const gJugador = this.game.jugadors[1];
    const jugada = this.game.generarJugada(2);

    if (!jugada) {
      for (let i = 0; i < this.game.jugadors[1].deck.length; i++) {
        this.descartarCarta(2, i + 1);
      };
      console.log('descartar ordinador');
      this.changeTorn();
    } else {
      const card = this.game.jugadors[1].deck.get(jugada.card - 1);
      const nDeletedColumns = this.game.tirarCarta(jugada.card,
          jugada.row, jugada.cos, 2);
      this.mostrarCartaCos(card, jugada.row, jugada.cos);
      this.eliminarCartes(jugada.cos, jugada.row, nDeletedColumns);

      if (this.game.isGameOver) {
        this.alertaGuanyador(2);
      } else {
        this.mostrarCartesJugador(gJugador.deck, 2);
      };
    };
  };

  /**
     * @param {number} nCosJugador
     * @param {number} nRow
     * @param {number} nCartes
     */
  eliminarCartes(nCosJugador, nRow, nCartes) {
    const eCosJugador = this.getCosJugador(nCosJugador);
    const row = eCosJugador[nRow];
    const cards = row.querySelectorAll('img');

    for (let i = 1; i <= nCartes; i++) {
      row.removeChild(cards[cards.length - i]);
    };
  };

  /**
     * @param {number} nJugador
     * @param {number} idCard
     */
  descartarCarta(nJugador, idCard) {
    if (nJugador === this.game.torn) {
      this.game.descartarCarta(nJugador, idCard);
      this.girarCarta(nJugador, idCard);
    };
  };

  /**
     * @param {number} nJugador
     * @param {number} idCard
     */
  girarCarta(nJugador, idCard) {
    const eJugador = this.getCartesJugador(nJugador);
    const card = eJugador.querySelector('.carta-' + idCard);
    const nCard = document.createElement('img');
    nCard.setAttribute('src', '/img/back.png');
    nCard.setAttribute('class', 'carta-' + idCard);
    eJugador.replaceChild(nCard, card);
  };

  /**
     * @param {number} nJugador
     */
  alertaGuanyador(nJugador) {
    const alerta = new Alerta('Ha guanyat el jugador ' + nJugador,
        'Vols continuar jugant?', 'Un Jugador',
        'Dos Jugadors', () => {
          this.reiniciar();
          this.game.iniciar(true);
          this.game.jugadors.forEach((jugador) => {
            this.mostrarCartesJugador(jugador.deck, jugador.num);
          });
        }, () => {
          this.reiniciar();
          this.game.iniciar(false);
          this.game.jugadors.forEach((jugador) => {
            this.mostrarCartesJugador(jugador.deck, jugador.num);
          });
        });
    alerta.afegir();
  };

  /**
     * @param {DataTransfer} dt
     * @return {Card}
     */
  getCardFromDataTransfer(dt) {
    const suit = dt.getData('suit');
    const color = dt.getData('color');
    const img = dt.getData('src');
    return new Card(suit, color, img);
  };

  /**
     * Obtenir l'element del cos del jugador
     * @param {number} nJugador
     * @return {NodeList}
     */
  getCosJugador(nJugador) {
    return this.jugadors[nJugador - 1].cos;
  };

  /**
     * Obtenir els elements de les cartes de la baralla del jugador
     * @param {number} nJugador
     * @return {HTMLElement}
     */
  getCartesJugador(nJugador) {
    return this.jugadors[nJugador - 1].cartes;
  };

  /**
     * Reiniciar la vista
     */
  reiniciar() {
    this.game.reiniciar();
    this.jugadors.forEach((jugador) => {
      let cartes = jugador.cartes.querySelectorAll('img');
      cartes.forEach((carta) => {
        carta.parentNode.removeChild(carta);
      });

      jugador.cos.forEach((row) => {
        cartes = row.querySelectorAll('img');
        cartes.forEach((carta) => {
          row.removeChild(carta);
        });
      });
    });
  };
};
