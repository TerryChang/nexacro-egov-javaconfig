package com.nexacro.spring.dao;

import com.nexacro.xapi.data.datatype.DataTypeFactory;

/**
 * Dbms의 기본 구현체이며, {@link DataTypeFactory}에 명시된 기본형태의 타입 변환을 제공한다.
 *
 * @author Park SeongMin
 * @since 08.07.2015
 * @version 1.0
 * @see
 */

public class DefaultDbms extends AbstractDbms {

    @Override
    public void handleColumnDataType(DbColumn column) {
    }

}
