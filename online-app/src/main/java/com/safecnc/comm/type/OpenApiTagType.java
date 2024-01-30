package com.safecnc.comm.type;

import io.swagger.v3.oas.annotations.tags.Tag;

public interface OpenApiTagType {
	
	/* 시스템 관련 작업 */
	@Tag(name="공통(로그인)"	, description = "로그인 관련"		)	public interface CommonLogin 			{ }
	@Tag(name="공통(통합)"		, description = "공통호출 관련"		)	public interface CommonManagement 		{ }
	@Tag(name="공통(파일)"		, description = "공통파일 관련"		)	public interface CommonFile 			{ }
	@Tag(name="공통(인터페이스)", description = "인터페이스 관련"	)	public interface CommonInf 				{ }
	@Tag(name="시스템관리"		, description = "시스템관리 관련"	)	public interface SystemManagement 		{ }
	@Tag(name="Admin"		, description = "Admin 관련"		)	public interface AdminManagement 		{ }
	
	/* 테스트 관련 작업 */
	@Tag(name="시스템 테스트"	, description = "시스템 테스트"		)	public interface SystemTest				{ }
	@Tag(name="앱 테스트"		, description = "앱 테스트"		)	public interface ApplicationTest		{ }
} 
