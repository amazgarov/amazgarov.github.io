function Line(startPoint, endPoint, x2, y2) {
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	if (x2 && y2) {
		this.startPoint = { x: startPoint, y: endPoint };
		this.endPoint = { x, y };
	}

	this.render = ctx => {
		ctx.beginPath();
		ctx.moveTo(this.startPoint.x, this.startPoint.y)
		ctx.lineTo(this.endPoint.x, this.endPoint.y)
		ctx.closePath();
		ctx.stroke();
	}
}