package com.safecnc.comm.dimn;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Value;


public class FtpClientConnectorFactory implements FactoryBean<FtpClientConnector>{

	@Override
	public FtpClientConnector getObject() throws Exception {
		
		FtpClientConnector ftpClientConnector = new FtpClientConnector();
		
		// sftp 접속 정보로 사용 될 설정값을 등록합니다.
		ftpClientConnector.setConnType(storageType);
		ftpClientConnector.setConnHost(sftpHost);
		ftpClientConnector.setConnPort(Integer.parseInt(sftpPort));
		ftpClientConnector.setConnUsername(sftpUsername);
		ftpClientConnector.setConnPassword(sftpPassword);
		ftpClientConnector.setRootDirectory(rootDirectory);
		ftpClientConnector.setConnMode(sftpMode);

		
		return ftpClientConnector;
	}

	@Override
	public Class<?> getObjectType() {
		return FtpClientConnector.class;
	}
	
	@Value("${files.file.upload.type:}")
	private String storageType;

	@Value("${files.file.upload.sftp.host:localhost}")
	private String sftpHost;
	
	@Value("${files.file.upload.sftp.port:22}")
	private String sftpPort;
	
	@Value("${files.file.upload.sftp.username:sa}")
	private String sftpUsername;
	
	@Value("${files.file.upload.sftp.password:}")
	private String sftpPassword;
	
	@Value("${files.file.upload.sftp.mode:pasv}")
	private String sftpMode;
	
	@Value("${files.file.upload.sftp.root:/}")
	private String rootDirectory;
	
}
