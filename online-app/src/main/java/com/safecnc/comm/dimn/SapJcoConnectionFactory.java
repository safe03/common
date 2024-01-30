package com.safecnc.comm.dimn;

import org.springframework.beans.factory.FactoryBean;

/**
 * RFC call을 위한 접속 추상화 생성 관련 제공 클래스 </br>
 * 생성시 사용할 필요 인자가 있을 경우 해당 설정 값으로 부터 처리하도록 한다. </br>
 * 
 * @author jhlee
 * @since 2022-05-13
 * @see SapJcoManager
 * @see https://help.sap.com/docs
 */
public class SapJcoConnectionFactory implements FactoryBean<SapJcoManager>{

	@Override
	public SapJcoManager getObject() throws Exception {
		
		return new SapJcoManager();
	}

	@Override
	public Class<?> getObjectType() {
		
		return SapJcoManager.class;
	}
}
