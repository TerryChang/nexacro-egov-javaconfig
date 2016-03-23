package com.nexacro.spring.dao;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.nexacro.xapi.data.datatype.DataType;
import com.nexacro.xapi.data.datatype.DataTypeFactory;
import com.nexacro.xapi.data.datatype.PlatformDataType;

/**
 * Dbms를 구현한 추상클래스로서 ResultSetMetaData로부터 데이터셋으로 변환하기 위해 X-API의 DataType을 활용하여 기본형에 대해 데이터 변환을 수행한다. 
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */

public abstract class AbstractDbms implements Dbms {
    
    /**
     * DBMS type handle
     *
     * @param column
     */
    public abstract void handleColumnDataType(DbColumn column);
    
    public List<DbColumn> getDbColumns(ResultSetMetaData resultSetMetaData) throws SQLException {
        
        List<DbColumn> columnList = new ArrayList<DbColumn>();
        
        int columnCount = resultSetMetaData.getColumnCount();
        // rs..
        for(int i=1; i<=columnCount; i++) {
            
            String columnName = resultSetMetaData.getColumnLabel(i);
            if (columnName == null || columnName.equals("")) {
                columnName = resultSetMetaData.getColumnName(i);
            }
            
            String vendorsTypeName = resultSetMetaData.getColumnTypeName(i);
            String typeJavaClassName = resultSetMetaData.getColumnClassName(i);
            
            DataType dataType = DataTypeFactory.getSqlDataType(vendorsTypeName);
            if(dataType==null) {
                // when dbms vendor's specific column type name
                int javaSqlTypeNumber = resultSetMetaData.getColumnType(i);
                dataType = DataTypeFactory.getSqlDataType(javaSqlTypeNumber);
            }

            // find platform datatype
            dataType = DataTypeFactory.getPlatformDataType(dataType);
            if(dataType == null) {
                dataType = PlatformDataType.UNDEFINED;
            }
            
            int precision = resultSetMetaData.getPrecision(i);
            int scale = resultSetMetaData.getScale(i);
            int columnSize = resultSetMetaData.getColumnDisplaySize(i);
            DbColumn column = new DbColumn(columnName, dataType, columnSize, vendorsTypeName);
            column.setTypeJavaClassName(typeJavaClassName);
            column.setPrecision(precision);
            column.setScale(scale);
            
            // handle column for dbms
            handleColumnDataType(column);
            
            columnList.add(column);
        }
        
        return columnList;
    }
    
    protected DataType findPlatformDataType(int javaSqlTypeNumber, String vendorsTypeName) {
        
        DataType dataType = DataTypeFactory.getSqlDataType(vendorsTypeName);
        if(dataType==null) {
            // when dbms vendor's specific column type name
            dataType = DataTypeFactory.getSqlDataType(javaSqlTypeNumber);
        }

        dataType = DataTypeFactory.getPlatformDataType(dataType);
        if(dataType == null) {
            dataType = PlatformDataType.UNDEFINED;
        }
        
        return dataType;
    }
    
}
