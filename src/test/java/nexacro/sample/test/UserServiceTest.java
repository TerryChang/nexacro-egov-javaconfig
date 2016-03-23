package nexacro.sample.test;

import java.util.List;

import javax.annotation.Resource;

import nexacro.sample.service.UserService;
import nexacro.sample.vo.UserVO;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import com.nexacro.spring.NexacroException;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = { "classpath*:spring/context-*.xml", "file:src/main/webapp/WEB-INF/config/springmvc/dispatcher-servlet.xml" })
public class UserServiceTest {

	@Resource
	private UserService	userService;

	@Resource
	private Validator	validator;
	
	@InitBinder
	public void initBinder(WebDataBinder dataBinder){
		dataBinder.setValidator(this.validator);
	}

	@Test
	public void testSelectUserVO() throws NexacroException {
		UserVO searchVo = new UserVO();
		searchVo.setUserName("홍길동");
		searchVo.setSearchCondition("NAME");

		List<UserVO> userList = userService.selectUserVOList(searchVo);

		if (userList.size() == 1 && "홍길동".equals(userList.get(0).getUserName())) {
			Assert.assertTrue(true);
		} else {
			Assert.assertTrue(false);
		}
	}

	@Test
	public void testUserVO() {
		UserVO userVO = createUserVO("test1", "test1", "test1", "test1@tobesoft.com"); // 성공
		Assert.assertTrue(validate(userVO));
	}

	@Test
	public void testUserVOWithWrongValues() {
		UserVO userVO = createUserVO("testtesttesttesttestttt", "test1", "test1", "test1@tobesoft.com"); // 이름 20자 초과
		Assert.assertFalse(validate(userVO));

		userVO = createUserVO("test1", "te", "test1", "test1@tobesoft.com"); // 아이디 네 글자 미만
		Assert.assertFalse(validate(userVO));

		userVO = createUserVO("test1", "test1", "te", "test1@tobesoft.com"); // 패스워드 네 글자 미만
		Assert.assertFalse(validate(userVO));

		userVO = createUserVO("test1", "test1", "test1", "test1tobesoft.com"); // 이메일 유효성 검사 실패
		Assert.assertFalse(validate(userVO));
	}

	/**
	 * createUserVO
	 * @param name
	 * @param userId
	 * @param password
	 * @param email
	 * @return
	 */
	private UserVO createUserVO(String name, String userId, String password, String email) {
		UserVO userVO = new UserVO();
		userVO.setUserName(name); // 이름 20자 초과
		userVO.setUserId(userId);
		userVO.setPassword(password);
		userVO.setEmail(email);
		
		return userVO;
	}
	
	/**
	 * validate
	 * @param modifyList
	 * @throws NexacroException
	 */
	private boolean validate(UserVO userVO) {
		BindingResult bindingResult = new BeanPropertyBindingResult(userVO, "userVO");
		validator.validate(userVO, bindingResult);
		
		if (bindingResult.hasErrors()) {
			return false;
		} else {
			return true;
		}
	}
}
