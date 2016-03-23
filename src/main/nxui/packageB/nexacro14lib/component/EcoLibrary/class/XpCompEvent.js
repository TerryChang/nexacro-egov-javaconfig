/**
 * @fileoverview
 * xpcomp 관련 event add, remove 할 때 사용하는 helper
 */

if ( !JsNamespace.exist("Eco.XpCompEvent") )
{
	/**
	 * 
	 * @description
	 * XpCompEvent 객체 정의<br>
	 * xpcomp 관련 event add, remove 할 때 사용하는 helper<br>
	 * xpcomp event add, remove외에 추가 기능은 다음과 같다.<br>
	 * xpcomp에 dragging 처리를 용이하게 하는 makeDraggable, 또한 repeat처리를 용이하게 하는 makeRepeatable 기능 포함.<br>
	 * 간단한 예제: "unitSample::makeDraggable.xfdl", "unitSample::makeRepeatable.xfdl"<br>
	 * 반복적인 처리 루틴(특히 복합적인? aniamtion)을 손쉽게 구현하기 위한 requestAnimationFrame, cancelAnimationFrame 기능 포함.<br>
	 * 간단한 예제: "example::snakeTest.xfdl"<br>
	 * Copyright (c) 2013 EcoSystem of TOBESOFT Inc.<br>
	 * Licensed Free under XPLATFORM® software.
	 * 
	 * @namespace
	 * @name XpCompEvent
	 * @memberof! <global>
	 */
	JsNamespace.declare("Eco.XpCompEvent", {
	
		/**
		 * 주어진 xpComp을 가지고 주어진 events 정보로 eventHandler함수들을 추가한다.<br>
		 * 두번째 events는 이벤트명=eventHandler함수로 이루어진 object collection이다.<br>
		 * 차후에 event가 fire할 때 eventHandler함수가 호출되는데 그 함수 내부의 this는 주어진 scope가 된다.<br>
		 * @example
		 * this.lbtnDownHandler = function(obj, e)
		 * {
		 *    trace(this)//Div00
		 * }
		 * this.lbtnUpHandler = function(obj, e)
		 * {
		 *    trace(this)//Div00
		 * }
		 * Eco.XpCompEvent.add(this.Div00, {"onlbuttondown": this.lbtnDownHandler, "onlbuttonup": this.lbtnUpHandler}, this.Div00);
		 * @param {xpComp} xpComp events 설정할 대상 xpComp.
		 * @param {object} events 이벤트명=eventHandler함수로 정의된 object collection.
		 * @param {*} scope scope로 설정할 대상 차후 eventHandler 내부 루틴에 this에 해당하는 값
		 * @memberOf Eco.XpCompEvent
		 */	
		"add": function(xpComp, events, scope)
		{
			for (var type in events)
			{
				if ( events.hasOwnProperty(type) )
				{
					xpComp.addEventHandler(type, events[type], scope);
				}
			}
		},
		
		/**
		 * 주어진 xpComp을 가지고 주어진 events 정보로 eventHandler함수들을 제거한다.<br>
		 * 두번째 events는 이벤트명=eventHandler함수로 이루어진 object collection이다.
		 * @example
		 * this.lbtnDownHandler = function(obj, e)
		 * {
		 *    trace(this)//Div00
		 * }
		 * this.lbtnUpHandler = function(obj, e)
		 * {
		 *    trace(this)//Div00
		 * }
		 * Eco.XpCompEvent.add(this.Div00, {"onlbuttondown": this.lbtnDownHandler, "onlbuttonup": this.lbtnUpHandler}, this.Div00);
		 * @param {xpComp} xpComp events 설정할 대상 xpComp.
		 * @param {object} events 이벤트명=eventHandler함수로 정의된 object collection.
		 * @param {*=} scope scope
		 * @memberOf Eco.XpCompEvent
		**/		
		"remove": function(xpComp, events, scope)
		{
			for (var type in events)
			{
				if ( events.hasOwnProperty(type) )
				{			
					xpComp.removeEventHandler(type, events[type], scope);
				}
			}
		},
				
		/**
		 * 주어진 e는 eventInfo 객체이다. 주어진 e값으로 현재 창의 form 좌표계 기준의 Point객체(x,y)를 얻는다.<br>
		 * 두번째 isScreen가 true이면 screen좌표계로 넘겨준다.
		 * @example
		 * this.lbtnDownHandler = function(obj, e)
		 * {
		 *    var pt = Eco.XpCompEvent.getPoint(e);
		 *    trace(pt.toString());
		 * }
		 * @param {EventInfo} e EventInfo 객체.
		 * @param {boolean=} isScreen screen 좌표계로 할 것인지 여부.
		 * @return {Eco.Point} x, y 속성을 가진 Eco.Point 객체.
		 * @memberOf Eco.XpCompEvent
		**/
		"getPoint": function(e, isScreen)
		{
			if ( !isScreen && e.fromobject )
			{
				var topForm = Eco.XPComp.getTopLevelForm(e.fromobject);
				var xy = Eco.XPComp.PositionSize.convertXY(topForm, [e.screenX, e.screenY]);
				return new Eco.Point(xy[0], xy[1]);
			}
			else
			{
				return new Eco.Point(e.screenX, e.screenY);
			}
		},
		
		/**
		 * 주어진 e는 eventInfo 객체이다. 주어진 e을 가지고 주어진 target기준의 좌표계로 Point객체(x,y)를 얻는다.
		 * @example
		 * this.lbtnDownHandler = function(obj, e)
		 * {
		 *    var pt = Eco.XpCompEvent.getOffset(e, obj);
		 *    trace(pt.toString());
		 * }
		 * @param {EventInfo} e EventInfo 객체.
		 * @param {xpComp} target 좌표계 기준이 되는 xpComp.
		 * @return {Eco.Point} x, y 속성을 가진 Eco.Point 객체.
		 * @memberOf Eco.XpCompEvent
		**/
		"getOffset": function(e, target)
		{
			if ( target == e.fromobject )
			{
				return new Eco.Point(e.clientX, e.clientY);
			}
			else
			{
				var xy = Eco.XPComp.PositionSize.convertXY(target, [e.screenX, e.screenY]);
				return new Eco.Point(xy[0], xy[1]);
			}
		},		

		/**
		 * 주어진 xpComp에 drag 기능를 설정한다.<br>
		 * 두번째 param 값은 function이거나, object type으로 값이 주어져야 한다.<br>
		 * function이면 dragging 되는 시점에 호출되는 함수로 설정된다.<br>
		 * object이면 object.start, object.end, object.dragging 으로 각각 함수값이 주어지는데.<br>
		 * start는 drag시작되는 시점에 호출되는 함수로 return 값이 false 일 경우 드래그를 실행하지 않는다.<br>
		 * end는 drag종료되는 시점에 호출되는 함수<br>
		 * dragging는 dragging 하는 시점에 계속 호출되는 함수이다.<br>
		 * 네번째 param인 addArgs로 주어지는 array는 함수 호출시에 추가되는 arguments이다.<br>
		 * 각 함수의 arguments은 다음과 같다.<br>
		 * start                      | end                       | dragging <br>
		 * ------------------------------------------------------------------------------------------------------<br>
		 * addArgs[0], addArg[1], ... |addArgs[0], addArg[1], ... |offsetX, offsetY, addArgs[0], addArg[1], ...<br>
		 * <br>
		 * 세번째 param인 scope는 호출되는 함수 내부의 this는 주어진 scope가 된다.<br>
		 * 만약 scope를 생략하면 this는 form이 된다.<br>
		 * offsetX, offsetY param 값은 dragging이 발생하는 시점의 x, y기준으로 그 다음에 발생되는 dragging 시점의 x, y 값의 차이가 주어지는데<br>
		 * 만약 다섯번째 isOffsetFromStart 값을 true로 주어지면 offsetX, offsetY 는 최초 drag가 시작되는 시점의 x, y 기준으로 dragging 발생하는 x, y 값의 차이가 주어진다.<br>
		 * 여섯 번째 delayTask 값을 true로 주어지면 dragging 함수 호출 하여 루틴이 실행되고 있는 중에 다시 dragging 함수가 호출하게 되면 호출를 생략하는 하는 처리이다.
		 * @example
		 * // 참조 소스 "unitSample::makeDraggable.xfdl"
		 * @param {xpComp} xpComp draggable하고자 하는 xpcomp.
		 * @param {object|function} draggingFunc dragging 처리 루틴에 해당하는 함수들.
		 * @param {*=} scope scope로 설정할 대상.
		 * @param {array=} addArgs 설정된 함수 호출시 추가할 arguments을 array로 설정.
		 * @param {boolean=} isOffsetFromStart offsetX, offsetY arguments의 drag시작 시점을 기준할 것인지 여부.
		 * @param {boolean=} delayTask 반복되어지는 dragging함수 호출을 중간에 겹치면 delay할 것인지 여부
		 * @memberOf Eco.XpCompEvent
		**/
		"makeDraggable": function(xpComp, draggingFunc, scope, addArgs, isOffsetFromStart, delayTask)
		{
			if ( Eco.isObject(draggingFunc) )
			{
				xpComp._dragFuncs = {
					"draggingFunc": draggingFunc.dragging,
					"draggingStartFunc": draggingFunc.start,
					"draggingEndFunc": draggingFunc.end,
					"args": addArgs,
					"isOffsetFromStart": isOffsetFromStart
					};
			}
			else
			{
				xpComp._dragFuncs = {
					"draggingFunc": draggingFunc,
					"args": addArgs,
					"isOffsetFromStart": isOffsetFromStart
					};
			}
			Eco.XpCompEvent.add(xpComp,
					{
						"onlbuttondown": Eco.XpCompEvent.dragDownHandler,
						"onlbuttonup": Eco.XpCompEvent.dragUpHandler
					}, scope);

			var topForm = Eco.XPComp.getTopLevelForm(xpComp.parent);
			
			xpComp.__topForm = topForm;
			
			if ( topForm.findEventHandler("onmousemove", Eco.XpCompEvent.dragMoveHandler) < 0 )
			{
				// drag 대상 컴포넌트를 저장하기 위한 속성 지정
				topForm.__makeDraggableTargets = {};
				
				topForm.addEventHandler("onmousemove", Eco.XpCompEvent.dragMoveHandler, scope);
			}
			
			// top form 에 drag 대상 컴포넌트로 지정
			var uniqueId = xpComp._unique_id;
			var topForm = Eco.XPComp.getTopLevelForm(xpComp.parent);
			
			topForm.__makeDraggableTargets[uniqueId] = true;		
			
			if ( delayTask )
			{
				xpComp._delayDragProc = true;
			}
			else
			{
				xpComp._delayDragProc = null;
			}
		},

		/**
		 * 주어진 xpComp에 drag 기능를 해제한다.
		 * @example
		 * // 참조 소스 "unitSample::makeDraggable.xfdl"
		 * @param {xpComp} xpComp draggable기능을 해제하는 xpcomp.
		 * @memberOf XpCompEvent
		**/
		"clearDraggable": function(xpComp)
		{
			if ( xpComp._dragFuncs )
			{
				xpComp._dragFuncs = null;
				xpComp._delayDragProc = null;
				Eco.XpCompEvent.remove(xpComp,
						{
							"onlbuttondown": Eco.XpCompEvent.dragDownHandler,
							"onlbuttonup": Eco.XpCompEvent.dragUpHandler
						});
						
				var topForm = Eco.XPComp.getTopLevelForm(xpComp.parent);
				var uniqueId = xpComp._unique_id;
				
				var hasDragComp = false;
				var dragComps = topForm.__makeDraggableTargets;
				
				for (var id in dragComps)
				{
					if ( dragComps.hasOwnProperty(id) )
					{
						if ( id == uniqueId )
						{
							delete dragComps[id];
						}
						else
						{
							hasDragComp = true;
						}
					}
				}
				
				// top form에 drag comp가 없다면 핸들러 및 속성 제거
				if ( !hasDragComp && topForm.findEventHandler("onmousemove", Eco.XpCompEvent.dragMoveHandler) > -1 )
				{
					delete topForm.__makeDraggableTargets;						
					delete topForm.__makeDraggableCurComp;
					
					topForm.removeEventHandler("onmousemove", Eco.XpCompEvent.dragMoveHandler);
				}
			}
		},

		/**
		 * dragging 기능을 처리하기 위해 내부적으로 설정하는 onlbuttondown event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"dragDownHandler": function(obj, e)
		{
			// 버튼의 mousemove 이벤트를 topform 에 발생하도록
			// (Form.Div.Button 의 경우 버블링이 안된다.)
			Eco.XpCompEvent._lockMouseEvent(obj.__topForm);
			
			var pt = Eco.XpCompEvent.getPoint(e, true);
			obj._drag = {
				"startPt": pt,
				"offsetX": 0,
				"offsetY": 0,
				"isOffsetFromStart": false
			};
						
			// drag 대상으로 지정
			var topForm = Eco.XPComp.getTopLevelForm(obj.parent);
			topForm.__makeDraggableCurComp = obj;
			
			var func = obj._dragFuncs,
				addArgs;

			if ( func )
			{
				if ( func.isOffsetFromStart === true ) obj._drag.isOffsetFromStart = true;
				addArgs = func.args;
				func = func.draggingStartFunc;
			}
			if ( func )
			{
				var args = [];
				if ( addArgs )
				{
					args = args.concat(addArgs);
				}
				
				// [2013.11.13] 리턴값에 따라 드래그 실행 중지
				var ret = func.apply(this, args);
				if ( ret === false )
				{
					obj._drag = null;
				}
			}
		},

		/**
		 * dragging 기능을 처리하기 위해 내부적으로 설정하는 onlbuttonup event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"dragUpHandler": function(obj, e)
		{
			var drag = obj._drag;
			
			// drag 대상 초기화
			var topForm = Eco.XPComp.getTopLevelForm(obj.parent);
			topForm.__makeDraggableCurComp = null;

			if ( drag )
			{
				Eco.XpCompEvent.cancelAnimationFrame(obj._reqDragId);//func
				obj._reqDragId = null;
				obj._drag = null;
				var func = obj._dragFuncs,
					addArgs;

				if ( func )
				{
					addArgs = func.args;
					func = func.draggingEndFunc;
				}
				if ( func )
				{
					var args = [];
					if ( addArgs )
					{
						args = args.concat(addArgs);
					}
					func.apply(this, args);
				}
			}
		},

		/**
		 * dragging 기능을 처리하기 위해 내부적으로 설정하는 onmousemove event의 handler함수
		 * @param {Form} form mouse move가 발생한 top form.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"dragMoveHandler": function(form, e)
		{
			// 현재 drag 중인 대상 comp
			var obj = form.__makeDraggableCurComp;
			if ( obj )
			{
				var drag = obj._drag;
				if ( drag )
				{
					var pt = Eco.XpCompEvent.getPoint(e, true);
					obj._dragCurPt = pt;
					if ( obj._delayDragProc )
					{
						Eco.XpCompEvent.cancelAnimationFrame(obj._reqDragId); //func
						obj._reqDragId = null;
					}
					
					obj._reqDragId = Eco.XpCompEvent.requestAnimationFrame(Eco.XpCompEvent._dragProcess, this, obj); //func, scope(default: topForm), func's arguments
				}
			}
		},
		
		/**
		 * dragging 기능을 처리하기 위해 내부적으로 설정하는 함수<br>
		 * 이 함수는 XpCompEvent.requestAnimationFrame을 통해 호출되는데 내부적으로 timer 호출이 된다.<br>
		 * 이렇게 호출하는 것은 dragging 중간에 화면 render가 존재하면 smooth하게 처리되는 이점이 있다.
		 * @param {xpComp} obj dragging 발생한 xpComp.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"_dragProcess": function(obj)
		{
			//Eco.XpCompEvent.cancelAnimationFrame(obj._reqDragId); //func
			//obj._reqDragId = null;

			var pt = obj._dragCurPt,
				drag = obj._drag;

			if ( drag == null ) return;
			
			drag.offsetX = pt.x - drag.startPt.x;
			drag.offsetY = pt.y - drag.startPt.y;
			//trace("move:" + pt.x + "," + drag.startPt.x + "==>" + drag.offsetX );
			if ( !drag.isOffsetFromStart )
			{
				drag.startPt = pt;
			}
			var func = obj._dragFuncs,
				addArgs;

			if ( func )
			{
				addArgs = func.args;
				func = func.draggingFunc;
			}
			if ( func )
			{
				var args = [drag.offsetX, drag.offsetY];
				if ( addArgs )
				{
					args = args.concat(addArgs);
				}
				func.apply(this, args);
			}
		},
		
		/**
		 * 전체 화면상에 마우스를 locking 하여 강제로 대상 컴포넌트의 마우스 이벤트로 호출하게 한다.
		 *
		 * @param {xpComp} xpComp repeatable하고자 하는 xpcomp.
		 * @memberOf Eco.XpCompEvent
		*/
		"_lockMouseEvent": function(comp)
		{
			var win = comp._getWindow();
			win._mouseLockComp = comp;
			win._on_sys_lbuttonup = Eco.XpCompEvent._on_default_sys_lbuttonup;
			win._on_sys_mousemove = Eco.XpCompEvent._on_default_sys_mousemove;
		},
		
		/**
		 * locking시에 window _on_sys_lbuttonup 함수를 이것으로 대처함.
		 * @memberOf Eco.XpCompEvent
		*/
		"_on_default_sys_lbuttonup": function(elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY)
		{
			//elem = this._mouseLockComp._control_element;
			nexacro.Window.prototype._on_default_sys_lbuttonup.call(this, elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY);
			this._on_sys_lbuttonup = nexacro.Window.prototype._on_default_sys_lbuttonup;
			this._on_sys_mousemove = nexacro.Window.prototype._on_default_sys_mousemove;
			
			this._mouseLockComp = null;
		},

		/**
		 * locking시에 window _on_sys_mousemove 함수를 이것으로 대처함.
		 * @memberOf Eco.XpCompEvent
		*/
		"_on_default_sys_mousemove": function(elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY)
		{
			elem = this._mouseLockComp._control_element;
			nexacro.Window.prototype._on_default_sys_mousemove.call(this, elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY);
		},
		
		/**
		 * 주어진 xpComp에 repeat 기능를 설정한다.<br>
		 * 두번째 param 값은 function이거나, object type으로 값이 주어져야 한다.<br>
		 * function이면 repeating 되는 시점에 호출되는 함수로 설정된다.<br>
		 * object이면 object.start, object.end, object.repeating, object.repeatingStop으로 각각 함수값이 주어지는데.<br>
		 * start는 mouse down되는 시점에 호출되는 함수<br>
		 * end는 mouse up되는 시점에 호출되는 함수<br>
		 * repeating는 repeating 하는 시점에 계속 호출되는 함수이다.<br>
		 * repeatingStop는 mouse 누른 상태에서 마우스가 xpComp 영역을 벗어나면 repeating 멈추게 되는데 이 멈추는 시점에 호출되는 함수이다.<br>
		 * 네번째 param인 addArgs로 주어지는 array는 함수 호출시에 추가되는 arguments이다.<br>
		 * 각 함수의 arguments은 다음과 같다.<br>
		 * start                            | end                       | repeating                       | repeatingStop<br>
		 * ----------------------------------------------------------------------------------------------------------------------------<br>
		 * x, y, addArgs[0], addArg[1], ... |addArgs[0], addArg[1], ... |x, y, addArgs[0], addArg[1], ... |addArgs[0], addArg[1], ... <br>
		 * <br>
		 * 세번째 param인 scope는 호출되는 함수 내부의 this값에 해당한다.<br>
		 * 만약 scope를 생략하면 this는 form이 된다.<br>
		 * x, y param 값은 start, repeating이 발생하는 시점의 마우스 x, y값인데 좌표기준은 xpComp.parent 기준으로 처리된다.
		 * @example
		 * // 참조 소스 "unitSample::makeRepeatable.xfdl"
		 * @param {xpComp} xpComp repeatable하고자 하는 xpcomp.
		 * @param {object|function} repeatFunc repeating 처리 루틴에 해당하는 함수들.
		 * @param {*=} scope scope로 설정할 대상.
		 * @param {array=} args 설정된 함수 호출시 추가할 arguments을 array로 설정.
		 * @memberOf Eco.XpCompEvent
		**/
		"makeRepeatable": function(xpComp, repeatFunc, scope, args)
		{
			if ( Eco.isObject(repeatFunc) )
			{
				xpComp._repeatFuncs = {
					"repeatStartFunc": repeatFunc.start,
					"repeatEndFunc": repeatFunc.end,
					"repeatingFunc": repeatFunc.repeating,
					"repeatStopFunc": repeatFunc.repeatingStop,
					"args": args
					};
			}
			else
			{
				xpComp._repeatFuncs = {
					"repeatingFunc": repeatFunc,
					"args": args
					};
			}
			Eco.XpCompEvent.add(xpComp,
					{
						"onlbuttondown": Eco.XpCompEvent.repeatDownHandler,
						"onlbuttonup": Eco.XpCompEvent.repeatUpHandler,
						"onmouseenter": Eco.XpCompEvent.repeatEnterHandler,
						"onmouseleave": Eco.XpCompEvent.repeatLeaveHandler
					}, scope);
		},

		/**
		 * 주어진 xpComp에 repeatable 기능를 해제한다.
		 * @param {xpComp} xpComp repeatable기능을 해제하는 xpcomp.
		 * @memberOf Eco.XpCompEvent
		**/
		"clearRepeatable": function(xpComp)
		{
			if ( xpComp._repeatFuncs )
			{
				xpComp._repeatFuncs = null;
				Eco.XpCompEvent.remove(xpComp,
						{
							"onlbuttondown": Eco.XpCompEvent.repeatDownHandler,
							"onlbuttonup": Eco.XpCompEvent.repeatUpHandler,
							"onmouseenter": Eco.XpCompEvent.repeatEnterHandler,
							"onmouseleave": Eco.XpCompEvent.repeatLeaveHandler
						});
			}
		},

		/**
		 * repeating 기능을 최소하기 위해 내부적으로 사용하는 함수.
		 * @param {xpComp} xpComp repeating 기능을 취소하고자 하는 xpComp.
		 * @memberOf Eco.XpCompEvent
		**/
		"cancelRepeatable": function(xpComp)
		{
			var repeat = xpComp._repeat;
			if ( repeat )
			{
				Eco.XpCompEvent.cancelAnimationFrame(xpComp._reqRepeatId);
				xpComp._reqRepeatId = null;
				xpComp._repeat = null;
			}
		},

		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 onlbuttondown event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"repeatDownHandler": function(obj, e)
		{
			obj._repeat = {
				"curPoint": Eco.XpCompEvent.getOffset(e, obj.parent)
			};			

			var func = obj._repeatFuncs,
				args, addArgs;

			if ( func )
			{
				addArgs = func.args;
				func = func.repeatStartFunc;
				if ( !func )
				{
					func = null;
				}
			}

			if ( func )
			{
				var pt = obj._repeat.curPoint;
				args = [pt.x, pt.y];
				if ( addArgs )
				{
					args = args.concat(addArgs);
				}
				func.apply(this, args);
			}

			Eco.XpCompEvent._repeatProcess.call(this, obj);
		},

		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 onlbuttonup event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"repeatUpHandler": function(obj, e)
		{			
			Eco.XpCompEvent.cancelRepeatable(obj);
			var func = obj._repeatFuncs,
				addArgs;
			if ( func )
			{
				addArgs = func.args;
				func = func.repeatEndFunc;
				if ( !func )
				{
					func = null;
				}
			}

			if ( func )
			{
				if ( !addArgs )
				{
					addArgs = [];
				}
				func.apply(this, addArgs);
			}
		},
		
		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 onmouseenter event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"repeatEnterHandler": function(obj, e)
		{
			var repeat = obj._repeat;
			if ( repeat && repeat.curPoint )
			{
				var pt = Eco.XpCompEvent.getOffset(e, obj.parent);
				repeat.curPoint = pt;
				if ( obj._reqRepeatId === null )
				{
					Eco.XpCompEvent._repeatProcess.call(this, obj);
				}
			}
			else // repeat 처리 함수에서 obj enable false처리되는 경우 고려.
			{
				obj._repeat = null;
			}			
		},
		
		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 onmouseleave event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/		
		"repeatLeaveHandler": function(obj, e)
		{
			var repeat = obj._repeat;
			if ( repeat && repeat.curPoint )
			{
				Eco.XpCompEvent.cancelAnimationFrame(obj._reqRepeatId);//func
				obj._reqRepeatId = null;
				var func = obj._repeatFuncs,
					addArgs;
				if ( func )
				{
					addArgs = func.args;
					func = func.repeatStopFunc;
					if ( !func )
					{
						func = null;
					}
				}

				if ( func )
				{
					if ( !addArgs )
					{
						addArgs = [];
					}
					func.apply(this, addArgs);
				}
			}
			else // repeat 처리 함수에서 obj enable false처리되는 경우 고려.
			{
				obj._repeat = null;
			}			
		},		

		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 onmousemove event의 handler함수
		 * @param {xpComp} obj 발생한 event의 xpComp.
		 * @param {EventInfo} e EventInfo 객체.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"repeatMoveHandler": function(obj, e)
		{
			var repeat = obj._repeat;
			if ( repeat && repeat.objRect )
			{
				//trace("repeat Move:" + obj._id + "==>" + repeat + ",,," + repeat.objRect);
				var pt = Eco.XpCompEvent.getOffset(e, obj.parent);
				if ( repeat.objRect.contains(pt) )
				{
					repeat.curPoint = pt;
					if ( obj._reqRepeatId === null )
					{
						Eco.XpCompEvent._repeatProcess.call(this, obj);
					}
				}
				else
				{
					Eco.XpCompEvent.cancelAnimationFrame(obj._reqRepeatId);//func
					obj._reqRepeatId = null;
					var func = obj._repeatFuncs,
						addArgs;
					if ( func )
					{
						addArgs = func.args;
						func = func.repeatStopFunc;
						if ( !func )
						{
							func = null;
						}
					}

					if ( func )
					{
						if ( !addArgs )
						{
							addArgs = [];
						}
						func.apply(this, addArgs);
					}

				}
			}
			else // repeat 처리 함수에서 obj enable false처리되는 경우 고려.
			{
				obj._repeat = null;
			}
		},

		/**
		 * repeating 기능을 처리하기 위해 내부적으로 설정하는 함수<br>
		 * 이 함수는 XpCompEvent.requestAnimationFrame을 통해 호출되는데 내부적으로 timer 호출이 된다.<br>
		 * 이렇게 호출하는 것은 repeating 중간에 화면 render가 존재하면 smooth하게 처리되는 이점이 있다.
		 * @param {xpComp} obj repeating 발생한 xpComp.
		 * @private
		 * @memberOf Eco.XpCompEvent
		**/
		"_repeatProcess": function(obj)
		{
			obj._reqRepeatId = Eco.XpCompEvent.requestAnimationFrame(Eco.XpCompEvent._repeatProcess, this, obj); //func, scope(default: topForm), func's arguments

			var func = obj._repeatFuncs,
				args, addArgs;

			if ( func )
			{
				addArgs = func.args;
				func = func.repeatingFunc;
				if ( !func )
				{
					func = null;
				}
			}

			if ( func )
			{
				var repeat = obj._repeat;
				if ( repeat && repeat.curPoint )
				{
					args = [repeat.curPoint.x, repeat.curPoint.y];
				}
				else
				{
					args = [-1, -1];
				}
				if ( addArgs )
				{
					args = args.concat(addArgs);
				}
				func.apply(this, args);
			}
		},

		/**
		 * requestAnimationFrame 기능<br>
		 * callback 함수 내부의 this는 주어진 scope가 된다.<br>
		 * 이렇게 호출하는 것은 func 내부 루틴에서 화면 render가 존재하면 smooth하게 처리되는 이점이 있다.
		 * @example
		 * // 참조 소스 "example::snakeTest.xfdl"
		 * @param {function} callback 콜백 함수
		 * @param {*} scope callback 함수 내부에서 this 로 사용할 개체.
		 * @param {...} 호출하는 함수의 arguments
		 * @return {number} unique id.
		 * @memberOf Eco.XpCompEvent
		**/
		"requestAnimationFrame": function(callback, scope)
		{
			var args;
			if ( arguments.length > 2 ) //callback, scope, ....
			{
				args = Eco.array.toArray(arguments, 2);
			}
			else
			{
				args = [];
			}
			
			/*
				현재 Runtime 에는 requestAnimationFrame 이 없으므로 timer 를 이용한다.
				브라우저별로 requestAnimationFrame 가 다를 수 있으므로 체크한다.
			*/
			var isRuntime = nexacro._init_platform_runtime;
			var useSetTimeout = Eco.XpCompEvent._requestAnimationFrameUseSetTimer;
			if( useSetTimeout === undefined ) useSetTimeout = false;
			
			var rAF = Eco.XpCompEvent._requestAnimationFrame;
			if ( !rAF )
			{
				 // Runtime
				if ( isRuntime )
				{
					rAF = function(form, callback, lastTimeRef) {
						var lastTime = lastTimeRef.lastTime;
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));						
						var timer = nexacro.OnceCallbackTimer.callonce(form, callback, timeToCall);
						
						lastTimeRef.lastTime = currTime + timeToCall;
						
						return timer;
					};
				}
				else	// HTML
				{
					var context = JsNamespace.getGlobalContext();
					rAF = context.requestAnimationFrame;
					if ( !rAF )
					{
						//----------------------------------------------------------------------------------
						// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
						// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
						// requestAnimationFrame polyfill by Erik Moller. fixes from Paul Irish and Tino Zijdel
						// MIT license
						//----------------------------------------------------------------------------------
						var vendors = ['ms', 'moz', 'webkit', 'o'];
						for(var x = 0; x < vendors.length && !rAF; ++x) {
							rAF = context[vendors[x]+'RequestAnimationFrame'];
						}
						if ( !rAF )
						{
							rAF = function(callback, lastTimeRef) {
								var lastTime = lastTimeRef.lastTime;
								var currTime = new Date().getTime();
								var timeToCall = Math.max(0, 16 - (currTime - lastTime));
								var id = context.setTimeout(callback, timeToCall);
								
								lastTimeRef.lastTime = currTime + timeToCall;
								return id;
							};
							Eco.XpCompEvent._requestAnimationFrameUseSetTimer = true;
							useSetTimeout = true;
						}
					}
				}
				
				Eco.XpCompEvent._requestAnimationFrame = rAF;
			}
			
			/*
				RequestAnimationFrame 이 없는 브라우저(런타임 포함)에 유사 기능을
				사용하기 위해 timer 를 사용하는데 시간 계산을 위한 lastTime 이
				필요하다. 동일한 callback에 대해 하나의 lastTime 값이 필요하므로
				속성으로 추가하여 사용하고 cancelAnimationFrame 에서 삭제한다.
			*/
			if ( !Eco.XpCompEvent._requestAnimationFrameLastTimeInfo )
			{
				Eco.XpCompEvent._requestAnimationFrameLastTimeInfo = {};
			}
						
			var id;
			if ( isRuntime )
			{
				var form = Eco.XpCompEvent._getRequestAnimationFrameForm(scope);
				var callbackString = callback.toString();
				var lastTimeRef = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callbackString];
				if ( lastTimeRef === undefined )
				{	
					Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callback.toString()] = {'lastTime': 0, 'timers':[]};
					lastTimeRef = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callbackString];
				}
				
				var timer = rAF(form, function() { callback.apply(scope, args); }, lastTimeRef);
				
				id = timer._handle;
				
				// cancel 시 제거할 대상을 위해 지정
				lastTimeRef.id = id;
				lastTimeRef.timers.push(timer);
			}
			else if ( useSetTimeout )
			{
				var callbackString = callback.toString();
				var lastTimeRef = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callback.toString()];
				if ( lastTimeRef === undefined )
				{	
					Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callbackString] = {'lastTime': 0};
					lastTimeRef = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo[callbackString];
				}
				
				id = rAF(function() { callback.apply(scope, args); }, lastTimeRef);
				
				// cancel 시 제거할 대상을 위해 지정
				lastTimeRef.id = id;				
			}
			else
			{
				id = rAF(function() { callback.apply(scope, args); });
			}
						
			return id;
		},
		
		/**
		 * requsetAnimationFrame 기능이 없는 런타임을 위한 것으로<br>
		 * scope 의 ReferenceContext 통해 form 을 찾고 없으면 mainframe의 첫번째 폼을 찾아서 반환.
		 * @param {*} scope requestAnimationFrame 호출시 지정한 scope.
		 * @memberOf Eco.XpCompEvent
		**/		
		"_getRequestAnimationFrameForm": function(scope)
		{
			var form;					
			if ( scope._getReferenceContext )
			{
				// scope ==> Form, Component
				form = scope._getReferenceContext();
			}
			else
			{
				var c = application.mainframe.all[0];
				do {
					if ( c instanceof ChildFrame )
					{
						break;
					}
					c = c.all[0];
				}
				while ( true )
				
				form = c.form;
			}
			return form;
		},
		
		/**
		 * XpCompEvent.requestAnimationFrame 호출한 것을 중지하고자 할때 사용하는 함수.<br>
		 * XpCompEvent.requestAnimationFrame의 return 값으로 id값이 나온다. 이것을 이 함수 argument로 넘겨준다.
		 * @example
		 * // 참조 소스 "example::snakeTest.xfdl"
		 * @param {number} id requestAnimationFrame id.
		 * @memberOf Eco.XpCompEvent
		**/
		"cancelAnimationFrame": function(id)
		{			
			var cAF = Eco.XpCompEvent._cancelAnimationFrame;
			
			if ( !cAF )
			{
				// Runtime
				if ( nexacro._init_platform_runtime )
				{
					cAF = function(id) {
						var lastTimeInfo = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo;
						if ( lastTimeInfo )
						{
							for (var p in lastTimeInfo)
							{
								if ( lastTimeInfo.hasOwnProperty(p) )
								{
									if ( id == lastTimeInfo[p].id )
									{
										var timers = lastTimeInfo[p].timers;
										for (var i=0,len=timers.length; i<len ; i++)
										{
											timers[i].destroy();
											timers[i] = null;
										}
										
										lastTimeInfo[p] = null;
										delete lastTimeInfo[p];			
										break;
									}
								}
							}
						}
					};
				}
				else
				{
					var context = JsNamespace.getGlobalContext();
					cAF = context.cancelAnimationFrame;
					
					if ( !cAF )
					{
						//----------------------------------------------------------------------------------
						// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
						// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
						// requestAnimationFrame polyfill by Erik Moller. fixes from Paul Irish and Tino Zijdel
						// MIT license
						//----------------------------------------------------------------------------------
						var vendors = ['ms', 'moz', 'webkit', 'o'];
						for(var x = 0; x < vendors.length && !cAF; ++x) {
							cAF = context[vendors[x]+'CancelAnimationFrame'] 
                               || context[vendors[x]+'CancelRequestAnimationFrame'];
						}
						
						if ( !cAF )
						{
							cAF = function(id) {
							
								context.clearTimeout(id);
								
								var lastTimeInfo = Eco.XpCompEvent._requestAnimationFrameLastTimeInfo;
								if ( lastTimeInfo )
								{
									for (var p in lastTimeInfo)
									{
										if ( lastTimeInfo.hasOwnProperty(p) )
										{
											if ( id == lastTimeInfo[p].id )
											{
												lastTimeInfo[p] = null;
												delete lastTimeInfo[p];
												break;
											}
										}
									}
								}
							};
						}
					}
				}
				
				Eco.XpCompEvent._cancelAnimationFrame = cAF;
			}
			
			cAF(id);
		}
		
	});
}
