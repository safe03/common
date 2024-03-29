<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="com.ubireport.common.util.StrUtil" %>
<%
	// 보안을 위해 설치 후 임시로 false로 변경해서 결과 확인 후 소스 배포 시 무조건 true로 변경해야함
	boolean refererCheck = false;
	String referer = StrUtil.nvl(request.getHeader("referer"), "");	// REFERER 가져오기
	if( refererCheck && (referer.equals("") || referer.indexOf(request.getServerName()) == -1) ) { 	// REFERER 체크(브라우저에서 직접 호출 방지)
		out.clear();
		out.print("비정상적인 접근입니다.");
		return;
	}

	//웹어플리케이션명
	String appName = StrUtil.nvl(request.getContextPath(), "");
	if( appName.indexOf("/") == 0 ) {
		appName = appName.substring(1, appName.length());
	}	

	//웹어플리케이션 Root URL, ex)http://localhost:8080/myapp
	String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + ((appName.length() == 0)?"":"/") + appName;

	//UI에서 호출될 때 필요한 정보
	String file = StrUtil.nvl(request.getParameter("file"), "ubi_sample.jrf");
	String arg = StrUtil.encrypt64(StrUtil.nvl(request.getParameter("arg"), "user#홍길동#company#유비디시전#"),"UTF-8");
	String resid = StrUtil.nvl(request.getParameter("resid"), "UBIHTML");
/*
	System.out.println("[appUrl] " + appUrl);
	System.out.println("[file] " + file);
	System.out.println("[arg] " + arg);
	System.out.println("[resid] " + resid);
*/
	out.clearBuffer();
%>
<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.5,user-scalable=yes">
<title>UbiReport Viewer</title>
<link rel="stylesheet" type="text/css" href="../ui/js/ubi4/css/ubieform.css" />
<!--[if IE]><script src='./js/ubiexcanvas.js'></script><![endif]-->
<script src='../ui/js/ubi4/js/ubicommon.js'></script>
<script src='../ui/js/ubi4/js/ubihtml.js'></script>
<script src='../ui/js/ubi4/js/msg.js'></script>
<script src='../ui/js/ubi4/js/ubinonax.js'></script>
<script src='../ui/js/ubi4/js/ubieform.js'></script>

<script language='javascript'>
<!--

//request.getScheme() 정보를 잘 못 가지고 온다면 아래의 변수 사용해서 호출
var appUrl = self.location.protocol + '//' + self.location.host + '<%= ((appName.length() == 0)?"":"/") + appName %>';


var ubiHtmlViewer = null;
var ubiParams = {
	"appurl": "<%= appUrl %>"  //오류가 발생한다면 "appurl":appUrl 로 호출
	,"key": "<%= session.getId() %>" 
	,"jrffile": "<%= file %>"
	,"arg": "<%= arg %>"
	,"resid": "<%= resid %>"
};
var ubiEvents ={
	 "reportevent.previewend": ubiReportPreviwEnd
	,"reportevent.printend": ubiReportPrintEnd
	,"reportevent.exportend": ubiReportExportEnd
//	,"reportevent.printClicked": ubiReportPrintClicked
//	,"reportevent.exportClicked": ubiReportExportClicked
//	,"eformevent.previewend": ubiEformPreviewEnd
//	,"eformevent.saveend": ubiEformSaveEnd
};


function ubiStart() {
	ubiHtmlViewer = UbiLoad(ubiParams, ubiEvents);
	try { /*ubiHtmlViewer.setUserSaveList('Image,Pdf,Docx,Xls,Pptx,Hml,Cell');*/ }catch(e){}
	try { /*ubiHtmlViewer.setUserPrintList('Ubi,Html,Pdf');*/ }catch(e){}
	try { /*ubiHtmlViewer.setVisibleToolbar('INFO', false);*/ }catch(e){}
	try { /*ubiHtmlViewer.setVisibleToolbar("SAVE", false);*/ }catch(e){}
}

function ubiReportPreviwEnd() {
	//console.log('ubiPreviwEnd......');
}

function ubiReportPrintEnd() {
	//console.log('ubiReportPrintEnd......');
}

function ubiReportExportEnd() {
	//console.log('ubiExportEnd......');
}

function ubiReportPrintClicked() {
	//console.log('ubiReportPrintClicked......');
}

function ubiReportExportClicked() {
	//console.log('ubiReportExportClicked......');
}

function ubiEformSaveEnd() {
	//console.log('ubiEformSaveEnd......');
}

function ubiEformPreviewEnd() {
	//console.log('ubiEformPreviewEnd......');
};

function ubiEformSaveEnd(file) {
	//console.log('ubiEformSaveEnd......' + file);
};

//-->
</script>
</head>
<body onload='ubiStart()'>
</body>
</html>
