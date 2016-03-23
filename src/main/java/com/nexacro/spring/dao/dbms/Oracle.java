package com.nexacro.spring.dao.dbms;

import com.nexacro.spring.dao.AbstractDbms;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.xapi.data.datatype.PlatformDataType;

/**
 * <p>Oracle에서 사용되는 데이터 타입과 <code>DataSet</code>의 데이터 타입간의 매핑 정보를 제공한다.
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */
public class Oracle extends AbstractDbms {
    

    /*
     * @see com.nexacro.spring.dao.Dbms#handleColumnInfo(com.nexacro.spring.dao.DbColumnInfo)
     */
    @Override
    public void handleColumnDataType(DbColumn column) {

        if(column==null) { 
            return; 
        }
        
        if("VARCHAR2".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
        } else if ("NUMBER".equals(column.getVendorsTypeName())) {
            if (Double.class.getName().equals(column.getTypeJavaClassName())){
                column.setDataType(PlatformDataType.DOUBLE);
            } else if (java.math.BigDecimal.class.getName().equals(column.getTypeJavaClassName())) {
                // no option.. 
                if(column.getScale() > 0){
                    column.setDataType(PlatformDataType.BIG_DECIMAL);
                } else {
                    column.setDataType(PlatformDataType.FLOAT);
                }
            } else {
                column.setDataType(PlatformDataType.INT);
            }
        } else if ("LONG".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.LONG);
        } else if(column.getVendorsTypeName().startsWith("INTERVAL YEAR")) { 
            column.setDataType(PlatformDataType.DATE_TIME);
        } else if(column.getVendorsTypeName().startsWith("INTERVAL DAY")) { 
            column.setDataType(PlatformDataType.DATE_TIME);
        } else if("BFILE".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.BLOB);
        } else if("BINARY_FLOAT".equals(column.getVendorsTypeName())) { 
            column.setDataType(PlatformDataType.FLOAT);
        } else if("BINARY_DOUBLE".equals(column.getVendorsTypeName())) { 
            column.setDataType(PlatformDataType.DOUBLE);
        } else if(column.getVendorsTypeName().startsWith("TIMESTAMP")) { 
            column.setDataType(PlatformDataType.DATE_TIME);
            column.setSize(6);
            column.setDecimalDigit(null);
        } else if("NVARCHAR2".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
            column.setSize(column.getSize()/2);
        } else if("NVARCHAR".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
            column.setSize(column.getSize()/2);
        } else if("NCHAR".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
            column.setSize(column.getSize()/2);
        } else if("NVARCHAR".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
            column.setSize(column.getSize()/2);
        } else if("SYS.XMLTYPE".equals(column.getVendorsTypeName())) {
            column.setDataType(PlatformDataType.STRING);
        } else if(column.getVendorsTypeName().endsWith("ROWID")) { // for ROWID 1111, UROWID 1111
            column.setDataType(PlatformDataType.INT);
        } else if(column.getVendorsTypeName().endsWith("NCLOB")) { // for NCLOB 1111
            column.setDataType(PlatformDataType.STRING);
        }
        
        if(column.getVendorsTypeName().indexOf("(")>0) {
            column.setVendorsTypeName(column.getVendorsTypeName().replaceAll("\\(.*\\)", ""));
        }
    
    }
    
    
}
