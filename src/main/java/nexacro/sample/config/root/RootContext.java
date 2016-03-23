package nexacro.sample.config.root;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({ContextCommon.class, ContextCommonException.class, ContextConfiguration.class
	, ContextDataSource.class, ContextInitialize.class, ContextMapper.class
	, ContextNexacro.class, ContextSqlMap.class, ContextTransaction.class
})
public class RootContext {

}
