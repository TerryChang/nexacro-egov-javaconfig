package nexacro.sample.service.dao.mybatis;

import org.apache.ibatis.session.ResultHandler;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("largeDataMybatisMapper")
public interface LargeDataMybatisMapper {

	public void selectLargeData(ResultHandler resultHandler);
}
