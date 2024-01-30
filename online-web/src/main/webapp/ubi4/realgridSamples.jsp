<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%
	String no = request.getParameter("no");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>RealGrid 샘플 페이지</title>
<!-- RealGrid2 -->
<link href="../realgrid.2.4.2/realgrid-style.css" rel="stylesheet" />
<script src="../realgrid.2.4.2/jquery.min-20.js"></script>
<script src="../realgrid.2.4.2/realgrid-utils.js"></script>
<script src="../realgrid.2.4.2/realgrid.2.4.2.min.js"></script>
<script src="../realgrid.2.4.2/libs/jszip.min.js"></script>
<script src="../realgrid.2.4.2/realgrid-lic.js"></script>

<!-- Custom -->
<link href="../realgrid.2.4.2/index.css" rel="stylesheet" />
<script src="../realgrid.2.4.2/index.js"></script>

<!-- ubireport_realgrid -->
<script src="./js/ubirealgrid.js"></script>

<script language='javascript'>
<!--
	var layoutNo = '<%= no %>';
//-->
</script>

</head>
<body>
	<p>
	
	<!-- showReportPopup 함수는 ./js/ubirealgrid.js에 구현되어 있습니다. 
	
	showReportPopup(1.dataProvider 이름 : ../realgrid.2.4.2/index.js에서 생성(변수 선언이므로 가변적!) ,
					2.리얼그리드 객체명 : ../realgrid.2.4.2/index.js에서 생성 (변수 선언이므로 가변적!),
					3."팝업jsp경로", 
					4."jrf파일명", 
					5."jrf파일의 파라미터", 
					6."resid" ) 
	-->
	
	<input type='button' name='ubireport' value='HTML Popup 가로' onclick='showReportPopup(dataProvider, gridView, "./ubigrid.jsp", "grid_a4h.jrf", "TITLE#리얼그리드 자동리포트(A4 가로)#USER#홍길동#", "INSTALL")' style="height:30px; color:#d7d7d7; background-color:#3c3c3c;">
	<input type='button' name='ubireport' value='HTML Popup 세로' onclick='showReportPopup(dataProvider, gridView, "./ubigrid.jsp", "grid_a4v.jrf", "TITLE#리얼그리드 자동리포트(A4 세로)#USER#이순신#", "INSTALL")' style="height:30px; color:#d7d7d7; background-color:#3c3c3c;">
	</p>
	
	<div id="realgrid"></div>
	<div class="toolbar"></div>
	
	<input type="hidden" id="designdata" name="designdata" value="">
	<input type="hidden" id="runtimedata" name="runtimedata" value="">
	<input type="hidden" id="jrffilenm" name="jrffilenm" value="">

</body>
</html>