package com.safecnc.comm.srvl;

import javax.servlet.annotation.WebServlet;

import com.nexacro.java.xeni.services.GridExportImportServlet;

@WebServlet(urlPatterns = {"/XExportImport"}, name = "XExportImport")
public class NexacroExcelExportImportServlet extends GridExportImportServlet { }