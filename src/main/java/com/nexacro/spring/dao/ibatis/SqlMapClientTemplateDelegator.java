package com.nexacro.spring.dao.ibatis;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.SQLExceptionTranslator;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.event.RowHandler;
import com.nexacro.spring.dao.Dbms;

import egovframework.rte.psl.orm.ibatis.SqlMapClientCallback;
import egovframework.rte.psl.orm.ibatis.SqlMapClientTemplate;
/**
 * <p>SqlMapClientTemplate의 {@code queryForList(...)} 시 메타데이터 정보를 획득하기 위한 Delegator이다.
 * <p>Spring의 Callback pattern을 이용하여 처리되며, Runtime시 SqlMapClientCallback interface가 정의된다.
 *
 * @author Park SeongMin
 * @since 08.06.2015
 * @version 1.0
 * @see
 */
@Deprecated
public class SqlMapClientTemplateDelegator extends SqlMapClientTemplate {

	private SqlMapClientTemplate delegator;
    private Dbms dbms;
    
	public SqlMapClientTemplateDelegator(SqlMapClientTemplate template, Dbms dbms) {
        this.delegator = template;
        this.dbms = dbms;
    }

    public List queryForList(String statementName) throws DataAccessException {
        return getNexacroMetaData(statementName, null);
    }

    public List queryForList(final String statementName, final Object parameterObject) throws DataAccessException {
        return getNexacroMetaData(statementName, parameterObject);
    }

    public List queryForList(String statementName, int skipResults, int maxResults) throws DataAccessException {
        return getNexacroMetaData(statementName, null);
    }

    public List queryForList(String statementName, Object parameterObject, int skipResults, int maxResults)
            throws DataAccessException {
        return getNexacroMetaData(statementName, parameterObject);
    }
    
    
    public List getNexacroMetaData(final String statementName, final Object parameterObject) throws DataAccessException {
    	SqlMapClientCallback<?> createProxiedSqlMapClientCallback = createProxiedSqlMapClientCallback(dbms, getSqlMapClient(), statementName, parameterObject, SqlMapClientCallback.class);
        return (List) execute(createProxiedSqlMapClientCallback); 
    }
    
    private SqlMapClientCallback<?> createProxiedSqlMapClientCallback(Dbms dbms, SqlMapClient sqlMapClient, String statementName, Object parameterObject, Class<?> sqlMapClientCallbackInterface) {
		ClassLoader classLoader = this.getClass().getClassLoader();
		InvocationHandler sqlMapClientCallbackImpl = new NexacroIbatisMetaDataGatherer(dbms, sqlMapClient, statementName, parameterObject);
		return (SqlMapClientCallback<?>) Proxy.newProxyInstance(classLoader, new Class[]{sqlMapClientCallbackInterface}, sqlMapClientCallbackImpl);
	}
    
    /***************************************************************************************/
    /********************************  delegated method ************************************/
    /***************************************************************************************/
    
    /**
     * @param dataSource
     * @see org.springframework.jdbc.support.JdbcAccessor#setDataSource(javax.sql.DataSource)
     */
    public void setDataSource(DataSource dataSource) {
        delegator.setDataSource(dataSource);
    }

    /**
     * @return
     * @see java.lang.Object#hashCode()
     */
    public int hashCode() {
        return delegator.hashCode();
    }

    /**
     * @param dbName
     * @see org.springframework.jdbc.support.JdbcAccessor#setDatabaseProductName(java.lang.String)
     */
    public void setDatabaseProductName(String dbName) {
        delegator.setDatabaseProductName(dbName);
    }

    /**
     * @param exceptionTranslator
     * @see org.springframework.jdbc.support.JdbcAccessor#setExceptionTranslator(org.springframework.jdbc.support.SQLExceptionTranslator)
     */
    public void setExceptionTranslator(SQLExceptionTranslator exceptionTranslator) {
        delegator.setExceptionTranslator(exceptionTranslator);
    }

    /**
     * @return
     * @see org.springframework.jdbc.support.JdbcAccessor#getExceptionTranslator()
     */
    public SQLExceptionTranslator getExceptionTranslator() {
        return delegator.getExceptionTranslator();
    }

    /**
     * @param lazyInit
     * @see org.springframework.jdbc.support.JdbcAccessor#setLazyInit(boolean)
     */
    public void setLazyInit(boolean lazyInit) {
        delegator.setLazyInit(lazyInit);
    }

    /**
     * @param obj
     * @return
     * @see java.lang.Object#equals(java.lang.Object)
     */
    public boolean equals(Object obj) {
        return delegator.equals(obj);
    }

    /**
     * @return
     * @see org.springframework.jdbc.support.JdbcAccessor#isLazyInit()
     */
    public boolean isLazyInit() {
        return delegator.isLazyInit();
    }

    /**
     * @param sqlMapClient
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#setSqlMapClient(com.ibatis.sqlmap.client.SqlMapClient)
     */
    public void setSqlMapClient(SqlMapClient sqlMapClient) {
        delegator.setSqlMapClient(sqlMapClient);
    }

    /**
     * @return
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#getSqlMapClient()
     */
    public SqlMapClient getSqlMapClient() {
        return delegator.getSqlMapClient();
    }

