package com.safecnc.comm.conf;

import java.io.IOException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.scheduling.annotation.SchedulingConfiguration;

import lombok.extern.slf4j.Slf4j;

/**
 * 애플리케이션 내부/외부에서 데이터 레이어 처리를 담당할 빈을 등록합니다 </br> 
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see SchedulingConfiguration
 */
@Slf4j
public class ApplicationMapperConfiguration {
	
	@Autowired
	private DataSource dataSource;
	
	/**
	 * 대용량 데이터 처리를 위한 처리기
	 * 
	 * @return DefaultLobHandler
	 */
	@Bean
	public DefaultLobHandler lobHandler() {
		return new DefaultLobHandler();
	}

	/**
	 * Mybatis 사용을 위한 생성자 빈을 반환
	 * 
	 * @return SqlSessionFactoryBean
	 */
	@Bean("sqlSession")
	public SqlSessionFactoryBean sqlSession() {
		
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		
		sqlSessionFactoryBean.setDataSource(dataSource);
		
		PathMatchingResourcePatternResolver pathMatchingResourcePatternResolver = new PathMatchingResourcePatternResolver();

		sqlSessionFactoryBean.setConfigLocation(pathMatchingResourcePatternResolver
				.getResource("classpath:/safecnc/sqlmap/config/sql-mapper-config.xml"));

		try {
			sqlSessionFactoryBean.setMapperLocations(
					pathMatchingResourcePatternResolver.getResources("classpath:/safecnc/sqlmap/mappers/**/*.xml"));
		} 
		catch (IOException e) {
			log.error("Mybatis Mapper not connected.");
		}

		return sqlSessionFactoryBean;
	}
	
	/**
	 * Mybatis를 사용하기 위한 템플릿 객체 반환 
	 * 
	 * @param {@link ApplicationMapperConfiguration#sqlSession()} sqlSession
	 * @return SqlSessionTemplate
	 */
	@Bean
	public SqlSessionTemplate sqlSessionTemplate(@Qualifier("sqlSession") SqlSessionFactory sqlSession) {
		
		SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sqlSession);
		
		return sqlSessionTemplate;
	}
}
