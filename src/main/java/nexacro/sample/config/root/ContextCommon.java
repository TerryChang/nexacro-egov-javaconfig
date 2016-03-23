package nexacro.sample.config.root;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import egovframework.rte.fdl.cmmn.trace.LeaveaTrace;
import egovframework.rte.fdl.cmmn.trace.handler.DefaultTraceHandler;
import egovframework.rte.fdl.cmmn.trace.handler.TraceHandler;
import egovframework.rte.fdl.cmmn.trace.manager.DefaultTraceHandleManager;
import egovframework.rte.fdl.cmmn.trace.manager.TraceHandlerService;

@Configuration
@ComponentScan(
		basePackages="nexacro.sample",
		includeFilters={
			@ComponentScan.Filter(type=FilterType.ANNOTATION, value=Service.class)
			, @ComponentScan.Filter(type=FilterType.ANNOTATION, value=Repository.class)
		},
		excludeFilters={	
			@ComponentScan.Filter(type=FilterType.ANNOTATION, value=Controller.class)
			, @ComponentScan.Filter(type=FilterType.ANNOTATION, value=Configuration.class)
		}
)
public class ContextCommon {

	@Bean
	public ReloadableResourceBundleMessageSource messageSource(){
		ReloadableResourceBundleMessageSource rrbms = new ReloadableResourceBundleMessageSource();
		rrbms.setBasenames(new String[]{"classpath:message/message-common"
				, "classpath:message/message-user"});
		rrbms.setCacheSeconds(60);
		return rrbms;
	}

	@Bean
	public LeaveaTrace leaveaTrace(DefaultTraceHandleManager traceHandlerService){
		LeaveaTrace leaveaTrace = new LeaveaTrace();
		leaveaTrace.setTraceHandlerServices(new TraceHandlerService[]{traceHandlerService});
		return leaveaTrace;
	}

	@Bean
	public DefaultTraceHandleManager traceHandlerService(AntPathMatcher antPathMater, DefaultTraceHandler defaultTraceHandler){
		DefaultTraceHandleManager defaultTraceHandleManager = new DefaultTraceHandleManager();
		defaultTraceHandleManager.setReqExpMatcher(antPathMater);
		defaultTraceHandleManager.setPatterns(new String[]{"*"});
		defaultTraceHandleManager.setHandlers(new TraceHandler[]{defaultTraceHandler});
		return defaultTraceHandleManager;
	}
	
	@Bean
	public AntPathMatcher antPathMater(){
		AntPathMatcher antPathMatcher = new AntPathMatcher();
		return antPathMatcher;
	}
	
	@Bean
	public DefaultTraceHandler defaultTraceHandler(){
		DefaultTraceHandler defaultTraceHandler = new DefaultTraceHandler();
		return defaultTraceHandler;
	}
	
	@Bean
	public PathMatchingResourcePatternResolver pathMatchingResourcePatternResolver(){
		PathMatchingResourcePatternResolver pmrpr = new PathMatchingResourcePatternResolver();
		return pmrpr;
	}
	
}
