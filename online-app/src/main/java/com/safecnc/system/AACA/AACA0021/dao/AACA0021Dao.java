package com.safecnc.system.AACA.AACA0021.dao;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 사용자관리</h1>
<p>메뉴구조관리</p>
<h2>DESC : 사용자관리</h2>
<p>사용자관리 데이터 엑세스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2023-01-19   shlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("AACA0021Dao")
public class AACA0021Dao extends AbstractMapper {

	/**
	 * 사용자를 삭제하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int DEL00(Map<String,Object> saveRow) {
		log.debug("========= SqlSessionTemplate_v2 : AACA0021.DEL00");
		return session.delete("AACA0021.DEL00", saveRow);
	}
	
	/**
	 * 사용자를 입력하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int INS00(Map<String,Object> saveRow) {
		log.debug("========= SqlSessionTemplate_v2 : AACA0021.INS00");
		return session.insert("AACA0021.INS00", saveRow);
	}

	/**
	 * 사용자를 수정하는 함수
	 * @param saveRow 저장데이터셋 파라미터
	 * @return
	 */
	public int UPD00(Map<String,Object> saveRow) {
		log.debug("========= SqlSessionTemplate_v2 : AACA0021.UPD00");
		return session.update("AACA0021.UPD00", saveRow);
	}

}
