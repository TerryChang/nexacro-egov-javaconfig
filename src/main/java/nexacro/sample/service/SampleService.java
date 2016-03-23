package nexacro.sample.service;

import java.util.List;
import java.util.Map;

import nexacro.sample.vo.SampleVO;

/**
 * Test를 위한 Servlce Sample Intreface
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public interface SampleService {

    List<SampleVO> selectSampleVOList(SampleVO searchVO);

    List<Map> selectSampleMapList(SampleVO searchVO);
    
    List<SampleVO> selectSamplePaging(SampleVO searchVO);
    
    int selectSampleCount(SampleVO searchVO);
    
    void modifyMultiSampleVO(List<SampleVO> modifyList);

}
