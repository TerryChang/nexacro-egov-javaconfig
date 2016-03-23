package nexacro.sample.config.servlet;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.format.support.FormattingConversionServiceFactoryBean;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.mvc.ServletWrappingController;
import org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter;
import org.springframework.web.servlet.mvc.UrlFilenameViewController;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;

import com.nexacro.spring.resolve.NexacroHandlerMethodReturnValueHandler;
import com.nexacro.spring.resolve.NexacroMappingExceptionResolver;
import com.nexacro.spring.resolve.NexacroMethodArgumentResolver;
import com.nexacro.spring.resolve.NexacroRequestMappingHandlerAdapter;
import com.nexacro.spring.servlet.NexacroInterceptor;
import com.nexacro.spring.view.NexacroFileView;
import com.nexacro.spring.view.NexacroView;
import com.nexacro.xeni.services.GridExportImportServlet;

@Configuration
@ComponentScan(
		basePackages="nexacro.sample.**.web",
		includeFilters={
			@ComponentScan.Filter(type=FilterType.ANNOTATION, value=Controller.class)	
		},
		excludeFilters={
			@ComponentScan.Filter(type=FilterType.ANNOTATION, value=Service.class)
			, @ComponentScan.Filter(type=FilterType.ANNOTATION, value=Repository.class)
			, @ComponentScan.Filter(type=FilterType.ANNOTATION, value=Configuration.class)
		}
)
public class ServletContext {

	
	@Bean
	public SessionLocaleResolver localeResolver(){
		return new SessionLocaleResolver();
	}
	
	@Bean
	public NexacroInterceptor nexacroInterceptor(){
		return new NexacroInterceptor();
	}
	
	@Bean
	public NexacroMethodArgumentResolver nexacroMethodArgumentResolver(){
		return new NexacroMethodArgumentResolver();
	}
	
	@Bean
	public NexacroView nexacroView(){
		NexacroView nexacroView = new NexacroView();
		nexacroView.setDefaultContentType("PlatformXml");
		nexacroView.setDefaultCharset("UTF-8");
		return nexacroView;
	}
	
	@Bean
	public NexacroFileView nexacroFileView(){
		return new NexacroFileView();
	}
	
	@Bean
	public NexacroHandlerMethodReturnValueHandler nexacroHandlerMethodReturnValueHandler(NexacroView nexacroView, NexacroFileView nexacroFileView){
		NexacroHandlerMethodReturnValueHandler nhmrvh = new NexacroHandlerMethodReturnValueHandler();
		nhmrvh.setView(nexacroView);
		nhmrvh.setFileView(nexacroFileView);
		return nhmrvh;
	}
	
	@Bean
	public NexacroMappingExceptionResolver exceptionResolver(NexacroView nexacroView, MessageSource messageSource){
		NexacroMappingExceptionResolver nmer = new NexacroMappingExceptionResolver();
		nmer.setOrder(1);
		nmer.setView(nexacroView);
		nmer.setShouldLogStackTrace(true);
		nmer.setShouldSendStackTrace(true);
		nmer.setDefaultErrorMsg("fail.common.msg");
		nmer.setMessageSource(messageSource);
		return nmer;
	}
	
	@Bean
	public SimpleControllerHandlerAdapter simpleControllerHandlerAdapter(){
		return new SimpleControllerHandlerAdapter();
	}
    
    @Bean
    public SimpleUrlHandlerMapping xeniUrlMapping(){
    	SimpleUrlHandlerMapping suhm = new SimpleUrlHandlerMapping();
    	Properties properties = new Properties();
    	properties.put("/XExportImport.do", "xeniWrappingController");
    	suhm.setMappings(properties);
    	return suhm;
    }
    
    @Bean
    public ServletWrappingController xeniWrappingController(){
    	ServletWrappingController swc = new ServletWrappingController();
    	swc.setServletClass(GridExportImportServlet.class);
    	return swc;
    }
    
    @Bean
    public RequestMappingHandlerMapping annotationManager(NexacroInterceptor nexacroInterceptor){
    	RequestMappingHandlerMapping rmhm = new RequestMappingHandlerMapping();
    	rmhm.setInterceptors(new HandlerInterceptor[]{nexacroInterceptor});
    	return rmhm;
    }
    
    @Bean
    public NexacroRequestMappingHandlerAdapter nexacroRequestMappingHandlerAdapter(NexacroMethodArgumentResolver nexacroMethodArgumentResolver
    		, NexacroHandlerMethodReturnValueHandler nexacroHandlerMethodReturnValueHandler
    		, FormattingConversionService conversionService){
    	NexacroRequestMappingHandlerAdapter nrmha = new NexacroRequestMappingHandlerAdapter();
    	List<HandlerMethodArgumentResolver> argumentResolvers = new ArrayList<HandlerMethodArgumentResolver>();
    	argumentResolvers.add(nexacroMethodArgumentResolver);
    	nrmha.setCustomArgumentResolvers(argumentResolvers);
    	List<HandlerMethodReturnValueHandler> returnValueHandlers = new ArrayList<HandlerMethodReturnValueHandler>();
    	returnValueHandlers.add(nexacroHandlerMethodReturnValueHandler);
    	nrmha.setCustomReturnValueHandlers(returnValueHandlers);
    	ConfigurableWebBindingInitializer webBindingInitializer = new ConfigurableWebBindingInitializer();
    	webBindingInitializer.setConversionService(conversionService);
    	nrmha.setWebBindingInitializer(webBindingInitializer);
    	return nrmha;
    }
    
    @Bean
    public FormattingConversionServiceFactoryBean conversionService(){
    	return new FormattingConversionServiceFactoryBean();
    }
    
    @Bean
    public LocalValidatorFactoryBean validator(MessageSource messageSource){
    	LocalValidatorFactoryBean lvfb = new LocalValidatorFactoryBean();
    	lvfb.setValidationMessageSource(messageSource);
    	return lvfb;
    }
 
	@Bean
	public CommonsMultipartResolver multipartResolver(){
		CommonsMultipartResolver cmr = new CommonsMultipartResolver();
		cmr.setMaxUploadSize(10240000);
		cmr.setMaxInMemorySize(10240000);
		return cmr;
	}
	
	@Bean
	public UrlBasedViewResolver urlBasedView(){
		UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
		urlBasedViewResolver.setOrder(1);
		urlBasedViewResolver.setViewClass(JstlView.class);
		urlBasedViewResolver.setPrefix("/WEB-INF/jsp/");
		urlBasedViewResolver.setSuffix(".jsp");
		return urlBasedViewResolver;
	}
	    
	@Bean
	public UrlFilenameViewController urlFilenameViewController(){
		return new UrlFilenameViewController();
	}
	
}
