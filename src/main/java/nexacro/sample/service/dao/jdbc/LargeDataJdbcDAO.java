package nexacro.sample.service.dao.jdbc;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.stereotype.Repository;

import com.nexacro.spring.dao.Dbms;
import com.nexacro.spring.dao.DbmsProvider;
import com.nexacro.spring.dao.jdbc.JdbcRowHandler;
import com.nexacro.spring.data.NexacroFirstRowHandler;

/**
 * Test를 위한 DAO Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Repository("largeDataJdbcDAO")
public class LargeDataJdbcDAO extends JdbcDaoSupport {

	@Resource(name="dataSource")
    private DataSource dataSource;
    
    @Resource(name="dbmsProvider")
    private DbmsProvider dbmsProvider;

    @PostConstruct
    void init(){
        setDataSource(dataSource);
    }
    
    public void initData(int initDataCount) {
    	
    	getJdbcTemplate().execute("DELETE FROM TB_LARGE");
        
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for(int i=0; i<initDataCount; i++) {
            Object[] objArr = new Object[1];
            objArr[0] = "name-" + i;
            batchArgs.add(objArr);
        }

        getJdbcTemplate().batchUpdate("INSERT INTO TB_LARGE(NAME) VALUES(?)", batchArgs);

    }
    
    public void selectLargeData(NexacroFirstRowHandler firstRowHandler, String sendName, int firstRowCount) {
        
        String sql = "SELECT LARGE_ID, NAME FROM TB_LARGE";
        
        Dbms dbms = dbmsProvider.getDbms(dataSource);
        
        JdbcRowHandler rowHandler = new JdbcRowHandler(dbms, firstRowHandler, sendName, firstRowCount);
        getJdbcTemplate().query(sql,  new Object[]{}, rowHandler);
        
        rowHandler.sendRemainData();
        
    }
    
    
}
