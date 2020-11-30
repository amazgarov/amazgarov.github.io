function touchHandler(e) {
	e.preventDefault();
	var touch = e.changedTouches[0];

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent({
		touchstart: "mousedown",
		touchmove: "mousemove",
		touchend: "mouseup"
	}[e.type], true, true, window, 1,
		touch.screenX, touch.screenY,
		touch.clientX, touch.clientY, false,
		false, false, false, 0, null);

	touch.target.dispatchEvent(simulatedEvent);
}

function initTouch(element) {
	element.addEventListener("touchstart", touchHandler, true);
	element.addEventListener("touchmove", touchHandler, true);
	element.addEventListener("touchend", touchHandler, true);
	element.addEventListener("touchcancel", touchHandler, true);
}
