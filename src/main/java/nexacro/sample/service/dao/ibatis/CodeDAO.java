package nexacro.sample.service.dao.ibatis;

import java.util.List;

import nexacro.sample.vo.CodeVO;
import nexacro.sample.vo.GroupCodeVO;

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
@Repository("codeDAO")
public class CodeDAO extends NexacroIbatisAbstractDAO {

    public List<GroupCodeVO> selectCodeGroupList(GroupCodeVO searchVO) {
        return (List<GroupCodeVO>) list("codeDAO.selectCodeGroupList", searchVO);
    }

    public List<CodeVO> selectCodeList() {
        return (List<CodeVO>) list("codeDAO.selectCodeList", null);
    }

    public void insertGroupCodeVO(GroupCodeVO groupCodeVO) {
        insert("codeDAO.insertGroupCode", groupCodeVO);
    }

    public void updateGroupCodeVO(GroupCodeVO groupCodeVO) {
        update("codeDAO.updateGroupCode", groupCodeVO);
    }

    public void deleteGroupCodeVO(GroupCodeVO groupCodeVO) {
        delete("codeDAO.deleteGroupCode", groupCodeVO);
    }
    
    public void insertCodeVO(CodeVO codeVO) {
        insert("codeDAO.insertCode", codeVO);
    }

    public void updateCodeVO(CodeVO codeVO) {
        update("codeDAO.updateCode", codeVO);
    }

    public void deleteCodeVO(CodeVO codeVO) {
        delete("codeDAO.deleteCode", codeVO);
    }
    
}
