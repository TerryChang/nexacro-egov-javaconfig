package nexacro.sample.web;

import java.util.List;

import javax.annotation.Resource;

import nexacro.sample.service.SampleService;
import nexacro.sample.vo.SampleVO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nexacro.spring.annotation.ParamDataSet;
import com.nexacro.spring.data.NexacroResult;

/**
 * Test를 위한 Controller mybatis Sample Class
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Controller
public class SampleMybatisController {

	private Logger log = LoggerFactory.getLogger(SampleController.class);
	
    @Resource(name = "sampleMybatisService")
    private SampleService sampleMybatisService;
    
    @RequestMapping(value = "/sampleMybatisSelectVO.do")
	public NexacroResult selectMybatisVo(@ParamDataSet(name = "ds_search", required = false) SampleVO searchVo) {
        
        List<SampleVO> sampleList = sampleMybatisService.selectSampleVOList(searchVo);
        
        NexacroResult result = new NexacroResult();
        result.addDataSet("output1", sampleList);
        
        return result;
    }
    
}
