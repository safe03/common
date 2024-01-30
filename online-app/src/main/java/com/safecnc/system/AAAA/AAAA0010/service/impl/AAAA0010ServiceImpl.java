package com.safecnc.system.AAAA.AAAA0010.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.request.NexacroRequest;
import com.safecnc.system.AAAA.AAAA0010.dao.AAAA0010Dao;
import com.safecnc.system.AAAA.AAAA0010.service.AAAA0010Service;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : 공통코드관리</h1>
<p>공통코드관리</p>
<h2>DESC : 공통코드관리</h2>
<p>공통코드관리 서비스</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-01-24  jhlee            최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0010Service")
public class AAAA0010ServiceImpl extends AbstractServiceImpl implements AAAA0010Service{
	
	@Resource(name = "AAAA0010Dao")
	private AAAA0010Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		return dao.SEARCH00(searchRow);
	}
	
	@Override
	public List<Map<String, Object>> SEARCH10(Map<String, Object> searchRow) {
		
		return dao.SEARCH10(searchRow);
	}

	@Override
	public int SAV00(NexacroRequest request) {
		int TA_CODE_M_CNT = super.SAVE(request, "dsTA_CODE_M", (type,row)-> {
								if(type == "C") {dao.INS00(row);}
								else if(type == "U") {dao.UPD00(row);}
								else if(type == "D") {dao.DEL00(row);};
							});		
		int TA_CODE_D_CNT = super.SAVE(request, "dsTA_CODE_D", (type,row)-> {
			if(type == "C") {dao.INS10(row);}
			else if(type == "U") {dao.UPD10(row);}
			else if(type == "D") {dao.DEL10(row);};
		});
		
		return TA_CODE_M_CNT + TA_CODE_D_CNT;
	}
}
