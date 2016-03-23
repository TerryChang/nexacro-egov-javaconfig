@ECHO OFF
cls
ECHO ::::::::::::::::::::::::::::: :::::
ECHO :::::  Nexacro generate START :::::
ECHO :::::  copyright TOBESOFT :::::
ECHO :::::::::::::::::::::::::::::::::::

SET SOURCE = "C:\eGovFrame-3.5\workspace\nexacro-egov\src\main\nxui\packageB"              
SET WEBROOT= "C:\eGovFrame-3.5\workspace\nexacro-egov\src\main\webapp"


xcopy "C:\eGovFrame-3.5\workspace\nexacro-egov\src\main\nxui\packageB\nexacro14lib\component\IjectJS\*.*" "C:\eGovFrame-3.5\workspace\nexacro-egov\src\main\webapp\packageB\nexacro14lib\component\IjectJS\" /k/e/c/h/r/y 
ECHO :::::::: SUCCESS Generateor :::::::

