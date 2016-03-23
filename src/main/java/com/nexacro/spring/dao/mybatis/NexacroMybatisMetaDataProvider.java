package com.nexacro.spring.dao.mybatis;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.ibatis.cache.CacheKey;
import org.apache.ibatis.cache.NullCacheKey;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.transaction.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ClassUtils;

import com.nexacro.spring.data.metadata.NexacroMetaData;
import com.nexacro.spring.data.metadata.support.BeanMetaData;
import com.nexacro.spring.data.metadata.support.UnsupportedMetaData;

/**
 * <p>Mybatis의 {@link Executor#query(MappedStatement, Object, RowBounds, ResultHandler)} plugin으로, 
 * 쿼리 실행 시 ({@code List} 형태의 select) 데이터가 0건일 경우 컬럼의 메타데이터 정보를 획득한다.  
 * 
 * @author Park SeongMin
 * @since 10.13.2015
 * @version 1.0
 * @see
 */
@Intercepts({ @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})})
public class NexacroMybatisMetaDataProvider implements Interceptor {

	private static Logger logger = LoggerFactory.getLogger(NexacroMybatisMetaDataProvider.class);

	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {
		// To change body of implemented methods use File | Settings | File
		// Templates.
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		
		Object proceed = invocation.proceed();
		
		if(proceed instanceof List) {
			List list = (List) proceed;
			if(list.size() == 0) {
				return getNexacroMetaData(invocation);
			}
		}
		
		return proceed;
	}
	
	private Object getNexacroMetaData(Invocation invocation) {
		
		Object[] args = invocation.getArgs();
		MappedStatement ms = (MappedStatement) args[0];

		List<ResultMap> resultMaps = ms.getResultMaps();
		for(ResultMap resultMap: resultMaps) {
			if(!requireExecuteQuery(resultMap)) {
                return generateMetaDataFromClass(resultMap.getType());
            }
		}
		
//		return doGetMetaData(executor, ms, param, rowBounds, resultHandler);
		
		// ResultSetHandler를 등록해 두고, 여기서 실행 하는 경우에만 상태값을 저장하여 처리하도록 하자.
		LookupResultSetMetaDataConfig config = new LookupResultSetMetaDataConfig(true, ms);
		LookupResultSetMetaDataHolder.setLookupResultSetMetaDataConfig(config);
		try {
			// used cache..
//			proceed = invocation.proceed();
			
			Executor executor = (Executor) invocation.getTarget();
			Object parameter = args[1];
			RowBounds rowBounds = (RowBounds) args[2];
			ResultHandler resultHandler = (ResultHandler) args[3];
			BoundSql boundSql = ms.getBoundSql(parameter);
			CacheKey cacheKey = new NullCacheKey(); // or create cache key. msId, parameter, 
			
			return executor.query(ms, parameter, rowBounds, resultHandler, cacheKey, boundSql);
			
		} catch(Throwable e) {
			// ignore
			Logger logger = LoggerFactory.getLogger(getClass());
			logger.warn("failed to query the metadata information. statement="+ms.getId(), e);
		} finally {
			LookupResultSetMetaDataHolder.resetLookupResultSetMetaDataConfig();
		}
		
		return new ArrayList();
		

	}
	
	private List doGetMetaData(Executor executor, MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) {
		
		// http://zgundam.tistory.com/34 참고..
		BoundSql        boundSql = ms.getBoundSql(parameter);
		Executor wrapper = executor;
		Configuration configuration = ms.getConfiguration();
		StatementHandler handler = configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
		// log 처리 하지 않음
//		Statement stmt = prepareStatement(handler, ms.getStatementLog());
		Statement stmt = null;
		try {
			
			Transaction transaction = executor.getTransaction();
			Connection connection = null;
			try {
				connection = transaction.getConnection();
			} catch (SQLException e) {
				logger.warn("getting connection failed for MetaData.", e);
				return new ArrayList();
			}
			
			stmt = handler.prepare(connection);
			handler.parameterize(stmt);
		} catch(SQLException e) {
			logger.warn("create statement and parameterize failed.", e);
			return new ArrayList();
		}
		
		// handler 별 호출을 처리 할 까?
		try {
			handler.query(stmt, resultHandler);
		} catch (SQLException e) {
			logger.error("failed to query the metadata information. statement="+ms.getId(), e);
			
		}
		
		
		return new ArrayList();
	}
	
	private boolean requireExecuteQuery(ResultMap resultMap) {
        
        // Map이 아니라면 실행하지 않는다. XML, primitive 등 은 처리하지 않도록 한다.
        Class resultClass = resultMap.getType();
        
        Boolean autoMapping = resultMap.getAutoMapping();
        
        if(Map.class.isAssignableFrom(resultClass)) {
           return true; 
        }
        
        return false;
        
    }
    
    private NexacroMetaData generateMetaDataFromClass(Class clazz) {
        
        if(!Map.class.isAssignableFrom(clazz)) {
            if(ClassUtils.isPrimitiveOrWrapper(clazz)) {
                return new UnsupportedMetaData(null);
            }
            
            return new BeanMetaData(clazz);
        }
        
        return null;
    }
    
}
