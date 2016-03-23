/**
 * @fileoverview
 * xpComp를 application 실행중 동적생성시<br>
 * cache 처리하여 매번 create하지 않고 처리되는 기능을 담고 있는 함수들의 집합 Namespace이다.<br> 
 */

if ( !JsNamespace.exist("Eco.XpCompFactory") )
{
	/**
	 * @description
	 * XpCompFactory.js파일 at XPLATFORM® software.
	 *
	 * XpCompFactory Namespace 정의<br>
	 * xpComp를 application running시에 동적으로 생성을 필요시에 cache 처리하여 매번 create하지 않고<br> 
	 * 처리되는 기능을 담고 있는 함수들의 집합 Namespace이다.<br>
	 *<br>
	 * XpCompFactory 생성된 컴포넌트들 관리 방법<br>
	 *<br>
	 * 주어지는 form 컴포넌트에 사용자 속성으로 [_used], [_cache] 명칭의 simple object가 존재하게 된다.<br>
	 *<br>
	 * pool명칭을 지정하지 않은 경우<br>
	 * -----------------------------------------------<br>
	 * _defaultUsed :  사용중인 _id 값으로 이루어진 object collection <br>
	 * _defaultCache :  [comp Type명칭] 속성으로 사용하지 않은 comp를 담고 있는 array<br>
	 *<br>
	 * pool명칭을 지정한 경우<br>
	 * -----------------------------------------------<br>
	 * _used : [pool명칭] 속성으로 사용중인 _id 값으로 이루어진 object collection<br>
	 * _cache : [pool명칭] 속성으로 사용하지 않은 comp를 담고 있는 array<br>
	 *<br>
	 * 또한 xpComp 속성 값 할당 및 position, size 변경 처리를 <br>
	 * xpComp에 바로 반영하지 않고 예약 기록하여 필요시 한번에 처리하여<br>
	 * 불필요한 화면 render 줄이는 기능을 담고 있다. <br>
	 * Copyright (c) 2013 EcoSystem of TOBESOFT Inc.<br>
	 * Licensed Free under XPLATFORM® software.
	 * @namespace
	 * @name Eco.XpCompFactory
	 * @memberof! <global>
	*/

	JsNamespace.declare("Eco.XpCompFactory", {
	
		/**
		 * 주어진 p 즉 form(div, tabpage포함)에 종속된 comp 중에서 사용되고 있는 것에 해당하고,<br>
		 * 주어진 name과 comp._id가 일치하는 comp 얻는 함수<br>
		 * 단 XpCompFactory로 통해서 생성된 경우만 해당된다.<br>
		 * p 첫번쨰 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.<br>
		 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.<br>
		 * @param {Form|object} p form에 해당하는 XpComp 또는 p.target, p.poolName가지는 object.
		 * @param {string} name 찾고자 하는 comp._id.
		 * @return {XpComp} name 해당하는 comp.
		 * @example
		 * trace(Eco.XpCompFactory.getXpCompByName(Div00, "item01"));	// output : _id가 item01인 comp
		 * @memberOf Eco.XpCompFactory
		 */
		"getXpCompByName": function(p, name)
		{
			var poolName = "default",
				target = p;

			if ( Eco.isObject(p) )
			{
				target = p.target;
				poolName = p.poolName;
			}
			var used = Eco.XpCompFactory._getUsed(target, poolName);
			if ( used )
			{
				return used[name];
			}
		},
		/**
		 * 주어진 p 즉 form(div, tabpage포함)에 설정되어진 cache array를 얻는  함수<br>
		 * 만약 poolName이 [default] 인데 isCreate가 true이고 주어진 type 값이 없으면 [default] collection를 return한다.
		 * @param {Form} p form.
		 * @param {string} poolName pool 명칭.
		 * @param {string=} type pool 명칭이 default일 때 xpComp type명칭이다.
		 * @param {boolean=} isCreate pool 이 존재하지 않으면 생성 처리한다.
		 * @return {array}  사용하지 않고 cache된 comp array
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_getCache": function(p, poolName, type, isCreate)
		{
			var cache;
			if ( poolName == "default" )
			{
				cache = p._defaultCache;
				if ( isCreate && !cache )
				{
					p._defaultCache = {};
					cache = p._defaultCache;
				}
				if ( !cache ) return null;
				if ( !type || !type.length )
				{
					Eco.Logger.error({message:"poolName이 'default'면 type값이 반드시 존재해야 합니다.", stack: true});
				}
				var typeCache = cache[type];
				if ( isCreate && !typeCache )
				{
					cache[type] = [];
					typeCache = cache[type];
				}
				return typeCache;
			}
			else
			{
				cache = p._cache;
				if ( isCreate && !cache )
				{
					p._cache = {};
					cache = p._cache;
				}
				if ( !cache ) return null;
				var namedCache = cache[poolName];
				if ( isCreate && !namedCache )
				{
					cache[poolName] = [];
					namedCache = cache[poolName];
				}
				return namedCache;
			}
		},
		/**
		 * 주어진 p 즉 form(div, tabpage포함)에 설정되어진 사용하고 있는 comp들의 collection를 얻는  함수
		 * @param {Form} p form.
		 * @param {string} poolName pool 명칭.
		 * @param {boolean=} isCreate pool 이 존재하지 않으면 생성 처리한다.
		 * @return {object} 사용된 comp를 id별로 담고 있는 object collection
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_getUsed": function(p, poolName, isCreate)
		{
			var used;
			if ( poolName == "default" )
			{
				used = p._defaultUsed;
				if ( isCreate && !used )
				{
					p._defaultUsed = {};
					used = p._defaultUsed;
				}
			}
			else
			{
				used = p._used;
				if ( isCreate && !used )
				{
					p._used = {};
					used = p._used;
				}
				if ( !used ) return null;

				var tmpPoolUsed = used[poolName];

				if ( isCreate && !tmpPoolUsed )
				{
					used[poolName] = {};
					tmpPoolUsed = used[poolName];
				}
				return tmpPoolUsed;
			}
			return used;
		},		
		/**
		 * 주어진 p 즉 form(div, tabpage포함)에 종속된 comp을 얻는 함수<br>
		 * 주어진 nm으로 comp._id을 설정한다. 필요시에는 cache된 comp를 재 사용한다.
		 * p 첫번쨰 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
		 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
		 * @param {Form|object} p form에 해당하는 XpComp 또는 p.target, p.poolName가지는 object.
		 * @param {string} type xpComp type.
		 * @param {string} nm 설정하고자 하는 comp._id.
		 * @return {XpComp} 동적으로 생성되거나, cache에서 재 사용된 comp.
		 * @example
		 * trace(Eco.XpCompFactory.getXpComp(Div00, "Static", "item01"));	// output : _id가 item01인 Static's comp
		 * @memberOf Eco.XpCompFactory
		 */
		"getXpComp": function(p, type, nm)
		{
			var xpcomp,
				poolName = "default",
				target = p,
				cache,
				factory = Eco.XpCompFactory;

			if ( Eco.isObject(p) )
			{
				target = p.target;
				poolName = p.poolName;
			}

			cache = factory._getCache(target, poolName, type);

			var compNm;

			if ( !Eco.isString(arguments[2]) ) compNm = null;
			else compNm = nm;

			
			if ( cache && cache.length)
			{
				xpcomp = cache.pop();
				xpcomp._id = compNm || xpcomp._id || xpcomp.name;
			}
			else
			{
				var ctor = factory._getConstructor(target, type);
				if ( !ctor )
				{
					Eco.Logger.error({"message": "type(" + type + ") is not exist!", stack: true});
				}
				xpcomp = new ctor();
				xpcomp.init(Eco.getUniqueId(type + "_"), "absolute", 0, 0, 0, 0);
				target.addChild(xpcomp.name, xpcomp);
				xpcomp.show();
				xpcomp._id = compNm || xpcomp.name;
			}
			var argLens = arguments.length;
			if ( argLens > 2 )
			{
				var rect, args;
				if ( Eco.isString(arguments[2])) //nm 이후 rect 처리
				{
					if ( argLens == 4 )
					{
						factory.setRect(xpcomp, arguments[3]);
					}
					else if ( argLens == 5 )
					{
						factory.setRect(xpcomp, arguments[3], arguments[4]);
					}
					else if ( argLens == 6 )
					{
						factory.setRect(xpcomp, arguments[3], arguments[4], arguments[5]);
					}
					else if ( argLens == 7 )
					{
						factory.setRect(xpcomp, arguments[3], arguments[4], arguments[5], arguments[6]);
					}
				}
				else if ( arguments[2] != null )
				{
					if ( argLens == 3 )
					{
						factory.setRect(xpcomp, arguments[2]);
					}
					else if ( argLens == 4 )
					{
						factory.setRect(xpcomp, arguments[2], arguments[3]);
					}
					else if ( argLens == 5 )
					{
						factory.setRect(xpcomp, arguments[2], arguments[3], arguments[4]);
					}
					else if ( argLens == 6 )
					{
						factory.setRect(xpcomp, arguments[2], arguments[3], arguments[4], arguments[5]);
					}
				}
			}
			factory.setProperties(xpcomp, "visible", true);

			var used = factory._getUsed(target, poolName, true);
			used[xpcomp._id] = xpcomp;
			return xpcomp;
		},
		/**
		 * type에 해당하는 생성자를 얻는 함수이다.
		 * @param {Form} p form.
		 * @param {string} type xpComp type.
		 * @return {xpcomp constructor} xpcomp 생성자
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_getConstructor": function(p, type)
		{
			var context = JsNamespace.getGlobalContext();
			return context[type];
		},
		/**
		 * 주어진 c 즉 xpComp을 재활용하기 위해 visible false 처리하는 함수<br>
		 * 두번째 clear는 기 정의된 속성값을 모두 clear할 것인지 flag이다.
		 * @param {xpComp} c xpComp.
		 * @param {boolean=} clear 정의된 속성값 clear 할 것인지?.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_recycle": function(c, clear)
		{
			var setPropFunc = Eco.XpCompFactory.setProperties;

			if ( clear )
			{
				c._props = null;
				var props = c._curProps;
				if ( props )
				{
					for ( var prop in props )
					{
						if ( prop != "visible" && props.hasOwnProperty(prop) )
						{
							setPropFunc(c, prop, ""); //comp 속성 값 구성 할 때 null 값은 오류 발생됨
						}
					}
					//c._curProps = null;
				}
				setPropFunc(c, "visible", false);
				//console.log("_recycle==>", c.id, c._props);
			}
			else
			{
				setPropFunc(c, "visible", false);
			}
		},
		/**
		 * 주어진 c 즉 xpComp의 설정된 rect 정보를 얻는다.<br>
		 * 변경할 예정이거나, 이미 변경된 순서대로 rect 정보를 얻는다.
		 * @param {xpComp} c xpComp.
		 * @return {Eco.Rectangle} x, y, width, height로 된 rectangle 객체.
		 * @memberOf Eco.XpCompFactory
		 */
		"getRect": function(c)
		{
			var tmpRect = c._rect || c._curRect;
			if ( !tmpRect )
			{
				tmpRect = new Eco.Rectangle(c.getPixelLeft(), c.getPixelTop(), c.getPixelWidth(), c.getPixelHeight());
			}
			return tmpRect;
		},
		
		/**
		 * xpComp의 boder,margin,scrollbar width 크기를 제외한 client 영역 width 를 반환한다.
		 ** @param {xpComp} xpComp XPLATFORM Component
		 * @return {number} client 영역 width
		 * @memberOf Eco.XpCompFactory
		 */
		"getClientWidth": function(xpComp)
		{
			var wholeWidth = Eco.XpCompFactory.getRect(xpComp).width;
			return Eco.XPComp.PositionSize.getClientWidth(xpComp, wholeWidth);
		},	
			
		/**
		 * xpComp의 boder,margin,scrollbar height 크기를 제외한 client 영역 height 를 반환한다.
		 * @param {xpComp} xpComp XPLATFORM Component
		 * @return {number} client 영역 height
		 * @memberOf Eco.XpCompFactory
		 */
		"getClientHeight": function(xpComp)
		{
			var wholeHeight =  Eco.XpCompFactory.getRect(xpComp).height;
			return Eco.XPComp.PositionSize.getClientHeight(xpComp, wholeHeight);
		},
						
		 /**
		 * 컴포넌트에 입력받은 스타일 적용했을 경우(실제적용 없음)<br>
		 * 모양을 표시하기 위한 최소 크기(너비,높이) 반환.
		 * <pre>
		 * ※ 크기에 영향을 미치는 요소는 다음과 같다.
		 *    - margin
		 *    - border
		 *    - padding
		 *    - text
		 * </pre>
		 * @param {xpComp} xpComp XPLATFORM Component
		 * @param {string} text text
		 * @param {Eco.CssItem} CssItem {@link Eco.CssItem}를 사용한 스타일 속성정보
		 * @return {array} [너비, 높이]
		 * @memberOf Eco.XpCompFactory
		 */		 
		"getContentSizeWithStyle": function(xpComp, text, styleSheet)
		{
			if(Eco.isEmpty(styleSheet))
			{
				Eco.Logger.error({message:"styleSheet(스타일 속성정보)는 필수 입력값 입니다."
				                   , stack: true});
				return;
			}
			
			//border 변수를 사용하면 object가 반환됨. why??? 2013.09.30.1 버전
			//그래서 변수앞에 underscore를 사용함
			var _margin = styleSheet.getMargin(),
			    _border = styleSheet.getBorder(),
			    _padding = styleSheet.getPadding();
			
			//font를 적용한 텍스트 size 계산.
			var tempFont = styleSheet.getFont()["_font"];
			var textSize = nexacro._getTextSize2(text, tempFont);
			
			_border = _border.getLeft().getWidth() * 2;
			
			var etcWidth = _margin.getLeft()  + _margin.getRight() + _border +
			               _padding.getLeft() + _padding.getRight();
			var etcHeight = _margin.getTop()  + _margin.getBottom() + _border +
			                _padding.getTop() + _padding.getBottom();

			return [textSize[0] + etcWidth, textSize[1] + etcHeight];
		},
		
		/**
		 * 주어진 c 즉 xpComp의 rect 정보를 설정한다.<br>
		 * Eco.XpCompFactory.doLayout 함수를 호출하기 전까지 실질로 화면상에 변경이 발생하지 않는다.
		 * 설정된 정보를 _rect에 가지고 있다가 doLayout함수 호출하는 시점에 반영하고 _rect정보는 clear된다.
		 * @param {xpComp} c xpComp.
		 * @param {...*} x, y, width, height 또는 Eco.Size(width, height)객체 또는 x, y 인자로 구성 될 수 있다.
		 * @memberOf Eco.XpCompFactory
		 */
		"setRect": function(c)
		{
			var argsLen = arguments.length;
			var curRect = c._curRect;
			var rect = c._rect;

			if ( argsLen == 5 )
			{
				if ( rect )
				{
					rect.x = arguments[1];
					rect.y = arguments[2];
					rect.width = arguments[3];
					rect.height = arguments[4];
					
				}
				else
				{
					rect = new Eco.Rectangle(arguments[1], arguments[2], arguments[3], arguments[4]);
				}
			}
			else if ( argsLen == 3 ) //point, size or x, y
			{
				if ( Eco.isNumber(arguments[1]) )
				{
					if ( rect )
					{
						rect.x = arguments[1];
						rect.y = arguments[2];
					}
					else
					{
						rect = new Eco.Rectangle(arguments[1], arguments[2], 0, 0);
					}
				}
				else
				{
					if ( rect )
					{
						rect.x = arguments[1].x;
						rect.y = arguments[1].y;
						rect.width = arguments[2].width;
						rect.height = arguments[2].height;
					}
					else
					{
						rect = new Eco.Rectangle(arguments[1].x, arguments[1].y, arguments[2].width, arguments[2].height);
					}
				}
			}
			else if ( argsLen == 2 ) //point or size or rectangle
			{
				if ( arguments[1] instanceof Eco.Rectangle )
				{
					rect = arguments[1];
				}
				else if ( arguments[1] instanceof Eco.Size )
				{
					if ( rect )
					{
						rect.width = arguments[1].width;
						rect.height = arguments[1].height;
					}
					else
					{
						rect = new Eco.Rectangle(0, 0, arguments[1].width, arguments[1].height);
					}
				}
				else if ( arguments[1] instanceof Eco.Point )
				{
					if ( rect )
					{
						rect.x = arguments[1].x;
						rect.y = arguments[1].y;
					}
					else
					{
						rect = new Eco.Rectangle(arguments[1].x, arguments[1].y, 0, 0);
					}
				}
			}
			else if ( argsLen == 4 ) // x, y, size or pt, width, height
			{
				if ( arguments[1] instanceof Eco.Point )
				{
					if ( rect )
					{
						rect.x = arguments[1].x;
						rect.y = arguments[1].y;
						rect.width = arguments[2];
						rect.height = arguments[3];
					}
					else
					{
						rect = new Eco.Rectangle(arguments[1].x, arguments[1].y, arguments[2], arguments[3]);
					}
				}
				else
				{
					if ( rect )
					{
						rect.x = arguments[1];
						rect.y = arguments[2];
						rect.width = arguments[3].width;
						rect.height = arguments[3].height;
					}
					else
					{
						rect = new Eco.Rectangle(arguments[1], arguments[2], arguments[3].width, arguments[3].height);
					}
				}
			}

			if ( curRect )
			{
				if (!curRect.equals(rect))
				{
					c._rect = rect;
					Eco.XpCompFactory.invalidateRect(c);
				}
				else
				{
					c._needsRender = false;
					Eco.XpCompFactory._removeRenderItems(c);
					Eco.XpCompFactory._deleteParentRect(c.parent);
				}
			}
			else
			{
				c._rect = rect;
				Eco.XpCompFactory.invalidateRect(c);
			}
		},
		/**
		 * 주어진 c을 가지고 주어진 propName의 속성 값을 얻는다.<br>
		 * 변경할 예정이거나, 이미 변경된 순서대로 속성 정보를 얻는다.
		 * @param {xpComp} c xpComp.
		 * @param {string} propName 속성 명칭.
		 * @return {*} 해당 속성 값.
		 * @memberOf Eco.XpCompFactory
		 */
		"getProperty": function(c, propName)
		{
			var propVal;
			if ( c._props )
			{
				propVal = c._props[propName];
			}
			
			if ( (propVal == null) && c._curProps )
			{
				propVal = c._curProps[propName];
			}

			if (propVal == null)
			{
				propVal = c[propName];
			}
			return propVal;
		},
		/**
		 * 주어진 c 즉 xpComp의 속성 값을 설정한다.<br>
		 * Eco.XpCompFactory.doLayout 함수를 호출하기 전까지 실질로 화면상에 변경이 발생하지 않는다.
		 * 설정된 정보를 _props에 가지고 있다가 doLayout함수 호출하는 시점에 반영하고 _props정보는 clear된다.
		 * @param {xpComp} c xpComp.
		 * @param {...*} prop명칭, prop값 순으로 정의되는 인자.
		 * @memberOf Eco.XpCompFactory
		 */
		"setProperties": function(c)
		{
			//style 속성의 하위 속성 명칭은 1depth만 정의
			// 즉 style.font 
			// style = "";
			var curprops = c._curProps || {},
				props = c._props || {},
				args = arguments,
				prop, subProp, value, changed = false;

			for(var i = 1, n = args.length ; i < n ; i+=2 )
			{
				prop = args[i];
				value = args[i+1];
				
				if ( props[prop] != value || curprops[prop] !== value )
				{
					changed = true;
					props[prop] = value;
					if ( curprops[prop] === value )
					{
						delete props[prop];
					}
				}
			}
			if ( changed )
			{
				var isexist = false;
				for ( var p in props )
				{
					if ( props.hasOwnProperty(p) )
					{
						isexist = true;
						break;
					}
				}
				if ( isexist )
				{
					c._props = props;
				}
				else
				{
					c._props = null;
				}
				Eco.XpCompFactory.invalidateProps(c);
			}
		},
		/**
		 * p는 form 객체인데 p에 속한 comp 중에 변경된 속성 및 rect를 실질로 화면상에 반영한다.<br>
		 * isDownward인자는 하위 form까지 처리할 것인지 여부이다. default는 false 처리된다.
		 * @param {form} p form xpComp.
		 * @param {boolean=} isDownward 하위 form까지 처리할 것인지 여부.
		 * @memberOf Eco.XpCompFactory
		 */
		"doLayout": function(p, isDownward)
		{
			if ( isDownward )
			{
				var cs = p._commitPropItems,
					childs = p._changesPropChilds;
				if ( ((cs && cs.length) || (childs && childs.length)) && !p._processLayout )
				{
					p._processLayout = true;
					Eco.XpCompFactory._commitPropsProcess(p, isDownward);
					p._processLayout = false;
				}
				cs = p._renderItems;
				childs = p._changesRectChilds;
				if ( ((cs && cs.length) || (childs && childs.length)) && !p._processLayout )
				{
					p._processLayout = true;
					Eco.XpCompFactory._doRender(p, isDownward);
					p._processLayout = false;
				}
			}
			else
			{
				var cs = p._commitPropItems;
				if ( cs && cs.length && !p._processLayout )
				{
					p._processLayout = true;
					Eco.XpCompFactory._commitPropsProcess(p, isDownward);
					p._processLayout = false;
				}
				cs = p._renderItems;
				if ( cs && cs.length && !p._processLayout )
				{
					p._processLayout = true;
					Eco.XpCompFactory._doRender(p, isDownward);
					p._processLayout = false;
				}
			}
		},
		/**
		 * p는 form 객체인데 p에 속한 comp 중에 속성 값이 변경되어진 목록인 [_commitPropItems] array를<br>
		 * 가지고 속성을 실질로 반영하는 처리를 한다.<br>
		 * isDownward인자는 하위 form까지 처리할 것인지 여부이다. default는 false 처리된다.
		 * @param {form} p form xpComp.
		 * @param {boolean=} isDownward 하위 form까지 처리할 것인지 여부.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_commitPropsProcess": function(p, isDownward)
		{
			var cs = p._commitPropItems,
				factory = Eco.XpCompFactory;
			if ( cs && cs.length && !p._processCommitProps )
			{
				p._processCommitProps = true;
				for (var i = 0, c; (c = cs[i]) ; i++)
				{
					//if ( c instanceof Form )
					//{
					//	XpCompFactory._commitProps(c);
					//	if ( isDownward ) XpCompFactory._commitPropsProcess(c, isDownward);
					//}
					//else
					//{
						factory._commitProps(c);
					//}
				}
				p._commitPropItems = null;
				p._processCommitProps = false;
			}
			if ( isDownward )
			{
				cs = p._changesPropChilds;
				if ( cs && cs.length )
				{
					for (var i = 0, c; (c = cs[i]) ; i++)
					{
						factory._commitPropsProcess(c, isDownward);
						c._needsPropChildsReg = false;
					}
					p._changesPropChilds = null;
				}
			}
		},
		/**
		 * p는 form 객체인데 p에 속한 comp 중에 rect 값이 변경되어진 목록인 [_renderItems] array를<br>
		 * 가지고 변경된 rect을 실질로 반영하는 처리를 한다.<br>
		 * isDownward인자는 하위 form까지 처리할 것인지 여부이다. default는 false 처리된다.
		 * @param {form} p form xpComp.
		 * @param {boolean=} isDownward 하위 form까지 처리할 것인지 여부.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_doRender": function(p, isDownward)
		{
			var cs = p._renderItems,
				factory = Eco.XpCompFactory;
			if ( cs && cs.length && !p._processRender )
			{
				//console.log("_doRender", p._id, cs.length);
				p._processRender = true;
				for (var i = 0, c; (c = cs[i]) ; i++)
				{
					//if ( c instanceof Form )
					//{
					//	if ( !(c instanceof Tabpage) )
					//	{
					//		XpCompFactory._changePosSize(c);
					//	}
					//	if ( isDownward ) XpCompFactory._doRender(c, isDownward);
					//}
					//else
					//{
					 if ( !(c instanceof Tabpage) ) factory._changePosSize(c);
					// XpCompFactory._changePosSize(c);
					//}
				}
				p._renderItems = null;
				p._processRender = false;
			}
			if ( isDownward )
			{
				cs = p._changesRectChilds;
				if ( cs && cs.length )
				{
					for (var i = 0, c; (c = cs[i]) ; i++)
					{
						factory._doRender(c, isDownward);
						c._needsRectChildsReg = false;
					}
					p._changesRectChilds = null;
				}
			}
		},
		/**
		 * 주어진 clist array 목록 순으로 zorder를 반영한다.<br>
		 * @param {array} clist xpComp array.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_doZOrder": function(clist)
		{
			for ( var i = 1, len = clist.length ; i < len ; i++ )
			{
				//clist[i].moveToNext(clist[i - 1]);
				clist[i].moveToPrev(clist[i - 1]);
			}
		},
		/**
		 * 주어진 c 즉 xpComp의 속성 및 rect 변경되어 차후 반영할 것을 예약 처리한다.<br>
		 * c.parent의 _renderItems, _commitPropItems array에 각각 등록한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"invalidate": function(c)
		{
			Eco.XpCompFactory.invalidateProps(c);
			Eco.XpCompFactory.invalidateRect(c);
		},
		/**
		 * 주어진 c 즉 xpComp의 속성 및 rect 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"validate": function(c)
		{
			Eco.XpCompFactory.invalidate(c);
			Eco.XpCompFactory.doLayout(c.parent);
		},	
		/**
		 * 주어진 c 즉 xpComp의 rect 변경되어 차후 반영할 것을 예약 처리한다.<br>
		 * c.parent의 _renderItems array에 등록한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"invalidateRect": function(c)
		{
			if ( !c._needsRender )
			{
				c._needsRender = true;
				Eco.XpCompFactory._addRenderItems(c);
				Eco.XpCompFactory._invalidateParentRect(c.parent);
			}
		},
		/**
		 * 주어진 c 즉 xpComp의 rect 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"validateRect": function(c)
		{
			Eco.XpCompFactory.invalidateRect(c);
			Eco.XpCompFactory.doLayout(c.parent);
		},
		/**
		 * 주어진 c 의 상위 comp에 rect(position, size)가 변경된 child가 존재하다고 예약 처리한다.<br>
		 * c.parent의 _changesRectChilds array에 등록한다.<br>
		 * recursion으로 parent에 예약 처리하면서 ChildFrame에서 멈춘다. 
		 * @param {xpComp} c xpComp.
		 * @memberOf XpCompFactory
		 */
		"_invalidateParentRect": function(c)
		{
			var p = c.parent;
			if ( !p || p instanceof ChildFrame ) return;
			//if ( p instanceof Tabpage )
			//{
			//	var tabParent = p.parent.parent;
			//}
			if ( p._changesRectChilds == null )
			{
				p._changesRectChilds = [];
			}
			if ( !c._needsRectChildsReg )
			{
				c._needsRectChildsReg = true;
				p._changesRectChilds.push(c);
			}
			Eco.XpCompFactory._invalidateParentRect(p);
		},
		/**
		 * 주어진 c 의 상위 comp에 rect(position, size)가 변경되었다고 예약된 child를 삭제한다.<br>
		 * c.parent의 _changesRectChilds array에 삭제한다.<br>
		 * recursion으로 parent에 삭제 처리하면서 ChildFrame에서 멈춘다. 
		 * @param {xpComp} c xpComp.
		 * @memberOf XpCompFactory
		 */
		"_deleteParentRect": function(c)
		{
			var p = c.parent;
			if ( p instanceof ChildFrame ) return;
			//if ( p instanceof Tabpage )
			//{
			//	var tabParent = p.parent.parent;
			//}
			if ( p._changesRectChilds && c._needsRectChildsReg && (!c._renderItems || c._renderItems.length == 0 ))
			{
				Eco.array.remove(p._changesRectChilds, c);
				c._needsRectChildsReg = false;
			}
			if ( p._changesPropChilds && c._needsPropChildsReg && (!c._commitPropItems || c._commitPropItems.length == 0 ) )

			//if ( p._changesRectChilds.length == 0 ) p._changesRectChilds = null;

			Eco.XpCompFactory._deleteParentRect(p);
		},
		/**
		 * 주어진 c 즉 xpComp의 속성이 변경되어 차후 반영할 것을 예약 처리한다.<br>
		 * c.parent의 _commitPropItems array에 등록한다.<br>
		 * c의 변경할 c._props 값과 변경된 값인 c._curProps 값이 동일하면 <br>
		 * 속성 변경할 목록인_commitPropItems array에서 제거한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"invalidateProps": function(c)
		{
			if ( c._props )
			{
				if ( !c._needsCommitProps )
				{
					c._needsCommitProps = true;
					Eco.XpCompFactory._addCommitPropItems(c);
					Eco.XpCompFactory._invalidateParentProps(c.parent);
				}
			}
			else
			{
				c._needsCommitProps = false;
				Eco.XpCompFactory._removeCommitPropItems(c);
				Eco.XpCompFactory._deleteParentProps(c.parent);
			}
		},
		/**
		 * 주어진 c 의 상위 comp에 property가 변경된 child가 존재하다고 예약 처리한다.<br>
		 * c.parent의 _changesPropChilds array에 등록한다.<br>
		 * recursion으로 parent에 예약 처리하면서 ChildFrame에서 멈춘다. 
		 * @param {xpComp} c xpComp.
		 * @memberOf XpCompFactory
		 */
		"_invalidateParentProps": function(c)
		{
			var p = c.parent;
			if ( !p || p instanceof ChildFrame ) return;
			//if ( p instanceof Tabpage )
			//{
			//	var tabParent = p.parent.parent;
			//}
			if ( p._changesPropChilds == null )
			{
				p._changesPropChilds = [];
			}
			if ( !c._needsPropChildsReg )
			{
				c._needsPropChildsReg = true;
				p._changesPropChilds.push(c);
			}
			Eco.XpCompFactory._invalidateParentProps(p);
		},
		/**
		 * 주어진 c 의 상위 comp에 property가 변경되었다고 예약된 child를 삭제한다.<br>
		 * c.parent의 _changesPropChilds array에 삭제한다.<br>
		 * recursion으로 parent에 삭제 처리하면서 ChildFrame에서 멈춘다. 
		 * @param {xpComp} c xpComp.
		 * @memberOf XpCompFactory
		 */
		"_deleteParentProps": function(c)
		{
			var p = c.parent;
			if ( p instanceof ChildFrame ) return;
			//if ( p instanceof Tabpage )
			//{
			//	var tabParent = p.parent.parent;
			//}
			if ( p._changesPropChilds && c._needsPropChildsReg && (!c._commitPropItems || c._commitPropItems.length == 0 ) )
			{
				Eco.array.remove(p._changesPropChilds, c);
				c._needsPropChildsReg = false;
			}

			//if ( p._changesPropChilds.length == 0 ) p._changesPropChilds = null;

			Eco.XpCompFactory._deleteParentProps(p);
		},
		/**
		 * 주어진 c 즉 xpComp의 속성이 변경되었다고 기록한 후 즉시 doLayout를 호출하여 반영처리한다.
		 * @param {xpComp} c xpComp.
		 * @memberOf Eco.XpCompFactory
		 */
		"validateProps": function(c)
		{
			Eco.XpCompFactory.invalidateProps(c);
			Eco.XpCompFactory.doLayout(c.parent);
		},
		/**
		 * rect정보가 변경된 목록인 _renderItems array에 주어진 c 즉 xpComp를 추가한다.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_addRenderItems": function(c)
		{
			if ( c instanceof Tabpage )
			{
				Eco.Logger.error({"meassge": "Tabpage는 position 및 size를 변경 할 수 없습니다.", "stack": true});
			}
			var p = c.parent;
			if ( p instanceof Tabpage )
			{
				var tabParent = p.parent.parent;
				if ( !tabParent._renderItems )
				{
					tabParent._renderItems = [];
				}
				if ( Eco.array.indexOf(tabParent._renderItems, p) == -1 )
				{
					tabParent._renderItems.push(p);
				}
			}
			if ( !p._renderItems )
			{
				p._renderItems = [];
			}
			p._renderItems.push(c);
		},
		/**
		 * 속성 정보가 변경된 목록인 _commitPropItems array에 주어진 c 즉 xpComp를 추가한다.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_addCommitPropItems": function(c)
		{
			var p = c.parent;
			if ( !p._commitPropItems )
			{
				p._commitPropItems = [];
			}
			p._commitPropItems.push(c);
		},
		/**
		 * rect정보가 변경된 목록인 _renderItems array에 주어진 c 즉 xpComp를 제거한다.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_removeRenderItems": function(c)
		{
			var p = c.parent;
			if ( p._renderItems )
			{
				Eco.array.remove(p._renderItems, c);
			}
		},
		/**
		 * 속성 정보가 변경된 목록인 _commitPropItems array에 주어진 c 즉 xpComp를 제거한다.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_removeCommitPropItems": function(c)
		{
			var p = c.parent;
			if ( p._commitPropItems )
			{
				Eco.array.remove(p._commitPropItems, c);
			}
		},
		/**
		 * 주어진 c 즉 xpComp의 c._props는 변경할 속성들의 정보 값인데 이것을 실질로 c에 반영하는 처리.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_commitProps": function(c)
		{
			if ( c._needsCommitProps )
			{
				if ( c._debug ) 
					trace("propChange==>" + (c._id || c.name) + "//" + Eco.object.getPropertyNames(c._props));
				var props = c._props,
					curprops = c._curProps || {},
					curVal;
				if ( props )
				{
					for ( var pNm in props )
					{
						if (props.hasOwnProperty(pNm))
						{
							curVal = props[pNm];
							c["set_" +pNm](curVal);
							curprops[pNm] = curVal;
						}
					}
					c._props = null;
					c._curProps = curprops;
					//console.log(c._id, c._curProps);
				}
				c._needsCommitProps = false;
			}
		},
		/**
		 * 주어진 c 즉 xpComp의 c._rect는 변경할 rect 정보 값인데 이것을 실질로 c에 반영하는 처리.
		 * @param {xpComp} c xpComp.
		 * @private
		 * @memberOf Eco.XpCompFactory
		 */
		"_changePosSize": function(c)
		{
			if ( c._needsRender )
			{
				if ( c._debug )
				{
					trace("rectChange==>" + (c._id || c.name) + "::" + c._rect.toString() + "," + c.text + "," + c.visible + "," + c.style.border);
				}
				var rect = c._rect;
				if ( rect )
				{
					c.move(rect.x, rect.y, rect.width, rect.height);
					if ( c._debug ) trace("l:"+c.getPixelLeft()+" t:"+c.getPixelTop()+" w:"+c.getPixelWidth()+" h:"+c.getPixelHeight());
					c._curRect = rect.clone();
				}
				c._needsRender = false;
			}
		},
		/**
		 * 주어진 p 즉 form 객체에 속하고, 주어진 명칭의 array에 해당하는 comp를 모두 cache 처리한다.<br>
		 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
		 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
		 * 첫번째 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
		 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
		 * @param {Form|object} p form xpComp 또는 object로 {target: form객체, poolName: "rowobjs"} .
		 * @param {array} names cache처리할 대상를 comp._id의 array.
		 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
		 * @memberOf Eco.XpCompFactory
		 */
		"releaseNamed": function(p, names, propsClear)
		{
			var poolName = "default",
				target = p,
				used, cache, c, clearArr = [],
				isDefaultPool;

			if ( Eco.isObject(p) )
			{
				target = p.target;
				poolName = p.poolName;
			}

			used = Eco.XpCompFactory._getUsed(target, poolName);
			if ( !used ) return;
			isDefaultPool = (poolName == "default");
			if ( isDefaultPool )
			{
				cache = p._defaultCache;
				if ( !cache )
				{
					p._defaultCache = {};
					cache = p._defaultCache;
				}
			}
			else
			{
				cache = Eco.XpCompFactory._getCache(target, poolName, null, true);
			}
			for ( var i = 0, len = names.length ; i < len ; i++ )
			{
				c = used[names[i]];
				if ( c )
				{
					if ( isDefaultPool )
					{
						var type = Eco.XPComp.typeOf(c);
						if ( !cache[type] )
						{
							cache[type] = [];
						}
						//p._xppool[type].push(c);
						cache[type].splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.			
					}
					else
					{
						cache.splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.			
					}
					Eco.XpCompFactory._recycle(c, propsClear);
					clearArr.push(c);
				}
			}
			for ( var i = 0, len = clearArr.length ; i < len ; i++ )
			{
				delete used[clearArr[i]._id];
			}
		},
		/**
		 * 주어진 p 즉 form 객체에 속한 사용중인 comp를 모두 cache 처리한다.<br>
		 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
		 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
		 * 두번째 param인 exclude는 xpComp array인데 이것은 cache처리할 대상에서 제외한다.<br>
		 * 세번째 param은 cache처리할 때 기 설정된 속성값들을 clear 할 것인지 여부이다.
		 * 첫번째 인자는 form이거나, object로 {target: form객체, poolName: "rowobjs"} 구성 될 수 있다.
		 * object로 주어질때는 poolName를 임의로 지정하여 사용하는 경우이다.
		 * @param {Form|object} p form xpComp 또는 object로 {target: form객체, poolName: "rowobjs"} .
		 * @param {array|object=} exclude cache처리할 대상에서 제외할 array 또는 {xpcom._id: true, ...} 된 object collection.
		 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
		 * @param {boolean=} isDownward 하위 form까지 처리할 것인지 여부.
		 * @memberOf Eco.XpCompFactory
		 */
		"releaseAll": function(p, exclude, propsClear, isDownward)
		{
			var poolName = "default",
				target = p,
				used, cache, c, clearArr = [],
				isDefaultPool;

			if ( Eco.isObject(p) )
			{
				target = p.target;
				poolName = p.poolName;
			}

			//trace("factory > p="+p + ", poolName=" + poolName);
			
			used = Eco.XpCompFactory._getUsed(target, poolName);
			
			if ( !used ) return;
			isDefaultPool = (poolName == "default");
			if ( isDefaultPool )
			{
				cache = p._defaultCache;
				if ( !cache )
				{
					p._defaultCache = {};
					cache = p._defaultCache;
				}
			}
			else
			{
				cache = Eco.XpCompFactory._getCache(target, poolName, null, true);
			}

			var excludeIsArray = Eco.isArray(exclude),
				excludeIsObject = false;
			if ( !excludeIsArray ) excludeIsObject = Eco.isObject(exclude);

			if ( excludeIsArray || excludeIsObject )
			{
				var excludeMap;
				if ( excludeIsArray )
				{
					excludeMap = {};
					for ( var i = 0, len = exclude.length ; i < len ; i++ )
					{
						excludeMap[exclude[i]._id] = true;
					}
				}
				else
				{
					excludeMap = exclude;
				}
				for ( var nm in used )
				{
					if ( used.hasOwnProperty(nm) )
					{
						c = used[nm];
						if ( !excludeMap[c._id] )
						{
							if ( isDefaultPool )
							{
								var type = Eco.XPComp.typeOf(c);
								if ( !cache[type] )
								{
									cache[type] = [];
								}
								cache[type].push(c);
								//trace("defaultCache(" + type + ")==>" + cache[type].length); 
								//cache[type].splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.
							}
							else
							{
								cache.splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.			
							}
							Eco.XpCompFactory._recycle(c, propsClear);
							clearArr.push(c);
							if ( isDownward )
							{
								if ( c instanceof Tab )
								{
									c = c.tabpages[c.tabindex];
									Eco.XpCompFactory.releaseAll(c, null, propsClear);						
								}
								else if ( c instanceof Form )
								{
									Eco.XpCompFactory.releaseAll(c, null, propsClear);
								}
							}
						}
					}
				}
			}
			else
			{
				for ( var nm in used )
				{
					if ( used.hasOwnProperty(nm) )
					{
						c = used[nm];
						if ( isDefaultPool )
						{
							var type = Eco.XPComp.typeOf(c);
							if ( !cache[type] )
							{
								cache[type] = [];
							}
							//p._xppool[type].push(c);
							cache[type].splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.			
						}
						else
						{
							cache.splice(0, 0, c); //cache 추가: push를 사용하지 않고 splice로 추가함 재사용hit가 좋음.			
						}
						Eco.XpCompFactory._recycle(c, propsClear);
						clearArr.push(c);
						if ( isDownward )
						{
							if ( c instanceof Tab )
							{
								c = c.tabpages[c.tabindex];
								Eco.XpCompFactory.releaseAll(c, null, propsClear);						
							}
							else if ( c instanceof Form )
							{
								Eco.XpCompFactory.releaseAll(c, null, propsClear);
							}
						}
					}
				}
			}
			for ( var i = 0, len = clearArr.length ; i < len ; i++ )
			{
				delete used[clearArr[i]._id];
			}
		},		
		/**
		 * 사용하고 있는 xpComp인 주어진 c에 대하여 cache처리한다.<br>
		 * doLayout 함수 호출 전까지는 실질로 화면상에 보여진다.<br>
		 * 하지만 화면상에 반영되는 것과 별개로 cache된 기록은 내부적으로 처리된다.<br>
		 * 두번째 인자는 임의 poolName에 대하여 처리하고자 할 때 설정한다.
		 * 세번째 param은 cache처리할 때 기 설정된 속성값들을 clear 할 것인지 여부이다.
		 * @param {xpComp} c cache처리할 대상인 xpComp.
		 * @param {string=} poolName pool 명칭.
		 * @param {boolean=} propsClear 기 설정된 속성값들을 clear 할 것인지 여부.
		 * @memberOf Eco.XpCompFactory
		 */
		"release": function(c, poolName, propsClear)
		{
			var target = c.parent,
				used, cache;

			if ( !poolName || !poolName.length )
			{
				poolName = "default";
			}

			if ( poolName == "default" )
			{
				var type = Eco.XPComp.typeOf(c);
				cache = Eco.XpCompFactory._getCache(target, poolName, type, true);
				cache.push(c);
			}
			else
			{
				cache = Eco.XpCompFactory._getCache(target, poolName, null, true);
				cache.push(c);
			}

			Eco.XpCompFactory._recycle(c, propsClear);
			used = Eco.XpCompFactory._getUsed(target, poolName);
			if ( used )
			{
				delete used[c._id];
			}
		},
		
		/**
		 * 컴포넌트에 스타일 속성설정 예약.<br>
		 * 실제 적용은 doLayout 호출시점.
		 * @param {xpComp} xpComp XPLATFORM Compoent.
		 * @param {Eco.CssItem} cssItem {@link Eco.CssItem}를 사용한 스타일 속성정보
		 * @memberOf Eco.XpCompFactory
		 */
		"setStyleSheet": function(xpComp, cssItem)
		{
			if(Eco.isEmpty(xpComp) || Eco.isEmpty(cssItem)) return;
			
			var keys = ["_border", "font", "margin", "padding"];
			var aliasKeys = ["border", "font", "margin", "padding"];	
			var styleString = "";
			for (var i=0,len=keys.length; i<len; i++)
			{
				styleString += aliasKeys[i] + ":" + cssItem.getString(keys[i]) +";";
			}
			
			Eco.XpCompFactory.setProperties(xpComp, "style", styleString);
		}			
		
	});
}
