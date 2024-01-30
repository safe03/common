package com.safecnc.system.AAAA.AAAA0020.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.request.NexacroRequest;
import com.safecnc.system.AAAA.AAAA0020.dao.AAAA0020Dao;
import com.safecnc.system.AAAA.AAAA0020.service.AAAA0020Service;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 세부코드관리</h1>
<p>세부코드관리</p>
<h2>DESC : 세부코드관리</h2>
<p>세부코드관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0020Service")
public class AAAA0020ServiceImpl extends AbstractServiceImpl implements AAAA0020Service{
	
	@Resource(name = "AAAA0020Dao")
	private AAAA0020Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	

	@Override
	public List<Map<String, Object>> SEARCH10(Map<String, Object> searchRow) {
		
		return dao.SEARCH10(searchRow);
	}


	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt = 0;
        int rowType  = 0;
        
        List dsTA_CODE_D_DELETE = request.getDeletedDataset("dsTA_CODE_D"); 
        List dsTA_CODE_D = request.getSaveDataset("dsTA_CODE_D");
        
        for (int i = 0; i < dsTA_CODE_D_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_CODE_D_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsTA_CODE_D.size(); i++) {
    	   
           rowVo   = (Map) dsTA_CODE_D.get(i);
           
           rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
           
           if (rowType == DataSet.ROW_TYPE_INSERTED) { 
        	   
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
