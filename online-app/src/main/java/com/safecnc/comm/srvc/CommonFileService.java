package com.safecnc.comm.srvc;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.parser.ParseException;
import org.springframework.web.multipart.MultipartHttpServletRequest;

public interface CommonFileService {

	public Object commonFileUpload(MultipartHttpServletRequest request) throws ParseException;
	public Object commonFileUploadSingle(MultipartHttpServletRequest request) throws ParseException;
	public Object commonFileUpdate(Map<String, Object> param);
	public Object commonFileDownload(HttpServletRequest request,HttpServletResponse response);
	public Object commonFileList(HttpServletRequest request, Map<String, Object> param);
	public Object commonFileOne(Map<String, Object> param);
	public Object commonFileDelete(Map<String, Object> param);
	
	public Object commonLoginImageList();
 
}
