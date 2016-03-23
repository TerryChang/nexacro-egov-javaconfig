package nexacro.sample.config.root;

import java.io.IOException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import egovframework.rte.psl.dataaccess.mapper.MapperConfigurer;

@Configuration
public class ContextMapper {

	@Bean
	public SqlSessionTemplate sqlSession(SqlSessionFactory sqlSessionFactory){
		SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sqlSessionFactory);
		return sqlSessionTemplate;
	}
	
	@Bean
	public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource, PathMatchingResourcePatternResolver pmrpr) throws IOException{
		SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
		sqlSessionFactory.setDataSource(dataSource);
		sqlSessionFactory.setConfigLocation(pmrpr.getResource("classpath:/sqlmap/config/hsql/sql-mapper-config.xml")); 
		sqlSessionFactory.setMapperLocations(pmrpr.getResources("classpath:/sqlmap/mappers/**/*Mapper.xml"));
		return sqlSessionFactory;
	}
	
	@Bean
	public MapperScannerConfigurer mapperScannerConfigurer(){
		MapperScannerConfigurer msc = new MapperScannerConfigurer();
		msc.setBasePackage("nexacro.sample.service.dao.mybatis;com.nexacro.spring.dao.mybatis");
		
		return msc;
	}
	
	/*
	 * 이 주석처리된 부분은 전자정부 프레임워크에서 제공하는 MapperConfigurer 클래스를 이용해서 Mapper를 등록하는 bean이다.
	 * MapperConfigurer 클래스는 위에서 사용하고 있는 MapperScannerConfigurer 클래스를 상속받으면서
	 * 전자정부 프레임워크에서 제공하는 @Mapper 어노테이션을 set하기 때문에
	 * @Mapper 어노테이션이 붙은 클래스만 Mapper 로 등록한다.
	 * 만약 어노테이션을 설정하지 않을 경우 패키지에 있는 모든 클래스를 Mapper로 등록한다
	@Bean
	public MapperConfigurer mapperConfigurer(){
		MapperConfigurer mapperConfigurer = new MapperConfigurer();
		mapperConfigurer.setBasePackage("nexacro.sample.service.dao.mybatis;com.nexacro.spring.dao.mybatis");
		return mapperConfigurer;
	}
	*/
}
