package com.safecnc.comm.conf;

import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import lombok.extern.slf4j.Slf4j;

/**
 * 외부 접속 정보와 관련된 접속-풀이나 접속 정보를 등록한다. </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see DataSource
 */
@Slf4j
public class ApplicationDatasourceConfiguration {
	
	/**
	 * 데이터를 접속할 접속 정보 정보를 등록 합니다.
	 * 
	 * @return [dataSource 설정] basicDataSource 설정
	 */
	@Profile(value={"local", "test", "stage"})
	@Bean("dataSource")
	public DataSource basicDataSourceDev() {
		
		BasicDataSource basicDataSource = new BasicDataSource();
		
		log.info("driverClassNamee : {}", driverClassNamee);
		log.info("url : {}", url);
		log.info("usernamee : {}", usernamee);
		log.info("password : {}", password);
		
		basicDataSource.setDriverClassName(driverClassNamee);
		basicDataSource.setUrl(url);
		basicDataSource.setUsername(usernamee);
		basicDataSource.setPassword(password);
		
		//Log4jdbcProxyDataSource log4jdbcProxyDataSource = new Log4jdbcProxyDataSource(basicDataSource);
		
		return basicDataSource;
	}
	
	/**
	 * 데이터를 접속할 접속 정보 정보를 등록 합니다.
	 * 
	 * @return [dataSource 설정] basicDataSource 설정
	 */
	@Profile(value={"prod"})
	@Bean("dataSource")
	public DataSource basicDataSourceProd() {
		
		BasicDataSource basicDataSource = new BasicDataSource();
		
		log.info("driverClassNamee : {}", driverClassNamee);
		log.info("url : {}", url);
		log.info("usernamee : {}", usernamee);
		log.info("password : {}", password);
		
		basicDataSource.setDriverClassName(driverClassNamee);
		basicDataSource.setUrl(url);
		basicDataSource.setUsername(usernamee);
		basicDataSource.setPassword(password);
		
		return basicDataSource;
	}
	
	@Value("${datasource.mariadb.driverClassName}")
	private String driverClassNamee;
	
	@Value("${datasource.mariadb.url}")
	private String url;
	
	@Value("${datasource.mariadb.username}")
	private String usernamee;
	
	@Value("${datasource.mariadb.password}")
	private String password;
}
