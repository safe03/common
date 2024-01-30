package com.safecnc.comm.adm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.adm.service.ADM0010Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service("ADM0010Service")
public class ADM0010ServiceImpl implements ADM0010Service{

	@Resource(name = "ADM0010Dao")
	private ADM0010Dao dao;
	
	/** 비밀번호 암호화 처리를 위한 비밀번호 함호화 객체 */
	@Autowired
	private PasswordEncoder passwordEncoder;
			
	@Override
	public Object SEARCH00(Map<String, Object> searchRow) {
		return dao.SEARCH00(searchRow);
	}

	@Override
	public Object SEARCH01(Map<String, Object> searchRow) {
		return dao.SEARCH01(searchRow);
	}

	@Override
	public Object SEARCH02(Map<String, Object> searchRow) {
		return dao.SEARCH02(searchRow);
	}
	
	@Override
	public Object SEARCH03(Map<String, Object> searchRow) {
		return dao.SEARCH03(searchRow);
	}
	
	@Override
	public Object SEARCH04(Map<String, Object> searchRow, String GUBN) {
		
		return dao.SEARCH04(searchRow, GUBN);
	}
	
	
	@Override
	public int SAV00(NexacroRequest request, String dsGUBN) {
		Map rowVo    = null;
        int iTotCnt = 0;
        int rowType  = 0;
        
        
        List ds_DELETE = request.getDeletedDataset(dsGUBN); 
        List ds = request.getSaveDataset(dsGUBN);
        
        for (int i = 0; i < ds_DELETE.size(); i++) {
    		rowVo = (Map) ds_DELETE.get(i);
            dao.DEL00(rowVo);
            iTotCnt++;
        }
        for (int i = 0; i < ds.size(); i++) {
    	   
           rowVo   = (Map) ds.get(i);
           rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
           
    	   /* 비밀번호 암호화 */
    	   String sPASSWORD = (String) rowVo.get("PASSWORD");
    	   if(sPASSWORD != null && sPASSWORD.length() != 0)
    	   {
    		   rowVo.put("sPASSWORD", this.passwordEncoder.encode(sPASSWORD));
    	   }
    	   
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
