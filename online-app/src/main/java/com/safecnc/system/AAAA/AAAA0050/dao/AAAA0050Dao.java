package com.safecnc.system.AAAA.AAAA0050.dao;

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
@Repository("AAAA0050Dao")
public class AAAA0050Dao extends AbstractMapper {

	/**
	 * 팝업 조회하는 함수
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0050.SEL00", searchRow);
	}
	
	/**
	 * 팝업 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0050.INS00", saveRow);
	}

	/**
	 * 팝업 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AAAA0050.UPD00", saveRow);
	}

	/**
	 * 팝업 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("AAAA0050.DEL00", saveRow);
	}
}
