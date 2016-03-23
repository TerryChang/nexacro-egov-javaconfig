package nexacro.sample.config.root;

import java.io.IOException;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import egovframework.rte.psl.orm.ibatis.SqlMapClientFactoryBean;

@Configuration
public class ContextSqlMap {
	 
	 @Bean
	 public SqlMapClientFactoryBean sqlMapClient(DataSource dataSource, PathMatchingResourcePatternResolver pmrpr) throws IOException{
		 SqlMapClientFactoryBean smcfb = new SqlMapClientFactoryBean();
		 smcfb.setConfigLocation(pmrpr.getResource("classpath:/sqlmap/config/hsql/sql-map-config.xml"));
		 smcfb.setMappingLocations(pmrpr.getResources("classpath:/sqlmap/sqlmaps/**/*_hsql.xml"));
		 smcfb.setDataSource(dataSource);
		 return smcfb;
	 }
}
