package nexacro.sample.web;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.nexacro.spring.NexacroException;
import com.nexacro.spring.annotation.ParamDataSet;
import com.nexacro.spring.data.NexacroFileResult;
import com.nexacro.spring.data.NexacroResult;
import com.nexacro.spring.util.CharsetUtil;
import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.data.PlatformData;
import com.nexacro.xapi.data.datatype.PlatformDataType;
import com.nexacro.xapi.tx.DataDeserializer;
import com.nexacro.xapi.tx.DataSerializerFactory;
import com.nexacro.xapi.tx.PlatformException;
import com.nexacro.xapi.tx.PlatformType;

/**
 * Test를 위한 Controller Sample Class
 *
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
@Controller
public class AdvancedFileController {

	private static final String SP = File.separator;
    private static final String PREFIX = "";
    private static final String PATH = "WEB-INF"+SP+"upload";
	
	@Autowired
    private WebApplicationContext appContext;

	private Logger log = LoggerFactory.getLogger(AdvancedFileController.class);
	
    private String getFilePath() {
        ServletContext sc = appContext.getServletContext();
        String realPath = sc.getRealPath("/");
        String uploadPath = realPath + PATH;
        return uploadPath;
    }
    
    @RequestMapping(value = "/advancedUploadFiles.do" )
    public NexacroResult uploadFiles(HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        if(!(request instanceof MultipartHttpServletRequest)) {
            if(log.isDebugEnabled()) {
                log.debug("Request is not a MultipartHttpServletRequest");
            }
            return new NexacroResult();
        }
        
        DataSet resultDs = createDataSet4UploadResult();
        
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        uploadParameters(multipartRequest);
        uploadFiles(multipartRequest, resultDs);
        
        NexacroResult nexacroResult = new NexacroResult();
        nexacroResult.addDataSet(resultDs);

        return nexacroResult;
    }

    @RequestMapping(value = "/advancedDownloadFile.do")
    public NexacroFileResult downloadFile(
                                HttpServletRequest request
//                                , @RequestParam String fileName
                                ) throws Exception {
        
        String characterEncoding = request.getCharacterEncoding();
        if(characterEncoding == null) {
            characterEncoding = PlatformType.DEFAULT_CHAR_SET;
        }
        String charsetOfRequest = CharsetUtil.getCharsetOfRequest(request, characterEncoding);
        String queryString = request.getQueryString();
        Map<String, String> queryMap = getQueryMap(queryString, charsetOfRequest);
        String fileName = queryMap.get("fileName");
        if(fileName == null) {
            throw new NexacroException("No input fileName specified.");
        }
        // was의 uri encoding을 사용안함. (서버의 설정을 변경하여야 함. URIEncoding="UTF-8")
        // already decode..
        // tomcat의 기본 uriencoding 형식 + web.xml의 charsetfilter utf8 (runtime version 은  uriencoding 되지  않고 있음)
//        fileName = new String(fileName.getBytes("iso8859-1"), characterEncoding);
        fileName = URLDecoder.decode(fileName, charsetOfRequest);
        fileName = removedPathTraversal(fileName);
        
        String filePath = getFilePath();
        String realFileName = filePath + SP + fileName;
        
        File file = new File(realFileName);
        
        NexacroFileResult result = new NexacroFileResult(file);
        // default - application/octet-stream
        // result.setContentType(contentType); // set MIME TYPE
        
        return result;
    }
    
    @RequestMapping(value = "/advancedDeleteFiles.do")
    public NexacroResult deleteFiles(@ParamDataSet(name="input") DataSet dsInput) throws Exception {
        
        if(dsInput == null) {
            throw new NexacroException("No input DataSet('input') specified.");
        }
        
        String filePath = getFilePath();
        
        String errorMessage = "";
        int rowCount = dsInput.getRowCount();
        for (int i = 0; i < rowCount; i++) {

            String fileRealNm = dsInput.getString(i, "filename");
            if(fileRealNm == null || fileRealNm.length() == 0) {
                continue;
            }
            
            String fileName = removedPathTraversal(fileRealNm);

            if (errorMessage.length() > 0) {
                errorMessage += "\r\n";
            }

            try {
                File f = new File(filePath + File.separator, fileName);
                if (f.exists()) {
                    if (f.delete()) {
                        errorMessage += "'" + fileName + "' Delete Success";
                    } else {
                        errorMessage += "'" + fileName + "' Delete failed";
                    }
                } else {
                    errorMessage += "'" + fileName + "' File not available";
                }
            } catch (Exception e) {
                errorMessage += "'" + fileName + "' " + e;
                NexacroException nexacroException = new NexacroException();
                nexacroException.setErrorCode(-1);
                nexacroException.setErrorMsg(errorMessage);
            }
            
        }
        
        return new NexacroResult();
    }
    
    private void uploadParameters(MultipartHttpServletRequest multipartRequest) throws NexacroException {
        
        // parameter and multipart parameter
        Enumeration<String> parameterNames = multipartRequest.getParameterNames();

        while(parameterNames.hasMoreElements()) {
            
            String parameterName = parameterNames.nextElement();
            if(parameterName == null || parameterName.length() == 0) {
                continue;
            }
            
            String value = multipartRequest.getParameter(parameterName);
            
            if("inputDatasets".equals(parameterName)) {
                
                HttpHeaders multipartHeaders = multipartRequest.getMultipartHeaders(parameterName);
                String multipartContentType = multipartRequest.getMultipartContentType(parameterName);
                
                PlatformData platformData = new PlatformData();
                StringReader reader = new StringReader(value);
                DataDeserializer deserializer = DataSerializerFactory.getDeserializer(PlatformType.CONTENT_TYPE_SSV);
                try {
                    platformData = deserializer.readData(reader, null, PlatformType.DEFAULT_CHAR_SET);
                } catch (PlatformException e) {
                    log.debug("xml data not deserialize. data=" + value);
                    // throw new NexacroException("get platformData failed. e="
                    // + e);
                    continue;
                }
                
                DataSet dsInput = platformData.getDataSet("ds_input");

                //TODO
                //이후 처리는 각 업무로직에 맞게 사용할 것.
                continue;
                
            } else {
                String filePath = getFilePath();
                String fileName = removedPathTraversal(value);
                File f = new File(filePath + SP, fileName);
                if (f.exists()) {
                    f.delete();
                }
            }
            
        }
        
    }
    
    private void uploadFiles(MultipartHttpServletRequest multipartRequest, DataSet resultDs) throws IOException {
        
        // files..
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        String filePath = getFilePath();
        
        Set<String> keySet = fileMap.keySet();
        for(String name: keySet) {
            
            MultipartFile multipartFile = fileMap.get(name);

            String originalFilename = multipartFile.getOriginalFilename();
            
//            //iOS 6.0버그(이미지선택시 image.jpg로만 반환하는 버그대응용. 20150312)
//            if(isIOS && fileName.equalsIgnoreCase("image.jpg")){
//                Date today = new Date();
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HHmmssSSS");
//                fileName = "image." +   sdf.format(today)  + ".jpg";
//            }

            // IE에서 파일업로드 시 DataSet 파라매터의 Content-Type이 설정되지 않아 여기로 옴. 무시.
            if(originalFilename == null || originalFilename.length() == 0) {
                continue;
            }
            
            File destination = new File(filePath+SP+originalFilename);
//            multipartFile.transferTo(destination);
            InputStream inputStream = multipartFile.getInputStream();
            FileCopyUtils.copy(inputStream, new FileOutputStream(destination));
            
            int row = resultDs.newRow();
            resultDs.set(row, "fileid", originalFilename);
            resultDs.set(row, "filename", originalFilename);
            resultDs.set(row, "filesize", destination.length());
            resultDs.set(row, "prog", 0);
            
            if(log.isDebugEnabled()) {
                log.debug("uploaded file write success. file="+originalFilename);
            }
        }
        
    }
    
    private String removedPathTraversal(String fileName) {
        if(fileName == null) {
            return null;
        }
        
        fileName = fileName.replace("/", "");
        fileName = fileName.replace("\\", "");
//        fileName = fileName.replace(".", "");
        fileName = fileName.replace("&", "");
        return fileName;
    }
    
    private DataSet createDataSet4UploadResult() {
        
        DataSet ds = new DataSet("ds_output");
        ds.addColumn("fileid", PlatformDataType.STRING);
        ds.addColumn("fileimg", PlatformDataType.STRING);
        ds.addColumn("filename", PlatformDataType.STRING);
        ds.addColumn("filesize", PlatformDataType.INT);
        ds.addColumn("tranfilesize", PlatformDataType.INT);
        ds.addColumn("prog", PlatformDataType.INT);
        
        return ds;
    }
    
    public static Map<String, String> getQueryMap(String queryString, String charset) throws UnsupportedEncodingException {

        String decodeQs = URLDecoder.decode(queryString, charset);
        int questionIndex = decodeQs.indexOf("?");
        String parameterString = decodeQs.substring(questionIndex + 1);
        String[] parameterPairs = parameterString.split("&");

        String parameterName;
        String parameterValue;
        Map<String, String> map = new HashMap<String, String>();
        for(int i=0; i<parameterPairs.length; i++) {
            String[] keyAndValue = parameterPairs[i].split("=");
            parameterName = null;
            parameterValue = null;
            if(keyAndValue.length>0) {
                parameterName = keyAndValue[0];
                parameterValue = keyAndValue[1];
                map.put(parameterName, parameterValue);
            }
        }
        
        return map;
    }
    
    private boolean isIosRequest(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        userAgent = userAgent.toLowerCase();
        System.out.println("userAgent=" + userAgent);
        if (userAgent.indexOf("macintosh") > -1 || userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1) {
            return true;
        }
        return false;
    }
    
}
