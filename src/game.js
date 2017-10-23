import Ship from './ship.js';
import Asteroid from './asteroid.js';
import Laser from './laser.js';

export default class Game {
	constructor(screenWidth, screenHeight, context) {
		this.width = screenWidth;
		this.height = screenHeight;
		this.ctx = context;
		this.ship = new Ship(this.width/2, this.height/2, 0, 0, 1, screenWidth, screenHeight);
		this.shiprotate = "none";
		this.shipmove = "none";
		this.firing = false;
		this.asteroids = [];
		this.lasers = [];
		this.level = 1;
		this.lives = 3;
		this.score = 0;
		this.intervalrate = 1000/30;
		
		this.firesound = new Audio('./fire.wav');
		this.hitsound = new Audio('./hit.wav');
		this.explosionsound = new Audio('./explosion.wav');
	
		this.update = this.update.bind(this);
		this.render = this.render.bind(this);
		this.loop = this.loop.bind(this);
		
		this.handleKeyDown = this.handleKeyDown.bind(this);
		window.addEventListener('keydown', this.handleKeyDown);
		
		this.handleKeyUp = this.handleKeyUp.bind(this);
		window.addEventListener('keyup', this.handleKeyUp);
		
		this.setup();
		this.interval = setInterval(this.loop, this.intervalrate);
	}
	
	handleKeyDown = function(event) {
		switch(event.key){
			case 'a':
			case 'ArrowLeft':
				this.shiprotate = "left";
				break;
			case 'd':
			case 'ArrowRight':
				this.shiprotate = "right";
				break;
			default:
				break;
		}
		switch(event.key){
			case 'w':
			case 'ArrowUp':
				this.shipmove = "forward";
				break;
			case 's':
			case 'ArrowDown':
				this.shipmove = "backward";
				break;
			default:
				break;
		}
		switch(event.key){
			case 'Shift':
				this.shipmove = "brake";
				break;
			default:
				break;
		}
		switch(event.key){
			case ' ':
				this.firing = true;
				break;
			default:
				break;
		}
	}
	
	handleKeyUp = function(event) {
		switch(event.key){
			case 'a':
			case 'ArrowLeft':
			case 'd':
			case 'ArrowRight':
				this.shiprotate = "none";
				break;
			default:
				break;
		}
		switch(event.key){
			case 'w':
			case 'ArrowUp':
			case 's':
			case 'ArrowDown':
			case 'Shift':
				this.shipmove = "none";
				break;
			default:
				break;
		}
		switch(event.key){
			case ' ':
				this.firing = false;
				break;
			default:
				break;
		}
	}
	
	setup() {
		this.ship.immune = 100;
		for(var i = 0; i < 5 * (this.level + 1); i++){
			var mass = (Math.random() + 0.5);
			var x = Math.random() * this.width;
			var y = Math.random() * this.height;
			var vx = Math.random() - 0.5;
			var vy = Math.random() - 0.5;
			var angle = Math.random() * Math.PI;
			var asteroid = new Asteroid(mass, x, y, vx, vy, angle, this.width, this.height);
			this.asteroids.push(asteroid);
		}
		this.render();
	}
	
	render() {
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, this.width, this.height);
		
		this.ctx.fillStyle = "white";
		this.ctx.font = '16px sans-serif';
		this.ctx.fillText("Score: " + this.score + " Level: " + this.level + " Lives: " + this.lives, 10, this.height - 10);
		this.ctx.fillText("wasd/Arrow Keys: Movement", 10, 15);
		this.ctx.fillText("Shift: Brake | Space: Shoot", 10, 30);
		if(this.ship.immune > 0 && this.lives > 0){
			this.ctx.fillStyle = "red";
			this.ctx.font = '16px sans-serif';
			this.ctx.fillText("Immune For: " + this.ship.immune, 10, this.height - 27);
		}
		
		this.ship.render(this.ctx);

		this.asteroids.forEach((asteroid) => {
			asteroid.render(this.ctx);
		});
		
		this.lasers.forEach((laser) => {
			laser.render(this.ctx);
		});
		
