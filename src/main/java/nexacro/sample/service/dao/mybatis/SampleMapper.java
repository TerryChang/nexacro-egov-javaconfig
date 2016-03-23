package nexacro.sample.service.dao.mybatis;

import java.util.List;
import java.util.Map;

import nexacro.sample.vo.SampleVO;
import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("sampleMapper") // egovframework annotation
public interface SampleMapper {

	public List<SampleVO> getSampleVOList(SampleVO searchVO);
	
	public List<Map> getSampleMapList(SampleVO searchVO);
	
}
