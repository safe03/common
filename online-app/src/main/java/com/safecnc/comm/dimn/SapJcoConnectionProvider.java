package com.safecnc.comm.dimn;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.safecnc.comm.rtlm.AbstractMapper;
import com.safecnc.util.PropertyAccessor;
import com.sap.conn.jco.ext.DestinationDataEventListener;
import com.sap.conn.jco.ext.DestinationDataProvider;
import com.sap.conn.jco.ext.Environment;

import lombok.extern.slf4j.Slf4j;

/**
 * RFC접속과 관련 된 고유 자원 제공 클래스</br>
 * 필요 시 접속 권한을 이양 받아 접속 정보를 캐시 한다.</br>
 * 
 * @since 2022-05-16
 * @author jhlee
 * 
 * @see AbstractMapper
 * @see DestinationDataProvider
 * @see SapJcoProvideProperties
 */
@Slf4j
public class SapJcoConnectionProvider implements DestinationDataProvider, ServletContextListener {
	
	/** 연결 접속 정보를 캐시하기 위한 캐시 변수 */
	private Properties jcoCacheConnectionProperties;
	
	/** 내부 저장소를 사용하여 접속 정보를 일반화 하기 위한 캐시 변수 */
	private Map<String,Properties> localConnectionProperties = new HashMap<String, Properties>();
	
	/** 데이터베이스 처리를 위한 지원 변수 */
	private SqlSessionFactory sqlSessionFactory;
	
	@Override
	public Properties getDestinationProperties(String destinationName) 
	{
		// [Sfd2022Jco] 에서 처리할 수 있을 경우 고유한 프로퍼티를 사용하여 처리
		if(SapJcoProvideProperties.isDestination(destinationName)) 
		{
			// 연결 정보가 없을 경우 연결 설정 정보를 생성
			if(Objects.isNull(jcoCacheConnectionProperties))
			{
				jcoCacheConnectionProperties = new Properties();
				
				// 목적지가 없을 경우 빈값 반환
				if(Objects.isNull(destinationName))
				{
					log.error("not supported sap destination name");
					
					return jcoCacheConnectionProperties;
				}
			
				// 속성값 처리를 위한 고유 변수 선언
				String propName
					 , filePropName
					 , propValue;
				
				// [JCO] 설정 세팅을 순환하며 처리한다.
				for(SapJcoProvideProperties jcoProvideProperty : SapJcoProvideProperties.getNames())
				{
					propName     = jcoProvideProperty.getName();
					
					filePropName = jcoProvideProperty.getPropertyName();
					
					propValue    = PropertyAccessor.getProperty(filePropName, jcoProvideProperty.getDefaultValue());
					
					// 설정값이 비어있을 경우
					if(!Objects.isNull(propValue)) 
					{
						jcoCacheConnectionProperties.setProperty(propName, propValue);
					}
				}
			}

			return jcoCacheConnectionProperties;
		}

		if(!localConnectionProperties.containsKey(destinationName))
		{
			/* 연결 접속 정보를 캐시하기 위한 캐시 변수 */
			Properties jcoConnectionProperties = new Properties();
			
			Map<String,Object> mapParam = new HashMap<String, Object>();
		
			mapParam.put("SAP_ID", destinationName);
			
			try(SqlSession session = sqlSessionFactory.openSession())
			{
				List<Map<String,Object>> result = session.selectList("SAP_JCO.SEL00", mapParam);
				
				if(result.size() > 0)
				{
					String str_SAP_ID    = (String)result.get(0).get("SAP_ID");
					String str_SAP_NM    = (String)result.get(0).get("SAP_NM");
					String str_CLIENT_NO = (String)result.get(0).get("CLIENT_NO");
					String str_SYSTEM_NO = (String)result.get(0).get("SYSTEM_NO");
					String str_USER      = (String)result.get(0).get("USER");
					String str_PSWD      = (String)result.get(0).get("PSWD");
					String str_HOST      = (String)result.get(0).get("HOST");
					String str_BIGO      = (String)result.get(0).get("BIGO");
					
					jcoConnectionProperties.put(DestinationDataProvider.JCO_CLIENT, str_CLIENT_NO);
					jcoConnectionProperties.put(DestinationDataProvider.JCO_SYSNR, str_SYSTEM_NO);
					jcoConnectionProperties.put(DestinationDataProvider.JCO_USER, str_USER);
					jcoConnectionProperties.put(DestinationDataProvider.JCO_PASSWD, str_PSWD);
					jcoConnectionProperties.put(DestinationDataProvider.JCO_ASHOST, str_HOST);
				}
				
				localConnectionProperties.put(destinationName, jcoConnectionProperties);
				
				return jcoConnectionProperties;
			}
		}
		else
		{
			return localConnectionProperties.get(destinationName);
		}
	}

	@Override
	public void setDestinationDataEventListener(DestinationDataEventListener destinationDataEventListener) {
		
		
	}
	
	public void setSession(SqlSessionFactory session) {
		this.sqlSessionFactory = session;
	}
	
	@Override
	public boolean supportsEvents() { return true; }

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
		// Environment에 프로바이더가 등록 되어 있을 경우 자신을 제거한다.
		if(Environment.isServerDataProviderRegistered())
		{
			this.sqlSessionFactory = null;
			
			Environment.unregisterDestinationDataProvider(this);
			
		}
	}

}
