package com.nexacro.spring.dao.dbms;

import com.nexacro.spring.dao.AbstractDbms;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.xapi.data.datatype.PlatformDataType;

/**
 * <p>Mssql에서 사용되는 데이터 타입과 <code>DataSet</code>의 데이터 타입간의 매핑 정보를 제공한다.
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */
public class Mssql extends AbstractDbms {

    @Override
    public void handleColumnDataType(DbColumn column) {

        if (column==null) { 
            return; 
        }
        
        if ("xml".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
        }  else if ("image".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.BLOB);
        }  else if ("int".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.INT);
        } else if (column.getVendorsTypeName().endsWith("time")) { //datetime, smalldatetime
            column.setDataType(PlatformDataType.DATE_TIME);
        } else if (column.getVendorsTypeName().startsWith("time")) { //datetime2, datetimeoffset
            column.setDataType(PlatformDataType.DATE_TIME);
        } else if (column.getVendorsTypeName().endsWith("money")){ //money, smallmoney
            column.setDataType(PlatformDataType.BIG_DECIMAL);
        } else if (column.getVendorsTypeName().endsWith("text")){ //text, ntext
            column.setDataType(PlatformDataType.STRING);
        } 
        
    }


}
