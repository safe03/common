package com.safecnc.batch.svc.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.safecnc.batch.svc.ScheduledTasksService;
import com.safecnc.comm.dimn.WebMailDestributer;
import com.safecnc.comm.rtlm.AbstractServiceImpl;

import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : ScheduledTasksServiceImpl</h1>
<p>배치</p>
<h2>DESC : 배치</h2>
<p>배치 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-05-30  jhs              최초생성
</pre>
********************************************************************/
@Slf4j
@Service("ScheduledTasksService")
public class ScheduledTasksServiceImpl extends AbstractServiceImpl implements ScheduledTasksService{
	@Resource(name = "ScheduledTasksDao")
	private ScheduledTasksDao dao;

	/** 비밀번호 암호화 처리를 위한 비밀번호 함호화 객체 */
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private WebMailDestributer webMailDestributer;
	
	@Override
	public void SAV00(List<Map<String, Object>> saveDatas) {
		for(Map<String, Object> saveData : saveDatas) {
			int result = dao.SAV00(saveData);
		}
	}

	@Override
	public void SAV10(List<Map<String, Object>> saveDatas) {
		for(Map<String, Object> saveData : saveDatas) {
			int result = dao.SAV10(saveData);
		}
	}	
	
	@Override
	public void SAV20(List<Map<String, Object>> saveDatas) {
		for(Map<String, Object> saveData : saveDatas) {
			int result = dao.SAV20(saveData);
		}
	}	
	
	@Override
	public void SAV30(List<Map<String, Object>> saveDatas) {
		for(Map<String, Object> saveData : saveDatas) {
			int result = dao.SAV30(saveData);
		}	
	}
	
	@Override
	public void SAV40() {
		
		List<Map<String,Object>> searchData = dao.SEARCH40();
		
		for(Map<String, Object> saveData : searchData) {
    	   String sPASSWORD = saveData.get("ZPWD").toString();
    	   if(sPASSWORD != null && sPASSWORD.length() != 0)
    	   {
    		   saveData.put("PASSWORD", this.passwordEncoder.encode(sPASSWORD));
    	   }
			
    	   int result = dao.SAV40(saveData);
		}

	}

	@Override
	public void NEW_USER_SEND_EMAIL() {
		// TODO Auto-generated method stub
		
	}
	
	/*
	@Override
	public void NEW_USER_SEND_EMAIL(){
		Map<String,Object> searchRow = new HashMap<String, Object>();
		String template_GB = "";
		String email = "";
		List<Map<String, Object>> user_list = new ArrayList<Map<String,Object>>();

		//신규유저(거래처,공급처)
		searchRow.put("USR_GU", "1");
		template_GB = "1";
		user_list = dao.NEW_USER_SEARCH(searchRow); 
		for(int i = 0; i < user_list.size(); i++) {
			email = user_list.get(i).get("EMAIL").toString();
			webMailDestributer.posting2(email, template_GB, user_list.get(i));
		}
		
		//거래처
		searchRow.put("USR_GU", "2");
		template_GB = "2";
		user_list = dao.NEW_USER_SEARCH(searchRow);  
		for(int i = 0; i < user_list.size(); i++) {
			email = user_list.get(i).get("EMAIL").toString();
			webMailDestributer.posting2(email, template_GB, user_list.get(i));
		}

		//공급처
		searchRow.put("USR_GU", "3");
		template_GB = "3";
		user_list = dao.NEW_USER_SEARCH(searchRow);  
		for(int i = 0; i < user_list.size(); i++) {
			email = user_list.get(i).get("EMAIL").toString();
			webMailDestributer.posting2(email, template_GB, user_list.get(i));
		}
		
		webMailDestributer.send();		
	}
	*/
}


