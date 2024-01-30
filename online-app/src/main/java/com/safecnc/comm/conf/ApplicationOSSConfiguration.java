package com.safecnc.comm.conf;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import com.safecnc.comm.dimn.SapJcoConnectionFactory;
import com.safecnc.comm.dimn.SapJcoConnectionProvider;
import com.safecnc.comm.dimn.FtpClientConnectorFactory;
import com.sap.conn.jco.ext.Environment;

/**
 * 애플리케이션 간의 메시지 교환과 관련 된 빈들을 등록한다. </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 */
public class ApplicationOSSConfiguration {
	
	@Autowired
	private SqlSessionFactory sqlSessionFactory;
	
	/**
	 * FTP 접속 관리를 위한 기본 빈
	 * 
	 * @Deprecated
	 * @return FtpClientConnectorFactory
	 */
	@Bean
	public FtpClientConnectorFactory ftpClientConnectorFactory() {
		
		return new FtpClientConnectorFactory();
	}
	
	/**
	 * RFC 연동을 위한 기본 접속 세팅 빈
	 * @SAP을 사용하지 않으므로 주석 처리
	 * @return
	 */
	//@Bean
	public SapJcoConnectionProvider sfd2022RFCConnectionProvider(PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer) {

		SapJcoConnectionProvider sfd2022RFCConnectionProvider = new SapJcoConnectionProvider();
		
		if(!Environment.isDestinationDataProviderRegistered())
		{
			Environment.registerDestinationDataProvider(sfd2022RFCConnectionProvider);
			
			sfd2022RFCConnectionProvider.setSession(sqlSessionFactory);
		}
		
		return sfd2022RFCConnectionProvider;
	}
	
	/**
	 * RFC 연동을 위한 기본 접속 세팅 빈
	 * @SAP을 사용하지 않으므로 주석 처리
	 * @return
	 */
	//@Bean
	public SapJcoConnectionFactory sapJcoConnectionFactory() {
		
		SapJcoConnectionFactory sapJcoConnectionFactory = new SapJcoConnectionFactory();
		
		return sapJcoConnectionFactory;
	}
	
}
