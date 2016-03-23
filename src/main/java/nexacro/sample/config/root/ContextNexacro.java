package nexacro.sample.config.root;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.nexacro.spring.context.ApplicationContextProvider;
import com.nexacro.spring.dao.DbVendorsProvider;
import com.nexacro.spring.dao.Dbms;
import com.nexacro.spring.dao.dbms.Hsql;
import com.nexacro.spring.dao.dbms.Mssql;
import com.nexacro.spring.dao.dbms.Mysql;
import com.nexacro.spring.dao.dbms.Oracle;
import com.nexacro.spring.dao.dbms.Tibero;

@Configuration
public class ContextNexacro {

	/*
	<bean id="applicationContextProvider" class="com.nexacro.spring.context.ApplicationContextProvider" lazy-init="false" />
	
	<bean id="hsqlDbms" class="com.nexacro.spring.dao.dbms.Hsql" />
	<bean id="oracleDbms" class="com.nexacro.spring.dao.dbms.Oracle" />
	<bean id="mssqlDbms" class="com.nexacro.spring.dao.dbms.Mssql" />
	<bean id="mysqlDbms" class="com.nexacro.spring.dao.dbms.Mysql" />
	<bean id="tiberoDbms" class="com.nexacro.spring.dao.dbms.Tibero" />
	
	<bean id="dbmsProvider" class="com.nexacro.spring.dao.DbVendorsProvider">
	    <property name="dbvendors">
	        <map>
	     		<entry key="HSQL Database Engine" value-ref="hsqlDbms"/>
	     		<entry key="SQL Server" value-ref="mssqlDbms"/>
	            <entry key="Oracle" value-ref="oracleDbms"/>
	        </map>
	    </property>
	</bean>
	 */
	/**
	 * lazy-init의 기본값이 false이기 때문에 위의 태그에 대해 별도로 설정을 할 필요가 없다
	 * @return
	 */
	@Bean
	public ApplicationContextProvider applicationContextProvider(){
		return new ApplicationContextProvider();
	}
	
	@Bean
	public Hsql hsqlDbms(){
		return new Hsql();
	}
	
	@Bean
	public Oracle oracleDbms(){
		return new Oracle();
	}
	
	@Bean
	public Mssql mssqlDbms(){
		return new Mssql();
	}
	
	@Bean
	public Mysql mysqlDbms(){
		return new Mysql();
	}
	
	@Bean
	public Tibero tiberoDbms(){
		return new Tibero();
	}
	
	@Bean
	public DbVendorsProvider dbmsProvider(Hsql hsqlDbms, Oracle oracleDbms, Mssql mssqlDbms){
		DbVendorsProvider dbmsProvider = new DbVendorsProvider();
		Map<String, Dbms> dbvendors = new HashMap<String, Dbms>();
		dbvendors.put("HSQL Database Engine", hsqlDbms);
		dbvendors.put("SQL Server", mssqlDbms);
		dbvendors.put("Oracle", oracleDbms);
		dbmsProvider.setDbvendors(dbvendors);
		return dbmsProvider;
		
	}
}
