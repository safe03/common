package com.safecnc.system.AABA.AABA0010.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 팝업관리</h1>
<p>팝업관리</p>
<h2>DESC : 팝업관리</h2>
<p>팝업관리 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AABA0010Dao")
public class AABA0010Dao extends AbstractMapper {

	/**
	 * 팝업 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AABA0010.SEL00", searchRow);
	}
	
	/**
	 * 팝업 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AABA0010.INS00", saveRow);
	}

	/**
	 * 팝업 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AABA0010.UPD00", saveRow);
	}

	/**
	 * 팝업 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("AABA0010.DEL00", saveRow);
	}
}
