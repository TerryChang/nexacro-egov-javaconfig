/**
 * @fileoverview Eco.Point, Eco.LinkedPoint, Eco.SegmentPoint Class 정의.
 */
if ( !JsNamespace.exist("Eco.Point") )
{
	/**
	 * @class Eco.Point
	 * @classdesc x, y property를 가지는 Point Class.
	*/
	JsNamespace.declareClass("Eco.Point", {
		statics: {
			"min": function()
			{
				var pt1 = new this(arguments[0], arguments[1]);
				var readargs = pt1.__readArgs;
				var pt2 = new this(arguments[readargs], arguments[readargs + 1]);
				return new this(
						Math.min(pt1.x, pt2.x),
						Math.min(pt1.y, pt2.y)
					);
			},
			"max": function()
			{
				var pt1 = new this(arguments[0], arguments[1]);
				var readargs = pt1.__readArgs;
				var pt2 = new this(arguments[readargs], arguments[readargs + 1]);
				return new this(
						Math.max(pt1.x, pt2.x),
						Math.max(pt1.y, pt2.y)
					);
			},
			"random": function()
			{
				return new this(Math.random(), Math.random());
			}
		},
		properties: {
			/**
			 * @property {number} x
			 * x
			 * @memberOf Eco.Point
			*/
			x: {
				value: 0
			},
			/**
			 * @property {number} y
			 * y
			 * @memberOf Eco.Point
			*/
			y: {
				value: 0
			},
			/**
			 * @property {number} angle
			 * angle
			 * @memberOf Eco.Point
			*/
			angle: {
				"get": function()
				{
					return this.getAngleInRadians(arguments[0]) * 180 / Math.PI;
				},
				"set": function(value)
				{
					value = this.angle = value * Math.PI / 180;
					if (!this.isZero())
					{
						var length = this.getLength();
						this.set(
							Math.cos(value) * length,
							Math.sin(value) * length
						);
					}
				}
			}
		},
		initialize: function(x0, y0)
		{
			var type = typeof x0;
			if ( type == "number" )
			{
				var hasY = typeof y0 === 'number';
				this.x = x0;
				this.y = hasY ? y0 : x0;
				this.__readArgs = hasY ? 2 : 1;
			}
			else if ( type == "undefined" || x0 === null )
			{
				this.__readArgs = x0 === null ? 1 : 0;
			}
			else
			{
				if ( Eco.isArray(x0) )
				{
					this.x = x0[0];
					this.y = x0.length > 1 ? x0[1] : x0[0];
					this.__readArgs = 1;
				}
				else if ( x0.x != null )
				{
					this.x = x0.x;
					this.y = x0.y;
					this.__readArgs = 1;
				}
				else if ( x0.width != null )
				{
					this.x = x0.width;
					this.y = x0.height;
					this.__readArgs = 1;
				}
				else if ( x0.angle != null )
				{
					this.x = x0.length;
					this.y = 0;
					this.setAngle(x0.angle);
					this.__readArgs = 1;
				}
				else
				{
					this.__readArgs = 0;
				}
			}
		},
		"add": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return new Eco.Point(this.x + pt.x, this.y + pt.y);
		},
		"set": function(x, y)
		{
			this.x = x;
			this.y = y;
			return this;
		},
		"equals": function(pt)
		{
			return pt === this || pt && (this.x === pt.x
					&& this.y === pt.y
					|| Eco.isArray(pt) && this.x === pt[0]
						&& this.y === pt[1]) || false;
		},
		"clone": function()
		{
			return new Eco.Point(this.x, this.y);
		},
		"toString": function()
		{
			return '{ x: ' + Eco.ClassUtils.fmtNumber(this.x) + ', y: ' + Eco.ClassUtils.fmtNumber(this.y) + ' }';
		},
		"subtract": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return new Eco.Point(this.x - pt.x, this.y - pt.y);
		},
		"multiply": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return new Eco.Point(this.x * pt.x, this.y * pt.y);
		},
		"divide": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return new Eco.Point(this.x / pt.x, this.y / pt.y);
		},
		"modulo": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return new Eco.Point(this.x % pt.x, this.y % pt.y);
		},
		"negate": function()
		{
			return new Eco.Point(-this.x, -this.y);
		},
		"transform": function(m)
		{
			return m ? m._transformPoint(this) : this;
		},
		"lerp": function(pt, t)
		{
			return new Eco.Point(this.x + (pt.x - this.x) * t, this.y + (pt.y - this.y) * t);
		},
		"getDistance": function(pt, squared)
		{
			var readArgs = 1;
			if (!(pt instanceof Eco.Point))
			{
				pt = new EcoSys.Point(arguments[0], arguments[1]);
				readArgs = pt.__readArgs;
			}
			squared = arguments[readArgs];
			var x = pt.x - this.x,
				y = pt.y - this.y,
				d = x * x + y * y;
			return squared ? d : Math.sqrt(d);
		},
		"getLength": function()
		{
			var length = this.x * this.x + this.y * this.y;
			return arguments.length && arguments[0] ? length : Math.sqrt(length);
		},
		"setLength": function(length)
		{
			if (this.isZero())
			{
				var angle = this.angle || 0;
				this.set(
					Math.cos(angle) * length,
					Math.sin(angle) * length
				);
			}
			else
			{
				var scale = length / this.getLength();
				if (MathUtil.isZero(scale))
				{
					this.getAngle();
				}
				this.set(
					this.x * scale,
					this.y * scale
				);
			}
			return this;
		},
		"normalize": function(length)
		{
			if (length === undefined) length = 1;

			var current = this.getLength(),
				scale = current !== 0 ? length / current : 0,
				pt = new Eco.Point(this.x * scale, this.y * scale);

			pt.angle = this.angle;
			return pt;
		},
		"getAngleInRadians": function()
		{
			if (arguments[0] === undefined)
			{
				if (this.angle == null)
				{
					this.angle = Math.atan2(this.y, this.x);
				}
				return this.angle;
			}
			else
			{
				var pt = arguments[0];
				if (!(pt instanceof Eco.Point))
				{
					pt = new Eco.Point(arguments[0], arguments[1]);
				}
				var div = this.getLength() * pt.getLength();
				if (MathUtil.isZero(div))
				{
					return NaN;
				}
				else
				{
					return Math.acos(this.dot(pt) / div);
				}
			}
		},
		"getAngleInDegrees": function()
		{
			var pt = arguments[0];
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return this.getAngle(pt);
		},
		"getQuadrant": function()
		{
			return this.x >= 0 ? (this.y >= 0 ? 1 : 4) : (this.y >= 0 ? 2 : 3);
		},
		"getDirectedAngle": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return Math.atan2(this.cross(pt), this.dot(pt)) * 180 / Math.PI;
		},
		"rotate": function(angle, center)
		{
			if (angle === 0)
			{
				return this.clone();
			}
			angle = angle * Math.PI / 180;
			var pt = center ? this.subtract(center) : this,
				s = Math.sin(angle),
				c = Math.cos(angle);
			pt = new Eco.Point(
				pt.x * c - pt.y * s,
				pt.y * c + pt.x * s
			);
			return center ? pt.add(center) : pt;
		},
		"isInside": function(rect)
		{
			return rect.contains(this);
		},
		"isClose": function(pt, tolerance)
		{
			return this.getDistance(pt) < tolerance;
		},
		"isColinear": function(pt)
		{
			return this.cross(pt) < 0.00001;
		},
		"isOrthogonal": function(pt)
		{
			return this.dot(pt) < 0.00001;
		},
		"isZero": function()
		{
			return MathUtil.isZero(this.x) && MathUtil.isZero(this.y);
		},
		"isNaN": function()
		{
			return isNaN(this.x) || isNaN(this.y);
		},
		"dot": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return this.x * pt.x + this.y * pt.y;
		},
		"cross": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			return this.x * pt.y - this.y * pt.x;
		},
		"project": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			if (pt.isZero())
			{
				return new Eco.Point();
			}
			else
			{
				var scale = this.dot(pt) / point.dot(pt);
				return new Eco.Point(
					point.x * scale,
					point.y * scale
				);
			}
		}
	}); //end of 'JsNamespace.declareClass("Eco.Point", {'

	var membernames = ['round', 'ceil', 'floor', 'abs'];
	JsNamespace.addMethods(membernames, Eco.Point, false, 
		function(name) {
			var script = "return new Eco.Point(Math." + name + "(this.x), Math." + name + "(this.y));";
			this[name] = new Function(script); //this는 Eco.Point.prototype
			return name; //이 코드 라인이 있어야 추가한 Method에 debug정보를 구성한다.
		}
	);
} //end of 'if ( !JsNamespace.exist("Eco.Point") )'
