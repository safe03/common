package com.safecnc.comm.srvc.impl;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

/*******************************************************************
 * <h1>NAME :</h1>
 * <p>
 * 파일 업/다운로드
 * </p>
 * <h2>DESC :</h2>
 * <p>
 * 설명
 * </p>
 * <h3>REV.:</h3>
 * 
 * <pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
9999999999                   최초생성
 * </pre>
 ********************************************************************/

@Repository("CommonFileDao")
public class CommonFileDao extends AbstractMapper{

	/**
     * 신규 파일 그룹을 조회 하는 함수
     * 
     * @return
     */
    public Object searchNewFileGroup(Map<String, Object> searchData) {
    	return session.selectOne("COMFILE.SEARCH_NEW_FILE_GROUP", searchData);
    }

    /**
     * 신규 파일을 조회 하는 함수
     * 
     * @return
     */
    public Object searchNewFile(Map<String, Object> searchData) {
    	return session.selectOne("COMFILE.SEARCH_NEW_FILE", searchData);
    }

    /**
     * 파일 그룹을 등록 하는 함수
     * 
     * @return
     */
    public Object insertNewFileGroup(Map<String, Object> saveData) {
    	return session.insert("COMFILE.INSERT_NEW_FILE_GROUP", saveData);
    }

    /**
     * 파일 그룹을 등록 하는 함수
     * 
     * @return
     */
    public Object deleteFileGroup(Map<String, Object> deleteData) {
    	return session.insert("COMFILE.DELETE_FILE_GROUP", deleteData);
    }

    /**
     * 파일 그룹을 등록 하는 함수
     * 
     * @return
     */
    public Object updateDownloadFileCount(Map<String, Object> saveData) {
    	return session.update("COMFILE.UPDATE_DOWN_FILE_INC", saveData);
    }

    /**
     * 파일 그룹을 등록 하는 함수
     * 
     * @return
     */
    public Object deleteFile(Map<String, Object> deleteData) {
    	return session.insert("COMFILE.DELETE_FILE", deleteData);
    }

    /**
     * 파일 그룹을 등록 하는 함수
     * 
     * @return
     */
    public Object insertNewFile(Map<String, Object> saveData) {
    	return session.insert("COMFILE.INSERT_NEW_FILE", saveData);
    }

    /**
     * 파일 그룹을 조회 하는 함수
     * 
     * @return
     */
    public Object searchFileGroup(Map<String, Object> searchData) {
    	return session.selectOne("COMFILE.SEARCH_FILE_GROUP", searchData);
    }

    /**
     * 파일 그룹을 수정 하는 함수
     * 
     * @return
     */
    public Object updateFileGroup(Map<String, Object> saveData) {
    	return session.update("COMFILE.UPDATE_FILE_GROUP", saveData);
    }

    /**
     * 파일 그룹을 조회 하는 함수
     * 
     * @return
     */
    public Object searchFileList(Map<String, Object> searchData) {
    	return session.selectList("COMFILE.SEARCH_FILE_LIST", searchData);
    }

    /**
     * 파일 그룹을 조회 하는 함수
     * 
     * @return
     */
    public Object searchFileOne(Map<String, Object> searchData) {
    	return session.selectOne("COMFILE.SEARCH_FILE_ONE", searchData);
    }
    
    /**
     * 로그인 이미지 리스트
     * 
     * @return
     */
	public Object commonLoginImageList() {
    	return session.selectList("COMFILE.SEARCH_LOGIN_IMAGE_LIST");
	}
}
