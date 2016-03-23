/**
 * @fileoverview Eco.Size, Eco.LinkedSize Class 정의.
 */
 
if ( !JsNamespace.exist("Eco.Size") )
{
	/**
	 * @class Eco.Size
	 * @classdesc width, height property를 가지는 Size Class.
	*/
	JsNamespace.declareClass("Eco.Size", {
		statics: {
			"min": function()
			{
				var sz1 = new this(arguments[0], arguments[1]);
				var readargs = sz1.__readArgs;
				var sz2 = new this(arguments[readargs], arguments[readargs + 1]);
				return new this(
						Math.min(sz1.width, sz2.width),
						Math.min(sz1.height, sz2.height)
					);
			},
			"max": function()
			{
				var sz1 = new this(arguments[0], arguments[1]);
				var readargs = sz1.__readArgs;
				var sz2 = new this(arguments[readargs], arguments[readargs + 1]);
				return new this(
						Math.max(sz1.width, sz2.width),
						Math.max(sz1.height, sz2.height)
					);
			},
			"random": function()
			{
				return new this(Math.random(), Math.random());
			}
		},
		properties: {
			/**
			 * @property {number} width
			 * width
			 * @memberOf Eco.Size
			*/
			width: {
				value: 0
			},
			/**
			 * @property {number} height
			 * height
			 * @memberOf Eco.Size
			*/
			height: {
				value: 0
			}
		},
		initialize: function(w, h)
		{
			var type = typeof w;
			if (type == 'number')
			{
				var hasHeight = typeof h === 'number';
				this.width = w;
				this.height = hasHeight ? h : w;
				this.__readArgs = hasHeight ? 2 : 1;
			}
			else if (type == 'undefined' || w === null)
			{
				this.width = this.height = 0;
				this.__readArgs = w === null ? 1 : 0;
			}
			else
			{
				if (Eco.isArray(w))
				{
					this.width = w[0];
					this.height = w.length > 1 ? w[1] : w[0];
					this.__readArgs = 1;
				}
				else if (w.width != null)
				{
					this.width = w.width;
					this.height = w.height;
					this.__readArgs = 1;
				}
				else if (w.x != null)
				{
					this.width = w.x;
					this.height = w.y;
					this.__readArgs = 1;
				}
				else
				{
					this.width = this.height = 0;
					this.__readArgs = 0;
				}
			}
		},
		"set": function(w, h)
		{
			this.width = w;
			this.height = h;
			return this;
		},
		"equals": function(sz)
		{
			return sz === this || sz && (this.width === sz.width
					&& this.height === sz.height
					|| Eco.isArray(sz) && this.width === sz[0]
						&& this.height === sz[1]) || false;
		},
		"clone": function()
		{
			return new Eco.Size(this.width, this.height);
		},
		"toString": function()
		{
			return '{ width: ' + Eco.ClassUtils.fmtNumber(this.width)
					+ ', height: ' + Eco.ClassUtils.fmtNumber(this.height) + ' }';
		},
		"add": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new Eco.Size(arguments[0], arguments[1]);
			}
			return new Eco.Size(this.width + sz.width, this.height + sz.height);
		},
		"subtract": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new Eco.Size(arguments[0], arguments[1]);
			}
			return new Eco.Size(this.width - sz.width, this.height - sz.height);
		},
		"multiply": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new Eco.Size(arguments[0], arguments[1]);
			}
			return new Eco.Size(this.width * sz.width, this.height * sz.height);
		},
		"divide": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new Eco.Size(arguments[0], arguments[1]);
			}
			return new Eco.Size(this.width / sz.width, this.height / sz.height);
		},
		"modulo": function(sz)
		{
			if (!(sz instanceof Eco.Size))
			{
				sz = new Eco.Size(arguments[0], arguments[1]);
			}
			return new Eco.Size(this.width % sz.width, this.height % sz.height);
		},
		"negate": function()
		{
			return new Eco.Size(-this.width, -this.height);
		},
		"isZero": function()
		{
			return MathUtil.isZero(this.width) && MathUtil.isZero(this.height);
		},
		"isNaN": function()
		{
			return isNaN(this.width) || isNaN(this.height);
		}
	}); //end of 'JsNamespace.declareClass("Eco.Size", {'

	var membernames = ['round', 'ceil', 'floor', 'abs'];
	JsNamespace.addMethods(membernames, Eco.Size, false, 
		function(name) {
			var script = "return new Eco.Size(Math." + name + "(this.width), Math." + name + "(this.height));";
			this[name] = new Function(script); //this는 Eco.Size.prototype
			return name; //이 코드 라인이 있어야 추가한 Method에 debug정보를 구성한다.
		}
	);	
} //end of 'if ( !JsNamespace.exist("Eco.Size") )'