    /**
     * @return
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#getDataSource()
     */
    public DataSource getDataSource() {
        return delegator.getDataSource();
    }

    /**
     * 
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#afterPropertiesSet()
     */
    public void afterPropertiesSet() {
        delegator.afterPropertiesSet();
    }

    /**
     * @param <T>
     * @param action
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#execute(org.springframework.orm.ibatis.SqlMapClientCallback)
     */
    public <T> T execute(SqlMapClientCallback<T> action) throws DataAccessException {
        return delegator.execute(action);
    }

    /**
     * @param action
     * @return
     * @throws DataAccessException
     * @deprecated
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#executeWithListResult(org.springframework.orm.ibatis.SqlMapClientCallback)
     */
    public List executeWithListResult(SqlMapClientCallback<List> action) throws DataAccessException {
        return delegator.executeWithListResult(action);
    }

    /**
     * @param action
     * @return
     * @throws DataAccessException
     * @deprecated
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#executeWithMapResult(org.springframework.orm.ibatis.SqlMapClientCallback)
     */
    public Map executeWithMapResult(SqlMapClientCallback<Map> action) throws DataAccessException {
        return delegator.executeWithMapResult(action);
    }

    /**
     * @param statementName
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryForObject(java.lang.String)
     */
    public Object queryForObject(String statementName) throws DataAccessException {
        return delegator.queryForObject(statementName);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryForObject(java.lang.String, java.lang.Object)
     */
    public Object queryForObject(String statementName, Object parameterObject) throws DataAccessException {
        return delegator.queryForObject(statementName, parameterObject);
    }

    /**
     * @return
     * @see java.lang.Object#toString()
     */
    public String toString() {
        return delegator.toString();
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param resultObject
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryForObject(java.lang.String, java.lang.Object, java.lang.Object)
     */
    public Object queryForObject(String statementName, Object parameterObject, Object resultObject)
            throws DataAccessException {
        return delegator.queryForObject(statementName, parameterObject, resultObject);
    }

    /**
     * @param statementName
     * @param rowHandler
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryWithRowHandler(java.lang.String, com.ibatis.sqlmap.client.event.RowHandler)
     */
    public void queryWithRowHandler(String statementName, RowHandler rowHandler) throws DataAccessException {
        delegator.queryWithRowHandler(statementName, rowHandler);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param rowHandler
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryWithRowHandler(java.lang.String, java.lang.Object, com.ibatis.sqlmap.client.event.RowHandler)
     */
    public void queryWithRowHandler(String statementName, Object parameterObject, RowHandler rowHandler)
            throws DataAccessException {
        delegator.queryWithRowHandler(statementName, parameterObject, rowHandler);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param keyProperty
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryForMap(java.lang.String, java.lang.Object, java.lang.String)
     */
    public Map queryForMap(String statementName, Object parameterObject, String keyProperty) throws DataAccessException {
        return delegator.queryForMap(statementName, parameterObject, keyProperty);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param keyProperty
     * @param valueProperty
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#queryForMap(java.lang.String, java.lang.Object, java.lang.String, java.lang.String)
     */
    public Map queryForMap(String statementName, Object parameterObject, String keyProperty, String valueProperty)
            throws DataAccessException {
        return delegator.queryForMap(statementName, parameterObject, keyProperty, valueProperty);
    }

    /**
     * @param statementName
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#insert(java.lang.String)
     */
    public Object insert(String statementName) throws DataAccessException {
        return delegator.insert(statementName);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#insert(java.lang.String, java.lang.Object)
     */
    public Object insert(String statementName, Object parameterObject) throws DataAccessException {
        return delegator.insert(statementName, parameterObject);
    }

    /**
     * @param statementName
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#update(java.lang.String)
     */
    public int update(String statementName) throws DataAccessException {
        return delegator.update(statementName);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#update(java.lang.String, java.lang.Object)
     */
    public int update(String statementName, Object parameterObject) throws DataAccessException {
        return delegator.update(statementName, parameterObject);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param requiredRowsAffected
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#update(java.lang.String, java.lang.Object, int)
     */
    public void update(String statementName, Object parameterObject, int requiredRowsAffected)
            throws DataAccessException {
        delegator.update(statementName, parameterObject, requiredRowsAffected);
    }

    /**
     * @param statementName
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#delete(java.lang.String)
     */
    public int delete(String statementName) throws DataAccessException {
        return delegator.delete(statementName);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @return
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#delete(java.lang.String, java.lang.Object)
     */
    public int delete(String statementName, Object parameterObject) throws DataAccessException {
        return delegator.delete(statementName, parameterObject);
    }

    /**
     * @param statementName
     * @param parameterObject
     * @param requiredRowsAffected
     * @throws DataAccessException
     * @see org.springframework.orm.ibatis.SqlMapClientTemplate#delete(java.lang.String, java.lang.Object, int)
     */
    public void delete(String statementName, Object parameterObject, int requiredRowsAffected)
            throws DataAccessException {
        delegator.delete(statementName, parameterObject, requiredRowsAffected);
    }

	
}
