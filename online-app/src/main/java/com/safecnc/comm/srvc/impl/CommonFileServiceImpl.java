package com.safecnc.comm.srvc.impl;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.nexacro.java.xapi.data.DataSet;
import com.nexacro.java.xapi.data.DataTypes;
import com.safecnc.comm.dimn.FtpClientConnectorFactory;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.comm.srvc.CommonFileService;
import com.safecnc.web.exception.CustomException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("CommonFileService")
public class CommonFileServiceImpl extends AbstractServiceImpl implements CommonFileService {
//
//	/**
//     * 경로를 사용하여 파일 리스트로 반환
//     * 
//     * @param baseDir
//     * @param downloadFileName
//     * @return
//     */
//    private File[] downloadFile(final String baseDir, final String downloadFileName) {
//
//		// - 다운로드 전체 파일 또는 단일 파일을 선택하여 반환한다.
//		File downloadFile = new File(this.filePath + fileSeperate + baseDir
//			+ ((Objects.isNull(downloadFileName)) ? "" : fileSeperate + downloadFileName));
//	
//		// 전체 폴더일 경우 전체 폴더를 배열로 반환
//		return downloadFile.isDirectory() ? downloadFile.listFiles() : new File[] { downloadFile };
//    }
//
//    /**
//     * 새로운 파일 그룹을 생성하여 조회하여 반환하는 함수
//     * 
//     * @return
//     */
//    @SuppressWarnings("unchecked")
//    private Map<String, Object> newFileGroup(final JSONObject obj) {
//    	
//		String sLOCK_PSWD = (String) obj.getOrDefault("LOCK_PSWD", "");
//		String sWORK_CD   = (String) obj.getOrDefault("WORK_CD", "");
//        String sCOMP_ID   = (String) obj.getOrDefault("COMP_ID", "");
//        String sWORK_USID = (String) obj.getOrDefault("WORK_USID", "");
//        String sWORK_IP   = (String) obj.getOrDefault("WORK_IP", "");
//        String sWORK_COMP = (String) obj.getOrDefault("WORK_COMP", "");
//        
//		Map<String, Object> searchData = new HashMap<String, Object>();
//
//		searchData.put("WORK_USID", sWORK_USID);
//		searchData.put("WORK_IP"  , sWORK_IP);
//		searchData.put("WORK_COMP", sWORK_COMP);
//		
//		
//		Map<String, Object> hmNewFileGroup = (Map) commonFileDao.searchNewFileGroup(searchData);
//		
//		// 패스워드를 등록한 다음 임시로 저장 한다.
//		hmNewFileGroup.put("LOCK_PSWD", sLOCK_PSWD);
//		hmNewFileGroup.put("LOCK_YSNO", sLOCK_PSWD.equals("") ? "0" : "1");
//		hmNewFileGroup.put("WORK_CD", sWORK_CD);
//		
//		// 채번 테이블로 선 등록 처리
//		commonFileDao.insertNewFileGroup(hmNewFileGroup);
//	
//		return hmNewFileGroup;
//    }
//
//    /**
//     * 기존에 존재 하는 파일 그룹을 조회 하는 함수
//     * 
//     * @param FileGroup
//     * @return
//     */
//    @SuppressWarnings("unchecked")
//    private Map<String, Object> getFileGroup(final JSONObject obj) {
//		
//		String sFILE_ID = (String) obj.get("FILE_ID");
//		
//		Map<String, Object> searchData = new HashMap<String, Object>();
//	
//		searchData.put("FILE_ID", sFILE_ID);
//	
//		return (Map<String, Object>) commonFileDao.searchFileGroup(searchData);
//    }
//
//    /**
//     * 신규 생성 하는 함수
//     * 
//     * @param mFile
//     * @param path
//     * @return
//     */
//    @SuppressWarnings("unchecked")
//    private boolean createNewFile(final MultipartFile mFile, final String baseDir, final String newFileName) {
//
//		try {
//			
//
//			ftpClientConnectorFactory.getObject().write(baseDir + "/" + newFileName, mFile.getInputStream());
//			
//			/*
//		    File directory = new File(this.filePath + fileSeperate + baseDir);
//		    
//		    if (!directory.exists()) {
//	
//		    	directory.mkdirs();
//		    }
//	
//		    // 출력 스트림을 열어 출력한다.
//		    FileOutputStream fos = new FileOutputStream(directory.getAbsoluteFile() + fileSeperate + newFileName);
//	
//		    fos.write(mFile.getBytes());
//	
//		    fos.close();
//			*/
//		    return true;
//	
//		} catch (Exception e) {
//		    return false;
//		}
//    }
//    
//    /**
//     * 신규 생성 하는 함수
//     * 
//     * @param mFile
//     * @param path
//     * @return
//     */
//    @SuppressWarnings("unchecked")
//    private boolean deleteFile(final String baseDir, final String deleteFileName) {
//
//		try {
//			
//			ftpClientConnectorFactory.getObject().rm(baseDir + "/" + deleteFileName);
//			/*
//		    File deleteFile = null;
//	
//		    // 삭제 파일 명이 입력 되지 않을 경우 폴더 전체를 삭제
//		    if (Objects.isNull(deleteFileName)) {
//		    	deleteFile = new File(this.filePath + fileSeperate + baseDir);
//		    } else {
//		    	deleteFile = new File(this.filePath + fileSeperate + baseDir + fileSeperate + deleteFileName);
//		    }
//	
//		    // 이미 삭제 되어 존재 하지 않을 경우 'true' 반환
//		    if (!deleteFile.exists()) {
//		    	return true;
//		    }
//	
//		    // 실제 폴더 또는 파일 삭제
//		    if (deleteFile.isDirectory()) {
//				for (File subFile : deleteFile.listFiles()) {
//				    FileUtils.forceDelete(subFile);
//				}
//		    } else {
//		    	FileUtils.forceDelete(deleteFile);
//		    }
//			 */
//		    return true;
//		} catch (Exception e) {
//	
//		    return false;
//		}
//    }
//
//    /**
//     * 단일 파일을 업로드 하는 함수
//     * 
//     * @param request
//     * @return
//     * @throws ParseException
//     */
//    @Override
//    public Object commonFileUploadSingle(MultipartHttpServletRequest request) throws ParseException {
//
//		Map<String, Object> returnValue = new HashMap<>();
//		// 반환값 처리를 위해서 반환 데이터셋 생성
//		DataSet dsout = new DataSet("dsOutput");
//	
//		dsout.addColumn("FILE_ID", DataTypes.STRING);
//		dsout.addColumn("FILE_SEQ", DataTypes.STRING);
//		dsout.addColumn("FILE_NAME", DataTypes.STRING);
//		dsout.addColumn("ERROR_CODE", DataTypes.STRING);
//		dsout.addColumn("ERROR_MSG", DataTypes.STRING);
//	
//		String data = (String) request.getParameter("data");
//		JSONObject obj = (JSONObject) new JSONParser().parse(data);
//		
//		String sFILE_ID = (String) obj.get("FILE_ID");
//		
//		Map<String, Object> param = new HashMap<>();
//	
//		// - 신규 업로드 가 아닐 경우 기존 데이터 삭제 후 입력
//		if (!sFILE_ID.equals("")) {
//		    param.put("FILE_ID", sFILE_ID);
//	
//		    this.commonFileDelete(param);
//		}
//	
//		// - 결과값을 사용하여 파일 업로드 컬럼 정보 생성
//		Map<String, Object> resultMap = (Map) this.commonFileUpload(request);
//	
//		DataSet dsResult = (DataSet) resultMap.get("dsOutput");
//		
//		param.put("WORK_USID", "FILE");
//		param.put("WORK_IP", "127.0.0.1");
//		param.put("WORK_COMP", "FILE");
//		param.put("FILE_ID", dsResult.getString(0, "FILE_ID"));
//		param.put("FILE_SEQ", "1");
//	
//		// - 파일 리스트를 기반으로 파일 정보 전체 조회하여 매핑룰 생성
//		Map<String, Object> hmFileOne = (Map) commonFileDao.searchFileOne(param);
//	
//		int nRow = dsout.newRow();
//	
//		dsout.set(nRow, "FILE_ID", hmFileOne.get("FILE_ID"));
//		dsout.set(nRow, "FILE_SEQ", hmFileOne.get("FILE_SEQ"));
//		dsout.set(nRow, "FILE_NAME", hmFileOne.get("FILE_NAME"));
//		dsout.set(nRow, "ERROR_CODE", dsResult.getString(0, "ERROR_CODE"));
//		dsout.set(nRow, "ERROR_MSG", dsResult.getString(0, "ERROR_MSG"));
//	
//		// - 반환 데이터셋을 등록 한 다음 화면으로 리턴
//		returnValue.put("dsout", dsout);
//	
//		return returnValue;
//    }
//
//    @Override
//    @SuppressWarnings("unchecked")
//    public Object commonFileUpload(MultipartHttpServletRequest request) throws ParseException {
//	
//		// 반환값 처리를 위해서 반환 데이터셋 생성
//		DataSet dataset = new DataSet("dsOutput");
//	
//		dataset.addColumn("FILE_ID" , DataTypes.STRING);
//		dataset.addColumn("ERROR_CODE", DataTypes.STRING);
//		dataset.addColumn("ERROR_MSG" , DataTypes.STRING);
//	
//		int nRow = dataset.newRow();
//	
//		dataset.set(nRow, "ERROR_CODE", "1");
//		dataset.set(nRow, "ERROR_MSG", "");
//		
//		//- 파라미터(data)를 불러 온다.
//		String data = (String) request.getParameter("data");
//		
//		HttpSession session = request.getSession();
//		
//		String str_WORK_USID = (String)session.getAttribute("WORK_USID");
//		String str_SESS_ID   = (String)session.getAttribute("WORK_IP");
//		
//		//- 데이터를 JSON 객체로 파싱하여 객체화 한다.
//		JSONObject obj = (JSONObject) new JSONParser().parse(data);
//		
//		//- 파라미터를 추출한다.
//		String pFILE_ID   = (String) obj.get("FILE_ID");
//		
//		obj.put("WORK_USID", str_WORK_USID);
//		obj.put("WORK_IP"  , str_SESS_ID);
//		obj.put("WORK_COMP", "FILE");
//		
//		// [FILE ID] 가 없을 경우 생성하여 등록 
//		Map<String, Object> mFILEXM = (pFILE_ID.trim().length() == 0) ? newFileGroup(obj) : getFileGroup(obj);
//		
//		try {
//		    // 기준 경로를 빌드 하여 고유 경로로 처리한다.
//		    String sFILE_PATH = (String) mFILEXM.get("FILE_PATH");
//		    String sFILE_ID   = (String) mFILEXM.get("FILE_ID");
//	
//		    log.info("===============================");
//		    log.info("FILE_PATH :: " + sFILE_PATH);
//		    log.info("===============================");
//	
//		    // - 새로운 파일 코드를 생성
//		    Map<String, Object> newFileInfo = null;
//	
//		    for (MultipartFile file : request.getFileMap().values()) {
//				
//				//- 심규 파일 순번을 조회
//				newFileInfo = (Map<String, Object>) commonFileDao.searchNewFile(mFILEXM);
//		
//				//- 초기값 및 할당값을 등록
//				int iDOWN_COUNT     = 0;
//				int sFILE_SEQ     = Integer.parseInt(String.valueOf(newFileInfo.get("FILE_SEQ")));
//
//				Long sFILE_SIZE    = file.getSize();
//				String sFILE_NAME  = file.getOriginalFilename();
//				String[] aSplitNM  = sFILE_NAME.split("\\.");
//				String sFILE_EXT  = aSplitNM[aSplitNM.length - 1];
//				String sSAVE_NAME  = UUID.randomUUID().toString() + this.filePostFix;
//				Boolean sIMG_YSNO = isImage(sFILE_EXT);
//		
//				// 이미지일 경우 이미지의 사이즈와 여부를 등록
//				if (sIMG_YSNO) {
//				    BufferedImage image = ImageIO.read(file.getInputStream());
//		
//				    newFileInfo.put("IMG_YSNO", "1");
//		
//				    if (Objects.isNull(image)) {
//						newFileInfo.put("IMG_WSIZE", "0");
//						newFileInfo.put("IMG_HSIZE", "0");
//				    } else {
//						newFileInfo.put("IMG_WSIZE", image.getWidth());
//						newFileInfo.put("IMG_HSIZE", image.getHeight());
//				    }
//				} else {
//				    newFileInfo.put("IMG_YSNO", "0");
//				    newFileInfo.put("IMG_WSIZE", "0");
//				    newFileInfo.put("IMG_HSIZE", "0");
//				}
//		
//				log.info("===============================");
//				log.info("FILE_SEQ : {}", sFILE_SEQ);
//				log.info("FILE_SIZE : {}", sFILE_SIZE);
//				log.info("FILE_EXT : {}", sFILE_EXT);
//				log.info("ORGIN FILE NAME : {}", sFILE_NAME);
//				log.info("SAVED FILE NAME : {}", sSAVE_NAME);
//				log.info("===============================");
//		
//				newFileInfo.put("FILE_ID", sFILE_ID);
//				newFileInfo.put("SAVE_NAME", sSAVE_NAME);
//				newFileInfo.put("FILE_NAME", sFILE_NAME);
//				newFileInfo.put("FILE_SIZE", sFILE_SIZE);
//				newFileInfo.put("FILE_EXT", sFILE_EXT);
//				newFileInfo.put("DOWN_COUNT", iDOWN_COUNT);
//				newFileInfo.put("IMG_YSNO", sIMG_YSNO);
//				
//		
//				// 물리적으로 파일 업로드
//				if (createNewFile(file, sFILE_PATH, sSAVE_NAME)) {
//				    // 물리 데이터가 등록이 되었다면 논리적 데이터 베이스에 파일 정보 등록
//				    commonFileDao.insertNewFile(newFileInfo);
//				}
//		    }
//		    
//		    // 반환값 처리를 위하여 값 세팅
//		    dataset.set(nRow, 0, sFILE_ID);
//		} catch (Exception e) {
//	
//		    // - 파일 업로드 실패 시 잔류 파일 삭제
//		    commonFileDao.deleteFileGroup(mFILEXM);
//	
//		    dataset.set(nRow, "ERROR_CODE", "-1");
//		    dataset.set(nRow, "ERROR_MSG", e.getMessage());
//		    e.printStackTrace();
//		}
//	
//		Map<String, Object> returnValue = new HashMap<>();
//	
//		returnValue.put("dsOutput", dataset);
//	
//		return returnValue;
//    }
//    
//    @Override
//    @SuppressWarnings("unchecked")
//    public Object commonFileDownload(HttpServletRequest request, HttpServletResponse response) {
//    	
//		// // 반환값 처리를 위해서 반환 데이터셋 생성
//	
//		File tempDirectory = null;
//		File tempFile      = null;
//		ZipFile zipFile    = null;
//		OutputStream out   = null;
//	
//		try {
//	
//		    out = response.getOutputStream();
//	
//		    String sFILE_ID = request.getParameter("FILE_ID");
//		    String sFILE_SEQ = request.getParameter("FILE_SEQ");
//		    String sFILE_NAME = request.getParameter("FILE_NAME");
//	
//		    if (Objects.isNull(sFILE_ID)) {
//			
//		    	sFILE_ID = (String) request.getAttribute("FILE_ID");
//		    }
//		    
//		    if (Objects.isNull(sFILE_SEQ)) {
//			
//		    	sFILE_SEQ = (String) request.getAttribute("FILE_SEQ");
//		    }
//		    
//		    if (Objects.isNull(sFILE_NAME)) {
//			
//		    	sFILE_NAME = (String) request.getAttribute("FILE_NAME");
//		    }
//	
//		    log.info("=====================================================");
//		    log.info("FILE_ID : {}", sFILE_ID);
//		    log.info("FILE_SEQ : {}", sFILE_SEQ);
//		    log.info("=====================================================");
//	
//		    Map<String, Object> param = new HashMap<>();
//	
//		    param.put("FILE_ID", sFILE_ID);
//		    param.put("FILE_SEQ", sFILE_SEQ);
//	
//		    Map<String, Object> fileGroupInfo = (Map) commonFileDao.searchFileGroup(param);
//	
//		    // - 등록된 그룹 정보가 없을 경우 null 반환
//		    if (Objects.isNull(fileGroupInfo)) {
//		    	return null;
//		    }
//	
//		    // 전체 다은로드 시
//		    if (Objects.isNull(sFILE_SEQ) || "".equals(sFILE_SEQ)) {
//		
//				// zip 파일명으로 변환
//				sFILE_NAME = Objects.isNull(sFILE_NAME) ? sFILE_ID + ".zip" : sFILE_NAME + ".zip";
//		
//				String sFILE_PATH = (String) fileGroupInfo.get("FILE_PATH");
//				String sLOCK_YSNO = (String) fileGroupInfo.get("LOCK_YSNO");
//				String sLOCK_PSWD = (String) fileGroupInfo.get("LOCK_PSWD");
//		
//				File[] files = downloadFile(sFILE_PATH, null);
//		
//				// - 파일 리스트를 기반으로 파일 정보 전체 조회하여 매핑룰 생성
//				List dataset = (List)commonFileDao.searchFileList(param);
//				Map<String,Object> row;
//				
//				Map<String, Map<String, String>> fileInfo = new HashMap<>();
//		
//				String vFILE_NAME, vSAVE_NAME, vFILE_SIZE;
//				
//				for (int i = 0; i < dataset.size(); i++) {
//					
//					row = (Map<String, Object>) dataset.get(i);
//					
//				    vFILE_NAME = (String)row.get("FILE_NAME");
//				    vSAVE_NAME = (String)row.get("SAVE_NAME");
//				    vFILE_SIZE = String.valueOf(row.get("FILE_SIZE"));
//		
//				    Map<String, String> rowMap = new HashMap<>();
//		
//				    rowMap.put("FILE_NAME", vFILE_NAME);
//				    rowMap.put("SAVE_NAME", vSAVE_NAME);
//		
//				    log.info("FILE_NAME : {} \t SAVE_NAME : {}", vFILE_NAME, vSAVE_NAME);
//		
//				    fileInfo.put(vSAVE_NAME, rowMap);
//				}
//		
//				ZipParameters parameters = new ZipParameters();
//		
//				parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
//				parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_ULTRA);
//				parameters.setSourceExternalStream(true); // 외부 스트림 전송 여부
//		
//				// - 비밀번호 처리
//				if ("1".equals(sLOCK_YSNO)) {
//				    parameters.setEncryptFiles(true);
//				    parameters.setEncryptionMethod(Zip4jConstants.ENC_METHOD_AES);
//				    parameters.setAesKeyStrength(Zip4jConstants.AES_STRENGTH_256);
//				    parameters.setPassword(sLOCK_PSWD);
//				}
//		
//				// - 전송전 처리 ( zip 파일 스트림을 헤더로 표기 )
//				response.setHeader("Content-Disposition",
//					"attachment;filename=" + URLEncoder.encode(sFILE_NAME, "UTF-8"));
//				response.setHeader("Content-Transfer-Encoding", "binary");
//				response.setContentType("utf-8");
//				response.setContentType("application/octet-stream;charset=UTF-8");
//		
//				// - 임시 폴더 처리
//				tempDirectory = new File(tempDir);
//		
//				if (!tempDirectory.exists()) {
//				    tempDirectory.mkdirs();
//				}
//		
//				// - 임시 파일 처리
//				tempFile = new File(tempDir + this.fileSeperate + sFILE_NAME);
//		
//				// - 시스템 종료 시 임시 파일 삭제
//				tempFile.deleteOnExit();
//		
//				if (tempFile.exists()) {
//				    FileUtils.forceDelete(tempFile);
//				}
//		
//				zipFile = new ZipFile(tempFile);
//		
//				for (File file : files) {
//					
//					if(Objects.isNull(fileInfo.get(file.getName()))) continue;
//					
//				    String saveFileName = fileInfo.get(file.getName()).get("FILE_NAME");
//				    
//				    parameters.setFileNameInZip(saveFileName);
//		
//				    zipFile.addFile(file, parameters);
//				}
//		
//
//			    ftpClientConnectorFactory.getObject().read(zipFile.getFile().getAbsolutePath(), out);
//			    /*
//				byte[] bytes = IOUtils.toByteArray(new FileInputStream(zipFile.getFile()));
//		
//				out.write(bytes);
//		
//				response.flushBuffer();
//				*/
//		    } else {
//				// - 선택 다운로드
//				sFILE_NAME = Objects.isNull(sFILE_NAME) ? sFILE_ID + ".zip" : sFILE_NAME + ".zip";
//		
//				String sFILE_PATH = (String) fileGroupInfo.get("FILE_PATH");
//				String sLOCK_YSNO = (String) fileGroupInfo.get("LOCK_YSNO");
//				String sLOCK_PSWD = (String) fileGroupInfo.get("LOCK_PSWD");
//				boolean isCompress = false;
//		
//				// - 파일 리스트를 기반으로 파일 정보 전체 조회하여 매핑룰 생성
//				Map<String, Object> hmFileOne = (Map) commonFileDao.searchFileOne(param);
//		
//				File[] files = downloadFile(sFILE_PATH, (String) hmFileOne.get("SAVE_NAME"));
//		
//				Map<String, Map<String, Object>> fileInfo = new HashMap<>();
//		
//				if (Objects.isNull(hmFileOne)) {
//				    throw new CustomException("-1", "파일을 찾을 수 없습니다.");
//				}
//		
//				fileInfo.put((String) hmFileOne.get("SAVE_NAME"), hmFileOne);
//		
//				if ("1".equals(sLOCK_YSNO)) {
//					
//				    isCompress = true;
//				}
//		
//				// - 압축일 경우 기존 폴더와 동일하게 처리
//				if (isCompress) {
//		
//				    ZipParameters parameters = new ZipParameters();
//		
//				    parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
//				    parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_ULTRA);
//				    parameters.setSourceExternalStream(true); // - 외부 스트림 전송 여부
//		
//				    // - 비밀번호 처리
//				    if (!"".equals(sLOCK_PSWD)) {
//		
//						parameters.setEncryptFiles(true);
//						parameters.setEncryptionMethod(Zip4jConstants.ENC_METHOD_AES);
//						parameters.setAesKeyStrength(Zip4jConstants.AES_STRENGTH_256);
//						parameters.setPassword(sLOCK_PSWD);
//				    }
//		
//				    // - 전송전 처리 ( zip 파일 스트림을 헤더로 표기 )
//				    response.setHeader("Content-Disposition","attachment;filename=" + URLEncoder.encode(sFILE_NAME, "UTF-8"));
//				    response.setHeader("Content-Transfer-Encoding", "binary");
//				    response.setContentType("utf-8");
//				    response.setContentType("application/octet-stream;charset=UTF-8");
//		
//				    // - 임시 폴더 처리
//				    tempDirectory = new File(tempDir);
//		
//				    if (!tempDirectory.exists()) {
//				    	tempDirectory.mkdirs();
//				    }
//		
//				    // - 임시 파일 처리
//				    tempFile = new File(tempDir + this.fileSeperate + sFILE_NAME);
//		
//				    if (tempFile.exists()) {
//				    	FileUtils.forceDelete(tempFile);
//				    }
//		
//				    zipFile = new ZipFile(tempFile);
//		
//				    for (File file : files) {
//		
//						String saveFileName = (String) fileInfo.get(file.getName()).get("FILE_NAME");
//			
//						log.info("==================================");
//						log.info("Service Password File Name : {}", saveFileName);
//						log.info("==================================");
//			
//						parameters.setFileNameInZip(saveFileName);
//			
//						zipFile.addFile(file, parameters);
//				    }
//				    
//				    
//				    ftpClientConnectorFactory.getObject().read(zipFile.getFile().getAbsolutePath(), out);
//				    /*
//				    byte[] bytes = IOUtils.toByteArray(new FileInputStream(zipFile.getFile()));
//		
//				    out.write(bytes);
//		
//				    response.flushBuffer();
//				    */
//				} else {
//				    
//				    String saveFileName = (String) hmFileOne.get("FILE_NAME");
//				    
//				    log.info("==================================");
//				    log.info("Service Single File Name : {}", saveFileName);
//				    log.info("==================================");
//				    
//				    // - 전송전 처리 ( 바이너리 스트림을 헤더로 표기 )
//				    response.setHeader("Content-Disposition","attachment;filename=\"" + URLEncoder.encode(saveFileName, "UTF-8") + "\"");
//				    response.setHeader("Content-Transfer-Encoding", "binary");
//				    response.setContentType("utf-8");
//				    response.setContentType("application/octet-stream;charset=UTF-8");
//				    
//				    ftpClientConnectorFactory.getObject().read(sFILE_PATH+"/"+(String) hmFileOne.get("SAVE_NAME"), out);
//				    /*
//				    // - 폴더 (1) 반환
//				    byte[] bytes = IOUtils.toByteArray(new FileInputStream(files[0]));
//				    
//				    out.write(bytes);
//				    
//				    response.flushBuffer();
//				    */
//				}
//		    }
//		    
//		    // - 다운로드 횟수 증가
//		    commonFileDao.updateDownloadFileCount(param);
//		} catch (Exception e) {
//		    e.printStackTrace();
//		} finally {
//	
//		    if (!Objects.isNull(out)) {
//				try {
//				    out.close();
//				} catch (IOException e) {
//				    e.printStackTrace();
//				}
//		    }
//	
//		    if (!Objects.isNull(tempFile)) {
//		    	tempFile.delete();
//		    }
//		}
//	
//		//
//		// Map<String, Object> returnValue = new HashMap<>();
//		//
//		// returnValue.put("dsOutput", dsOutput);
//		//
//		// return returnValue;
//		return null;
//    }
//
//    @Override
//    public Object commonFileList(HttpServletRequest request, Map<String, Object> param) {
//    	log.info("------ User Info : {}" + param);
//		
//		Map<String, Object> returnMap = new HashMap<String, Object>();
//	
//		returnMap.put("dsFileList", commonFileDao.searchFileList(param));
//	
//		return returnMap;
//    }
//
//    @Override
//    public Object commonFileOne(Map<String, Object> param) {
//	
//		Map<String, Object> returnMap = new HashMap<String, Object>();
//	
//		DataSet dsFileOne = new DataSet("dsFileOne");
//	
//		// - 파일 정보를 조회한다.
//		Map<String, Object> hsFileInfo = (Map) commonFileDao.searchFileOne(param);
//	
//		Iterator<String> keysets = hsFileInfo.keySet().iterator();
//	
//		// - 데이터 헤더를 생성한다.
//		while (keysets.hasNext()) {
//		    dsFileOne.addColumn(keysets.next(), DataTypes.STRING);
//		}
//	
//		// - 데이터를 매핑한다.
//		int nRow = dsFileOne.newRow();
//	
//		for (int c = 0; c < dsFileOne.getColumnCount(); c++) {
//		    String colID = dsFileOne.getColumn(c).getName();
//	
//		    dsFileOne.set(nRow, colID, hsFileInfo.get(colID));
//		}
//	
//		returnMap.put("dsFileOne", dsFileOne);
//	
//		return returnMap;
//    }
//
//    @Override
//    public Object commonFileDelete(Map<String, Object> param) {
//	
//		// - 반환값 처리를 위해서 반환 데이터셋 생성
//		DataSet dataset = new DataSet("dsOutput");
//	
//		dataset.addColumn("FILE_ID"  , DataTypes.STRING);
//		dataset.addColumn("ERROR_CODE" , DataTypes.STRING);
//		dataset.addColumn("ERROR_MSG"  , DataTypes.STRING);
//	
//		int nRow = dataset.newRow();
//	
//		dataset.set(nRow, "ERROR_CODE", "1");
//		dataset.set(nRow, "ERROR_MSG", "");
//	
//		try {
//	
//		    String sFILE_PATH = null;
//		    String sFILE_NAME = null;
//		    String sSAVE_NAME = null;
//	
//		    if (Objects.isNull(param.get("FILE_SEQ"))) {
//				Map<String, Object> hsGroupInfo = (Map) commonFileDao.searchFileGroup(param);
//		
//				sFILE_PATH = (String) hsGroupInfo.get("FILE_PATH");
//		
//				// 물리적 파일 또는 폴더 제거
//				if (deleteFile(sFILE_PATH, sFILE_NAME)) {
//		
//				    // 논리적 파일 또는 폴더 제거
//				    commonFileDao.deleteFileGroup(param);
//				}
//		    } else {
//	
//				Map<String, Object> hsFileInfo = (Map) commonFileDao.searchFileOne(param);
//		
//				sSAVE_NAME = (String) hsFileInfo.get("SAVE_NAME");
//				sFILE_PATH = (String) hsFileInfo.get("FILE_PATH");
//		
//				// 물리적 파일 또는 폴더 제거
//				if (deleteFile(sFILE_PATH, sSAVE_NAME)) {
//		
//				    // 논리적 파일 또는 폴더 제거
//				    commonFileDao.deleteFile(param);
//				}
//		    }
//	
//		} catch (Exception e) {
//			
//		    dataset.set(nRow, "ERROR_CODE", "-1");
//		    dataset.set(nRow, "ERROR_MSG", e.getMessage());
//		}
//	
//		Map<String, Object> returnValue = new HashMap<>();
//	
//		returnValue.put("dsOutput", dataset);
//	
//		return returnValue;
//    }
//
//    @Override
//    public Object commonFileUpdate(Map<String, Object> param) {
//	
//		// 반환값 처리를 위해서 반환 데이터셋 생성
//		DataSet dataset = new DataSet("dsOutput");
//	
//		dataset.addColumn("ERROR_CODE", DataTypes.STRING);
//		dataset.addColumn("ERROR_MSG", DataTypes.STRING);
//	
//		int nRow = dataset.newRow();
//	
//		dataset.set(nRow, "ERROR_CODE", "1");
//		dataset.set(nRow, "ERROR_MSG", "");
//	
//		Map<String, Object> returnValue = new HashMap<>();
//	
//		returnValue.put("dsOutput", dataset);
//	
//		try {
//	
//		    String encryptedPassword;
//	
//		    String newPassword = (String) param.get("_new");
//		    String oldPassword = (String) param.get("_old");
//		    String resetType   = (String) param.get("_reset");
//	
//		    Map<String, Object> hmNewFileGroup;
//	
//		    // 서버상에 저장 된 자료와 비교
//		    Map<String, Object> hmFileGroup = (Map) commonFileDao.searchFileGroup(param);
//	
//		    String fileGr = (String) hmFileGroup.get("FILE_ID");
//		    String lockYn = (String) hmFileGroup.get("LOCK_YSNO");
//		    String lockPw = (String) hmFileGroup.get("LOCK_PSWD");
//	
//		    // 이미 잠금이 지정 된 경우 기존 비밀번호와 신규 비밀번호를 확인하여 처리
//		    if (lockYn.equals("1")) {
//	
//				if (!encryptPasswordSha256_single_pass(oldPassword).equals(lockPw)) {
//		
//				    dataset.set(0, "ERROR_CODE", "-1");
//				    dataset.set(0, "ERROR_MSG", "Please check your password");
//		
//				    return returnValue;
//				}
//	
//		    }
//	
//		    // 그 외의 경우는 비밀번호 변경
//		    encryptedPassword = encryptPasswordSha256_single_pass(newPassword);
//	
//		    hmNewFileGroup = new HashMap<>();
//	
//		    if (resetType.equals("1")) {
//	
//				hmNewFileGroup.put("FILE_ID", fileGr);
//				hmNewFileGroup.put("LOCK_PSWD", "");
//				hmNewFileGroup.put("LOCK_YSNO", "0");
//		    } else {
//	
//				hmNewFileGroup.put("FILE_ID", fileGr);
//				hmNewFileGroup.put("LOCK_PSWD", encryptedPassword);
//				hmNewFileGroup.put("LOCK_YSNO", "1");
//		    }
//		    
//		    commonFileDao.updateFileGroup(hmNewFileGroup);
//	
//		} catch (Exception e) {
//		    dataset.set(0, "ERROR_CODE", "-1");
//		    dataset.set(0, "ERROR_MSG", e.getMessage());
//		}
//	
//		return returnValue;
//    }
//    
//    
//
//    @Override
//	public Object commonLoginImageList() {
//    		
//		return commonFileDao.commonLoginImageList();
//	}
//
//	/**
//     * 암호화 할 경우 압축 시 비밀번호 복호화를 할수 없기 때문에 개인 복호화 가능한 암호적용 이전까지는 암호화 한시적 보류
//     * 
//     * @param pass
//     * @return
//     */
//    private String encryptPasswordSha256_single_pass(String pass) {
//	
//		return pass;
//		/*
//		 * try { MessageDigest md = MessageDigest.getInstance("SHA-256");
//		 * 
//		 * md.update(pass.getBytes());
//		 * 
//		 * String hex = String.format("%064x", new BigInteger(1, md.digest())); return
//		 * hex; } catch (NoSuchAlgorithmException e) { e.printStackTrace(); return pass;
//		 * }
//		 */
//    }
//
//    private boolean isImage(String fileType) {
//		return fileType.equals("jpg") || fileType.equals("jpeg") || fileType.equals("bmp") || fileType.equals("gif")
//			|| fileType.equals("png") || fileType.equals("tiff");
//    }
//    
//	@Override
//	public Object commonFileDownloadAsset(HttpServletRequest request, HttpServletResponse response) {
//
//		String str_FILE_STRE_COURS_URL = (String)request.getAttribute("FILE_STRE_COURS_URL");
//        String str_STRE_FILE_NM        = (String)request.getAttribute("STRE_FILE_NM");
//        String str_ORIGNL_FILE_NM      = (String)request.getAttribute("ORIGNL_FILE_NM");		
//        
//		try (InputStream input = new URL(str_FILE_STRE_COURS_URL+fileSeperate+str_STRE_FILE_NM).openStream()){
//			
//			OutputStream out = response.getOutputStream();
//			
//		    // 전송전 처리 ( 바이너리 스트림을 헤더로 표기 )
//			String saveFileName = URLEncoder.encode(str_ORIGNL_FILE_NM, "UTF-8");
//			
//			// 엔터 케리지를 %20(엔터)로 변환
//			saveFileName = saveFileName.replaceAll("\\+", "%20");
//
//		    // - 전송전 처리 ( 바이너리 스트림을 헤더로 표기 )
//		    response.setHeader("Content-Disposition","attachment;filename=" + saveFileName);
//		    response.setHeader("Content-Transfer-Encoding", "binary");
//		    response.setContentType("utf-8");
//		    response.setContentType("application/octet-stream;charset=UTF-8");
//		    
//			int e = -1;
//			
//			while((e = input.read()) > -1)
//			{
//				out.write((byte)e);
//			}
//
//			input.close();
//			
//		    response.flushBuffer();
//		    
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		
//		return null;
//	}
//	
//
//	@Autowired
//    @Qualifier("CommonFileDao")
//    private CommonFileDao commonFileDao;
//
//    /** 기준 파일 경로 */
//	@Value("${sfd2022.file.upload.path:}")
//    private String filePath;
//
//    /** 저장 파일 확장자 */
//	@Value("${sfd2022.file.upload.postfix:}")
//    private String filePostFix;
//    
//    /** 임시 폴더 톰켓 종료 시 삭제 됨 */
//	@Value("${sfd2022.file.upload.temp:}")
//    private String tempDir;
//
//	@Autowired
//	private FtpClientConnectorFactory ftpClientConnectorFactory;
//
//    /** 파일 분리자 */
//    private String fileSeperate = System.getProperty("file.separator");
	

