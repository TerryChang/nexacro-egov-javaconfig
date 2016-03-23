package nexacro.sample.service.dao.ibatis;

import java.util.List;

import nexacro.sample.vo.UserVO;

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
@Repository("userDAO")
public class UserDAO extends NexacroIbatisAbstractDAO {

    public List<UserVO> selectUserVoList(UserVO searchVO) {
        return (List<UserVO>) list("selectUserVOList", searchVO);
    }

    public void insertUserVO(UserVO user) {
        insert("insertUserVO", user);
    }
    
    public void updateUserVO(UserVO user) {
        insert("updateUserVO", user);
    }
    public void deleteUserVO(UserVO user) {
        insert("deleteUserVO", user);
    }

}
