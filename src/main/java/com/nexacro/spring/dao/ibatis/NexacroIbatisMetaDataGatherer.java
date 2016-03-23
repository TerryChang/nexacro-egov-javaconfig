package com.nexacro.spring.dao.ibatis;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapExecutor;
import com.ibatis.sqlmap.client.SqlMapSession;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMap;
import com.ibatis.sqlmap.engine.mapping.result.ResultMap;
import com.ibatis.sqlmap.engine.mapping.result.ResultMapping;
import com.ibatis.sqlmap.engine.mapping.sql.Sql;
import com.ibatis.sqlmap.engine.mapping.statement.MappedStatement;
import com.ibatis.sqlmap.engine.scope.SessionScope;
import com.ibatis.sqlmap.engine.scope.StatementScope;
import com.nexacro.spring.dao.DbColumn;
import com.nexacro.spring.dao.DbMetaDataGathererUtil;
import com.nexacro.spring.dao.Dbms;
import com.nexacro.spring.data.metadata.NexacroMetaData;
import com.nexacro.spring.data.metadata.support.MapMetaData;
import com.nexacro.spring.data.metadata.support.UnsupportedMetaData;
import com.nexacro.spring.data.support.NexacroConverterHelper;
import com.nexacro.xapi.data.DataTypes;
import com.nexacro.xapi.data.datatype.DataType;

/**
 * <p>SqlMapClientCallback interface implements.. (runtime 시 proxy 처리되어 사용된다.)
 * <p>Spring 혹은 egovframework 내에서 사용되는 interface가 다르기 때문에..  
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */

public class NexacroIbatisMetaDataGatherer implements InvocationHandler {
//public class SqlMapClientCallbackImpl {
    
    private Dbms dbms;
    private SqlMapClient sqlMapClient;
    private String statementName;
    private Object parameterObject;
    
    public NexacroIbatisMetaDataGatherer(Dbms dbms, SqlMapClient sqlMapClient, String statementName, Object parameterObject) {
        this.dbms = dbms;
        this.sqlMapClient = sqlMapClient;
        this.statementName = statementName;
        this.parameterObject = parameterObject;
    }
    
    @Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {

    	if("doInSqlMapClient".equals(method.getName())) {
    		return doInSqlMapClient((SqlMapExecutor) args[0]);
    	}
    	
    	return null;
    	
//    	return method.invoke(this, args);
	}

    public NexacroMetaData doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
        
        // executor is proxied (for able framework)
        NexacroMetaData nexacroMetaData = null;
        try {
            
            SqlMapSession session = (SqlMapSession)executor;
            Connection currentConnection = session.getCurrentConnection();
            
            Method method = sqlMapClient.getClass().getMethod("getMappedStatement", new Class[]{String.class});
            MappedStatement mappedStatement = (MappedStatement) method.invoke(sqlMapClient, new Object[]{statementName});
            
            //ThreadLocal를 통해서 세션을 정의 (sqlMapClient is proxy..)
            SessionScope sessionScope = new SessionScope();
//            sessionScope.setSqlMapClient(sqlMapClient);
//            sessionScope.setSqlMapExecutor(sqlMapClient);
//            sessionScope.setSqlMapTxMgr(sqlMapClient);
            StatementScope statementScope = new StatementScope(sessionScope);
            
            //다이나믹 쿼리가 적용
            mappedStatement.initRequest(statementScope);
            
            //sql을 추출
            Sql sql = mappedStatement.getSql();
            
            ParameterMap parameterMap = sql.getParameterMap(statementScope, parameterObject);
           
            // resultMapping의 상세 스펙을 확인하여야 한다.
            ResultMap resultMap = mappedStatement.getResultMap();
                
            if(!requireExecuteQuery(resultMap)) {
                return DbMetaDataGathererUtil.generateMetaDataFromClass(resultMap.getResultClass());
            }
            
            // for only map
            statementScope.setParameterMap(parameterMap);
            statementScope.setResultMap(resultMap);
            
            Object[] parameters = parameterMap.getParameterObjectValues(statementScope, parameterObject);
            String strSql = sql.getSql(statementScope, parameterObject);
                
            // execute query...
            nexacroMetaData = executeQuery(statementScope, currentConnection, strSql, parameters);
            
            sql.cleanup(statementScope);
        } catch(Exception e) {
            Logger logger = LoggerFactory.getLogger(this.getClass());
            if(logger.isErrorEnabled()) {
                logger.error("failed to query the metadata information. statement="+statementName, e);
            }

        }
        
        if(nexacroMetaData == null) {
        	nexacroMetaData = new UnsupportedMetaData(null);
        }
        
