package com.nexacro.spring.dao;

import java.sql.Connection;

import javax.sql.DataSource;

/**
 * 데이터베이스 별 타입처리를 하기 위한 {@code Dbms}를 획득하기 위한 인터페이스이다.
 * 
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */
public interface DbmsProvider {
	
	Dbms getDbms(DataSource dataSource);
	
	Dbms getDbms(Connection conn);
	
}
