//Event Info 생성
if(!nexacro.ExtFileUploadChangeEventInfo) 
{
	
	
    nexacro.ExtFileUploadChangeEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onchange";
        this.fromobject = this.fromreferenceobject = obj;

        this.index;
		this.files;
    };
    var _pEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ExtFileUploadChangeEventInfo);
    nexacro.ExtFileUploadChangeEventInfo.prototype = _pEventInfo;
    _pEventInfo._type_name = "ExtFileUploadChangeEventInfo";

    delete _pEventInfo;
    
    
    nexacro.ExtFileLoadEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onsuccess";
        this.fromobject = this.fromreferenceobject = obj;

        this.datasets; //RUNTIME Only	
        this.type;
        this.errorcode;
        this.errormsg;
        this.url;
    };
    
    var _pExtFileLoadEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileLoadEventInfo.prototype = _pExtFileLoadEventInfo;
    _pExtFileLoadEventInfo._type = "ExtFileLoadEventInfo";
    _pExtFileLoadEventInfo._type_name = "ExtFileLoadEventInfo";

    delete _pExtFileLoadEventInfo;    
    
    
    nexacro.ExtFileErrorEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onerror";
        this.fromobject = this.fromreferenceobject = obj;

        this.errorcode;
        this.errormsg;
        this.errorobj;
        
        this.errortype;
        
        this.statuscode;
        this.requesturi;
        this.locationuri;
        
        this.index = -1; //RUNTIME Only	
    };
    var _pExtFileErrorEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileErrorEventInfo.prototype = _pExtFileErrorEventInfo;
    _pExtFileErrorEventInfo._type = "ExtFileErrorEventInfo";
    _pExtFileErrorEventInfo._type_name = "ExtFileErrorEventInfo";

    delete _pExtFileErrorEventInfo;    
}

