/**
 * @fileoverview Eco.Matrix Class 정의.
 */

if ( !JsNamespace.exist("Eco.Matrix") )
{
	JsNamespace.declareClass("Eco.Matrix", {
		/**
		 * Eco.Matrix 생성자(constructor)<br>
		 * @param {number} a scaleX에 해당하는 값
		 * @param {number} c shearY에 해당하는 값
		 * @param {number} b shearX에 해당하는 값
		 * @param {number} d scaleY에 해당하는 값
		 * @param {number} tx translateX에 해당하는 값
		 * @param {number} ty translateX에 해당하는 값
		 * @class Eco.Matrix
		 * @classdesc 기하학적 변환(transformation)을 나타내는 3 x 2 상관 Matrix Class.
		 * matrix 객체 정의
		 *  a(scaleX),  b(shearX),  tx
		 *  c(shearY),  d(scaleY),  ty
		 * @constructor Eco.Matrix
		*/
		initialize: function(arg) //a, c, b, d, tx, ty
		{
			var count = arguments.length,
				ok = true;

			if (count == 6)
			{
				this.setProperties(arguments);
			}
			else if (count == 1)
			{
				if (arg instanceof Eco.Matrix)
				{
					this.set(arg._a, arg._c, arg._b, arg._d, arg._tx, arg._ty);
				}
				else if (Eco.isArray(arg))
				{
					this.setProperties(arg);
				}
				else
				{
					ok = false;
				}
			}
			else if (count == 0)
			{
				this.reset();
			}
			else
			{
				ok = false;
			}

			if (!ok)
			{
				Eco.Logger.error('Unsupported matrix parameters');
			}
		},
		properties: {
			/**
			 * @property {number} scaleX
			 * scaleX : matrix.a 값에 해당
			 * @memberOf Eco.Matrix
			*/
			scaleX: {
				memberName: "_a",
				value: 1
			},
			/**
			 * @property {number} shearY
			 * shearX : matrix.c 값에 해당
			 * @memberOf Eco.Matrix
			*/
			shearY: {
				memberName: "_c",
				value: 0
			},
			/**
			 * @property {number} shearX
			 * shearY : matrix.b 값에 해당
			 * @memberOf Eco.Matrix
			*/
			shearX: {
				memberName: "_b",
				value: 0
			},
			/**
			 * @property {number} scaleY
			 * scaleY : matrix.d 값에 해당
			 * @memberOf Eco.Matrix
			*/
			scaleY: {
				memberName: "_d",
				value: 1
			},
			/**
			 * @property {number} translateX
			 * translateX : matrix.tx 값에 해당
			 * @memberOf Eco.Matrix
			*/
			translateX: {
				memberName: "_tx",
				value: 0
			},
			/**
			 * @property {number} translateY
			 * translateY : matrix.ty 값에 해당
			 * @memberOf Eco.Matrix
			*/
			translateY: {
				memberName: "_ty",
				value: 0
			}
		},
		statics: {
			/**
			 * 각도(degree)를 radian으로 변경할 때 사용한 값
			 * @static
			 * @memberOf Eco.Matrix
			*/
			DEGTORAD: Math.PI/180,
			/**
			 * radian를 각도(degree)으로 변경할 때 사용한 값
			 * @static
			 * @memberOf Eco.Matrix
			*/
			RADTODEG: 180/Math.PI
		},
		/**
		* 주어진 인자로 matrix를 설정한다.
		* @param {number} a scaleX에 해당하는 값
		* @param {number} c shearY에 해당하는 값
		* @param {number} b shearX에 해당하는 값
		* @param {number} d scaleY에 해당하는 값
		* @param {number} tx translateX에 해당하는 값
		* @param {number} ty translateX에 해당하는 값
		* @memberOf Eco.Matrix
		*/
		"set": function(a, c, b, d, tx, ty)
		{
			this._a = a;
			this._b = b;
			this._c = c;
			this._d = d;
			this._tx = tx;
			this._ty = ty;
			return this;
		},
		/**
		* matrix를 복제하여 얻는다.
		* @return {Eco.Matrix} 복제된 Matrix객체
		* @memberOf Eco.Matrix
		*/
		"clone": function()
		{
			return new Eco.Matrix(this._a, this._c, this._b, this._d,
					this._tx, this._ty);
		},
		/**
		* 주어진 Matrix와 동일한지 확인한다.
		* @param {Eco.Matrix} m Matrix객체
		* @return {boolean} Matrix 내용이 동일한지 여부
		* @memberOf Eco.Matrix
		*/
		"equals": function(m)
		{
			return m === this || m && this._a == m._a && this._b == m._b
					&& this._c == m._c && this._d == m._d && this._tx == m._tx
					&& this._ty == m._ty
					|| false;
		},
		/**
		* Matrix을 string값으로 표현하여 얻는다.
		* @return {string} Matrix를 string으로 표시된 값
		* @memberOf Eco.Matrix
		*/
		"toString": function()
		{
			var f0 = [Eco.ClassUtils.fmtNumber(this._a), Eco.ClassUtils.fmtNumber(this._b),
						Eco.ClassUtils.fmtNumber(this._tx)];
			var f1 = [Eco.ClassUtils.fmtNumber(this._c), Eco.ClassUtils.fmtNumber(this._d),
						Eco.ClassUtils.fmtNumber(this._ty)];

			return '[[' + f0.join(', ') + '], ['
					+ f1.join(', ') + ']]';
		},
		/**
		* Matrix을 기본 값(default)으로 설정한다. 즉 기존 설정된 값을 clear한다.
		* @memberOf Eco.Matrix
		*/
		"reset": function()
		{
			this._a = this._d = 1;
			this._c = this._b = this._tx = this._ty = 0;
			return this;
		},
		/**
		* 주어진 Point(x, y)값으로 scale 값을 추가한다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* m.scale(x, y, centerX, centerY)
		* m.scale(pt, centerX, centerY)
		* m.scale(pt, centerPt)
		* m.scale(x, y, centerPt)
		* @param {Eco.Point} pt scale에 해당하는 x, y 값
		* @param {Eco.Point=} centerPt 중심점에 대한 값
		* @memberOf Eco.Matrix
		*/
		"scale": function(pt, centerPt)
		{
			pt = new Eco.Point(arguments[0], arguments[1]);
			var readargs = pt.__readArgs;
			if ( arguments[readargs] != null )
			{
				centerPt = new Eco.Point(arguments[readargs], arguments[readargs + 1]);
			}
			else
			{
				centerPt = null;
			}

			if (centerPt)
			{
				this.translate(centerPt);
			}
			this._a *= pt.x;
			this._c *= pt.x;
			this._b *= pt.y;
			this._d *= pt.y;
			if (centerPt)
			{
				this.translate(centerPt.negate());
			}
			return this;
		},
		/**
		* 주어진 Point(x, y)값으로 translate 값을 추가한다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* m.translate(x, y)
		* m.translate(pt)
		* @param {Eco.Point} pt translate 해당하는 x, y 값
		* @memberOf Eco.Matrix
		*/
		"translate": function(pt)
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
			}
			var x = pt.x,
				y = pt.y;
			this._tx += x * this._a + y * this._b;
			this._ty += x * this._c + y * this._d;
			//trace("translate==>" + x + "," + y + "////" + this._tx + "," + this._ty);
			return this;
		},
		/**
		* 주어진 angle 과 중심점 centerPt(x, y)값으로 rotate 값을 추가한다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* m.rotate(angle, centerX, centerY)
		* m.rotate(angle, centerPt)
		* @param {number} angle rotate 각도 값
		* @param {Eco.Point=} centerPt 중심점에 대한 값
		* @memberOf Eco.Matrix
		*/
		"rotate": function(angle, centerPt)
		{
			if (!(centerPt instanceof Eco.Point))
			{
				var argsLen = arguments.length;
				if ( argsLen == 3 )
				{
					centerPt = new Eco.Point(arguments[1], arguments[2]);
				}
				else
				{
					centerPt = new Eco.Point();
				}
			}
			angle = angle * Eco.Matrix.DEGTORAD; // to rad
			var x = centerPt.x,
				y = centerPt.y,
				cos = Math.cos(angle),
				sin = Math.sin(angle),
				tx = x - x * cos + y * sin,
				ty = y - x * sin - y * cos,
				a = this._a,
				b = this._b,
				c = this._c,
				d = this._d;
			this._a = cos * a + sin * b;
			this._b = -sin * a + cos * b;
			this._c = cos * c + sin * d;
			this._d = -sin * c + cos * d;
			this._tx += tx * a + ty * b;
			this._ty += tx * c + ty * d;
			return this;
		},
		/**
		* 주어진 Point(x, y)값으로 shear 값을 추가한다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* m.shear(x, y, centerX, centerY)
		* m.shear(pt, centerX, centerY)
		* m.shear(pt, centerPt)
		* m.shear(x, y, centerPt)
		* @param {Eco.Point} pt shear에 해당하는 x, y 값
		* @param {Eco.Point=} centerPt 중심점에 대한 값
		* @memberOf Eco.Matrix
		*/
		"shear": function(pt, centerPt)
		{
			pt = new Eco.Point(arguments[0], arguments[1]);
			var readargs = pt.__readArgs;
			if ( arguments[readargs] != null )
			{
				centerPt = new Eco.Point(arguments[readargs], arguments[readargs + 1]);
			}
			else
			{
				centerPt = null;
			}
			if (centerPt)
			{
				this.translate(centerPt);
			}
			//x, y
			var a = this._a,
				c = this._c;
			this._a += pt.y * this._b;
			this._c += pt.y * this._d;
			this._b += pt.x * a;
			this._d += pt.x * c;

			if (centerPt)
			{
				this.translate(centerPt.negate());
			}
			return this;
		},
		"skew": function(xdeg, ydeg, centerX, centerY)
		{
			//TODO: 현재 처리 안됨
			xdeg = xdeg*Eco.Matrix.DEGTORAD;
			ydeg = ydeg*Eco.Matrix.DEGTORAD;
			var tx = centerX - centerX * Math.cos(xdeg) + centerY * Math.sin(xdeg),
				ty = centerY - centerX * Math.sin(ydeg) - centerY * Math.cos(ydeg),
				a = this._a,
				b = this._b,
				c = this._c,
				d = this._d;
			tx = tx*a + ty*b;
			ty = tx*c + ty*d;
			this.concatenate(new Eco.Matrix(Math.cos(ydeg), -Math.sin(xdeg), Math.sin(ydeg), Math.cos(xdeg), tx, ty));
		},
		/**
		* Matrix의 설정된 값이 기본 값(default)인지 확인하여 기본 값이면 true를 얻는다.
		* @return {boolean} 기본 값인지 여부
		* @memberOf Eco.Matrix
		*/
		"isIdentity": function()
		{
			return this._a == 1 && this._c == 0 && this._b == 0 && this._d == 1
					&& this._tx == 0 && this._ty == 0;
		},
		/**
		* Matrix가 invert 할 수 있는지 여부를 확인 한 후 invert하면 true를 얻는다.
		* @return {boolean} invert 할 수 있는지 여부
		* @memberOf Eco.Matrix
		*/
		"isInvertible": function()
		{
			return !!this._getDeterminant();
		},
		/**
		* Matrix에 설정된 값으로 transformation 처리가 필요한지 여부를 확인 한 후 필요없으면 true를 얻는다.
		* @return {boolean} transformation 처리가 필요한지 여부
		* @memberOf Eco.Matrix
		*/
		"isSingular": function()
		{
			return !this._getDeterminant();
		},
		/**
		* 주어진 Matrix를 연결 처리한다. 두개의 Matrix의 설정된 값이 연결되어 transformation 된다.
		* 두개의 Matrix를 곱하는 처리이다.
		* Matrix에서 곱하기는 연산 순서가 중요하다. 여기는 left->right이다.
		* 이 함수는 곱하기 순서는 thisMatrix*주어진Matrix 이다.
		* @param {Eco.Matrix} m 곱하기 할 Matrix 객체
		* @memberOf Eco.Matrix
		*/
		"concatenate": function(m)
		{
			var a = this._a,
				b = this._b,
				c = this._c,
				d = this._d;

			this._a = m._a * a + m._c * b;
			this._b = m._b * a + m._d * b;
			this._c = m._a * c + m._c * d;
			this._d = m._b * c + m._d * d;
			this._tx += m._tx * a + m._ty * b;
			this._ty += m._tx * c + m._ty * d;
			return this;
		},
		/**
		* concatenate 메소드와 차이는 Matrix에서 곱하기 연산 순서가 right->left이다.
		* 이 함수는 곱하기 순서는 주어진Matrix*thisMatrix 이다.
		* 주어진 Matrix를 연결 처리한다. 두개의 Matrix의 설정된 값이 연결되어 transformation 된다.
		* 두개의 Matrix를 곱하는 처리이다.
		* @param {Eco.Matrix} m 곱하기 할 Matrix 객체
		* @memberOf Eco.Matrix
		*/
		"preConcatenate": function(m)
		{
			var a = this._a,
				b = this._b,
				c = this._c,
				d = this._d,
				tx = this._tx,
				ty = this._ty;
			this._a = m._a * a + m._b * c;
			this._b = m._a * b + m._b * d;
			this._c = m._c * a + m._d * c;
			this._d = m._c * b + m._d * d;
			this._tx = m._a * tx + m._b * ty + m._tx;
			this._ty = m._c * tx + m._d * ty + m._ty;
			return this;
		},
		/**
		* 주어진 src 값을 가지고 이 Matrix의 transformation를 적용된 결과 값으로 얻는다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* transform(x, y) // return : Eco.Point
		* transform(pt) // return : Eco.Point
		* transform(sourceArray, 0, targetArray, 0, 4) // return : targetArray
		* sourceArray는 값 구성이 [x, y, x1, y1, x2, y2, x3, y3] 된다. 
		* @param {Eco.Point|array} src transformation 처리 할 source 값
		* @param {number=} srcOff 첫번째 인자가 array이면 array 시작 위치
		* @param {array=} dst 첫번째 인자가 array이면 처리된 결과를 저장하는 array
		* @param {number=} dstOff 세번째 인자에 저장 처리 할 시작 위치
		* @param {number=} numPts 첫번째 인자의 작업할 개수(x,y 쌍이 1단위로 처리된 값)
		* @return {Eco.Point|array} transformation 처리 된 결과
		* @memberOf Eco.Matrix
		*/
		"transform": function( src, srcOff, dst, dstOff, numPts)
		{
			if ( arguments.length < 5 )
			{
				if (!(src instanceof Eco.Point))
				{
					src = new Eco.Point(arguments[0], arguments[1]);
					var readargs = src.__readArgs;
					return this._transformPoint(src, arguments[readargs]);
				}
				else
				{
					return this._transformPoint(src, srcOff);
				}
			}
			else
			{
				return this._transformCoordinates(src, srcOff, dst, dstOff, numPts);
			}
		},
		/**
		* 주어진 pt(Eco.Point) 값으로 transformation 처리된 Eco.Point얻는다.
		* @param {Eco.Point} pt transformation 처리 할 source 지점(x, y)
		* @param {Eco.Point=} dest transformation 처리 된 결과를 저장할 target 지점(x, y)
		* @return {Eco.Point} transformation 처리 된 결과 지점(x, y)
		* @private
		* @memberOf Eco.Matrix
		*/
		"_transformPoint": function(pt, dest)
		{
			var x = pt.x,
				y = pt.y;
			if (!dest)
			{
				dest = new Eco.Point();
			}
			return dest.set(
				x * this._a + y * this._b + this._tx,
				x * this._c + y * this._d + this._ty
			);
		},
		/**
		* 주어진 src(array) 값으로 transformation 처리된 array를 얻는다.
		* src 값 구성은 [x, y, x1, y1, ...] 형태로 구성하여 주어진다.
		* @param {array} src transformation 처리 할 source array
		* @param {number=} srcOff source array 시작 위치
		* @param {array=} dst transformation 처리된 결과를 저장하는 array
		* @param {number=} dstOff dst array 시작 위치
		* @param {number=} numPts src array 작업할 개수(x,y 쌍이 1단위로 처리된 값)
		* @return {array} transformation 처리 된 결과 array
		* @private
		* @memberOf Eco.Matrix
		*/
		"_transformCoordinates": function(src, srcOff, dst, dstOff, numPts, notApplyTranslate)
		{
			var i = srcOff, j = dstOff,
				srcEnd = srcOff + 2 * numPts,
				x, y,
				a = this._a,
				b = this._b,
				c = this._c,
				d = this._d;

			if ( notApplyTranslate )
			{
				while (i < srcEnd)
				{
					x = src[i++];
					y = src[i++];
					dst[j++] = x * a + y * b;
					dst[j++] = x * c + y * d;
				}
			}
			else
			{
				var tx = this._tx,
					ty = this._ty;

				while (i < srcEnd)
				{
					x = src[i++];
					y = src[i++];
					dst[j++] = x * a + y * b + tx;
					dst[j++] = x * c + y * d + ty;
				}
			}

			return dst;
		},
		/**
		* 주어진 rect(Eco.Rectangle) 값을 다음 값으로 재구성하여 _transformCoordinates 함수를 호출하여 결과를 return한다.
		* rect(Eco.Rectangle) => [left, top, right, top, right, bottom, left, bottom]
		* @param {Eco.Rectangle} rect 4개의 지점에 대하여 transformation 처리 할 Rectangle객체
		* @return {array} transformation 처리 된 결과 array
		* @private
		* @memberOf Eco.Matrix
		*/
		"_transformCorners": function(rect)
		{
			var x1 = rect.x,
				y1 = rect.y,
				x2 = x1 + rect.width,
				y2 = y1 + rect.height,
				coords = [ x1, y1, x2, y1, x2, y2, x1, y2 ];
			return this._transformCoordinates(coords, 0, coords, 0, 4);
		},
		/**
		* 주어진 bounds(Eco.Rectangle) 값을 transformation 된 상태로 한 다음에 bounds 사각형을 return한다.
		* 예를 들면 안쪽 변형된 사각형의 bounds는 바깥쪽 사각형이다.
		*  |-------------|
		*  |  /---------/|
		*  | /         / |
		*  |/---------/  |
		*  |-------------|
		* @param {Eco.Rectangle} rect 4개의 지점에 대하여 transformation 처리 할 Rectangle객체
		* @return {array} transformation 처리 된 결과 array
		* @private
		* @memberOf Eco.Matrix
		*/
		"_transformBounds": function(bounds, dest)
		{
			var coords = this._transformCorners(bounds),
				min = coords.slice(0, 2),
				max = coords.slice(0),
				val, j;
			for (var i = 2; i < 8; i++)
			{
				val = coords[i];
				j = i & 1;
				/**/
				min[j] = Math.min(val, min[j]);
				if ( val != min[j] )
				{
					max[j] = Math.max(val, max[j]);
				}
				
				/*
				if (val < min[j])
				{
					min[j] = val;
				}
				else if (val > max[j])
				{
					max[j] = val;
				}
				*/
				
			}
			if (!dest)
			{
				dest = new Eco.Rectangle();
			}
			return dest.set(min[0], min[1], max[0] - min[0], max[1] - min[1]);
		},
		/**
		* 주어진 pt(Eco.Point) 값을 이 Matrix의 반전 값(1/Matrix)으로 transformation 적용된 지점을 얻는다.
		* arguments 설정은 아래 기술된 내용에 대하여 모두 처리한다.
		* inverseTransform(x, y) // return : Eco.Point
		* inverseTransform(pt) // return : Eco.Point
		* @param {Eco.Point} pt inverse transformation 처리 할 source 지점(x, y)
		* @return {Eco.Point} inverse transformation 처리 된 결과 지점(x, y)
		* @memberOf Eco.Matrix
		*/
		"inverseTransform": function()
		{
			if (!(pt instanceof Eco.Point))
			{
				pt = new Eco.Point(arguments[0], arguments[1]);
				var readargs = pt.__readArgs;
				return this._inverseTransform(pt, arguments[readargs]);
			}
			else
			{
				return this._inverseTransform(pt, arguments[1]);
			}
		},
		/**
		* Matrix 감도 계수(?)를 구한다.
		* @return {number|null} inverse 할 감도 계수 값 만약 inverse 할 수 없으면 null값
		* @private
		* @memberOf Eco.Matrix
		*/
		"_getDeterminant": function()
		{
			var det = this._a * this._d - this._b * this._c;
			return isFinite(det) && !MathUtil.isZero(det)
					&& isFinite(this._tx) && isFinite(this._ty)
					? det : null;
		},
		/**
		* 주어진 pt(Eco.Point) 값을 이 Matrix의 반전 값(1/Matrix)으로 transformation 적용된 지점을 얻는다.
		* @param {Eco.Point} pt inverse transformation 처리 할 source 지점(x, y)
		* @param {Eco.Point=} dest inverse transformation 처리 된 결과를 저장할 target 지점(x, y)
		* @return {Eco.Point} inverse transformation 처리 된 결과 지점(x, y)
		* @private
		* @memberOf Eco.Matrix
		*/
		"_inverseTransform": function(pt, dest)
		{
			var det = this._getDeterminant();
			if (!det)
			{
				return null;
			}
			var x = pt.x - this._tx,
				y = pt.y - this._ty;
			if (!dest)
			{
				dest = new Eco.Point();
			}
			return dest.set(
				(x * this._d - y * this._b) / det,
				(y * this._a - x * this._c) / det
			);
		},
		/**
		* matrix에 정의된 내용에 대하여 tranlate, scale, rotate, skew|shear 값을 생성한다.
		* 주의사항 : matrix을 생성하거나 메소드를 통해서 설정한 값과 일치하지 않을 수 있다.
		*             단지 시각적으로 보이는 형태만 설정된 값으로 처리된다.
		* @return {object} translation, scaling, rotation, shearing, xpSkew, xpScale, xpRotate의 속성값이 존재하는 객체
		* @memberOf Eco.Matrix
		*/
		"decompose": function()
		{
			var a = this._a, b = this._b, c = this._c, d = this._d;
			if (MathUtil.isZero(a * d - b * c))
			{
				return null;
			}

			var scaleX = Math.sqrt(a * a + b * b);
			a /= scaleX;
			b /= scaleX;

			var shear = a * c + b * d;
			c -= a * shear;
			d -= b * shear;

			var scaleY = Math.sqrt(c * c + d * d);
			c /= scaleY;
			d /= scaleY;
			shear /= scaleY;

			if (a * d < b * c)
			{
				a = -a;
				b = -b;
				shear = -shear;
				scaleX = -scaleX;
			}
			
			var res = {
				"translation": this.getTranslation(),
				"scaling": new Eco.Point(scaleX, scaleY),
				"rotation": -Math.atan2(b, a),
				"shearing": shear,
				"xpSkew": null,
				"xpScale": null,
				"xpRotate": null
			};
			var shearAngle = Math.atan(shear)*Eco.Matrix.RADTODEG,
				skewY = shearAngle - Math.atan2(this._b, this._a)*Eco.Matrix.RADTODEG,
				skewX = shearAngle + Math.atan2(-this._c, this._d)*Eco.Matrix.RADTODEG;

			if ( Math.round(skewX) != (-Math.round(skewY)) )
			{
				res.xpSkew = new Eco.Point(skewX, skewY);
				res.xpScale = new Eco.Point(this._a, this._d);
			}
			else
			{
				res.xpScale = res.scaling;
				res.xpRotate = res.rotation*Eco.Matrix.RADTODEG;
			}
			return res;
		},
		/**
		* matrix에 정의된 모든 값을 a, c, b, d, tx, ty 값을 얻는다. 
		* @return {array} a, c, b, d, tx, ty 나열된 array
		* @memberOf Eco.Matrix
		*/
		"getValues": function()
		{
			return [ this._a, this._c, this._b, this._d, this._tx, this._ty ];
		},
		/**
		* matrix에 정의된 translate 정보를 얻는다. 
		* @return {Eco.Point} translate 정보인 x, y값을 가지는 Point 객체
		* @memberOf Eco.Matrix
		*/
		"getTranslation": function()
		{
			return new Eco.Point(this._tx, this._ty);
		},
		/**
		* matrix에 정의된 scale 정보를 얻는다. 
		* @return {Eco.Point} scale 정보인 x, y값을 가지는 Point 객체
		* @memberOf Eco.Matrix
		*/
		"getScaling": function()
		{
			return (this.decompose() || {}).scaling;
		},
		/**
		* matrix에 정의된 rotate 정보를 얻는다. 
		* @return {number} rotate radian 값
		* @memberOf Eco.Matrix
		*/
		"getRotation": function()
		{
			return (this.decompose() || {}).rotation;
		},
		/**
		* 숫자에서 방정식 a*x=b 의 x값을 해결하기 위해 x = b/a로 구하면 된다.
		* Matrix에서는 이와 같이 처리하기 위해 1/a에 해당하는 값을 구해야 한다.
		* 다시 얘기하면 숫자에서 1 = a/a;이다 여기서 1/a값에 해당되는 Matrix값을 구하는 것이 이 함수이다.
		* @return {Eco.Matrix} 1/this 에 해당하는 matrix 객체
		* @example
		* var m = new Eco.Matrix();
		* m.translate(10, 10);
		* trace(m.toString());	// output : result==>[[1, 0, 10], [0, 1, 10]]
		* var invertM = m.inverted();
		* trace("invertM=>" + invertM.toString());	// output : result==>invertM=>[[1, 0, -10], [0, 1, -10]]
		* @memberOf Eco.Matrix
		*/
		"inverted": function()
		{
			var det = this._getDeterminant();
			return det && new Eco.Matrix(
					this._d / det,
					-this._c / det,
					-this._b / det,
					this._a / det,
					(this._b * this._ty - this._d * this._tx) / det,
					(this._c * this._tx - this._a * this._ty) / det);
		},
		/**
		* matrix에 정의된 translate(_tx, _ty) 값을 clear하고 나머지 값을 구성한 Matrix 객체를 얻는다. 
		* @return {Eco.Matrix} translate 정보를 제외한 나머지 값을 구성된 Matrix 객체
		* @memberOf Eco.Matrix
		*/
		"shiftless": function()
		{
			return new Eco.Matrix(this._a, this._c, this._b, this._d, 0, 0);
		},
		/**
		* matrix에 정의된 transformation 정보를 XPLATFORM transformation style값으로 구성하여 넘겨준다. 
		* @param {XPComp} comp XPLATFORM component
		* @return {String} transformation style 값
		* @example
		* var m = new Eco.Matrix();
		* m.translate(200, 200);
		* var comp = XpCompFactory.getXpComp(Div00, "Shape");
		* XpCompFactory.setRect(comp, 0, 0, rectWidth, rectHeight);
		* trace(m.getStyleString(comp));	// output : "transformation: 0,0 [translate 200,200];"
		* @memberOf Eco.Matrix
		*/
		"getStyleString": function(comp)
		{
			var str = "";

			if ( !this.isIdentity() )
			{
				var transformation = this.decompose();
				if ( !transformation ) return str;
				var compRect = XpCompFactory.getRect(comp),
					cw = compRect.width,
					ch = compRect.height,
					cx = compRect.x,
					cy = compRect.y;
				str = "0,0 ";
				var translation = transformation.translation,
					scaling = transformation.xpScale,
					rotation = transformation.xpRotate,
					skew = transformation.xpSkew;

				if ( scaling && ( scaling.x != 1 || scaling.y != 1) )
				{
					var sx = scaling.x,
						sy = scaling.y;
					if ( sx != 1 )
					{
						if ( sx < 0 )
						{
							translation.x += -cx + cx*sx;
							cw = (-1*sx*cw);
						}
						else
						{
							translation.x += -cx + cx*sx;
							cw = (sx*cw);
						}
					}
					if ( sy != 1 )
					{
						if ( sy < 0 )
						{
							translation.y += -cy + cy*sy;
							ch = (-1*sy*ch);
						}
						else
						{
							translation.y += -cy + cy*sy;
							ch = (sy*ch);
						}
					}
					str += "[scale " + sx + "," + sy +"]";
				}
				if ( skew )
				{
					var radY = Math.tan(Math.atan2(this._c, this._a)),
						radX = Math.tan(Math.atan2(this._b, this._d));

					//trace("radX==>" + Math.atan2(this._b, this._d));
					//trace("x, y half gap==>" + (ch*radX*0.5) + "," + (cw*radY*0.5));
					//trace("x, y gap==>" + (ch*radX) + "," + (cw*radY));
					//trace("x, y angle==>" + (radX*180/Math.PI) + "," + (radY*180/Math.PI));
					//trace("x, y radian==>" + radX + "," + radY);
					translation.x -= ch*radX*0.5;
					translation.y -= cw*radY*0.5;
					str += "[skew " + skew.x + "," + skew.y +"]";
				}
				if ( rotation )
				{
					rotation = rotation;
					if ( Math.abs(rotation) != 360 || Math.abs(rotation) != 180 )
					{
						var cx = compRect.x,
							cy = compRect.y;
						var pt = new Eco.Point(cx, cy);
						pt = pt.rotate(rotation, 0, 0);
						translation.x += (pt.x - cx); //pt.x;
						translation.y += (pt.y - cy); //pt.y;
						str += "[rotate " + (rotation) +"]";
					}
				}


				var tx = translation.x, 
					ty = translation.y;
				if ( tx != 0 || ty != 0  )
				{
					str += "[translate " + tx + "," + ty +"]";
				}

				str = "transformation: " + str + ";";
			}
			//trace(str);
			return str;
		}
	}); //end of 'JsNamespace.declareClass("Eco.Matrix", {'
} //end of 'if ( !JsNamespace.exist("Eco.Matrix") )'

