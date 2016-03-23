package com.nexacro.spring.dao.mybatis;

import org.apache.ibatis.mapping.MappedStatement;

/**
 * {@code NexacroMybatisResultSetHandler}에서 메타데이터 조회를 위해 사용되는 정보이며, {@code NexacroMybatisMetaDataProvider}에 의해 제공된다.
 * 
 * @author Park SeongMin
 *
 */
class LookupResultSetMetaDataConfig {

	private final boolean isSearchMetaData;
	private final MappedStatement ms;
	
	LookupResultSetMetaDataConfig(final boolean isSearchMetaData, final MappedStatement ms) {
		this.isSearchMetaData = isSearchMetaData;
		this.ms = ms;
	}

	boolean isSearchMetaData() {
		return isSearchMetaData;
	}

	MappedStatement getMappedStatement() {
		return ms;
	}
	
}
