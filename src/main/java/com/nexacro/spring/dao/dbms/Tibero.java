package com.nexacro.spring.dao.dbms;

import com.nexacro.spring.dao.AbstractDbms;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.xapi.data.datatype.PlatformDataType;

/**
 * <p>Tibero에서 사용되는 데이터 타입과 <code>DataSet</code>의 데이터 타입간의 매핑 정보를 제공한다.
 *
 * @author Park SeongMin
 * @since 09.23.2015
 * @version 1.0
 * @see
 */
public class Tibero extends AbstractDbms {

	// Tibero RDBMS JDBC 개발자 안내서
	// http://www.tmaxdata.com/img/service/pdf/Tibero%204%20SP1%20JDBC%20Development%20Guide_v2.1.4.pdf
	
    @Override
    public void handleColumnDataType(DbColumn column) {
        if (column == null) {
            return;
        }
        
        String vendorsTypeName = column.getVendorsTypeName();
        
        // 모든 numeric 타입이 number로 반환되며, value는 BigDecimal로 처리된다..
        if("NUMBER".equals(vendorsTypeName)) {
            String typeJavaClassName = column.getTypeJavaClassName();
            if("java.math.BigDecimal".equals(typeJavaClassName)) {
                column.setDataType(PlatformDataType.BIG_DECIMAL);
            }
//            int precision = column.getPrecision();
//            int scale = column.getScale();
            
        } else if ("GEOMETRY".equals(vendorsTypeName)) {
            column.setDataType(PlatformDataType.BLOB);
//        } else if ("INTERVAL YEAR TO MONTH".equals(column.getVendorsTypeName())) {
//            column.setDataType(PlatformDataType.UNDEFINED);
//        } else if ("INTERVAL DAY TO SECOND".equals(column.getVendorsTypeName())) {
//            column.setDataType(PlatformDataType.UNDEFINED);
        } else if ("ROWID".equals(vendorsTypeName)) {
            column.setDataType(PlatformDataType.UNDEFINED);
        }
        // 그 외 tibero 타입의 경우 자동 변환은 수행하지 않는다.
        
    }

}
