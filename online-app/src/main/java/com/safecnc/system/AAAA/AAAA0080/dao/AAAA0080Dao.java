package com.safecnc.system.AAAA.AAAA0080.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 다국어관리</h1>
<p>다국어관리</p>
<h2>DESC : 다국어관리</h2>
<p>다국어관리 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-20  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AAAA0080Dao")
public class AAAA0080Dao extends AbstractMapper {

	/**
	 * 다국어관리 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0080.SEL00", searchRow);
	}
	
	/**
	 * 다국어관리 저장
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0080.INS00", saveRow);
	}

	/**
	 * 다국어관리 수정
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AAAA0080.UPD00", saveRow);
	}

	/**
	 * 다국어관리 삭제
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("AAAA0080.DEL00", saveRow);
	}
}
