function Controller() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext("2d");
	this.primitives = [];
	this.image = new Image;
	this.image.src ='https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f7db426b676b95755fb2844_Group%20805.jpg';
	const scaleFactor = 1.1;

	this.init = function () {
		initTouch(this.canvas);
		this.resize();

		// Pan tool is activated by default
		this.activatePanningTool();

		const canvas = this.canvas;
		canvas.addEventListener('DOMMouseScroll', handleScroll, false);
		canvas.addEventListener('mousewheel', handleScroll, false);
		trackTransforms(this.ctx);
	}

	const zoom = clicks => {
		const ctx = this.ctx;
		// zooming point can be configured in the future
		var lastX = this.canvas.width / 2, lastY = this.canvas.height / 2;
		var pt = this.ctx.transformedPoint(lastX, lastY);
		ctx.translate(pt.x, pt.y);
		var factor = Math.pow(scaleFactor, clicks);
		ctx.scale(factor, factor);
		ctx.translate(-pt.x, -pt.y);
		this.render();
	}

	const handleScroll = e => {
		var delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;
		if (delta) zoom(delta);
		return e.preventDefault() && false;
	}

	this.addPrimitive = primitive => {
		this.primitives.push(primitive);
	}

	this.resize = () => {
		const parent = this.canvas.parentElement;
		this.canvas.width = parent.clientWidth;
		this.canvas.height = parent.clientHeight;
	}

	this.canvas.onmousedown = ev => {
		this.activeTool.handleMouseDown(ev);
		this.render();
	}

	this.canvas.onmousemove = ev => {
		this.activeTool.handleMouseMove(ev);
		this.render();
	}

	this.canvas.onmouseup = ev => {
		this.activeTool.handleMouseUp(ev);
		this.render();
	}

	this.activatePanningTool = () => {
		this.activeTool = new PanTool(this.ctx, this.canvas);
	}

	this.activateLineTool = () => {
		this.activeTool = new LineTool(this.ctx, this.addPrimitive);
	}

	this.zoomIn = function () {
		zoom(1);
	}

	this.zoomOut = function () {
		zoom(-1);
	}

	this.render = () => {
		const ctx = this.ctx;
		this.clear();
		ctx.drawImage(this.image, 0, 0);
		this.drawOrigin();
		this.primitives.forEach(p => p.render(ctx));
		if (this.activeTool.render) {
			this.activeTool.render(ctx);
		}
	}

	this.clear = () => {
		const ctx = this.ctx;
		const canvas = this.canvas;

		// Clear the entire canvas
		var p1 = ctx.transformedPoint(0, 0);
		var p2 = ctx.transformedPoint(canvas.width, canvas.height);
		ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	}

	this.drawOrigin = () => {
		const ctx = this.ctx;
		ctx.beginPath();
		ctx.moveTo(-100, 0);
		ctx.lineTo(100, 0);
		ctx.moveTo(0, -100);
		ctx.lineTo(0, 100);
		ctx.closePath();
		ctx.stroke();
	}
}

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function () { return xform; };

	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function () {
		savedTransforms.push(xform.translate(0, 0));
		return save.call(ctx);
	};

	var restore = ctx.restore;
	ctx.restore = function () {
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var scale = ctx.scale;
	ctx.scale = function (sx, sy) {
		xform = xform.scaleNonUniform(sx, sy);
		return scale.call(ctx, sx, sy);
	};

	var rotate = ctx.rotate;
	ctx.rotate = function (radians) {
		xform = xform.rotate(radians * 180 / Math.PI);
		return rotate.call(ctx, radians);
	};

	var translate = ctx.translate;
	ctx.translate = function (dx, dy) {
		xform = xform.translate(dx, dy);
		return translate.call(ctx, dx, dy);
	};

	var transform = ctx.transform;
	ctx.transform = function (a, b, c, d, e, f) {
		var m2 = svg.createSVGMatrix();
		m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
		xform = xform.multiply(m2);
		return transform.call(ctx, a, b, c, d, e, f);
	};

	var setTransform = ctx.setTransform;
	ctx.setTransform = function (a, b, c, d, e, f) {
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx, a, b, c, d, e, f);
	};

	var pt = svg.createSVGPoint();
	ctx.transformedPoint = function (x, y) {
		pt.x = x; pt.y = y;
		return pt.matrixTransform(xform.inverse());
	}
}