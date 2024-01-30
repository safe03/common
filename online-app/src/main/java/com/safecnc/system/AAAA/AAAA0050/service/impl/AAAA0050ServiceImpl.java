package com.safecnc.system.AAAA.AAAA0050.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AAAA.AAAA0050.dao.AAAA0050Dao;
import com.safecnc.system.AAAA.AAAA0050.service.AAAA0050Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 팝업관리</h1>
<p>팝업관리</p>
<h2>DESC : 팝업관리</h2>
<p>팝업관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0050Service")
public class AAAA0050ServiceImpl extends AbstractServiceImpl implements AAAA0050Service{
	
	@Resource(name = "AAAA0050Dao")
	private AAAA0050Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;
        
        List dsTA_POPUP_DELETE = request.getDeletedDataset("dsTA_POPUP"); 
        List dsTA_POPUP = request.getSaveDataset("dsTA_POPUP");
        
        for (int i = 0; i < dsTA_POPUP_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_POPUP_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsTA_POPUP.size(); i++) {
    	   
           rowVo   = (Map) dsTA_POPUP.get(i);
           
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
