package com.safecnc.comm.dimn;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.safecnc.web.exception.CustomException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FtpClientConnector {

	public void write(String str_fileName, InputStream is) throws JSchException 
	{
		// sftp 일경우 ssh 포트를 사용하여 파일 입출력 처리
		if(connType.equals("sftp"))
		{
			// sftp connection open
			ChannelSftp channelSftp = connectSftp();
			
			// sftp datas transfer
			stream(channelSftp, rootDirectory.concat(str_fileName), is);
	   		
			// sftp connection close
			disConnectSftp(channelSftp);
		}
		// sftp 일 경우 ftp 포트를 사용하여 파일 입출력 처리
		else if(connType.equals("ftp"))
		{
			FTPControl ftpControl = new FTPControl();
			try 
			{
				//connect(String ip, int port, String id, String pw, String dir
				ftpControl.connect(connHost, connPort, connUsername, connPassword, rootDirectory);
				
				ftpControl.uploadFile(str_fileName, is);
				
				ftpControl.disconnect();
			}
			catch (Exception e) {
				log.error("FTP connection failed");
			}
		}
	}
	
	public void read(String str_fileName, OutputStream os) throws JSchException 
	{
		// sftp 일경우 ssh 포트를 사용하여 파일 입출력 처리
		if(connType.equals("sftp"))
		{
			// sftp connection open
			ChannelSftp channelSftp = connectSftp();

			// sftp datas transfer
			stream(channelSftp, rootDirectory.concat(str_fileName), os);

			// sftp connection close
			disConnectSftp(channelSftp);

	   		try {
				os.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		// sftp 일 경우 ftp 포트를 사용하여 파일 입출력 처리
		else if(connType.equals("ftp"))
		{
			FTPControl ftpControl = new FTPControl();
			try {
				//connect(String ip, int port, String id, String pw, String dir
				ftpControl.connect(connHost, connPort, connUsername, connPassword, rootDirectory);
				
				ftpControl.downloadFile(str_fileName, os);
				
				ftpControl.disconnect();
			}catch (Exception e) {
				
				throw new CustomException("3000", str_fileName);
			}
		}
	}
	
	public void rm(String str_fileName) throws JSchException 
	{
		// sftp 일경우 ssh 포트를 사용하여 파일 입출력 처리
		if(connType.equals("sftp"))
		{
			// sftp connection open
			ChannelSftp channelSftp = connectSftp();
			
			// sftp datas transfer
			rm(channelSftp, rootDirectory.concat(str_fileName));
			
			// sftp connection close
			disConnectSftp(channelSftp);
		}
		// sftp 일 경우 ftp 포트를 사용하여 파일 입출력 처리
		else if(connType.equals("ftp"))
		{
			
		}
	}

	/**
	 * 스트림을 통하여 채널에 있는 파일 정보를 전송하는 함수
	 * 
	 * @see JSch
	 * @see ChannelSftp
	 * @return 스트림 전송 여부
	 * @throws JSchException
	 */
	protected boolean stream(ChannelSftp channelSftp, String str_fileName, OutputStream os)
	{
		
		int read = -1;
		
		try (InputStream is = channelSftp.get(str_fileName)){
	   		
	   		while((read = is.read()) > -1) os.write((char)read);
		}
		catch (SftpException | IOException e) 
		{
   			throw new CustomException("3000", null);
		}
		
		return true;
	}
	
	/**
	 * 스트림을 통하여 채널에 있는 파일 정보를 삭제하는 함수
	 * 
	 * @see JSch
	 * @see ChannelSftp
	 * @param ChannelSftp 채널 sftp
	 * @param str_fileName 파일 전체 경로
	 * @return 스트림 전송 여부
	 * @throws SftpException
	 */
	protected boolean rm(ChannelSftp channelSftp, String str_fileName)
	{
		try {
			channelSftp.rm(str_fileName);
		} 
		catch (SftpException e0) {
			
			try {
				channelSftp.rmdir(str_fileName);
			}
			catch(Exception e1) {

				return false;
			}
			
			return true;
		}
		
		return true;
	}
	
	/**
	 * 스트림을 통하여 파일에 있는 파일 정보를 ftp로 전송하는 함수
	 * 
	 * @see JSch
	 * @see ChannelSftp
	 * @return 스트림 전송 여부
	 * @throws JSchException
	 */
	protected boolean stream(ChannelSftp channelSftp, String str_fileName, InputStream is)
	{
		String[] filePaths = str_fileName.split("/");
		
		try {
			
			for(int dep = 0 ; dep < filePaths.length-1 ; dep++)
			{
				// 루트 경로는 이동 경로가 아니므로 제외
				if(filePaths[dep].equals(""))continue;
				
				// catch 문을 사용하여 이동경로 폴더 확보
				try {
					channelSftp.ls(filePaths[dep]);
				}
				catch(SftpException e) 
				{
					channelSftp.mkdir(filePaths[dep]);
				}
				
				// 뎁스 아래로 경로 이동
				channelSftp.cd(filePaths[dep]);
			}
			
			// 경로가 확보 되면 파일 쓰기 
			channelSftp.put(is, str_fileName);
		}
		catch (SftpException e) 
		{
			throw new CustomException("3001", null);
		}
		
		return true;
	}
	
	/**
	 * sftp를 연결하여 접속을 처리하는 함수
	 * 
	 * @see JSch
	 * @see ChannelSftp
	 * @return 스트림 반환여부
	 * @throws JSchException
	 */
	protected ChannelSftp connectSftp()
	{
		Channel channel;
		Session session;
		JSch jsch = new JSch();
		
		try {
			session = jsch.getSession(connUsername, connHost, connPort);

	   		session.setPassword(connPassword);
	   		
	   		// 호스트 키 체크를 제거
	   		session.setConfig("StrictHostKeyChecking", "no");
	   		
	   		// 세션 접속
	   		session.connect();

	   		// 세션 연결 실패 시 에러 발생
	   		if(!session.isConnected()) 
	   		{
	   			throw new CustomException("3002", null);
	   		}
	   		
	   		// 채널 생성
	   		channel = session.openChannel(this.connType);
	   		
	   		// 채널 연결
	   		channel.connect();
	   		
	   		// 채널 연결 실패 시 에러 발생
	   		if(!channel.isConnected())
	   		{
	   			// 세션 접속 종료 후 오류 반환
	   			session.disconnect();
	   			
	   			throw new CustomException("3002", null);
	   		}
	   		
	   		// 접속 한 채널 반환
	   		return (ChannelSftp) channel;
	   		
		} catch (JSchException e) {
			
			throw new CustomException("3002", null);
		}
	}
	
	
	/**
	 * sftp를 연결의 접속을 종료하는 함수
	 * 
	 * @see JSch
	 * @see ChannelSftp
	 * @return 접속 반환 여부
	 * @throws JSchException
	 */
	protected boolean disConnectSftp(ChannelSftp channelSftp) 
	{
		// 채널이 만들어 지지 않았을 경우 즉시 전상 소실 반환
		if(channelSftp == null) 
		{
			return true;
		}
		
		// sftp의 연결이 정상적으로 되어 있을 경우
		if(channelSftp.isConnected())
		{
			// sftp의 세션 접속 종료
			try {
				channelSftp.getSession().disconnect();
			}
			catch (JSchException e) 
			{
				return true;
			}
			finally {
				// 채널 접속 종료
				channelSftp.disconnect();	
			}
			
			return true;
		}
		
		return false;
	}
	
	
	
	public String getConnType() {
		return connType;
	}

	public void setConnType(String connType) {
		this.connType = connType;
	}

	public String getConnUsername() {
		return connUsername;
	}

	public void setConnUsername(String connUsername) {
		this.connUsername = connUsername;
	}

	public String getConnPassword() {
		return connPassword;
	}

	public void setConnPassword(String connPassword) {
		this.connPassword = connPassword;
	}

	public String getConnHost() {
		return connHost;
	}

	public void setConnHost(String connHost) {
		this.connHost = connHost;
	}

	public int getConnPort() {
		return connPort;
	}

	public void setConnPort(int connPort) {
		this.connPort = connPort;
	}

	public String getConnMode() {
		return connMode;
	}

	public void setConnMode(String connMode) {
		this.connMode = connMode;
	}
	
	public String getRootDirectory() {
		return rootDirectory;
	}

	public void setRootDirectory(String rootDirectory) {
		this.rootDirectory = rootDirectory;
	}

	private String connType;
	private String connUsername;
	private String connPassword;
	private String connHost;
	private int connPort;
	private String connMode;
	private String rootDirectory;
	
	// 테스팅
	public static void main(String[] args) throws IOException, SftpException, JSchException {
		FtpClientConnector ftpClientConnector = new FtpClientConnector();
		
		ftpClientConnector.setConnType("ftp");
		ftpClientConnector.setConnMode("pasv");
		ftpClientConnector.setConnPort(1010);
		ftpClientConnector.setConnHost("nas.safecnc.co.kr");
		ftpClientConnector.setConnUsername("leejh");
		ftpClientConnector.setConnPassword("pig0705");
		ftpClientConnector.setRootDirectory("00.PRIVATE/임하준/20210331"); // 경로
		
		FileInputStream fin = new FileInputStream("AAAA.txt");
		ftpClientConnector.write("CCCC.data", fin);
		
		FileOutputStream fout = new FileOutputStream("BBBB.txt");
		ftpClientConnector.read("CCCC.data", fout);
	}
}
