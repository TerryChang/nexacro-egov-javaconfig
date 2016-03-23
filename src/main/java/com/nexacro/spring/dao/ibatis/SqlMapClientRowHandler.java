package com.nexacro.spring.dao.ibatis;

import java.util.Map;

import com.ibatis.sqlmap.client.event.RowHandler;
import com.nexacro.spring.dao.NexacroFirstRowException;
import com.nexacro.spring.data.NexacroFirstRowHandler;
import com.nexacro.spring.data.convert.NexacroConvertException;
import com.nexacro.spring.data.support.ObjectToDataSetConverter;
import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.tx.PlatformException;

/**
 * 
 * ibatis를 사용하여 nexacro platform으로 대용량 데이터를 전송하려고 할때 사용되는 RowHandler 이다.
 * <p>아래와 같은 형식으로 처리하며, 쿼리가 실행한 후 남아 있는 데이터가 존재할 수 있기 때문에 전송되지 않은 데이터를 전송한다.
 * 
 * <pre>
SqlMapClientRowHandler rowHandler = new SqlMapClientRowHandler(firstRowHandler, sendName, firstRowCount);
getSqlMapClientTemplate().queryWithRowHandler("largeDataDAO.selectLargeData", null, rowHandler);

// send remain data..
rowHandler.sendRemainData();
 * 
 * </pre>
 * 
 * @author Park SeongMin
 * @since 08.17.2015
 * @version 1.0
 * @see
 */

public class SqlMapClientRowHandler implements RowHandler {

    private static final int DEFAULT_FIRSTROW_COUNT = 1000;
    
    private ObjectToDataSetConverter converter;
    private NexacroFirstRowHandler firstRowHandler;
    private String resultName;
    private int firstRowCount;
    
    private DataSet currentDataSet;
    private int currentCount = 0;
    
    public SqlMapClientRowHandler(NexacroFirstRowHandler firstRowHandler, String resultName, int firstRowCount) {
        this.firstRowHandler = firstRowHandler;
        this.resultName = resultName;
        this.firstRowCount = firstRowCount;
        if(this.firstRowCount <= 0) {
            this.firstRowCount = DEFAULT_FIRSTROW_COUNT;
        }
        // TODO getting NexacroConverterFactory.getConverter();
        this.converter = new ObjectToDataSetConverter();
    }

    @Override
    public void handleRow(Object valueObject) {
        try {
            prepareDataSet(valueObject);
            addRow(valueObject);
            currentCount++;
            if(currentCount % firstRowCount == 0) {
                sendDataSet();
            }
        } catch (PlatformException e) {
            throw new NexacroFirstRowException("could not send data. e="+e.getMessage(), e);
        } catch (NexacroConvertException e) {
            throw new NexacroFirstRowException("object to dataset convert failed. e="+e.getMessage(), e);
        }
    }

    /**
     * 데이터 분할 전송 후 남아 있는 데이터를 전송한다.
     */
    public void sendRemainData() {
    	 // send remain data..
        DataSet remainDataSet = getDataSet();
        if(remainDataSet != null && remainDataSet.getRowCount() > 0) {
            try {
                firstRowHandler.sendDataSet(remainDataSet);
            } catch (PlatformException e) {
//                throw new NexacroException("could not send remain data. query="+queryId+" e="+e.getMessage(), e);
                throw new NexacroFirstRowException("could not send remain data. e="+e.getMessage(), e);
            }
        }
    }

    
    
    private void sendDataSet() throws PlatformException {
        firstRowHandler.sendDataSet(currentDataSet);
    }

    private void addRow(Object valueObject) throws NexacroConvertException {
        if(valueObject instanceof Map) {
            converter.addRowIntoDataSet(currentDataSet, (Map) valueObject);
        } else {
            converter.addRowIntoDataSet(currentDataSet, valueObject);    
        }
        
    }

    private void prepareDataSet(Object valueObject) throws NexacroConvertException {
        if(this.currentDataSet != null) {
            return;
        }
        this.currentDataSet = new DataSet(resultName != null? resultName: "RESULT0");
        
        if(valueObject instanceof Map) {
            converter.addColumnIntoDataSet(currentDataSet, (Map) valueObject);
        } else {
            converter.addColumnIntoDataSet(currentDataSet, valueObject);    
        }
    }
    
    public DataSet getDataSet() {
        return this.currentDataSet;
    }
}
