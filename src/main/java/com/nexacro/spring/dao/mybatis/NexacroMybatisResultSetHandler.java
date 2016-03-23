package com.nexacro.spring.dao.mybatis;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.ibatis.executor.resultset.ResultSetHandler;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.mapping.ResultMapping;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

import com.nexacro.spring.context.SpringAppContext;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.spring.dao.DbMetaDataGathererUtil;
import com.nexacro.spring.dao.DbVendorsProvider;
import com.nexacro.spring.dao.Dbms;
import com.nexacro.spring.dao.DbmsProvider;
import com.nexacro.spring.data.metadata.support.MapMetaData;
import com.nexacro.spring.data.support.NexacroConverterHelper;
import com.nexacro.xapi.data.DataTypes;
import com.nexacro.xapi.data.datatype.DataType;

/**
 * <p>Mybatis의 {@link ResultSetHandler#handleResultSets(Statement)} plugin으로  {@link NexacroMybatisMetaDataProvider}에서 메타데이터 요청시에만 실행되며, 
 * 쿼리를 수행하고 <code>ResultSet</code>으로 부터 {@link DbmsProvider}를 이용하여 메타데이터 정보를 획득한다.
 * 
 * @author Park SeongMin
 * @since 10.13.2015
 * @version 1.0
 * @see
 */
@Intercepts({ @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})})
public class NexacroMybatisResultSetHandler implements Interceptor {

	private static DbmsProvider dbmsProvider;
	
	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {
	}
	
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		
		LookupResultSetMetaDataConfig config = LookupResultSetMetaDataHolder.getLookupResultSetMetaDataConfig();
		