//RUNTIME 여부 체크
if (nexacro.Browser == "Runtime")
{
    
    /* file 전송용 transaction item
     * @param {string} path upload url
     * @param {string} type "upload" or "download"
     * @param {object} context context
     * @param {string} inDatasetsParam input datasets string. ex) ds_input=ds_input....
     * @param {string} outDatasetsParam output datasets string. ex) ds_output=ds_output.... 
     * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
     */
    nexacro.ExtFileTransaction = function (path, type, context, inDatasetsParam, outDatasetsParam, datatype)
    {
        nexacro.CommunicationItem.call(this, path, type, false);

        this.context = context;
        this.inputDatasets = this._parseDSParam(inDatasetsParam);
        this.outputDatasets = this._parseDSParam(outDatasetsParam);
        //this.parameters = this._parseVarParam(argsParam);
        
        this.datatype = (!datatype ? 0 : datatype); // datatype => 0:XML, 1:Binary(Runtime only), 2:SSV
        this._sendData = this._serializeData();
        
        //trace(inDatasetsParam + "\n, this._sendData="+this._sendData);
        
        this._usewaitcursor = application.usewaitcursor;
        
        this._remain_data = null;
        
		if (nexacro.Browser == "IE" && nexacro.BrowserVersion < 9)
		{
		    this._check_responseXML = true; // read responseXML.
		}
		else
		{
		    this._check_responseXML = false; // do not read responseXML.
		}        
        
    };
    
    var _pFileTransaction = nexacro._createPrototype(nexacro.CommunicationItem);
    nexacro.ExtFileTransaction.prototype = _pFileTransaction;
    
    _pFileTransaction._type = "ExtFileTransaction";
    _pFileTransaction._type_name = "ExtFileTransaction";
    
    
    _pFileTransaction._serializeData = function ()
	{
	    if (this.datatype == 1) // BIN (Runtime Only)
	    {
	        return this.__serializeBIN();
	    }
	    else if (this.datatype == 2) // SSV
	    {
	        return this.__serializeSSV();
	    }
	    else
	    {
	        return this.__serializeXML();
	    }
    	
	};    
	
	_pFileTransaction._TABS = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t"];
	_pFileTransaction._writeData = function (list, str, depth) 
	{
		list[list.length] = this._TABS[depth] + str;
	};
	
	
	_pFileTransaction.__serializeXML = function () 
	{
		return "";
		
		/*
		var depth = 0;
		var list = [];
        var cookievar = application._cookie_variables;
        
        //[START] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		this._writeData(list, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>", depth);
		this._writeData(list, "<!DOCTYPE p_nexacro [ <!ENTITY nbsp '&#160;'> <!ENTITY quot '&#34;'>" +
				" <!ENTITY amp '&#38;'> <!ENTITY lt '&#60;'> <!ENTITY gt '&#62;'> ]>", depth);
		//[END] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		
		this._writeData(list, "<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\">", depth++);
		
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
		    argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
		    cookievarCnt = cookievar.length;
		}

		if (argParamsCnt > 0 || cookievarCnt > 0) 
		{
			this._writeData(list, "<Parameters>", depth++);
			
			if (cookievarCnt)
			{
				for (var i = 0; i < cookievarCnt; i++)
				{
					var id = cookievar[i];
					var val = application[id];

					if (val && val.length) 
					{
						val = nexacro._encodeXml(val);
						this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
					} 
					else 
					{
						this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
					}
				}
			}
			if (argParamsCnt > 0)
			{
				for (var i = 0; i < argParamsCnt; i++)
				{
					var id = argParams[i].lval;
					var val = argParams[i].rval;

					if (val && val.length) 
					{
						val = nexacro._encodeXml(val);
						this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
					} 
					else 
					{
						this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
					}
				}
			}
			this._writeData(list, "</Parameters>", --depth);
		} 
		else 
		{
			this._writeData(list, "<Parameters />", depth);
		}
		
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (i = 0; i < datasetCnt; i++)
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);
				if (ds) 
				{
					list.push(ds._saveXML(datasetParams[i].lval, datasetParams[i].saveType, depth, false));
				}
			}
		}		
		this._writeData(list, "</Root>", --depth);

		var rntVal;

		if (argParamsCnt == 0 && cookievarCnt == 0 && (!datasetParams || datasetParams.length == 0))
		{
		    rntVal = "";
		}
		else
		{
		    rntVal = list.join("\n");
		}
		
		return rntVal;
		*/
	};    
	
	
	_pFileTransaction.__serializeSSV = function ()
	{
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);

		var depth = 0;
		var list = [];
        var cookievar = application._cookie_variables;
		var id, val, ds;
        
		var listLength = 0;
		list.push("SSV:utf-8" + _rs_);
		
		// Variables
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
		    argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
		    cookievarCnt = cookievar.length;
		}
			
		if (cookievarCnt > 0)
		{
			for (i = 0; i < cookievarCnt; i++) 
			{
				id = cookievar[i];
				val = application[id];

				if (val && val.length) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		if (argParamsCnt > 0)
		{
			for (i = 0; i < argParamsCnt; i++) 
			{
				id = argParams[i].lval;
				val = argParams[i].rval;

				if (val) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		
		// Dataset
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (var i = 0; i < datasetCnt; i++) 
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);   
				if (ds) 
				{
					list.push(ds.saveSSV(datasetParams[i].lval, datasetParams[i].saveType));
				}
			}	
		}
		
		var rtnVal = list.join("");
		return rtnVal;
	};
	
	_pFileTransaction.__serializeBIN = function ()
	{
	    var ssvdata = this.__serializeSSV();
	    if (ssvdata)
	    {
	        return nexacro._convertStreamSSVToBIN(ssvdata);
	    }
	    return "";
	};	
	
    _pFileTransaction.on_start = function ()
    {
        if (this._usewaitcursor)
        {
            this._showWaitCursor();
        }
    };
    
    _pFileTransaction.on_load_file = function (data, cookie, status, statusText)
    {
        //trace("on_load_data:" + data + ", cookie:" + cookie + ", status:" + status + ", statusText:" + statusText);
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
        }
        
	    if (!data)
	    {
	        return [-1, "Stream Data is null!"];
	    }

        data = data.trim();
	    var fstr = data.substring(0, 3);
		
        var result, i, 
            id, val,
            code = 0, msg = "";

	    if (fstr == "SSV") // SSV Type (HEX:53,53,56)
	    { 
	        result = this.__deserializeSSV(data);			
            code = result[0];
            msg = result[1] + "[" + status + "," + statusText + "]";
			
	    } 
		else //XML Type
		{
			result = this._deserializeXMLFromStr(data);
			code = result[0];
			msg = result[1] + "[" + status + "," + statusText + "]";
        }		

        delete nexacro._CommunicationManager[this.path];
		
        if (this._protocol < 0)
            data = this.on_decrypt(data);  

        this._addCookieToGlobalVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                    item.callback.call(target, this.type, code, msg, this.path);
            }
            callbackList.splice(0, n);
        }
        //this._handle = null;       
    };
    
    _pFileTransaction.on_loadframe_file = function (unique_id, target)
    {
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
       	}
        
        var i, id, 
            val, xmldoc,
            result, variables,
            datasets, form,
            code = 0, msg = "";
        
        form = this.context;
        xmldoc = nexacro._getXMLDocument(unique_id);
        result = nexacro._getCommDataFromDom(xmldoc, this);
        
        variables = result[0];
        for (i = 0; i < variables.length; i++)
        {
            id = variables[i]["id"];
            if (id && id.length)
            {
                val = variables[i]["val"];
                if (id == "ErrorCode")
                {
                    code = parseInt(val, 10);
                    if (!isFinite(code))
                    {
                        code = -1;
                    }
                }
                else if (id == "ErrorMsg")
                {
                    msg = val;
                }
            }
        }
        
        delete nexacro._CommunicationManager[this.path];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                    item.callback.call(target, this.type, code, msg, this.path);
            }
            callbackList.splice(0, n);
        }
    };
    
    _pFileTransaction.on_down_file = function (data, unique_id, cookie, status, statusText)
    {
        //trace("on_down_file data.size:" + data.size + ", cookie:" + cookie + ",_downfilename:" + this._downfilename + ", status:" + status + ", statusText:" + statusText);
        var url,
            saveFilename = this._downfilename;
        
        if (nexacro._ExtFileUpDownloadSupport.Download)
        {
            url = this._createObjectURL(data); // response is a blob
            this._downfileblob = url;
            
            var manager = nexacro._IframeManager;
            var form = manager.search_form(unique_id);
            if (form && form.node)
            {
                var node = form.node;
                var doc = nexacro._managerFrameDoc;
                var ahref = doc.createElement("a");
                ahref.href = url;
                ahref.download = saveFilename;
                ahref.style.display = "none";
                
                //node.appendChild(ahref);
                nexacro.__appendDOMNode(node, ahref);
                ahref.click();
                
                nexacro.__removeDOMNode(node, ahref);
                ahref = null;
            }
        }
        else if (nexacro._ExtFileUpDownloadSupport.MSSave)
        {
            window.navigator.msSaveOrOpenBlob(data, saveFilename);
        }
        else
        {
            nexacro._download(this.path);
        }
        
        delete nexacro._CommunicationManager[this.path];
        
        if (this._protocol < 0)
            data = this.on_decrypt(data);   

        this._addCookieToGlobalVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                    item.callback.call(target, this.type, status, statusText, this.path);
            }
            callbackList.splice(0, n);
        }
    };
    
    _pFileTransaction.on_downend_file = function ()
    {
        //trace("on_downend_file _downfileblob url:" + this._downfileblob + ",_downfilename:" + this._downfilename);
        
        var url = this._downfileblob,
        	pThis = this;
        
		if (nexacro._ExtFileUpDownloadSupport.Download && url)
        {
			setTimeout( function () {
				pThis._revokeObjectURL(url);
			}, 250);
		}
        
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
        }
        
        this._downfileblob = null;
        this._downfilename = null;
    };
    
    _pFileTransaction._createObjectURL = function (blob)
    {
        if (window.webkitURL)
        {
            return window.webkitURL.createObjectURL(blob);
        } 
        else if (window.URL && window.URL.createObjectURL) 
        {
            return window.URL.createObjectURL(blob);
        } 
        else 
        {
            return null;
        }
    };
    
    _pFileTransaction._revokeObjectURL = function (url)
    {
        if (window.webkitURL)
        {
            window.webkitURL.revokeObjectURL(url);
        } 
        else if (window.URL && window.URL.revokeObjectURL) 
        {
            window.URL.revokeObjectURL(url);
        }
    };
	
	
	_pFileTransaction.__deserializeSSV = function (strRecvData) 
	{
		//trace("런타임 __deserializeSSV 호출");
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);
		
		var code = 0;
		var message = "SUCCESS";

		if (!strRecvData)
		{
		    return [-1, "Stream Data is null!"];
		}
		
		var form = this.context;
		var parent = this.parent; //fileUpload
		
		var ssvLines = strRecvData.split(_rs_);
		var lineCnt = ssvLines.length;
		var curIdx = 0;	    
		curIdx++;

		var curStr;
		
	    // parse parameters		
		for (; curIdx < lineCnt; curIdx++)
		{
		    curStr = ssvLines[curIdx];
		    if (curStr.substring(0, 7) != "Dataset")
		    {
		        var paramArr = curStr.split(_cs_);
		        var paramCnt = paramArr.length;
		        for (var i = 0; i < paramCnt; i++)
		        {
		            var paramStr = paramArr[i];
		            var varInfo = paramStr;
		            var val = undefined;
		            var sep_pos = paramStr.indexOf("="); 
		            if (sep_pos >= 0)
		            {
		                varInfo = paramStr.substring(0, sep_pos);
		                val = paramStr.substring(sep_pos + 1);
		            }

		            if (varInfo)
		            {
		                var id = varInfo;
		                var sep_pos = varInfo.indexOf(":");
		                if (sep_pos >= 0)
		                {
		                    id = varInfo.substring(0, sep_pos);
		                }

		                if (id == "ErrorCode")
		                {		                    
		                    code = parseInt(val) | 0;
		                    if (isFinite(code) == false)
		                    {
		                        code = -1;
		                    }
		                }
		                else if (id == "ErrorMsg")
		                {
		                    message = val;
		                }
		                else if (id in form)  //1.form(application) variable 
		                {
		                    if (typeof (form[id]) != "object")
		                    {
		                        form[id] = val;
		                    }
		                }
		                else //application globalvariable 
		                {
		                    if (application._existVariable(id))
		                    {
		                        application[id] = val;
		                    }
		                }
		            }
		        }
		    }
		    else
		    {
		        break;
		    }
		}

		if (code <= -1)
		{
		    return [code, message];
		}
		
		
		var inDatasets = this.inputDatasets;
		if (inDatasets && inDatasets.length) 
		{
			
			var inDataCnt = inDatasets.length;
			for (var i = 0; i < inDataCnt; i++)
			{
				
				var param = inDatasets[i];
				var ds = form._getDatasetObject(param.rval);  
				if (ds) 
				{
					ds.applyChange();					
				}
			}
		}

		
		var dsIds = {};
		var outDatasets = this.outputDatasets;
		if (outDatasets && outDatasets.length) 
		{
			
			var outDataCnt = outDatasets.length;
			//trace("@step 3-3 outDataCnt="+outDataCnt);
			for (var i = 0; i < outDataCnt; i++)
			{
				var param = outDatasets[i];
				
				if (dsIds[param.rval] == undefined)
				{
					//trace("@step 3-5 param.rval="+param.rval + ",param.lval="+param.lval );
				    dsIds[param.rval] = param.lval;
				}
			}
		}

		
		function find_next_dataset_loop()
		{
			if (curIdx < lineCnt)
			{
				curStr = ssvLines[curIdx];
				if (curStr.substring(0, 7) == "Dataset")
				{
				    return true;
				}
				curIdx++;
				return false;
			}
			
			return true;
		}

		
		
		while (curIdx < lineCnt)
		{
			while (true)
			{
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;				

			}
			
			if (curIdx < lineCnt)
			{
				
				var sep_pos = curStr.indexOf(":");
				if (sep_pos >= 0)
				{
					var remoteId = curStr.substring(sep_pos + 1);
					if (remoteId && remoteId.length) 
					{
						var ds = this.getResponseDataset(form);
						
						//trace("@step 10 remoteId=" + remoteId + ", ds="+ds);						
						if (ds)
						{
						    ds.rowposition = -1;
							curIdx = ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true);
						}
						else
						{
							curIdx++;
						}
						
					}
					else
					{
						curIdx++;
					}
				}
				else
				{
					curIdx++;
				}
			}
		}

		return [code, message];
	};	
    
	/*
	 * 엑셀 sheet 갯수에 해당하는 output dataset 개수 만큼
	 * 동적생성 후 반환한다.
	 */
	_pFileTransaction.getResponseDataset = function (scope) {
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var ds;
		var tempDs;
		var isUsed;
		var uidPrefix = "_ds_extResponse_"; 
		
		for(var i=0; i<size; i++)
		{		
			tempDs = datasetPool[i];
			isUsed = tempDs["_used"];
			
			if(!isUsed)
			{
				ds = tempDs;
				ds["_used"] = true;
				break;
			}			
		}
		
		
		if(!ds)
		{
			var uid = Eco.getSequenceId(scope, uidPrefix);
			ds = new Dataset(uid);
			
			ds["_used"] = true;
			datasetPool.push(ds);
		}

		return ds;			
	
	};
	
	
	_pFileTransaction.releaseResponseDataset = function (scope) {
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var tempDs;
		var isUsed;
		
		for(var i=0; i<size; i++)
		{
			tempDs = datasetPool[i];
			tempDs.clear();
			tempDs["_used"] = false;
		}	

	};
	
	
	
    _pFileTransaction._deserializeXMLFromStr = function (strRecvData)
    {
        var code = 0;
        var message = "SUCCESS";

        if (!strRecvData)
        {
            return [-1, "Stream Data is null!"];
        }

        var form = this.context;

        // parse params
        var xml_parse_pos = strRecvData.indexOf("<Dataset ");
        var headerData;
        if (xml_parse_pos > -1)
        {
            headerData = strRecvData.substring(0, xml_parse_pos);
        }
        else
        {
            headerData = strRecvData;
        }

        var head_parse_pos = 0;
        var paramsInfo = nexacro._getXMLTagData(headerData, head_parse_pos, "<Parameters>", "</Parameters>");
        if (paramsInfo)
        {
            var paramsData = paramsInfo[0];
            head_parse_pos = paramsInfo[3];

            var param_parse_pos = 0;
            var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            while (varInfo)
            {
                param_parse_pos = varInfo[3];
                var attrStr = varInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var val = varInfo[0];

                    if (id == "ErrorCode")
                    {
                        //code = parseInt(val) | -1;
                        code = parseInt(val) | 0;
                        if (isFinite(code) == false)
                        {
                            code = -1;
                        }
                    }
                    else if (id == "ErrorMsg")
                    {
                        message = val;
                    }
                    else
                    {
                        this._setParamter(id, val);
                    }
                }
                
                // for Next
                varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            }
        }

        if (code <= -1)
        {
        	return [code, message];
        }
        
        //outDatasets 처리
        var dsIds = {};
        var outDatasets = this.outputDatasets;
        if (outDatasets && outDatasets.length)
        {
            var outDataCnt = outDatasets.length;
            for (var i = 0; i < outDataCnt; i++)
            {
                var param = outDatasets[i];
                if (dsIds[param.rval] == undefined)
                    dsIds[param.rval] = param.lval;
            }
        }

        // data set parse
        if (xml_parse_pos >= -1)
        {
            var datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            while (datasetInfo)
            {
                xml_parse_pos = datasetInfo[3];
                var attrStr = datasetInfo[1];
                var remoteId = nexacro._getXMLAttributeID(attrStr);
                if (remoteId && remoteId.length)
                {
                    var localId = dsIds[remoteId];
                    var ds = form._getDatasetObject(localId);
                    if (ds)
                    {

                        ds.loadFromXMLStr(datasetInfo[0]);
                    }
                }
                
                // for Next
                datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            }
        }

		dsIds = null;
        return [code, message];
    };
    
    
    _pFileTransaction._parseVarParam = function (paramStr) 
	{
	    if (!paramStr)
	    {
	        return;
	    }

		paramStr = paramStr.replace(/^\s*|\s*$/g, '');
		if (paramStr.length == 0)
		{
			return undefined;
		}

		var list = [];
		var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*="([^"]*)"|([a-zA-Z_][a-zA-Z0-9_]*)\s*='([^']*)'|([a-zA-Z_][a-zA-Z0-9_]*)\s*=([^ ]*)/g;
		
		var splitedParams = paramStr.match(expr);
		var splitedParamCnt = splitedParams.length;
		
		for (var i = 0; i < splitedParamCnt; i++)
		{
			var param = splitedParams[i].split("=");
			var len = param.length;
			var key = param[0].trim();
			var value = param[1].trim();			
			
			for (var j = 2; j < len; j++) 
			{
				value = value + "="+ param[j].trim();
			}
				
			var type = "N";

			var len = value.length;
			if (len > 0) 
			{
			    if ((value.charAt(0) == "\"" && value.charAt(len - 1) == "\"") || (value.charAt(0) == "\'" && value.charAt(len - 1) == "\'"))
				{
					value = value.substring(1, len - 1);
				}
			}

			var paramObj =
			{
				lval: key,
				rval: value,
				saveType: type
			};

			list.push(paramObj);
		}
		return list;
	};	
	
	
    _pFileTransaction._parseDSParam = function (paramStr) 
    {
        if (!paramStr) 
        {
            return undefined;
        }

        var list = [];
        var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\:[aAuUnN])?)/g;
        var splitedParams = paramStr.match(expr);//expr.test(paramStr);
        
        // output ds가 명시되지 않은 경우 리턴
        if (!splitedParams || splitedParams.length == 0)
        {
        	return undefined;
       	}

        var splitedParamCnt = splitedParams.length;
        var listLength = 0;
        
        // TODO 정규표현식의 캡처값 사용, RegExp.exec 사용시 처음 값만 반환됨, 정규식 확인 ?
        for (var i = 0; i < splitedParamCnt; i++)
        {
            var param = splitedParams[i].split("=");
            var key = param[0].trim();
            var value = param[1].trim();            
            
            //동일한 dataset id가 들어오면 무시한다. 
            var bduplicate = false;
            for (var j = 0; j < i; j++) 
            {
                var checkparam = splitedParams[j].split("=");
                var checkkey = checkparam[0].trim();
                 if (key == checkkey)
                     bduplicate = true;
            }           
            if (bduplicate) 
            {
                //continue;
                i++;
                return false;
            }
            
            var type = "N";

            var index = value.indexOf(":");
            if (index > -1) 
            {
                type = value.substring(index + 1);
                value = value.substring(0, index);
            }

            var paramObj = 
            {
                lval: key,
                rval: value,
                saveType: type
            };
            list.push(paramObj);
        }
        return list;
    };
    
    _pFileTransaction._setParamter = function (id, val)
    {
        var form = this.context;
        //trace("_setParamter form:" + form.name);
        
        // form(application) variable 
        if (id in form) 
        {
            if (typeof (form[id]) != "object")
            {
                form[id] = val;
            }
        }
        else //	application globalvariable 
        {
            if (application._existVariable(id))
            {
                application[id] = val;
            }
        }
    };

    _pFileTransaction._getDataset = function (id)
    {
        var form = this.context;
        var outDatasets = this.outputDatasets;
        if (outDatasets && outDatasets.length)
        {
            var outDataCnt = outDatasets.length;
            for (var i = 0; i < outDataCnt; i++)
            {
                var param = outDatasets[i];
                if (param.rval == id)
                {
                    return form._getDatasetObject(param.lval);
                }
            }
        }
    };
    
    _pFileTransaction._showWaitCursor = function ()
    {
    	// zoo - 확인
    	return;
    	
        var form = this.context;
        if (form)
        {
            form._waitCursor(true, form);
        }
    };
    
    _pFileTransaction._hideWaitCursor = function ()
    {
    	// zoo - 확인
    	return;
    	
        var form = this.context;
        if (form)
        {
            form._waitCursor(false, form);
        }
    };
    
    delete _pFileTransaction;
    





	//런타임 멀티셀렉트에서 특정파일 삭제를 처리하기 위한 overriding. 2014.10.28
	//	idx_del 매개변수가 존재하고 -1 이상인 경우 0 을 시작으로 hidden_item 내 file list 에서 해당 순번의 파일만 삭제합니다.
	//	idx_del 매개변수가 존재하고 -1 인 경우 해당 hidden_item 내 file list 를 전부 삭제합니다.
	//	idx_del 매개변수가 없으면 hidden_item 내 file list 를 전부 삭제합니다. 
	//
	//	만약 file 이 1개만 존재하는 경우 idx_del 에 0 값을 주더라도 hidden_item 을 삭제하지 않습니다
    nexacro._remove_hidden_item = function(form_id, input_id, handle, idx_del)
    {
        nexacro.__removeFileUploadItem(form_id, input_id, handle, idx_del);
    };	
	
	// ==============================================================================
    //  파일처리 관련 API 지원 여부 
    // ==============================================================================
    nexacro._ExtFileUpDownloadSupport = {
        FileAPI : false,  
        XHR2 : false,
        MultipleInput : true, //2014.11.04 이후 버전
        Download : false,
        MSSave : false,
        Draggable : false,
        SelectorsAPI : false
    };	
	
	

    //==============================================================================
    // nexacro.ExtFileUploadCtrl
    //==============================================================================
    nexacro.ExtFileUploadCtrl = function (id, position, left, top, width, height, right, bottom, parent)
    {
        nexacro.FileUpload.call(this, id, position, left, top, width, height, right, bottom, parent);
        this._is_subcontrol = true;
    };
    var _pFileUploadCtrl = nexacro._createPrototype(nexacro.FileUpload, nexacro.ExtFileUploadCtrl);
    nexacro.ExtFileUploadCtrl.prototype = _pFileUploadCtrl;
    nexacro._setForControlStyleFinder(_pFileUploadCtrl);

    delete _pFileUploadCtrl;

    //==============================================================================
    // nexacro.ExtFileItem
    //==============================================================================
    nexacro.ExtFileItem = function (id, position, left, top, width, height, right, bottom, parent)
    {
        nexacro.Component.call(this, id, position, left, top, width, height, right, bottom, parent);

        this.fileitemedit = null;
        this.fileitembutton = null;
        this.selected = false;

        this.itemheight = 18;
        this.buttontext = "find";
        this.buttonsize = 18;
        this.name = "";
        this.oldvalue = "";
        this.value = "";
        this.index = 0;
        this.components = [];

        this._accessibility_role = "none";

        this._event_list =
        {
            "onfindclick": 1, "onitemclick": 1
        };
    };

    var _pFileItem = nexacro._createPrototype(nexacro.Component, nexacro.ExtFileItem);
    nexacro.ExtFileItem.prototype = _pFileItem;

    _pFileItem._type_name = "FileItem";

    //==============================================================================
    // nexacro.ExtFileItem : Style Part
    //==============================================================================
    _pFileItem.on_apply_style_itemheight = function ()
    {
        this.on_change_containerRect(this._client_width, this._client_height);
    };

    _pFileItem.on_apply_style_buttonsize = function ()
    {
        this.on_change_containerRect(this._client_width, this._client_height);
    };

    _pFileItem.on_apply_style_buttontext = function (buttontext)
    {
        if (this.fileitembutton)
        {
            this.fileitembutton.set_text(buttontext);
        }
    };

    //==============================================================================
    // nexacro.ExtFileItem : Create & Update & destroy
    //==============================================================================
    _pFileItem.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this.fileitemedit = new nexacro.ExtFileItemEditCtrl("fileitemedit", "absolute", 0, 0, 0, 0, null, null, this);
            this.fileitembutton = new nexacro.ExtFileItemButtonCtrl("fileitembutton", "absolute", 0, 0, 0, 0, null, null, this);

            this.fileitemedit.set_readonly("true");
            this.fileitemedit.style.set_align(this.parent.on_find_CurrentStyle_align());
            this.fileitembutton.set_text("find");

            this.fileitemedit.createComponent();
            this.fileitembutton.createComponent();
        }
    };

    _pFileItem.on_created_contents = function ()
    {
        var parent = this.parent;
        nexacro._append_hidden_item(parent._unique_id, this.name, this.on_fileinput_onchange, this, parent._handle, this.parent._multiselect);

        this.fileitemedit.on_created();
        this.fileitembutton.on_created();

        this.fileitemedit._setEventHandler("oneditclick", this.on_notify_fileitem_oneditclick, this);
        this.fileitembutton._setEventHandler("onclick", this.on_notify_fileitem_onfindclick, this);
        this.fileitemedit._setEventHandler("onlbuttondown", this.on_notify_fileitem_oneditlbuttondown, this);
        this.fileitembutton._setEventHandler("onlbuttondown", this.on_notify_fileitem_onfindlbuttondown, this);

        if (nexacro._enableaccessibility)
        {
            this.components.push(this.fileitemedit);
            this.components.push(this.fileitembutton);
        }

        this._setAccessibilityActiveDescendant(this.fileitembutton);

    };

    _pFileItem.on_destroy_contents = function ()
    {
        if (this.fileitemedit)
        {
            this.parent.filepathedits.delete_item(this.id); 

            this.fileitemedit.destroy();
            this.fileitemedit = null;
        }
        if (this.fileitembutton)
        {
            this.parent.filefindbuttons.delete_item(this.id); 

            this.fileitembutton.destroy();
            this.fileitembutton = null;
        }
        var parent = this.parent;
        nexacro._remove_hidden_item(parent._unique_id, this.name, parent._handle);
    };

    _pFileItem.on_change_containerRect = function (width, height)
    {
        var button_width = parseInt(this.parent.on_find_CurrentStyle_buttonsize(this._pseudo), 10);
        var height = parseInt(this.parent.on_find_CurrentStyle_itemheight(this._pseudo), 10);
        var idx = parseInt(this.index, 10);

        var edit_l = this._client_left;
        var edit_t = this._client_top;
        var edit_w = this._client_width - button_width;
        var edit_h = height;

        var button_l = edit_l + edit_w;
        var button_t = edit_t;
        var button_w = button_width;
        var button_h = edit_h;

        if (this.fileitemedit)
        {
            this.fileitemedit.move(edit_l, edit_t, edit_w, edit_h, null, null);
        }
        if (this.fileitembutton)
        {
            this.fileitembutton.move(button_l, button_t, button_w, button_h, null, null);
        }
    };

    //==============================================================================
    // nexacro.ExtFileItem : Properties
    //==============================================================================

    _pFileItem.set_value = function (v)
    {
        if (v != this.value)
        {
            this.oldvalue = this.value;
            this.value = v;
            this.on_apply_value(v);
            this.parent.set_index(this.index);
            this.parent._setText(v);
            this.parent._setValue(v);
            return true;
        }
        return false;
    };

    _pFileItem.on_apply_value = function (v)
    {
        if (this.fileitemedit)
        {
            this.fileitemedit.set_value(v);
        }
    };

    _pFileItem.set_name = function (v)
    {
        if (v != this.name)
        {
            this.name = v;
        }
    };

    _pFileItem.set_selected = function (v)
    {
        if (v != this.selected)
        {
            this.selected = v;
            this.on_apply_selected(v);
        }
    };

    _pFileItem.on_apply_selected = function (isSelected)
    {
        if (isSelected)
        {
            this._stat_change("select", "selected");
        }
        else
        {
            this._stat_change("notselect", "normal");
        }
    };

    //==============================================================================
    // nexacro.ExtFileItem : Override
    //==============================================================================
    _pFileItem.on_notify_fileitem_oneditclick = function (obj, e)
    {
        this.parent.set_index(this.index);

        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            this.onitemclick._fireEvent(this, e);
        }
        return false;
    };

    _pFileItem.on_notify_fileitem_onfindclick = function (obj, e)
    {
        this.parent.set_index(this.index);

        if (this.onfindclick && this.onfindclick._has_handlers)
        {
            this.onfindclick._fireEvent(this, e);
        }
        return false;
    };

    _pFileItem.on_notify_fileitem_oneditlbuttondown = function (obj, e)
    {
        this._accessibility_find_focus_flag(true, false);
        this.parent.set_index(this.index);
    };

    _pFileItem.on_notify_fileitem_onfindlbuttondown = function (obj, e)
    {
        this._accessibility_find_focus_flag(false, true);
        this.parent.set_index(this.index);
    };

    _pFileItem._accessibility_find_focus_flag = function (editflag, buttonflag)
    {
        if (nexacro._enableaccessibility)
        {
            this.parent._editFlag = editflag;
            this.parent._buttonFlag = buttonflag;
        }
    };


    //==============================================================================
    // nexacro.ExtFileItem : Inner Event Handler
    //==============================================================================
    _pFileItem.on_fileinput_onchange = function (value)
    {
        if (this.set_value(value))
        {
            this.parent.on_fire_onitemchanged(this, this.index, this.oldvalue, this.value);
        }
    };

    _pFileItem._isPopupFrame = function ()
    {
        return this.parent._onPopupWin;
    };
    delete _pFileItem;

    //==============================================================================
    // nexacro.ExtFileItemCtrl
    //==============================================================================
    nexacro.ExtFileItemCtrl = function (id, position, left, top, width, height, right, bottom, parent)
    {
        nexacro.ExtFileItem.call(this, id, position, left, top, width, height, right, bottom, parent);
        this._is_subcontrol = true;
    };

    var _pFileItemCtrl = nexacro._createPrototype(nexacro.ExtFileItem, nexacro.ExtFileItemCtrl);
    nexacro.ExtFileItemCtrl.prototype = _pFileItemCtrl;

    _pFileItemCtrl._type_name = "FileItemControl";

    delete _pFileItemCtrl;

    //==============================================================================
    // nexacro.ExtFileItemEditCtrl
    //==============================================================================
    nexacro.ExtFileItemEditCtrl = function (id, position, left, top, width, height, right, bottom, parent)
    {
        nexacro.EditCtrl.call(this, id, position, left, top, width, height, right, bottom, parent);        
        this._edit = null;
    };

    var _pFileItemEditCtrl = nexacro._createPrototype(nexacro.EditCtrl, nexacro.ExtFileItemEditCtrl);
    nexacro.ExtFileItemEditCtrl.prototype = _pFileItemEditCtrl;


    //==============================================================================
    // nexacro.ExtFileItemEditCtrl :  Style Part
    //==============================================================================
    _pFileItemEditCtrl.on_find_CurrentStyle_background = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("editbackground", pseudo, "background");
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_gradation = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("editgradation", pseudo, "gradation");
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_border = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("editborder", pseudo, "border");
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_bordertype = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("editbordertype", pseudo, "bordertype");
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_padding = function (pseudo)
    {
        var padding = this.parent.parent._find_pseudo_obj("editpadding", pseudo, "padding");
        return (padding) ? padding : this._defaultPadding;
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_margin = function (pseudo)
    {
        var margin = this.parent.parent._find_pseudo_obj("editmargin", pseudo, "margin");
        return (margin) ? margin : this._defaultMargin;
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_font = function (pseudo)
    {
        var font = this.parent.parent._find_pseudo_obj("editfont", pseudo, "font") || this._find_inherit_pseudo_obj("font", pseudo, "font") || nexacro.Component._default_font;
        return font;
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_color = function (pseudo)
    {
        var color = this.parent.parent._find_pseudo_obj("editcolor", pseudo, "color") || this._find_inherit_pseudo_obj("color", pseudo, "color") || nexacro.Component._default_color;
        return color;
    };

    _pFileItemEditCtrl.on_find_CurrentStyle_accessibility = function (pseudo)
    {
        return this.parent.parent.on_find_CurrentStyle_itemaccessibility(pseudo);
    };

    _pFileItemEditCtrl.on_apply_style_accessibility = function (accessibility)
    {
        var control_elem = this._control_element;
        if (control_elem && accessibility)
        {
            control_elem.setAccessibility(accessibility);
        }
    };


    delete _pFileItemEditCtrl;

    //==============================================================================
    // nexacro.ExtFileItemButtonCtrl
    //==============================================================================
    nexacro.ExtFileItemButtonCtrl = function (id, position, left, top, width, height, right, bottom, parent)
    {
        nexacro.Button.call(this, id, position, left, top, width, height, right, bottom, parent);
        this._is_subcontrol = true;
        this._button = null;

    };

    var _pFileItemButtonCtrl = nexacro._createPrototype(nexacro.Button, nexacro.ExtFileItemButtonCtrl);
    nexacro.ExtFileItemButtonCtrl.prototype = _pFileItemButtonCtrl


    //==============================================================================
    // nexacro.ExtFileItemButtonCtrl : Style Part
    //==============================================================================
    _pFileItemButtonCtrl.on_find_CurrentStyle_background = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("buttonbackground", pseudo, "background");
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_gradation = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("buttongradation", pseudo, "gradation");
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_border = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("buttonborder", pseudo, "border");
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_bordertype = function (pseudo)
    {
        return this.parent.parent._find_pseudo_obj("buttonbordertype", pseudo, "bordertype");
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_padding = function (pseudo)
    {
        var padding = this.parent.parent._find_pseudo_obj("buttonpadding", pseudo, "padding");
        return (padding) ? padding : this._defaultPadding;
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_margin = function (pseudo)
    {
        var margin = this.parent.parent._find_pseudo_obj("buttonmargin", pseudo, "margin");
        return (margin) ? margin : this._defaultMargin;
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_font = function (pseudo)
    {
        var font = this.parent.parent._find_pseudo_obj("buttonfont", pseudo, "font") || this._find_inherit_pseudo_obj("font", pseudo, "font") || nexacro.Component._default_font;
        return font;
    };

    _pFileItemButtonCtrl.on_find_CurrentStyle_color = function (pseudo)
    {
        var color = this.parent.parent._find_pseudo_obj("buttoncolor", pseudo, "color") || this._find_inherit_pseudo_obj("color", pseudo, "color") || nexacro.Component._default_color;
        return color;
    };

    //==============================================================================
    // nexacro.ExtFileItemButtonCtrl : Event Handler
    //==============================================================================
    _pFileItemButtonCtrl.on_fire_sys_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp) 
    {
        var ret = nexacro.Component.prototype.on_fire_onkeyup.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp);
        if (key_code == 13 || key_code == 32) // 13 'enter' , 32 'space'
        {
            this.click();
        }
        return ret;
    };

    delete _pFileItemButtonCtrl;	

	
	
	//==============================
	//   런타임용 FileUpload
	//==============================
	if (!nexacro.ExtFileUpload)
	{
		//==============================================================================
		// nexacro.ExtFileUpload
		//==============================================================================
		//nexacro.ExtFileUpload = function (id, parent, dummy1, dummy2, dummy3, dummy4, dummy5, dummy6, dummy7)
		nexacro.ExtFileUpload = function (id, parent)
		{
			//nexacro.Component.call(this, id, position, left, top, width, height, right, bottom, parent);
			
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}
			
			var position = "absolute";
			nexacro.Component.call(this, id,  position, 0,0,0,0, null, null, parent);

			/* User Property */
			this.scrollbars = "autoboth";
			this.filecolumn = "";
			this.innerdataset = null;
			this._innerdataset = null;
			this.text = "";
			this.index = -1;
			this.async = false;
			this.retry = 3;
			this.timeout = 30;
			this.itemheight = 18;
			this.itemcount = 1;
			this.uploadurl = "";
			this.multiselect = false;
			this._multiselect = false;
			this.support = {};
			Eco.object.copyProperties(this.support, nexacro._ExtFileUpDownloadSupport);
			
			this._autoDeleteItem = true; //Auto deleteItem property when onsuccess event fire.
			
			
			/* Inner Property */
			this._is_scrollable = true;
			this._scrollbars = 3;
			this._items = [];
			this._handle = null;
			this._last_id = -1; 
			this._editFlag = null;
			this._buttonFlag = true;
			this._set_focus_dir = -1;

			this._want_tab = false; // tab key
			this.filepathedits = new nexacro.Collection();
			this.filefindbuttons = new nexacro.Collection();

			this._onPopupWin = false;

			this._accessibility_role = "fileupload";

			this._event_list =
			{
				"onclick": 1, "ondblclick": 1,
				"onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
				"onkillfocus": 1, "onsetfocus": 1,
				"ondrag": 1, "ondrop": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1,
				"onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
				"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1, "onmove": 1, "onsize": 1,
				"onsuccess": 1, "onerror": 1,
				"onappenditem": 1, "ondeleteitem": 1, "onitemclick": 1, "onfindclick": 1, "onitemchanged": 1,
				// Touch,TouchGesture
				"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
				"onpinchstart": 1, "onpinch": 1, "onpinchend": 1,
				"onflingstart": 1, "onfling": 1, "onflingend": 1,
				"onlongpress": 1, "onslidestart": 1, "onslide": 1, "onslideend": 1
			};
		};

		var _pFileUpload = nexacro._createPrototype(nexacro.Component, nexacro.ExtFileUpload);
		nexacro.ExtFileUpload.prototype = _pFileUpload;


		_pFileUpload._type_name = "ExtFileUpload";

		_pFileUpload._defaultButtontext = nexacro._getCachedStyleObj("buttontext", "find");
		_pFileUpload._defaultButtonsize = nexacro._getCachedStyleObj("buttonsize", "18");
		_pFileUpload._defaultItemheight = nexacro._getCachedStyleObj("itemheight", "18");
		
		//엔진업데이트 20150305
		_pFileUpload._changeFiles = function(){};

		//파일 id별 파일정보를 가진객체
		_pFileUpload.fileIdMap = {};
		
		//파일 index별 파일정보를 가진객체
		_pFileUpload.fileIndexMap = {};
		
		//addEventHandler overriding(origin nexacro.EventSinkObject)
		//event명 통일을 위한 처리.
		_pFileUpload.addEventHandler = function (evt_id, func, target)
		{
			//trace("_pFileUpload >  evt_id=" + evt_id);
			
			//event명 통일을 위한 처리.
			if(evt_id == "onchange") evt_id = "onitemchanged";
			
			if (this._is_loading)
			{
				if (!this._loading_event_list)
				{
					this._loading_event_list = [];
				}
				this._loading_event_list.push({ id: evt_id, func: func, target: target });
			}

			var listener = this[evt_id];
			var idx = -1;
			if (listener)
			{
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			else if (evt_id in this._event_list)
			{
				listener = new nexacro.EventListener(evt_id);
				this[evt_id] = listener;
				if (this._created_event_list)
				{
					this._created_event_list.push(evt_id);
				}
				else
				{
					this._created_event_list = [];
					this._created_event_list.push(evt_id);
				}
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			return idx;
		};		

		_pFileUpload.setResponseZone = function (guideComp, helpMessageComp, fileListComp)
		{
			
		};
		
		
		_pFileUpload.getAddedFileLength = function(isValue) 
		{
			return this.getItemCount(isValue);
			//return this.getItemCount.call(this, isValue);
		};		
		
		
		//첨부된 파일 반환(HTML5 전용)
		_pFileUpload.getAddedFile = function(isValue) 
		{
			
		};			
		
		//파일추가
		_pFileUpload.addFiles = function ()
		{
			var comp = this;
			var index = comp.getItemCount() -1;

			//파일 선택 존재유무 체크
			if((index < 0) || (comp.hasValue(index)))
			{
				comp.appendItem();
				index = comp.getItemCount() -1;
			}
			
			var findButtons = comp.filefindbuttons;
			var id = findButtons.get_id(index);
			var item = findButtons.get_item(id);
			
			
			//파일찾기 버튼 클릭
			item.click();		
		};	
		
		/*
		 * 런타임에서 멀티선택시 개별 파일 삭제 처리를 위한 closure
		 * @param {number} itemIndex fileUpload item index
		 * @param {array} fileList 파일명이 담긴 array
		 */		
		_pFileUpload.setFileInfo = function(index, fileList) {
			var count = fileList.length;
			
			//file별 공통 정보
			var fn = (function() {

				var itemIndex = 0;
				var fileCount = 0;
				
				return {
					deleteFile: function() {
						fileCount -= 1;
						//trace("deleteFile. last fileCount="+fileCount);
					},
				
					updateItemIndex: function(deletedIndex) {
						//trace("updateItemIndex deletedIndex=" + deletedIndex);
						if(itemIndex > deletedIndex)
						{
							itemIndex -= 1;
						}
						
					},
					
					getItemIndex: function() {
						//trace("getItemIndex itemIndex="+itemIndex);
						return itemIndex;
					},
					
					getfileCount: function() {
						//trace("getfileCount fileCount="+fileCount);
						return fileCount;
					},		
					
					setConfig: function(index, count) {
						//trace("setConfig index="+index + ", count="+count);
						itemIndex = index;
						fileCount = count;
					}		
				}
			})();
		
			fn.setConfig(index, count);
			
			//var fileIdList = [];
			var seqList = [];
			for(var i=0; i<count; i++)
			{
				//file별 개별 정보
				var seqObj = this.getSingleFileInfo(i);
				var file = fileList[i];
				//var fileName = fileList[i];
				//var fileId = Eco.getUniqueId("uuid_");
				var fileName = file.name;
				var fileId   = file.id;
				
				this.fileIdMap[fileId] = {fileInfo: fn, order: seqObj};
				
				//fileIdList.push(fileId);
				seqList.push(seqObj);
			}
			
			var indexMap = this.fileIndexMap;
			var key = "key_" + index;
			
		
			var info = {fileInfo: fn, seqList: seqList};
			indexMap[key] = info; //공용함수에 존재하는  itemIndex 일괄 수정 목적.
		
			//return fileIdList;

		};
		
		
		//파일별 개별정보용 객체 생성
		_pFileUpload.getSingleFileInfo = function(seq) {
			var fn = (function() {
				var fileSeq = -1;
				
				return {
					updateFileSeq: function(deletedSeq) {
						//trace("updateFileSeq fileSeq="+ fileSeq +", deletedSeq=" + deletedSeq);
						if(fileSeq > deletedSeq)
						{
							fileSeq -= 1;
						}
					},
					
					getFileSeq: function() {
						//trace("getFileSeq");
						return fileSeq;
					},		
					
					setFileSeq: function(seq) {
						//trace("setFileSeq seq="+seq);
						fileSeq = seq;
					}		
				}
			})();
			
			fn.setFileSeq(seq);
			
			return fn;
		};

		
		/*
		 * 런타임에서 멀티선택시 지원시 개별 파일 삭제 처리
		 * @param {string} fileId file ID
		 */	
		_pFileUpload.removeFile = function(fileId) {
			//trace("\n\n		★ removeFile fileId=" + fileId);
			var data = this.fileIdMap[fileId];
			var idxMap = this.fileIndexMap;
			
			var currentInfo = data.fileInfo;
			var index = currentInfo.getItemIndex();
			
			//파일 개수 확인
			var count = currentInfo.getfileCount();
			//trace("count="+count);
			
			//단건
			if(count == 1)
			{
				this.deleteItem(index); //extFileUpload 객체 함수
				
				//나머지 객체에 대한 index 갱신 필요
				//자신의 정보 제거.
				delete idxMap["key_" +index];
				
				var nextIndex = index + 1;
				var key = "key_" + nextIndex;
				var stopCount = 0; 
				
				while (idxMap[key]) {
					var nextInfo = idxMap[key].fileInfo.updateItemIndex(index);
					
					//갱신 후 기존 key 제거
					idxMap["key_" + (nextIndex-1)] = nextInfo;
					delete idxMap[key];	
					
					key = "key_" + nextIndex++;
					stopCount++;
					if(stopCount > 20) break;
				}
				
			} 
			//다건
			else if(count > 1)
			{
				//해당파일의 seq를 찾아서 delete 시킨다.
				var order = data.order;
				var currentSeq = order.getFileSeq();
				//trace("currentSeq="+currentSeq);
				
				var fileItem = this._items[index];
				nexacro._remove_hidden_item(this._unique_id, fileItem.name, this._handle, currentSeq);
				
				//해당 파일만 삭제 후 나머지 seq에 대한 업데이트를 실시한다.
				//---   idxMap에서 seqList 추출해서 처리~
				//     var info = {fileInfo: fn, seqList: seqList};
				var seqList = idxMap["key_" +index].seqList;
				var listCount = seqList.length;
				for(var i=0; i<listCount; i++)
				{
					if(currentSeq == i) continue;
					seqList[i].updateFileSeq(currentSeq);
				}
				
				//currentSeq로 자신 제거
				seqList.splice(currentSeq, (currentSeq + 1) );  			
				
				//count 정보 처리
				currentInfo.deleteFile();
				
				//이때 하나이상의 파일이 존재하므로 deleteItem은 호출하지 않는다.
			}	
			
			data = "";
			delete this.fileIdMap[fileId];		
		};
		
		
		// 전체 삭제
		_pFileUpload.removeAll = function() {
			
			
			var itemCount = this.getItemCount();
			var i = itemCount -1;

			//trace("\n\n		★ removeAll itemCount="+itemCount);
			
			for(; i > -1 ; i--)
			{
				this.deleteItem(i);
			}
			
			this.fileIdMap = {};
			this.fileIndexMap = {};		
		
		};
		
		
		//file upload 성공시 onsuccess event에서 자동으로 등록된 file item 삭제 여부 설정.
		_pFileUpload.setAutoDeleteItem = function(value) {
			this._autoDeleteItem = value;	
		};		
		
		
		
		//==============================================================================
		// nexacro.FileUpload : Style Part
		//==============================================================================
		_pFileUpload.on_apply_custom_pseudo = function (pseudo)
		{
			var curstyle = this.currentstyle;

			/* Upload Main */
			var padding = this.on_find_CurrentStyle_padding(pseudo);
			if (padding != curstyle.padding)
			{
				curstyle.padding = padding;
				this.on_apply_style_padding(padding);
			}

			var align = this.on_find_CurrentStyle_align(pseudo);
			if (align != curstyle.align)
			{
				curstyle.align = align;
				this.on_apply_style_align(align);
			}

			var font = this.on_find_CurrentStyle_font(pseudo);
			if (font != curstyle.font)
			{
				curstyle.font = font;
				this.on_apply_style_font(font);
			}

			var color = this.on_find_CurrentStyle_color(pseudo);
			if (color != curstyle.color)
			{
				curstyle.color = color;
				this.on_apply_style_color(color);
			}

			/* FileEditControl */
			var editbackground = this.on_find_CurrentStyle_editbackground(pseudo);
			if (editbackground != curstyle.editbackground)
			{
				curstyle.editbackground = editbackground;
			}

			var editborder = this.on_find_CurrentStyle_editborder(pseudo);
			if (editborder != curstyle.editborder)
			{
				curstyle.editborder = editborder;
			}

			var editbordertype = this.on_find_CurrentStyle_editbordertype(pseudo);
			if (editbordertype != curstyle.editbordertype)
			{
				curstyle.editbordertype = editbordertype;
			}

			var editgradation = this.on_find_CurrentStyle_editgradation(pseudo);
			if (editgradation != curstyle.editgradation)
			{
				curstyle.editgradation = editgradation;
			}

			var editpadding = this.on_find_CurrentStyle_editpadding(pseudo);
			if (editpadding != curstyle.editpadding)
			{
				curstyle.editpadding = editpadding;
			}

			var editmargin = this.on_find_CurrentStyle_editmargin(pseudo);
			if (editmargin != curstyle.editmargin)
			{
				curstyle.editmargin = editmargin;
			}

			var editfont = this.on_find_CurrentStyle_editfont(pseudo);
			if (editfont != curstyle.editfont)
			{
				curstyle.editfont = editfont;
			}

			var editcolor = this.on_find_CurrentStyle_editcolor(pseudo);
			if (editcolor != curstyle.editcolor)
			{
				curstyle.editcolor = editcolor;
			}

			/* FileButtonControl */
			var buttonbackground = this.on_find_CurrentStyle_buttonbackground(pseudo);
			if (buttonbackground != curstyle.buttonbackground)
			{
				curstyle.buttonbackground = buttonbackground;
			}

			var buttonborder = this.on_find_CurrentStyle_buttonborder(pseudo);
			if (buttonborder != curstyle.buttonborder)
			{
				curstyle.buttonborder = buttonborder;
			}

			var buttonbordertype = this.on_find_CurrentStyle_buttonbordertype(pseudo);
			if (buttonbordertype != curstyle.buttonbordertype)
			{
				curstyle.buttonbordertype = buttonbordertype;
			}

			var buttongradation = this.on_find_CurrentStyle_buttongradation(pseudo);
			if (buttongradation != curstyle.buttongradation)
			{
				curstyle.buttongradation = buttongradation;
			}

			var buttonpadding = this.on_find_CurrentStyle_buttonpadding(pseudo);
			if (buttonpadding != curstyle.buttonpadding)
			{
				curstyle.buttonpadding = buttonpadding;
			}

			var buttonmargin = this.on_find_CurrentStyle_buttonmargin(pseudo);
			if (buttonmargin != curstyle.buttonmargin)
			{
				curstyle.buttonmargin = buttonmargin;
			}

			var buttonfont = this.on_find_CurrentStyle_buttonfont(pseudo);
			if (buttonfont != curstyle.buttonfont)
			{
				curstyle.buttonfont = buttonfont;
			}

			var buttoncolor = this.on_find_CurrentStyle_buttoncolor(pseudo);
			if (buttoncolor != curstyle.buttoncolor)
			{
				curstyle.buttoncolor = buttoncolor;
			}

			var buttonsize = this.on_find_CurrentStyle_buttonsize(pseudo);
			if (buttonsize != curstyle.buttonsize)
			{
				curstyle.buttonsize = buttonsize;
				this.on_apply_style_buttonsize(buttonsize);
			}

			var buttontext = this.on_find_CurrentStyle_buttontext(pseudo);
			if (buttontext != curstyle.buttontext)
			{
				curstyle.buttontext = buttontext;
				this.on_apply_style_buttontext(buttontext);
			}

			var itemheight = this.on_find_CurrentStyle_itemheight(pseudo);
			if (itemheight != curstyle.itemheight)
			{
				curstyle.itemheight = itemheight;
				this.on_apply_style_itemheight(itemheight);
			}
			var itemaccessibility = this.on_find_CurrentStyle_itemaccessibility(pseudo);
			if (itemaccessibility != curstyle.itemaccessibility)
			{
				curstyle.itemaccessibility = itemaccessibility;
				this.on_apply_style_itemaccessibility(itemaccessibility);
			}
		};

		_pFileUpload.on_create_custom_style = function ()
		{
			return new nexacro.FileUpload_Style(this);
		};

		_pFileUpload.on_create_custom_currentStyles = function ()
		{
			return new nexacro.FileUpload_CurrentStyle();
		};

		/* find currentStyle */
		_pFileUpload.on_find_CurrentStyle_editbackground = function (pseudo)
		{
			var editbackground = this._find_pseudo_obj("editbackground", pseudo, "background");
			return editbackground;
		};

		_pFileUpload.on_find_CurrentStyle_editborder = function (pseudo)
		{
			var editborder = this._find_pseudo_obj("editborder", pseudo, "border");
			return editborder;
		};

		_pFileUpload.on_find_CurrentStyle_editbordertype = function (pseudo)
		{
			var editbordertype = this._find_pseudo_obj("editbordertype", pseudo, "bordertype");
			return editbordertype;
		};

		_pFileUpload.on_find_CurrentStyle_editgradation = function (pseudo)
		{
			var editgradation = this._find_pseudo_obj("editgradation", pseudo, "gradation");
			return editgradation;
		};

		_pFileUpload.on_find_CurrentStyle_editpadding = function (pseudo)
		{
			var editpadding = this._find_pseudo_obj("editpadding", pseudo, "padding");
			return editpadding;
		};

		_pFileUpload.on_find_CurrentStyle_editmargin = function (pseudo)
		{
			var editmargin = this._find_pseudo_obj("editmargin", pseudo, "margin");
			return editmargin;
		};

		_pFileUpload.on_find_CurrentStyle_editfont = function (pseudo)
		{
			var editfont = this._find_pseudo_obj("editfont", pseudo, "font");
			return editfont;
		};

		_pFileUpload.on_find_CurrentStyle_editcolor = function (pseudo)
		{
			var editcolor = this._find_pseudo_obj("editcolor", pseudo, "color");
			return editcolor;
		};

		_pFileUpload.on_find_CurrentStyle_buttonbackground = function (pseudo)
		{
			var buttonbackground = this._find_pseudo_obj("buttonbackground", pseudo, "background");
			return buttonbackground;
		};

		_pFileUpload.on_find_CurrentStyle_buttonborder = function (pseudo)
		{
			var buttonborder = this._find_pseudo_obj("buttonborder", pseudo, "border");
			return buttonborder;
		};

		_pFileUpload.on_find_CurrentStyle_buttonbordertype = function (pseudo)
		{
			var buttonbordertype = this._find_pseudo_obj("buttonbordertype", pseudo, "bordertype");
			return buttonbordertype;
		};

		_pFileUpload.on_find_CurrentStyle_buttongradation = function (pseudo)
		{
			var buttongradation = this._find_pseudo_obj("buttongradation", pseudo, "gradation");
			return buttongradation;
		};

		_pFileUpload.on_find_CurrentStyle_buttonpadding = function (pseudo)
		{
			var buttonpadding = this._find_pseudo_obj("buttonpadding", pseudo, "padding");
			return buttonpadding;
		};

		_pFileUpload.on_find_CurrentStyle_buttonmargin = function (pseudo)
		{
			var buttonmargin = this._find_pseudo_obj("buttonmargin", pseudo, "margin");
			return buttonmargin;
		};

		_pFileUpload.on_find_CurrentStyle_buttonfont = function (pseudo)
		{
			var buttonfont = this._find_pseudo_obj("buttonfont", pseudo, "font");
			return buttonfont;
		};

		_pFileUpload.on_find_CurrentStyle_buttoncolor = function (pseudo)
		{
			var buttoncolor = this._find_pseudo_obj("buttoncolor", pseudo, "color");
			return buttoncolor;
		};

		_pFileUpload.on_find_CurrentStyle_buttonsize = function (pseudo)
		{
			var buttonsize = this._find_pseudo_obj("buttonsize", pseudo);
			return buttonsize ? buttonsize : this._defaultButtonsize;
		};

		_pFileUpload.on_find_CurrentStyle_buttontext = function (pseudo)
		{
			var buttontext = this._find_pseudo_obj("buttontext", pseudo);
			return buttontext ? buttontext : this._defaultButtontext;
		};
		_pFileUpload.on_find_CurrentStyle_itemheight = function (pseudo)
		{
			var itemheight = this._find_pseudo_obj("itemheight", pseudo);
			return itemheight ? itemheight : this._defaultItemheight;
		};
		_pFileUpload.on_find_CurrentStyle_itemaccessibility = function (pseudo)
		{
			return this._find_pseudo_obj("itemaccessibility", pseudo, "accessibility") || nexacro.Component._default_accessibility;
		};

		/* update style */
		_pFileUpload.on_update_style_editbackground = function ()
		{
			var editbackground = this.currentstyle.editbackground = this.on_find_CurrentStyle_editbackground(this._pseudo);
			this.on_apply_style_editbackground(editbackground);
		};

		_pFileUpload.on_update_style_editborder = function ()
		{
			var editborder = this.currentstyle.editborder = this.on_find_CurrentStyle_editborder(this._pseudo);
			this.on_apply_style_editborder(editborder);
		};

		_pFileUpload.on_update_style_editbordertype = function ()
		{
			var editbordertype = this.currentstyle.editbordertype = this.on_find_CurrentStyle_editbordertype(this._pseudo);
			this.on_apply_style_editbordertype(editbordertype);
		};

		_pFileUpload.on_update_style_editgradation = function ()
		{
			var editgradation = this.currentstyle.editgradation = this.on_find_CurrentStyle_editgradation(this._pseudo);
			this.on_apply_style_editgradation(editgradation);
		};

		_pFileUpload.on_update_style_editpadding = function ()
		{
			var editpadding = this.currentstyle.editpadding = this.on_find_CurrentStyle_editpadding(this._pseudo);
			this.on_apply_style_editpadding(editpadding);
		};

		_pFileUpload.on_update_style_editmargin = function ()
		{
			var editmargin = this.currentstyle.editmargin = this.on_find_CurrentStyle_editmargin(this._pseudo);
			this.on_apply_style_editmargin(editmargin);
		};

		_pFileUpload.on_update_style_editfont = function ()
		{
			var editfont = this.currentstyle.editfont = this.on_find_CurrentStyle_editfont(this._pseudo);
			this.on_apply_style_editfont(editfont);
		};

		_pFileUpload.on_update_style_editcolor = function ()
		{
			var editcolor = this.currentstyle.editcolor = this.on_find_CurrentStyle_editcolor(this._pseudo);
			this.on_apply_style_editcolor(editcolor);
		};

		_pFileUpload.on_update_style_buttonbackground = function ()
		{
			var buttonbackground = this.currentstyle.buttonbackground = this.on_find_CurrentStyle_buttonbackground(this._pseudo);
			this.on_apply_style_buttonbackground(buttonbackground);
		};

		_pFileUpload.on_update_style_buttonborder = function ()
		{
			var buttonborder = this.currentstyle.buttonborder = this.on_find_CurrentStyle_buttonborder(this._pseudo);
			this.on_apply_style_buttonborder(buttonborder);
		};

		_pFileUpload.on_update_style_buttonbordertype = function ()
		{
			var buttonbordertype = this.currentstyle.buttonbordertype = this.on_find_CurrentStyle_buttonbordertype(this._pseudo);
			this.on_apply_style_buttonbordertype(buttonbordertype);
		};

		_pFileUpload.on_update_style_buttongradation = function ()
		{
			var buttongradation = this.currentstyle.buttongradation = this.on_find_CurrentStyle_buttongradation(this._pseudo);
			this.on_apply_style_buttongradation(buttongradation);
		};

		_pFileUpload.on_update_style_buttonpadding = function ()
		{
			var buttonpadding = this.currentstyle.buttonpadding = this.on_find_CurrentStyle_buttonpadding(this._pseudo);
			this.on_apply_style_buttonpadding(buttonpadding);
		};

		_pFileUpload.on_update_style_buttonmargin = function ()
		{
			var buttonmargin = this.currentstyle.buttonmargin = this.on_find_CurrentStyle_buttonmargin(this._pseudo);
			this.on_apply_style_buttonmargin(buttonmargin);
		};

		_pFileUpload.on_update_style_buttonfont = function ()
		{
			var buttonfont = this.currentstyle.buttonfont = this.on_find_CurrentStyle_buttonfont(this._pseudo);
			this.on_apply_style_buttonfont(buttonfont);
		};

		_pFileUpload.on_update_style_buttoncolor = function ()
		{
			var buttoncolor = this.currentstyle.buttoncolor = this.on_find_CurrentStyle_buttoncolor(this._pseudo);
			this.on_apply_style_buttoncolor(buttoncolor);
		};

		_pFileUpload.on_update_style_buttonsize = function ()
		{
			var buttonsize = this.currentstyle.buttonsize = this.on_find_CurrentStyle_buttonsize(this._pseudo);
			this.on_apply_style_buttonsize(buttonsize);
		};

		_pFileUpload.on_update_style_buttontext = function ()
		{
			var buttontext = this.currentstyle.buttontext = this.on_find_CurrentStyle_buttontext(this._pseudo);
			this.on_apply_style_buttontext(buttontext);
		};

		_pFileUpload.on_update_style_itemheight = function ()
		{
			var itemheight = this.currentstyle.itemheight = this.on_find_CurrentStyle_itemheight(this._pseudo);
			this.on_apply_style_itemheight(itemheight);
		};

		_pFileUpload.on_update_style_itemaccessibility = function ()
		{
			var itemaccessibility = this.currentstyle.itemaccessibility = this.on_find_CurrentStyle_itemaccessibility(this._pseudo);
			this.on_apply_style_itemaccessibility(itemaccessibility);
		};

		/* apply style */
		_pFileUpload.on_apply_style_padding = function (padding)
		{
			var items = this._items;
			var item_len = items.length;
			var item_width = this._client_width - padding.right;
			var item_height = this.on_find_CurrentStyle_itemheight(this._pseudo);

			for (var i = 0; i < item_len; i++)
			{
				items[i].move(padding.left, (itemheight * i + padding.top), item_width, (item_height * (i + 1) + padding.top), null, null);
			}
		};

		_pFileUpload.on_apply_style_cursor = function (cursor)
		{
			var control_elem = this._control_element;
			var items = this._items;
			var item_len = items.length;
			if (control_elem)
			{
				control_elem.setElementCursor(cursor);
				for (var i = 0; i < item_len; i++)
				{
					items[i].on_apply_style_cursor(cursor);
				}
			}
		};

		_pFileUpload.on_apply_style_editbackground = function (editbackground)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_background(editbackground);
				}
			}
		};

		_pFileUpload.on_apply_style_editborder = function (editborder)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_border(editborder);
				}
			}
		};

		_pFileUpload.on_apply_style_editbordertype = function (editbordertype)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_bordertype(editbordertype);
				}
			}
		};

		_pFileUpload.on_apply_style_editgradation = function (editgradation)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_gradation(editgradation);
				}
			}
		};

		_pFileUpload.on_apply_style_editpadding = function (editpadding)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_update_style_padding(editpadding);
				}
			}
		};

		_pFileUpload.on_apply_style_editmargin = function (editmargin)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_margin(editmargin);
				}
			}
		};

		_pFileUpload.on_apply_style_editfont = function (editfont)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_font(editfont);
				}
			}
		};

		_pFileUpload.on_apply_style_editcolor = function (editcolor)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.on_apply_style_color(editcolor);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonbackground = function (buttonbackground)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_background(buttonbackground);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonborder = function (buttonborder)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_border(buttonborder);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonbordertype = function (buttonbordertype)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_bordertype(buttonbordertype);
				}
			}
		};

		_pFileUpload.on_apply_style_buttongradation = function (buttongradation)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_gradation(buttongradation);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonpadding = function (buttonpadding)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_update_style_padding(buttonpadding);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonmargin = function (buttonmargin)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_margin(buttonmargin);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonfont = function (buttonfont)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_font(buttonfont);
				}
			}
		};

		_pFileUpload.on_apply_style_buttoncolor = function (buttoncolor)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitembutton)
				{
					items[i].fileitembutton.on_apply_style_color(buttoncolor);
				}
			}
		};

		_pFileUpload.on_apply_style_buttonsize = function (buttonsize)
		{
			this.on_change_containerRect();
		};

		_pFileUpload.on_apply_style_buttontext = function (buttontext)
		{
			if (buttontext == null)
			{
				buttontext = this._defaultButtontext;
			}

			var items = this._items;
			var item_len = items.length;
			if (items == null)
			{
				return;
			}
			for (var i = 0; i < item_len; i++)
			{
				items[i].on_apply_style_buttontext(buttontext);
			}
		};

		_pFileUpload.on_apply_style_itemheight = function (itemheight)
		{
			this.on_change_containerRect();
			this.resetScroll();
		};

		_pFileUpload.on_apply_style_align = function (align)
		{
			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				if (items[i].fileitemedit)
				{
					items[i].fileitemedit.style.set_align(align);
				}
			}
		};

		_pFileUpload.on_apply_style_itemaccessibility = function (itemaccessibility)
		{
			var iLen = this._items.length;
			var item = null;

			if (itemaccessibility)
			{
				for (var i = 0 ; i < iLen; i++)
				{
					item = this._getItem(i);
					item.fileitemedit.style.set_accessibility(itemaccessibility._value)
				}
			}
		};

		
		//==============================================================================
		// nexacro.FileUpload : Create & Update & destroy
		//==============================================================================
		_pFileUpload.on_create_contents = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				var items = this._items;
				var itemcount = this.itemcount;
				//trace("### on_create_contents  set itemcount=" + itemcount);
				for (var i = 0; i < itemcount; i++)
				{
					var item = this._createFileItem(i, 0, 0, 0, 0);
					this.filepathedits.add_item(item.id, item.fileitemedit); 
					this.filefindbuttons.add_item(item.id, item.fileitembutton);
					items[i] = item;
				}
			}
		};

		_pFileUpload.on_created_contents = function ()
		{
			//trace("### 끝  on_created_contents");
			var ranid = new Date().valueOf().toString();
			nexacro._create_hidden_frame(this._unique_id, ranid, this.on_load, this);

			this.on_apply_index();
			this.on_apply_innerdataset();
			this.on_apply_filecolumn();
			this.on_apply_prop_enable(this._isEnable());
			if (nexacro._enableaccessibility)
			{
				this.on_apply_style_itemaccessibility(this.currentstyle.itemaccessibility = this.on_find_CurrentStyle_itemaccessibility(this._pseudo));
			}

			var items = this._items;
			var itemcount = this.itemcount;
			for (var i = 0; i < itemcount; i++)
			{
				items[i].on_created();
				
				//숨기기
				items[i].set_visible(false);
				
				items[i]._setEventHandler("onfindclick", this.on_notify_onfindclick, this);
				items[i]._setEventHandler("onitemclick", this.on_notify_onitemclick, this);            

				if (nexacro._enableaccessibility)
				{
					items[i]._setAccessibilityInfoIndex(i + 1);
					items[i]._setAccessibilityInfoCount(itemcount);
				}
			};

		};

		_pFileUpload.on_destroy_contents = function ()
		{
			var name = this.name;
			var items = this._items;
			var item_len = items.length;
			for (var i = 0; i < item_len; i++)
			{
				items[i].destroy();
			}
			this._items = [];

			nexacro._destroy_hidden_frame(this._unique_id, this, this._handle);
		};

		_pFileUpload.on_change_containerRect = function (width, height)
		{
			var items = this._items;
			var item_len = items.length;

			if (item_len <= 0)
			{
				return;
			}

			var pseudo = this._pseudo;
			var client_width = this._client_width;
			var client_left = this._client_left;
			var client_top = this._client_top;
			var item_left, item_top;
			var itemheight = parseInt(this.on_find_CurrentStyle_itemheight(pseudo), 10);
			var buttonsize = parseInt(this.on_find_CurrentStyle_buttonsize(pseudo), 10);
			var padding = this.on_find_CurrentStyle_padding(pseudo);

			var draw_width = buttonsize + padding.left + padding.right;

			var item_width = client_width;

			if (draw_width > client_width)
			{
				item_left = client_left - padding.left;
			}
			else
			{
				item_left = client_left - padding.left;
			}

			for (var i = 0; i < item_len; i++)
			{
				item_top = itemheight * i;

				items[i].move(item_left, item_top, item_width, itemheight, null, null);
				items[i].on_apply_style_itemheight(itemheight);
				items[i].on_apply_style_buttonsize(buttonsize);
			}
		};

		//==============================================================================
		// nexacro.FileUpload : Logical Part
		//==============================================================================
		_pFileUpload.resetScroll = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				this._onRecalcScrollSize();
				this._updateClientSize(control_elem);
			}
		};

		_pFileUpload._onRecalcScrollSize = function (fromComp)
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				var pseudo = this._pseudo;

				var vscroll = this.vscrollbar;
				var hscroll = this.hscrollbar;

				var height = this.on_find_CurrentStyle_itemheight(pseudo);
				var border = this.on_find_CurrentStyle_border(pseudo);
				var padding = this.on_find_CurrentStyle_padding(pseudo);

				var scrollHeight = this.itemcount * height;
				var scrollWidth = this._client_width;
				if (scrollHeight > this._client_height)
				{
					if (vscroll)
					{
						scrollWidth -= vscroll._adjust_width;
					}
					else
					{
						scrollWidth -= nexacro.Component.SCROLLBAR_DEFAULT_SIZE;
					}
				}

				control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);
			}
		};

		_pFileUpload.on_hscroll = function (obj, e)
		{
			if (this.onhscroll && this.onhscroll._has_handlers)
			{
				e.fromobject = this;
				this.onhscroll._fireEvent(this, e);
			}
			var control_elem = this._control_element;
			if (control_elem)
			{
				control_elem.setElementHScrollPos(e.pos);
			}
			return true;
		};

		_pFileUpload.on_vscroll = function (obj, e)
		{
			if (this.onvscroll && this.onvscroll._has_handlers)
			{
				e.fromobject = this;
				this.onvscroll._fireEvent(this, e);
			}
			var control_elem = this._control_element;
			if (control_elem)
			{
				control_elem.setElementVScrollPos(e.pos);
			}
			return true;
		};

		//==============================================================================
		// nexacro.FileUpload : Properties
		//==============================================================================
		_pFileUpload.set_multiselect = function (v)
		{
			if (v != this.multiselect)
			{
				this.multiselect = v;
				v = nexacro._toBoolean(v);
				if (v != this._multiselect)
				{
					this._multiselect = v;
					this.on_apply_multiselect(v);
				}
			}
		};
		

		if (nexacro.Browser == "IE" && nexacro.BrowserVersion < 10) // kindlion confirm
		{
			_pFileUpload.on_apply_multiselect = nexacro._emptyFn;
		}
		else
		{
			_pFileUpload.on_apply_multiselect = function ()
			{
				var control_elem = this.getElement();
				if (control_elem)
				{
					var items = this._items;
					var item_len = items.length;
					var multi_select = this._multiselect;
					var comp_name = this._unique_id;
					var handle = this._handle;

					for (var i = 0 ; i < item_len; i++)
					{
						nexacro._setMultipleFile(comp_name, items[i].name, multi_select, items[i]);
					}
				}
			};
		}
		
		_pFileUpload.set_uploadurl = function (v)
		{
			if (v != this.uploadurl)
			{
				this.uploadurl = v;
			}
		};

		_pFileUpload.set_itemcount = function (v)
		{
			trace(" set_itemcount >>> " + set_itemcount);
			var val = parseInt(v) | 0;

			if (val != this.itemcount)
			{
				this._old_itemcount = this.itemcount;
				this.itemcount = val;
				this.on_apply_itemcount();
			}
		};

		_pFileUpload.on_apply_itemcount = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				var pseudo = this._pseudo;
				var old_itemcnt = this._old_itemcount;
				var itemcnt = this.itemcount;
				var items = this._items;
				var item_len = items.length;
				var client_left = this._client_left;
				var client_top = this._client_top;
				var client_width = this._client_width;
				var itemheight = parseInt(this.on_find_CurrentStyle_itemheight(pseudo), 10);
				var buttonsize = parseInt(this.on_find_CurrentStyle_buttonsize(pseudo), 10);
				var buttontext = this.on_find_CurrentStyle_buttontext(pseudo);

				while (item_len && old_itemcnt > itemcnt)
				{
					old_itemcnt--;
					items.pop().destroy();
				}

				for (var i = item_len; i < itemcnt; i++)
				{
					var item_left = client_left;
					var item_top = client_top + (itemheight * i);
					var item_width = client_width;

					var item = this._createFileItem(i, item_left, item_top, item_width, itemheight);
					this.filepathedits.add_item(item.id, item.fileitemedit); 
					this.filefindbuttons.add_item(item.id, item.fileitembutton);
					this._items[i] = item;
				}
				this.on_change_containerRect();
				this.on_apply_style_buttontext(buttontext);
				this.resetScroll();
			}
		};

		_pFileUpload.set_itemheight = function (v)
		{
			var val = parseInt(v) | 0;

			if (val != this.itemheight)
			{
				this.itemheight = val;
				this.on_apply_itemheight(val);
			}
		};

		_pFileUpload.on_apply_itemheight = function (itemheight)
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				this.style.set_itemheight(itemheight);
			}
		};

		_pFileUpload.set_timeout = function (v)
		{
			if (v != this.timeout)
			{
				this.timeout = v;
			}
		};

		_pFileUpload.set_retry = function (v)
		{
			if (v != this.retry)
			{
				this.retry = v;
			}
		};

		_pFileUpload.set_async = function (v)
		{
			if (v != this.async)
			{
				this.async = v;
			}
		};

		_pFileUpload.set_index = function (v)
		{
			if (v != this.index)
			{
				this.index = v;
				this.on_apply_index(v);
				this._setAccessibilityStatSelected(v);
			};
		};

		_pFileUpload.on_apply_index = function (index)
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				var item = this._items[index];
				if (item)
				{
					if (this._editFlag)
						item.fileitemedit.setFocus(false);

					if (this._buttonFlag)
						item.fileitembutton.setFocus(false);

					var last_comp = item._getLastFocused();
					this.value = item.value;
				}
			}
		};

		_pFileUpload.set_text = function (v)
		{
			/* Readonly */
		};

		_pFileUpload._setText = function (v)
		{
			if (v != this.text)
			{
				this.text = v;
			}
			return this.text;
		};

		_pFileUpload.on_apply_text = function (text)
		{
		};

		_pFileUpload.set_value = function (v)
		{
			/* ReadOnly */
		};

		_pFileUpload._setValue = function (v)
		{
			if (v != this.value)
			{
				this.value = v;
			}
		}

		_pFileUpload.on_apply_value = function (value)
		{
		};

		_pFileUpload.setInnerDataset = function (obj)
		{
			if (obj instanceof nexacro.Dataset)
			{
				if (!obj)
				{
					this._innerdataset = null;
					this.innerdataset = "";
				}
				else
				{
					this._innerdataset = obj;
					this.innerdataset = obj.id;
				}
				this.on_apply_innerdataset();
			}
		};

		_pFileUpload.getInnerDataset = function ()
		{
			return this._innerdataset;
		};

		_pFileUpload.set_innerdataset = function (str)
		{
			if (typeof str != "string")
			{
				this.setInnerDataset(str);
				return;
			}
			if (str != this.innerdataset)
			{
				if (!str)
				{
					this._innerdataset = null;
					this.innerdataset = "";
				}
				else
				{
					str = str.replace("@", "");
					this._innerdataset = this._findDataset(str);
					this.innerdataset = str;
				}
				this.on_apply_innerdataset();
			}
			else if (this.innerdataset && !this._innerdataset)
			{
				this._setInnerDatasetStr(this.innerdataset);
				this.on_apply_innerdataset();
			}
			return this.innerdataset;
		};

		_pFileUpload.on_apply_innerdataset = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				this.on_apply_filecolumn();
			}
		};

		_pFileUpload.set_filecolumn = function (v)
		{
			if (v != this.filecolumn)
			{
				this.filecolumn = v;
				this.on_apply_filecolumn(v);
			}
		};

		_pFileUpload.on_apply_filecolumn = function (filecolumn)
		{
			var control_elem = this.getElement();
			if (control_elem && this._innerdataset)
			{
				var items = this._items;
				for (var i = 0; i < items.length; i++)
				{
					var filecolumn = this._innerdataset.getColumn(i, filecolumn);
					if (filecolumn)
					{
						items[i].set_value(filecolumn);
						filecolumn = 0;
					}
				}
			}
		};

		//==============================================================================
		// nexacro.FileUpload : method
		//==============================================================================
		/**
		 * upload files
		 * @param {=string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 *                 ※ Output Dataset 정보는 RUNTIME & HTML5 모두 extUpload_onsuccess 이벤트의 e.datasets 배열객체로 수신한다.
		 * @param {string} transferType 전송유형.(all: 대상파일을 한번에 전송(defalut), each: 개별 전송)
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부
		 */ 		
		//_pFileUpload.upload = function (v)
		_pFileUpload.upload = function (v, inDatasetsParam, outDatasetsParam, datatype)
		{
			var ret = false;
			var uploadurl;

			if (v == undefined)
			{
				if (this.uploadurl) 
				{
					uploadurl = application._getServiceLocation(this.uploadurl);
				}
			}
			else
			{
				uploadurl = application._getServiceLocation(v);
			}

			if (uploadurl)
			{
				var items = this._items;
				var len = items.length;
				for (var i = 0; i < len ; i++)
				{
					//trace("upload > " + i + "번 value=" + items[i].value);
					if (items[i].value)
					{
						ret = true;
						this.loadItem = new nexacro.ExtFileTransaction(uploadurl, "upload", this.parent, inDatasetsParam, outDatasetsParam, datatype);
						this.loadItem["parent"] = this;
						
						nexacro._submit(this._unique_id, uploadurl, this._handle);
						break;
					}
				}
			}
			return ret;
		};

		_pFileUpload.appendItem = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				var pseudo = this._pseudo;
				var itemcount = this.itemcount;
				var client_left = this._client_left;
				var client_top = this._client_top;
				var client_width = this._client_width;
				var itemheight = parseInt(this.on_find_CurrentStyle_itemheight(pseudo), 10);
				var buttonsize = parseInt(this.on_find_CurrentStyle_buttonsize(pseudo), 10);
				var buttontext = this.on_find_CurrentStyle_buttontext(pseudo);
				var padding = this.on_find_CurrentStyle_padding(pseudo);

				var item_left = client_left + padding.left;
				var item_top = client_top + (itemheight * itemcount) + padding.top;
				var item_width = client_width - padding.right;

				var id = itemcount;
				var item = this._createFileItem(id, item_left, item_top, item_width, itemheight);
				this.filepathedits.add_item(item.id, item.fileitemedit); 
				this.filefindbuttons.add_item(item.id, item.fileitembutton);

				this._items[id] = item;
				this.itemcount++;
				if (nexacro._enableaccessibility)
				{
					item._setAccessibilityInfoIndex(id);
					item._setAccessibilityInfoCount(id + 1);
				}

				this.on_change_containerRect();
				this.on_apply_style_buttontext(buttontext);
				this.resetScroll();

				this.on_fire_onappenditem(this, id);
			}
		};

		_pFileUpload.deleteItem = function (idx)
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				idx = parseInt(idx, 10);
				var items = this._items;

				if (this.itemcount <= idx)
				{
					return;
				}

				var iCount = this.itemcount;
				var iCnt = iCount - 1;
				for (var i = idx + 1; i < iCount; i++)
				{
					items[i].index--;

					if (nexacro._enableaccessibility)
					{
						items[i]._setAccessibilityInfoIndex(i);
						items[i]._setAccessibilityInfoCount(iCnt);
					}
				}

				items[idx].destroy();
				items.splice(idx, 1);

				this.itemcount--;

				this.on_change_containerRect();
				this.on_update_fileitem(idx);
				this.resetScroll();
				this.on_fire_ondeleteitem(this, idx);
			}
		};

		_pFileUpload.on_update_fileitem = function (idx)
		{
			idx = parseInt(idx, 10);
			var pseudo = this._pseudo;
			var client_width = this._client_width;
			var client_left = this._client_left;
			var client_top = this._client_top;

			var items = this._items;
			var item_len = items.length;
			var item_left, item_top;

			var itemheight = parseInt(this.on_find_CurrentStyle_itemheight(pseudo), 10);
			var buttonsize = parseInt(this.on_find_CurrentStyle_buttonsize(pseudo), 10);
			var padding = this.on_find_CurrentStyle_padding(pseudo);

			var draw_width = buttonsize + padding.left + padding.right
			var item_width = client_width - padding.right
			if (draw_width > client_width)
			{
				//item_right 변수선언 없음. 주석처리.
				//item_left = item_right - buttonsize;
			}
			else
			{
				item_left = client_left;
			}

			while (idx < item_len)
			{
				item_top = client_top + (itemheight * idx) + padding.top;
				items[idx].move(item_left, item_top, item_width, itemheight, null, null);

				idx++;
			}
		};

		_pFileUpload.getItemCount = function (isValue)
		{
			var elem = this.getElement();
			if (elem)
			{
				isValue = nexacro._toBoolean(isValue);

				var cnt = 0;
				var idx = 0;
				var itemval_check;
				var items = this._items;
				var item_len = items.length;

				while (idx < item_len)
				{
					if (isValue == true)
					{
						if (items[idx].value)
						{
							cnt++;
						}
					}
					else
					{
						return item_len;
					}
					++idx;
				}
				return cnt;
			}
		};

		_pFileUpload.getItemIndex = function (obj)
		{
			var elem = this.getElement();
			if (elem)
			{
				if (typeof obj == "object")
				{
					var idx = 0;
					var items = this._items;
					while (idx < items.length)
					{
						if (obj == items[idx].fileitembutton)
						{
							return idx;
						}
						if (obj == items[idx].fileitemedit)
						{
							return idx;
						}
						++idx;
					}
					return -1;
				}
			}
		};

		_pFileUpload._getItem = function (index)
		{
			if (index >= 0 && this._items.length > 0)
			{
				return this._items[index];
			}

			return null;
		};

		_pFileUpload.hasValue = function (nIndex)
		{
			var elem = this.getElement();
			if (elem)
			{
				var idx = 0;
				var items = this._items;
				if (nIndex == -1)
				{
					while (idx < items.length)
					{
						if (items[idx].value)
						{
							++cnt;
						}
						++idx;
					}
					if (cnt == items.length)
					{
						return true;
					}
					return false;
				}

				if (nIndex < items.length && items[nIndex].value)
				{
					return true;
				}
				return false;
			}
		};

		_pFileUpload.getValue = function (idx)
		{
			var elem = this.getElement();
			if (elem)
			{
				var items = this._items;
				if (items && idx >= 0 && idx < items.length)
				{
					return items[idx].value;
				}
				return "";
			}
		};

		//==============================================================================
		// nexacro.FileUpload : Override
		//==============================================================================
		_pFileUpload.on_notify_onfindclick = function (obj, e)
		{
			var bHandled = false;
			var index = nexacro._indexOf(this._items, obj);

			if (this.visible && this._isEnable() && this.enableevent)
			{
				bHandled = this.on_fire_onfindclick(obj, index);

				if (bHandled)
				{
					try
					{
						nexacro._findclick(this._unique_id, obj.name, obj, this._handle);
					}
					catch (e)
					{
						var errorobj = nexacro.MakeError("ObjectError", this, "comp_incorrect_file");
						this.on_fire_onerror(this, errorobj.name, errorobj.message, obj, null, null, null, index);
					}

				}
			}
			return bHandled;
		};

		_pFileUpload.on_notify_onitemclick = function (obj, e)
		{
			if (this.visible && this._isEnable() && this.enableevent)
			{
				this.on_fire_onitemclick(obj, obj.index);
			}
		};

		_pFileUpload.on_getAccessibilityAdditionalLabel = function ()
		{
			var count = 0;
			var items = this._items;
			if (items)
				count = items.length;
			return (+this.index)+1 + " " + count;
		};


		//==============================================================================
		// nexacro.FileUpload : Event Handler
		//==============================================================================
		_pFileUpload.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index)
		{
			if (this.onerror && this.onerror._has_handlers)
			{
				//var evt = new nexacro.FileUploadErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index);
				var evt = new nexacro.ExtFileErrorEventInfo(obj, "onerror");
				evt["errortype"] = errortype;
				evt["errormsg"] = errormsg;
				evt["errorobj"] = errorobj;
				evt["statuscode"] = statuscode;
				
				evt["requesturi"] = requesturi;
				evt["locationuri"] = locationuri;
				evt["index"] = index;
				
				return this.onerror._fireEvent(this, evt);
			}
			return true;
		};

		_pFileUpload.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
		{
			if (this.onlbuttondown && this.onlbuttondown._has_handlers)
			{
				var evt = new nexacro.FileUploadMouseEventInfo(this, "onlbuttondown", button, alt_key, ctrl_key, shift_key, this.index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
				return this.onlbuttondown._fireEvent(this, evt);
			}
			return false;
		};

		_pFileUpload.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem)
		{
			if (this.onlbuttonup && this.onlbuttonup._has_handlers)
			{
				var evt = new nexacro.FileUploadMouseEventInfo(this, "onlbuttonup", button, alt_key, ctrl_key, shift_key, this.index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
				return this.onlbuttonup._fireUserEvent(this, evt);
			}
			return false;
		};

		_pFileUpload.on_fire_onfindclick = function (obj, index)
		{
			var bCheck = true;

			if (this.onfindclick && this.onfindclick._has_handlers)
			{
				var evt = new nexacro.FileUploadItemEventInfo(this, "onfindclick", index);
				bCheck = this.onfindclick._fireCheckEvent(this, evt);
			}

			return bCheck;
		};

		_pFileUpload.on_fire_onitemclick = function (obj, index)
		{
			if (this.onitemclick && this.onitemclick._has_handlers)
			{
				var evt = new nexacro.FileUploadItemEventInfo(this, "onitemclick", index);
				this.onitemclick._fireEvent(this, evt);
			}
		};

		_pFileUpload.on_fire_onappenditem = function (obj, index)
		{
			trace("on_fire_onappenditem 호출 1 this.onappenditem="+this.onappenditem);
			if (this.onappenditem && this.onappenditem._has_handlers)
			{
				var evt = new nexacro.FileUploadItemEventInfo(obj, "onappenditem", index);
				
				trace("on_fire_onappenditem 호출 2");
				
				this.onappenditem._fireEvent(this, evt);
			}
		};

		_pFileUpload.on_fire_ondeleteitem = function (obj, index)
		{
			if (this.ondeleteitem && this.ondeleteitem._has_handlers)
			{
				var evt = new nexacro.FileUploadItemEventInfo(obj, "ondeleteitem", index);
				this.ondeleteitem._fireEvent(this, evt);
			}
		};

		_pFileUpload.on_fire_onitemchanged = function (obj, index, oldvalue, newvalue)
		{
			//변경되지 않으면 stop
			if(Eco.isEmpty(newvalue)) return;
			
			if (this.onitemchanged && this.onitemchanged._has_handlers)
			{
				//var evt = new nexacro.FileUploadItemChangeEventInfo(obj, "onitemchanged", index, oldvalue, newvalue);
				var evt = new nexacro.ExtFileUploadChangeEventInfo(obj, "onchange");
				evt["index"] = index;
				
				evt["files"] = this.convertFileInfo(newvalue);
				//evt["newvalue"] = newvalue;
				//evt["size"] = index;
				//evt["oldvalue"] = oldvalue;
				
				this.setFileInfo(index, evt["files"]);
				return this.onitemchanged._fireEvent(this, evt);
			}
				
		};
		
		//파일 full path 경로들을 파일정보 객체로 반환
		_pFileUpload.convertFileInfo = function (fullPaths)
		{
			var fileList = fullPaths.split(",");
			var fileCount = fileList.length;
			var fileInfoList = [];
			var fileName, fileId;
			for(var i=0; i<fileCount; i++)
			{
				fileName =  fileList[i].replace(/^.*[\\\/]/, '');
				fileId   =  Eco.getUniqueId("file_");
				var info = {id: fileId, name: fileName, size: -1, type:"unknown"};
				fileInfoList.push(info);
			}
			
			return fileInfoList;
		};		

		_pFileUpload.on_fire_onsuccess = function (ds, code, msg, url, variables)
		{
			application._endCommProgress();

			if (this.onsuccess && this.onsuccess._has_handlers)
			{
				if(this._autoDeleteItem)
				{
					var fileCount = this.getAddedFileLength();
						
					for(var i=0; i<fileCount; i++)
					{
						this.deleteItem(0);
					}				
				}

			
				if (variables && variables.length > 0)
				{
					//var evt = new nexacro.FileUploadLoadEventInfo(this, "onsuccess", ds, code, msg, url);
					var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess");
					evt["datasets"] = ds;
					evt["type"] = "upload";
					evt["errorcode"] = code;
					evt["errormsg"] = msg;
					evt["url"] = url;
					return this.onsuccess._fireEvent(this, evt);
				}
				else
				{
					//var evt = new nexacro.FileUploadLoadEventInfo(this, "onsuccess", ds, undefined, undefined, url);
					var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess");
					evt["datasets"] = ds;
					evt["type"] = "upload";
					evt["errorcode"] = code;
					evt["errormsg"] = msg;					
					evt["url"] = url;
					return this.onsuccess._fireEvent(this, evt);
				}
			}
		};

		_pFileUpload._getDlgCode = function ()
		{
			var want_tab = this._want_tab;
			//        this._want_tab = nexacro._enableaccessibility;
			return { want_tab: want_tab, want_return: true, want_escape: false, want_chars: false, want_arrows: false };
		};

		_pFileUpload.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp)
		{
			var items = this._items;
			var tab_flag = false;
			var idx = this.index;
			var E = nexacro.Event;
			var focus_up = keycode == E.KEY_UP || (keycode == E.KEY_TAB && shift_key);
			var focus_down = keycode == E.KEY_DOWN || (keycode == E.KEY_TAB && !shift_key);

			if (nexacro._enableaccessibility)
			{
				if (items[idx])
					this._find_item_pseudo(items[idx]);

				if (focus_up || focus_down)
				{
					if ((focus_up && idx < 0) || (focus_down && this._buttonFlag && idx == items.length - 1))
					{
						this._want_tab = false;
					}
					else  // Within a range
					{
						if (focus_up)
						{
							//if (this._editFlag == false && this._buttonFlag == true)
							if (!this._editFlag)
							{
								this.index = -1;
								this._editFlag = true;
								this._buttonFlag = false;
							}
							//else if (this._editFlag == true && this._buttonFlag == false)
							else
							{
								idx--;
								if (idx < 0)
								{
									this._editFlag = false;
									this._buttonFlag = false;
									var _window = this._getWindow();
									_window._removeFromCurrentFocusPath(this, false);
									this._setFocus(false);
								}
								else
								{
									this._editFlag = false;
									this._buttonFlag = true;
								}
							}
						}
						else if (focus_down)
						{
							if (!this._editFlag)
							{
								idx++;
								this._editFlag = true;
								this._buttonFlag = false;
							}
							//else if (this._editFlag == true && this._buttonFlag == false)
							else
							{
								this.index = -1;
								this._editFlag = false;
								this._buttonFlag = true;
							}
						}
						this.set_index(idx);
					}
					this._getWindow()._keydown_element._event_stop = true;
				}
			}
			else
			{
				if (keycode == E.KEY_TAB) // KEY_TAB
				{
					if ((shift_key && idx == 0) || (!shift_key && idx == items.length - 1)) // out a range
					{
						this._want_tab = false;
						this.set_index(-1);
					}
					else  // Within a range
					{
						if (shift_key)
						{
							idx--;
						}
						else
						{
							idx++;
						}
						this.set_index(idx);
					}
					this._getWindow()._keydown_element._event_stop = true;
				}
			}
			return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp);
		};

		_pFileUpload._find_item_pseudo = function (item)
		{
			this._editFlag = (item.fileitemedit._pseudo == "focused");
			this._buttonFlag = (item.fileitembutton._pseudo == "focused");
		};



		_pFileUpload._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
		{       
			nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
			var items = this._items;
			var itemLen = items.length;
			var focus_dir = evt_name == "shifttabkey";
			var idx = 0;
			if (itemLen)
			{
				this._want_tab = true;
				if (nexacro._enableaccessibility)
				{
					if(focus_dir)
					{
						this.index = -1;
						idx = itemLen - 1;
						this._editFlag = false;
						this._buttonFlag = true;
					}
					else
					{
						idx = -1;
						this._editFlag = false;
						this._buttonFlag = false;
					}
				}
				else
				{
					idx = this.index < 0 ? 0 : this.index;
					this.index = -1;
				}
				this.set_index(idx);
			}  
		};

		_pFileUpload.on_apply_custom_setfocus = function (evt_name)
		{
			var enableaccessibility = nexacro._enableaccessibility;
			var selffocus = ((evt_name == "lbutton") ? false : enableaccessibility);
			var items = this._items;
			if (items.length < -1 || enableaccessibility)
			{
				var control_elem = this._control_element;
				if (control_elem)
				{
					control_elem.setElementFocus(selffocus);
				}
			}
			else
			{
				var item = items[this.index];
				if (item)
				{
					item.fileitembutton._control_element.setElementFocus(selffocus);
				}
			}
		};

		_pFileUpload._setParamter = nexacro._emptyFn;
		_pFileUpload._getDataset = nexacro._emptyFn;

		//==============================================================================
		// nexacro.FileUpload : inner method
		//==============================================================================
		_pFileUpload.on_load = function (status, data, url, errcode, httpcode, errmsg)
		{
			var i, id, val, remoteId, ds;
			var code = 0, msg = "";

			//TODO
			/*
			 * 데이터 타입 확인 후 xml,ssv에 따른 기능처리.
			 */
			
			data = data.trim();
		    var fstr = data.substring(0, 3);
			
		    if (fstr == "SSV") // SSV Type (HEX:53,53,56)
		    { 
				try
				{
					trace("\n\n\t====  SSV 처리 시작 ===");
					

					var scope = this.parent;
					if(!scope["_extFileDsPool"]) {
						scope["_extFileDsPool"] = [];
					}
					
					var datasetPool = scope["_extFileDsPool"];
					var loadItem = this.loadItem;
	                var result = loadItem.__deserializeSSV(data);			
                    code = result[0];
                    msg = result[1];					
					
					//trace("code="+code + ",msg="+msg);

					var datasets = [];
					var len = datasetPool.length;
					var ds;
					for(var i=0; i<len; i++) {
						ds = datasetPool[i];
						if(ds["_used"]) {
							datasets.push(ds);
							//trace("반환값: " + ds.saveXML());
						}
					}
					
					this.on_fire_onsuccess(datasets, code, msg, url);
					
					
					loadItem.releaseResponseDataset(scope);
					
					trace("\n\n\t====  SSV 끝 ===");
			
				}
				catch (e)
				{
					var errormsg = "[FileUpload.on_load] failed to data receive.";
					this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
			
				}

		    } else {				
				//XML 타입 수신시 처리.
				try
				{
					//trace("step 1");
					var xmldoc = nexacro._getXMLDocument(this._unique_id, data, url);
					//trace("step 2 xmldoc=\n" + xmldoc);
					if (xmldoc)
					{   
						url = xmldoc.URL ? xmldoc.URL : xmldoc.url;
						if (url == "about:blank")
							return;

						var result = nexacro._getCommDataFromDom(xmldoc, this);
						
						//trace("step 3 result=\n" + result);
						//trace("step 3 result[0]=\n" + result[0]);
						//trace("step 3 result[1]=\n" + result[1] + ", isArray=" +(Eco.isArray(result[1])));
						var variables = result[0];
						var datasets = result[1];
						var len = variables.length;
					
						//trace("step 4 len=" + len);
						if (len > 0)
						{
							for (i = 0; i < len; i++)
							{
								id = variables[i]["id"];
								if (id && id.length)
								{
									val = variables[i]["val"];
									if (id == "ErrorCode")
									{
										code = parseInt(val, 10);
										if (!isFinite(code))
										{
											code = -1;
										}
									}
									else if (id == "ErrorMsg")
									{
										msg = val;
									}
								}
							}
							
							this.on_fire_onsuccess(datasets, code, msg, url, variables);
						}
						else
						{
							var errormsg = "failed to get";
							this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
						}
					}

				}
				catch (e)
				{
					var errormsg = "failed to get";
					this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
				}
			}

		};

		
		//========== Start SSV 관련 기능 추가 
		
		nexacro.ExtFileUploadSSV = function (id, parent)
		{
			this.id = id;
			this.parent = parent;
		};
		
		var _pSSV = nexacro.ExtFileUploadSSV.prototype;
		
		_pSSV._type_name = "ExtFileUploadSSV";

		
		
		_pSSV.loadSSV = function (strssv, bClear) 
		{
			//nexacro.Dataset 객체 property 설정
			this.colinfos = new nexacro.DSColumnInfoList();
			this.colcount = 0;
			this.constcount = 0;
			this.rowcount = 0;
			this.rowposition = -1;			
			
			this._constVars = new nexacro.VariableList();
			this._rawRecords = [];
			this._viewRecords = this._rawRecords;
			this.errorCode = -1;
			this.errorMsg = "Error";
			
			var _rs_ = String.fromCharCode(30);
			if (strssv) 
			{
				var ssvLine = strssv.split(_rs_);
				
				if (ssvLine.length)
				{
					var len = ssvLine.length;
					for(var i=0; i<len; i++) {
						trace("ssvLine[" + i +"]= "+ ssvLine[i]);
					}
					
					var _errorCode = ssvLine[1].split("=");
					var _errorMsg  = ssvLine[2].split("=");
					this.errorCode = _errorCode[1];
					this.errorMsg = _errorMsg[1];
					
					
					this.loadFromSSVArray(ssvLine, len, 0, bClear);
				}
			}
			
			
			trace("rowcount="+ this.rowcount);
			//trace("_rawRecords="+ this._rawRecords);
			return this.rowcount;
		};	
		
		
		_pSSV.loadFromSSVArray = function (ssvLine, lineCnt, curIdx, bClear) 
		{	
			bClear = nexacro._toBoolean(bClear);
			
			if (ssvLine)
			{
			    while (ssvLine[curIdx].substring(0, 7) != "Dataset")
			    {
			        curIdx++;
			    }

				trace("loadFromSSVArray > curIdx="+curIdx);
				if (curIdx < lineCnt)
				{
					curIdx++;
				    var ssvColLines = this._getColLinesFromSSVLines(ssvLine, curIdx);
				    curIdx += ssvColLines.length;
					//curIdx는 data row 시작점을 가리킨다.
					
					trace("\n= >>>> curIdx="+curIdx + ", ssvColLines.length="+ssvColLines.length);

				    curIdx = this._loadFromSSVArray(ssvColLines, ssvLine, curIdx, -1, false, bClear);
				    
				}
				
				return curIdx;
			}
		};		
		
		
		_pSSV._getColLinesFromSSVLines = function (ssvLines, curIdx)
		{
			trace("_getColLinesFromSSVLines > curIdx="+curIdx);
		    var lineCnt = ssvLines.length;
		    var idx = curIdx;

		    if (idx < lineCnt && ssvLines[idx].substring(0, 7) == "_Const_")
		    {
		        idx++;
		    }
		    if (idx < lineCnt && ssvLines[idx].substring(0, 9) == "_RowType_")
		    {
		        idx++;
		    }

			trace("_getColLinesFromSSVLines > idx="+idx);
			
			//_RowType_ + column info
			var typeCol = ssvLines.slice(curIdx, idx);
			trace("typeCol > " + typeCol + ", isArray= " + Eco.isArray(typeCol));	
			return typeCol;
		};		
		
		
		_pSSV._loadFromSSVArray = function (ssvColLines, ssvLines, curIdx, loadCnt, bOrgLayout, bClear)
		{ 
			var _cs_ = String.fromCharCode(31);

		    var _convertFn = this._setColInfoFromSSVLines(ssvColLines, bOrgLayout);

			//trace("_loadFromSSVArray > _convertFn=" + _convertFn);

		    curIdx = this._loadRecordFromSSVLines(ssvLines, curIdx, loadCnt, _convertFn);

		    this._viewRecords = this._rawRecords;
		    
		    this.constcount = this._constVars.length;
		    this.colcount = this.colinfos.length + this.constcount;
		    this.rowcount = this._viewRecords.length;

		    return curIdx;
		};		
		
		
		_pSSV._loadRecordFromSSVLines = function (ssvLines, curIdx, loadCnt, convertFn)
		{
			var _cs_ = String.fromCharCode(31);
            var _ext = String.fromCharCode(3);
			
			var rawRecords = this._rawRecords;
			var rawRecLength = rawRecords.length;

			var lineCnt = ssvLines.length;
            var ds = this.parent._ssvDataset;
			
			function _loadRecordFromSSVLines_loop(pDs)
			{
				if (curIdx < lineCnt) 
				{
					var curLine = ssvLines[curIdx];
					if (curLine == "")
					{
						curIdx++;
						return true;
					}
					var _currowData = curLine.split(_cs_);
					type = _currowData[0];
					_currowData.shift();

					_currowData = convertFn(_currowData);
					var len = _currowData.length;
					
					//ETX
					for (var i = 0; i < len; i++)
					{
						
						var currentData = _currowData[i];
						//trace(i + " row currentData=" + currentData);
						if (currentData == _ext) currentData = undefined;
						
						var row = ds.addRow();
						ds.setColumn(row, "data", currentData);
					}

					//_currowData._rawidx = rawRecLength;
					//_currowData._level = 0;

					//_currowData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
					
					//rawRecords[rawRecLength] = _currowData;
					//rawRecords[rawRecLength]._orgcolstrings = _currowData;

					rawRecLength++;
					curIdx++;

					if (loadCnt > 0 && rawRecLength == loadCnt) 
					{
						return true;
					}
						

					return false;
				}
				
				return true;
			}
			
			while (true) 
			{
				if (_loadRecordFromSSVLines_loop(ds)) break;

			}

			return curIdx;
		};	
		
	
		_pSSV._setColInfoFromSSVLines = function (colLines, bOrgLayout)
		{
		    if (!colLines || colLines.length == 0)
			{
		        return null;
            }
			
		    var _convertFn = null;
		    var lineCnt = colLines.length;
		    var idx = 0;

	        if (idx > lineCnt)
			{
	            return null;
			}
			
	        if (idx < lineCnt && colLines[idx].substring(0, 9) == "_RowType_")
			{
	            this.__ssvSetColInfo(colLines[idx]);
	            idx++;
			}
			
	        if (idx > lineCnt)
			{
	            return null;
			}
	      
	        
			_convertFn = this.__MakeDataConvertFunc();		    

		    return _convertFn;
		};		
		
	
		_pSSV.__ssvSetColInfo = function (strColInfo) 
		{
			var _cs_ = String.fromCharCode(31);

			var colCnt = 0;
			var colArr = strColInfo.split(_cs_); 
			var colCnt = colArr.length;
			var i = 0;
			var ds = this.parent._ssvDataset;
			
			function __ssvSetColInfo_loop(pthis, pDs)
			{
				if (i < colCnt)
				{
					var colItem = colArr[i].split(":");
					var id = colItem[0];
					var type, size;
					if (id && id != "_RowType_") 
					{
						var colInfo = colItem[1];
						if (colInfo) 
						{
							var sidx = colInfo.indexOf("("); 
							if (sidx > -1) 
							{
								type = colInfo.substring(0, sidx).toUpperCase();
								size = colInfo.substring(sidx + 1, colInfo.indexOf(")", sidx + 1)) | 0;
							} 
							else 
							{
								type = colInfo;
							}
						}
						else
						{
							type = "STRING";
							size = 256;
						}
						
						pthis._addColumn(id, type, size, colItem[2], colItem[3], ds);
					}
					i++;
					return false;
				}
				return true;
			}
			
			while (true)
			{
				if (__ssvSetColInfo_loop(this, ds)) break;
			}
			
			return colCnt;
		};		
		
		
		_pSSV._addColumn = function (id, strtype, size, prop, text, ds) 
		{
			if ((id in this.colinfos) || (id in this._constVars)) return -1;
			
			var type;
			if (strtype == undefined) 
			{
				type = 1;
				strtype = "STRING";
			} 
			else 
			{
				type = nexacro.DataUtils._typeint[strtype.toLowerCase()];
			}
			
			if (type == null)
			{
			    type = 1; 
			}
			
			if ((+size) != (+size)) 
			{
				size = 256;
			}

			//var idx = this.colinfos.length;
			//trace("_addColumn id=" + id +", strtype="+strtype +", type="+type +", size="+size +", prop="+prop +", text="+text +", idx="+idx);
			trace("_addColumn id=" + id +", strtype="+strtype +", type="+type +", size="+size +", prop="+prop +", text="+text);
			ds.addColumn(id, strtype, size);
			//var newcolinfo = new nexacro.DSColumnInfo(id, strtype, type, size, prop, text, idx);
			this.colcount++;
			//return this.colinfos.add(id, newcolinfo);
		};		
		
		
		//---------------------------------------------
		// load SSV
		//---------------------------------------------
		_pSSV.__MakeDataConvertFunc = function () 
		{
			var colinfos = this.colinfos;
			var colLen = colinfos.length;
			var expr = "(function () { return function (arr) { ";
			for (var idx = 0; idx < colLen; idx++)
			{
				var colinfo = colinfos[idx];
				switch (colinfo.ntype)
				{
				    case 1:			        
				        break;
				    case 2:
				        // int
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
				        break;
				    case 3:
				        // float
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toFloatFromText(arr[" + idx + "]); ";
				        break;
				    case 4:
				        // bigdecimal
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
				        break;
				    case 5:
				        // date
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toDateFromText(arr[" + idx + "]); ";
				        break;
				    case 6:
				        // time
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toTimeFromText(arr[" + idx + "]); ";
				        break;
				    case 7:
				        // datetime
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toDateTimeFromText(arr[" + idx + "]); ";
				        break;
				    case 8:
				        // blob
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toBlobFromText(arr[" + idx + "]); ";
				        break;
				    default:
				        // variant
				        expr += "arr[" + idx + "] = nexacro.DataUtils.toTextFromvariant(arr[" + idx + "]); ";
				        break;
				}
			}
			expr += "return arr; }; })();"
			return nexacro._executeEvalStr(expr);
		};		
				
		delete _pSSV;	
		//========== End SSV
		
		
		
		
			
		
		
		
		
		
		
		
		
		
		
		_pFileUpload._createFileItem = function (id, left, top, width, height)
		{
			var unique = this.itemcount < 1 ? this._last_id = 0 : ++this._last_id;
			var name = "upfile" + unique;
			var item = new nexacro.ExtFileItemCtrl(name, "absolute", left, top, width, height, null, null, this);

			item.index = id;
			item.set_name(name);

			item.createComponent();
			item.on_created();

			item._setEventHandler("onfindclick", this.on_notify_onfindclick, this);
			item._setEventHandler("onitemclick", this.on_notify_onitemclick, this);        
			
			return item;
		};

		_pFileUpload.on_apply_prop_enable = function (v)
		{
			nexacro.Component.prototype.on_apply_prop_enable.call(this, v); 

			var items = this._items;
			var item_len = items.length;

			for (var i = 0; i < item_len; i++)
			{
				items[i]._setEnable(v); 
				items[i].fileitemedit._setEnable(v);
				items[i].fileitembutton._setEnable(v);
			}
		};

		_pFileUpload._isPopupFrame = function ()
		{
			return this._onPopupWin;
		};

		delete _pFileUpload;
	}	
	


	


	//==============================
	//   런타임용 FileDownload
	//==============================
	if (!nexacro.ExtFileDownload)
	{
		//==============================================================================
		// nexacro.FileDownload
		//==============================================================================
		//nexacro.ExtFileDownload = function (id, position, left, top, width, height, right, bottom, parent)
		nexacro.ExtFileDownload = function (id, parent)
		{
			//nexacro.Component.call(this, id, position, left, top, width, height, right, bottom, parent);
			
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}			
			
			//숨기기
			nexacro.Component.call(this, id, "absolute", 0, 0, 0, 0, null, null, parent);
			
	 
			/* User Property */
			this.downloadurl = "";
			this.wordwrap = true;
			
			this.support = {};
			Eco.object.copyProperties(this.support, nexacro._ExtFileUpDownloadSupport);
			

			/* internal value */		
			this._handle = null;
			this._event_list =
			{
				"onclick":1, "ondblclick":1, "onkeypress":1, "onkeydown":1, "onkeyup":1, "onkillfocus":1, "onsetfocus":1,
				"ondrag":1,"ondrop":1,"ondragenter":1,"ondragleave":1,"ondragmove":1, "onlbuttondown":1, "onlbuttonup":1, "onrbuttondown":1, "onrbuttonup":1,
				"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1,"onsuccess": 1, "onerror": 1
			};

			//Accessibility
			this._accessibility_role = "button";
		};

		var _pFileDownload = nexacro._createPrototype(nexacro.Component, nexacro.ExtFileDownload);
		nexacro.ExtFileDownload.prototype = _pFileDownload;
		
		_pFileDownload._type_name = "ExtFileDownload";
	   
		
		//addEventHandler overriding(origin nexacro.EventSinkObject)
		//event명 통일을 위한 처리.
		_pFileDownload.addEventHandler = function (evt_id, func, target)
		{
			//trace("_pFileDownload.addEventHandler evt_id=" + evt_id);
			if (this._is_loading)
			{
				if (!this._loading_event_list)
				{
					this._loading_event_list = [];
				}
				this._loading_event_list.push({ id: evt_id, func: func, target: target });
			}

			var listener = this[evt_id];
			var idx = -1;
			if (listener)
			{
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			else if (evt_id in this._event_list)
			{
				listener = new nexacro.EventListener(evt_id);
				this[evt_id] = listener;
				if (this._created_event_list)
				{
					this._created_event_list.push(evt_id);
				}
				else
				{
					this._created_event_list = [];
					this._created_event_list.push(evt_id);
				}
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			return idx;
		};		
		
		//==============================================================================
		// nexacro.FileDownload : Create & Update & destroy
		//==============================================================================
		_pFileDownload.on_create_contents = function ()
		{
			var control_elem = this.getElement();
			//trace("on_create_contents > control_elem="+control_elem);
			
			if (control_elem)
			{
				nexacro._create_filedownload_handle(this.on_load, this);
			}
		};
	   
		_pFileDownload.on_created_contents = function ()
		{

		};
	   
		_pFileDownload.on_destroy_contents = function ()
		{
			var text_elem = this._text_elem;
			
			if (text_elem)
			{
				text_elem.destroy();
				this._text_elem = null;
			}

			nexacro._destroy_filedownload_handle(this._handle);
		};
	   
		_pFileDownload.on_change_containerRect = function (width, height) 
		{

		};
	   
		//==============================================================================
		// nexacro.FileDownload : Property
		//==============================================================================
		_pFileDownload.set_downloadurl = function (v)
		{
			if (v != this.downloadurl)
			{
				this.downloadurl = v;
			}
		};


		//==============================================================================
		// nexacro.FileDownload : Method
		//==============================================================================
		/*
		 * download file
		 * @param {=string} url 다운로드 fullPath url
		 * @param {string} filename 파일저장시 적용할 file name.(지원가능한 브라우저만 적용됨. 런타임 미지원)
		 * @return {boolean} 다운로드 성공여부
		 */  		
		_pFileDownload.download = function (url, filename)
		{
			var ret = false;
			var downloadurl = this.downloadurl;
		
			if (url != undefined )
			{
				url = nexacro._toString(url);
				
				//별도 처리로직
				if(application["_getImageLocation"])
				{
					url = application._getImageLocation(url);
				}
				else
				{
					url = nexacro._getImageLocation(url);
				}

				nexacro._download(url, this._handle);
				ret = true;
			}	
			else if (downloadurl && downloadurl != undefined && downloadurl != "")
			{
				//별도 처리로직
				if(application["_getImageLocation"])
				{
					downloadurl = application._getImageLocation(downloadurl);
				}
				else
				{
					downloadurl = nexacro._getImageLocation(downloadurl);
				}
				
				nexacro._download(downloadurl, this._handle);
				ret = true;
			}
			
			return ret;
		};
		
		//==============================================================================
		// nexacro.FileDownload : Event Handler
		//==============================================================================
		_pFileDownload.on_fire_onsuccess = function (url)
		{
			application._endCommProgress();

			if (this.onsuccess && this.onsuccess._has_handlers && url != "")
			{
				//var evt = new nexacro.FileDownloadEventInfo(this, "onsuccess", url);
				var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess");
				evt["type"] = "download";
				evt["url"] = url;
				return this.onsuccess._fireEvent(this, evt);
			}
		};
		
		_pFileDownload.on_load = function (status, data, url, errcode, httpcode, errmsg)
		{
			this.on_fire_onsuccess(url);
		};	
			
		_pFileDownload.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
		{
			var ret = nexacro.Component.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);
			this.download();
			return ret;
		};

		_pFileDownload.on_fire_sys_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp)
		{
			var ret = nexacro.Component.prototype.on_fire_sys_onkeyup.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp);
			if (key_code == 13 || key_code == 32) // 13 'enter' , 32 'space'
			{
				this.on_fire_onclick("none", false, false, false, -1, -1, -1, -1, -1, -1, this, this);
			}
			return ret;
		};


		//==============================================================================
		// nexacro.FileDownload : Logical Part
		//==============================================================================

		_pFileDownload._getDlgCode = function () 
		{
			return { want_tab: false, want_return: true, want_escape: false, want_chars: false, want_arrows: false };
		};
	   
		delete _pFileDownload;

	}
	
	
} 
	// ==============================================================================
	// ==============================================================================
    //  HTML5용 FileUpDownload
	// ==============================================================================
    // ==============================================================================
