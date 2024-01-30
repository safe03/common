package com.safecnc.comm.dimn;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

import com.safecnc.web.exception.CustomException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FTPControl {
	private FTPClient ftpClient;
	
	public FTPControl() {
		this.ftpClient = new FTPClient();
	}
	
	public void connect(String ip, int port, String id, String pw, String dir) {
		try {
			boolean result = false;
			ftpClient.setControlEncoding("EUC-KR");		// 한글이 안되서 EUC-KR connect 하기전에 encoding해야함
//			ftpClient.setControlEncoding("UTF-8");		// 인코딩 설정 한글이 안됨
			ftpClient.connect(ip, port);				// FTP 연결
			int reply = ftpClient.getReplyCode();		// 응답코드 받기
			
			
			
			if(!FTPReply.isPositiveCompletion(reply)) { // 응답이 positive가 아니면 연결 해제
				ftpClient.disconnect();
				throw new CustomException("-1", "FTP 연결 실패");
			}
			
			if(!ftpClient.login(id, pw)) { // 로그인 실패하면
				ftpClient.logout();
				throw new CustomException("-1", "FTP 로그인 실패");
			}
			
			ftpClient.setSoTimeout(1000*10);				// TimeOut 설정
			//ftpClient.login(id, pw);						// 위에서 하는데 왜 또하지? // 로그인 한번 또 하니까 안됨 역시 ㅇㅇ
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);	// 파일 타입 설정
			ftpClient.enterLocalPassiveMode();				// Active 모드 설정?
			
			result = ftpClient.changeWorkingDirectory(dir); // 디렉토리 만드는 부분
			
			log.debug("reply : "+reply+" , "+FTPReply.isPositiveCompletion(reply) +", result : "+result+" : "+ dir);
			
			if(!result){
				String[] directory = dir.split("/");
				String newdir = "";
				for(int i=0, l=directory.length; i<l; i++) {
					newdir += ("/" + directory[i]);
					try {
						result = ftpClient.changeWorkingDirectory(newdir);
						if(!result) {
							ftpClient.makeDirectory(newdir);
							ftpClient.changeWorkingDirectory(newdir);
						}
					}
					catch (IOException e) 
					{
						throw new CustomException("1", e.getMessage());
					}
				}
			}
			
		}
		catch (Exception e) 
		{
			
			throw new CustomException("-1", e.getMessage());
		}
	
	}

	
	public void disconnect(){
		try {
			// 연결중이면 연결해제
			if(ftpClient.isConnected()) { 
				ftpClient.disconnect();
			}
		} catch (IOException e) {
			throw new CustomException("-1", e.getMessage());
		}
	}
	
	public void uploadFile(String saveFileNm, InputStream inputStream) throws Exception{
		try {
			if(!ftpClient.storeFile(saveFileNm, inputStream)) {
				throw new CustomException("-1","FTP서버 업로드 실패");
			}
		} catch (Exception e) {
			if(e.getMessage().indexOf("not open") > -1) {
				throw new CustomException("-1", "FTP서버 not open");
			}
			throw e;
		}
	}
	
	public void downloadFile(String saveFileNm, OutputStream outputStream) throws Exception{
		try {
			if(!ftpClient.retrieveFile(saveFileNm, outputStream)) {
				throw new CustomException("-1", "FTP서버 다운로드 실패");
			}
		} catch (Exception e) {
			if(e.getMessage().indexOf("not open") > -1) {
				throw new CustomException("-1", "FTP서버 not open");
			}
			throw e;
		}
	}
}
