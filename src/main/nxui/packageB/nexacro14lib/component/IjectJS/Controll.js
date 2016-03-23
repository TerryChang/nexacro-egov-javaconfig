/**
 * Created by jeongweonsik on 15. 10. 16..
 */
/**
 * @fileoverview 넥사크로  공통 Library Controll
 * @author  copyright 2015 TOBESOFT {J}
 */
if (!JsNamespace.exist("Iject.Controll"))
{

    /**
     * @namespace
     * @name Iject.Controll
     * @author
     * @memberof!  Iject.Controll
     */
    JsNamespace.declare("Iject.Controll", {

        /**
         * 공통 Gobal utility
         * @private
         * @memberOf Iject.Controll
         */


        callback : function()
        {

            var p$ = arguments;
            /**
             * 공통 transaction callback
             * @private
             * @parma {XComp} 현재form
             * @param {number} errorcode
             * @parak {string} errormsg
             * @memberOf Iject.Controll
             */
            this.transaction = function(o,nErrorcode,strErrorMsg)
            {

                var oSvc       =  o;   //service
                var pThis       = oSvc["formObj"];     //현재 Form Object
                var strSvcId    = oSvc["svcId"];       // service id
                var svcCallback = oSvc["callback"]; //콜벡명

                if(Eco.isEmpty(svcCallback)) return;

                //check callback function
                if(typeof(svcCallback) == "function" )
                {
                    svcCallback.prototype.fobj       = pThis; //    //form object
                    svcCallback.prototype.svcid     = strSvcId;  //servie id
                    svcCallback.prototype.errorcode = nErrorcode; //error code
                    svcCallback.prototype.errormsg  = strErrorMsg;   //errormsg
                    new svcCallback();
                    //callback in string 일경우
                }else if(typeof(svcCallback) == "string")
                {
                    if(!Eco.isFunction(pThis[svcCallback]))return;
                    pThis[svcCallback].call(pThis,strSvcId,nErrorcode,strErrorMsg);
                }
                else
                {
                    Eco.Logger.error({message: "unKnown calback argument!!!", elapsed: true});
                }


            };
            /**
             * 공통 popup callback
             * @param {string} strid
             * @param {string} argument
             * @private
             * @memberOf Iject.Controll
             */
            this.popup = function(strSvcId,variant)
            {

                var pThis     = Iject.$["popup_fobj"];
                var pCallback = Iject.$["popup_callback"];
                var pVariant  = Iject.$["popup_varinat"];


                if(Eco.isEmpty(variant)) return;


                if(typeof(pCallback) == "function")
                {
                    pCallback.prototype.fobj       = pThis; //    //form object
                    pCallback.prototype.svcid     = strSvcId;  //servie id
                    pCallback.prototype.variant = pVariant; //error code
                    new pCallback();
                }
                else if(typeof(pCallback) == "string"){
                    if(!Eco.isFunction(pThis[svcCallback]))return;
                    pThis[pCallback].call(strSvcId,pVariant);
                }

               //초기화
                Iject.$["popup_fobj"]     = "";
                Iject.$["popup_callback"] = "";
                Iject.$["popup_varinat"]  = "";


            };

        },

        /**
         * Excel Export import 성공시 callback
         * @orivate
         * @return N/A
         * @example
         * @memberOf Iject.Controll
         */
        excelEvent : function()
        {
            /**
             * ExceExport 성공시 callback
             * @return N/A
             * @example
             * @memberOf private
             */
           this.exportEnd_onsuccess = function(obj,e)
           {
              //  trace(" e.eventid " +  e.eventid );
           };

            /**
             * ExceExport 성공시 callback
             * @return N/A
             * @example
             * @memberOf private
             */
            this.exportEnd_onerror = function(obj,e)
            {
                //  trace(" e.eventid " +  e.eventid );
            };

            /**
             * ExcelImport 성공시 callback
             * @return N/A
             * @example
             * @memberOf private
             */
           this.importEnd_onsuccess = function(obj,e)
           {
             
               Iject.$["fobj"].setWaitCursor(false,true);
           };


            /**
             * ExcelImport 성공시 callback
             * @return N/A
             * @example
             * @memberOf private
             */
            this.importEnd_onerror = function(obj,e)
            {
                alert(":::::::::::: importEnd :::::::::::::::::");
                Iject.$["fobj"].setWaitCursor(false,true);
            };



        }

    });
}

