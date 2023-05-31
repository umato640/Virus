import Deck from './deck.js';
import Jugador from './jugador.js';
import Taula from './taula.js';
import Game from './game.js';


const deck = new Deck();
deck.generar();
deck.suffle();
const jugador1 = new Jugador(1, 'Jugador 1');
const jugador2 = new Jugador(2, 'Jugador 2');
const game = new Game([jugador1, jugador2], deck);
const taula = new Taula(game);
taula.carrega();
