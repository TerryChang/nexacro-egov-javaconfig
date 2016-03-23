/**
 * @fileoverview 넥사크로  공통 Library Runtime js
 * @author  copyright 2015 TOBESOFT {J}
 */
if (!JsNamespace.exist("Iject.Runtime")) {

    /**
     * @namespace
     * @name Iject.Runtime
     * @author
     * @memberof! Iject.Runtime
     */
    JsNamespace.declare("Iject.Runtime", {

        /**
         * login 처리
         * @param
         * @return
         * @example
         *
         * @memberOf Iject.Runtime
         */
        login : function(o)
        {
            //application.mainframe.set_visible("false");
            var pThis = o.mainframe;
            var nScreenWidth;
            var nScreenHeight;
            var arrScreenSize;
            var nMoniterIndex = system.getMonitorIndex(system.cursorx, system.cursory); //모니터번호
            var objScreenSize = system.getScreenRect(nMoniterIndex);
            var nScreenLeft = objScreenSize.left;
            var nScreenTop = objScreenSize.top;
            var nScreenRight = objScreenSize.right;
            var nScreenBottom = objScreenSize.bottom;
                nScreenWidth = nScreenRight - nScreenLeft;
                nScreenHeight = nScreenBottom - nScreenTop;

            Iject.$["vFrameSet"].set_separatesize("*,0,0");

            application.mainframe.set_showtitlebar(false);
            application.mainframe.set_left(nScreenLeft+(nScreenWidth/2)-180);
            application.mainframe.set_top(nScreenTop+(nScreenHeight/2)-180);
            application.mainframe.set_width(Iject.$["loginSize"].width);
            application.mainframe.set_height(Iject.$["loginSize"].height);

            var oData ={
                sId            : "login",             //callback id
                sUrl           : "Frame::login.xfdl",   //url
                bshowtitlebar  : false,     //title bar
                bAutoSize      : true,       //autosize
                bResize        : false,       //resize
                bShowstatusbar : false,     //statusbar
                sOpenalign     : "center middle",  //align
                sBackground    : "transparnet",
                oArgs : {}                   // argument
            };

            //팝업 테스트
            Iject.showModal(pThis,oData,function(){

                /*
                 * popup calllback
                 *@param {object}this.fobj
                 *@param {string} this.svcid
                 *@param {string} this.variant
                 */
                var pThis= this.fobj;
                Iject.Runtime.setFrame(pThis);   //frame size open

            });

        },

        /**
         * login 처리가 완료됬을때
         * @param {XComp} 현재 form object
         * @return
         * @example
         *
         * @memberOf Iject.runtime
         */
       setFrame: function(o)
       {
           application.mainframe.set_visible(false);
           Iject.setSeprateFrame();

           application.mainframe.set_left(0);
           application.mainframe.set_top(0);
           application.mainframe.set_width(Iject.$["mainframeSize"].width);
           application.mainframe.set_height(Iject.$["mainframeSize"].height);
           application.mainframe.set_showtitlebar(true);
           application.mainframe.set_visible(true);

       },

        /**
         * Runtime logout
         * @param
         * @return
         * @example
         *
         * @memberOf Iject.runtime
         */
        logout : function ()
        {
            if(Iject.confirm("로그아웃 하시겠습니까?")) application.exit();
        }


    });
}