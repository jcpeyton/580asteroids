import './index.css';
import Game from './game.js';

var screenwidth = 600;
var screenheight = 600;

var canvas = document.createElement('canvas');
canvas.width = screenwidth;
canvas.height = screenwidth;
var context = canvas.getContext('2d');
document.body.appendChild(canvas);

var game = new Game(screenwidth, screenheight, context);