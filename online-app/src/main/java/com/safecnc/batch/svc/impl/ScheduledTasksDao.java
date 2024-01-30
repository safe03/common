package com.safecnc.batch.svc.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.safecnc.comm.rtlm.AbstractMapper;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : ScheduledTasksDao</h1>
<p>배치</p>
<h2>DESC : 배치</h2>
<p배치</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-06-09  jhs            	 최초생성
</pre>
********************************************************************/
@Slf4j
@Repository("ScheduledTasksDao")
public class ScheduledTasksDao extends AbstractMapper {

	/**
	 * buyer 배치
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public int SAV00(Map<String,Object> saveData) {
		return session.insert("SCHEDULEDTASKS.SAV00", saveData);
	}
	
	/**
	 * supplier 배치
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public int SAV10(Map<String,Object> saveData) {
		return session.insert("SCHEDULEDTASKS.SAV10", saveData);
	}	
	
	/**
	 * user 배치
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public int SAV20(Map<String,Object> saveData) {
		return session.insert("SCHEDULEDTASKS.SAV20", saveData);
	}		
	
	/**
	 * EIS Order STS 배치
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public int SAV30(Map<String,Object> saveData) {
		return session.insert("SCHEDULEDTASKS.SAV30", saveData);
	}	
	
	/**
	 * tc_sapemp 조회하는 함수
	 * @param 
	 * @return
	 */
	public List<Map<String,Object>> SEARCH40() {
		
		return session.selectList("SCHEDULEDTASKS.SEL40");
	}
	
	/**
	 * ta_user_m 배치
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public int SAV40(Map<String,Object> saveData) {
		return session.insert("SCHEDULEDTASKS.SAV40", saveData);
	}
	
	/**
	 * 신규유저 아이디 및 이메일 조회
	 * @param saveData 데이터 파라미터
	 * @return
	 */
	public List<Map<String,Object>> NEW_USER_SEARCH(Map<String,Object> searchRow){
		return session.selectList("SCHEDULEDTASKS.NEW_USER_SEARCH",searchRow);
	}
}
