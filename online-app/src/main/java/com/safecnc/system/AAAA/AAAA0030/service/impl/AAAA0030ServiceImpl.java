package com.safecnc.system.AAAA.AAAA0030.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AAAA.AAAA0030.dao.AAAA0030Dao;
import com.safecnc.system.AAAA.AAAA0030.service.AAAA0030Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 메시지관리</h1>
<p>메시지관리</p>
<h2>DESC : 메시지관리</h2>
<p>메시지관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0030Service")
public class AAAA0030ServiceImpl extends AbstractServiceImpl implements AAAA0030Service{
	
	@Resource(name = "AAAA0030Dao")
	private AAAA0030Dao dao;
	
	@Override
	public List<Map<String, Object>> LANG_M_COMBO() {
		return dao.LANG_M_COMBO();
	}

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	

	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt = 0;
        int rowType  = 0;
        
        List dsTA_MESSAGE_DELETE = request.getDeletedDataset("dsTA_MESSAGE"); 
        List dsTA_MESSAGE = request.getSaveDataset("dsTA_MESSAGE");
        
        for (int i = 0; i < dsTA_MESSAGE_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_MESSAGE_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsTA_MESSAGE.size(); i++) {
    	   
           rowVo   = (Map) dsTA_MESSAGE.get(i);
           
           rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
           
           //임의 컬럼(ROW_TYPE)의 상태값이 I일 경우
           if (rowType == DataSet.ROW_TYPE_INSERTED || "I".equals(rowVo.get("ROW_TYPE"))) {         	   
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
