/**
 * @fileoverview 넥사크로  공통 Library  Html5 js
 * @author  copyright 2015 TOBESOFT {J}
 */
if (!JsNamespace.exist("Iject.Html5")) {

    /**
     * @namespace
     * @name Iject.Var
     * @author
     * @memberof! Iject.Var
     */
    JsNamespace.declare("Iject.Html5", {


        /**
         * Html5 login
         * @param
         * @return
         * @example
         *
         * @memberOf Iject.Html5
         */
        login : function()
        {

            Iject.$["vFrameSet"].set_separatesize("*,0,0");

        },

        /**
         * Html5 logout
         * @param
         * @return
         * @example
         *
         * @memberOf Iject.Html5
         */
        logout : function(){
            window.top.location.reload(true);
        },


        setFrame : function()
        {
            Iject.$["topFrame"].set_formurl(Iject.$["urlTop"]);
            Iject.$["leftFrame"].set_formurl(Iject.$["urlLeft"]);
            Iject.$["mdiFrame"].set_formurl(Iject.$["urlMdi"]);
            Iject.$["mainFrame"].set_formurl(Iject.$["urlMain"]);
            Iject.$["vFrameSet"].set_separatesize("0,*,42");
        },

        /**
         * jquery animaition
         * @param {*} animamation 할 컴퍼넌트 object
         * @return {object} animation할 컴퍼넌트 반환.
         * @example
         * $(Iject.Html5.jquery(this.Div00)).animate({left:0},'slow');
         * $(Iject.Html5.jquery(this.Div00)).animate({left:10},'fast');
         * $(Iject.Html5.jquery(this.Div00)).fadeOut(1000);
         * $(Iject.Html5.jquery(this.Div00)).fadeIn(1000);
         * $(Iject.Html5.jquery(this.Div00)).animate({"height": "100px"}, {"queue": false, "duration": 500})
         .animate({"width": "250px"}, 500);
         * @memberOf Iject.Html5
         */
        jquery : function(objID)
        {

            var generateID = "";
            var prtID = objID;
            var i = 0;
            if( nexacro.Browser == "Runtime"|| (nexacro.Browser == "IE" && nexacro.BrowserVersion < 9) ) return;
            while(prtID != application.mainframe){
                if(prtID.toString() == "[object Form]") generateID = "form_" + generateID;
                else generateID = prtID.name + ((generateID != "")?"_":"") + generateID;
                i++;
                prtID = prtID.parent;
            }
            return "#mainframe_" + generateID;
        }



    });
}