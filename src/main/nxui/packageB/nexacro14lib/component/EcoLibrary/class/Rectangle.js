/**
 * @fileoverview Eco.Rectangle, Eco.LinkedRectangle Class 정의.
 */
 
if ( !JsNamespace.exist("Eco.Rectangle") )
{
	/**
	 * @class Eco.Rectangle
	 * @classdesc x, y, width, height property를 가지는 Rectangle Class.
	*/
	JsNamespace.declareClass("Eco.Rectangle", {
		properties: {
			/**
			 * @property {number} x
			 * x
			 * @memberOf Eco.Rectangle
			*/
			x: {
				value: 0
			},
			/**
			 * @property {number} y
			 * y
			 * @memberOf Eco.Rectangle
			*/
			y: {
				value: 0
			},
			/**
			 * @property {number} width
			 * width
			 * @memberOf Eco.Rectangle
			*/
			width: {
				value: 0
			},
			/**
			 * @property {number} height
			 * height
			 * @memberOf Eco.Rectangle
			*/
			height: {
				value: 0
			}
		},
		initialize: function(x0, y0, w, h)
		{
			var argLens = arguments.length;
			if ( argLens == 0 )
			{
				this.__readArgs = 0;
				return this;
			}
			else if ( argLens == 4 )
			{
				this.set(x0, y0, w, h);
				this.__readArgs = 4;
				return this;
			}

			var type = typeof x0,
				read = 0;

			if (type === 'undefined' || x0 == null)
			{
				read = 1;
			}
			else if (argLens == 1)
			{
				if (Eco.isArray(x0))
				{
					this.x = x0[0];
					this.y = x0[1];
					this.width = x0[2];
					this.height = x0[3];
					read = 1;
				}
				else if (x0.x != null || x0.width != null)
				{
					this.x = x0.x || 0;
					this.y = x0.y || 0;
					this.width = x0.width || 0;
					this.height = x0.height || 0;
					read = 1;
				}
			}

			if (!read)
			{
				this.x = this.y = this.width = this.height = 0;
				//point, size
				//size
				//point
				if ( x0 )
				{
					if ( x0.x != null )
					{
						this.x = x0.x;
						this.y = x0.y;
						read++;
					}
					else if ( x0.width != null )
					{
						read++;
						this.width = x0.width;
						this.height = x0.height;
					}
				}
				if ( y0 && y0.width != null )
				{
					read++;
					this.width = y0.width;
					this.height = y0.height;
				}
			}
			this.__readArgs = read;
		},
		"set": function(x0, y0, w, h)
		{
			this.x = x0;
			this.y = y0;
			this.width = w;
			this.height = h;
			return this;
		},
		"clone": function()
		{
			return new Eco.Rectangle(this.x, this.y, this.width, this.height);
		},
		"equals": function(rect)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			return rect === this
					|| rect && this.x == rect.x && this.y == rect.y
						&& this.width == rect.width && this.height == rect.height
					|| false;
		},
		"toString": function()
		{
			return '{ x: ' + Eco.ClassUtils.fmtNumber(this.x)
					+ ', y: ' + Eco.ClassUtils.fmtNumber(this.y)
					+ ', width: ' + Eco.ClassUtils.fmtNumber(this.width)
					+ ', height: ' + Eco.ClassUtils.fmtNumber(this.height)
					+ ' }';
		},
		"getPoint": function()
		{
			return new Eco.Point(this.x, this.y);
		},
		"setPoint": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			this.x = pt.x;
			this.y = pt.y;
		},
		"getSize": function()
		{
			return new Eco.Size(this.width, this.height);
		},
		"setSize": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new EcoSys.Size(arguments[0], arguments[1]);
			}
			if (this._fixX)
			{
				this.x += (this.width - sz.width) * this._fixX;
			}
			if (this._fixY)
			{
				this.y += (this.height - sz.height) * this._fixY;
			}
			this.width = sz.width;
			this.height = sz.height;
			this._fixW = 1;
			this._fixH = 1;
		},
		"getLeft": function()
		{
			return this.x;
		},
		"setLeft": function(left)
		{
			if (!this._fixW)
			{
				this.width -= left - this.x;
			}
			this.x = left;
			this._fixX = 0;
		},
		"getTop": function()
		{
			return this.y;
		},
		"setTop": function(top)
		{
			if (!this._fixH)
			{
				this.height -= top - this.y;
			}
			this.y = top;
			this._fixY = 0;
		},
		"getRight": function()
		{
			return this.x + this.width;
		},
		"setRight": function(right)
		{
			if (this._fixX !== undefined && this._fixX !== 1)
			{
				this._fixW = 0;
			}
			if (this._fixW)
			{
				this.x = right - this.width;
			}
			else
			{
				this.width = right - this.x;
			}
			this._fixX = 1;
		},
		"getBottom": function()
		{
			return this.y + this.height;
		},
		"setBottom": function(bottom)
		{
			if (this._fixY !== undefined && this._fixY !== 1)
			{
				this._fixH = 0;
			}
			if (this._fixH)
			{
				this.y = bottom - this.height;
			}
			else
			{
				this.height = bottom - this.y;
			}
			this._fixY = 1;
		},
		"getCenterX": function()
		{
			return this.x + this.width * 0.5;
		},
		"setCenterX": function(x)
		{
			this.x = x - this.width * 0.5;
			this._fixX = 0.5;
		},
		"getCenterY": function()
		{
			return this.y + this.height * 0.5;
		},
		"setCenterY": function(y)
		{
			this.y = y - this.height * 0.5;
			this._fixY = 0.5;
		},
		"getCenter": function()
		{
			return new Eco.Point(this.getCenterX(), this.getCenterY());
		},
		"setCenter": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			this.setCenterX(pt.x);
			this.setCenterY(pt.y);
			return this;
		},
		"isEmpty": function()
		{
			return this.width == 0 || this.height == 0;
		},
		"contains": function(arg)
		{
			if ( arg && arg.width != null || (Eco.isArray(arg) ? arg : arguments).length == 4 )
			{
				var rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
				return this._containsRectangle(rect);
			}
			else
			{
				var pt = new Eco.Point(arguments[0], arguments[1]);
				return this._containsPoint(pt);
			}
		},
		"_containsPoint": function(pt)
		{
			var x = pt.x,
				y = pt.y;
			return x >= this.x && y >= this.y
					&& x <= this.x + this.width
					&& y <= this.y + this.height;
		},
		"_containsRectangle": function(rect)
		{
			var x = rect.x,
				y = rect.y;
			return x >= this.x && y >= this.y
					&& x + rect.width <= this.x + this.width
					&& y + rect.height <= this.y + this.height;
		},
		"intersects": function(rect)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			return rect.x + rect.width > this.x
					&& rect.y + rect.height > this.y
					&& rect.x < this.x + this.width
					&& rect.y < this.y + this.height;
		},
		"touches": function(rect)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			return rect.x + rect.width >= this.x
					&& rect.y + rect.height >= this.y
					&& rect.x <= this.x + this.width
					&& rect.y <= this.y + this.height;
		},
		"intersect": function(rect)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			var x1 = Math.max(this.x, rect.x),
				y1 = Math.max(this.y, rect.y),
				x2 = Math.min(this.x + this.width, rect.x + rect.width),
				y2 = Math.min(this.y + this.height, rect.y + rect.height);
			return new Eco.Rectangle(x1, y1, x2 - x1, y2 - y1);
		},
		"unite": function(rect, applySelf)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
				applySelf = arguments[rect.__readArgs + 1];
			}
			var x1 = Math.min(this.x, rect.x),
				y1 = Math.min(this.y, rect.y),
				x2 = Math.max(this.x + this.width, rect.x + rect.width),
				y2 = Math.max(this.y + this.height, rect.y + rect.height);
			if ( applySelf )
			{
				this.x = x1;
				this.y = y1;
				this.width = x2 - x1;
				this.height = y2 - y1;
				return;
			}
			return new Eco.Rectangle(x1, y1, x2 - x1, y2 - y1);
		},
		"include": function(pt)
		{
			if (!(rect instanceof Eco.Rectangle))
			{
				rect = new Eco.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			var x1 = Math.min(this.x, pt.x),
				y1 = Math.min(this.y, pt.y),
				x2 = Math.max(this.x + this.width, pt.x),
				y2 = Math.max(this.y + this.height, pt.y);
			return new Eco.Rectangle(x1, y1, x2 - x1, y2 - y1);
		},
		"expand": function(hor, ver)
		{
			if (ver === undefined)
				ver = hor;
			return new Eco.Rectangle(this.x - hor / 2, this.y - ver / 2,
					this.width + hor, this.height + ver);
		},
		"scale": function(hor, ver)
		{
			return this.expand(this.width * hor - this.width,
					this.height * (ver === undefined ? hor : ver) - this.height);
		}
	}); //end of 'JsNamespace.declareClass("Eco.Rectangle", {'

	var membernames = [
			['Top', 'Left'], ['Top', 'Right'],
			['Bottom', 'Left'], ['Bottom', 'Right'],
			['Left', 'Center'], ['Top', 'Center'],
			['Right', 'Center'], ['Bottom', 'Center']
		];

	JsNamespace.addMethods(membernames, Eco.Rectangle, false, 
		function(parts, index) {
			var part = parts.join('');
			var xFirst = /^[RL]/.test(part);
			if (index >= 4)
			{
				parts[1] += xFirst ? 'Y' : 'X';
			}
			var x = parts[xFirst ? 0 : 1],
				y = parts[xFirst ? 1 : 0],
				getX = 'get' + x,
				getY = 'get' + y,
				setX = 'set' + x,
				setY = 'set' + y,
				get = 'get' + part,
				set = 'set' + part;

			var getScript = "return new Eco.Point(this." + getX + "(), this." + getY + "());\r\n";

			this[get] = new Function(getScript);

			var setScript = "if (!(pt instanceof Eco.Point))\r\n";
			setScript += "{\r\n";
			setScript += "\tpt = new Eco.Point(arguments[0], arguments[1]);\r\n";
			setScript += "}\r\n";
			setScript += "this." + setX + "(pt.x);\r\n";
			setScript += "this." + setY + "(pt.y);";

			this[set] = new Function("pt", setScript);
			return [get, set]; //이 코드 라인이 있어야 추가한 Method에 debug정보를 구성한다.
		}
	);
} //end of 'if ( !JsNamespace.exist("Eco.Rectangle") )'

