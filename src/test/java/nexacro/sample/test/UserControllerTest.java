package nexacro.sample.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.data.PlatformData;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = { "classpath*:spring/context-*.xml",	"file:src/main/webapp/WEB-INF/config/springmvc/dispatcher-servlet.xml" })
public class UserControllerTest {
	
	@Autowired WebApplicationContext 	wac; 
	@Autowired ApplicationContext 		context;
    @Autowired MockHttpSession 			session;
    @Autowired MockHttpServletRequest 	request;

	private MockMvc						mockMvc;

	@Before
	public void setUp() throws Exception {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	@Test
	public void testUserSelectVO() throws Exception {
		MvcResult andReturn = mockMvc.perform(get("/userSelectVO.do")
				.contentType(MediaType.TEXT_XML)
				.content(createSampleDataSet()))
				.andExpect(status().isOk())
				.andReturn();
		
		MockHttpServletResponse response = andReturn.getResponse();
		
		PlatformData platformData = new PlatformData();
		platformData.loadXml(response.getContentAsString());
		
		DataSet dataSet = platformData.getDataSet("output1");
		
		Assert.assertEquals("hong", dataSet.getString(0, "userId"));
	}

	private String createSampleDataSet() {
		StringBuffer sb = new StringBuffer();
		sb.append("<Root xmlns=\"http://www.nexacro.com/platform/dataset\">\n")
		.append("<Parameters/>\n")
		.append("<Dataset id=\"ds_search\">\n")
		.append("<ColumnInfo>\n")
		.append("<Column id=\"searchCondition\" type=\"string\" size=\"32\"/>\n")
		.append("<Column id=\"searchKeyword\" type=\"string\" size=\"32\"/>  \n")
		.append("</ColumnInfo>\n")
		.append("<Rows>\n")
		.append("<Row>\n")
		.append("<Col id=\"searchKeyword\">홍길동</Col>\n")
		.append("<Col id=\"searchCondition\">NAME</Col>\n")
		.append("</Row>\n")
		.append("</Rows>\n")
		.append("</Dataset>\n")
		.append("</Root>\n");
		
		return sb.toString();
	}

}