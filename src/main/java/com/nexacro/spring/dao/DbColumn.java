package com.nexacro.spring.dao;

import com.nexacro.xapi.data.datatype.DataType;
import com.nexacro.xapi.data.datatype.DataTypeFactory;

/**
 * ResultSetMetaData로 부터 획득한 컬럼의 메타데이터 정보를 저장한다.
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */
public class DbColumn {
    
    /**
     * 컬럼의 기본 크기. 255
     */
    public static final int DEFAULT_SIZE = 255;

    protected String name = null;
    protected DataType dataType = DataTypeFactory.NULL;
    protected int size = DEFAULT_SIZE;
    
    protected String vendorsTypeName = null;
    // oracle과 같은 경우 float로 생성하면 오로지 java class type으로만 구분이 가능하다. 거참.
    protected String typeJavaClassName = null;
    
    protected String decimalDigit = null;
    protected int precision;
    protected int scale;
    
    public DbColumn(String name, DataType dataType, int size) {
        this(name, dataType, size, null);
    }

    public DbColumn(String name, DataType dataType, int size, String vendorsTypeName) {
        setName(name);
        setDataType(dataType);
        setSize(size);
        setVendorsTypeName(vendorsTypeName);
        this.vendorsTypeName = vendorsTypeName;
    }
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DataType getDataType() {
        return dataType;
    }
    
    public void setDataType(DataType dataType) {
        this.dataType = dataType;
    }
    
    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
    
    public String getVendorsTypeName() {
        if(vendorsTypeName!=null) {
            return vendorsTypeName;
        }
        if(dataType!=null) {
            return dataType.getTypeName();
        }
        return null;
    }
    
    public void setVendorsTypeName(String vendorsTypeName) {
        this.vendorsTypeName = vendorsTypeName;
    }

    public String getTypeJavaClassName() {
        return typeJavaClassName;
    }
    
    public void setTypeJavaClassName(String typeJavaClassName) {
        this.typeJavaClassName = typeJavaClassName;
    }

    public String getDecimalDigit() {
        return decimalDigit;
    }

    public void setDecimalDigit(String decimalDigit) {
        this.decimalDigit = decimalDigit;
    }

    /**
     * @return the precision
     */
    public int getPrecision() {
        return precision;
    }

    /**
     * @param precision the precision to set
     */
    public void setPrecision(int precision) {
        this.precision = precision;
    }

    /**
     * @return the scale
     */
    public int getScale() {
        return scale;
    }

    /**
     * @param scale the scale to set
     */
    public void setScale(int scale) {
        this.scale = scale;
    }

    
    
}
