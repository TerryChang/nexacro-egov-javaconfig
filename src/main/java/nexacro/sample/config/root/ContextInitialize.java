package nexacro.sample.config.root;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

@Configuration
public class ContextInitialize {

	@Bean
	public DataSource dataSource(){
		return new EmbeddedDatabaseBuilder()
				.setType(EmbeddedDatabaseType.HSQL)
				.addScript("classpath:db/create_tb_board.sql")
				.addScript("classpath:db/create_tb_code.sql")
				.addScript("classpath:db/create_tb_large.sql")
				.addScript("classpath:db/create_tb_user.sql")
				.addScript("classpath:db/insert_tb_board.sql")
				.addScript("classpath:db/insert_tb_code.sql")
				.addScript("classpath:db/insert_tb_user.sql")
				.build();
	}
}
