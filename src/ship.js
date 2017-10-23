export default class Ship {
	constructor(x, y, vx, vy, angle, screenWidth, screenHeight) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.angle = angle;
		this.immune = 0;
		this.firing = 0;
		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
	}

	render(ctx) {
		ctx.save();
		if(this.immune > 0){
			ctx.strokeStyle = "red";
		}
		else{
			ctx.strokeStyle = "#fff";
		}
		ctx.beginPath();
		ctx.translate(this.x, this.y)
		ctx.rotate(this.angle);
		ctx.moveTo(0, -5);
		ctx.lineTo(2, 5);
		ctx.lineTo(-2, 5);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}
	
	update(rotate, move) {
		if(this.immune > 0){
			this.immune--;
		}
		if(this.firing > 0){
			this.firing--;
		}
		
		switch(rotate){
			case "left":
				this.angle -= 0.05;
				break;
			case "right":
				this.angle += 0.05;
				break;
			default:
				break;
		}
		switch(move){
			case "forward":
				this.vx += 0.05 * Math.sin(this.angle);
				this.vy -= 0.05 * Math.cos(this.angle);
				break;
			case "backward":
				this.vx -= 0.05 * Math.sin(this.angle);
				this.vy += 0.05 * Math.cos(this.angle);
				break;
			case "brake":
				if(this.vx > 0){
					this.vx -= 0.05;
				}
				else{
					this.vx += 0.05;
				}
				
				if(this.vy > 0){
					this.vy -= 0.05;
				}
				else{
					this.vy += 0.05;
				}
				break;
			default:
				break;
		}
		
		this.x += this.vx;
		if(this.x > this.screenWidth){
			this.x = 0;
		}
		else if(this.x < 0){
			this.x = this.screenWidth;
		}
		this.y += this.vy;
		if(this.y > this.screenWidth){
			this.y = 0;
		}
		else if(this.y < 0){
			this.y = this.screenWidth;
		}
	}
}
