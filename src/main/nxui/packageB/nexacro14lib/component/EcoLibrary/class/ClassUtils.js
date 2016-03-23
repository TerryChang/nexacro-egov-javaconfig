/**
 * @fileoverview ClassUtils 관련된 함수.
 */

if ( !JsNamespace.exist("Eco.ClassUtils") )
{
	/**
	 * @namespace
	 * @name ClassUtils
	 * @memberof! <global>
	 */
	JsNamespace.declare("Eco.ClassUtils", {
		readFromList: function(Class, list, start, length, options)
		{
			if (Eco.isArray(Class))
			{
				var value = Eco.ClassUtils.peekFromList(Class, list);
				Class._index++;
				Class.__read = 1;
				return value;
			}

			var proto = Class.prototype,
				readIndex = Class._readIndex,
				index = start || readIndex && list._index || 0;

			if (!length)
			{
				length = list.length - index;
			}

			var obj = list[index];
			if ( obj instanceof Class
				|| options && options.readNull && obj == null && length <= 1)
			{
				if (readIndex)
				{
					list._index = index + 1;
				}
				//trace("readFromList==>" + list._index + "///" + obj.getClassName() + "///" + readIndex);
				return obj && options && options.clone ? obj.clone() : obj;
			}

			obj = new Class();

			if (readIndex)
			{
				obj.__read = true;
			}
			if (options)
			{
				obj.__options = options;
			}

			var args;
			if ( index > 0 || length < list.length )
			{
				args = Array.prototype.slice.call(list, index, index + length);
			}
			else
			{
				args = list;
			}
			obj = obj.initialize.apply(obj, args) || obj;
			if (readIndex)
			{
				list._index = index + obj.__read;
				list.__read = obj.__read;
				delete obj.__read;
				if (options)
				{
					delete obj.__options;
				}
			}
			return obj;
		},
		peekFromList: function(list, start)
		{
			return list[list._index = start || list._index || 0];
		},
		readAllFromList: function(Class, list, start, options)
		{
			var res = [], entry;
			for (var i = start || 0, l = list.length; i < l; i++)
			{
				res.push(Eco.isArray(entry = list[i])
					? Eco.ClassUtils.readFromList(Class, entry, 0, 0, options)
					: Eco.ClassUtils.readFromList(Class, list, i, 1, options));
			}
			return res;
		},
		readNamedFromList: function(Class, list, name, start, length, options)
		{
			var value = Eco.ClassUtils.getNamed(list, name);
			return Eco.ClassUtils.readFromList(Class, value != null ? [value] : list, start, length,
					options);
		},
		getNamed: function(list, name)
		{
			var arg = list[0];
			if (list._hasObject === undefined)
			{
				list._hasObject = list.length === 1 && Eco.isObject(arg);
			}
			if (list._hasObject)
			{
				return name ? arg[name] : arg;
			}
		},
		hasNamed: function(list, name)
		{
			return !!Eco.ClassUtils.getNamed(list, name);
		},
		pickFromArgs: function()
		{
			for (var i = 0, l = arguments.length; i < l; i++)
			{
				if (arguments[i] != null)
				{
					return arguments[i];
				}
			}
			return null;
		},
		_fmtPercision: 5,
		_fmtMultiplier: Math.pow(10, 5),
		fmtNumber: function(val)
		{
			return (Math.round(val * Eco.ClassUtils._fmtMultiplier)/Eco.ClassUtils._fmtMultiplier) + "";
		},
		fmtPoint: function(val, separator)
		{
			return Eco.ClassUtils.fmtNumber(val.x) + (separator || ',') + Eco.ClassUtils.fmtNumber(val.y);
		},
		fmtSize: function(val, separator)
		{
			return Eco.ClassUtils.fmtNumber(val.width) + (separator || ',') + Eco.ClassUtils.fmtNumber(val.height);
		},
		fmtRect: function(val, separator)
		{
			return Eco.ClassUtils.fmtPoint(val, separator) + (separator || ',') + Eco.ClassUtils.fmtSize(val, separator);
		},
		"set": function(clsObj, props)
		{
			if ( clsObj && Eco.isObject(props) )
			{
				clsObj.setProperties(props);
				return true;
			}
		}
	}); //end of 'JsNamespace.declare("ClassUtils", {'
} //end of 'if ( !JsNamespace.exist("ClassUtils") )'

