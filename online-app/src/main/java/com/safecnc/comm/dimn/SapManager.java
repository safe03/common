package com.safecnc.comm.dimn;

import java.util.List;
import java.util.Map;

import com.safecnc.comm.dimn.SapJcoManager.SapJcoRfcMetaFunction;

/**
 * RFC접속과 관련 된 고유 지원 자원 제공 인터페이스</br>
 * 
 * @since 2022-05-16
 * @author jhlee
 * 
 * @see ResultSapJcoManager
 */
public interface SapManager<T, R> {
	
	/** 함수 실행을 지원하는 메소드 */
	public R call(String ifName);
	public R call(String ifName, T iParams);
	
	/**
	 * 연결 가능 여부를 확인하는 메소드
	 * 
	 * @return 연결 가능 여부
	 */
	public boolean ping();
	
	/**
	 * 호출 가능한 함수 정보를 모의 추출
	 * 
	 * @param ifName 함수명
	 * @return 모의 추출 결과값
	 */
	public ResultSapJcoManager parse(String ifName);
	
	/**
	 * 함수 실행 결과를 반환하는 메소드
	 * 
	 * @return 반환된 결과값
	 */
	public ResultSapJcoManager getResult();
	
	/**
	 * RFC결과와 관련 된 자원 제공 인터페이스</br>
	 * 
	 * @since 2022-05-16
	 * @author jhlee
	 */
	public interface ResultSapJcoManager {
		
		/* 읽기 전용 함수 */
		public Long getRfcManageID();
		
		/* 읽기 전용 함수 */
		public int getRfcCallCount();
		
		/* 읽기 전용 함수 */
		public List<String> getRfcCallNames();
		
		/* 읽기 전용 함수 */
		public List<Integer> getRfcCallTimes();
		
		/* 읽기 전용 함수 */
		public List<Map<String, Object>> getRfcCallResult();

		/* 읽기 전용 함수 */
		public Map<String, SapJcoRfcMetaFunction> getImportMetaParameters();

		/* 읽기 전용 함수 */
		public Map<String, SapJcoRfcMetaFunction> getExportMetaParameters();

		/* 읽기 전용 함수 */
		public Map<String, Map<String, SapJcoRfcMetaFunction>> getMetaTable();
		
		/* 읽기 전용 함수 */
		public Map<String, Object> getResult();
		
		/* 읽기 전용 함수 */
		public Map<String, Object> getResult(int rfcCallIndex);
	}
}
