package com.nexacro.spring.dao.jdbc;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.RowCallbackHandler;

import com.nexacro.spring.dao.DbColumn;
import com.nexacro.spring.dao.Dbms;
import com.nexacro.spring.dao.NexacroFirstRowException;
import com.nexacro.spring.data.NexacroFirstRowHandler;
import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.data.datatype.DataType;
import com.nexacro.xapi.tx.PlatformException;

/**
 * jdbc를 사용하여 nexacro platform으로 대용량 데이터를 전송하려고 할때 사용되는 RowHandler 이다.
 * <p>아래와 같은 형식으로 처리하며, 쿼리가 실행한 후 남아 있는 데이터가 존재할 수 있기 때문에 전송되지 않은 데이터를 전송한다.
 * 
 * <pre>
DataSource dataSource = getDataSource();
Dbms dbms = dbmsProvider.getDbms(dataSource);

JdbcRowHandler rowHandler = new JdbcRowHandler(dbms, firstRowHandler, sendName, firstRowCount);
getJdbcTemplate().query(sql, args, callbackHandler);

// send remain data..
rowHandler.sendRemainData();
 * 
 * </pre>
 *
 * @author Park SeongMin
 * @since 08.18.2015
 * @version 1.0
 * @see
 */

public class JdbcRowHandler implements RowCallbackHandler {

    private static final int DEFAULT_FIRSTROW_COUNT = 1000;
    private Dbms dbms;
    private NexacroFirstRowHandler firstRowHandler;
    private String resultName;
    private int firstRowCount;
    private DataSet currentDataSet;
    
    private int currentCount=0;
    
    public JdbcRowHandler(Dbms dbms, NexacroFirstRowHandler firstRowHandler, String resultName, int firstRowCount) {
        this.dbms = dbms;
        this.firstRowHandler = firstRowHandler;
        this.resultName = resultName;
        this.firstRowCount = firstRowCount;
        if(this.firstRowCount <= 0) {
            this.firstRowCount = DEFAULT_FIRSTROW_COUNT;
        }
    }
    
    @Override
    public void processRow(ResultSet rs) throws SQLException {
        prepareDataSet(rs);
        addRow(rs);
        try {
            currentCount++;
            if(currentCount % firstRowCount == 0) {
                sendDataSet();
            }
        } catch (PlatformException e) {
            throw new SQLException("could not send data. e="+e.getMessage());
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
//               throw new NexacroException("could not send remain data. query="+queryId+" e="+e.getMessage(), e);
               throw new NexacroFirstRowException("could not send remain data. e="+e.getMessage(), e);
           }
       }
   }
    
    private void sendDataSet() throws PlatformException {
        firstRowHandler.sendDataSet(currentDataSet);
    }

    private void addRow(ResultSet rs) throws SQLException {
        
        int newRow = currentDataSet.newRow();
        int columnCount = currentDataSet.getColumnCount();
        for(int columnIndex=0; columnIndex<columnCount; columnIndex++) {
            Object object = rs.getObject(columnIndex+1);
            currentDataSet.set(newRow, columnIndex, object);
        }
        
    }

    private void prepareDataSet(ResultSet rs) throws SQLException {
        if(this.currentDataSet != null) {
            return;
        }
        this.currentDataSet = new DataSet(resultName != null? resultName: "RESULT0");

        ResultSetMetaData metaData = rs.getMetaData();
        
        // get column information from ResultSetMetaData
        List<DbColumn> dbColumns = dbms.getDbColumns(metaData);
    
        for(DbColumn column: dbColumns) {
            String name = column.getName();
            DataType dataType = column.getDataType();
            int size = column.getSize();
            currentDataSet.addColumn(name, dataType, size);
        }
        
    }
    
    public DataSet getDataSet() {
        return this.currentDataSet;
    }

}
