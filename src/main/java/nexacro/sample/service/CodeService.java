package nexacro.sample.service;

import java.util.List;

import nexacro.sample.vo.CodeVO;
import nexacro.sample.vo.GroupCodeVO;

/**
 * Test를 위한 Servlce Sample Intreface
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public interface CodeService {

    /**
     * Statements
     *
     * @param searchVo
     * @return
     */
    List<GroupCodeVO> selectCodeGroupList(GroupCodeVO searchVo);

    /**
     * Statements
     *
     * @return
     */
    List<CodeVO> selectCodeList();

    /**
     * Statements
     *
     * @param modifyVOList
     */
    void modifyCodeGroup(List<GroupCodeVO> modifyVOList);

    /**
     * Statements
     *
     * @param modifyVOList
     */
    void modifyCode(List<CodeVO> modifyVOList);

}
