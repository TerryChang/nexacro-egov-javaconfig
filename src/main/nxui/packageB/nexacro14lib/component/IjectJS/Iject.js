/**
 * @fileoverview 넥사크로  공통 Library
 * @author  copyright 2015 TOBESOFT {J}
 */
if (!JsNamespace.exist("Iject"))
{

	/**
	 * @namespace
	 * @name Iject
	 * @author
	 * @memberof!  Iject
	 * @author  copyright 2015 TOBESOFT {J}
	 */
	JsNamespace.declare("Iject", {

		/**
		 * 공통 Gobal Variable
		 * @private
		 * @memberOf Iject
		 */
		 $ : {},

		/**
		 *ADL 로딩시 초기 설정구성
		 * @param {o} this form
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		appOnload : function(o)
		{
			//adl Frame
			Iject.$["vFrameSet"]      = o.mainframe.VFrameSet;                                			//VFrameSet
			Iject.$["loginFrame"]     = o.mainframe.VFrameSet.LoginFrame; 				   				//LoginFrame
			Iject.$["hFrame"]         = o.mainframe.VFrameSet.HFrameSet;                      			//HFrame
			Iject.$["leftFrame"]      = o.mainframe.VFrameSet.HFrameSet.LeftFrame;            			//leftFrame
			Iject.$["vFrameSet1"]     = o.mainframe.VFrameSet.HFrameSet.VFrameSet1;           			//VFrameSet1
			Iject.$["topFrame"]       = o.mainframe.VFrameSet.HFrameSet.VFrameSet1.TopFrame;  			//TopFrame
			Iject.$["workFrame"]      = o.mainframe.VFrameSet.HFrameSet.VFrameSet1.WorkFrame;            //WorkForm
			Iject.$["mainFrame"]      = o.mainframe.VFrameSet.HFrameSet.VFrameSet1.WorkFrame.MainForm;  //mainform
			Iject.$["mdiFrame"]       = o.mainframe.VFrameSet.MDIFrame;                       			//mdi frame
			Iject.$["httpurl"]        = o.services["svcurl"].url;							  	//trnasaction service url
			Iject.$["framesize"]      = "0,*,42";  		         							  //defualt seperatesize
			Iject.$["loginSize"]      = {width:450,height:290};
			Iject.$["mainframeSize"]  = {width: o.mainframe.width,height: o.mainframe.height};
			Iject.$["gds_menu"]       = o.gds_menu;
			Iject.$["gds_openmenu"]   = o.gds_openMenu;
			Iject.$["ExtCommonPath"]  = (nexacro.Browser =="Runtime" ? system.convertRealPath("%USERAPP%"+"Component/ExtCommonV13.dll") :"");
			Iject.$["userid"] = "";
			Iject.$["usernm"] = "";

			//frame variabel setting
			Iject.$["urlLogin"] = "Frame::Login.xfdl";       //login url setting
			Iject.$["urlLeft"]  = "Frame::LeftFrame.xfdl";    //leftFrame url setting
			Iject.$["urlTop"]   = "Frame::TopFrame.xfdl";     //topFrame url setting
			Iject.$["urlMdi"]   = "Frame::MDIFrame.xfdl";     //MDIFrame url setting
			Iject.$["urlMain"]  = "Frame::MainFrame.xfdl";    //MainFrame url setting

			////application onload 실행
			Iject.login(o);

		},

		/**
		 *  form onload 시 수행되는 함수
		 * @public
		 * @param  {*} this formt
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		formOnload : function(o)
		{
			var pThis = o;
  				//버튼 권한



		},


		/**
		 * logout 처리
		 * @param  {o} this form
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		login : function(o)
		{

			if(nexacro.Browser == "Runtime")
			{
				Iject.Runtime.login(o);
			}
			else
			{
				Iject.Html5.login(o);
			}
		},

		/**
		 * seperate size 조정
		 * @param  
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		setSeprateFrame : function()
		{
			Iject.$["vFrameSet"].set_separatesize(Iject.$["framesize"]);

			//**** 임시 필요에따라 삭제해서 사용
			Iject.$["userid"] = application.gds_userInfo.getColumn(0,"USER_ID");
			Iject.$["usernm"] = application.gds_userInfo.getColumn(0,"USER_NM");
			Iject.$["mainFrame"].form.fn_set();  //mainframe argument setting
			Iject.$["topFrame"].form.fn_set();  //topframe argument setting

		},

		/**
		 * logout 처리
		 * @param  {o} this form
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		logout : function(o)
		{
			if(nexacro.Browser == "Runtime")
			{
				Iject.Runtime.logout(); //Runtime
			}
			else
			{
				Iject.Html5.logout();   //html5
			}

		},

		/**
		 * 엑셀 익스포트
		 * @param  {*} this
		 * @param  {object} export할 grid
		 * @return
		 * @example
		 *
		 * @memberOf Iject
		 */
		exportExcel : function(o,oGrid,sFileName,strSheet)
		{

			var pThis = o;
			var dToday = new Date();
			var sSvcUrl = application.services["svcurl"].url+"XExportImport.do";
			var strType = oGrid.toString().toUpperCase();
			var strSheet = Eco.isEmpty(strSheet) ? "sheet" :strSheet;
            var strExportFileName = Eco.isEmpty(sFileName) ?  dToday.getTime() : (dToday.getTime() + "_" + sFileName);

			var exportObj = new ExcelExportObject();

			exportObj.clear();
			exportObj.addEventHandler("onsuccess", new Iject.Controll.excelEvent().exportEnd_onsuccess,  Iject.Controll.excelEvent);
			exportObj.addEventHandler("onerror", new Iject.Controll.excelEvent().exportEnd_onerror, Iject.Controll.excelEvent);
			exportObj.set_exporttype(nexacro.ExportTypes.EXCEL2007);
			exportObj.set_exportuitype("exportprogress") // set
			exportObj.set_exporturl(sSvcUrl);
			exportObj.set_exportfilename(strExportFileName);

			if(strType == "[OBJECT GRID]")
			{
				oGrid = oGrid;
				sSheetName = strSheet+"1";
				exportObj.addExportItem(nexacro.ExportItemTypes.GRID, oGrid,  sSheetName + "!A1","allband","allrecord","suppress","allstyle","background","font", "both");

			}
			else
			{
				for(var i=0; i<obj.length; i++)
				{
					sSheetName = strSheet+(i+1);
					oGrid = oGrid[i];
					exportObj.addExportItem(nexacro.ExportItemTypes.GRID, oGrid,  sSheetName + "!A1","allband","allrecord","suppress","allstyle","background","font", "both");
				}
			}

			exportObj.exportData();

		},

		/**
		 * excel import
		 * @param {object} datsetName
		 * @return N/A
		 * @example
		 * @memberOf Iject
		 */
		importExcel : function(o,sSheet,ds)
		{

			var pThis = o;
			Iject.$["fobj"] = pThis;
			var sSvcUrl = application.services["svcurl"].url+"XExportImport.do" ;
			var importObj = new nexacro.ExcelImportObject("importExcel",pThis);
			Iject.$["fobj"].setWaitCursor(true,true);

			importObj.set_importtype(nexacro.ImportTypes.EXCEL);
			importObj.addEventHandler("onsuccess", new Iject.Controll.excelEvent().importEnd_onsuccess,  Iject.Controll.excelEvent);
			importObj.addEventHandler("onerror", new Iject.Controll.excelEvent().importEnd_onerror, Iject.Controll.excelEvent);
			importObj.set_importurl(sSvcUrl);

			importObj.importData("", "[command=getsheetdata;output=outDs;" + sSheet +"]", "["+ds+"=outDs]");
		},

		/**
		 * popup arguments 가져오는함수
		 * @public
		 * @param {Form}  가져올 form
		 * @param {string} variableNames 얻고자 하는 변수명
		 * @example
		 * trace(Iject.$getArg_p(this,'arg2'));
		 * trace(Iject.$getArg_p(this.opener.parent,'arg1'));
		 * @memberOf Iject
		 */
		getPopArgu : function(o,variable)
		{
			var pThis= o;

			while (pThis && !(pThis instanceof ChildFrame))
			{
				pThis = pThis.parent;
			}

			if(Eco.isEmpty(variable)) return;


			if(typeof(variable) == "object")
			{
				var valueList = {};

				for(var i=0, len = variable.length; i < len; i++)
				{

					valueList[variable[i]] = pThis[variable[i]];
				}

				return valueList;
			}
			else
			{
				return pThis[variable];
			}

		},



		/**
		 * popup 닫을때 처리하는 함수
		 * @public
		 * @param {Form}  현재 팝업 form
		 * @param {string} parent 창에 넘길 아규먼트
		 * @example
		 * trace(Iject.$getArg_p(this,'arg2'));
		 * trace(Iject.$getArg_p(this.opener.parent,'arg1'));
		 * @memberOf Iject
		 */
		popClose : function(o,variant)
		{

			var pThis = o;

			//현재 form argument setting
			Iject.$["popup_fobj"]     = pThis.getOwnerFrame().arguments["popup_fobj"];
			Iject.$["popup_varinat"]  = variant;
			Iject.$["popup_callback"] = pThis.getOwnerFrame().arguments["popup_callback"];

			pThis.close(o.name);

		},


		/**
		 * 공통 팝업 modal
		 *@param {XComp}  현재 FORM
		 *@param {object}  callback json object
		 *@param {string | function} callback 인자값 string일경우 와 function일경우 callback 처리
		 *@return
		 * callback function
		 * @example
		 * var oData ={
         *sId  : "singledetail",             //callback id
         *sUrl : "sample::Pattern_01.xfdl",   //url
         *bshowtitlebar : true,     //title bar
         *bAutoSize  : true,       //autosize
         *bResize    : false,       //resize
         *bShowtatusbar : false,     //statusbar
         *sOpenalign    : "center middle",  //align
         *oArgs :{'arg1':'55555',
         *        'arg2':'333333'
         *      }                   // argument
         * };
		 * //팝업 테스트
		 *Iject.showModal(this,oData,function(){
         *
		 * var pThis= this.fobj;
    	 *
	     * trace(" pThis.name : " + pThis.name);
	     * });
		 * @memberOf Iject
		 */
		showModal : function(o,oData,callback)
		{
			var pThis = o;
            var fnCallback= callback;
			var sId = oData.sId;
			var sBackground = Eco.isEmpty(oData.sBackground) ? "" : oData.sBackground;
			if(Eco.isEmpty(oData)){
				Eco.Logger.error({message: "unKnown calback argument!!!", elapsed: true});
				return;
			}

			var cf = new ChildFrame;
			cf.init(sId);
			cf.set_formurl(oData.sUrl);
			cf.set_showtitlebar(oData.bshowtitlebar);
			cf.set_layered(true);
			cf.set_autosize(oData.bAutoSize);
			cf.set_resizable(oData.bResize);
			cf.set_showstatusbar(oData.bShowstatusbar);
			cf.set_openalign(oData.sOpenalign); //화면의 중앙에 위치
			cf.style.set_background(sBackground);   //backround color
			cf.set_dragmovetype("all");
			cf.arguments = {};
			cf.arguments["popup_fobj"] = pThis;
			cf.arguments["popup_oArg"] = oData.oArgs;
			cf.arguments["popup_callback"] = fnCallback;

			var ret = cf.showModal(sId, pThis ,oData.oArgs,  pThis ,new Iject.Controll.callback().popup);

		},

		/**
		 * 공통 팝업 open
		 * @param
		 * @return
		 * @example
		 *
		 * @memberOf Iject
		 */
		open : function(o,sId,url,oArg,fnCallback)
		{

			var bSucc;
			var nScreenWidth;
			var pThis = o;
			var nScreenHeight;
			var arrScreenSize;
			var nLeft   =  (application.mainframe.width / 2) - Math.round(pThis.width / 2);
			var nTop    = (application.mainframe.height / 2) - Math.round(pThis.height / 2) ;

			var cf= pThis.getOwnerFrame();
			var bSucc = application.open(sId ,url,cf, oArg, "showtitlebar=true showstatusbar=false",nLeft, nTop,null,null,pThis);

			if(!bSucc) 	Eco.Logger.error({message: "modaless open error", elapsed: true});
		},

		/**
		 * alert 공통
		 * @param {string} message
		 * @param {string} title caption message
		 * @return
		 * @example
		 * @memberOf Iject
		 */
		alert : function(sMsg,sCaption)
		{
			var pCaption = Eco.isEmpty(sCaption) ? "알림" : sCaption;
				application.alert(sMsg,pCaption);
		},

		/**
		 * confirm 공통
		 * @param {string} message
		 * @param {string} title caption message
		 * @return {boolen} true ,false
		 * @example
		 *
		 * @memberOf Iject
		 */
		confirm : function(sMsg,sCaption){

			var pCaption = Eco.isEmpty(sCaption) ? "확인" : sCaption;
				return application.confirm(sMsg,pCaption);

		},

		trCallback : function(svcid,errorcode,errormsg)
		{

		},

		 /**
		 * 공통 트랜잭션 함수
		 * @param {xComp} 현재 FORM
		 * @param {*}  transaction json data
		 * @param {string | function} callback 인자값 string일경우 와 function일경우 callback 처리
		 * @return N/A
		 * @example
		 * var oDatas =  {
				  sController : "loginCheck.do",
				  inds :["dsin=dsin"],
				  outds :[
					 "gds_userInfo=gds_userInfo",
					 "gds_message=gds_message",
					 "gds_config=gds_userInfo"
					 ],
				  args  : [
					  "V_USER_ID=chulsoo",
					  "V_USER_PWD=test123"
				  ],
				  bAsync : true,    // 비동기여부 (true : async  false: sync)
				  nDataType : 0,   // (0: XML타입, 1: 이진 타입, 2: SSV 타입)
				  bCompress :false,	 //
				};


		   Iject.transaction(this,oDatas,function(){
			 //nexacro request callback function

			});
		* @memberOf Iject
		*/
		 transaction : function(o,oData,callback)
		{

			if(Eco.isEmpty(oData)) return;

			var pThis = o;
			var strHttpUrl         =  application.services["svcurl"].url;
			var oSvc 	           = {oform:pThis};
				oSvc["formObj"]    = pThis;
				oSvc["svcId"]      = pThis.name + "_"+ oData.svcid; //service id
				oSvc["callback"]   =callback ;                            //callback명
		    var sController        = Eco.isEmpty(oData.sController) ? "" : oData.sController;
		    var bCompress          = Eco.isEmpty(oData.bCompress)   ? false : oData.bCompress; //controller id
			var inputDataset       = Eco.isEmpty(oData.inds)        ? "" : Iject.Util.convertJsonInputString(oData.inds);   //input dataset
		    var outputDataset      = Eco.isEmpty(oData.outds)       ? "" : Iject.Util.convertJsonInputString(oData.outds);   //output dataset
		    var strArgument        = Eco.isEmpty(oData.args)        ? "" : Iject.Util.convertJsonInputString(oData.args);  // argument  변환
		    var bAsync             = Eco.isEmpty(oData.bAsync)      ? true : oData.bAsync;           // 비동기여부 (true : async  false: sync)
		    var nDataType          = Eco.isEmpty(oData.nDataType)   ?  false : oData.nDataType;
			var sURL               = strHttpUrl + sController;       //service url

   		   pThis.transaction(oSvc, sURL,inputDataset, outputDataset,strArgument,"Comm_transactionCallback",bAsync);

		}

	});
}