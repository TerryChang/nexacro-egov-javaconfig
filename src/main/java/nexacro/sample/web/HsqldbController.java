package nexacro.sample.web;

import org.hsqldb.util.DatabaseManagerSwing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Hsqldb manager를 실행하기 위한 Controller
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Controller
public class HsqldbController {

	private static final Logger log = LoggerFactory.getLogger(HsqldbController.class);

	private DatabaseManagerSwing manager = new DatabaseManagerSwing();
	
	/*
   	<!-- hsqldb manager -->
    <bean depends-on="dataSource" class="org.springframework.beans.factory.config.MethodInvokingBean">
		<property name="targetClass" value="org.hsqldb.util.DatabaseManagerSwing" />
		<property name="targetMethod" value="main" />
		<property name="arguments">
			<list>
				<value>--url</value>
				<value>jdbc:hsqldb:mem:dataSource</value>
				<value>--user</value>
				<value>sa</value>
				<value>--password</value>
				<value></value>
			</list>
		</property>
	</bean>
	*/
	
    @RequestMapping(value = "/startHsqldb.do")
	public void startHsqldb() {
    	manager.main(new String[] {"--url", "jdbc:hsqldb:mem:dataSource", "--user", "sa", "--password", ""});
    }
    
}
