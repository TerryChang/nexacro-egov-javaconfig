package nexacro.sample.web;

import java.util.List;

import javax.annotation.Resource;

import nexacro.sample.service.CodeService;
import nexacro.sample.vo.CodeVO;
import nexacro.sample.vo.GroupCodeVO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nexacro.spring.NexacroException;
import com.nexacro.spring.annotation.ParamDataSet;
import com.nexacro.spring.data.NexacroResult;

/**
 * Test를 위한 Controller Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Controller
public class CodeController  {

	private static final Logger log = LoggerFactory.getLogger(AdvancedFileController.class);
	
    @Resource(name = "codeService")
    private CodeService codeService;
    
    /**
     * 
     * Code를 조회 한다.
     *
     * @param searchVOList
     * @return
     * @throws NexacroException 
     */
    @RequestMapping(value = "/selectCodeGroupList.do")
	public NexacroResult selectCodeGroupList(@ParamDataSet(name = "ds_search", required = false) GroupCodeVO searchVo) {
 
        List<GroupCodeVO> groupCodeList = codeService.selectCodeGroupList(searchVo);
        
        List<CodeVO> codeList = codeService.selectCodeList();
        
        NexacroResult result = new NexacroResult();
        result.addDataSet("dsGroupCode", groupCodeList);
        result.addDataSet("dsCode", codeList);
        
        return result;
    }
    
    /**
     * 
     * Code를 수정한다.
     *
     * @param modifyGroupList
     * @param modifyCodeList
     * @return
     */
    @RequestMapping(value = "/modifyCodes.do")
    public NexacroResult modifyCodes(@ParamDataSet(name="dsGroupCode") List<GroupCodeVO> modifyGroupList
                            , @ParamDataSet(name="dsCode") List<CodeVO> modifyCodeList){
        
        codeService.modifyCodeGroup(modifyGroupList);
        codeService.modifyCode(modifyCodeList);
        
        NexacroResult result = new NexacroResult();
        
        return result;
    }
    
}
