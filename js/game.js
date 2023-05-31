import Card from './card.js';

/**
 * Classe on hi hauran les funcionalitats bàsicques de game
 */
export default class Game {
  /**
     * Inicialitzar les propietats necessaries per el joc
     * @param {Jugador[]} jugadors - El jugadors
     * @param {Deck} deck - La baralla
     */
  constructor(jugadors, deck) {
    this.jugadors = jugadors;
    this.deck = deck;
    this.unJugador = false;
    this.torn = 1;
    this.isGameOver = false;
    this.winner = 0; // id jugador guanyador
  };

  /**
     * Iniciar el joc segons si només serà un jugador o no i repartir
     * les cartes inicials
     * @param {boolean} unJugador
     */
  iniciar(unJugador) {
    this.unJugador = unJugador;
    this.repartirCartes();
  };

  /**
     * Tirar la carta
     * @param {number} idCard
     * @param {number} nRow
     * @param {number} nCosJugador
     * @param {number} nJugador
     * @return {number}
     */
  tirarCarta(idCard, nRow, nCosJugador, nJugador) {
    if (nJugador === this.torn) {
      const deckJugador = this.getDeckJugador(nJugador);
      const card = deckJugador.get(idCard - 1);

      if ((nJugador === nCosJugador &&
          (card.suit === 'organ' || card.suit === 'medicina')) ||
          nJugador !== nCosJugador && card.suit === 'virus') {
        const cosJugador = this.getCosJugador(nCosJugador);

        if (cosJugador.isValid(nRow, card)) {
          cosJugador.afegir(nRow, card);
          deckJugador.change(idCard - 1, undefined);
          const deletedCards = cosJugador.checkDelete(nRow);
          const deletedColumns = deletedCards.length;

          if (deletedCards) {
            deletedCards.forEach((card) => {
              this.deck.push(card);
            });
          };

          if (cosJugador.isWinner()) this.isGameOver = true;
          else this.changeTorn();

          return deletedColumns;
        };
      };
    };

    return -1;
  };

  /**
     * Obtenir noves cartes segons les que haguin set descartades
     */
  obtenirNovesCartes() {
    const nJugador = this.torn;
    const deckJugador = this.getDeckJugador(nJugador);

    for (let i = 0; i < 3; i++) {
      if (deckJugador.get(i) === undefined) {
        this.novaCarta(nJugador, i);
      }
    };
  };

  /**
     * Obtenir una nova carta
     * @param {number} nJugador
     * @param {number} idCard
     */
  novaCarta(nJugador, idCard) {
    const deckJugador = this.getDeckJugador(nJugador);
    const nCard = this.deck.agafarCarta();
    deckJugador.change(idCard, nCard);
  };

  /**
     * Descartar carta
     * @param {number} nJugador
     * @param {number} idCard
     */
  descartarCarta(nJugador, idCard) {
    if (nJugador === this.torn) {
      const deckJugador = this.getDeckJugador(nJugador);
      const card = deckJugador.get(idCard - 1);
      // evitar referencia new Card(card.suit, card.color, card.img)
      this.deck.push(card);
      deckJugador.change(idCard - 1, undefined);
    };
  };

  /**
     * Obtenir les jugades possibles
     * @param {Card} card
     * @param {number} nCosJugador
     * @param {number} nJugador
     * @return {number[]}
     */
  obtenirJugades(card, nCosJugador, nJugador) {
    if (nJugador === this.torn) {
      if (((nJugador === nCosJugador) &&
          (card.suit === 'organ' || card.suit === 'medicina')) ||
          (nJugador !== nCosJugador && card.suit === 'virus')) {
        const cosJugador = this.getCosJugador(nCosJugador);
        return cosJugador.checkValidMoves(card);
      };
    };

    return [];
  };

  /**
     * Canviar el torn i obtenir noves cartes
     * @return {number}
     */
  changeTorn() {
    this.obtenirNovesCartes();
    if (++this.torn > this.jugadors.length) this.torn = 1;

    return this.torn;
  };

  /**
     * Repartir les cartes inicials per a cada jugador
     */
  repartirCartes() {
    this.jugadors.forEach((jugador) => {
      for (let i = 0; i < 3; i++) {
        jugador.deck.push(this.deck.agafarCarta());
      }
    });
  };

  /**
     * @param {number} nJugador
     * @return {Cos}
     */
  getCosJugador(nJugador) {
    return this.jugadors[nJugador - 1].cos;
  };

  /**
     * Obtenir la baralla del jugador indicat
     * @param {number} nJugador
     * @return {Deck}
     */
  getDeckJugador(nJugador) {
    return this.jugadors[nJugador - 1].deck;
  };

  /**
     * Generar la jugada de la màquina
     * @param {number} nJugador
     * @return {object | undefined}
     */
  generarJugada(nJugador) {
    const deck = this.getDeckJugador(nJugador);
    let jugada = undefined;
    let moves = [];

    for (let i = 0; i < deck.cards.length && moves.length === 0; i++) {
      const card = deck.get(i);

      for (const jugador of this.jugadors) {
        moves = this.obtenirJugades(card, jugador.num, nJugador);

        if (moves.length > 0) {
          jugada = {
            cos: jugador.num,
            row: moves[Math.floor(Math.random() * moves.length)],
            card: i + 1,
          };
        };
      };
    };

    return jugada;
  };

  /**
     * Reiniciar el joc per posteriorment tornar-lo a iniciar
     */
  reiniciar() {
    this.torn = 1;
    this.jugadors.forEach((jugador) => {
      jugador.natejar();
    });
    this.deck.generar();
    this.deck.suffle();
    this.unJugador = false;
    this.winner = 0;
    this.isGameOver = false;
  };
};
