package nexacro.sample.config.root;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ContextDataSource {

	/*
	<!-- hsql 메모리 DBMS :  JDBC -->
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <!-- 
        <property name="driverClassName" value="core.log.jdbc.driver.HSQLDriver"/>
        <property name="url" value="'jdbc:log4'jdbc:hsqldb:hsql://localhost:9001/sampledb"/>
        <property name="username" value="sa"/>
         -->
        <property name="driverClassName" value="${jdbcs.hsql.class}"/>
        <property name="url" value="${jdbcs.hsql.url}"/>
        <property name="username" value="${jdbcs.hsql.user}"/>
    </bean>
    */
	
    @Bean
    public DataSource dataSource(@Value("${jdbcs.hsql.class}") String driverClassName
    							, @Value("${jdbcs.hsql.url}") String url
    							, @Value("${jdbcs.hsql.user}") String username) {
    	BasicDataSource dataSource = new BasicDataSource();
    	dataSource.setDriverClassName(driverClassName);
    	dataSource.setUrl(url);
    	dataSource.setUsername(username);
    	return dataSource;
    }
    
    /*
    <bean id="dataSourceOracle" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="${jdbcs.oracle.class}"/>
        <property name="url" value="${jdbcs.oracle.url}"/>
        <property name="username" value="${jdbcs.oracle.user}"/>
        <property name="password" value="${jdbcs.oracle.pwd}"/>
    </bean>
     */
    
    /*
    @Bean
    public DataSource dataSourceOracle(@Value("${jdbcs.oracle.class}") String driverClassName
    							, @Value("${jdbcs.oracle.url}") String url
    							, @Value("${jdbcs.oracle.pwd}") String username) {
    	BasicDataSource dataSource = new BasicDataSource();
    	dataSource.setDriverClassName(driverClassName);
    	dataSource.setUrl(url);
    	dataSource.setUsername(username);
    	return dataSource;
    }
    */
    
}
