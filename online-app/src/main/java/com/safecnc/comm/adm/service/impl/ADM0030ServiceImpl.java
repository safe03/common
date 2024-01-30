package com.safecnc.comm.adm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.adm.service.ADM0030Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

@Service("ADM0030Service")
public class ADM0030ServiceImpl implements ADM0030Service{

	@Resource(name = "ADM0030Dao")
	private ADM0030Dao dao;
	
	@Override
	public Object SEARCH00(Map<String, Object> searchRow) {
		return dao.SEARCH00(searchRow);
	}


	@Override
	public Object SEARCH01(Map<String, Object> searchRow, String Gubn) {
		
		return dao.SEARCH01(searchRow, Gubn);
	}

	@Override
	public int SAV00(NexacroRequest request) {
		Map rowVo    = null;
        int iTotCnt = 0;
        int rowType  = 0;
        
        List ds_DELETE = request.getDeletedDataset("dsSeason"); 
        List ds = request.getSaveDataset("dsSeason");
        
        for (int i = 0; i < ds_DELETE.size(); i++) {
    		rowVo = (Map) ds_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        
        for (int i = 0; i < ds.size(); i++) {
    	   
           rowVo   = (Map) ds.get(i);
           
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
