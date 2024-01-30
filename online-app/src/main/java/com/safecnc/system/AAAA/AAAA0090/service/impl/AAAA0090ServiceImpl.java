package com.safecnc.system.AAAA.AAAA0090.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.request.NexacroRequest;
import com.safecnc.system.AAAA.AAAA0090.dao.AAAA0090Dao;
import com.safecnc.system.AAAA.AAAA0090.service.AAAA0090Service;

import lombok.extern.slf4j.Slf4j;
/*******************************************************************
<h1>NAME : </h1>
<p>다국어 Word 관리</p>
<h2>DESC : </h2>
<p>설명</p>
<h3>REV.:</h3>
<pre>
Date        Worker           Description
----------  ---------------  ------------------------------------
2022-04-21  SHJ              최초생성
</pre>
********************************************************************/
@Slf4j
@Service("AAAA0090Service")
public class AAAA0090ServiceImpl extends AbstractServiceImpl implements AAAA0090Service{
	
	@Resource(name = "AAAA0090Dao")
	private AAAA0090Dao dao;

	@Override
	public List<Map<String,Object>> SEARCH00(Map<String,Object> searchRow) {
		
		this.setLangSqlString(searchRow);//다국어 sql문 추가
				
		return dao.SEARCH00(searchRow);
	}
	
	/**
	 * 다국어 추가 컬럼 적용 로직
	 * @param searchRow 데이터 파라미터
	 * @return
	 */
	private void setLangSqlString(Map<String, Object> searchRow) {
		
		//다국어 목록 조회
		List<Map<String,Object>> langCodeList = dao.SEARCH20();
		
		String langCodeInner = "";
		String langCodeOuter = "";
		String descriptionInner = "";
		String descriptionOuter = "";

		for (Map<String ,Object> lang : langCodeList ) {
			String lang_code = lang.get("LANG_CODE").toString();
			langCodeInner 	 += this.getCaseString("WORD_VALU" ,lang_code);
			langCodeOuter 	 += this.getMaxString("WORD_VALU" ,lang_code);
			descriptionInner += this.getCaseString("DESCRIPTION" ,lang_code);
			descriptionOuter += this.getMaxString("DESCRIPTION",lang_code);
		}

		searchRow.put("langCodeInner" ,langCodeInner);
		searchRow.put("langCodeOuter" ,langCodeOuter);
		searchRow.put("descriptionInner" ,descriptionInner);
		searchRow.put("descriptionOuter" ,descriptionOuter);
	}

	/**
	 * 다국어 추가 컬럼의 case 문을 가져오는 sql
	 * @param columnName 다국어 다국어 텍스트 및 설명 컬럼명
	 * @param LANG_CODE 다국어 코드
	 * @return
	 */
	private String getCaseString(String columnName ,String LANG_CODE) {
		String reColumn = "DESCRIPTION".equals(columnName) ? "DESCRIPTION" : "VAL";
		return "case LANG_CODE when '"
				+LANG_CODE
				+"' then A."
				+columnName
				+" End as "
				+LANG_CODE
				+"_"+reColumn+" ,";
	}

	/**
	 * 다국어 추가 컬럼의 그룹핑을 할 sql
	 * @param columnName 다국어 텍스트 및 설명 컬럼명
	 * @param LANG_CODE 다국어 코드
	 * @return
	 */
	private String getMaxString(String columnName ,String LANG_CODE) {
		if("DESCRIPTION".equals(columnName)) {
			return "MAX(A."
					+LANG_CODE
					+"_DESCRIPTION) AS "
					+LANG_CODE
					+"_DESCRIPTION ,";			
		}
		return "MAX(A."
				+LANG_CODE
				+"_VAL) AS "
				+LANG_CODE
				+"_VAL ,";
	}
	
	@Override
	public List<Map<String, Object>> SEARCH10(Map<String, Object> searchRow) {
		return dao.SEARCH10(searchRow);
	}
	
	@Override
	public int SAV00(NexacroRequest request) {
		
        int iTotCnt  = 0;
        List< Map<String ,Object> > dsGrid = (List< Map<String ,Object> >) request.getSaveDataset("dsGrid");
        List< Map<String ,Object> > dsGrid_DELETE = (List< Map<String ,Object> >) request.getDeletedDataset("dsGrid"); 
        List< Map<String ,Object> > langList = dao.SEARCH20();      
        
        // 삭제
        for( Map<String, Object> deleteRow : dsGrid_DELETE ) {
        	dao.DEL00(deleteRow);
            iTotCnt++;
        }
        
        // 저장 및 수정
        for( Map<String ,Object> saveRow : dsGrid ) {
        	//삭제를 한번하고 데이터를 넣어준다.
        	dao.DEL00(saveRow);
        	
        	// 1개의 row의 언어의 수만큼 insert
        	for( Map<String ,Object> lang : langList ) {
        		String langCode = lang.get("LANG_CODE").toString();
        		//key 초기화 후 저장 로직
        		saveRow.put( "LANG_CODE"	,langCode );
        		saveRow.put( "WORD_VALU"	,saveRow.get(langCode+"_VAL") );
        		saveRow.put( "DESCRIPTION"	,saveRow.get(langCode+"_DESCRIPTION") );
        		
        		dao.INS00(saveRow);
        		iTotCnt++;
        	}
        }
        
		return iTotCnt;
	}

	
}
