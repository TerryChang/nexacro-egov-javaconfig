package nexacro.sample.service.impl;

import java.util.List;

import javax.annotation.Resource;

import nexacro.sample.service.CodeService;
import nexacro.sample.service.dao.ibatis.CodeDAO;
import nexacro.sample.vo.CodeVO;
import nexacro.sample.vo.GroupCodeVO;

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
@Service("codeService")
public class CodeServiceImpl extends EgovAbstractServiceImpl implements CodeService {

    @Resource(name = "codeDAO")
    private CodeDAO codeDAO;

    @Transactional(readOnly=true)
    @Override
    public List<GroupCodeVO> selectCodeGroupList(GroupCodeVO searchVo) {
        return codeDAO.selectCodeGroupList(searchVo);
    }

    @Transactional(readOnly=true)
    @Override
    public List<CodeVO> selectCodeList() {
        return codeDAO.selectCodeList();
    }

    @Transactional
    @Override
    public void modifyCodeGroup(List<GroupCodeVO> modifyVOList) {

        int size = modifyVOList.size();
        for (int i=0; i<size; i++) {
            GroupCodeVO group = modifyVOList.get(i);
            if (group instanceof DataSetRowTypeAccessor){
                DataSetRowTypeAccessor accessor = (DataSetRowTypeAccessor) group;
                
                if (accessor.getRowType() == DataSet.ROW_TYPE_INSERTED){
                    insertGroupCodeVO(group);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_UPDATED){
                    updateGroupCodeVO(group);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_DELETED){
                    deleteGroupCodeVO(group);
                }
            }
            
        }
    }

    @Transactional
    public void insertGroupCodeVO(GroupCodeVO groupCodeVO) {
        codeDAO.insertGroupCodeVO(groupCodeVO);
    }
    
    @Transactional
    public void updateGroupCodeVO(GroupCodeVO groupCodeVO) {
        codeDAO.updateGroupCodeVO(groupCodeVO);
    }
    
    @Transactional
    public void deleteGroupCodeVO(GroupCodeVO groupCodeVO) {
        codeDAO.deleteGroupCodeVO(groupCodeVO);
    }
    
    @Transactional
    @Override
    public void modifyCode(List<CodeVO> modifyVOList) {
        int size = modifyVOList.size();
        for (int i=0; i<size; i++) {
            CodeVO code = modifyVOList.get(i);
            if (code instanceof DataSetRowTypeAccessor){
                DataSetRowTypeAccessor accessor = (DataSetRowTypeAccessor) code;
                
                if (accessor.getRowType() == DataSet.ROW_TYPE_INSERTED){
                    insertCodeVO(code);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_UPDATED){
                    updateCodeVO(code);
                }else if (accessor.getRowType() == DataSet.ROW_TYPE_DELETED){
                    deleteCodeVO(code);
                }
            }
            
        }
    }

    @Transactional
    public void insertCodeVO(CodeVO codeVO) {
        codeDAO.insertCodeVO(codeVO);
    }
    
    @Transactional
    public void updateCodeVO(CodeVO codeVO) {
        codeDAO.updateCodeVO(codeVO);
    }
    
    @Transactional
    public void deleteCodeVO(CodeVO codeVO) {
        codeDAO.deleteCodeVO(codeVO);
    }
}
