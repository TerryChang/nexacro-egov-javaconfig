package nexacro.sample.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import nexacro.sample.service.SampleService;
import nexacro.sample.service.dao.mybatis.SampleMapper;
import nexacro.sample.vo.SampleVO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * Test를 위한 ServiceImpl Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Service("sampleMybatisService")
public class SampleServiceMybatisImpl extends EgovAbstractServiceImpl implements SampleService {

    @Resource(name = "sampleMapper")
    private SampleMapper sampleMapper;
	
    @Transactional(readOnly=true)
	@Override
	public List<SampleVO> selectSampleVOList(SampleVO searchVO) {
		return sampleMapper.getSampleVOList(searchVO);
	}

    @Transactional(readOnly=true)
	@Override
	public List<Map> selectSampleMapList(SampleVO searchVO) {
		return sampleMapper.getSampleMapList(searchVO);
	}

    @Transactional
	@Override
	public void modifyMultiSampleVO(List<SampleVO> modifyList) {

	}

    @Transactional(readOnly=true)
	@Override
	public List<SampleVO> selectSamplePaging(SampleVO searchVO) {
		return null;
	}

    @Transactional(readOnly=true)
	@Override
	public int selectSampleCount(SampleVO searchVO) {
		return 0;
	}

}
