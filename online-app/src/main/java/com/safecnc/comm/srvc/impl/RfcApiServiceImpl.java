package com.safecnc.comm.srvc.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.safecnc.comm.rtlm.AbstractServiceImpl;
import com.safecnc.comm.srvc.RfcApiService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("RfcApiServiceImpl")
public class RfcApiServiceImpl extends AbstractServiceImpl implements RfcApiService{
	
	/*
    @Resource(name="RfcApiDao")
    private RfcApiDao dao;
    
	@Override
	public Object Z_RF_SELECT_DELNOTE(Map<String, Object> parmas) {
		return dao.Z_RF_SELECT_DELNOTE(parmas);
	}

	@Override
	public Object YZT00L7_GET_EMPNO_SAPID(Map<String, Object> parmas) {
		return dao.YZT00L7_GET_EMPNO_SAPID(parmas);
	}
    */
}
