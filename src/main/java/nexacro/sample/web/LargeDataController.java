package nexacro.sample.web;

import javax.annotation.Resource;

import nexacro.sample.service.LargeDataService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nexacro.spring.annotation.ParamVariable;
import com.nexacro.spring.data.NexacroFirstRowHandler;
import com.nexacro.spring.data.NexacroResult;
import com.nexacro.xapi.tx.PlatformType;

/**
 * Test를 위한 Controller Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Controller
public class LargeDataController {

	private static final Logger log = LoggerFactory.getLogger(LargeDataController.class);
	
    @Resource(name = "largeDataService")
    private LargeDataService largeDataService;
    
    @Resource(name = "largeDataJdbcService")
    private LargeDataService largeDataJdbcService;
    
    @Resource(name = "largeDataMybatisService")
    private LargeDataService largeDataMybatisService;
    
    private static int DATA_CNT = 100000;
    
    @RequestMapping(value = "/sampleLargeData.do")
    public NexacroResult largeData(NexacroFirstRowHandler firstRowHandler
                            , @ParamVariable(name="firstRowCount", required=false) int firstRowCount){
        
/*

runtime(XML, SSV, BINARY) 가능
browser
    - XML, SSV은 firefirstcount event가 모든데이터를 받았을 때 이벤트가 발생함.
    - BINARY 데이터 받지 않음.
공통
    - firenextcount event는 발생하지 않음.
 */

//        firstRowHandler.setContentType(PlatformType.CONTENT_TYPE_XML);
        firstRowHandler.setContentType(PlatformType.CONTENT_TYPE_SSV);
//        firstRowHandler.setContentType(PlatformType.CONTENT_TYPE_BINARY); // browser에서 데이터 받을수 없음.
        
        String sendDataSetName = "firstRowData";
        int initDataCount = DATA_CNT; // this is dummy data!!
        
        largeDataService.selectLargeData(firstRowHandler, sendDataSetName, firstRowCount, initDataCount);
        
        NexacroResult result = new NexacroResult();
        return result;
    }
    
    @RequestMapping(value = "/sampleJdbcLargeData.do")
    public NexacroResult jdbcLargeData(NexacroFirstRowHandler firstRowHandler
                            , @ParamVariable(name="firstRowCount", required=false) int firstRowCount){
        
        firstRowHandler.setContentType(PlatformType.CONTENT_TYPE_SSV);
        
        String sendDataSetName = "firstRowData";
        int initDataCount = DATA_CNT; // this is dummy data!!
        
        largeDataJdbcService.selectLargeData(firstRowHandler, sendDataSetName, firstRowCount, initDataCount);
        
        NexacroResult result = new NexacroResult();
        return result;
    }
    
    @RequestMapping(value = "/sampleMybatisLargeData.do")
    public NexacroResult mybatisLargeData(NexacroFirstRowHandler firstRowHandler
                            , @ParamVariable(name="firstRowCount", required=false) int firstRowCount){
        
        firstRowHandler.setContentType(PlatformType.CONTENT_TYPE_SSV);
        
        String sendDataSetName = "firstRowData";
        int initDataCount = DATA_CNT; // this is dummy data!!
        
        largeDataMybatisService.selectLargeData(firstRowHandler, sendDataSetName, firstRowCount, initDataCount);
        
        NexacroResult result = new NexacroResult();
        return result;
    }

}