		if(config != null && config.isSearchMetaData()) {
			
			// search metadata
			Object[] args = invocation.getArgs();
			Statement statement = (Statement) args[0];
			
			return getMetaDataFromResultSet(config, statement);
		} else {
			return invocation.proceed();
		}
		
	}

	private Object getMetaDataFromResultSet(LookupResultSetMetaDataConfig config, Statement statement) {
		
		initDbmsProvider();
		MapMetaData generateMapMetaData = null;
		
		MappedStatement mappedStatement = config.getMappedStatement();
		try {
			ResultSet rs = statement.getResultSet();
			
			ResultSetMetaData metaData = rs.getMetaData();

			Connection connection = statement.getConnection();
			Dbms dbms = dbmsProvider.getDbms(connection);

			// get column information from ResultSetMetaData
			List<DbColumn> dbColumns = dbms.getDbColumns(metaData);

			List<ResultMap> resultMaps = mappedStatement.getResultMaps();
			
			if(validResultMaps(resultMaps)) {
				// mapping MetaData and Ibatis ResultMap
				ResultMap resultMap = resultMaps.get(0);
				
				// auto mappings..
				// AutoMappingBehavior.NONE.equals(mappedStatement.getConfiguration().getAutoMappingBehavior())
				// NONE - 자동매핑을 사용하지 않는다. 오직 수동으로 매핑한 프로퍼티만을 설정할것이다.
				// PARTIAL - 조인 내부에 정의한 내포된 결과매핑을 제외하고 자동매핑한다.
				// FULL - 모든것을 자동매핑한다.
				
				// DefaultResultSetHandler Code.. getRowValue(). AutoMapping
//				if (!shouldApplyAutomaticMappings(resultMap, !AutoMappingBehavior.NONE.equals(mappedStatement.getConfiguration().getAutoMappingBehavior()))) {
//				if (!shouldApplyAutomaticMappings(resultMap, !AutoMappingBehavior.NONE.equals(mappedStatement.getConfiguration().getAutoMappingBehavior()))) {
					mappingDbColumnAndResultMappings(dbColumns, resultMap);
//				}
				
			}

			generateMapMetaData = DbMetaDataGathererUtil.generateMetaDataFromDbColumns(dbColumns);

		} catch (Exception e) {
			Logger logger = LoggerFactory.getLogger(this.getClass());
            if(logger.isErrorEnabled()) {
                logger.error("failed to query the metadata information.", e);
            }
		}
        		
        return generateMapMetaData;
	}
	
	private void mappingDbColumnAndResultMappings(List<DbColumn> dbColumns, ResultMap resultMap) {
		
		Class<?> resultType = resultMap.getType();
		if(resultType != Map.class) {
			// resultSetMetaData columns
			return;
		}
		
		// Map 만을 대상으로 하기 때문에 PropertyMappings만을 사용한다. (getConstructorResultMappings는 사용하지 않는다.)
		final List<ResultMapping> propertyMappings = resultMap.getPropertyResultMappings();
		// propertyMappings length가 0인 경우 auto mapping 으로 처리 한다.
		if(propertyMappings.size() == 0) {
			return;
		}
		
		
		int size = dbColumns.size(); 
        for(int i=size-1; i>=0; i--) { 
        	DbColumn dbColumn = dbColumns.get(i);
	        String name = dbColumn.getName();
	        boolean existColumn = false;
			
			// Map의 Automapping이 아니다. 일반 Mapping이다.
//			Boolean autoMapping = resultMap.getAutoMapping();
//			if(autoMapping != null && Boolean.TRUE.equals(autoMapping)) {
//				existColumn = true;
//			}
			
			for (ResultMapping propertyMapping: propertyMappings) {
			
				String columnName = propertyMapping.getColumn();
				String propertyName = propertyMapping.getProperty();
				
				if(name.equals(columnName) || name.equals(propertyName)) {
                    if(propertyName != null) {
                        dbColumn.setName(propertyName);
                    }
                    
                    // javaType이 선언되지 않았을 경우 기본적으로 Object 형식으로 반환된다. 
                    // NexacroConverterHelper.getDataType 의 Object는 undefined 이기 때문에 ResultSetMetaData의 타입으로 처리가 된다.
                    Class javaType = propertyMapping.getJavaType();
                    if(javaType != null) {
                        DataType dataType = NexacroConverterHelper.getDataType(javaType);
                        if(dataType.getType() != DataTypes.UNDEFINED) {
                            dbColumn.setDataType(dataType);
                        }
                    }
                    
                    existColumn = true;
                    break;
                } 
				
			}// end resultMappings
				
			
			// remove data for result mapping
			if(!existColumn) {
				dbColumns.remove(i);
			}
			
	    } // end dbColumns
		
		
	}
	
	private boolean validResultMaps(List<ResultMap> resultMaps) {
		if(resultMaps == null || resultMaps.size() < 1) {
			return false;
		}
		
		return true;
	}
	
	private boolean shouldApplyAutomaticMappings(ResultMap resultMap, boolean def) {
		return resultMap.getAutoMapping() != null ? resultMap.getAutoMapping(): def;
	}

	private void initDbmsProvider() {
		if (dbmsProvider != null) {
			return;
		}

		ApplicationContext applicationContext = SpringAppContext.getInstance().getApplicationContext();
		if (applicationContext != null) {
			dbmsProvider = (DbmsProvider) applicationContext.getBean("dbmsProvider");
		}

		if (dbmsProvider == null) {
			dbmsProvider = new DbVendorsProvider();
		}
	}
	
	
	protected Class<?> resolveInterface(Class<?> type) {
		
		// only list..
		
	    Class<?> classToCreate;
	    if (type == List.class || type == Collection.class || type == Iterable.class) {
	      classToCreate = ArrayList.class;
	    } else if (type == Map.class) {
	      classToCreate = HashMap.class;
	    } else if (type == SortedSet.class) { // issue #510 Collections Support
	      classToCreate = TreeSet.class;
	    } else if (type == Set.class) {
	      classToCreate = HashSet.class;
	    } else {
	      classToCreate = type;
	    }
	    return classToCreate;
	  }
	
}
