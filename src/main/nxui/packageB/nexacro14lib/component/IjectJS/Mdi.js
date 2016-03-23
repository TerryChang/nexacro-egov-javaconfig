/**
 * @fileoverview 넥사크로  공통 Library Mdi js
 * @author  copyright 2015 TOBESOFT {J}
 */
if (!JsNamespace.exist("Iject.Mdi")) {

    /**
     * @namespace
     * @name Iject.Mdi
     * @author
     * @memberof! Iject.Var
     */
    JsNamespace.declare("Iject.Mdi", {

        /**
         *
         * @param Mdi관련 메뉴 컬럼 목록
         * @private
          * @example
         * @memberOf Iject.Mdi
         */
        $:
        {
            MENU_ID      : "MENU_ID",    //  MENU ID
            MENU_NM      : "MENU_NAME",
            PAGE_URL     : "PAGE_URL",
            PAGE_ID      : "PAGE_ID",    //PROGRAM_ID
            MENU_ARGS    : "MENU_ARGS", //메뉴파라메터
            WIN_ID       : "WIN_ID",      //윈도우(프레임)아이디(열린 메뉴의 윈도우 아이디)
            MAX          : 10,            //열린 메뉴 최대 갯수
            TITLE        : "TITLE",
            Desc_Url     : "Desc_Url",
            Desc_Url_ko  : "Desc_Url_ko"
        },



        /**
         * 메뉴 아이디를  기준으로 신규 윈도우 화면을 생성하고 open 시킴
         * @param {object} this Form
         * @param {object} 메뉴를 생성할 object
         * @return
         * @example
         *  var oObj = {
         *       ds : this.ds_menu,
         *       nRow : e.row,
         *       aArg : []
         *   };
         *        Iject.Mdi.call(this,oObj);
         * @memberOf Iject.Mdi
         */
        call : function(o,oObj)
        {

            var pThis = Iject.Mdi.$;

            if(!Eco.isEmpty(oObj) && typeof(oObj) !=  "object") return;
            var gdsOpen = Iject.$["gds_openmenu"];    //열린 dataset
            var gdsMenu = Iject.$["gds_menu"];       //global dataset
            var ds   = oObj.ds;    //넘어온 dataset
            var nRow = oObj.nRow;  //선택된 현재 row
            var aArgs = Eco.isEmpty(oObj.oArg) ? "" : oObj.oArg ;   //넘어온 arguments
            var sMenuId = ds.getColumn(nRow,  pThis.MENU_ID);
            var winid = gdsOpen.lookup(pThis.MENU_ID,sMenuId,pThis.WIN_ID);

            if (!Eco.isEmpty(winid))
            {

                if ( Iject.$["mdiFrame"].form.isActiveFrame(winid, aArgs) == true)
                {
                    Iject.$["mdiFrame"].form.fn_moveTab(winid);
                    return;
                }
            }

            Iject.Mdi.newMdi(sMenuId, nRow, aArgs);

        },



        /**
         * 신규 생성된 윈도우(프레임) 화면을 gds_openMenu에 등록
         * @private
         * @param {string} winid: 윈도우 생성 키
         * @param {string} menuid: 메뉴아이디
         * @param {string}  strTitle:타이틀
         * @return {boolen}
         * @example
         *
         * @memberOf Iject.Mdi
         */
        setOpenMenuDs : function(winid, menuid, strTitle)
        {
            var gdsOpen = Iject.$["gds_openmenu"];  //열린 dataset
            var curRow = gdsOpen.addRow();
                gdsOpen.setColumn(curRow, "WIN_ID", winid);
                gdsOpen.setColumn(curRow, "MENU_ID", menuid);
                gdsOpen.setColumn(curRow, "TITLE", strTitle);
        },

        /**
         *  넘어온 아규먼트 처리 설정
         * @param  {*} this form
         * @return
         * @example
         * @memberOf Iject
         */
        setOwnFrameArgu : function(o)
        {
            Iject.$["w_winkey"]  = o.getOwnerFrame().arguments["winKey"];
            Iject.$["w_pageurl"] = o.getOwnerFrame().arguments["pageUrl"];
            Iject.$["w_menunm"]  = o.getOwnerFrame().arguments["menuNm"];
            Iject.$["w_mneuid"]  = o.getOwnerFrame().arguments["menuId"];
            Iject.$["w_title"]   = Iject.$["w_menunm"]+" ("+Iject.$["w_mneuid"]+")";

        },

        /**
         * menu open 실행되는 event
         * @private
         * @param {object} 현재 폼 this
         * @param {object} 펼침 접힘 실행 버튼
         * @return
         * @example
         *
         * @memberOf Iject.Mdi
         */
        leftMenuAction : function(o,oBtn)
        {


            if(oBtn.cssclass =="btn_TF_LeftMenuOpen")
            {
                Iject.$["hFrame"].set_separatesize("230,*");
                oBtn.set_cssclass("btn_TF_LeftMenuClose");
            }
            else
            {
                Iject.$["hFrame"].set_separatesize("0,*");
                oBtn.set_cssclass("btn_TF_LeftMenuOpen");
            }


            if (nexacro.Browser != "Runtime" && nexacro.BrowserVersion > 9)
            {

                var objLeft = Iject.$["leftFrame"].form.div_left;
                objLeft.set_left(0);
                objLeft.set_left(-50);
                $(Iject.Html5.jquery(objLeft)).animate({left:0},'fast');

            }
        },


        /**
         * gds_openMenu의 해당 Row의 정보를 기준으로 신규 윈도우 화면을 생성하고 open 시킴
         * @param {string} menuid: 메뉴아이디
         * @param {number} gds_openMenu의 rowpostion
         * @param {array} aArgs:전달인자
         * @return {boolen}
         * @example
         *
         * @memberOf Iject.Mdi
         */
        newMdi : function(sMenuid,  nRow, aArgs)
        {

            var gdsOpen = Iject.$["gds_openmenu"];  //열린 dataset
            var gdsMenu = Iject.$["gds_menu"];      //global dataset
            var winid = "win" + sMenuid + "_" + gdsOpen.getRowCount() + "_" + parseInt(Math.random() * 1000);
            //var winid = "win" + sMenuid;
            var strTitle = gdsMenu.lookup(this.$.MENU_ID,sMenuid,this.$.MENU_NM);
            var sPageUrl = gdsMenu.lookup(this.$.MENU_ID, sMenuid,this.$.PAGE_URL);
            var sMenuNm  =  gdsMenu.lookup(this.$.MENU_ID, sMenuid, this.$.MENU_NM);

            if(Eco.isEmpty(sPageUrl)) return;   //pageURl 이 없으면 return

            Iject.Mdi.setOpenMenuDs(winid, sMenuid, strTitle);   // 열린메뉴 화면 삽입

            var objNewWin = new ChildFrame;
                objNewWin.init(winid, "absolute", 0, 0,Iject.$["workFrame"].getOffsetWidth() - 0, Iject.$["workFrame"].getOffsetHeight() - 0);

                Iject.$["workFrame"].addChild(winid, objNewWin);

                objNewWin.set_tooltiptext(winid);
                objNewWin.arguments = [];
                objNewWin.set_dragmovetype("all");
                objNewWin.set_showtitlebar(false);
                objNewWin.set_resizable(true);
                objNewWin.set_openstatus("maximize");
                objNewWin.set_titletext( strTitle);
                objNewWin.arguments["winKey"]   =  winid;
                objNewWin.arguments["menuId"]   =  sMenuid;
                objNewWin.arguments["menuNm"]   =  sMenuNm;
                objNewWin.arguments["pageUrl"]  =  sPageUrl;
                objNewWin.arguments["aArgs"]    =  aArgs;
                objNewWin.set_formurl("Frame::WorkFrame.xfdl");
                objNewWin.show();

                Iject.$["mdiFrame"].form.fn_addTab(winid, strTitle);   //mdi tab button add
                Iject.$["mdiFrame"].form.isActiveFrame(winid);

        }

    });
}