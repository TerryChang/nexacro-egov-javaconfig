/**
 * @fileoverview
 * DataUtil에 관련된 Class 정의 
 */

if ( !JsNamespace.exist("Eco.HashMap") )
{
	JsNamespace.declareClass("Eco.HashMap", {
		/**
		 * HashMap 생성자(constructor)
		 * @class HashMap
		 * @classdesc key와 value 를 묶어서 하나의 entry로 저장한다.
		 * hasing을 사용하기 때문에 많은 양의 데이터를 검색하는데 뛰어난 성능을 보인다.<br>
		 * key값은 중복되지 않고 value값은 중복허용.<br>
		 * @constructor HashMap
		*/
		initialize: function()
		{
			this._size = 0;
			this._map = {};
			return this;
		},
		statics: {
			KeyPropertyName: "_haskKey",
			_keyMapForObject: {}
		},
		/**
		 * 주어진 key에 value값을 저장한다.
		 * @param {string | object} key key
		 * @param {object} value value
		 * @param {boolean=} nocheck key값이 string type인지 check 루틴을 처리할 것인지 여부
		 * @return {*} 해당 key의 저장되었던 value값
		 * @memberOf HashMap
		*/
		put: function(key, value, nocheck)
		{
			if ( !nocheck )
			{
				key = this._checkKey(key);
			}
			if (!this.containsKey(key, true))
			{
				this._size++;
				this._map[key] = value;
			}
			else
			{
				var previous = this._map[key];
				this._map[key] = value;
				return previous;
			}
		},
		/**
		 * 키에 해당하는 value 반환.
		 * @param {string | object} key key
		 * @param {boolean=} nocheck key값이 string type인지 check 루틴을 처리할 것인지 여부
		 * @return {*} 키에 해당하는 value
		 * @memberOf HashMap
		*/
		"get": function(key, nocheck)
		{
			if ( !nocheck )
			{
				key = this._checkKey(key);
			}
			return this.containsKey(key, true) ? this._map[key] : null;
		},
		/**
		 * 키에 해당하는 value 제거.
		 * @param {string | object} key key
		 * @param {boolean=} nocheck key값이 string type인지 check 루틴을 처리할 것인지 여부
		 * @return {string | object} remove된 value 값
		 * @memberOf HashMap
		*/
		remove: function(key, nocheck)
		{
			if ( !nocheck )
			{
				key = this._checkKey(key);
			}
			if (this.containsKey(key, true))
			{
				this._size--;
				var value = this._map[key];
				delete this._map[key];
				return value;
			}
			else
			{
				return null;
			}
		},
		/**
		 * 주어진 key 값이 존재하는지 확인하는 함수
		 * @param {string} key key
		 * @param {boolean=} nocheck key값이 string type인지 check 루틴을 처리할 것인지 여부
		 * @return {boolean} 존재 여부
		 * @memberOf HashMap
		*/
		containsKey: function(key, nocheck)
		{
			if ( !nocheck )
			{
				if ( this._isObjectLike(key) )
				{
					key = this._getKeyForObject(key);
				}
				if ( !Eco.isString(key) )
				{
					key = key + "";
				}
			}
			return this._map.hasOwnProperty(key);
		},
		/**
		 * 주어진 value가 존재하는지 확인하는 함수
		 * @param {string} value value
		 * @return {boolean} 존재 여부
		 * @memberOf HashMap
		*/
		containsValue: function(value)
		{
			var map = this._map;
			for (var key in map)
			{
				if (map.hasOwnProperty(key))
				{
					if (map[key] === value)
					{
						return true;
					}
				}
			}
			return false;
		},
		/**
		 * hashMap size 반환.
		 * @return {number} hashMap size
		 * @memberOf HashMap
		*/
		getSize: function()
		{
			return this._size;
		},
		/**
		 * hashMap clear.
		 * @memberOf HashMap
		*/
		clear: function()
		{
			this._size = 0;
			this._map = {};
		},
		/**
		 * hashMap에 저장된 모든 key 반환.
		 * @return {array} hashMap에 저장된 모든 key.
		 * @memberOf HashMap
		*/
		getKeys: function()
		{
			var keys = [],
				map = this._map;
			for (var key in map)
			{
				if (map.hasOwnProperty(key))
				{
					keys.push(key);
				}
			}
			return keys;
		},
		/**
		 * hashMap에 저장된 모든 value 반환.
		 * @return {array} hashMap에 저장된 모든 value.
		 * @memberOf HashMap
		*/
		getValues: function()
		{
			var values = [],
				map = this._map;
			for (var key in map)
			{
				if (map.hasOwnProperty(key))
				{
					values.push(map[key]);
				}
			}
			return values;
		},
		/**
		 * key 값이 object형태이면 object별로 key 생성하는 처리,
		 * string type이 아니면 string으로 convert하여 넘겨준다.
		 * @param {*} key key
		 * @return {string} string형태로 convert한 key값.
		 * @private
		 * @memberOf HashMap
		*/
		_checkKey: function(key)
		{
			if ( this._isObjectLike(key) )
			{
				key = this._getKeyForObject(key);
			}
			if ( !Eco.isString(key) )
			{
				key = key + "";
			}
			return key;
		},
		/**
		 * key 값이 object형태인지 check하기 위해 사용하는 함수.
		 * @param {*} obj check할 대상.
		 * @return {boolean} object형태인지 여부.
		 * @private
		 * @memberOf HashMap
		*/
		_isObjectLike: function(obj)
		{
			if ( Eco.isObject(obj) ) return true;
			if ( Eco.isXpComponent(obj) ) return true;
			if ( obj._className && obj._className.length ) return true;
			return false;
		},
		/**
		 * key 값이 object형태이면 object에 unique key값을 생성하여 
		 * object의 HashMap.KeyPropertyName 명칭의 속성값으로 할당한다.
		 * 그 값을 return한다.
		 * @param {*} obj key값을 생성할 object.
		 * @return {string} 생성되거나 설정된 unique key값.
		 * @private
		 * @memberOf HashMap
		*/
		_getKeyForObject: function(obj)
		{
			var haskKeyPropNm = HashMap.KeyPropertyName;
			if ( obj[haskKeyPropNm] == null )
			{
				var keyMap = HashMap._keyMapForObject, keyStr, counter;
				if ( Eco.isObject(obj) )
				{
					counter = keyMap["Object"];
					{
						keyMap["Object"] = 0;
						counter = keyMap["Object"];
					}
					keyStr = "Object#" + counter;
					keyMap["Object"]++;
				}
				else if ( Eco.isXpComponent(obj) )
				{
					var type = Eco.XPComp.typeOf(obj);
					counter = keyMap[type];
					if ( counter == null )
					{
						keyMap[type] = 0;
						counter = keyMap[type];
					}
					keyStr = type + "#" + counter;
					keyMap[type]++;
				}
				else
				{
					var clsNm = obj.getClassName();
					counter = keyMap[clsNm];
					if ( counter == null )
					{
						keyMap[clsNm] = 0;
						counter = keyMap[clsNm];
					}
					keyStr = clsNm + "#" + counter;
					keyMap[clsNm]++;
				}
				obj[haskKeyPropNm] = keyStr;
			}
			return obj[haskKeyPropNm];
		},
		/**
		 * object에 unique key값을 생성하여 설정된 값을 제거한다. 
		 * @param {*} obj key값을 생성할 object.
		 * @private
		 * @memberOf HashMap
		*/
		_clearKeyForObject: function(obj)
		{
			delete obj[HashMap.KeyPropertyName];
		}
	}); // end of 'JsNamespace.declare("HashMap",'
} // end of 'if ( !JsNamespace.exist("HashMap") )




