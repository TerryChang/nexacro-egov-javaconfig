package nexacro.sample.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import nexacro.sample.service.SampleService;
import nexacro.sample.service.dao.ibatis.SampleDAO;
import nexacro.sample.vo.SampleVO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nexacro.spring.data.DataSetRowTypeAccessor;
import com.nexacro.xapi.data.DataSet;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * Test를 위한 ServiceImpl Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Service("sampleService")
public class SampleServiceImpl extends EgovAbstractServiceImpl implements SampleService {

    /**
     * SampleDAO class 선언 (SampleDAO) Class Injection)
     * (SampleDAO)sampleDAO
     */
    // @Autowired(required = false) // Type 정의
    @Resource(name = "sampleDAO")
    // Name 정의
    private SampleDAO sampleDAO;

    @Transactional
    @Override
    public void modifyMultiSampleVO(List<SampleVO> modifyList) {

        int size = modifyList.size();
        for (int i=0; i<size; i++) {
            SampleVO sample = modifyList.get(i);
            if (sample instanceof DataSetRowTypeAccessor){
                DataSetRowTypeAccessor accessor = (DataSetRowTypeAccessor) sample;
                
                if (accessor.getRowType() == DataSet.ROW_TYPE_INSERTED){
                    insertSampleVO(sample);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_UPDATED){
                    updateSampleVO(sample);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_DELETED){
                    deleteSampleVO(sample);
                }
            }
            
        }
    }
    
    @Transactional(readOnly=true)
    @Override
    public List<SampleVO> selectSampleVOList(SampleVO searchVO) {
        return sampleDAO.selectSampleVoList(searchVO);
    }
    
    @Transactional(readOnly=true)
    @Override
	public List<Map> selectSampleMapList(SampleVO searchVO) {
    	return sampleDAO.selectSampleMapList(searchVO);
	}
    
    @Transactional(readOnly=true)
    @Override
    public List<SampleVO> selectSamplePaging(SampleVO searchVO) {
    	return sampleDAO.selectSamplePaging(searchVO);
    }

    @Transactional(readOnly=true)
	@Override
	public int selectSampleCount(SampleVO searchVO) {
		return sampleDAO.selectSampleCount(searchVO);
	}
    
    @Transactional
    public void insertSampleVO(SampleVO sample) {
        sampleDAO.insertSampleVO(sample);
    }
    
    @Transactional
    public void updateSampleVO(SampleVO sample) {
        sampleDAO.updateSampleVO(sample);
    }
    
    @Transactional
    public void deleteSampleVO(SampleVO sample) {
        sampleDAO.deleteSampleVO(sample);
    }
    
}
