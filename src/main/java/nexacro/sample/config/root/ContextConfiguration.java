package nexacro.sample.config.root;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.configuration.CompositeConfiguration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.EnvironmentStringPBEConfig;
import org.jasypt.spring3.properties.EncryptablePropertyPlaceholderConfigurer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springmodules.commons.configuration.CommonsConfigurationFactoryBean;

@Configuration
public class ContextConfiguration {

	@Bean
	public XMLConfiguration projectConfiguration() throws ConfigurationException{
		return new XMLConfiguration("config/project-configuration.xml");
	}

	@Bean
	public CompositeConfiguration compositeConfiguration(XMLConfiguration projectConfiguration){
		List<XMLConfiguration> param = new ArrayList<XMLConfiguration>();
		param.add(projectConfiguration);
		return new CompositeConfiguration(param);
	}
	
	@Bean
	public CommonsConfigurationFactoryBean commonsConfigurationFactoryBean(CompositeConfiguration compositeConfiguration){
		CommonsConfigurationFactoryBean ccfb = new CommonsConfigurationFactoryBean();
		ccfb.setConfigurations(new org.apache.commons.configuration.Configuration[]{compositeConfiguration});
		return ccfb;
	}
	
	/*
	@Bean
	public EncryptablePropertyPlaceholderConfigurer propertyPlaceholderConfigurer(StandardPBEStringEncryptor spbese, CommonsConfigurationFactoryBean ccfb) throws Exception{
		EncryptablePropertyPlaceholderConfigurer eppc = new EncryptablePropertyPlaceholderConfigurer(spbese);
		eppc.setProperties((Properties)ccfb.getObject());
		return eppc;
	}
	*/
	
	/**
	 * 이 메소드는 commonsConfigurationFactoryBean bean이 만들어내는 최종 Bean Object가 Properties 객체이기 때문에
	 * @Qualifier 어노테이션을 사용해서 Injection을 받고 이것이 가능한지 확인하기 위해 만든 메소드이다.
	 * 만약 이것이 기능 동작을 하지 않을 경우 위의 메소드를 주석을 풀고 테스트를 진행해본다
	 * @param spbese
	 * @param properties
	 * @return
	 * @throws Exception
	 */
	@Bean
	public EncryptablePropertyPlaceholderConfigurer propertyPlaceholderConfigurer(StandardPBEStringEncryptor spbese, @Qualifier("commonsConfigurationFactoryBean") Properties properties) throws Exception{
		EncryptablePropertyPlaceholderConfigurer eppc = new EncryptablePropertyPlaceholderConfigurer(spbese);
		eppc.setProperties(properties);
		return eppc;
	}
	
    @Bean
    public StandardPBEStringEncryptor configurationEncryptor(EnvironmentStringPBEConfig espbec){
    	StandardPBEStringEncryptor spbese = new StandardPBEStringEncryptor();
    	spbese.setConfig(espbec);
    	spbese.setPassword("7cxna10re0o");
    	return spbese;
    }
    
    @Bean
    public EnvironmentStringPBEConfig environmentVariablesConfiguration(){
    	EnvironmentStringPBEConfig espbec = new EnvironmentStringPBEConfig();
    	espbec.setAlgorithm("PBEWithMD5AndDES");
    	espbec.setPasswordEnvName("APP_ENCRYPTION_PASSWORD");
    	return espbec;
    }
}
