package nexacro.sample.service;

import java.util.List;
import java.util.Map;

import nexacro.sample.vo.PersonVO;
import nexacro.sample.vo.UnitVO;

/**
 * Test를 위한 Servlce Sample Intreface
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public interface TestService {

    /**
     * Sample Service selectPerson Method
     * 
     * @return
     */
    PersonVO selectPerson(PersonVO personVO) throws Exception;
    
    List<UnitVO> selectUnit() throws Exception;
    
    List<Map> selectUnitMap(Map map) throws Exception;

    /**
     * Statements
     *
     * @return
     */
    List<Map> selectUnitResultClass();

    /**
     * Statements
     *
     * @return
     */
    List<Map> selectUnitMapAndResultMap();

}
