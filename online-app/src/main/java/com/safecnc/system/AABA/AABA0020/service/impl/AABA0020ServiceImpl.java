package com.safecnc.system.AABA.AABA0020.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AABA.AABA0020.service.AABA0020Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 메뉴구조관리</h1>
<p>메뉴구조관리</p>
<h2>DESC : 메뉴구조관리</h2>
<p>메뉴구조관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AABA0020Service")
public class AABA0020ServiceImpl extends AbstractServiceImpl implements AABA0020Service{
	
	@Resource(name = "AABA0020Dao")
	private AABA0020Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	
	@Override
	public List<Map<String,Object>> SEARCH10(Map<String,Object> searchRow) {
		
		return dao.SEARCH10(searchRow);
	}
	

	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt  = 0;
        int rowType  = 0;
        
        List dsVI_MENU_DELETE = request.getDeletedDataset("dsVI_MENU"); 
        List dsVI_MENU = request.getSaveDataset("dsVI_MENU");
        
        for (int i = 0; i < dsVI_MENU_DELETE.size(); i++) {
    		rowVo = (Map) dsVI_MENU_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < dsVI_MENU.size(); i++) {
    	   
           rowVo   = (Map) dsVI_MENU.get(i);
           
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
