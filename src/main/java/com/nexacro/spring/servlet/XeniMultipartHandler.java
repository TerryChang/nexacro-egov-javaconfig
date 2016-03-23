package com.nexacro.spring.servlet;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.Enumeration;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.data.PlatformData;
import com.nexacro.xapi.tx.PlatformException;
import com.nexacro.xapi.tx.impl.PlatformXmlDataDeserializer;
import com.nexacro.xeni.extend.XeniMultipartProcBase;
import com.nexacro.xeni.extend.XeniMultipartReqData;
import com.nexacro.xeni.util.Constants;

/**
 * <pre>
 * XENI에서 Spring의 MultipartRequest를 처리하기 위한 구현체
 * Spring의 MultipartResolver가 등록 되어 있을 경우에 xeni.properties을 이용하여 등록하여 사용한다.
 *      xeni.multipart.proc=com.nexacro.spring.servlet.XeniMultipartHandler 이름으로 등록 가능하다.
 * </pre>
 *
 * @author Park SeongMin
 * @since 08.24.2015
 * @version 1.0
 * @see XeniMultipartProcBase
 */
public class XeniMultipartHandler implements XeniMultipartProcBase  {

    private Logger logger = LoggerFactory.getLogger(XeniMultipartHandler.class);
    
    @Override
    public XeniMultipartReqData getImportData(HttpServletRequest servletRequest) throws Exception {

        XeniMultipartReqData requestData = new XeniMultipartReqData();
        
        if(!(servletRequest instanceof MultipartHttpServletRequest)) {
            throw new IllegalArgumentException("Request is not a MultipartHttpServletRequest");
        }
        
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) servletRequest;
        
        // ssv stream
        PlatformData platformData = findPlatformData(multipartRequest);
        requestData.setPlatformData(platformData);
        
        // files..
        String sName = null;
        InputStream insFile = null;
        
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        Set<String> keySet = fileMap.keySet();
        for(String name: keySet) {
            
            MultipartFile multipartFile = fileMap.get(name);
            // fileName..
            sName = multipartFile.getOriginalFilename();
            sName = sName.replaceAll("\\\\", "/");
            int nIdx = sName.lastIndexOf('/');
            if (nIdx >= 0)
                sName = sName.substring(nIdx + 1); 
            
            // check upload file extention and detour
//            SecurityUtil.checkUploadFileExt(sName);
            
            InputStream in = multipartFile.getInputStream();
            insFile = new ByteArrayInputStream(IOUtils.toByteArray(in));
         
            in.close();
            
            if (logger.isDebugEnabled()) {
                logger.debug("File field " + name + " with file name " + sName + " detected.");
            }
            
        }
        
        requestData.setFileName(sName);
        requestData.setFileStream(insFile);
        
        return requestData;
    }

    private PlatformData findPlatformData(MultipartHttpServletRequest multipartRequest) throws IOException, PlatformException {
        
        // parameter and multipart parameter
        Enumeration<String> parameterNames = multipartRequest.getParameterNames();
        
        while(parameterNames.hasMoreElements()) {
            
            String parameterName = parameterNames.nextElement();
            if(parameterName == null || parameterName.length() == 0) {
                continue;
            }
            
            String parameter = multipartRequest.getParameter(parameterName);
            
            if(parameter == null || parameter.length() == 0) {
                continue;
            }
            
//            parameter = parameter.replaceAll("&amp;", "&");
//            parameter = parameter.replaceAll("&#59;", ";");
//            
//            parameter = parameter.replaceAll("&lt;", "<");
//            parameter = parameter.replaceAll("&gt;", ">");
//            parameter = parameter.replaceAll("&#63;", "?");
//            parameter = parameter.replaceAll("&quot;", "\"");
//            parameter = parameter.replaceAll("&#58;", ":");
//            parameter = parameter.replaceAll("&#35;", "#");
//            parameter = parameter.replaceAll("&#33;", "!");
//            
//            parameter = parameter.replaceAll("&#32;", " "); // 공백으로 변환 SAX Parser가 처리하지 못함.
            
            PlatformXmlDataDeserializer dataDes = new PlatformXmlDataDeserializer();
            PlatformData platformData = dataDes.readData(new StringReader(parameter), null, "UTF-8");
            if(platformData == null) {
                return null;
            }
            
            DataSet dsCmd = platformData.getDataSet(Constants.DATASET_COMMAND);
            if(dsCmd == null) {
                return platformData;
            }
            
            // multipart는 import만 처리 된다. 그 외는 예외를 던진다.
            String command = dsCmd.getString(0, Constants.COMMAND_COMMAND);
            if (!Constants.COMMAND_IMPORT.equalsIgnoreCase(command)) {
                throw new PlatformException("multipart request is supported only "+Constants.COMMAND_IMPORT);
            }
            
            // server에 존재하는 파일은 사용하지 않는다.
            String sMode = dsCmd.getString(0, Constants.COMMAND_FILEMODE);
            if (!"local".equalsIgnoreCase(sMode)) {
                throw new PlatformException("supported only local mode.");
            }
            
            return platformData;
        }
        
        return null;
    }
    
}
