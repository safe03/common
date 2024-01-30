package com.safecnc.system.AAAA.AAAA0080.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AAAA.AAAA0080.dao.AAAA0080Dao;
import com.safecnc.system.AAAA.AAAA0080.service.AAAA0080Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 다국어관리</h1>
<p>팝업관리</p>
<h2>DESC : 다국어관리</h2>
<p>다국어관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-20  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0080Service")
public class AAAA0080ServiceImpl extends AbstractServiceImpl implements AAAA0080Service{
	
	@Resource(name = "AAAA0080Dao")
	private AAAA0080Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;
        
        List dsGrid_DELETE = request.getDeletedDataset("dsGrid"); 
        List dsGrid = request.getSaveDataset("dsGrid");
        
        for (int i = 0; i < dsGrid_DELETE.size(); i++) {
    		rowVo = (Map) dsGrid_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsGrid.size(); i++) {
    	   
           rowVo   = (Map) dsGrid.get(i);
           
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
