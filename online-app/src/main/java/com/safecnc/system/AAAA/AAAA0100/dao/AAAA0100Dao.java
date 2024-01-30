package com.safecnc.system.AAAA.AAAA0100.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : </h1>
<p>다국어메시지관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-22  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AAAA0100Dao")
public class AAAA0100Dao extends AbstractMapper {

	/**
	 * 다국어메시지관리 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0100.SEL00", searchRow);
	}
	
	/**
	 * 다국어메시지관리 저장
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0100.INS00", saveRow);
	}
	
	/**
	 * 다국어메시지관리 삭제
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0100.DEL00", saveRow);
	}

}
