package nexacro.sample.service;

import com.nexacro.spring.data.NexacroFirstRowHandler;


/**
 * Test를 위한 Servlce Sample Intreface
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public interface LargeDataService {

    void selectLargeData(NexacroFirstRowHandler firstRowHandler, String sendDataSetName, int firstRowCount, int initDataCount);
    
}
