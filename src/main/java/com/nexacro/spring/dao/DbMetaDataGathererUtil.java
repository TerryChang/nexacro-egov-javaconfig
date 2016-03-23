package com.nexacro.spring.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.ClassUtils;

import com.nexacro.spring.data.metadata.NexacroMetaData;
import com.nexacro.spring.data.metadata.support.BeanMetaData;
import com.nexacro.spring.data.metadata.support.MapMetaData;
import com.nexacro.spring.data.metadata.support.UnsupportedMetaData;
import com.nexacro.spring.data.support.NexacroConverterHelper;
import com.nexacro.xapi.data.datatype.DataType;

public abstract class DbMetaDataGathererUtil {

	public static NexacroMetaData generateMetaDataFromClass(Class clazz) {
        
        if(!Map.class.isAssignableFrom(clazz)) {
            if(ClassUtils.isPrimitiveOrWrapper(clazz)) {
                return new UnsupportedMetaData(null);
            }
            
            return new BeanMetaData(clazz);
        }
        
        return null;
    }
    
	public static MapMetaData generateMetaDataFromDbColumns(List<DbColumn> dbColumns) {
        Map<String, Object> mapData = new HashMap<String, Object>();
        for(DbColumn column: dbColumns) {
            String name = column.getName();
            DataType dataType = column.getDataType();
//            Object defaultValue = NexacroConverterHelper.getDefaultValue(dataType);
            // MetaData 생성 시 Map안의 데이터는 타입을 확인할 수 있도록 데이터타입의 기본값을 설정하도록 한다.
            Object defaultValue = NexacroConverterHelper.getDefaultMetaDataValue(dataType);
            
            mapData.put(name, defaultValue); 
        }
        
        return new MapMetaData(mapData);
    }
}
