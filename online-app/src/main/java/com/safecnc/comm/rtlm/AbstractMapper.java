package com.safecnc.comm.rtlm;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;

import com.safecnc.comm.dimn.SapJcoConnectionFactory;
import com.safecnc.comm.dimn.SapJcoManager;
import com.safecnc.comm.dimn.SapManager.ResultSapJcoManager;
import com.safecnc.web.exception.CustomException;

public class AbstractMapper {

	@Autowired
	protected SqlSession session;
	
	//@Autowired
	protected SapJcoConnectionFactory SapJcoConnectionFactory;
	
	public ResultSapJcoManager call(String ifName)
	{
		return call(ifName, new LinkedHashMap<String, Object>());
	}
	
	/**
	 * 원격 함수를 호출하는 기능
	 * @param ifName
	 * 				원격 함수명
	 * @param params
	 * 				원격 함수 파라미터
	 * @return 호출 된 결과를 반환한다.
	 */
	public ResultSapJcoManager call(String ifName, Map<String,Object> params)
	{
		// [ JCo ]를 관리할 객체를 선언
		SapJcoManager sfd2022SapJcoManager;
		
		try {
			
			// 생성자를 통하여 JCo 관리 객체를 생성
			sfd2022SapJcoManager = SapJcoConnectionFactory.getObject();
			
			// 자동 커밋 여부를 선언 적으로 [true]로 처리한다. (*default : false)
			sfd2022SapJcoManager.setAutoCommit(true);
			
			// 함수 호출을 실행한다.
			// 실행 시 결과 값을 받을 경우 함수 명칭을 기준으로 맵으로 리듀싱 되어 반환 된다.
			// 필요 시 여러 함수를 실행하기 위하여 해당 처리는 이곳에서는 기각한다.
			sfd2022SapJcoManager.call(ifName, params);
			
			return sfd2022SapJcoManager.getResult();
		} catch (Exception e) {
			
			throw new CustomException("-1", e.getMessage());
		}
	}
}
