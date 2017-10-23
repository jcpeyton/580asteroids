export default class Asteroid {
	constructor(mass, x, y, vx, vy, angle, screenWidth, screenHeight) {
		this.mass = mass;
		this.radius = 20 * this.mass;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.colliding = [];
		this.points = [];
		this.angle = angle;
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.setup();
	}
	
	accelerate(ux, uy){
		if(ux > 1){
			this.vx += 1;
		}
		else{
			this.vx += ux;
		}
		
		if(uy > 1){
			this.vy += 1;
		}
		else{
			this.vy += uy;
		}
	}

	setup() {
		var anglemax = Math.PI/5;
		var angle = (anglemax * Math.random())/this.mass;
		
		while(angle < 2 * Math.PI - anglemax){
			var tempradius = this.radius * (Math.random() + 4)/4.5;
			var x = tempradius * Math.cos(angle);
			var y = tempradius * Math.sin(angle);
			this.points.push({x: x, y: y});
			angle += anglemax * Math.random();
		}
	}
	
	render(ctx) {
		ctx.save();
		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.translate(this.x, this.y)
		ctx.rotate(this.angle);
		ctx.moveTo(this.radius, 0);
		this.points.forEach((point) => {
			ctx.lineTo(point.x, point.y);
		});
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}
	
	update() {
		this.x += this.vx;
		if(this.x > this.screenWidth + this.radius){
			this.x = -1 * this.radius;
			if(this.vx > 1.5){
				this.vx = 1.5;
			}
		}
		else if(this.x < 0 - this.radius){
			this.x = this.screenWidth + this.radius;
			if(this.vx < -1.5){
				this.vx = -1.5;
			}
		}
		this.y += this.vy;
		if(this.y > this.screenWidth + this.radius){
			this.y = -1 * this.radius;
			if(this.vy > 1.5){
				this.vy = 1.5;
			}
		}
		else if(this.y < 0 - this.radius){
			this.y = this.screenWidth + this.radius;
			if(this.vy < -1.5){
				this.vy = -1.5;
			}
		}
	}
}