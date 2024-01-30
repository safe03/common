package com.safecnc.comm.conf;
import javax.servlet.annotation.WebServlet;

import com.ubireport.server.UbiServer4;



@WebServlet(urlPatterns = {"/UbiServer"}, name = "UbiServer")
public class UbidemoServletConfing extends UbiServer4 { }

