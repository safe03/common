package com.safecnc.system.AAAA.AAAA0100.service.impl;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AAAA.AAAA0100.dao.AAAA0100Dao;
import com.safecnc.system.AAAA.AAAA0100.service.AAAA0100Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : </h1>
<p>다국어메시지관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-22  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0100Service")
public class AAAA0100ServiceImpl extends AbstractServiceImpl implements AAAA0100Service{
	
	@Resource(name = "AAAA0100Dao")
	private AAAA0100Dao dao;

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

           dao.INS00(rowVo); 

           iTotCnt++;
       }
        
		return iTotCnt;
	}
}
