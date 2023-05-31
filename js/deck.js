import Card from './card.js';

/**
 * Classe per crear una baralla
 */
export default class Deck {
  /**
   * Inicialitzar una array on és guardaran les cartes
   */
  constructor() {
    this.cards = [];
    this.length = 0;
  };

  /**
   * Amplanar la array de cards amb les cartes requerides
   * @return {void}
   */
  generar() {
    const SUITS = ['organ', 'virus', 'medicina'];
    const COLORS = ['verd', 'blau', 'groc', 'vermell'];
    this.cards = [];

    for (let i = 0; i < SUITS.length; i++) {
      const suit = SUITS[i];
      let num;
      let comodins;

      if (i === 0) {
        num = 5;
        comodins = 1;
      } else if (i === 1) {
        num = 4;
        comodins = 1;
      } else {
        num = 4;
        comodins = 4;
      };

      COLORS.forEach((color) => {
        for (let z = 0; z < num; z++) {
          const img = '/img/' + suit + '/' + color + '.png';
          this.cards.push(new Card(suit, color, img));
        };
      });

      for (let z = 0; z < comodins; z++) {
        const img = '/img/' + suit + '/comodi.png';
        this.cards.push(new Card(suit, 'comodi', img));
      };
    };

    this.length = this.cards.length;
  };

  /**
   * Eliminar l'última carta
   * @return {void}
   */
  pop() {
    this.cards.splice(0, 1);
    this.length--;
  };

  /**
   * Barrejar les cartes
   * @return {void}
   */
  suffle() {
    const ncards = [];

    while (this.cards.length > 0) {
      const random = Math.floor(Math.random() * this.cards.length);
      ncards.push(this.cards[random]);
      this.cards.splice(random, 1);
    };

    this.cards = ncards;
  };

  /**
   * Afegir una carta
   * @param {Card} card - La carta la qual volem afegir
   * @return {void}
   **/
  push(card) {
    this.cards.push(card);
    this.length++;
  };

  /**
   * Agafar una carta
   * @return {Card} - La carta que hem agafar
   */
  agafarCarta() {
    const card = this.cards[0];
    this.pop();
    return card;
  };

  /**
   * Obtenir la carta d'una posició concreta
   * @param {number} index
   * @return {Card}
   */
  get(index) {
    return this.cards[index];
  };

  /**
     * Eliminar una carta
     * @param {number} index
     */
  remove(index) {
    this.cards.splice(index, 1);
    this.length--;
  };

  /**
   * @param {number} index
   * @param {any} value
   */
  change(index, value) {
    this.cards[index] = value;
  };

  /**
     * Buidar l'array de cartes
     */
  buidar() {
    this.cards = [];
    this.length = 0;
  };
};
