package com.safecnc.system.AAAA.AAAA0090.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : </h1>
<p>다국어 Word 관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-21  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AAAA0090Dao")
public class AAAA0090Dao extends AbstractMapper {
	
	
	/**
	 * 다국어 Word 관리 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {		

		return session.selectList("AAAA0090.SEL00", searchRow);
		
	}
	
	/**
	 * 다국어 Word 코드 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow) {
		
		
		return session.selectList("AAAA0090.SEARCH10", searchRow);
	}
	
	/**
	 * 다국어 목록 조회
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> SEARCH20() {
		
		return session.selectList("AAAA0090.SEARCH20");		
	}
	
	/**
	 * 다국어 Word 관리 저장
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		
		return session.insert("AAAA0090.INS00", saveRow);
	}

	/**
	 * 다국어 Word 관리 수정
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		
		return session.update("AAAA0090.UPD00", saveRow);
	}

	/**
	 * 다국어 Word 관리 삭제
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		
		return session.delete("AAAA0090.DEL00", saveRow);
	}
	
	/**
	 * 다국어워드사전 신규,수정 전 데이터를 삭제한다.
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL10(Map<String,Object> saveRow) {
		
		return session.delete("AAAA0090.DEL10", saveRow);
	}
}
