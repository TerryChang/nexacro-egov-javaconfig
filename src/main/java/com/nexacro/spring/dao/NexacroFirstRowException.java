package com.nexacro.spring.dao;


/**
 * DataAccess 데이터 분할 전송시 발생하는 예외를 의미한다.
 * 
 * @author Park SeongMin
 * @since 10.05.2015
 * @version 1.0
 *
 */
public class NexacroFirstRowException extends RuntimeException {

	/**
     * 메시지를 가지는 생성자이다.
     * 
     * @param message
     *            메시지
     */
    public NexacroFirstRowException(String message) {
        super(message);
    }

    /**
     * 메시지와 원천(cause) 예외를 가지는 생성자이다.
     * 
     * @param message
     *            메시지
     * @param cause
     *            원천 예외
     */
    public NexacroFirstRowException(String message, Throwable cause) {
        super(message, cause);
    }
	
}
