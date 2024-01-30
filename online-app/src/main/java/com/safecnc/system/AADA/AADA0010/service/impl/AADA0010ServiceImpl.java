package com.safecnc.system.AADA.AADA0010.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.nexacro.java.xapi.data.DataSet;
import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.system.AADA.AADA0010.service.AADA0010Service;
import com.safecnc.request.NexacroRequest;
import com.safecnc.web.domain.DatasetDefinition;

import lombok.extern.slf4j.Slf4j;

/*******************************************************************
<h1>NAME : </h1>
<p>회사그룹권한관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-06-18  이진혁           최초생성
</pre>
********************************************************************/

@Slf4j
@Service("AADA0010Service")
public class AADA0010ServiceImpl extends AbstractServiceImpl implements AADA0010Service {
	
	@Resource(name="AADA0010Dao")
	public AADA0010Dao AADA0010Dao;
	
	@Override
	public Object SEL00(Map<String, Object> searchVo) {
		
		log.debug("SEL00 searchVo : {}", searchVo);
		
		return AADA0010Dao.SEL00(searchVo);
	}
	
	
	@Override
	public Object SEL10(Map<String, Object> searchVo) {
		
		log.debug("SEL10 searchVo : {}", searchVo);
		
		return AADA0010Dao.SEL10(searchVo);
	}
	
	@Override
	public Object SAV00(NexacroRequest nexacroRequest) {
		
		Map rowVo    = null;
		int iTotCnt  = 0;
		int rowType  = 0;
		
		// 권한 그룹을 저장 및 삭제
		List dsTM_ATGPXM_DELETE = nexacroRequest.getDeletedDataset("dsTM_ATGPXM"); 
		List dsTM_ATGPXM = nexacroRequest.getSaveDataset("dsTM_ATGPXM");
	    
		for (int i = 0; i < dsTM_ATGPXM_DELETE.size(); i++) {
			rowVo = (Map) dsTM_ATGPXM_DELETE.get(i);
			AADA0010Dao.DEL00(rowVo);
			iTotCnt++;
		}
		
		for (int i = 0; i < dsTM_ATGPXM.size(); i++) {
		
			rowVo   = (Map) dsTM_ATGPXM.get(i);
			
			rowType = (Integer) rowVo.get(DatasetDefinition.ROW_TYPE);
			
			if (rowType == DataSet.ROW_TYPE_INSERTED) { 
			
				AADA0010Dao.INS00(rowVo); 
			} 
			else if(rowType == DataSet.ROW_TYPE_UPDATED) {
			
				AADA0010Dao.UPD00(rowVo); 
			}
			
			iTotCnt++;
		}
		
		//- 부여 권한을 저장
		List dsTM_AUTHXM = nexacroRequest.getSaveDataset("dsTM_AUTHXM");
		
		for (int i = 0; i < dsTM_AUTHXM.size(); i++) {
		
			rowVo   = (Map) dsTM_AUTHXM.get(i);
				
			AADA0010Dao.SAV10(rowVo); 
			
			iTotCnt++;
		}
	    
		return iTotCnt;
	}
}