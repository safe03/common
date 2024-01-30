package com.safecnc.comm.srvl;

import javax.servlet.annotation.WebServlet;

import com.nexacro.java.xeni.services.GridExportImportServlet;

@WebServlet( urlPatterns = {"/XImport"}, name = "XImport")
public class NexacroExcelImportServlet extends GridExportImportServlet { }