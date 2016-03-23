/**
 * @fileoverview
 * DatasetMap Class 정의 
 */

if ( !JsNamespace.exist("Eco.DatasetMap") )
{
	JsNamespace.declareClass("Eco.DatasetMap", {
		/**
		 * DatasetMap 생성자(constructor)
		 * @class DatasetMap
		 * @classdesc Dataset에서 행(row)별로 데이터를 unique한 key column으로 map 정보를 구성하는 객체<br>
		 * key 항목으로 검색 처리가 for loop으로 하지 않고 object key collection 검색하여 처리 속도가 데이터의 크기와 상관없다.<br>
		 * 또한 Dataset의 행(row)별로 객체 값으로 데이터를 구성하여 담을 수 있는 메모리 구조이다.
		 * @constructor DatasetMap
		*/
		initialize: function()
		{
			this.clear();
			this._indexMapNeedRefresh = true;
			return this;
		},
		/**
		 * 데이터를 모두 지운다.
		 * @memberOf DatasetMap
		*/
		clear: function()
		{
			if ( !this.datas || this.datas.length )
			{
				this.datas = [];
				this.keyMap = {};
				this._indexMap = null;
				this._rebuildIndexMap = true;
			}
		},
		/**
		 * 주어진 key 값이 존재하는지 확인하는 함수
		 * @param {string} key key 값
		 * @return {boolean} 존재 여부
		 * @memberOf DatasetMap
		*/
		containsKey: function(key)
		{
			return this.keyMap.hasOwnProperty(key+"");
		},
		/**
		 * 주어진 key 값이 가지는 row를 얻는다.
		 * @param {string} key key 값
		 * @return {number} key값에 해당하는 row
		 * @memberOf DatasetMap
		*/
		findRowByKey: function(key)
		{
			if ( this._rebuildIndexMap )
			{
				var indexMap = {},
					datavals = this.datas,
					data;
				for (var i = 0, len = datavals.length; i < len; i++)
				{
					data = datavals[i];
					indexMap[data.key] = i;
				}
				this._indexMap = indexMap;
				this._rebuildIndexMap = false;
			}
			var row = this._indexMap[key + ""];
			return row == null ? -1 : row;
		},
		/**
		 * 주어진 row에 주어진 key, data을 insert한다.
		 * @param {number} row index of row 
		 * @param {string} key key 값
		 * @param {*} data row별로 저장하는 객체 값
		 * @param {boolean} checkLength row 유효성 검사를 할 것인지 여부(default: true)
		 * @memberOf DatasetMap
		*/
		insert: function(row, key, data, checkLength)
		{
			if ( this.containsKey(key) ) return;
			data.key = key + "";
			if ( checkLength === false )
			{
				this.keyMap[key + ""] = data;
				this.datas[row] = data;
			}
			if ( checkLength || ( row > -1 && row < this.datas.length ) )
			{
				this.keyMap[key + ""] = data;
				this.datas.splice(row, 0, data);
			}
			else
			{
				this.add(key, data);
			}
			this._rebuildIndexMap = true;
		},
		/**
		 * 주어진 key, data을 add한다.
		 * @param {string} key key 값
		 * @param {*} data row별로 저장하는 객체 값
		 * @memberOf DatasetMap
		*/
		add: function(key, data)
		{
			key = key + "";
			if ( this.containsKey(key) ) return;
			data.key = key;
			this.keyMap[key] = data;
			this.datas.push(data);
			this._rebuildIndexMap = true;
		},
		/**
		 * 주어진 row의 data를 삭제한다.
		 * @param {number} row index of row 
		 * @memberOf DatasetMap
		*/
		removeAt: function(row)
		{
			var data = this.datas[row];
			if ( !data ) return false;
			var key = data.key;
			if ( !this.containsKey(key) ) return false;
			delete this.keyMap[key];
			this.datas.splice(row, 1);
			this._rebuildIndexMap = true;
		},
		/**
		 * 주어진 key의 data를 삭제한다.
		 * @param {string} key 값
		 * @memberOf DatasetMap
		*/
		removeAtKey: function(key)
		{
			key = key + "";
			if ( !this.containsKey(key) ) return false;
			var row = this.findRowByKey(key);
			if ( row == -1 ) return false;

			delete this.keyMap[key];
			this.datas.splice(row, 1);
			this._rebuildIndexMap = true;
		},
		/**
		 * 주어진 dataset으로 내부 데이터를 구성한다.<br>
		 * 두번째 주어지는 keyColumnId 이 dataset에 구성되는 column명이고 이 column에 존재하는 데이터가 key 값이 된다.<br>
		 * 세번쨰 인자로 주어지는 createDataFunc는 data 객체를 구성하기 호출하는 함수이다.<br>
		 * 이 함수는 정의시에 return 값으로 객체가 되어야 한다.<br>
		 * createDataFunc의 arguments ( dataset, row, key ) 로 넘겨준다.
		 * @example
		 * //taskItem 객체 생성하는 함수
		 * function createTaskItem(ds, row, key)
		 * {
		 *    var sdt = ds.getColumn(row, "Start");
		 *    var edt = ds.getColumn(row, "Finish");
		 *    var taskName = ds.getColumn(row, "TaskName");
		 *    var data = {
		 *      taskname: taskName,
		 *      startdate: sdt,
		 *      finishdate: edt
		 *    };
		 *    return data;
		 * }
		 *
		 * var dsMap = new DatasetMap();
		 * dsMap.buildDataWithDataset(Dataset00, "cd", createTaskItem, this);
		 *
		 * @param {Dataset} ds dataset
		 * @param {string} keyColumnId key 값을 얻는 dataset column 명
		 * @param {function} createDataFunc data 객체를 생성하는 처리함수
		 * @param {*} scope createDataFunc 함수 내부에 사용되는 this
		 * @memberOf DatasetMap
		*/
		buildDataWithDataset: function(ds, keyColumnId, createDataFunc, scope)
		{
			this.clear();
			var key, data,
				datavals = this.datas,
				keyvals = this.keyMap;
			for ( var i = 0, len = ds.rowcount ; i < len ; i++ )
			{
				key = ds.getColumn(i, keyColumnId) + "";
				data = createDataFunc.call(scope, ds, i, key);
				data.key = key;
				datavals[i] = data;
				keyvals[key] = data;
			}
			this._rebuildIndexMap = true;
		},
		/**
		 * 주어진 행(row)의 data 객체를 구하는 메소드입니다.
		 * @param {number} row index of row
		 * @return {*} 주어진 row의 data 객체
		 * @memberOf DatasetMap
		*/
		getAt: function(row)
		{
			return this.datas[row];
		},
		/**
		 * 주어진 key의 data 객체를 구하는 메소드입니다.
		 * @param {string} key key 값
		 * @return {*} 주어진 key의 data 객체
		 * @memberOf DatasetMap
		*/
		getByKey: function(key)
		{
			return this.keyMap[key];
		},
		/**
		 * 주어진 oldRow의 data 객체를 주어진 newRow로 이동하는 처리이다.
		 * @param {number} oldRow 이동 하려는 row
		 * @param {number} newRow 이동을 원하는 row
		 * @memberOf DatasetMap
		*/
		moveRow: function(oldRow, newRow)
		{
			var dataLen = this.datas.length;
			if ( oldRow < 0 || oldRow >= dataLen ) return;
			if ( newRow < 0 || newRow > dataLen ) return;

			if ( oldRow > newRow )
			{
				var data = this.datas[oldRow];
				this.datas.splice(newRow, 0, data);
				this.datas.splice(oldRow + 1, 1);
				this._rebuildIndexMap = true;
			}
			else if ( oldRow < newRow )
			{
				var data = this.datas[oldRow];
				this.datas.splice(oldRow, 1);
				this.datas.splice(newRow - 1, 0, data);
				this._rebuildIndexMap = true;
			}
		}
	}); // end of 'JsNamespace.declare("DatasetMap",'
} // end of 'if ( !JsNamespace.exist("DatasetMap") )'