/*************************************************
	2013.12.05 ==> 아래는 삭제 예정 !!!
/************************************************/

if ( !JsNamespace.exist("Eco.LinkedHashMap") )
{
	JsNamespace.declareClass("Eco.LinkedHashMap", {
		/**
		 * Eco.LinkedHashMap 생성자(constructor)
		 * @class Eco.LinkedHashMap
		 * @classdesc HashMap 기능에 더하여 entry(key-value쌍)의 배열 정보를 관리하여 순서 정렬 처리까지 용이하게 한다. 
		 * @constructor Eco.LinkedHashMap
		 * @extends HashMap
		*/
		initialize: function()
		{
			this.callParent(arguments);
			this._head = this._tail = null;
			this._Entry = function(value)
			{
				this.prev = null;
				this.next = null;
				this.value = value;
			};
			return this;
		},
		"extends": 'Eco.HashMap', //inherited HashMap.
		/**
		 * 주어진 key에 value값을 저장한다.
		 * @param {string | object} key key
		 * @param {object} value value
		 * @return {*} 해당 key의 저장되었던 value값
		 * @memberOf Eco.LinkedHashMap
		*/
		put: function(key, value)
		{
			key = this._checkKey(key);
			var entry = new this._Entry(key);

			if (!this.containsKey(key, true))
			{
				if (this.size() === 0)
				{
					this._head = entry;
					this._tail = entry;
				}
				else
				{
					this._tail.next = entry;
					entry.prev = this._tail;
					this._tail = entry;
				}
			}
			value = {value:value, entry:entry};
			return this.callParent([key, value, true]);
		},
		/**
		 * 키에 해당하는 value 반환.
		 * @param {string | object} key key
		 * @return {*} 키에 해당하는 value
		 * @memberOf Eco.LinkedHashMap
		*/
		"get": function(key, value)
		{
			key = this._checkKey(key);
			var value = this.callParent([key, true]);
			return value != null ? value.value : null;
		},
		/**
		 * 주어진 insposkey 위치에 주어진 key-value entry값을 insert한다.
		 * @param {string | object} insPosKey insert할 위치 key
		 * @param {string | object} key key
		 * @param {object} value value
		 * @memberOf Eco.LinkedHashMap
		*/
		insertBefore: function(insPosKey, key, value)
		{
			insPosKey = this._checkKey(insPosKey);
			if ( !this.containsKey(insPosKey, true) )
			{
				this.put(key, value);
				return;
			}

			key = this._checkKey(key);
			var entry = new this._Entry(key);
			var refValue = HashMap.prototype.get.call(this, insPosKey, true);
			var refEntry = refValue.entry;

			if (!this.containsKey(key, true))
			{
				if ( this._head === refEntry )
				{
					this._head = entry;
				}
				else
				{
					refEntry.prev.next = entry; 
				}
				entry.prev = refEntry.prev;
				entry.next = refEntry;
				refEntry.prev = entry;
			}
			value = {value:value, entry:entry};
			HashMap.prototype.put.call(this, key, value, true);
		},
		/**
		 * 키에 해당하는 value 제거.
		 * @param {string | object} key key
		 * @return {string | object} remove된 value 값
		 * @memberOf Eco.LinkedHashMap
		*/
		remove: function(key)
		{
			key = this._checkKey(key);
			var value = this.callParent([key, true]);

			if (value)
			{
				var entry = value.entry;

				if (entry === this._head)
				{
					this._head = entry.next;
					this._head.prev = null;
				}
				else if (entry === this._tail)
				{
					this._tail = entry.prev;
					this._tail.next = null;
				}
				else
				{
					entry.prev.next = entry.next;
					entry.next.prev = entry.prev;
				}
			}
			return value;
		},
		/**
		 * Eco.LinkedHashMap clear.
		 * @memberOf Eco.LinkedHashMap
		*/
		clear: function()
		{
			this.callParent(arguments);
			this._head = this._tail = null;
		},
		/**
		 * Eco.LinkedHashMap 저장된 모든 key 입력된 순서대로 반환.
		 * @return {array} Eco.LinkedHashMap에 저장된 모든 key.
		 * @memberOf Eco.LinkedHashMap
		*/
		getKeys: function()
		{
			var keys = [];
			for (var cur = this._head; cur != null; cur = cur.next)
			{
				keys.push(cur.value);
			}
			return keys;
		},
		/**
		 * Eco.LinkedHashMap에 저장된 모든 value 입력된 순서대로 반환.
		 * @return {array} Eco.LinkedHashMap에 저장된 모든 value.
		 * @memberOf Eco.LinkedHashMap
		*/
		getValues: function()
		{
			var values = [];
			for (var cur = this._head; cur != null; cur = cur.next)
			{
				values.push(this.get(cur.value));
			}
			return values;
		},
		/**
		 * 주어진 ds(Dataset) 의 값들을 참조하여 Eco.LinkedHashMap에 저장한다.
		 * @param {Dataset} ds 참조할 dataset.
		 * @param {string} keyColumn key값을 참조할 dataset column명.
		 * @param {string} valueColumn value값을 참조할 dataset column명.
		 * @memberOf Eco.LinkedHashMap
		*/
		buildDataWithDataset: function(ds, keyColumn, valueColumn)
		{
			var len = ds.rowcount;
			for ( var i = 0 ; i < len ; i++ )
			{
				this.put(ds.getColumn(i,keyColumn), ds.getColumn(i,valueColumn)); 
			}
		},
		/**
		 * Eco.LinkedHashMap에 저장된 값들을 trace로 확인한다.
		 * @private
		 * @memberOf Eco.LinkedHashMap
		*/
		_debug: function()
		{
			for (var cur = this._head; cur != null; cur = cur.next)
			{
				trace(cur.value + "--->" + this.get(cur.value));
			}
		}
	}); // end of 'JsNamespace.declare("Eco.LinkedHashMap",'
} // end of 'if ( !JsNamespace.exist("Eco.LinkedHashMap") )
