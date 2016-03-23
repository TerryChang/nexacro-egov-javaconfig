package nexacro.sample.service.impl;

import javax.annotation.Resource;

import nexacro.sample.service.LargeDataService;
import nexacro.sample.service.dao.ibatis.LargeDataDAO;
import nexacro.sample.service.dao.jdbc.LargeDataJdbcDAO;
import nexacro.sample.service.dao.mybatis.LargeDataMybatisMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nexacro.spring.dao.mybatis.MybatisRowHandler;
import com.nexacro.spring.data.NexacroFirstRowHandler;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * Test를 위한 ServiceImpl Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Service("largeDataMybatisService")
public class LargeServiceMybatisImpl extends EgovAbstractServiceImpl implements LargeDataService {

    @Resource(name = "largeDataMybatisMapper")
    private LargeDataMybatisMapper largeDataMybatisMapper;
    
    @Resource(name = "largeDataJdbcDAO")
    private LargeDataJdbcDAO largeDataJdbcDAO;
    
    private static boolean isInited = false;
    
    @Transactional
    @Override
    public void selectLargeData(NexacroFirstRowHandler firstRowHandler, String sendDataSetName, int firstRowCount, int initDataCount) {
        
        if(!isInited) {
//            largeDataDAO.initData(initDataCount);
            largeDataJdbcDAO.initData(initDataCount);
        }
        isInited = true;
        
        MybatisRowHandler rowHandler = new MybatisRowHandler(firstRowHandler, sendDataSetName, firstRowCount);
    	largeDataMybatisMapper.selectLargeData(rowHandler);
		rowHandler.sendRemainData();
        
    }

}