	/**
     * 경로를 사용하여 파일 리스트로 반환
     * 
     * @param baseDir
     * @param downloadFileName
     * @return
     */
    private File[] downloadFile(final String baseDir, final String downloadFileName) {

		// - 다운로드 전체 파일 또는 단일 파일을 선택하여 반환한다.
		File downloadFile = new File(this.filePath + fileSeperate + baseDir
			+ ((Objects.isNull(downloadFileName)) ? "" : fileSeperate + downloadFileName));
	
		// 전체 폴더일 경우 전체 폴더를 배열로 반환
		return downloadFile.isDirectory() ? downloadFile.listFiles() : new File[] { downloadFile };
    }

    /**
     * 새로운 파일 그룹을 생성하여 조회하여 반환하는 함수
     * 
     * @return
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> newFileGroup(final JSONObject obj) {
	
		String sLOCK_PSWD = (String) obj.getOrDefault("LOCK_PSWD", "");
		String sWORK_CD   = (String) obj.getOrDefault("WORK_CD", "");
        String sCOMP_ID   = (String) obj.getOrDefault("COMP_ID", "");
        
		Map<String, Object> searchData = new HashMap<String, Object>();
		
		searchData.put("COMP_ID", sCOMP_ID);
		searchData.put("WORK_CD", sWORK_CD);
		
		Map<String, Object> hmNewFileGroup = (Map) commonFileDao.searchNewFileGroup(searchData);
		
		// 패스워드를 등록한 다음 임시로 저장 한다.
		hmNewFileGroup.put("LOCK_PSWD", sLOCK_PSWD);
		hmNewFileGroup.put("LOCK_YSNO", sLOCK_PSWD.equals("") ? "0" : "1");
		hmNewFileGroup.put("WORK_CD", sWORK_CD);
		
		// 채번 테이블로 선 등록 처리
		commonFileDao.insertNewFileGroup(hmNewFileGroup);
		
		return hmNewFileGroup;
    }

    /**
     * 기존에 존재 하는 파일 그룹을 조회 하는 함수
     * 
     * @param FileGroup
     * @return
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getFileGroup(final JSONObject obj) {
		
		String sFILE_ID = (String) obj.get("FILE_ID");
		
		Map<String, Object> searchData = new HashMap<String, Object>();
		
		searchData.put("FILE_ID", sFILE_ID);
		
		return (Map<String, Object>) commonFileDao.searchFileGroup(searchData);
    }

    /**
     * 신규 생성 하는 함수
     * 
     * @param mFile
     * @param path
     * @return
     */
    @SuppressWarnings("unchecked")
    private boolean createNewFile(final MultipartFile mFile, final String baseDir, final String newFileName) {
    	
    	try {
    		
			ftpClientConnectorFactory.getObject().write(baseDir + "/" + newFileName, mFile.getInputStream());
			
			return true;
		} catch (Exception e) {
			
			return false;
		}
    }
    
