package com.safecnc.system.AAAA.AAAA0110.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : </h1>
<p>다국어코드관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-06-22  이진혁            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AAAA0110Dao")
public class AAAA0110Dao extends AbstractMapper {

	/**
	 * 다국어코드관리 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return session.selectList("AAAA0110.SEL00", searchRow);
	}
	
	/**
	 * 다국어 코드 저장
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0110.INS00", saveRow);
	}
	
	/**
	 * 다국어 코드 삭제
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0110.DEL00", saveRow);
	}

}
