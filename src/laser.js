export default class Asteroid {
	constructor(x, y, angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
	}
	
	render(ctx) {
		ctx.save();
		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.translate(this.x, this.y)
		ctx.rotate(this.angle);
		ctx.moveTo(0, -5);
		ctx.lineTo(0, 0);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}
	
	update() {
		this.x += 5 * Math.cos(this.angle - Math.PI/2);
		this.y += 5 * Math.sin(this.angle - Math.PI/2);
	}
}