    /**
     * 파일을 삭제 하는 함수
     * 
     * @param mFile
     * @param path
     * @return
     */
    @SuppressWarnings("unchecked")
    private boolean deleteFile(final String baseDir, final String deleteFileName) {

    	try {
    		
			ftpClientConnectorFactory.getObject().rm(baseDir + "/" + deleteFileName);
			
	    	return true;
		} catch (Exception e) {
			
			return false;
		}
    }

    /**
     * 단일 파일을 업로드 하는 함수
     * 
     * @param request
     * @return
     * @throws ParseException
     */
    @Override
    public Object commonFileUploadSingle(MultipartHttpServletRequest request) throws ParseException {
    	
		Map<String, Object> returnValue = new HashMap<>();
		// 반환값 처리를 위해서 반환 데이터셋 생성
		DataSet dsout = new DataSet("dsOutput");
	
		dsout.addColumn("FILE_ID", DataTypes.STRING);
		dsout.addColumn("FILE_SEQ", DataTypes.STRING);
		dsout.addColumn("FILE_NAME", DataTypes.STRING);
		dsout.addColumn("ERROR_CODE", DataTypes.STRING);
		dsout.addColumn("ERROR_MSG", DataTypes.STRING);
		
		String data = (String) request.getParameter("data");
		JSONObject obj = (JSONObject) new JSONParser().parse(data);
		
		String sFILE_ID = (String) obj.get("FILE_ID");
		
		Map<String, Object> param = new HashMap<>();
		
		// - 신규 업로드 가 아닐 경우 기존 데이터 삭제 후 입력
		if (!sFILE_ID.equals("")) 
		{
		    param.put("FILE_ID", sFILE_ID);
		    
		    this.commonFileDelete(param);
		}
		
		// - 결과값을 사용하여 파일 업로드 컬럼 정보 생성
		Map<String, Object> resultMap = (Map) this.commonFileUpload(request);
	
		DataSet dsResult = (DataSet) resultMap.get("dsOutput");
		
		param.put("WORK_USID", "FILE");
		param.put("WORK_IP", "127.0.0.1");
		param.put("WORK_COMP", "FILE");
		param.put("FILE_ID", dsResult.getString(0, "FILE_ID"));
		param.put("FILE_SEQ", "1");
	
		// - 파일 리스트를 기반으로 파일 정보 전체 조회하여 매핑룰 생성
		Map<String, Object> hmFileOne = (Map) commonFileDao.searchFileOne(param);
	
		int nRow = dsout.newRow();
	
		dsout.set(nRow, "FILE_ID", hmFileOne.get("FILE_ID"));
		dsout.set(nRow, "FILE_SEQ", hmFileOne.get("FILE_SEQ"));
		dsout.set(nRow, "FILE_NAME", hmFileOne.get("FILE_NAME"));
		dsout.set(nRow, "ERROR_CODE", dsResult.getString(0, "ERROR_CODE"));
		dsout.set(nRow, "ERROR_MSG", dsResult.getString(0, "ERROR_MSG"));
	
		// - 반환 데이터셋을 등록 한 다음 화면으로 리턴
		returnValue.put("dsout", dsout);
	
		return returnValue;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Object commonFileUpload(MultipartHttpServletRequest request) throws ParseException {
	
		// 반환값 처리를 위해서 반환 데이터셋 생성
		DataSet dataset = new DataSet("dsOutput");
	
		dataset.addColumn("FILE_ID" , DataTypes.STRING);
		dataset.addColumn("ERROR_CODE", DataTypes.STRING);
		dataset.addColumn("ERROR_MSG" , DataTypes.STRING);
	
		int nRow = dataset.newRow();
	
		dataset.set(nRow, "ERROR_CODE", "1");
		dataset.set(nRow, "ERROR_MSG", "");
	
		//- 파라미터(data)를 불러 온다.
		String data = (String) request.getParameter("data");
		
		//- 데이터를 JSON 객체로 파싱하여 객체화 한다.
		JSONObject obj = (JSONObject) new JSONParser().parse(data);
		
		//- 파라미터를 추출한다.
		String pFILE_ID   = (String) obj.get("FILE_ID");
		
		obj.put("WORK_USID", "FILE");
		obj.put("WORK_IP"  , "127.0.0.1");
		obj.put("WORK_COMP", "FILE");
		
		// 세션에 있는 정보를 등록
		HttpSession session = request.getSession();
		
		Enumeration<String> enumerationSession = session.getAttributeNames();
		
		String elementId;
		while(enumerationSession.hasMoreElements())
		{
			elementId = enumerationSession.nextElement();
			
			if("SPRING_SECURITY_CONTEXT".equals(elementId)) {
				continue;
			}
			System.out.println(elementId+" >> "+session.getAttribute(elementId));
			obj.put(elementId, session.getAttribute(elementId));
		}
		
		// [FILE ID] 가 없을 경우 생성하여 등록 
		Map<String, Object> mFILEXM = (pFILE_ID.trim().length() == 0) ? newFileGroup(obj) : getFileGroup(obj);
		
		try {
		    // 기준 경로를 빌드 하여 고유 경로로 처리한다.
		    String sFILE_PATH = (String) mFILEXM.get("FILE_PATH");
		    String sFILE_ID   = (String) mFILEXM.get("FILE_ID");
	
		    log.debug("===============================");
		    log.debug("FILE_PATH :: " + sFILE_PATH);
		    log.debug("===============================");
	
		    // - 새로운 파일 코드를 생성
		    Map<String, Object> newFileInfo = null;
	
		    for (MultipartFile file : request.getFileMap().values()) {
				
		    	//- 심규 파일 순번을 조회
				newFileInfo = (Map<String, Object>) commonFileDao.searchNewFile(mFILEXM);
				
				//- 초기값 및 할당값을 등록
				int iDOWN_COUNT     = 0;
				int sFILE_SEQ     = Integer.parseInt(String.valueOf(newFileInfo.get("FILE_SEQ")));

				Long sFILE_SIZE    = file.getSize();
				String sFILE_NAME  = file.getOriginalFilename();
				String[] aSplitNM  = sFILE_NAME.split("\\.");
				String sFILE_EXT   = aSplitNM[aSplitNM.length - 1];
				String sSAVE_NAME  = UUID.randomUUID().toString() + this.filePostFix;
				Boolean sIMG_YSNO  = isImage(sFILE_EXT);
				
				try {
					
					// 이미지일 경우 이미지의 사이즈와 여부를 등록
					if (sIMG_YSNO) {
					    BufferedImage image = ImageIO.read(file.getInputStream());
			
					    newFileInfo.put("IMG_YSNO", "1");
			
					    if (Objects.isNull(image)) {
							newFileInfo.put("IMG_WSIZE", "0");
							newFileInfo.put("IMG_HSIZE", "0");
					    } else {
							newFileInfo.put("IMG_WSIZE", image.getWidth());
							newFileInfo.put("IMG_HSIZE", image.getHeight());
					    }
					} else {
					    newFileInfo.put("IMG_YSNO", "0");
					    newFileInfo.put("IMG_WSIZE", "0");
					    newFileInfo.put("IMG_HSIZE", "0");
					}
				}catch(Exception e) {
					
					// 이미지로 등록하지 않음
					sIMG_YSNO = false;
				}
				
				log.debug("===============================");
				log.debug("FILE_SEQ : {}", sFILE_SEQ);
				log.debug("FILE_SIZE : {}", sFILE_SIZE);
				log.debug("FILE_EXT : {}", sFILE_EXT);
				log.debug("ORGIN FILE NAME : {}", sFILE_NAME);
				log.debug("SAVED FILE NAME : {}", sSAVE_NAME);
				log.debug("FILE_PATH : {}", sFILE_PATH);
				log.debug("===============================");
		
				newFileInfo.put("FILE_ID", sFILE_ID);
				newFileInfo.put("SAVE_NAME", sSAVE_NAME);
				newFileInfo.put("FILE_NAME", sFILE_NAME);
				newFileInfo.put("FILE_SIZE", sFILE_SIZE);
				newFileInfo.put("FILE_EXT", sFILE_EXT);
				newFileInfo.put("DOWN_COUNT", iDOWN_COUNT);
				newFileInfo.put("IMG_YSNO", sIMG_YSNO);
				
				// 물리적으로 파일 업로드
				if (createNewFile(file, sFILE_PATH, sSAVE_NAME)) {
				    // 물리 데이터가 등록이 되었다면 논리적 데이터 베이스에 파일 정보 등록
				    commonFileDao.insertNewFile(newFileInfo);
				}
		    }
		    
		    // 반환값 처리를 위하여 값 세팅
		    dataset.set(nRow, 0, sFILE_ID);
		} catch (Exception e) {
	
		    // - 파일 업로드 실패 시 잔류 파일 삭제
		    commonFileDao.deleteFileGroup(mFILEXM);
	
		    dataset.set(nRow, "ERROR_CODE", "-1");
		    dataset.set(nRow, "ERROR_MSG", e.getMessage());
		}
	
		Map<String, Object> returnValue = new HashMap<>();
	
		returnValue.put("dsOutput", dataset);
	
		return returnValue;
    }
    
    @Override
    @SuppressWarnings("unchecked")
    public Object commonFileDownload(HttpServletRequest request, HttpServletResponse response) {
    	
		// // 반환값 처리를 위해서 반환 데이터셋 생성
		File tempFile      = null;
		OutputStream out   = null;
	
		try {
			
		    out = response.getOutputStream();
		    
		    String sFILE_ID = request.getParameter("FILE_ID");
		    String sFILE_SEQ = request.getParameter("FILE_SEQ");
		    String sFILE_NAME = request.getParameter("FILE_NAME");
	
		    if (Objects.isNull(sFILE_ID)) 
		    {
		    	sFILE_ID = (String) request.getAttribute("FILE_ID");
		    }
		    
		    if (Objects.isNull(sFILE_SEQ)) 
		    {
		    	sFILE_SEQ = (String) request.getAttribute("FILE_SEQ");
		    }
		    
		    if (Objects.isNull(sFILE_NAME)) 
		    {
		    	sFILE_NAME = (String) request.getAttribute("FILE_NAME");
		    }
	
		    log.debug("=====================================================");
		    log.debug("FILE_ID : {}", sFILE_ID);
		    log.debug("FILE_SEQ : {}", sFILE_SEQ);
		    log.debug("=====================================================");
	
		    Map<String, Object> param = new HashMap<>();
	
		    param.put("FILE_ID", sFILE_ID);
		    param.put("FILE_SEQ", sFILE_SEQ);
	
		    Map<String, Object> fileGroupInfo = (Map) commonFileDao.searchFileGroup(param);

			String sFILE_PATH = (String) fileGroupInfo.get("FILE_PATH");
		    
		    // - 등록된 그룹 정보가 없을 경우 null 반환
		    if (Objects.isNull(fileGroupInfo)) 
		    {
		    	throw new CustomException("-1", "파일을 읽는 중 오류가 발생하였습니다.");
		    }
		    
		    Map<String, Object> hmFileOne = (Map) commonFileDao.searchFileOne(param);

		    String saveFileName  = (String) hmFileOne.get("FILE_NAME");
		    String saveFileExt   = (String) hmFileOne.get("FILE_EXT");
		    String saveImageYsno = (String) hmFileOne.get("IMG_YSNO");
		    
		    log.debug("==================================");
		    log.debug("Service Single File Name : {}", saveFileName);
		    log.debug("Service File Extension : {}", saveFileExt.toLowerCase());
		    log.debug("Service is Image : {}", saveImageYsno);
		    log.debug("==================================");
		    
		    // - 전송전 처리 ( 바이너리 스트림을 헤더로 표기 )
		    response.setHeader("Content-Disposition","attachment;filename=\"" + URLEncoder.encode(saveFileName, "UTF-8") + "\"");
		    response.setHeader("Content-Transfer-Encoding", "binary");
		    
		    if("1".equals(saveImageYsno))
		    {
		    	switch(saveFileExt.toLowerCase()){
		    	
		    	case "jpg"  : /* jpg와 jpeg는 같은 포맷으로 반환 */
		    	case "jpeg" : 
		    		response.setContentType(MediaType.IMAGE_JPEG_VALUE+";charset=UTF-8");
		    		break;
		    	case "png"  : 
		    		response.setContentType(MediaType.IMAGE_PNG_VALUE+";charset=UTF-8");
		    		break;
		    	case "gif"  : 
		    		response.setContentType(MediaType.IMAGE_GIF_VALUE+";charset=UTF-8");
		    		break;
		    	default     :
			    	response.setContentType(MediaType.APPLICATION_OCTET_STREAM+";charset=UTF-8");
			    	break;
		    	}
		    	
		    }
		    else
		    {
		    	response.setContentType(MediaType.APPLICATION_OCTET_STREAM+";charset=UTF-8");
		    }
		    
		    
		    ftpClientConnectorFactory.getObject().read(sFILE_PATH+"/"+(String) hmFileOne.get("SAVE_NAME"), out);
	
		    // - 다운로드 횟수 증가
		    commonFileDao.updateDownloadFileCount(param);
		} catch (Exception e) {
		    e.printStackTrace();
		} finally {
	
		    if (!Objects.isNull(out)) {
				try {
				    out.close();
				} catch (IOException e) {
				    e.printStackTrace();
				}
		    }
	
		    if (!Objects.isNull(tempFile)) {
		    	tempFile.delete();
		    }
		}
		
		return null;
    }

    @Override
    public Object commonFileList(HttpServletRequest request, Map<String, Object> param) {
    	log.info("------ User Info : {}" + param);
		
		Map<String, Object> returnMap = new HashMap<String, Object>();
	
		returnMap.put("dsFileList", commonFileDao.searchFileList(param));
	
		return returnMap;
    }

    @Override
    public Object commonFileOne(Map<String, Object> param) {
	
		Map<String, Object> returnMap = new HashMap<String, Object>();
	
		DataSet dsFileOne = new DataSet("dsFileOne");
	
		// - 파일 정보를 조회한다.
		Map<String, Object> hsFileInfo = (Map) commonFileDao.searchFileOne(param);
	
		Iterator<String> keysets = hsFileInfo.keySet().iterator();
	
		// - 데이터 헤더를 생성한다.
		while (keysets.hasNext()) {
		    dsFileOne.addColumn(keysets.next(), DataTypes.STRING);
		}
	
		// - 데이터를 매핑한다.
		int nRow = dsFileOne.newRow();
	
		for (int c = 0; c < dsFileOne.getColumnCount(); c++) {
		    String colID = dsFileOne.getColumn(c).getName();
	
		    dsFileOne.set(nRow, colID, hsFileInfo.get(colID));
		}
	
		returnMap.put("dsFileOne", dsFileOne);
	
		return returnMap;
    }

    @Override
    public Object commonFileDelete(Map<String, Object> param) {
	
		// - 반환값 처리를 위해서 반환 데이터셋 생성
		DataSet dataset = new DataSet("dsOutput");
	
		dataset.addColumn("FILE_ID"  , DataTypes.STRING);
		dataset.addColumn("ERROR_CODE" , DataTypes.STRING);
		dataset.addColumn("ERROR_MSG"  , DataTypes.STRING);
	
		int nRow = dataset.newRow();
	
		dataset.set(nRow, "ERROR_CODE", "1");
		dataset.set(nRow, "ERROR_MSG", "");
	
		try {
	
		    String sFILE_PATH = null;
		    String sFILE_NAME = null;
		    String sSAVE_NAME = null;
	
		    if (Objects.isNull(param.get("FILE_SEQ"))) {
				Map<String, Object> hsGroupInfo = (Map) commonFileDao.searchFileGroup(param);
		
				sFILE_PATH = (String) hsGroupInfo.get("FILE_PATH");
		
				// 물리적 파일 또는 폴더 제거
				if (deleteFile(sFILE_PATH, sFILE_NAME)) {
					
				    // 논리적 파일 또는 폴더 제거
				    commonFileDao.deleteFileGroup(param);
				}
		    } else {
	
				Map<String, Object> hsFileInfo = (Map) commonFileDao.searchFileOne(param);
		
				sSAVE_NAME = (String) hsFileInfo.get("SAVE_NAME");
				sFILE_PATH = (String) hsFileInfo.get("FILE_PATH");
		
				// 물리적 파일 또는 폴더 제거
				if (deleteFile(sFILE_PATH, sSAVE_NAME)) {
		
				    // 논리적 파일 또는 폴더 제거
				    commonFileDao.deleteFile(param);
				}
		    }
	
		} catch (Exception e) {
			
		    dataset.set(nRow, "ERROR_CODE", "-1");
		    dataset.set(nRow, "ERROR_MSG", e.getMessage());
		}
	
		Map<String, Object> returnValue = new HashMap<>();
	
		returnValue.put("dsOutput", dataset);
	
		return returnValue;
    }

    @Override
    public Object commonFileUpdate(Map<String, Object> param) {
	
		// 반환값 처리를 위해서 반환 데이터셋 생성
		DataSet dataset = new DataSet("dsOutput");
	
		dataset.addColumn("ERROR_CODE", DataTypes.STRING);
		dataset.addColumn("ERROR_MSG", DataTypes.STRING);
	
		int nRow = dataset.newRow();
	
		dataset.set(nRow, "ERROR_CODE", "1");
		dataset.set(nRow, "ERROR_MSG", "");
	
		Map<String, Object> returnValue = new HashMap<>();
	
		returnValue.put("dsOutput", dataset);
	
		try {
	
		    String encryptedPassword;
	
		    String newPassword = (String) param.get("_new");
		    String oldPassword = (String) param.get("_old");
		    String resetType   = (String) param.get("_reset");
	
		    Map<String, Object> hmNewFileGroup;
	
		    // 서버상에 저장 된 자료와 비교
		    Map<String, Object> hmFileGroup = (Map) commonFileDao.searchFileGroup(param);
	
		    String fileGr = (String) hmFileGroup.get("FILE_ID");
		    String lockYn = (String) hmFileGroup.get("LOCK_YSNO");
		    String lockPw = (String) hmFileGroup.get("LOCK_PSWD");
	
		    // 이미 잠금이 지정 된 경우 기존 비밀번호와 신규 비밀번호를 확인하여 처리
		    if (lockYn.equals("1")) {
	
				if (!encryptPasswordSha256_single_pass(oldPassword).equals(lockPw)) {
		
				    dataset.set(0, "ERROR_CODE", "-1");
				    dataset.set(0, "ERROR_MSG", "Please check your password");
		
				    return returnValue;
				}
	
		    }
	
		    // 그 외의 경우는 비밀번호 변경
		    encryptedPassword = encryptPasswordSha256_single_pass(newPassword);
	
		    hmNewFileGroup = new HashMap<>();
	
		    if (resetType.equals("1")) {
	
				hmNewFileGroup.put("FILE_ID", fileGr);
				hmNewFileGroup.put("LOCK_PSWD", "");
				hmNewFileGroup.put("LOCK_YSNO", "0");
		    } else {
	
				hmNewFileGroup.put("FILE_ID", fileGr);
				hmNewFileGroup.put("LOCK_PSWD", encryptedPassword);
				hmNewFileGroup.put("LOCK_YSNO", "1");
		    }
		    
		    commonFileDao.updateFileGroup(hmNewFileGroup);
	
		} catch (Exception e) {
		    dataset.set(0, "ERROR_CODE", "-1");
		    dataset.set(0, "ERROR_MSG", e.getMessage());
		}
	
		return returnValue;
    }
    
    

    @Override
	public Object commonLoginImageList() {
    		
		return commonFileDao.commonLoginImageList();
	}

	/**
     * 암호화 할 경우 압축 시 비밀번호 복호화를 할수 없기 때문에 개인 복호화 가능한 암호적용 이전까지는 암호화 한시적 보류
     * 
     * @param pass
     * @return
     */
    private String encryptPasswordSha256_single_pass(String pass) {
	
		return pass;
		/*
		 * try { MessageDigest md = MessageDigest.getInstance("SHA-256");
		 * 
		 * md.update(pass.getBytes());
		 * 
		 * String hex = String.format("%064x", new BigInteger(1, md.digest())); return
		 * hex; } catch (NoSuchAlgorithmException e) { e.printStackTrace(); return pass;
		 * }
		 */
    }

    private boolean isImage(String fileType) {
		return fileType.equals("jpg") || fileType.equals("jpeg") || fileType.equals("bmp") || fileType.equals("gif")
			|| fileType.equals("png") || fileType.equals("tiff");
    }
    

	@Autowired
    @Qualifier("CommonFileDao")
    private CommonFileDao commonFileDao;

    /** 기준 파일 경로 */
	@Value("${app.file.upload.path:}")
    private String filePath;

    /** 저장 파일 확장자 */
	@Value("${app.file.upload.postfix:}")
    private String filePostFix;
    
    /** 임시 폴더 톰켓 종료 시 삭제 됨 */
	@Value("${app.file.upload.temp:}")
    private String tempDir;

    /** 파일 분리자 */
    private String fileSeperate = System.getProperty("file.separator");
    
	@Autowired
	private FtpClientConnectorFactory ftpClientConnectorFactory;
}
