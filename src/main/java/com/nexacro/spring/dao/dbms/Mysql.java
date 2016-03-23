package com.nexacro.spring.dao.dbms;

import com.nexacro.spring.dao.AbstractDbms;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.xapi.data.datatype.PlatformDataType;

/**
 * <p>Mysql에서 사용되는 데이터 타입과 <code>DataSet</code>의 데이터 타입간의 매핑 정보를 제공한다.
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 */
public class Mysql extends AbstractDbms {

    @Override
    public void handleColumnDataType(DbColumn column) {
        if (column == null) {
            return;
        }
        if ("MEDIUMINT".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.INT);
        } else if ("DATETIME".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.DATE_TIME);
        } else if ("YEAR".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.DATE);
        }

    }

}
