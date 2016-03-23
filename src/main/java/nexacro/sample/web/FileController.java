package nexacro.sample.web;

import java.io.File;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.nexacro.spring.NexacroException;
import com.nexacro.spring.data.NexacroFileResult;
import com.nexacro.spring.data.NexacroResult;
import com.nexacro.xapi.data.DataSet;
import com.nexacro.xapi.data.datatype.PlatformDataType;
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
public class FileController {

    @Autowired
    private WebApplicationContext appContext;

    private static final Logger log = LoggerFactory.getLogger(FileController.class);
    
    private static final String SP = File.separator;
    private static final String PREFIX = "file-";
    private static final String PATH = "WEB-INF"+SP+"upload";
    
    private String getFilePath() {
        ServletContext sc = appContext.getServletContext();
        String realPath = sc.getRealPath("/");
        String uploadPath = realPath + SP + PATH;
        return uploadPath;
    }
    
    @RequestMapping(value="/searchFiles.do" )
    public NexacroResult searchFiles() {
        
        String uploadPath = getFilePath();

        List<File> fileList = new ArrayList<File>();
        File directory = new File(uploadPath);
        addFiles(fileList, directory);

        DataSet ds = new DataSet("files");
        ds.addColumn("fileName", PlatformDataType.STRING);
        ds.addColumn("fileSize", PlatformDataType.LONG);
        
        for(File file: fileList) {
            int newRow = ds.newRow();
            ds.set(newRow, "fileName", file.getName());
            ds.set(newRow, "fileSize", file.length());
        }
        
        NexacroResult result = new NexacroResult();
        result.addDataSet(ds);
        
        return result;
    }
    
    @RequestMapping(value = "/uploadFiles.do")
    public NexacroResult uploadFiles(HttpServletRequest request, HttpServletResponse response) throws Exception {
        
        if(!(request instanceof MultipartHttpServletRequest)) {
            if(log.isDebugEnabled()) {
                log.debug("Request is not a MultipartHttpServletRequest");
            }
            return new NexacroResult();
        }
        
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        // parameter and multipart parameter
        Enumeration<String> parameterNames = multipartRequest.getParameterNames();
        
        // files..
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        String filePath = getFilePath();
        
        Set<String> keySet = fileMap.keySet();
        for(String name: keySet) {
            
            MultipartFile multipartFile = fileMap.get(name);

            String originalFilename = multipartFile.getOriginalFilename();

            File destination = File.createTempFile(PREFIX, originalFilename, new File(filePath));
            multipartFile.transferTo(destination);
//            FileCopyUtils.copy(inputStream, new FileOutputStream(destination));
            
            if(log.isDebugEnabled()) {
                log.debug("uploaded file write success. file="+originalFilename);
            }
        }

        return new NexacroResult();
    }

    @RequestMapping(value = "/downloadFile.do")
    public NexacroFileResult downloadFile(HttpServletRequest request
            , @RequestParam String fileName) throws Exception {
        
        if(fileName == null) {
            throw new NexacroException("No input File Name specified.");
        }
        
        String characterEncoding = request.getCharacterEncoding();
        if(characterEncoding == null) {
            characterEncoding = PlatformType.DEFAULT_CHAR_SET;
        }
        
        fileName = new String(fileName.getBytes("iso8859-1"), characterEncoding);
        
        fileName = fileName.replace("/", "");
        fileName = fileName.replace("\\", "");
//        fileName = fileName.replace(".", "");
        fileName = fileName.replace("&", "");
        
        String filePath = getFilePath();
        String realFileName = filePath + SP + fileName;
        // already decode..
        // String decodedFileName = URLDecoder.decode(realFileName, "utf-8");
        
        File file = new File(realFileName);
        
        NexacroFileResult result = new NexacroFileResult(file);
        // default - application/octet-stream
        // result.setContentType(contentType); // set MIME TYPE
        
        return result;
    }
    
    
    private void addFiles(List<File> files, File f) {
        if(f.isDirectory()) {
            File[] listFiles = f.listFiles();
            for(File file: listFiles) {
                addFiles(files, file);
            }
        } else {
            if (f.isFile()){
                files.add(f);
            }
        }
    }
    
}
