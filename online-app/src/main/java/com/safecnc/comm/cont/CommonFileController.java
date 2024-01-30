package com.safecnc.comm.cont;

import java.io.IOException;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.safecnc.comm.srvc.CommonFileService;
import com.safecnc.comm.type.OpenApiTagType;
import com.safecnc.request.NexacroRequest;
import com.safecnc.response.NexacroResult;
import com.safecnc.web.handler.AbstractController;

import io.swagger.v3.oas.annotations.Operation;

@Controller
public class CommonFileController implements AbstractController, OpenApiTagType.CommonFile {
    
	@Operation(summary = "파일 리스트 조회")
    @PostMapping(value = "/cmm/CMM_FILE_SEARCH00.nx")
    public NexacroResult commonFileList(NexacroRequest nexacroRequest, ModelMap model, HttpServletRequest request)
            throws Exception {
        
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.commonFileList(request, param));
    }
    
	@Operation(summary = "파일 상세리스트 조회")
    @PostMapping(value = "/cmm/CMM_FILE_SEARCH10.nx")
    public NexacroResult commonFileOne(NexacroRequest nexacroRequest) throws Exception {
        
        Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.commonFileOne(param));
    }
    
	@Operation(summary = "파일 삭제")
    @PostMapping(value = "/cmm/CMM_FILE_DELETE00.nx")
    public NexacroResult commonFileDelete(NexacroRequest nexacroRequest, ModelMap model, HttpServletRequest request)
            throws Exception {
        
    	Map<String, Object> param = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.commonFileDelete(param));
    }
    
	@Operation(summary = "파일 비밀번호 변경")
    @PostMapping(value = "/cmm/CMM_FILE_UPDATE00.nx")
    public NexacroResult commonFilePasswordUpdate(NexacroRequest nexacroRequest, ModelMap model, HttpServletRequest request) {
        
        Map<String, Object> saveData = nexacroRequest.getMapVariableList();
        
        return new NexacroResult(service.commonFileUpdate(saveData));
    }
    
	@Operation(summary = "단일 파일 업로드")
    @PostMapping(value = "/cmm/fileUploadSingle.nx")
    public NexacroResult commonFileUploadSingle(MultipartHttpServletRequest request) throws Exception {

        return new NexacroResult(service.commonFileUploadSingle(request));
    }
    
	@Operation(summary = "복합 파일 업로드")
    @PostMapping(value = "/cmm/fileUpload.nx")
    public NexacroResult commonFileUpload(MultipartHttpServletRequest request) throws Exception {
        
        return new NexacroResult(service.commonFileUpload(request));
    }
	
	@Operation(summary = "파일 다운로드(복합)")
    @RequestMapping(value = "/cmm/fileDownload.nx", method = {RequestMethod.GET, RequestMethod.POST})
    public void commonFileDownload(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.commonFileDownload(request, response);
    }
	
	@PostMapping("/export/*")
	public String redirectExcelExport(HttpServletRequest request) {
		
		return "redirect:"+request.getRequestURL(); 
	}
	
	@Operation(summary = "파일 다운로드(공유)")
	@GetMapping("/api/filedownload/{FILE_ID}/{FILE_SEQ}/{FILE_NAME}/fileDownload.nx")
	public void commonFileDownloadOpen(HttpServletRequest request, HttpServletResponse response,
			@PathVariable("FILE_ID") String FILE_ID, @PathVariable("FILE_SEQ") String FILE_SEQ,
			@PathVariable("FILE_NAME") String FILE_NAME) throws IOException {
		
		request.setAttribute("FILE_ID" , FILE_ID);
		request.setAttribute("FILE_SEQ" , FILE_SEQ);
		request.setAttribute("FILE_NAME" , FILE_NAME);
		
		service.commonFileDownload(request, response);
	}
	
	@PostMapping("/api/gateImages.nx")
	@Operation(summary = "로그인 이미지(공유)")
	public NexacroResult loginImages(HttpServletRequest request, HttpServletResponse response) {
		
        return new NexacroResult("dsImages", service.commonLoginImageList());
	}
	
    @Resource(name = "CommonFileService")
    private CommonFileService service;
}
