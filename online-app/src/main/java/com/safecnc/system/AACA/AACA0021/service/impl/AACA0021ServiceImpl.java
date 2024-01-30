package com.safecnc.system.AACA.AACA0021.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.request.NexacroRequest;
import com.safecnc.system.AACA.AACA0021.dao.AACA0021Dao;
import com.safecnc.system.AACA.AACA0021.service.AACA0021Service;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 사용자관리</h1>
<p>사용자관리</p>
<h2>DESC : 사용자관리</h2>
<p>사용자관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2023-01-19  shlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AACA0021Service")
public class AACA0021ServiceImpl extends AbstractServiceImpl implements AACA0021Service{
	
	@Resource(name = "AACA0021Dao")
	private AACA0021Dao dao;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;

        String sPassword = null;
        
        
        List dsTA_USER_M_DELETE = request.getDeletedDataset("dsTA_USER_M"); 
        List dsTA_USER_M = request.getSaveDataset("dsTA_USER_M");
        
        for (int i = 0; i < dsTA_USER_M_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_USER_M_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        
        if(dsTA_USER_M.size() > 0) sPassword = passwordEncoder.encode("safe7900");
        
        for (int i = 0; i < dsTA_USER_M.size(); i++) {
    	   
           rowVo   = (Map) dsTA_USER_M.get(i);
           
           rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
           
           if (rowType == DataSet.ROW_TYPE_INSERTED) { 

        	   //최초 비밀번호 지정
	       	   rowVo.put("PASS_WORD", sPassword);
        	   dao.INS00(rowVo); 
           } 
           else if(rowType == DataSet.ROW_TYPE_UPDATED) {
        	   
        	   dao.UPD00(rowVo); 
           }

           iTotCnt++;
       }
        
		return iTotCnt;
	}
}