else
{
	// ==============================================================================
    //  파일처리 관련 API 지원 여부
    // ==============================================================================
    nexacro._ExtFileUpDownloadSupport = {
        FileAPI : (window.File && window.FileList && window.Blob && window.FileReader) ? true : false,  
        //fileReader : (window.FileReader) ? true : false,
        XHR2 : (
                ((function () {
                    try 
                    {
                        var xhr = new XMLHttpRequest();
                        return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
                    } 
                    catch(e)
                    {
                        return false;
                    }
                })())
                && (('max' in document.createElement("progress")) ? true : false)
                && ((window.FormData) ? true : false)
               ) ? true : false,
        //FormData : (window.FormData) ? true : false,
        MultipleInput : ('multiple' in document.createElement("input")) ? true : false,
        Download : ('download' in document.createElement("a")) ? true : false,
        MSSave : (window.navigator.msSaveOrOpenBlob) ? true : false,
        //MSSave : (window.navigator.msSaveBlob) ? true : false,
        //Progress : ('max' in document.createElement("progress")) ? true : false,
        //Draggable : ('draggable' in document.createElement("div")) ? true : false,
        Draggable : (function () {
                        var div = document.createElement("div");
                        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
                    })(),
        SelectorsAPI : (nexacro.Browser == "IE") ? ((nexacro.BrowserVersion >= 9) && !!document.querySelector) : !!document.querySelector
    };
    
    /*
    trace(">>>>> FileAPI:" + nexacro.ExtFileUpDownloadSupport.FileAPI);
    trace(">>>>> XHR2:" + nexacro.ExtFileUpDownloadSupport.XHR2);
    trace(">>>>> FormData:" + nexacro.ExtFileUpDownloadSupport.FormData);
    trace(">>>>> MultipleInput:" + nexacro.ExtFileUpDownloadSupport.MultipleInput);
    trace(">>>>> Download:" + nexacro.ExtFileUpDownloadSupport.Download);
    trace(">>>>> MSSave:" + nexacro.ExtFileUpDownloadSupport.MSSave);
    trace(">>>>> Progress:" + nexacro.ExtFileUpDownloadSupport.Progress);
    trace(">>>>> Draggable:" + nexacro.ExtFileUpDownloadSupport.Draggable);
    trace(">>>>> SelectorsAPI:" + nexacro.ExtFileUpDownloadSupport.SelectorsAPI);
    */

    // ==============================================================================
    // ExtFileUpload Event Info
    // ==============================================================================
    
    nexacro.ExtFileReadystateChangEventInfo = function (obj, id, readyState, status)
    {
        this.id = this.eventid = id || "onreadystatechange";
        this.fromobject = this.fromreferenceobject = obj;

        this.readyState = readyState;
        this.status = status;
    };
    
    var _pExtFileLoadEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileLoadEventInfo.prototype = _pExtFileLoadEventInfo;
    _pExtFileLoadEventInfo._type = "ExtFileLoadEventInfo";
    _pExtFileLoadEventInfo._type_name = "ExtFileLoadEventInfo";

    delete _pExtFileLoadEventInfo;
    
    
    // onchange
    nexacro.ExtFileUpDownloadChangeEventInfo = function (obj, id, type, files)
    {
        this.id = this.eventid = id || "onchange";
        this.fromobject = this.fromreferenceobject = obj;

        this.type = type;
        this.files = files;
    };
    var _pExtFileUploadChangeEventInfo = nexacro._createPrototype(nexacro.Event);
    nexacro.ExtFileUpDownloadChangeEventInfo.prototype = _pExtFileUploadChangeEventInfo;
    _pExtFileUploadChangeEventInfo._type = "ExtFileUploadChangeEventInfo";
    _pExtFileUploadChangeEventInfo._type_name = "ExtFileUploadChangeEventInfo";

    delete _pExtFileUploadChangeEventInfo;
    
                

    
    
    //fileupload progress
    nexacro.Event.ExtFileProgress = function(obj, id, type, lengthComputable, loaded, total, fileId) 
    {
        this.id = this.eventid = id || "onuploadprogress";
        this.fileId = fileId;
        this.fromobject = this.fromreferenceobject = obj;

        this.type = type;
        this.lengthComputable = lengthComputable;
        this.loaded = loaded;
        this.total = total;
    };
	
    var _pEventExtFileProgress = nexacro._createPrototype(nexacro.Event);
    nexacro.Event.ExtFileProgress.prototype = _pEventExtFileProgress;
    _pEventExtFileProgress._type = "ExtFileProgress";
    _pEventExtFileProgress._type_name = "ExtFileProgress";

    delete _pEventExtFileProgress;
    
    
    //==============================================================================
    // ExtFileUpload Style
    //==============================================================================
    nexacro.ExtFileUpDownload_Style = function (target)
    {
        nexacro.Style.call(this, target);

        this.buttonbackground = null;
        this.buttonborder = null;
        this.buttonbordertype = null;
        this.buttongradation = null;
        this.buttonpadding = null;
        this.buttonmargin = null;
        this.buttonfont = null;
        this.buttoncolor = null;
        this.buttonsize = null;
        this.buttontext = null;
    };

    var _pExtFileUploadStyle = nexacro._createPrototype(nexacro.Style);
    nexacro.ExtFileUpDownload_Style.prototype = _pExtFileUploadStyle;
    _pExtFileUploadStyle._type = "ExtFileUploadStyle";

    eval(nexacro._createBackgroundAttributeEvalStr("_pExtFileUploadStyle", "buttonbackground"));
    eval(nexacro._createBorderAttributeEvalStr("_pExtFileUploadStyle", "buttonborder"));
    eval(nexacro._createBordertypeAttributeEvalStr("_pExtFileUploadStyle", "buttonbordertype"));
    eval(nexacro._createGradationAttributeEvalStr("_pExtFileUploadStyle", "buttongradation"));
    eval(nexacro._createPaddingAttributeEvalStr("_pExtFileUploadStyle", "buttonpadding"));
    eval(nexacro._createMarginAttributeEvalStr("_pExtFileUploadStyle", "buttonmargin"));
    eval(nexacro._createFontAttributeEvalStr("_pExtFileUploadStyle", "buttonfont"));
    eval(nexacro._createColorAttributeEvalStr("_pExtFileUploadStyle", "buttoncolor"));
    eval(nexacro._createValueAttributeEvalStr("_pExtFileUploadStyle", "buttonsize"));
    eval(nexacro._createValueAttributeEvalStr("_pExtFileUploadStyle", "buttontext"));

    _pExtFileUploadStyle.__custom_emptyObject = function ()
    {
        this.buttonbackground = null;
        this.buttonborder = null;
        this.buttonbordertype = null;
        this.buttongradation = null;
        this.buttonpadding = null;
        this.buttonmargin = null;
        this.buttonfont = null;
        this.buttoncolor = null;
        this.buttonsize = null;
        this.buttontext = null;
    };

    _pExtFileUploadStyle.__get_custom_style_value = function ()
    {
        var val = "";
        if (this.buttonsize && this.buttonsize._is_empty) val += "buttonsize" + this.buttonsize._value + "; ";
        if (this.buttontext && this.buttontext._is_empty) val += "buttontext" + this.buttontext._value + "; ";
        if (this.buttonbackground && this.buttonbackground._is_empty) val += "buttonbackground" + this.buttonbackground._value + "; ";
        if (this.buttonborder && this.buttonborder._is_empty) val += "buttonborder" + this.buttonborder._value + "; ";
        if (this.buttonbordertype && this.buttonbordertype._is_empty) val += "buttonbordertype" + this.buttonbordertype._value + "; ";
        if (this.buttongradation && this.buttongradation._is_empty) val += "buttongradation" + this.buttongradation._value + "; ";
        if (this.buttonpadding && this.buttonpadding._is_empty) val += "buttonpadding" + this.buttonpadding._value + "; ";
        if (this.buttonmargin && this.buttonmargin._is_empty) val += "buttonmargin" + this.buttonmargin._value + "; ";
        if (this.buttonfont && this.buttonfont._is_empty) val += "buttonfont" + this.buttonfont._value + "; ";
        if (this.buttoncolor && this.buttoncolor._is_empty) val += "buttoncolor" + this.buttoncolor._value + "; ";

        return val;
    };


    // ==============================================================================
    // ExtFileUpload CurrentStyle
    // ==============================================================================
    nexacro.ExtFileUpDownload_CurrentStyle = function ()
    {
        nexacro.CurrentStyle.call(this);

        this.buttonbackground = null;
        this.buttonborder = null;
        this.buttonbordertype = null;
        this.buttongradation = null;
        this.buttonpadding = null;
        this.buttonmargin = null;
        this.buttonfont = null;
        this.buttoncolor = null;
        this.buttonsize = null;
        this.buttontext = null;
    };

    var _pExtFileUploadCurrentStyle = nexacro._createPrototype(nexacro.CurrentStyle);
    nexacro.ExtFileUpDownload_CurrentStyle.prototype = _pExtFileUploadCurrentStyle;

    _pExtFileUploadCurrentStyle._type = "ExtFileUploadCurrentStyle";

    _pExtFileUploadCurrentStyle.__custom_emptyObject = _pExtFileUploadStyle.__custom_emptyObject;
    _pExtFileUploadCurrentStyle.__get_custom_style_value = _pExtFileUploadStyle.__get_custom_style_value;

    delete _pExtFileUploadStyle;
    delete _pExtFileUploadCurrentStyle;
	
	
	if (!nexacro.ExtFileUpload)
	{
		//==============================================================================
		// nexacro.ExtFileUpload
		//==============================================================================
		nexacro.ExtFileUpload = function (id, parent)
		{
		    //변경####
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}		
		
			var position = "absolute";
			nexacro.Component.call(this, id, position, 0,0,0,0, null, null, parent);
			
			// SubControl
			this.filebutton = null;
			
			// User Property
			//this.multipleinput = true;
			this.multiselect = false;
			this.uploadurl = "";
			this.downloadurl = "";
			this.helpMessage  = undefined; //drag & drop 메시지를 표시하는 component
			this.guideComp    = undefined; //drag & drop zone 안내를 담당하는 component
			this.fileListComp = undefined; //file 목록을 표시하는 component
			
			this.support = {};
			Eco.object.copyProperties(this.support, nexacro._ExtFileUpDownloadSupport);			
			
			this._autoDeleteItem = true; //Auto deleteItem property when onsuccess event fire.
			
			// internal variable  
			this._form = parent;
			this._inputfiles = [];		// input
			this._addedfiles = [];		// add file item
			this._pExtFileItem;
			//this._accessibility_role = "fileupload";
			
			this._event_list = {
				"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
				"onkillfocus": 1, "onsetfocus": 1, "onmove": 1, "onsize": 1,
				"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
				"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, 
				"onmousemove": 1, "onrbuttondown": 1, "onrbuttonup": 1,
				"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
				"ontap": 1, "ondbltap": 1, "onpinchstart": 1, "onpinch": 1, "onpinchend": 1,
				"onflingstart": 1, "onfling": 1, "onflingend": 1,
				"onlongpress": 1, "onslidestart": 1, "onslide": 1, "onslideend": 1,
				
				// added event
				"onloadstart": 1, "onprogress": 1, "onload": 1, 
				"onloadend": 1, "onsuccess": 1, "onerror": 1, "onchange": 1,
				"onreadystatechange": 1 // <== XMLHttpRequest readystatechange
			};
		};

		var _pExtFileUpload = nexacro._createPrototype(nexacro.Component);
		nexacro.ExtFileUpload.prototype = _pExtFileUpload;
		
		_pExtFileUpload._type = "ExtFileUpload";
		_pExtFileUpload._type_name = "ExtFileUpload";

		_pExtFileUpload._defaultButtontext = nexacro._getCachedStyleObj("buttontext", "파일추가");
		_pExtFileUpload._defaultButtonsize = nexacro._getCachedStyleObj("buttonsize", "80");

		
		//엔진업데이트 20150305
		_pExtFileUpload._changeFiles = function(){};

		//addEventHandler overriding(origin nexacro.EventSinkObject)
		//event명 통일을 위한 처리.
		_pExtFileUpload.addEventHandler = function (evt_id, func, target)
		{
			//trace("_pExtFileUpload >  evt_id=" + evt_id);
			
			//event명 통일을 위한 처리.
			if(evt_id == "onsuccess") evt_id = "onload";
			
			if (this._is_loading)
			{
				if (!this._loading_event_list)
				{
					this._loading_event_list = [];
				}
				this._loading_event_list.push({ id: evt_id, func: func, target: target });
			}

			var listener = this[evt_id];
			var idx = -1;
			if (listener)
			{
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			else if (evt_id in this._event_list)
			{
				listener = new nexacro.EventListener(evt_id);
				this[evt_id] = listener;
				if (this._created_event_list)
				{
					this._created_event_list.push(evt_id);
				}
				else
				{
					this._created_event_list = [];
					this._created_event_list.push(evt_id);
				}
				if (target)
					idx = listener._addHandler(target, func, true);
				else
					idx = listener._addHandler(this, func, true);
			}
			return idx;
		};		
		//==============================================================================
		// nexacro.ExtFileUpload : Style
		//==============================================================================
		_pExtFileUpload.on_create_custom_style = function ()
		{
			return new nexacro.ExtFileUpDownload_Style(this);
		};

		_pExtFileUpload.on_create_custom_currentStyles = function ()
		{
			return new nexacro.ExtFileUpDownload_CurrentStyle();
		};
		
		_pExtFileUpload.on_apply_custom_pseudo = function (pseudo)
		{
			var curstyle = this.currentstyle;

			var buttonbackground = this.on_find_CurrentStyle_buttonbackground(pseudo);
			if (buttonbackground != curstyle.buttonbackground)
			{
				curstyle.buttonbackground = buttonbackground;
			}

			var buttonborder = this.on_find_CurrentStyle_buttonborder(pseudo);
			if (buttonborder != curstyle.buttonborder)
			{
				curstyle.buttonborder = buttonborder;
			}

			var buttonbordertype = this.on_find_CurrentStyle_buttonbordertype(pseudo);
			if (buttonbordertype != curstyle.buttonbordertype)
			{
				curstyle.buttonbordertype = buttonbordertype;
			}

			var buttongradation = this.on_find_CurrentStyle_buttongradation(pseudo);
			if (buttongradation != curstyle.buttongradation)
			{
				curstyle.buttongradation = buttongradation;
			}

			var buttonpadding = this.on_find_CurrentStyle_buttonpadding(pseudo);
			if (buttonpadding != curstyle.buttonpadding)
			{
				curstyle.buttonpadding = buttonpadding;
			}

			var buttonmargin = this.on_find_CurrentStyle_buttonmargin(pseudo);
			if (buttonmargin != curstyle.buttonmargin)
			{
				curstyle.buttonmargin = buttonmargin;
			}

			var buttonfont = this.on_find_CurrentStyle_buttonfont(pseudo);
			if (buttonfont != curstyle.buttonfont)
			{
				curstyle.buttonfont = buttonfont;
			}

			var buttoncolor = this.on_find_CurrentStyle_buttoncolor(pseudo);
			if (buttoncolor != curstyle.buttoncolor)
			{
				curstyle.buttoncolor = buttoncolor;
			}

			var buttonsize = this.on_find_CurrentStyle_buttonsize(pseudo);
			if (buttonsize != curstyle.buttonsize)
			{
				curstyle.buttonsize = buttonsize;
				this.on_apply_style_buttonsize(buttonsize);
			}

			var buttontext = this.on_find_CurrentStyle_buttontext(pseudo);
			if (buttontext != curstyle.buttontext)
			{
				curstyle.buttontext = buttontext;
				this.on_apply_style_buttontext(buttontext);
			}
		};

		// find currentStyle
		_pExtFileUpload.on_find_CurrentStyle_buttonbackground = function (pseudo)
		{
			var buttonbackground = this._find_pseudo_obj("buttonbackground", pseudo);
			return buttonbackground;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonborder = function (pseudo)
		{
			var buttonborder = this._find_pseudo_obj("buttonborder", pseudo, "border");
			return buttonborder;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonbordertype = function (pseudo)
		{
			var buttonbordertype = this._find_pseudo_obj("buttonbordertype", pseudo);
			return buttonbordertype;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttongradation = function (pseudo)
		{
			var buttongradation = this._find_pseudo_obj("buttongradation", pseudo);
			return buttongradation;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonpadding = function (pseudo)
		{
			var buttonpadding = this._find_pseudo_obj("buttonpadding", pseudo);
			return buttonpadding;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonmargin = function (pseudo)
		{
			var buttonmargin = this._find_pseudo_obj("buttonmargin", pseudo);
			return buttonmargin;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonfont = function (pseudo)
		{
			var buttonfont = this._find_pseudo_obj("buttonfont", pseudo);
			return buttonfont;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttoncolor = function (pseudo)
		{
			var buttoncolor = this._find_pseudo_obj("buttoncolor", pseudo);
			return buttoncolor;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttonsize = function (pseudo)
		{
			var buttonsize = this._find_pseudo_obj("buttonsize", pseudo);
			return buttonsize ? buttonsize : this._defaultButtonsize;
		};

		_pExtFileUpload.on_find_CurrentStyle_buttontext = function (pseudo)
		{
			var buttontext = this._find_pseudo_obj("buttontext", pseudo);
			return buttontext ? buttontext : this._defaultButtontext;
		};


		// update style
		_pExtFileUpload.on_update_style_buttonbackground = function ()
		{
			var buttonbackground = this.currentstyle.buttonbackground = this.on_find_CurrentStyle_buttonbackground(this._pseudo);
			this.on_apply_style_buttonbackground(buttonbackground);
		};

		_pExtFileUpload.on_update_style_buttonborder = function ()
		{
			var buttonborder = this.currentstyle.buttonborder = this.on_find_CurrentStyle_buttonborder(this._pseudo);
			this.on_apply_style_buttonborder(buttonborder);
		};

		_pExtFileUpload.on_update_style_buttonbordertype = function ()
		{
			var buttonbordertype = this.currentstyle.buttonbordertype = this.on_find_CurrentStyle_buttonbordertype(this._pseudo);
			this.on_apply_style_buttonbordertype(buttonbordertype);
		};

		_pExtFileUpload.on_update_style_buttongradation = function ()
		{
			var buttongradation = this.currentstyle.buttongradation = this.on_find_CurrentStyle_buttongradation(this._pseudo);
			this.on_apply_style_buttongradation(buttongradation);
		};

		_pExtFileUpload.on_update_style_buttonpadding = function ()
		{
			var buttonpadding = this.currentstyle.buttonpadding = this.on_find_CurrentStyle_buttonpadding(this._pseudo);
			this.on_apply_style_buttonpadding(buttonpadding);
		};

		_pExtFileUpload.on_update_style_buttonmargin = function ()
		{
			var buttonmargin = this.currentstyle.buttonmargin = this.on_find_CurrentStyle_buttonmargin(this._pseudo);
			this.on_apply_style_buttonmargin(buttonmargin);
		};

		_pExtFileUpload.on_update_style_buttonfont = function ()
		{
			var buttonfont = this.currentstyle.buttonfont = this.on_find_CurrentStyle_buttonfont(this._pseudo);
			this.on_apply_style_buttonfont(buttonfont);
		};

		_pExtFileUpload.on_update_style_buttoncolor = function ()
		{
			var buttoncolor = this.currentstyle.buttoncolor = this.on_find_CurrentStyle_buttoncolor(this._pseudo);
			this.on_apply_style_buttoncolor(buttoncolor);
		};

		_pExtFileUpload.on_update_style_buttonsize = function ()
		{
			var buttonsize = this.currentstyle.buttonsize = this.on_find_CurrentStyle_buttonsize(this._pseudo);
			this.on_apply_style_buttonsize(buttonsize);
		};

		_pExtFileUpload.on_update_style_buttontext = function ()
		{
			var buttontext = this.currentstyle.buttontext = this.on_find_CurrentStyle_buttontext(this._pseudo);
			this.on_apply_style_buttontext(buttontext);
		};


		/* apply style */
		_pExtFileUpload.on_apply_style_buttonbackground = function (buttonbackground)
		{
			this.filebutton.on_apply_style_background(buttonbackground);
		};

		_pExtFileUpload.on_apply_style_buttonborder = function (buttonborder)
		{
			this.filebutton.on_apply_style_border(buttonborder);
		};

		_pExtFileUpload.on_apply_style_buttonbordertype = function (buttonbordertype)
		{
			this.filebutton.on_apply_style_bordertype(buttonbordertype);
		};

		_pExtFileUpload.on_apply_style_buttongradation = function (buttongradation)
		{
			this.filebutton.on_apply_style_gradation(buttongradation);
		};

		_pExtFileUpload.on_apply_style_buttonpadding = function (buttonpadding)
		{
			this.filebutton.on_update_style_padding(buttonpadding);
		};

		_pExtFileUpload.on_apply_style_buttonmargin = function (buttonmargin)
		{
			this.filebutton.on_apply_style_margin(buttonmargin);
		};

		_pExtFileUpload.on_apply_style_buttonfont = function (buttonfont)
		{
			this.filebutton.on_apply_style_font(buttonfont);
		};

		_pExtFileUpload.on_apply_style_buttoncolor = function (buttoncolor)
		{
			this.filebutton.on_apply_style_color(buttoncolor);
		};

		_pExtFileUpload.on_apply_style_buttonsize = function (buttonsize)
		{
			this.on_change_containerRect();
		};

		_pExtFileUpload.on_apply_style_buttontext = function (buttontext)
		{
			if (buttontext == null)
			{
				buttontext = this._defaultButtontext;
			}
			
			if (this.filebutton)
			{
				this.filebutton.set_text(buttontext);   
			}
		};

		_pExtFileUpload.on_apply_style_cursor = function (cursor)
		{
			nexacro.Component.prototype.on_apply_style_cursor.call(this, cursor);

			if (this.filebutton)
			{
				this.filebutton.on_apply_style_cursor(cursor);
			}

		};


		//==============================================================================
		// nexacro.ExtFileUpload : Create & Update & destroy
		//==============================================================================
		_pExtFileUpload.on_create_contents = function ()
		{
			//trace("\n\n on_create_contents ");
			var control_elem = this.getElement();
			if (control_elem)
			{
				this.filebutton = new nexacro.ExtFileButtonCtrl("ExtFileButtonCtrl", "absolute", 0, 0, 0, 0, null, null, this);
				this.filebutton.createComponent();
			}
		};

		_pExtFileUpload.on_created_contents = function ()
		{
			//trace("\n on_created_contents ");
			this.addResponseZone();
			
			var ranid = new Date().valueOf().toString();
			nexacro._create_hidden_frame(this._unique_id, ranid, this.on_load, this);
			
			
			//단건 처리용
			var callback_fn = this.on_fileinput_onchange;

			//다건 처리용
			if (this.support.MultipleInput)
			{
				callback_fn = this.on_filesinput_onchange;

				//safari5 multiple 파일 추가시 파일사이즈 0 버그 - 단건방식 처리
				//nexacro.BrowserVersion은 5.1.7에서 5만 리턴함.
				if ((nexacro.Browser == "Safari") && (nexacro.BrowserVersion == 5))
				{
					this.multiselect = false;

					//callback_fn은 다건으로 적용해야 파일 사이즈를 반환 받을 수 있다.
					callback_fn = this.on_filesinput_onchange;
				}      
			}        
			
			
			var name = this._unique_id + "_" + ranid + "_inputFile";
			
			//엔진업데이트로 소스 수정..리턴이 사라짐.
			//var infile = nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);
			//infile._inputname = name;
			nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);
			var infile = this._input_node; 
			
			
			infile._inputname = name;
			this._inputfiles.push(infile);
			
			this.on_apply_multiselect();
			this.filebutton._setEventHandler("onclick", this.on_notify_filebutton_onclick, this);
			
			this.filebutton.set_visible(false);
			
			this.filebutton.on_created();
			
			
			this.on_apply_style_buttontext(this.currentstyle.buttontext);
			this.on_apply_prop_enable(this._isEnable());
			this.on_apply_style_cursor(this.currentstyle.cursor);
		};

		_pExtFileUpload.on_destroy_contents = function ()
		{
			if (this.filebutton)
			{
				this.filebutton.destroy();
				this.filebutton = null;
			}
			
			nexacro._destroy_hidden_frame(this._unique_id, this);
		};

		
		_pExtFileUpload.on_change_containerRect = function ()
		{
			var filebutton = this.filebutton;
			var btn_size = 0;
			var client_width = this._client_width;
			var client_height = this._client_height;
			var client_left = this._client_left;
			var client_top = this._client_top;
			
			var style_btnsize = this.on_find_CurrentStyle_buttonsize("normal");
			if (!style_btnsize || style_btnsize._is_empty)
			{
				btn_size = client_height;
			}
			else if (parseInt(style_btnsize._value, 10) > client_width)
			{
				btn_size = client_width;
			}
			else
			{
				btn_size = parseInt(style_btnsize._value, 10) | 0;
				if (btn_size < 0)
				{
					btn_size = client_height;
				}
			}
			
			if (filebutton)
			{
				var btn_left = client_left;
				var btn_top = client_top;
				var btn_width = btn_size;
				var btn_height = client_height;

				var btn_margin = filebutton.on_find_CurrentStyle_margin("normal");
				if (btn_margin && !btn_margin._is_empty)
				{
					btn_left = btn_left + btn_margin.left;
					btn_top = btn_margin.top;
					btn_width = btn_size - btn_margin.left - btn_margin.right;
					btn_height = client_height - btn_margin.top - btn_margin.bottom;
				}
				filebutton.move(btn_left, btn_top, btn_width, btn_height, null, null);
			}
		};
		
		
		// ==============================================================================
		// nexacro.ExtFileUpload : Override 
		// ==============================================================================  
		_pExtFileUpload.on_apply_prop_enable = function (v)
		{
			nexacro.Component.prototype.on_apply_prop_enable.call(this, v);

			var enable = v;
			if (v == undefined) enable = this.enable;

			if (this.filebutton)
			{
				this.filebutton._setEnable(enable);
			}
		};
		
		
		// ==============================================================================
		// nexacro.ExtFileUpload : Properties
		// ==============================================================================
		//파일추가
		_pExtFileUpload.addFiles = function ()
		{
			this.filebutton.click();		
		};    
		
		_pExtFileUpload.set_multiselect = function (v)
		{
			v = nexacro._toBoolean(v);

			if (v != this.multiselect)
			{
				this.multiselect = v;
			}
			
			return this.multiselect;
		};
		

		_pExtFileUpload.on_apply_multiselect = function ()
		{
			if (this._inputfiles)
			{         
				if (this.support.MultipleInput)
				{
	//                // safari5 multiple 파일 추가시 파일사이즈 0 버그 - 단건 추가로 임시 처리
	//                if ((this.multiselect == true) && ((nexacro.Browser == "Safari") && (nexacro.BrowserVersion == 5.1)))
	//                {
	//                    this.multiselect = false;
	//                }
					
					if (this.multiselect)
					{
						this._inputfiles[this._inputfiles.length-1].multiple = this.multiselect;
					}
					else
					{
						if (this._inputfiles[this._inputfiles.length-1].hasAttribute("multiple"))
						{
							this._inputfiles[this._inputfiles.length-1].removeAttribute("multiple");
						}
					}
				}
			}
		};
		
		_pExtFileUpload.set_uploadurl = function (v)
		{
			if (v != this.uploadurl)
			{
				this.uploadurl = v;
			}
		};
		
		_pExtFileUpload.set_downloadurl = function (v)
		{
			if (v != this.downloadurl)
			{
				this.downloadurl = v;
			}
		};
		

		//file upload 성공시 onsuccess event에서 자동으로 등록된 file item 삭제 여부 설정.
		_pExtFileUpload.setAutoDeleteItem = function(value) {
			this._autoDeleteItem = value;	
		};				
	   
		
		// ==============================================================================
		// nexacro.ExtFileUpload : Methods
		// ==============================================================================
		
		/**
		 * upload files
		 * @param {=string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 *                 ※ Output Dataset 정보는 RUNTIME & HTML5 모두 extUpload_onsuccess 이벤트의 e.datasets 배열객체로 수신한다.
		 * @param {string} transferType 전송유형.(all: 대상파일을 한번에 전송(defalut), each: 개별 전송)
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부
		 */    
		_pExtFileUpload.upload = function (path, inDatasetsParam, outDatasetsParam, transferType, datatype)
		{
			transferType = transferType || "all";
			this.set_uploadurl(path);
			
			if(transferType == "all"){
				return this.uploadAll(path, inDatasetsParam, outDatasetsParam, datatype);
				
			} else if(transferType == "each"){
				
				//개별전송을 위한 "each" parameter 추가.
				//safari5 multiple 파일 추가시 파일사이즈 0 버그 - 단건방식으로 처리
				//nexacro.BrowserVersion은 5.1.7에서 5만 리턴함.		
				trace("\n\n @@@ this.multiselect="+this.multiselect);
				trace("nexacro.Browser="+nexacro.Browser);
				trace("nexacro.BrowserVersion="+nexacro.BrowserVersion);
				if (nexacro.Browser.toLowerCase() == "safari" && nexacro.BrowserVersion == 5)
				{
					var msg  = "[알림]";
						msg += "\nXMLHttpRequest Level 2 미지원으로 인해서";
						msg += "\nSafari 5.x 버전에서는 개별파일 upload를 지원하지 않습니다."
						msg += "\n단건 처리만 가능함."	
						//※ 단건은 가능함. 처리로직 변경 필요.
						alert(msg);
						
						return this.uploadAll(path, inDatasetsParam, outDatasetsParam, datatype);
				}    		
				
				if (this.support.XHR2) {
					return this.uploadEach(path, inDatasetsParam, outDatasetsParam, datatype);
					
				} else {
					
					return this.uploadAll(path, inDatasetsParam, outDatasetsParam, datatype);
				}

			}
			
			return false;
		};    
		
		/*
		 * 그룹전송(하나의 XMLHttpRequest에 파일을 모두 담아 전송한다).
		 * @param {string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부  
		 */
		_pExtFileUpload.uploadAll = function (path, inDatasetsParam, outDatasetsParam, datatype)
		{
			var uploadurl;
			var rtn = false;

			if (!path)
			{
				uploadurl = application._getServiceLocation(this.uploadurl);
			}
			else
			{
				uploadurl = application._getServiceLocation(path);
			}
			
			if (uploadurl)
			{
				var loadItem = new nexacro.ExtFileTransaction(uploadurl, "upload", this._form, inDatasetsParam, outDatasetsParam, datatype);
				
				//신규 추가
				loadItem.scope = this.parent;
				loadItem.parent = this;
				//loadItem.on_start();
				
				if (this.support.XHR2)
				{
					trace("ExtFileUploadSupport.XHR2 지원");
					var formData = this._appendFormData();
					if (formData)
					{
						loadItem.appendCallback(this, this.on_load_filemodule);
						
						//input dataset 추가
						this._appendInputDatasetsToFormData(loadItem, "inputDatasets", formData);                    
						
						this._startCommunication(loadItem, uploadurl, formData);
						rtn = true;
					}
					else 
					{
						trace("_startCommunication 미호출");
						
					}
						
				}
				else
				{
					trace("ExtFileUploadSupport.XHR2 미지원");
					loadItem.appendCallback(this, this.on_loadframe_filemodule);
					this._pExtFileItem = loadItem;
					nexacro._submit(this._unique_id, uploadurl);
					rtn = true;
				}
			}
			
			return rtn;
		};
		
		/*
		 * 개별전송(업로드 시킬 파일개수와 같은 수의 XMLHttpRequest를 생성한다).
		 * @param {string} path upload url 정보
		 * @param {string} inDatasetsParam input dataset 정보
		 * @param {string} outDatasetsParam output dataset 정보
		 * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
		 * @return {boolean} 성공여부 
		 */
		_pExtFileUpload.uploadEach = function (path, inDatasetsParam, outDatasetsParam, datatype)
		{
			var uploadurl;
			var rtn = false;

			if (!path)
			{
				uploadurl = application._getServiceLocation(this.uploadurl);
			}
			else
			{
				uploadurl = application._getServiceLocation(path);
			}
			
			if (uploadurl)
			{
				//업로드할 파일 개수 확인
				var formDataList = this._getFormDataList();
				var formDataCount = formDataList.length;
				
				for(var i = 0; i < formDataCount; i++) {
					var loadItem = new nexacro.ExtFileTransaction(uploadurl, "upload", this._form, inDatasetsParam, outDatasetsParam, datatype);
					//신규 추가
					loadItem.scope = this.parent;
					loadItem.parent = this;					
					//loadItem.on_start();
					
					if (this.support.XHR2)
					{
						trace("[개별] ExtFileUploadSupport.XHR2 지원");
						var formData = formDataList[i];
						if (formData)
						{
							trace("   [개별]  _startCommunication 호출");
							
							loadItem.appendCallback(this, this._makeLoadFileModule(this, formData.fileName));

							//input dataset 추가
							this._appendInputDatasetsToFormData(loadItem, "inputDatasets", formData);
							
							this._startCommunication(loadItem, uploadurl, formData, formData.fileName);
							rtn = true;
						}
						else 
						{
							trace("   [개별] _startCommunication 미호출");
							
						}
							
					}
					else
					{
						trace("[개별] ExtFileUploadSupport.XHR2 미지원");
						loadItem.appendCallback(this, this.on_loadframe_filemodule);
						this._pExtFileItem = loadItem;
						nexacro._submit(this._unique_id, uploadurl);
						rtn = true;
					}        		
					
				}
			}
			
			return rtn;
		};    
		
		/*
		 * 파일 개별전송을 위한 formData 반환
		 * @return {array} formData List
		 */
		_pExtFileUpload._getFormDataList = function() {
			var formData,
			transferLen = 0,
			i = 0,  
			file, fileName,
			transferFiles,
			formDataList = [];
		
			transferFiles = this._addedfiles;
			
			if (transferFiles)
			{
				transferLen = transferFiles.length;
				
				for (i = 0; i < transferLen; i++) 
				{
					formData = new FormData();
					
					file = transferFiles[i].file;

					if (file)
					{
						fileName = file.name;
						//trace(">> file i:" + i + ", fileName:" + fileName);
						formData.append(fileName, file);
						formData["fileName"] = fileName;
						formDataList.push(formData);
					}
				}
			}

			return formDataList;    	
		};
		
		/*
		 * input dataset의 정보를 formData에 추가한다.
		 * @param {FileTransaction} loadItem FileTransaction
		 * @param {string} name
		 * @param {FormData} formData
		 */
		_pExtFileUpload._appendInputDatasetsToFormData = function(loadItem, name, formData) {
			return formData.append(name, loadItem._sendData);
		};
		
		
			 
		_pExtFileUpload.addDropZone = function (comp)
		{
			var rtn = false;
			if (this.support.XHR2 && this.isDraggable())
			{
				var node = comp._control_element._client_element._handle;
				if (node)
				{   
					node._pExtFileUploadTarget = this;
					rtn = true;
				}
			}
			
			return rtn;
		};
		
		
		/**
		 * Drag & Drop(이하 DnD)를 적용하기 위해
		 * 특정 컴포넌트(guideComp)에 Drag 중인 마우스가 들어왔을 때 
		 * Drop 가능영역을 표시하기 위한 컴포넌트(helpMessageComp) 정보를 property에 등록하는 함수.
		 * @param {XComp} responseComp Drag 중인 마우스가 들어왔을 때 이를 감지할 컴포넌트.
		 * @param {XComp} helpMessageComp Drop 가능 영역을 표시하기 위한 컴포넌트.
		 * @param {XComp} fileListComp file 목록을 표시하는 컴포넌트.
		 */	    
		_pExtFileUpload.setResponseZone = function (guideComp, helpMessageComp, fileListComp)
		{
			//trace("\n\n @@@ setResponseZone");
			this.guideComp    = guideComp;
			this.helpMessage  = helpMessageComp;
			this.fileListComp = fileListComp;
		};    
		
		
		/**
		 * setResponseZone()에서 등록된 컴포넌트에 Drag & Drop 관련 event를 추가한다.
		 * addResponseZone()이 호출되는 시점은 _pExtFileUpload 객체의 on_created_contents 발생시점이다.
		 * 이는 생성시점(div나 tabpage 링크등)에 따른 오동작을 막기위함.
		 * @return {boolean} 설정 성공여부.
		 */	    
		_pExtFileUpload.addResponseZone = function ()
		{
			//trace("\n\n ### addResponguideComp   	guideComp = this.guideComp;
			
			var guideComp = this.guideComp;
			var helpMessageComp = this.helpMessage;
			
			if(Eco.isEmpty(guideComp) || Eco.isEmpty(helpMessageComp)) {
				trace("Response or helpMessage Components are not exist.");
				return;
			}
			
			var rtn = false;
			var node = guideComp._control_element._client_element._handle;
			var helpNode = helpMessageComp._control_element._client_element._handle;
			
			if (this.support.XHR2 && this.isDraggable())
			{
				if (node)
				{   
					node._pExtFileUploadTarget = this;

					nexacro._observeSysEvent(node, "dragover", "ondragover", this._dragOverGuide);
					nexacro._observeSysEvent(node, "dragleave", "ondragleave", this._dragLeaveGuide);
					
					//IE처리를 위한 추가 logic. 테스트 후 if문 분기처리 할 것.
					// IE에서는 guide 컴포넌트에 drop을 발생시켜도 화면전환이 일어나지 않는다.....
					// 이러면 help message가 남아 있는다....
					// 이를 위해서 아래 event 추가.
					nexacro._observeSysEvent(node, "drop", "ondrop", this._dropGuide);
					
					
					if(helpNode){
						helpNode._pExtFileUploadTarget = this;
						
						nexacro._observeSysEvent(helpNode, "dragover", "ondragover", this._dragOverHelpMessage);
						nexacro._observeSysEvent(helpNode, "drop", "ondrop", this._dropFiles);
					}
					
					rtn = true;
				}
			}
			else if( nexacro.Browser.toLowerCase() == "safari") {
				 trace("nexacro.Browser="+nexacro.Browser);
	 
				 if (node) {
					 trace("node 존재"); 
					 node.addEventListener("dragover", this._dragOverGuide);
					 node.addEventListener("dragleave", this._dragLeaveGuide);
					 node.addEventListener("drop", this._dropGuide);
					 node.style = "";
				}
			
				 if(helpNode){
					trace("helpNode 존재");
					helpNode._pExtFileUploadTarget = this;
					
					helpNode.addEventListener("dragover", this._dragOverHelpMessage);
					helpNode.addEventListener("drop", this._dropFiles);             	

				 }
				 
				 rtn = true;             
			}
			
			return rtn;
		};     
		
		_pExtFileUpload.isProgressbar = function ()
		{
			return this.support.XHR2;
		};
		
		_pExtFileUpload.isDraggable = function ()
		{
			return (this.support.Draggable && this.support.FileAPI);
		};
		
		_pExtFileUpload.isMultipleInput = function ()
		{
			return this.support.MultipleInput;
		};
		
		_pExtFileUpload.getAddedFile = function ()
		{
			if (this._addedfiles)
			{
				return this._addedfiles;
			}
		}
		
		_pExtFileUpload.getAddedFileLength = function ()
		{
			if (this._addedfiles)
			{
				return this._addedfiles.length;
			}
		}
		
		_pExtFileUpload.resetAddedFile = function ()
		{
			this._addedfiles = [];
		};
		
		_pExtFileUpload.addFile = function (file)
		{
			if (this._addedfiles)
			{
				var info = {"id": file.id, "file": file};
				this._addedfiles.push(info);
			}
		};
		
		// 행 삭제
		_pExtFileUpload.removeFile = function (fileid)
		{
			var index = Eco.array.lastIndexOfProp(this._addedfiles, "id", fileid);
			if (index > -1)
			{
				this._addedfiles[index] = null;
				Eco.array.removeAt(this._addedfiles, index);
			}
			
			if (!this.support.XHR2 || !this.support.FileAPI)
			{
				//index = Eco.array.lastIndexOfProp(this._inputfiles, "name", fileid);
				if (index > -1)
				{
					fileid = this._inputfiles[index]["_inputname"];
					index = Eco.array.lastIndexOfProp(this._inputfiles, "name", fileid);
					
					//trace("\n ## IE9에서 ...fileid="+fileid + ", index=" + index);					
					
					nexacro._remove_hidden_item(this._unique_id, fileid);
					this._inputfiles[index] = null;
					Eco.array.removeAt(this._inputfiles, index);
				}
			} else {
				this._resetInputFile();
			}
		};
		
		// 전체 삭제
		_pExtFileUpload.removeAll = function ()
		{
			var addFiles = this._addedfiles;
			var count = addFiles.length;
			var fileId;
			var fileList = [];

			for(var i=0; i<count; i++)
			{
				fileId = addFiles[0]["id"];
				fileList.push(fileId);
				
				index = Eco.array.lastIndexOfProp(this._addedfiles, "id", fileId);
				
				//trace("addFiles fileId="+fileId +", index="+index);
				if (index > -1)
				{
					addFiles[index] = null;
					Eco.array.removeAt(addFiles, index);
					
				}			
			}
			
		
			this._addedfiles = [];
			
			
			if (!this.support.XHR2 || !this.support.FileAPI)
			{
				var inputFiles = this._inputfiles;
				var count = fileList.length;
				
				//trace("\n ## IE9에서 ...fileList.length="+fileList.length);
			
				for(var i=count-1; i>-1; i--)
				{
					fileId = this._inputfiles[i]["_inputname"];
					index = Eco.array.lastIndexOfProp(this._inputfiles, "name", fileId);
					
					//trace("   fileId="+fileId +  "  ,  index="+index);
					
					if (index > -1)
					{
						nexacro._remove_hidden_item(this._unique_id, fileId);
						this._inputfiles[index] = null;
						Eco.array.removeAt(this._inputfiles, index);					
					}				
				}				
				
				//trace("전체삭제 후 this._inputfiles.length="+this._inputfiles.length);		
			}
			else 
			{
				this._resetInputFile();
			}
			
		};	
		
		//input file 재생성(기존에 선택된 파일을 다시 선택 할 수 있도록 하기 위함)
		_pExtFileUpload._resetInputFile = function ()
		{
			//trace("input file 재생성 ");
			var tempInputFileName = this._inputfiles[0]._inputname ;
			//trace("tempInputFileName="+tempInputFileName);
			nexacro._remove_hidden_item(this._unique_id, tempInputFileName);
			
			this._inputfiles = [];
			
					
			var ranid = new Date().valueOf().toString();
			var name = this._unique_id + "_" + ranid + "_inputFile";
			
			//단건 처리용
			var callback_fn = this.on_fileinput_onchange;

			//다건 처리용
			if (this.support.MultipleInput)
			{
				callback_fn = this.on_filesinput_onchange;

				//safari5 multiple 파일 추가시 파일사이즈 0 버그 - 단건방식 처리
				//nexacro.BrowserVersion은 5.1.7에서 5만 리턴함.
				if ((nexacro.Browser == "Safari") && (nexacro.BrowserVersion == 5))
				{
					this.multiselect = false;

					//callback_fn은 다건으로 적용해야 파일 사이즈를 반환 받을 수 있다.
					callback_fn = this.on_filesinput_onchange;
				}      
			}        
			
			nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);

			var infile = this._input_node; 
			infile._inputname = name;
			this._inputfiles.push(infile);
			
			this.on_apply_multiselect();
			//this.filebutton._setEventHandler("onclick", this.on_notify_filebutton_onclick, this);
			
			//this.filebutton.set_visible(false);
			
			//this.filebutton.on_created();    	
		};
		
		
		// ==============================================================================
		// nexacro.ExtFileUpDownload : Event Handlers
		// ==============================================================================
		/*
		 * XMLHttpRequest readystatechange event
		 * @param {string} type "upload" or "download"
		 */
		_pExtFileUpload.on_fire_onreadystatechange = function (obj, readyState, status, fileId, type) 
		{

			if (this.onreadystatechange && this.onreadystatechange._has_handlers)
			{   
				var evt = new nexacro.ExtFileReadystateChangEventInfo(obj, "readystatechange", readyState, status);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				this.onreadystatechange._fireEvent(this, evt);
			}
		};
		
		
		_pExtFileUpload.on_fire_onerror = function (obj, errorcode, errormsg, errorobj, fileId, type)
		{
			//trace("\n\n\non_fire_onerror 호출 errorcode=" + errorcode + ", errormsg="+errormsg );
			var errormsg = nexacro._GetSystemErrorMsg(this, errorcode);
			if(Eco.isEmpty(errormsg)) {
				errorcode = errorobj.status;
				errormsg = errorobj.statusText;
			}  
			
			if (this.onerror && this.onerror._has_handlers)
			{
				var evt = new nexacro.ExtFileErrorEventInfo(obj, "onerror", errorcode, errormsg, errorobj);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onerror", this.fileComp_onerror, this);            
				return this.onerror._fireEvent(this, evt);
			}
			
			return true;
			
		};
		
		_pExtFileUpload.on_fire_onchange = function (obj, type, files)
		{
			trace("on_fire_onchange 호출 " + this._type_name);
			if (this.onchange && this.onchange._has_handlers)
			{
				//var evt = new nexacro.ExtFileUpDownloadChangeEventInfo(obj, "onchange", type, files);
				var evt = new nexacro.ExtFileUploadChangeEventInfo(obj, "onchange");
				evt["index"] = -1;
				evt["files"] = this.convertFileInfo(files);
				
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onchange", function, this);            
				return this.onchange._fireEvent(this, evt);
			}
		};
		
		
		//파일정보 객체 반환
		_pExtFileUpload.convertFileInfo = function (files)
		{
			var fileCount = files.length;
			var fileInfoList = [];
			var fileName, fileId, fileSize, fileType;
			
			//iOS 6.0버그(이미지선택시 image.jpg로만 반환하는 버그대응용. 20150312)
			if(nexacro.OS != "iOS") {
				for(var i=0; i<fileCount; i++)
				{
					var file = files[i];
					fileName = file.name;
					fileSize = file.size;
					fileType = file.type;
					fileId   = Eco.getUniqueId("file_");
					var info = {id: fileId, name: fileName, size: fileSize, type: fileType};
					fileInfoList.push(info);
					
					file.id = fileId;
					this.addFile(file);
				}			
			
			} else if(nexacro.OS == "iOS") {
				for(var i=0; i<fileCount; i++)
				{
					var file = files[i];
					fileName = file.name;
					
					//iOS 6.0버그(이미지선택시 image.jpg로만 반환하는 버그대응용. 20150312)
					//처리하기위해 timestamp를 사용함. 20150312.
					if(fileName == "image.jpg") {
						var timestamp = new Date().getTime();
						fileName = "image.temp_" + timestamp + "." + i + ".jpg";
					}
					
					fileSize = file.size;
					fileType = file.type;
					fileId   = Eco.getUniqueId("file_");
					var info = {id: fileId, name: fileName, size: fileSize, type: fileType};
					fileInfoList.push(info);
					
					file.id = fileId;
					this.addFile(file);
				}			
			}

			
			return fileInfoList;
		};		
		
		_pExtFileUpload.on_fileinput_onchange = function (value)
		{     
			trace("on_fileinput_onchange 호출");
			
			var filePath = value;
			if (filePath)
			{
				var ranid = new Date().valueOf().toString();
				var name = this._unique_id + "_" + ranid + "_inputFile";
				
				
				var callback_fn = this.on_fileinput_onchange;
				
				//엔진업데이트로 소스 수정..리턴이 사라짐.
				//var infile = nexacro._append_hidden_item(this._unique_id, name, this.on_fileinput_onchange, this);
				//infile._inputname = name;
				nexacro._append_hidden_item(this._unique_id, name, callback_fn, this);
				var infile = this._input_node; 
				infile._inputname = name;            
				
				this._inputfiles.push(infile);
				
				var fileTemp = filePath.split('\\');
				var fileName = fileTemp[fileTemp.length-1];
				trace("    fileTemp:" + fileTemp + "  fileName:" + fileName);
				
				var files = [];
				files.push({"id": this._inputfiles[this._inputfiles.length - 2]._inputname, "name": fileName});
				this.on_fire_onchange(this, "HtmlInputElement", files);
			}
		};
		
		_pExtFileUpload.on_filesinput_onchange = function (value)
		{
			trace("\non_filesinput_onchange 호출 ==> on_fire_onchange");
			if (this._inputfiles)
			{
				var infile = this._inputfiles[this._inputfiles.length - 1];
				this.on_fire_onchange(this, infile.type, infile.files);
			}
		};
		
		_pExtFileUpload.on_notify_filebutton_onclick = function (obj, e)
		{
			trace(" *** on_notify_filebutton_onclick");
			if (this._inputfiles && this.visible && this._isEnable() && this.enableevent)
			{
				try
				{
					var infile = this._inputfiles[this._inputfiles.length - 1];
					var name = infile._inputname;
					
					nexacro._findclick(this._unique_id, name, obj);
				}
				catch (e)
				{
					var errormsg = nexacro._GetSystemErrorMsg(this, "0x8100000E");
					this.on_fire_onerror(this, "0x8100000E", errormsg, obj);
				}
			}
			return false;
		};
		
		
	  _pExtFileUpload.on_fire_onloadstart = function (obj, type, evt, fileId)
	  {
		  if (this.onloadstart && this.onloadstart._has_handlers)
		  {   
			  var evt = new nexacro.Event.ExtFileProgress(obj, "onloadstart", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
			  // UI에서 아래 소스로 정의된 function이 실행된다.
			  //  comp.addEventHandler("onloadstart", this.fileComp_onloadstart, this);
			  this.onloadstart._fireEvent(this, evt);
		  }
	  };
		
		_pExtFileUpload.on_fire_onprogress = function (obj, type, evt, fileId)
		{
			if (this.onprogress && this.onprogress._has_handlers)
			{
				var evt = new nexacro.Event.ExtFileProgress(obj, "onprogress", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onprogress", this.fileComp_onprogress, this);
				this.onprogress._fireEvent(this, evt);
			}
		};    
		
		_pExtFileUpload.on_fire_onload = function (type, code, msg, url, fileId, datasets)
		{
			if (this.onload && this.onload._has_handlers && url != "about:blank")
			{
				 
				 if(this._autoDeleteItem)
				 {
					 //성공적으로 파일 업로드시 업로드대상 파일 정보 제거.
					 this.removeAll();				 
				 }

				 //var evt = new nexacro.ExtFileLoadEventInfo(this, "onload", type, code, msg, url);
				 var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess", type, code, msg, url);
				 evt["fileId"] = fileId;
				 evt["type"] = "upload";
				 evt["errorcode"] = code;
				 evt["errormsg"] = msg;
				 evt["url"] = url;
				 //trace(" \n\n>>>>>>> fileId="+fileId+ ", datasets=" + datasets);
				 evt["datasets"] = datasets || []; //output dataset
				 
				 return this.onload._fireEvent(this, evt);
			}
		};
		
		_pExtFileUpload.on_fire_onloadend = function (obj, type, evt, fileId)
		{
			if (this.onloadend && this.onloadend._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadend", type, evt.lengthComputable, evt.loaded, evt.total);
				evt["fileId"] = fileId;
				this.onloadend._fireEvent(this, evt);
			}
		};
		
			
		// ==============================================================================
		// nexacro.ExtFileUpDownload : Logical Part ( Internal Function Part )
		// ==============================================================================
		
		_pExtFileUpload._appendFormData = function ()
		{
			var formData,
				transferLen = 0,
				i = 0,  
				file, fileName,
				transferFiles;
			
			if (this._addedfiles)
			{
				transferFiles = this._addedfiles;
				formData = new FormData();
				transferLen = transferFiles.length;
				
				for (i = 0; i < transferLen; i++) 
				{
					file = transferFiles[i].file;
					
					if (file)
					{
						fileName = file.name;
						//trace(">> file i:" + i + ", fileName:" + fileName);
						formData.append(fileName, file);
					}
					/*	form field
					else
					{
						//trace(">> form field i:" + i + " fileName:" + fileName);
						formData.append(uid, fileName);
					}
					*/
				}
			}
			
			return formData;
		};
		
		_pExtFileUpload._startCommunication = function (loadItem, url, data, fileId)
		{
			//user protocol        
			var path = url;
			var senddata = data;
			//trace("_startCommunication > loadItem._protocol=" + loadItem._protocol);
			
			if (loadItem._protocol < 0)
			{  
				var createadaptor = false;
				var protocoladp = application._getProtocol(loadItem.protocol);
				if (!protocoladp)
				{
					trace("loadItem.protocol="+loadItem.protocol);
					
					var adptorclass = nexacro._executeEvalStr(loadItem.protocol);
					
					trace("loadItem.protocol=" + loadItem.protocol);
					trace("adptorclass="+adptorclass);                
					
					// adptorclass.
					if (adptorclass)
					{
						protocoladp = new adptorclass;
						createadaptor = true;
					}
				}

				if (protocoladp)
				{
					if (createadaptor && protocoladp.initialize)
					{
						protocoladp.initialize(url);
						application._addProtocol(loadItem.protocol, protocoladp);
					}

					var protocol = protocoladp.getUsingProtocol(url);
					var sep = path.split("://");
					if (sep)
					{
						path = protocol + "://" + sep[1];
					}

					// encode             
					if (data && protocoladp.encrypt)
					{
						senddata = loadItem.on_encrypt(data);
					}

					// extra header 정보 
					if (protocoladp.getCommunicationHeaders)
					{
						var headers = protocoladp.getCommunicationHeaders(url);
						if (headers)
							loadItem._addCookieFromVariables(headers);
					}
				}
			}

			this.__startCommunication(loadItem, path, senddata, fileId);
		};
		
		_pExtFileUpload.__startCommunication = function (loadItem, path, senddata, fileId)
		{   
			var _ajax = nexacro.__createHttpRequest();
			var ajax_handle = _ajax._handle;

			// parse protocol       
			if (path.indexOf("://") > -1)
			{
				var ar = path.split("://");
				var protocol = ar[0];
				switch (protocol)
				{
					case "http": _ajax._protocol = 0; break;
					case "https": _ajax._protocol = 1; break;
					case "file": _ajax._protocol = 2; break;
					default: _ajax._protocol = -1; break;
				}
			}
			
			var method = "GET";        
			var mime_xml = false;

			ajax_handle._pExtFileTarget = this;
			ajax_handle._pExtFileItem = loadItem;
			
			
			/*
			readystatechange : The readyState attribute changes value
			
				type    :           Description         :     Times     :               When
			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			loadstart   :   Progress has begun.         :  Once.        :   First.
			progress    :   In progress.                :  Zero or more.:   After loadstart has been dispatched.
			error       :   Progression failed.         :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			abort       :   Progression is terminated.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			load        :   Progression is successful.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			loadend     :   Progress has stopped.       :  Once.        :   After one of error, abort, or load has been dispatched.
			*/
			//if (loadItem.type == "upload")
			//{
				ajax_handle.upload._pExtFileTarget = this;
				ajax_handle.upload._pExtFileItem = loadItem;
				
				
				nexacro._observeSysEvent(ajax_handle, "loadstart", "onloadstart", this._makeLoadstartHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle.upload, "progress", "onprogress", this._makeProcessHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "load", "onload", this._makeLoadHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "loadend", "onloadend", this._makeLoadendHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "error", "onerror", this._makeErrorHandler(this, fileId, loadItem));
				
				
				//XHR 에러처리용.
				//신규추가. 2014.10.20 
				nexacro._observeSysEvent(ajax_handle, "readystatechange", "onreadystatechange", this._makeReadystateChangeHandler(this, fileId, loadItem.type));
				nexacro._observeSysEvent(ajax_handle, "abort", "onabort", this._makeTransferCanceledHandler(this, fileId));

				method = "POST";            
				mime_xml = true;    
			//}

			
			try 
			{            
				ajax_handle.open(method, path, true);

			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}
			
			if (mime_xml)
			{
				ajax_handle.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax_handle.setRequestHeader("Accept", "application/xml, text/xml, */*");
			}
			
			try 
			{
				ajax_handle.send(senddata ? senddata : null);
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}       

			_ajax = null;
		};
		 
		
		
		/*
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @return {function} closure of on_load_filemodule
		 */
		_pExtFileUpload._makeLoadFileModule = function (pThis, pFileId) {
			return function(type, code, msg, url, datasets) {
				pThis.on_fire_onload(type, code, msg, url, pFileId, datasets);
			};
		};
		
		/*
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onprogress
		 */
		_pExtFileUpload._makeProcessHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onprogress(pThis, pLoadItem.type, evt, pFileId);
			};
		};
		
		
		/*
		 * 전송 시작시 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadstart
		 */
		_pExtFileUpload._makeLoadstartHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onloadstart(pThis, pLoadItem.type, evt, pFileId);
			};
		};
		
		/*
		 * 전송이 성공 했을 때 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onload
		 */    
		_pExtFileUpload._makeLoadHandler = function (pThis, pFileId, pLoadItem) {

			return function(evt) {
				var itemType = pLoadItem.type;
				
				//trace("\n\n >>>>> _makeLoadHandler: " + pThis + ",pLoadItem:" + pLoadItem + ",evt:" + evt.type + ",itemType:" + itemType + ",responseType:" + this.responseType);
				
				if (this.readyState == 4 && this.status == 200) 
				{
					var cookie = "";
					if (pLoadItem.context)
					{
						cookie = pLoadItem.context._getWindow()._doc.cookie;
					}
					
					var data;
					if (itemType == "upload")
					{
						data = this.responseText || "";

						if(Eco.isEmpty(data))
						{
							var errormsg = "response data is empty!";
							pThis.on_fire_onerror(pThis, "ObjectError", errormsg, this, 9901, null, null, -1);
							return;
						}
							
						//trace("_makeLoadHandler data =" + data);
						pLoadItem.on_load_file(data, cookie, this.status, this.statusText);
					}
					else if (itemType == "download")
					{
						if (this.responseType == "blob")
						{
							data = this.response;
							pLoadItem.on_down_file(data, pThis._unique_id, cookie, this.status, this.statusText);
						}
						else
						{
							var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
							pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
						}
					}
				}
				else
				{
					var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
					pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
				} 
			};
	   
		};    
		
		
		
		/*
		 * 전송 완료 체크용(성공과 실패에 무관하게 발생함!) closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadend
		 */    
		_pExtFileUpload._makeLoadendHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				var itemType = pLoadItem.type;
				
				if (itemType == "download")
				{
					if (this.responseType == "blob")
					{
						pLoadItem.on_downend_file();
					}
				}
				
				pThis.on_fire_onloadend(pThis, itemType, evt, pFileId);
				
				pLoadItem = null;
				pthis = null;
				
				if (this.upload._pExtFileTarget) this.upload._pExtFileTarget = null;
				if (this.upload._pExtFileItem) this.upload._pExtFileItem = null;    		
			};

		};
		
		
		/*
		 * 통신에러 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @param {string} type "upload","download"
		 * @return {function} closure of error
		 */        
		_pExtFileUpload._makeErrorHandler = function (pThis, pFileId, pLoadItem, type)
		{
			return function(evt) {
				
				if (pLoadItem._usewaitcursor)
					pLoadItem._hideWaitCursor();
				
				pThis.on_fire_onerror(pThis, -1, "File transfer was failure.", pThis, pFileId, pLoadItem.type);    		
			};

		};    
		
		

		/*
		 * XHR 통신상태 체크용 closure.  2014.10.20 신규추가
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of error
		  
			  Holds the status of the XMLHttpRequest. Changes from 0 to 4: 
				0: request not initialized 
				1: server connection established
				2: request received 
				3: processing request 
				4: request finished and response is ready
			 
			  status
					  　200: "OK"
					  　404: Page not found
						   
					  참고사항: tomcat에서 jsp를 호출하던 중  java.lang.ClassNotFoundException 발생시 
					   500: internal server error 발생!!!  
		 */	          
		_pExtFileUpload._makeReadystateChangeHandler = function (pThis, pFileId, pType)
		{
			return function(evt) {
				var xhrUpload = evt.target;
				//trace("readyState=" + xhrUpload.readyState + ", status=" + xhrUpload.status);
				//trace("bbb  _makeReadystateChangeHandler pFileId="+pFileId + ",pType="+pType);
				
				pThis.on_fire_onreadystatechange(pThis, xhrUpload.readyState, xhrUpload.status, pFileId, pType);    		
			};
		};       
		
		
		/*
		 * 전송취소 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of TransferCanceled
		 */      
		_pExtFileUpload._makeTransferCanceledHandler = function (pThis, pFileId)
		{
			return function(evt) {
				alert(pFileId + ". 사용자에 의해 전송이 취소되었습니다.");
			};
		};    

		
		//XHR2 지원시 호출
		_pExtFileUpload.on_load_filemodule = function (type, code, msg, url, datasets)
		{
			//trace("\n★ on_load_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url +  ",datasets:" + datasets);
			var fileId = "";
			this.on_fire_onload(type, code, msg, url, fileId, datasets);
		};
		
		
		//XHR2 미지원시 호출: _pFileTransaction.on_loadframe_file에서 호출됨.
		_pExtFileUpload.on_loadframe_filemodule = function (type, code, msg, url, datasets)
		{
			//trace("\n\n★★on_loadframe_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url +  ",datasets:" + datasets);
			this.on_fire_onload(type, code, msg, url, "", datasets);
		};
		
		_pExtFileUpload.on_load = function (target)
		{
			//trace("\n\n★★ on_load");
			var pLoadItem = this._pExtFileItem;    
			if (pLoadItem)
			{
				pLoadItem.on_loadframe_file(this._unique_id, target);
				pLoadItem = null;
			}
		};
		
		
		/*
		 * guide 컴포넌트에 drop event발생시 호출 
		 */       
		_pExtFileUpload._dropGuide = function (evt)
		{
			//var files = evt.dataTransfer.files;
			//trace("\n &&&&&&&&_dropGuide ");
			var pThis = this._pExtFileUploadTarget;
			pThis.helpMessage.set_visible(false);
			evt.stopPropagation();
			evt.preventDefault();
			
			return false;
		};    
		
		/*
		 * drop-zone 컴포넌트에 drop event발생시 호출 
		 */       
		_pExtFileUpload._dropFiles = function (evt)
		{
			var files = evt.dataTransfer.files;
			trace("_dropFiles dataTransfer.files:" + files);
			evt.stopPropagation();
			evt.preventDefault();
			
			if (evt.dataTransfer)
			{
				var pThis = this._pExtFileUploadTarget;
				if(pThis)
				{
					pThis.helpMessage.set_visible(false);
					pThis.on_fire_onchange(pThis, evt.type, files);
				}
			}
		};
		
		
		
		/*
		 * drop 도움말을 표시/숨기기를 위한 컴포넌트에 dragover event발생시 호출 
		 */
		_pExtFileUpload._dragOverGuide = function (evt) 
		{
			//var objDate = new Date();
			//var nMs = objDate.getMilliseconds();			
			//trace("표시하기 :" + nMs);	
			//trace("_dragOverGuide :" + this);
			var pThis = this._pExtFileUploadTarget;
			pThis.helpMessage.set_visible(true);

			
			evt.stopPropagation();
			evt.preventDefault();
			
			evt.dataTransfer.dropEffect = "none";
			return false;
		};
		
		/*
		 * drop 도움말을 표시/숨기기를 위한 컴포넌트에 dragover event발생시 호출 
		 */
		_pExtFileUpload._dragOverHelpMessage = function (evt) 
		{
			//trace("_dragOverHelpMessage :" + this);

			evt.stopPropagation();
			evt.preventDefault();
			
			evt.dataTransfer.dropEffect = "move";
			return false;
		};

		
		
		/*
		 * guide 컴포넌트에 dragleave event발생시 호출 
		 */    
		_pExtFileUpload._dragLeaveGuide = function (evt) 
		{
			//guideComp 보다 z-order가 상위인 컴포넌트에 마우스가 이동하면 dragleave 이벤트가 발생한다.
			//이를 제어하기 위해서 guideComp의 clientX, clientY영역 내부일 경우에는 동작을 중지 시킨다.
			var cx = evt.clientX;
			var cy = evt.clientY;
			var pThis = this._pExtFileUploadTarget;
			var guideComp = pThis.guideComp;
			//showmodal과 같은 상황에서 좌표를 계산하기 위한 처리.
			var convertXY = Eco.XComp.PositionSize.convertXY(application.mainframe,[0,0], guideComp);
			var convertX   = convertXY[0];
			var convertY    = convertXY[1];			
			
			if(cx <= convertX || cy <= convertY){
				//trace("\n*** 숨기기 0: _dragLeaveGuide x left:" + cx +  "<=" + convertX + " , y top:" + cy+  "<=" + convertY);
				evt.stopPropagation();
				evt.preventDefault();  
				
				pThis.helpMessage.set_visible(false);
				
				return;
			}
			
			
			var size = Eco.XComp.PositionSize.getContentSize(guideComp);
			
			var rcLeft   = guideComp.getOffsetLeft();
			var rcTop    = guideComp.getOffsetTop();			
			var rcRight  = size[0] - rcLeft + convertX;
			var rcBottom = size[1] - rcTop + convertY;	

//			trace("---convertX="+convertX +", convertY="+convertY); 
//			trace("A  x left:" + cx +" <= "+ rcLeft + " || y top:" + cy  +" <= "+ rcTop);
//			trace("B  x right: " + cx +" >= "+ rcRight + " || y bottom:" + cy  +" >= "+ rcBottom);
			
			//스크롤바 영역이 존재할 경우 해당영역을 빼줘야 한다. event 발생안함.
			var vscrollbar = guideComp["vscrollbar"];
			var hscrollbar = guideComp["hscrollbar"];
			if(!Eco.isEmpty(vscrollbar)) {
				if(vscrollbar.visible) {
					rcRight -= vscrollbar.width; 
					//trace("  -> vscrollbar.width=" + vscrollbar.width );
				}
			}
			
			if(!Eco.isEmpty(hscrollbar)) {
				if(hscrollbar.visible) {
					rcBottom -= hscrollbar.height; 
					//trace("  -> hscrollbar.height=" + hscrollbar.height );
				}
			}    	
			
			
			
			//trace("  -> Last Guide Area: left=" + rcLeft + ", top="  + rcTop + ", rcRight=" + rcRight + ", rcBottom="  + rcBottom );

			if( cx <= rcLeft || cx >=rcRight ) {
				pThis.helpMessage.set_visible(false);
				
//				var objDate = new Date();
//				var nMs = objDate.getMilliseconds();			
//				trace("숨기기 1 :" + nMs);					
			}
			
			if( cy <= rcTop || cy >=rcBottom ) {
				pThis.helpMessage.set_visible(false);
				
//				var objDate = new Date();
//				var nMs = objDate.getMilliseconds();			
//				trace("숨기기 2 :" + nMs);					
			}

			
			evt.stopPropagation();
			evt.preventDefault();
		};    
		
	 
		
		_pExtFileUpload._dragEnterAddFiles = function (evt) 
		{
			trace("_dragEnterAddFiles :" + this);
			
			evt.stopPropagation();
			evt.preventDefault();
		};
		
		_pExtFileUpload._dragLeaveAddFiles = function (evt) 
		{
			trace("_dragLeaveAddFiles :" + this);
			
			evt.stopPropagation();
			evt.preventDefault();
		};

		
	   
		
		_pExtFileUpload._dropAddFiles = function (evt)
		{
			trace("_dropAddFiles");
			evt.stopPropagation();
			evt.preventDefault();
			
			if (evt.dataTransfer)
			{
				var pThis = this._pExtFileUploadTarget;
				if(pThis)
				{
					pThis.on_fire_onchange(pThis, evt.type, evt.dataTransfer.files);
				}
			}
		};


		
		delete _pExtFileUpload;
    };
    
    
	if (!nexacro.ExtFileDownload)
	{
	
		//==============================================================================
		// nexacro.ExtFileDownload
		//==============================================================================
		nexacro.ExtFileDownload = function (id, parent)
		{
			//UserObject 생성시 처리용
			if (arguments.length == 9) {
				parent = arguments[8];
			}
			
			var position = "absolute";
			nexacro.Component.call(this, id, position, 0,0,0,0, null, null, parent);
			
			// User Property
			this.downloadurl = "";
			this.support = {};
			Eco.object.copyProperties(this.support, nexacro._ExtFileUpDownloadSupport);			
			
			// internal variable  
			this._form = parent;
			this._pExtFileItem;
			//this._accessibility_role = "fileupload";
			
			this._event_list = {
				"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
				"onkillfocus": 1, "onsetfocus": 1, "onmove": 1, "onsize": 1,
				"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
				"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, 
				"onmousemove": 1, "onrbuttondown": 1, "onrbuttonup": 1,
				"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
				"ontap": 1, "ondbltap": 1, "onpinchstart": 1, "onpinch": 1, "onpinchend": 1,
				"onflingstart": 1, "onfling": 1, "onflingend": 1,
				"onlongpress": 1, "onslidestart": 1, "onslide": 1, "onslideend": 1,
				
				// added event
				"onloadstart": 1, "onprogress": 1, "onload": 1, 
				"onloadend": 1, "onsuccess": 1, "onerror": 1, "onchange": 1,
				"onreadystatechange": 1 // <== XMLHttpRequest readystatechange
			};
		};

		var _pExtFileDownload = nexacro._createPrototype(nexacro.Component);
		nexacro.ExtFileDownload.prototype = _pExtFileDownload;    
		

		_pExtFileDownload._type = "ExtFileDownload";
		_pExtFileDownload._type_name = "ExtFileDownload";    
		
		//==============================================================================
		// nexacro.ExtFileUpDownload : Create & Update & destroy
		//==============================================================================
		_pExtFileDownload.on_create_contents = function ()
		{
			//trace(">> ExtFileDownload on_create_contents ");
		};

		_pExtFileDownload.on_created_contents = function ()
		{
			//trace(">> ExtFileDownload on_created_contents ");
			var ranid = new Date().valueOf().toString();
			nexacro._create_hidden_frame(this._unique_id, ranid, this.on_load, this);    	
		};
		
		_pExtFileDownload.set_downloadurl = function (v)
		{
			if (v != this.downloadurl)
			{
				this.downloadurl = v;
			}
		};    
		

		/*
		 * download file
		 * @param {=string} url 다운로드 fullPath url
		 * @param {string} filename 파일저장시 적용할 file name. 지원가능한 브라우저만 적용됨.
		 * @return {boolean} 다운로드 성공여부
		 */  		 
		_pExtFileDownload.download = function (url, filename)
		{
		
			if(Eco.isEmpty(filename))
			{
				alert("file name required.");
				return false;
			}
					
			var downloadurl;
			var rtn = false;
			
			if (!url)
			{
				downloadurl = application._getServiceLocation(this.downloadurl);
			}
			else
			{
				downloadurl = application._getServiceLocation(url);
			}
			
			if (downloadurl)
			{
				trace("\n다운로드 시작");
				var loadItem = new nexacro.ExtFileTransaction(downloadurl, "download", this._form);
				
				loadItem._downfilename = filename;
				//loadItem.on_start();
				
				if (this.support.XHR2 && (this.support.Download || this.support.MSSave))
				{
					trace("ExtFileUploadSupport.XHR2 지원");		
					
					loadItem.appendCallback(this, this.on_load_filemodule);
					
					this._startCommunication(loadItem, downloadurl, "", filename);
					rtn = true;
				}
				else
				{
					trace("ExtFileUploadSupport.XHR2 미지원");
					nexacro._download(downloadurl);
					rtn = true;
					
					if (loadItem._usewaitcursor)
						loadItem._hideWaitCursor();
				}
			}
			
			return rtn;
		};    
		
		
		_pExtFileDownload._startCommunication = function (loadItem, url, data, fileId)
		{
			//user protocol        
			var path = url;
			var senddata = data;
			//trace("_startCommunication > loadItem._protocol=" + loadItem._protocol);
			
			if (loadItem._protocol < 0)
			{  
				var createadaptor = false;
				var protocoladp = application._getProtocol(loadItem.protocol);
				if (!protocoladp)
				{
					trace("loadItem.protocol="+loadItem.protocol);
					
					var adptorclass = nexacro._executeEvalStr(loadItem.protocol);
					
					trace("loadItem.protocol=" + loadItem.protocol);
					trace("adptorclass="+adptorclass);                
					
					// adptorclass.
					if (adptorclass)
					{
						protocoladp = new adptorclass;
						createadaptor = true;
					}
				}

				if (protocoladp)
				{
					if (createadaptor && protocoladp.initialize)
					{
						protocoladp.initialize(url);
						application._addProtocol(loadItem.protocol, protocoladp);
					}

					var protocol = protocoladp.getUsingProtocol(url);
					var sep = path.split("://");
					if (sep)
					{
						path = protocol + "://" + sep[1];
					}

					// encode             
					if (data && protocoladp.encrypt)
					{
						senddata = loadItem.on_encrypt(data);
					}

					// extra header 정보 
					if (protocoladp.getCommunicationHeaders)
					{
						var headers = protocoladp.getCommunicationHeaders(url);
						if (headers)
							loadItem._addCookieFromVariables(headers);
					}
				}
			}

			this.__startCommunication(loadItem, path, senddata, fileId);
		};
		
		_pExtFileDownload.__startCommunication = function (loadItem, path, senddata, fileId)
		{   
			var _ajax = nexacro.__createHttpRequest();
			var ajax_handle = _ajax._handle;

			// parse protocol       
			if (path.indexOf("://") > -1)
			{
				var ar = path.split("://");
				var protocol = ar[0];
				switch (protocol)
				{
					case "http": _ajax._protocol = 0; break;
					case "https": _ajax._protocol = 1; break;
					case "file": _ajax._protocol = 2; break;
					default: _ajax._protocol = -1; break;
				}
			}
			
			var method = "GET";        
			var mime_xml = false;

			ajax_handle._pExtFileTarget = this;
			ajax_handle._pExtFileItem = loadItem;
			
			
			/*
			readystatechange : The readyState attribute changes value
			
				type    :           Description         :     Times     :               When
			---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			loadstart   :   Progress has begun.         :  Once.        :   First.
			progress    :   In progress.                :  Zero or more.:   After loadstart has been dispatched.
			error       :   Progression failed.         :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			abort       :   Progression is terminated.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			load        :   Progression is successful.  :  Zero or once.:   After the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
			loadend     :   Progress has stopped.       :  Once.        :   After one of error, abort, or load has been dispatched.
			*/
				nexacro._observeSysEvent(ajax_handle, "loadstart", "onloadstart", this._makeLoadstartHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "progress", "onprogress", this._makeProcessHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "load", "onload", this._makeLoadHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "loadend", "onloadend", this._makeLoadendHandler(this, fileId, loadItem));
				nexacro._observeSysEvent(ajax_handle, "error", "onerror", this._makeErrorHandler(this, fileId, loadItem));
				
				//XHR 에러처리용.
				//신규추가. 2014.10.20 
				nexacro._observeSysEvent(ajax_handle, "readystatechange", "onreadystatechange", this._makeReadystateChangeHandler(this, fileId, loadItem.type));
				nexacro._observeSysEvent(ajax_handle, "abort", "onabort", this._makeTransferCanceledHandler(this, fileId));
				
			
			try 
			{            
				ajax_handle.open(method, path, true);
				ajax_handle.responseType = "blob";
				
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}
			
			if (mime_xml)
			{
				ajax_handle.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax_handle.setRequestHeader("Accept", "application/xml, text/xml, */*");
			}
			
			try 
			{
				ajax_handle.send(senddata ? senddata : null);
			}
			catch (e)
			{
				this.on_fire_onerror(this, e.number, e.message, ajax_handle, fileId, loadItem.type);
			}       

			_ajax = null;
		};
		 
		
		/*
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @return {function} closure of on_load_filemodule
		 */
		_pExtFileDownload._makeLoadFileModule = function (pThis, pFileId) {
			return function(type, code, msg, url) {
				pThis.on_fire_onload(type, code, msg, url, pFileId);
			};
		};    
		
		/*
		 * 개별 파일 전송 처리를 위한 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onprogress
		 */
		_pExtFileDownload._makeProcessHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onprogress(pThis, pLoadItem.type, evt, pFileId);
			};
		};
		

		/*
		 * 전송 시작시 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadstart
		 */
		_pExtFileDownload._makeLoadstartHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				pThis.on_fire_onloadstart(pThis, pLoadItem.type, evt, pFileId);
			};
		};
		
		/*
		 * 전송이 성공 했을 때 발생.
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onload
		 */    
		_pExtFileDownload._makeLoadHandler = function (pThis, pFileId, pLoadItem) {

			return function(evt) {
				var itemType = pLoadItem.type;
				
				//trace("_bindLoadHandler:" + pThis + ",pLoadItem:" + pLoadItem + ",evt:" + evt.type + ",itemType:" + itemType + ",responseType:" + this.responseType);
				
				if (this.readyState == 4 && this.status == 200) 
				{
					var cookie = "";
					if (pLoadItem.context)
					{
						cookie = pLoadItem.context._getWindow()._doc.cookie;
					}
					
					var data;
					if (itemType == "upload")
					{
						data = this.responseText || "";
						pLoadItem.on_load_file(data, cookie, this.status, this.statusText);
					}
					else if (itemType == "download")
					{
						if (this.responseType == "blob")
						{
							data = this.response;
							pLoadItem.on_down_file(data, pThis._unique_id, cookie, this.status, this.statusText);
						}
						else
						{
							var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
							pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
						}
					}
				}
				else
				{
					var errormsg = nexacro._GetSystemErrorMsg(this, "0x80010040");
					pThis.on_fire_onerror(pThis, "0x80010040", errormsg, this, pFileId, pLoadItem.type);
				} 
			};
	   
		};    
		
		
		
		/*
		 * 전송 완료 체크용(성공과 실패에 무관하게 발생함!) closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of onloadend
		 */    
		_pExtFileDownload._makeLoadendHandler = function (pThis, pFileId, pLoadItem) {
			return function(evt) {
				var itemType = pLoadItem.type;
				
				if (itemType == "download")
				{
					if (this.responseType == "blob")
					{
						pLoadItem.on_downend_file();
					}
				}
				
				pThis.on_fire_onloadend(pThis, itemType, evt, pFileId);
				
				pLoadItem = null;
				pthis = null;
				
				if (this.upload._pExtFileTarget) this.upload._pExtFileTarget = null;
				if (this.upload._pExtFileItem) this.upload._pExtFileItem = null;    		
			};

		};
		
		
		/*
		 * 통신에러 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @param {string} type "upload","download"
		 * @return {function} closure of error
		 */        
		_pExtFileDownload._makeErrorHandler = function (pThis, pFileId, pLoadItem, type)
		{
			return function(evt) {
				
				if (pLoadItem._usewaitcursor)
					pLoadItem._hideWaitCursor();
				
				trace("_makeErrorHandler 에서호출");
				pThis.on_fire_onerror(pThis, -1, "File transfer was failure.", pThis, pFileId, pLoadItem.type);    		
			};

		};    
		

		/*
		 * XHR 통신상태 체크용 closure.  2014.10.20 신규추가
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of error
		  
			  Holds the status of the XMLHttpRequest. Changes from 0 to 4: 
				0: request not initialized 
				1: server connection established
				2: request received 
				3: processing request 
				4: request finished and response is ready
			 
			  status
					  　200: "OK"
					  　404: Page not found
						   
					  참고사항: tomcat에서 jsp를 호출하던 중  java.lang.ClassNotFoundException 발생시 
					   500: internal server error 발생!!!  
		 */	          
		_pExtFileDownload._makeReadystateChangeHandler = function (pThis, pFileId, pType)
		{
			//trace("ccc _makeReadystateChangeHandler pFileId="+pFileId + ",pType="+pType);
			return function(evt) {
				var xhrUpload = evt.target;
				//trace("readyState=" + xhrUpload.readyState + ", status=" + xhrUpload.status);
				//trace("ddd  _makeReadystateChangeHandler pFileId="+pFileId + ",pType="+pType);
				
				pThis.on_fire_onreadystatechange(pThis, xhrUpload.readyState, xhrUpload.status, pFileId, pType);    		
			};
		};      
		
		/*
		 * 전송취소 체크용 closure
		 * @param {ExtFileUpload} pThis ExtFileUpload
		 * @param {string} pFileId file id
		 * @param {FileTransaction} pLoadItem FileTransaction
		 * @return {function} closure of TransferCanceled
		 */      
		_pExtFileDownload._makeTransferCanceledHandler = function (pThis, pFileId)
		{
			return function(evt) {
				alert(pFileId + ". 사용자에 의해 전송이 취소되었습니다.");
			};
		};        
		
		_pExtFileDownload.on_load_filemodule = function (type, code, msg, url)
		{
			trace("  _pExtFileDownload >>>> on_load_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url);
			this.on_fire_onload(type, code, msg, url);
		};    
		
		
		_pExtFileDownload.on_loadframe_filemodule = function (type, code, msg, url)
		{
			//trace("on_loadframe_filemodule type:" + type + ",code:" + code + ",msg:" + msg + ",url:" + url);
			this.on_fire_onload(type, code, msg, url);
		};    
		
		_pExtFileDownload.on_load = function (target)
		{
			var pLoadItem = this._pExtFileItem;    
			if (pLoadItem)
			{
				pLoadItem.on_loadframe_file(this._unique_id, target);
				pLoadItem = null;
			}
		};
		
		// ==============================================================================
		// _pExtFileDownload : Event Handlers
		// ==============================================================================
		/*
		 * XMLHttpRequest readystatechange event
		 * @param {string} type "upload" or "download"
		 */
		_pExtFileDownload.on_fire_onreadystatechange = function (obj, readyState, status, fileId, type) 
		{

			if (this.onreadystatechange && this.onreadystatechange._has_handlers)
			{   
				var evt = new nexacro.ExtFileReadystateChangEventInfo(obj, "readystatechange", readyState, status);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				this.onreadystatechange._fireEvent(this, evt);
			}
		};    
		
		_pExtFileDownload.on_fire_onloadstart = function (obj, type, evt, fileId)
		{
			if (this.onloadstart && this.onloadstart._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadstart", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onloadstart", this.fileComp_onloadstart, this);
				this.onloadstart._fireEvent(this, evt);
			}
		};    
		
		_pExtFileDownload.on_fire_onerror = function (obj, errorcode, errormsg, errorobj, fileId, type)
		{
			//trace("\n\n\non_fire_onerror 호출 errorcode=" + errorcode + ", errormsg="+errormsg );
			var errormsg = nexacro._GetSystemErrorMsg(this, errorcode);
			if(Eco.isEmpty(errormsg)) {
				errorcode = errorobj.status;
				errormsg = errorobj.statusText;
			}  
			
			if (this.onerror && this.onerror._has_handlers)
			{
				var evt = new nexacro.ExtFileErrorEventInfo(obj, "onerror", errorcode, errormsg, errorobj);
				evt["fileId"] = fileId;
				evt["type"] = type;
				
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onerror", this.fileComp_onerror, this);            
				return this.onerror._fireEvent(this, evt);
			}
			
			return true;
			
		};  
		
		
		_pExtFileDownload.on_fire_onprogress = function (obj, type, evt, fileId)
		{
			if (this.onprogress && this.onprogress._has_handlers)
			{
				var evt = new nexacro.Event.ExtFileProgress(obj, "onprogress", type, evt.lengthComputable, evt.loaded, evt.total, fileId);
				// UI에서 아래 소스로 정의된 function이 실행된다.
				//  comp.addEventHandler("onprogress", this.fileComp_onprogress, this);
				this.onprogress._fireEvent(this, evt);
			}
		};    
		
		_pExtFileDownload.on_fire_onload = function (type, code, msg, url, fileId)
		{
			if (this.onload && this.onload._has_handlers && url != "about:blank")
			{
				 //var evt = new nexacro.ExtFileLoadEventInfo(this, "onload", type, code, msg, url);
				var evt = new nexacro.ExtFileLoadEventInfo(this, "onsuccess");
				evt["fileId"] = fileId;
				evt["type"] = "download";
				evt["errorcode"] = code;
				evt["errormsg"] = msg;
				evt["url"] = url;				 
				 return this.onload._fireEvent(this, evt);
			}
		};
		
		_pExtFileDownload.on_fire_onloadend = function (obj, type, evt, fileId)
		{
			if (this.onloadend && this.onloadend._has_handlers)
			{   
				var evt = new nexacro.Event.ExtFileProgress(obj, "onloadend", type, evt.lengthComputable, evt.loaded, evt.total);
				evt["fileId"] = fileId;
				this.onloadend._fireEvent(this, evt);
			}
		};    
		
		delete _pExtFileDownload;
    
    };
    
    
    /* file 전송용 transaction item
     * @param {string} path upload url
     * @param {string} type "upload" or "download"
     * @param {object} context context
     * @param {string} inDatasetsParam input datasets string. ex) ds_input=ds_input....
     * @param {string} outDatasetsParam output datasets string. ex) ds_output=ds_output.... 
     * @param {number} datatype data 전송방식. 0:XML, 1:Binary(Runtime only), 2:SSV
     */
    nexacro.ExtFileTransaction = function (path, type, context, inDatasetsParam, outDatasetsParam, datatype)
    {
        nexacro.CommunicationItem.call(this, path, type, false);

        this.context = context;
        this.inputDatasets = this._parseDSParam(inDatasetsParam);
        this.outputDatasets = this._parseDSParam(outDatasetsParam);
        //this.parameters = this._parseVarParam(argsParam);
        
        this.datatype = (!datatype ? 0 : datatype); // datatype => 0:XML, 1:Binary(Runtime only), 2:SSV
        this._sendData = this._serializeData();
        
        //trace(inDatasetsParam + "\n, this._sendData="+this._sendData);
        
        this._usewaitcursor = application.usewaitcursor;
        
        this._remain_data = null;
        
		if (nexacro.Browser == "IE" && nexacro.BrowserVersion < 9)
		{
		    this._check_responseXML = true; // read responseXML.
		}
		else
		{
		    this._check_responseXML = false; // do not read responseXML.
		}        
        
    };
    
    var _pFileTransaction = nexacro._createPrototype(nexacro.CommunicationItem);
    nexacro.ExtFileTransaction.prototype = _pFileTransaction;
    
    _pFileTransaction._type = "ExtFileTransaction";
    _pFileTransaction._type_name = "ExtFileTransaction";
    
    
    _pFileTransaction._serializeData = function ()
	{
	    if (this.datatype == 1) // BIN (Runtime Only)
	    {
	        return this.__serializeBIN();
	    }
	    else if (this.datatype == 2) // SSV
	    {
	        return this.__serializeSSV();
	    }
	    else
	    {
	        return this.__serializeXML();
	    }
    	
	};    
	
	_pFileTransaction._TABS = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t"];
	_pFileTransaction._writeData = function (list, str, depth) 
	{
		list[list.length] = this._TABS[depth] + str;
	};
	
	
	_pFileTransaction.__serializeXML = function () 
	{
		var depth = 0;
		var list = [];
        var cookievar = application._cookie_variables;
        
        //[START] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		this._writeData(list, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>", depth);
		this._writeData(list, "<!DOCTYPE p_nexacro [ <!ENTITY nbsp '&#160;'> <!ENTITY quot '&#34;'>" +
				" <!ENTITY amp '&#38;'> <!ENTITY lt '&#60;'> <!ENTITY gt '&#62;'> ]>", depth);
		//[END] xml 통신시 아래의 특수문자가 서버쪽 SAX parser 에러가 발생해서 임시 추가함.
		
		this._writeData(list, "<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\">", depth++);
		
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
		    argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
		    cookievarCnt = cookievar.length;
		}

		if (argParamsCnt > 0 || cookievarCnt > 0) 
		{
			this._writeData(list, "<Parameters>", depth++);
			
			if (cookievarCnt)
			{
				for (var i = 0; i < cookievarCnt; i++)
				{
					var id = cookievar[i];
					var val = application[id];

					if (val && val.length) 
					{
						val = nexacro._encodeXml(val);
						this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
					} 
					else 
					{
						this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
					}
				}
			}
			if (argParamsCnt > 0)
			{
				for (var i = 0; i < argParamsCnt; i++)
				{
					var id = argParams[i].lval;
					var val = argParams[i].rval;

					if (val && val.length) 
					{
						val = nexacro._encodeXml(val);
						this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
					} 
					else 
					{
						this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
					}
				}
			}
			this._writeData(list, "</Parameters>", --depth);
		} 
		else 
		{
			this._writeData(list, "<Parameters />", depth);
		}
		
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (i = 0; i < datasetCnt; i++)
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);
				if (ds) 
				{
					list.push(ds._saveXML(datasetParams[i].lval, datasetParams[i].saveType, depth, false));
				}
			}
		}		
		this._writeData(list, "</Root>", --depth);

		var rntVal;

		if (argParamsCnt == 0 && cookievarCnt == 0 && (!datasetParams || datasetParams.length == 0))
		{
		    rntVal = "";
		}
		else
		{
		    rntVal = list.join("\n");
		}
		
		return rntVal;
	};    
	
	
	_pFileTransaction.__serializeSSV = function ()
	{
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);

		var depth = 0;
		var list = [];
        var cookievar = application._cookie_variables;
		var id, val, ds;
        
		var listLength = 0;
		list.push("SSV:utf-8" + _rs_);
		
		// Variables
		var argParamsCnt = 0;
		var cookievarCnt = 0;
		
		var argParams = this.parameters;
		if (argParams)
		{
		    argParamsCnt = argParams.length;
		}
		if (cookievar)
		{
		    cookievarCnt = cookievar.length;
		}
			
		if (cookievarCnt > 0)
		{
			for (i = 0; i < cookievarCnt; i++) 
			{
				id = cookievar[i];
				val = application[id];

				if (val && val.length) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		if (argParamsCnt > 0)
		{
			for (i = 0; i < argParamsCnt; i++) 
			{
				id = argParams[i].lval;
				val = argParams[i].rval;

				if (val) 
				{
					val = val;
					list.push(id + "=" + val + _rs_);
				} 
				else 
				{
					list.push(id + "=" + _rs_);
				}
			}
		}
		
		// Dataset
		var datasetParams = this.inputDatasets;
		if (datasetParams && datasetParams.length) 
		{
			var datasetCnt = datasetParams.length;
			for (var i = 0; i < datasetCnt; i++) 
			{
				var id = datasetParams[i].rval;
				var ds = this.context._getDatasetObject(id);   
				if (ds) 
				{
					list.push(ds.saveSSV(datasetParams[i].lval, datasetParams[i].saveType));
				}
			}	
		}
		
		var rtnVal = list.join("");
		return rtnVal;
	};
	
	_pFileTransaction.__serializeBIN = function ()
	{
	    var ssvdata = this.__serializeSSV();
	    if (ssvdata)
	    {
	        return nexacro._convertStreamSSVToBIN(ssvdata);
	    }
	    return "";
	};	
	
    _pFileTransaction.on_start = function ()
    {
        if (this._usewaitcursor)
        {
            this._showWaitCursor();
        }
    };
    
    _pFileTransaction.on_load_file = function (data, cookie, status, statusText)
    {
        //trace("\n\non_load_data:" + data + ", cookie:" + cookie + ", status:" + status + ", statusText:" + statusText);
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
        }
        
	    if (!data)
	    {
	        return [-1, "Stream Data is null!"];
	    }

        data = data.trim();
	    var fstr = data.substring(0, 3);
		
        var result, i, 
            id, val,
            code = 0, msg = "";

		//신규 추가	
		var scope = this.scope;
		if(!scope["_extFileDsPool"]) {
			scope["_extFileDsPool"] = [];
		}
				
		var datasetPool = scope["_extFileDsPool"];
		
		
	    if (fstr == "SSV") // SSV Type (HEX:53,53,56)
	    { 
			//trace("\n\n\t==== HTML5 SSV 처리 시작 ===");
			
	        result = this.__deserializeSSV(data);			
            code = result[0];
            msg = result[1] + "[" + status + "," + statusText + "]";
			
			//trace("\n\n\t====  SSV 끝 ===");
			
			
			
	    } 
		else //XML Type
		{
			//trace("\n\n\t==== HTML5 XML 처리 시작 ===");
			result = this._deserializeXMLFromStr(data);
			code = result[0];
			msg = result[1] + "[" + status + "," + statusText + "]";			
			
			//trace("\n\n\t====  XML 끝 ===");
        }		

        //신규추가
		var datasets = [];
		var len = datasetPool.length;
		var ds;
		for(var i=0; i<len; i++) {
			ds = datasetPool[i];
			if(ds["_used"]) {
				datasets.push(ds);
				//trace("반환값: " + ds.saveXML());
			}
		}		
		
		
		delete nexacro._CommunicationManager[this.path];
		
		
		
		
        if (this._protocol < 0)
            data = this.on_decrypt(data);  

        this._addCookieToGlobalVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false) {
                    item.callback.call(target, this.type, code, msg, this.path, datasets);
				}
            }
			
            callbackList.splice(0, n);
			
			this.releaseResponseDataset(scope);
        }
        //this._handle = null;       
    };
    
    _pFileTransaction.on_loadframe_file = function (unique_id, target)
    {
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
       	}
        
        var i, id, 
            val, xmldoc,
            result, variables,
            datasets, form,
            code = 0, msg = "";
        
        form = this.context;
        xmldoc = nexacro._getXMLDocument(unique_id);
        result = nexacro._getCommDataFromDom(xmldoc, this);
        
        variables = result[0];
        for (i = 0; i < variables.length; i++)
        {
            id = variables[i]["id"];
            if (id && id.length)
            {
                val = variables[i]["val"];
                if (id == "ErrorCode")
                {
                    code = parseInt(val, 10);
                    if (!isFinite(code))
                    {
                        code = -1;
                    }
                }
                else if (id == "ErrorMsg")
                {
                    msg = val;
                }
            }
        }
        
		
        delete nexacro._CommunicationManager[this.path];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
				    //IE 8,9에서 onsuccess event의 e.datasets에서 수신하기 위해 별도 추가. 2015.03.16
                    item.callback.call(target, this.type, code, msg, this.path, result[1]);
            }
            callbackList.splice(0, n);
        }
    };
    
    _pFileTransaction.on_down_file = function (data, unique_id, cookie, status, statusText)
    {
        //trace("on_down_file data.size:" + data.size + ", cookie:" + cookie + ",_downfilename:" + this._downfilename + ", status:" + status + ", statusText:" + statusText);
        var url,
            saveFilename = this._downfilename;
        
        if (nexacro._ExtFileUpDownloadSupport.Download)
        {
            url = this._createObjectURL(data); // response is a blob
            this._downfileblob = url;
            
            var manager = nexacro._IframeManager;
            var form = manager.search_form(unique_id);
            if (form && form.node)
            {
                var node = form.node;
                var doc = nexacro._managerFrameDoc;
                var ahref = doc.createElement("a");
                ahref.href = url;
                ahref.download = saveFilename;
                ahref.style.display = "none";
                
                //node.appendChild(ahref);
                nexacro.__appendDOMNode(node, ahref);
                ahref.click();
                
                nexacro.__removeDOMNode(node, ahref);
                ahref = null;
            }
        }
        else if (nexacro._ExtFileUpDownloadSupport.MSSave)
        {
            window.navigator.msSaveOrOpenBlob(data, saveFilename);
        }
        else
        {
            nexacro._download(this.path);
        }
        
        delete nexacro._CommunicationManager[this.path];
        
        if (this._protocol < 0)
            data = this.on_decrypt(data);   

        this._addCookieToGlobalVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                    item.callback.call(target, this.type, status, statusText, this.path);
            }
            callbackList.splice(0, n);
        }
    };
    
    _pFileTransaction.on_downend_file = function ()
    {
        //trace("on_downend_file _downfileblob url:" + this._downfileblob + ",_downfilename:" + this._downfilename);
        
        var url = this._downfileblob,
        	pThis = this;
        
		if (nexacro._ExtFileUpDownloadSupport.Download && url)
        {
			setTimeout( function () {
				pThis._revokeObjectURL(url);
			}, 250);
		}
        
        if (this._usewaitcursor)
        {
        	this._hideWaitCursor();
        }
        
        this._downfileblob = null;
        this._downfilename = null;
    };
    
    _pFileTransaction._createObjectURL = function (blob)
    {
        if (window.webkitURL)
        {
            return window.webkitURL.createObjectURL(blob);
        } 
        else if (window.URL && window.URL.createObjectURL) 
        {
            return window.URL.createObjectURL(blob);
        } 
        else 
        {
            return null;
        }
    };
    
    _pFileTransaction._revokeObjectURL = function (url)
    {
        if (window.webkitURL)
        {
            window.webkitURL.revokeObjectURL(url);
        } 
        else if (window.URL && window.URL.revokeObjectURL) 
        {
            window.URL.revokeObjectURL(url);
        }
    };
	
	
	_pFileTransaction.__deserializeSSV = function (strRecvData) 
	{
		//trace("HTML5__deserializeSSV 호출");
		var _rs_ = String.fromCharCode(30);
		var _cs_ = String.fromCharCode(31);
		
		var code = 0;
		var message = "SUCCESS";

		if (!strRecvData)
		{
		    return [-1, "Stream Data is null!"];
		}
		
		var form = this.context;

		var ssvLines = strRecvData.split(_rs_);
		var lineCnt = ssvLines.length;
		var curIdx = 0;	    
		curIdx++;

		var curStr;

	    // parse parameters		
		for (; curIdx < lineCnt; curIdx++)
		{
		    curStr = ssvLines[curIdx];
		    if (curStr.substring(0, 7) != "Dataset")
		    {
		        var paramArr = curStr.split(_cs_);
		        var paramCnt = paramArr.length;
		        for (var i = 0; i < paramCnt; i++)
		        {
		            var paramStr = paramArr[i];
		            var varInfo = paramStr;
		            var val = undefined;
		            var sep_pos = paramStr.indexOf("="); 
		            if (sep_pos >= 0)
		            {
		                varInfo = paramStr.substring(0, sep_pos);
		                val = paramStr.substring(sep_pos + 1);
		            }

		            if (varInfo)
		            {
		                var id = varInfo;
		                var sep_pos = varInfo.indexOf(":");
		                if (sep_pos >= 0)
		                {
		                    id = varInfo.substring(0, sep_pos);
		                }

		                if (id == "ErrorCode")
		                {		                    
		                    code = parseInt(val) | 0;
		                    if (isFinite(code) == false)
		                    {
		                        code = -1;
		                    }
		                }
		                else if (id == "ErrorMsg")
		                {
		                    message = val;
		                }
		                else if (id in form)  //1.form(application) variable 
		                {
		                    if (typeof (form[id]) != "object")
		                    {
		                        form[id] = val;
		                    }
		                }
		                else //application globalvariable 
		                {
		                    if (application._existVariable(id))
		                    {
		                        application[id] = val;
		                    }
		                }
		            }
		        }
		    }
		    else
		    {
		        break;
		    }
		}

		if (code <= -1)
		{
		    return [code, message];
		}

		var inDatasets = this.inputDatasets;
		if (inDatasets && inDatasets.length) 
		{
			var inDataCnt = inDatasets.length;
			for (var i = 0; i < inDataCnt; i++)
			{
				var param = inDatasets[i];
				var ds = form._getDatasetObject(param.rval);  
				if (ds) 
				{
					ds.applyChange();					
				}
			}
		}

		var dsIds = {};
		var outDatasets = this.outputDatasets;
		if (outDatasets && outDatasets.length) 
		{
			var outDataCnt = outDatasets.length;
			//trace("@step 3-3 outDataCnt="+outDataCnt);
			for (var i = 0; i < outDataCnt; i++)
			{
				var param = outDatasets[i];
				if (dsIds[param.rval] == undefined)
				{
					//trace("@step 3-5 param.rval="+param.rval + ",param.lval="+param.lval );
				    dsIds[param.rval] = param.lval;
				}
			}
		}

		function find_next_dataset_loop()
		{
			if (curIdx < lineCnt)
			{
				curStr = ssvLines[curIdx];
				if (curStr.substring(0, 7) == "Dataset")
				{
				    return true;
				}
				curIdx++;
				return false;
			}
			return true;
		}

		while (curIdx < lineCnt)
		{
			while (true)
			{
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;
				if (find_next_dataset_loop()) break;				

			}
			
			if (curIdx < lineCnt)
			{
				var sep_pos = curStr.indexOf(":");
				if (sep_pos >= 0)
				{
					var remoteId = curStr.substring(sep_pos + 1);
					if (remoteId && remoteId.length) 
					{
						//var localId = dsIds[remoteId];
						//var ds = form._getDatasetObject(localId);	 			
						
						var ds = this.getResponseDataset(form);
						trace("@step 10 remoteId=" + remoteId + ", ds="+ds);
						
						if (ds)
						{
						    ds.rowposition = -1;
							curIdx = ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true);
						}
						else
						{
							curIdx++;
						}
					}
					else
					{
						curIdx++;
					}
				}
				else
				{
					curIdx++;
				}
			}
		}

		return [code, message];
	};	
	
	
	
	/*
	 * 엑셀 sheet 갯수에 해당하는 output dataset 개수 만큼
	 * 동적생성 후 반환한다.
	 */
	_pFileTransaction.getResponseDataset = function (scope) {
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var ds;
		var tempDs;
		var isUsed;
		var uidPrefix = "_ds_extResponse_"; 
		
		for(var i=0; i<size; i++)
		{		
			tempDs = datasetPool[i];
			isUsed = tempDs["_used"];
			
			if(!isUsed)
			{
				ds = tempDs;
				ds["_used"] = true;
				break;
			}			
		}
		
		
		if(!ds)
		{
			var uid = Eco.getSequenceId(scope, uidPrefix);
			ds = new Dataset(uid);
			
			ds["_used"] = true;
			datasetPool.push(ds);
		}

		return ds;			
	
	};	
	
	
	_pFileTransaction.releaseResponseDataset = function (scope) {
		//trace("★★★  releaseResponseDataset 호출 !!!");
		
		var datasetPool = scope["_extFileDsPool"];
		var size = datasetPool.length;
		var tempDs;
		var isUsed;
		
		for(var i=0; i<size; i++)
		{
			tempDs = datasetPool[i];
			tempDs.clear();
			tempDs["_used"] = false;
		}	

	};	
    
    _pFileTransaction._deserializeXMLFromStr = function (strRecvData)
    {
        var code = 0;
        var message = "SUCCESS";

        if (!strRecvData)
        {
            return [-1, "Stream Data is null!"];
        }

        var form = this.context;

        // parse params
        var xml_parse_pos = strRecvData.indexOf("<Dataset ");
        var headerData;
        if (xml_parse_pos > -1)
        {
            headerData = strRecvData.substring(0, xml_parse_pos);
        }
        else
        {
            headerData = strRecvData;
        }

        var head_parse_pos = 0;
        var paramsInfo = nexacro._getXMLTagData(headerData, head_parse_pos, "<Parameters>", "</Parameters>");
        if (paramsInfo)
        {
            var paramsData = paramsInfo[0];
            head_parse_pos = paramsInfo[3];

            var param_parse_pos = 0;
            var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            while (varInfo)
            {
                param_parse_pos = varInfo[3];
                var attrStr = varInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var val = varInfo[0];

                    if (id == "ErrorCode")
                    {
                        //code = parseInt(val) | -1;
                        code = parseInt(val) | 0;
                        if (isFinite(code) == false)
                        {
                            code = -1;
                        }
                    }
                    else if (id == "ErrorMsg")
                    {
                        message = val;
                    }
                    else
                    {
                        this._setParamter(id, val);
                    }
                }
                
                // for Next
                varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            }
        }

        if (code <= -1)
        {
        	return [code, message];
        }
        
		
        //outDatasets 처리
        var dsIds = {};
        var outDatasets = this.outputDatasets;
		//trace("\n\noutDatasets="+outDatasets);
        if (outDatasets && outDatasets.length)
        {
            var outDataCnt = outDatasets.length;
            for (var i = 0; i < outDataCnt; i++)
            {
                var param = outDatasets[i];
				//trace(" >>>>> param.lval="+param.lval + ", param.rval="+param.rval);
                if (dsIds[param.rval] == undefined){
                    dsIds[param.rval] = param.lval;
				}
            }
        }

        // data set parse
        if (xml_parse_pos >= -1)
        {
            var datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            while (datasetInfo)
            {
                xml_parse_pos = datasetInfo[3];
                var attrStr = datasetInfo[1];
                var remoteId = nexacro._getXMLAttributeID(attrStr);
                if (remoteId && remoteId.length)
                {
                    //var localId = dsIds[remoteId];
					//var ds = form._getDatasetObject(localId);
					
					var ds = this.getResponseDataset(form);
                    if (ds)
                    {
                        ds.loadFromXMLStr(datasetInfo[0]);
                    }
                }
                
                // for Next
                datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            }
        }

		dsIds = null;
        return [code, message];
    };
    
    
    _pFileTransaction._parseVarParam = function (paramStr) 
	{
	    if (!paramStr)
	    {
	        return;
	    }

		paramStr = paramStr.replace(/^\s*|\s*$/g, '');
		if (paramStr.length == 0)
		{
			return undefined;
		}

		var list = [];
		var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*="([^"]*)"|([a-zA-Z_][a-zA-Z0-9_]*)\s*='([^']*)'|([a-zA-Z_][a-zA-Z0-9_]*)\s*=([^ ]*)/g;
		
		var splitedParams = paramStr.match(expr);
		var splitedParamCnt = splitedParams.length;
		
		for (var i = 0; i < splitedParamCnt; i++)
		{
			var param = splitedParams[i].split("=");
			var len = param.length;
			var key = param[0].trim();
			var value = param[1].trim();			
			
			for (var j = 2; j < len; j++) 
			{
				value = value + "="+ param[j].trim();
			}
				
			var type = "N";

			var len = value.length;
			if (len > 0) 
			{
			    if ((value.charAt(0) == "\"" && value.charAt(len - 1) == "\"") || (value.charAt(0) == "\'" && value.charAt(len - 1) == "\'"))
				{
					value = value.substring(1, len - 1);
				}
			}

			var paramObj =
			{
				lval: key,
				rval: value,
				saveType: type
			};

			list.push(paramObj);
		}
		return list;
	};	
	
	
    _pFileTransaction._parseDSParam = function (paramStr) 
    {
        if (!paramStr) 
        {
            return undefined;
        }

        var list = [];
        var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\:[aAuUnN])?)/g;
        var splitedParams = paramStr.match(expr);//expr.test(paramStr);
        
        // output ds가 명시되지 않은 경우 리턴
        if (!splitedParams || splitedParams.length == 0)
        {
        	return undefined;
       	}

        var splitedParamCnt = splitedParams.length;
        var listLength = 0;
        
        // TODO 정규표현식의 캡처값 사용, RegExp.exec 사용시 처음 값만 반환됨, 정규식 확인 ?
        for (var i = 0; i < splitedParamCnt; i++)
        {
            var param = splitedParams[i].split("=");
            var key = param[0].trim();
            var value = param[1].trim();            
            
            //동일한 dataset id가 들어오면 무시한다. 
            var bduplicate = false;
            for (var j = 0; j < i; j++) 
            {
                var checkparam = splitedParams[j].split("=");
                var checkkey = checkparam[0].trim();
                 if (key == checkkey)
                     bduplicate = true;
            }           
            if (bduplicate) 
            {
                //continue;
                i++;
                return false;
            }
            
            var type = "N";

            var index = value.indexOf(":");
            if (index > -1) 
            {
                type = value.substring(index + 1);
                value = value.substring(0, index);
            }

            var paramObj = 
            {
                lval: key,
                rval: value,
                saveType: type
            };
            list.push(paramObj);
        }
        return list;
    };
    
    _pFileTransaction._setParamter = function (id, val)
    {
        var form = this.context;
        //trace("_setParamter form:" + form.name);
        
        // form(application) variable 
        if (id in form) 
        {
            if (typeof (form[id]) != "object")
            {
                form[id] = val;
            }
        }
        else //	application globalvariable 
        {
            if (application._existVariable(id))
            {
                application[id] = val;
            }
        }
    };

    _pFileTransaction._getDataset = function (id)
    {
        var form = this.context;
        var outDatasets = this.outputDatasets;
        if (outDatasets && outDatasets.length)
        {
            var outDataCnt = outDatasets.length;
            for (var i = 0; i < outDataCnt; i++)
            {
                var param = outDatasets[i];
                if (param.rval == id)
                {
                    return form._getDatasetObject(param.lval);
                }
            }
        }
    };
    
    _pFileTransaction._showWaitCursor = function ()
    {
    	// zoo - 확인
    	return;
    	
        var form = this.context;
        if (form)
        {
            form._waitCursor(true, form);
        }
    };
    
    _pFileTransaction._hideWaitCursor = function ()
    {
    	// zoo - 확인
    	return;
    	
        var form = this.context;
        if (form)
        {
            form._waitCursor(false, form);
        }
    };
    
    delete _pFileTransaction;
    
    
    //==============================================================================
    // nexacro.ExtFileButtonCtrl
    //==============================================================================
    nexacro.ExtFileButtonCtrl = function (id, position, left, top, width, height, right, bottom, parent)
    {
        //trace("ExtFileButtonCtrl : " + width + "," + height);
        nexacro.Button.call(this, id, position, left, top, width, height, right, bottom, parent);
        this._is_subcontrol = true;
    };

    var _pExtFileButtonCtrl = nexacro._createPrototype(nexacro.Button);
	//var _pExtFileButtonCtrl = nexacro._createPrototype(nexacro.Component, nexacro.Button);
	//var _pExtFileButtonCtrl = nexacro._createPrototype(nexacro.Component, nexacro.ExtFileButtonCtrl);
	
    nexacro.ExtFileButtonCtrl.prototype = _pExtFileButtonCtrl

	_pExtFileButtonCtrl._type = "ExtFileButtonCtrl";
    _pExtFileButtonCtrl._type_name = "ExtFileButtonCtrl";
    
    
    //==============================================================================
    // nexacro.ExtFileButtonCtrl : Style
    //==============================================================================
    _pExtFileButtonCtrl.on_find_CurrentStyle_background = function (pseudo)
    {
        return this.parent._find_pseudo_obj("buttonbackground", pseudo, "background");
    };
    
    _pExtFileButtonCtrl.on_find_CurrentStyle_gradation = function (pseudo)
    {
        return this.parent._find_pseudo_obj("buttongradation", pseudo, "gradation");
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_border = function (pseudo)
    {
        return this.parent._find_pseudo_obj("buttonborder", pseudo, "border");
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_bordertype = function (pseudo)
    {
        return this.parent._find_pseudo_obj("buttonbordertype", pseudo, "bordertype");
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_padding = function (pseudo)
    {
        var padding = this.parent._find_pseudo_obj("buttonpadding", pseudo, "padding");
        return (padding) ? padding : this._defaultPadding;
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_margin = function (pseudo)
    {
        var margin = this.parent._find_pseudo_obj("buttonmargin", pseudo, "margin");
        return (margin) ? margin : this._defaultMargin;
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_font = function (pseudo)
    {
        var font = this.parent._find_pseudo_obj("buttonfont", pseudo, "font") || this._find_inherit_pseudo_obj("font", pseudo, "font") || nexacro.Component._default_font;
        return font;
    };

    _pExtFileButtonCtrl.on_find_CurrentStyle_color = function (pseudo)
    {
        var color = this.parent._find_pseudo_obj("buttoncolor", pseudo, "color") || this._find_inherit_pseudo_obj("color", pseudo, "color") || nexacro.Component._default_color;
        return color;
    };
    
    _pExtFileButtonCtrl.on_find_CurrentStyle_size = function (pseudo)
    {
        var size = this.parent._find_pseudo_obj("buttonsize", pseudo, "size");
        return (size) ? size : this._defaultButtonsize;
    };
    
    _pExtFileButtonCtrl.on_find_CurrentStyle_text = function (pseudo)
    {
        var text = this.parent._find_pseudo_obj("buttontext", pseudo, "text");
        return (text) ? text : this._defaultButtontext;
    };
    
    
    //==============================================================================
    // nexacro.ExtFileButtonCtrl : Event Handler
    //==============================================================================
    _pExtFileButtonCtrl._isPopupFrame = function ()
    {
        return false;
    };

    delete _pExtFileButtonCtrl;
};
