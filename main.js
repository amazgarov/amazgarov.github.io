window.onload = function () {
	const controller = new Controller();
	controller.init();
	// ui hooks
	handleClick('btnLine', controller.activateLineTool);
	handleClick('btnPan', controller.activatePanningTool);
	handleClick('btnZoomIn', controller.zoomIn);
	handleClick('btnZoomOut', controller.zoomOut);
	window.addEventListener('resize', controller.resize);
}

function handleClick(id, handler) {
	const element = document.getElementById(id);
	if (element) {
		element.addEventListener('click', handler);
	}
}