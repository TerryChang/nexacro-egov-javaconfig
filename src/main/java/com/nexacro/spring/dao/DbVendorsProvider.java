package com.nexacro.spring.dao;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.ibatis.executor.BaseExecutor;
import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;

/**
 * 
 * <p>Dbms 별 데이터 타입 처리를 위한 기본 DbmsProvider 이다.
 * <p>아래는 설정 관련 스프링 내 sample 이다.
 *
 * <pre>
 * &lt;bean id="hsqlDbms" class="com.nexacro.spring.dao.dbms.Hsql" /&gt;
 * &lt;bean id="oracleDbms" class="com.nexacro.spring.dao.dbms.Oracle" /&gt;
 * &lt;bean id="mssqlDbms" class="com.nexacro.spring.dao.dbms.Mssql" /&gt;
 * &lt;bean id="mysqlDbms" class="com.nexacro.spring.dao.dbms.Mysql" /&gt;
 * &lt;bean id="tiberoDbms" class="com.nexacro.spring.dao.dbms.Tibero" /&gt;
 *		
 * &lt;bean id="dbmsProvider" class="com.nexacro.spring.dao.DbVendorsProvider"&gt;
 *   &lt;property name="dbvendors"&gt;
 *     &lt;map&gt;
 *	     &lt;entry key="HSQL Database Engine" value-ref="hsqlDbms"/&gt;
 *	     &lt;entry key="SQL Server" value-ref="mssqlDbms"/&gt;
 *	     &lt;entry key="Oracle" value-ref="oracleDbms"/&gt;
 *	   &lt;/map&gt;
 *	 &lt;/property&gt;
 * &lt;/bean&gt;
 * </pre>
 * 
 * <p>dbvendors의 key값은 {@link DatabaseMetaData#getDatabaseProductName()} 으로 정의 된다.
 * <p>추가적인 타입 처리가 필요한 경우 {@link Dbms}를 구현하여 처리한다. 
 * 
 * @author Park SeongMin
 * @since 10.11.2015
 * @version 1.0
 * @see
 *
 */
public class DbVendorsProvider implements DbmsProvider {

	/*
<bean id="hsqlDbms" class="com.nexacro.spring.dao.dbms.Hsql" />
<bean id="oracleDbms" class="com.nexacro.spring.dao.dbms.Oracle" />
<bean id="mssqlDbms" class="com.nexacro.spring.dao.dbms.Mssql" />
<bean id="mysqlDbms" class="com.nexacro.spring.dao.dbms.Mysql" />
<bean id="tiberoDbms" class="com.nexacro.spring.dao.dbms.Tibero" />

<bean id="dbmsProvider" class="com.nexacro.spring.dao.DbVendorsProvider">
    <property name="dbverdors">
        <map>
     		<entry key="SQL Server" value-ref="mssqlDbms"/>
            <entry key="Oracle" value-ref="oracleDbms"/>
        </map>
    </property>
</bean>
	*/
	
	// dbms 이름, dbms에 맞는 Dbms class 이름을 list 형태로 받아야 한다.

	private static final Log log = LogFactory.getLog(BaseExecutor.class);

	private Map<String, Dbms> dbvendors;
	
	public Map<String, Dbms> getDbvendors() {
		return dbvendors;
	}

	public void setDbvendors(Map<String, Dbms> dbvendors) {
		this.dbvendors = dbvendors;
	}

	public Dbms getDbms(Connection conn) {
		if (conn == null)
			throw new NullPointerException("Connection cannot be null");
		
		try {
			String productName = getDataBaseProductName(conn);
			if (this.dbvendors != null) {
				Dbms dbms = dbvendors.get(productName);
//				for (Map.Entry<Object, Object> property : properties.entrySet()) {
//					if (productName.contains((String) property.getKey())) {
//						return (String) property.getValue();
//					}
//				}
				return dbms; // no match, return null
			}
		} catch (Exception e) {
			log.error("Could not get a Dbms from Connection", e);
		}
		
		return null;
	}
	
	public Dbms getDbms(DataSource dataSource) {
		if (dataSource == null)
			throw new NullPointerException("dataSource cannot be null");
		
		Connection connection = null;
		try {
			connection = dataSource.getConnection();
			return getDbms(connection);
		} catch (SQLException e) {
			log.error("Could not get a Dbms from dataSource", e);
		} finally {
			if(connection != null) {
				try { connection.close(); } catch (SQLException e) { }
			}
		}
		
		return null;
		
	}

	
	private String getDataBaseProductName(Connection conn) throws SQLException {
		DatabaseMetaData metaData = conn.getMetaData();
		return metaData.getDatabaseProductName();
	}

}
