package com.safecnc.system.AAAA.AAAA0040.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AAAA.AAAA0040.dao.AAAA0040Dao;
import com.safecnc.system.AAAA.AAAA0040.service.AAAA0040Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 콤보관리</h1>
<p>콤보관리</p>
<h2>DESC : 콤보관리</h2>
<p>콤보관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0040Service")
public class AAAA0040ServiceImpl extends AbstractServiceImpl implements AAAA0040Service{
	
	@Resource(name = "AAAA0040Dao")
	private AAAA0040Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	
	@Override
	public List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow) {
		
		return dao.SEARCH10(searchRow);
	}
	

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;
        
        List dsTA_COMBO_DELETE = request.getDeletedDataset("dsTA_COMBO"); 
        List dsTA_COMBO = request.getSaveDataset("dsTA_COMBO");
        
        for (int i = 0; i < dsTA_COMBO_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_COMBO_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsTA_COMBO.size(); i++) {
    	   
           rowVo   = (Map) dsTA_COMBO.get(i);
           
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
