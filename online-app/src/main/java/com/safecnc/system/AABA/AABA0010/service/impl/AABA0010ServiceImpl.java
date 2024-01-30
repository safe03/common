package com.safecnc.system.AABA.AABA0010.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AABA.AABA0010.service.AABA0010Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 프로그램관리</h1>
<p>프로그램관리</p>
<h2>DESC : 프로그램관리</h2>
<p>프로그램관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AABA0010Service")
public class AABA0010ServiceImpl extends AbstractServiceImpl implements AABA0010Service{
	
	@Resource(name = "AABA0010Dao")
	private AABA0010Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	@Override
	public int SAV00(NexacroRequest request) {
		
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;
        
        List dsTA_PROG_M_DELETE = request.getDeletedDataset("dsTA_PROG_M"); 
        List dsTA_PROG_M = request.getSaveDataset("dsTA_PROG_M");
        
        for (int i = 0; i < dsTA_PROG_M_DELETE.size(); i++) {
    		rowVo = (Map) dsTA_PROG_M_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsTA_PROG_M.size(); i++) {
    	   
           rowVo   = (Map) dsTA_PROG_M.get(i);
           
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
