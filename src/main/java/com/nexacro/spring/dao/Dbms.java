package com.nexacro.spring.dao;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;

/**
 * ResultSetMetaData의 컬럼 정보를 토대로 데이터셋으로 변환하기 위한 컬럼정보를 DBMS 별 처리하기 위한 인터페이스이다.
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */

public interface Dbms {

	/**
	 * ResultSetMetaData의 컬럼 정보를 토대로 DataSet의 컬럼 정보를 획득한다.
	 * 
	 * @param resultSetMetaData
	 * @return dbColumns 
	 * @throws SQLException
	 */
    List<DbColumn> getDbColumns(ResultSetMetaData resultSetMetaData) throws SQLException;
    
}
