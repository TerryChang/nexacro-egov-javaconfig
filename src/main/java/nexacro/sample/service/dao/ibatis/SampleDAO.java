package nexacro.sample.service.dao.ibatis;

import java.util.List;
import java.util.Map;

import nexacro.sample.vo.SampleVO;

import org.springframework.stereotype.Repository;

import com.nexacro.spring.dao.ibatis.NexacroIbatisAbstractDAO;

/**
 * Test를 위한 DAO Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Repository("sampleDAO")
public class SampleDAO extends NexacroIbatisAbstractDAO {

    public List<SampleVO> selectSampleVoList(SampleVO searchVO) {
    	return (List<SampleVO>) list("sampleDAO.selectSampleVOList", searchVO);
    }
    
    public List<Map> selectSampleMapList(SampleVO searchVO) {
    	return (List<Map>) list("sampleDAO.selectSampleMapList", searchVO);
    }

    public List<SampleVO> selectSamplePaging(SampleVO searchVO) {
    	return (List<SampleVO>) list("sampleDAO.selectSamplePaging", searchVO);
    }
    
    public int selectSampleCount(SampleVO searchVO) {
		return (int) select("sampleDAO.selectSampleCount", searchVO);
	}
    
    public void insertSampleVO(SampleVO sample) {
        insert("sampleDAO.insertSampleVO", sample);
    }
    
    public void updateSampleVO(SampleVO sample) {
        update("sampleDAO.updateSampleVO", sample);
    }
    public void deleteSampleVO(SampleVO sample) {
        delete("sampleDAO.deleteSampleVO", sample);
    }

}