        return nexacroMetaData;
    }
    
    // ibatis SqlExecutor executeQuery code
    private MapMetaData executeQuery(StatementScope statementScope, Connection conn, String sqlString, Object[] parameters) throws Exception {
     
        PreparedStatement ps = null;
        ResultSet rs = null;
        MapMetaData generateMapMetaData = null;
        try {
            Integer rsType = statementScope.getStatement().getResultSetType();
            if (rsType != null) {
              ps = prepareStatement(statementScope.getSession(), conn, sqlString, rsType);
            } else {
              ps = prepareStatement(statementScope.getSession(), conn, sqlString);
            }
            setStatementTimeout(statementScope.getStatement(), ps);
            Integer fetchSize = statementScope.getStatement().getFetchSize();
            if (fetchSize != null) {
              ps.setFetchSize(fetchSize.intValue());
            }
            
            // set parameters..
            statementScope.getParameterMap().setParameters(statementScope, ps, parameters);
            
            // execute query
            rs = ps.executeQuery();
            
            ResultSetMetaData metaData = rs.getMetaData();
            
            // get column information from ResultSetMetaData
            List<DbColumn> dbColumns = dbms.getDbColumns(metaData);
            
            ResultMap resultMap = statementScope.getResultMap();
            
            // mapping MetaData and Ibatis ResultMap
            mappingDbColumnAndResultMappings(dbColumns, resultMap);
            
            generateMapMetaData = DbMetaDataGathererUtil.generateMetaDataFromDbColumns(dbColumns);
            
        } catch(Exception e) {
            throw e;
        } finally {
            if(rs != null) { try { rs.close(); } catch (SQLException e) {} };
            if(ps != null) { try { ps.close(); } catch (SQLException e) {} };
        }
        
        return generateMapMetaData;
    }
    
    private void mappingDbColumnAndResultMappings(List<DbColumn> dbColumns, ResultMap resultMap) {
        
        ResultMapping[] resultMappings = resultMap.getResultMappings();
        
        if(resultMappings == null) {
            return;
        }
        
        // ibatis에서 실행된 결과를 cache 해도 resultClass를 선언하지 않을 경우 데이터 타입을 확인할 수 없다.
        // 여기서는 ResultMap으로 선언된 경우에만 처리하도록 한다.
        int size = dbColumns.size(); 
        for(int i=size-1; i>=0; i--) { 
            DbColumn dbColumn = dbColumns.get(i);
            String name = dbColumn.getName();
            boolean existColumn = false;
            for(ResultMapping mapping: resultMappings) {
                
                String columnName = mapping.getColumnName(); // db column
                String propertyName = mapping.getPropertyName();
                
                if(name.equals(columnName) || name.equals(propertyName)) {
                    if(propertyName != null) {
                        dbColumn.setName(propertyName);
                    }
                    
                    Class javaType = mapping.getJavaType();
                    if(javaType != null) {
                        DataType dataType = NexacroConverterHelper.getDataType(javaType);
                        if(dataType.getType() != DataTypes.UNDEFINED) {
                            dbColumn.setDataType(dataType);
                        }
                    }
                    
                    existColumn = true;
                    break;
                } 
                
            }
            
            // remove data for result mapping
            if(!existColumn) {
                dbColumns.remove(i);
            }
            
        }
            
        
    }
    
    private void setStatementTimeout(MappedStatement mappedStatement, Statement statement)
            throws SQLException {
        if (mappedStatement.getTimeout() != null) {
            statement.setQueryTimeout(mappedStatement.getTimeout().intValue());
        }
    }
    
    private PreparedStatement prepareStatement(SessionScope sessionScope, Connection conn, String sql, Integer rsType) throws SQLException {
        // not cached data
        PreparedStatement ps = conn.prepareStatement(sql);
        return ps;
//        SqlMapExecutorDelegate delegate = ((SqlMapClientImpl) sessionScope.getSqlMapExecutor()).getDelegate();
//        if (sessionScope.hasPreparedStatementFor(sql)) {
//          return sessionScope.getPreparedStatement((sql));
//        } else {
//          PreparedStatement ps = conn.prepareStatement(sql, rsType.intValue(), ResultSet.CONCUR_READ_ONLY);
//          sessionScope.putPreparedStatement(delegate, sql, ps);
//          return ps;
//        }
      }
    
    private PreparedStatement prepareStatement(SessionScope sessionScope, Connection conn, String sql) throws SQLException {
        // not cached data
        PreparedStatement ps = conn.prepareStatement(sql);
        return ps;
      }
    
    private boolean requireExecuteQuery(ResultMap resultMap) {
        
        // Map이 아니라면 실행하지 않는다. XML, primitive 등 은 처리하지 않도록 한다.
        Class resultClass = resultMap.getResultClass();
        if(Map.class.isAssignableFrom(resultClass)) {
           return true; 
        }
        
        return false;
        
    }
    
    

}