		if(this.lives < 1){
			this.ctx.fillStyle = "red";
			this.ctx.font = '64px sans-serif';
			this.ctx.fillText("Game Over!", this.width * 0.2, this.height/2);
		}
	}
	
	update() {
		if(this.lives < 1){
			clearInterval(this.interval);
		}
		else if(this.asteroids.length > 0){
			this.ship.update(this.shiprotate, this.shipmove);
			
			this.asteroids.forEach((asteroid) => {
				asteroid.update();
			});
			
			this.lasers.forEach((laser, index) => {
				laser.update(this.ctx);
				if(laser.x < 0 || laser.y < 0 || laser.x > this.width || laser.y > this.height){
					this.lasers.splice(index, 1);
				}
			});
			
			this.asteroids.forEach((asteroid) => {
				this.detectCollisions(asteroid);
			});
			
			if(this.firing && this.ship.firing <= 0){
				this.lasers.push(new Laser(this.ship.x, this.ship.y, this.ship.angle))
				this.ship.firing += 15;
				this.firesound.play();
			}
		}
		else{
			this.level++;
			this.setup();
		}
	}
	
	loop() {
		this.update();
		this.render();
	}
	
	detectCollisions(asteroid1) {
		var index1 = this.asteroids.indexOf(asteroid1);
		var radius1 = asteroid1.radius;
		var x1 = asteroid1.x;
		var y1 = asteroid1.y;
		var x1min = x1 - radius1;
		var x1max = x1 + radius1;
		var y1min = y1 - radius1;
		var y1max = y1 + radius1;
		this.asteroids.forEach((asteroid2, index2) => {
			if(index1 < index2){
				var radius2 = asteroid2.radius;
				var x2 = asteroid2.x;
				var y2 = asteroid2.y;
				var x2min = x2 - radius2;
				var x2max = x2 + radius2;
				var y2min = y2 - radius2;
				var y2max = y2 + radius2;
				
				if((x1min < x2max || x1max > x2min) && (y1min < y2max || y1max > y2min) && (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) < Math.pow(radius1 + radius2, 2))){
					//console.log("Asteroids " + index1 + " and " + index2 + " colliding!");
					if(asteroid1.colliding.indexOf(index2) < 0 && asteroid2.colliding.indexOf(index1) < 0){
						this.hitsound.play();
						asteroid1.colliding.push(index2);
						asteroid2.colliding.push(index1);
						
						var theta = Math.atan((y1 - y2)/(x1 - x2));
						if(x1 - x2 > 0) {
							theta += Math.PI;
						}
						var cos = Math.cos(theta);
						var sin = Math.sin(theta);
						var u1x = asteroid1.vx * cos;
						var u1y = asteroid1.vy * sin;
						var u2x = asteroid2.vx * cos;
						var u2y = asteroid2.vy * sin;
						
						var u1 = Math.pow(Math.pow(u1x, 2) + Math.pow(u1y, 2), 0.5);
						var u2 = Math.pow(Math.pow(u2x, 2) + Math.pow(u2y, 2), 0.5);
						var vel = this.getVelocity(asteroid1.mass, asteroid2.mass, u1, u2);
						var v1 = vel.v1;
						var v2 = vel.v2;
						
						var v1x = -1 * v1 * cos;
						var v1y = -1 * v1 * sin;
						var v2x = v2 * cos;
						var v2y = v2 * sin;
						
						
						asteroid1.accelerate(v1x, v1y);
						asteroid2.accelerate(v2x, v2y);
					}
				}
				else if(asteroid1.colliding.indexOf(index2) >= 0 && asteroid2.colliding.indexOf(index1) >= 0){
					//console.log("Asteroids " + index1 + " and " + index2 + " are no longer colliding!");
					asteroid1.colliding.splice(asteroid1.colliding.indexOf(index2), 1);
					asteroid2.colliding.splice(asteroid2.colliding.indexOf(index1), 1);
				}
			}
		});
		
		this.lasers.forEach((laser, index2) => {
			var x2 = laser.x;
			var y2 = laser.y;
			if((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) < Math.pow(radius1, 2))){
				this.explosionsound.play()
				this.lasers.splice(index2, 1);
				this.asteroids.splice(index1, 1);
				var mass1 = asteroid1.mass;
				this.score += parseInt(10/mass1);
				if(mass1 > 0.5){
					var coshalf = Math.cos(laser.angle);
					var sinhalf = Math.sin(laser.angle);
					
					var xh1 = x1 + radius1 * coshalf;
					var xh2 = x1 - radius1 * coshalf;
					var yh1 = y1 + radius1 * sinhalf;
					var yh2 = y1 - radius1 * sinhalf;
					
					var vxh = asteroid1.vx/2;
					var vyh = asteroid1.vy/2;
					var asteroidhalf1 = new Asteroid(mass1/2, xh1, yh1, vxh + coshalf, vyh + sinhalf, Math.random() * Math.PI, this.width, this.height);
					this.asteroids.push(asteroidhalf1);
					var asteroidhalf2 = new Asteroid(mass1/2, xh2, yh2, vxh - coshalf, vyh - sinhalf, Math.random() * Math.PI, this.width, this.height);
					this.asteroids.push(asteroidhalf2);
				}
			}
			
		});
		
		if(this.ship.immune <= 0){
			var x2 = this.ship.x;
			var y2 = this.ship.y;
			if((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) < Math.pow(radius1, 2))){
				this.hitsound.play();
				this.ship.immune += 100;
				this.lives--;
			}
		}
	}
	
	getVelocity(m1, m2, u1, u2){
		var v1 = ((u1*(m1 - m2)) + (2*m2*u2))/(m1 + m2);
		var v2 = ((u2*(m2 - m1)) + (2*m1*u1))/(m1 + m2);
		return {v1: v1, v2: v2};
	}
}