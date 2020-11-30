function PanTool(ctx, canvas) {
	let lastX = canvas.width / 2, lastY = canvas.height / 2;
	let dragStart, dragged;

	this.handleMouseDown = e => {
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		lastX = e.offsetX || (e.pageX - canvas.offsetLeft);
		lastY = e.offsetY || (e.pageY - canvas.offsetTop);
		dragStart = ctx.transformedPoint(lastX, lastY);
		dragged = false;
	}

	this.handleMouseMove = e => {
		lastX = e.offsetX || (e.pageX - canvas.offsetLeft);
		lastY = e.offsetY || (e.pageY - canvas.offsetTop);
		dragged = true;
		if (dragStart) {
			var pt = ctx.transformedPoint(lastX, lastY);
			ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
		}
	}

	this.handleMouseUp = e => {
		dragStart = null;
	}
}

function LineTool(ctx, addPrimitiveFunction) {
	let isPressed = false;
	let startPoint = null, endPoint = null;

	this.handleMouseDown = e => {
		isPressed = true;
		startPoint = ctx.transformedPoint(e.offsetX, e.offsetY);
	}

	this.handleMouseMove = e => {
		if (isPressed) {
			endPoint = ctx.transformedPoint(e.offsetX, e.offsetY);
		}
	}

	this.handleMouseUp = e => {
		isPressed = false;
		const newPrimitive = new Line(startPoint, endPoint);
		// submit new primitive
		addPrimitiveFunction(newPrimitive);
		// cleanup
		startPoint = endPoint = null;
	}

	// renders current state of the tool
	this.render = () => {
		if (startPoint && endPoint) {
			ctx.beginPath();
			ctx.moveTo(startPoint.x, startPoint.y);
			ctx.lineTo(endPoint.x, endPoint.y);
			ctx.closePath();
			ctx.stroke();
		}
	}
}
