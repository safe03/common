package com.safecnc.comm.conf;

import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * 애플리케이션에서 처리할 공통 설정 클래스이며 세부 설정들은 각 클래스에서 처리하도록 한다.</br>
 * 등록 된 설정 클래스의 목차는 아래와 같다. </br>
 * ● ApplicationConstConfiguration : 공통 설정 클래스 </br>
 * ● ApplicationDatasourceConfiguration : 데이터 접근 설정 클래스 </br>
 * ● ApplicationMapperConfiguration : 마이바티스 관련 설정 클래스 </br>
 * ● ApplicationTransactionConfiguration : 트랜잭션 처리 관련 설정 클래스 </br>
 * ● ApplicationSyncronizeConfiguration : 비동기 처리 관련 설정 클래스 </br>
 * ● ApplicationOSSConfiguration : 외부 소프트웨어 연동 설정 클래스 </br>
 * ● ApplicationMessagingConfiguration : 메시징 관련 설정 클래스 </br>
 * ● ApplicationOpanAPiConfiguration : 오픈 API 관련 설정 클래스 </br>
 * ● ApplicationSecurityConfiguration : 보안성 검증 설정 클래스 </br>
 * ● ApplicationWebSecurityConfiguration : 웹 보안성 검증 설정 클래스 </br>
 * ● ApplicationJobBatchConfiguration : 배치 처리 관련 설정 클래스 </br>
 * ● ApplicationNexacroConfiguration : 넥사크로 연동 관련 설정 클래스 </br>
 * ● ApplicationWebConfiguration : 웹 관련 설정 클래스 @deprecated </br>
 * 
 * @author jhlee
 * @since 2022-02-13
 * @see Configuration
 * @see AutoConfigurations
 */
@Configuration
@Import({
	  ApplicationConstConfiguration.class
	, ApplicationDatasourceConfiguration.class
	, ApplicationMapperConfiguration.class
	, ApplicationTransactionConfiguration.class
	, ApplicationSyncronizeConfiguration.class
	, ApplicationOSSConfiguration.class
	, ApplicationMessagingConfiguration.class
	, ApplicationOpanAPiConfiguration.class
	, ApplicationSecurityConfiguration.class
	, ApplicationWebSecurityConfiguration.class
	//, ApplicationJobBatchConfiguration.class
	, ApplicationNexacroConfiguration.class
	, ApplicationWebConfiguration.class
})
public class ApplicationConfiguration{ /* 애플리케이션에서 사용할 빈 생성 시 이곳에 추가 */ }
