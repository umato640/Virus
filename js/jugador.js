import Cos from './cos.js';
import Deck from './deck.js';

/**
 * Classe jugador
 */
export default class Jugador {
  /**
     * Inicialitzar la classe jugador, amb el seu nom i
     * creant una nova baralla
     * @param {number} num
     * @param {string} nom
     */
  constructor(num, nom) {
    this.num = num;
    this.nom = nom;
    this.deck = new Deck();
    this.cos = new Cos();
  };

  /**
     * Natejar la baralla i el cos del jugador
     */
  natejar() {
    this.deck.buidar();
    this.cos.buidar();
  };
};
