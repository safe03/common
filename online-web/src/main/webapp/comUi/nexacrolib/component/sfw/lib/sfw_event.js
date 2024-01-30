 /**
 * nexacro event와 관련된 기능을 등록한다.
 * @namespace sfw.event
 **/
 
var pForms = [ nexacro.Form.prototype, nexacro.Application ];

for ( id in pForms ) {
	var pForm = pForms[id];


	/**
	 * 주어진 XComp을 가지고 주어진 events 정보로 eventHandler함수들을 추가한다.<br>
	 * 두번째 events는 이벤트명=eventHandler함수로 이루어진 object collection이다.<br>
	 * event가 fire할 때 eventHandler함수가 호출되는데 그 함수 내부의 this는 주어진 scope가 된다.<br>
	 * @example
	 *
	 * this.onLbuttonDownHandler = function(obj, e)
	 * {
	 *    trace(this)//Form
	 * }
	 * this.onLbuttonUpHandler = function(obj, e)
	 * {
	 *    trace(this)//Form
	 * }
	 *
	 * var events = {"onlbuttondown": this.onLbuttonDownHandler, "onlbuttonup": this.onLbuttonUpHandler};
	 *
	 * Eco.XComp.Event.add(this.st_sample01, events, this);
	 *
	 * @function sfw_add
	 * @param {object} XComp events 설정할 대상 XComp.
	 * @param {object} events 이벤트명=eventHandler함수로 정의된 object collection.
	 * @param {*} scope scope로 설정할 대상으로 eventHandler 내부 루틴에 this에 해당하는 값
	 * @memberOf sfw.event
	 */	
	pForm.sfw_add = Eco.XComp.Event.add;
	
	
	/**
	 * 주어진 XComp을 가지고 주어진 events 정보로 eventHandler함수들을 제거한다.<br>
	 * 두번째 events는 이벤트명=eventHandler함수로 이루어진 object collection이다.
	 * @example
	 *
	 * this.onLbuttonDownHandler = function(obj, e)
	 * {
	 *    trace(this)//Form
	 * }
	 * this.onLbuttonUpHandler = function(obj, e)
	 * {
	 *    trace(this)//Form
	 * }
	 *
	 * var events = {"onlbuttondown": this.onLbuttonDownHandler, "onlbuttonup": this.onLbuttonUpHandler};
	 *
	 * Eco.XComp.Event.remove(this.st_sample01, events, this);
	 *
	 * @function sfw_remove
	 * @param {object} XComp events 설정할 대상 XComp.
	 * @param {object} events 이벤트명=eventHandler함수로 정의된 object collection.
	 * @param {*} scope scope로 설정할 대상으로 eventHandler 내부 루틴에 this에 해당하는 값
	 * @memberOf sfw.event
	 **/	
	pForm.sfw_remove = Eco.XComp.Event.remove;
	
	
	/**
	 * 주어진 XComp에 drag 기능를 설정한다.<br>
	 * 두번째 param 값은 function이거나, object type으로 값이 주어져야 한다.<br>
	 * function이면 dragging 되는 시점에 호출되는 함수로 설정된다.<br>
	 * object이면 object.start, object.end, object.dragging 으로 각각 함수값이 주어지는데.<br>
	 * start는 drag시작되는 시점에 호출되는 함수로 return 값이 false 일 경우 드래그를 실행하지 않는다.<br>
	 * end는 drag종료되는 시점에 호출되는 함수<br>
	 * dragging는 dragging 하는 시점에 계속 호출되는 함수이다.<br>
	 * 네번째 param인 addArgs로 주어지는 array는 함수 호출시에 추가되는 arguments이다.<br>
	 * 각 함수의 arguments은 다음과 같다.<br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * 1. start<br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * addArgs[0], addArg[1], ... ,clientX, clientY, shiftKey, ctrlKey<br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * 2. end<br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * addArgs[0], addArg[1], ... ,clientX, clientY, shiftKey, ctrlKey<br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * 3. dragging <br>
	 * ------------------------------------------------------------------------------------------------------<br>
	 * offsetX, offsetY, addArgs[0], addArg[1], ... , shiftKey, ctrlKey<br>
	 * <br>
	 * 세번째 param인 scope는 호출되는 함수 내부의 this 로 지정되며 만약 scope를 생략하면 this는 form이 된다.<br>
	 * offsetX, offsetY param 값은 dragging이 발생하는 시점의 x, y기준으로 그 다음에 발생되는 dragging 시점의 x, y 값의 차이가 주어지는데<br>
	 * 만약 다섯번째 isOffsetFromStart 값을 true로 주어지면 offsetX, offsetY 는 최초 drag가 시작되는 시점의 x, y 기준으로 dragging 발생하는 x, y 값의 차이가 주어진다.<br>
	 * 여섯 번째 delayTask 값을 true로 주어지면 dragging 함수 호출 하여 루틴이 실행되고 있는 중에 다시 dragging 함수가 호출하게 되면 호출를 생략하는 하는 처리이다.
	 * @example
	 *
	 * // 1) 2번째 인자를 function 으로 선언 시 drag 진행 시점에 정의된 함수가 호출된다.
	 * Eco.XComp.Event.makeDraggable(this.st_sample02, this.onDragging, this, [this.st_sample02]);
	 *
	 * // 2) 2번째 인자를 object 로 선언 시 drag 시작, 진행, 종료 시점에 정의된 함수가 호출된다.
	 * var draggingFunc = {
	 *      'start': this.onDragStart, // 사용자가 정의한 arguments + [clientX, clientY, shiftKey, ctrlKey] 추가함(2015/3/12) 
	 *      'dragging': this.onDragging, // [offsetX, offsetY] + 사용자가 정의한 arguments + [shiftKey, ctrlKey] 추가함(2015/3/12) 
	 *      'end': this.onDragEnd // 사용자가 정의한 arguments + [clientX, clientY, shiftKey, ctrlKey] 추가함(2015/3/12) 
	 * };
	 * Eco.XComp.Event.makeDraggable(this.st_sample02, draggingFunc, this, [this.st_sample02]);		 
	 *
	 * // drag start 시점에 처리할 함수
	 * this.onDragStart = function(comp)
	 * {	
	 *     trace(comp.name + " Drag Start !!");
	 *	   comp.set_text("Drag Start !!");
	 * }
	 *
	 * // dragging 시점에 처리할 루틴을 정의한 함수
	 * this.onDragging = function(offsetX, offsetY, obj)
	 * {
	 *     var x = obj.getOffsetLeft() + offsetX,
	 *         y = obj.getOffsetTop() + offsetY;	
	 *
	 *     obj.move(x, y);
	 * }
	 *
	 * @function sfw_makeDraggable
	 * @param {XComp} XComp draggable하고자 하는 xcomp.
	 * @param {object|function} draggingFunc dragging 처리 루틴에 해당하는 함수들.
	 * @param {*} scope scope로 설정할 대상.
	 * @param {array} addArgs 설정된 함수 호출시 추가할 arguments을 array로 설정.
	 * @param {boolean} isOffsetFromStart offsetX, offsetY arguments의 drag시작 시점을 기준할 것인지 여부.
	 * @param {boolean} delayTask 반복되어지는 dragging함수 호출을 중간에 겹치면 delay할 것인지 여부
	 * @memberOf sfw.event
	 **/
	pForm.sfw_makeDraggable = Eco.XComp.Event.makeDraggable;
	
	
	/**
	 * 주어진 XComp에 drag 기능를 해제한다.
	 * @example
	 *
	 * Eco.XComp.Event.clearDraggable(this.st_sample02);
	 * 
	 * @function sfw_clearDraggable
	 * @param {XComp} XComp draggable기능을 해제하는 xcomp.
	 * @memberOf sfw.event
	**/
	pForm.sfw_clearDraggable = Eco.XComp.Event.clearDraggable;
	

	/**
	 * 주어진 XComp에 repeat 기능를 설정한다.<br>
	 * 두번째 param 값은 function이거나, object type으로 값이 주어져야 한다.<br>
	 * function이면 repeating 되는 시점에 호출되는 함수로 설정된다.<br>
	 * object이면 object.start, object.end, object.repeating, object.repeatingStop으로 각각 함수값이 주어지는데.<br>
	 * start는 mouse down되는 시점에 호출되는 함수<br>
	 * end는 mouse up되는 시점에 호출되는 함수<br>
	 * repeating는 repeating 하는 시점에 계속 호출되는 함수이다.<br>
	 * repeatingStop는 mouse 누른 상태에서 마우스가 XComp 영역을 벗어나면 repeating 멈추게 되는데 이 멈추는 시점에 호출되는 함수이다.<br>
	 * 네번째 param인 addArgs로 주어지는 array는 함수 호출시에 추가되는 arguments이다.<br>
	 * 각 함수의 arguments은 다음과 같다.<br>
	 * start                            | end                       | repeating                       | repeatingStop<br>
	 * ----------------------------------------------------------------------------------------------------------------------------<br>
	 * x, y, addArgs[0], addArg[1], ... |addArgs[0], addArg[1], ... |x, y, addArgs[0], addArg[1], ... |addArgs[0], addArg[1], ... <br>
	 * <br>
	 * 세번째 param인 scope는 호출되는 함수 내부의 this값에 해당한다.<br>
	 * 만약 scope를 생략하면 this는 form이 된다.<br>
	 * x, y param 값은 start, repeating이 발생하는 시점의 마우스 x, y값인데 좌표기준은 XComp.parent 기준으로 처리된다.
	 * @example
	 *
	 * // 1) 2번째 인자를 function 으로 선언 시 repeat 진행 시점에 정의된 함수가 호출된다.
	 * Eco.XComp.Event.makeRepeatable(this.btn_repeat, this.onRepeating, this, [ds, this.grd_sample]);
	 *
	 * // 2) 2번째 인자를 object 로 선언 시 repeat 시작, 진행, 중단, 종료 시점에 정의된 함수가 호출된다.
	 * var repeatFunc = {
	 *      'start': this.onRepeatStart,
	 *      'repeating': this.onRepeating,
	 *      'end': this.onRepeatEnd
	 * };
	 * Eco.XComp.Event.makeRepeatable(this.btn_repeat, repeatFunc, this, [ds, this.grd_sample]);	 
	 *
	 * // repeating 시작 시점에 처리할 루틴을 정의한 함수
	 * this.onRepeatStart = function(comp)
	 * {	
	 *     trace("onRepeatStart");
	 * }
	 *
	 * // repeating 시점에 처리할 루틴을 정의한 함수
	 * this.onRepeating = function(offsetX, offsetY, obj)
	 * {
	 *     trace("onRepeating");
	 * }
	 *
	 * // repeating 중단 시점에 처리할 루틴을 정의한 함수
	 * this.onRepeatingStop = function(offsetX, offsetY, obj)
	 * {
	 *     trace("onRepeatingStop");
	 * }
	 *
	 * // repeating 종료 시점에 처리할 루틴을 정의한 함수
	 * this.onRepeatEnd = function(offsetX, offsetY, obj)
	 * {
	 *     trace("onRepeatEnd");
	 * }
	 *
	 * @function sfw_makeRepeatable
	 * @param {XComp} XComp repeatable하고자 하는 xcomp.
	 * @param {object|function} repeatFunc repeating 처리 루틴에 해당하는 함수들.
	 * @param {*=} scope scope로 설정할 대상.
	 * @param {array=} args 설정된 함수 호출시 추가할 arguments을 array로 설정.
	 * @memberOf sfw.event
	**/
	pForm.sfw_makeRepeatable = Eco.XComp.Event.makeRepeatable;
	

	/**
	 * 주어진 XComp에 repeatable 기능를 해제한다.
	 * @function sfw_clearRepeatable
	 * @param {XComp} XComp repeatable기능을 해제하는 xcomp.
	 * @example
	 *
	 * Eco.XComp.Event.clearRepeatable(this.btn_repeat);
	 *		 
	 * @memberOf sfw.event
	**/
	pForm.sfw_clearRepeatable = Eco.XComp.Event.clearRepeatable;
	
	
	/**
	 * requestAnimationFrame 기능<br>
	 * callback 함수 내부의 this는 주어진 scope가 된다.<br>
	 * func 내부 루틴에서 화면 render가 존재하면 smooth하게 처리되는 이점이 있다.
	 * 실행하고자 하는 루프 function 에서 requestAnimationFrame 을 호출하고 callback 함수로
	 * 자기 자신을 호출하는 recursive 방식을 사용한다.
	 * @example
	 *
	 * this.renderLoop = function()
	 * {
	 * 	   // something animation code
	 * 	
	 *     var reqId = Eco.XComp.Event.requestAnimationFrame(this.renderLoop, this);
	 * }
	 *
	 * this.renderLoop();
	 *
	 * @function sfw_requestAnimationFrame
	 * @param {function} callback 콜백 함수
	 * @param {*} scope callback 함수 내부에서 this 로 사용할 개체.
	 * @param {...} 호출하는 함수의 arguments
	 * @return {number} request id.
	 * @memberOf sfw.event
	**/
	pForm.sfw_requestAnimationFrame = Eco.XComp.Event.requestAnimationFrame;
	
	
	/**
	 * requestAnimationFrame 호출한 것을 중지하고자 할때 사용하는 함수.<br>
	 * requestAnimationFrame의 return 값으로 id값이 나온다. 이것을 이 함수 argument로 넘겨준다.
	 * @example
	 * 
	 * Eco.XComp.Event.cancelAnimationFrame(reqId);
	 *
	 * @function sfw_cancelAnimationFrame
	 * @param {number} id requestAnimationFrame id.
	 * @memberOf sfw.event
	**/
	pForm.sfw_cancelAnimationFrame = Eco.XComp.Event.cancelAnimationFrame;
	
}