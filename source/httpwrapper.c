/*
        httpwrapper.c
 
        This module implements the glue code between the Matlab Simulink
        s-function, the webserver and the XML-RPC engine.


        This file is part of SimServer.
        Copyright (c) Jon Mills (Hicroft Technology Ltd) and others.
        (See the AUTHORS file in the root of this distribution.)

        SimServer is free software; you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation; either version 2 of the License, or
        (at your option) any later version.

        SimServer is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with SimServer; if not, write to the Free Software
        Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */

#define IS_HTTPWRAPPER_C

#include <stdio.h>
#include <string.h>
#include "httpwrapper.h"
#include "httppil.h"
#include "httpapi.h"
#include "xmlrpc.h"
#include "simserver.h"
#include "xml_rpc_api.h"

static HttpParam httpParam;
XMLRPC_SERVER  xml_rpm_server_obj;

//Dummy prototype for function contained in httphandler.c
int uhStats(UrlHandlerParam* param);

//Local function prototypes
static void xmlrpc_engine_init(void);

int uhRPCHandler(UrlHandlerParam* param)
{
        XMLRPC_REQUEST request=NULL;
        XMLRPC_REQUEST response=NULL;
        STRUCT_XMLRPC_REQUEST_INPUT_OPTIONS in_opts;
        char *encoding = 0;
        int output = 0;
        char *outBuf = NULL;

        in_opts.xml_elem_opts.encoding = utf8_get_encoding_id_from_string(encoding);

        if (param->hs->request.payloadSize > 0)
        {
                request = XMLRPC_REQUEST_FromXML(param->hs->request.pucPayload, param->hs->request.payloadSize, &in_opts);

                /* create a response struct */
                response = XMLRPC_RequestNew();
                XMLRPC_RequestSetRequestType(response, xmlrpc_request_response);

                /* call server method with client request and assign the response to our response struct */
                XMLRPC_RequestSetData(response, XMLRPC_ServerCallMethod(xml_rpm_server_obj, request, NULL));

                if(output == 0 || output == 2) 
                {
                        /* serialize server response as XML */
                        outBuf = XMLRPC_REQUEST_ToXML(response, 0);
                }

                if (outBuf)
                {
                        //Copy the response into the output buffer
                        strcpy(param->pucBuffer,outBuf);
                        param->dataBytes = strlen(outBuf);
                        param->fileType=HTTPFILETYPE_XML;                        

                        //Clean up the request and response objects, along with the 
                        //buffer which was created by the XML-RPC engine.
                        if(request) XMLRPC_RequestFree(request, 1);    
                        if(response) XMLRPC_RequestFree(response, 1);
                        if (outBuf) free(outBuf);

                        return (FLAG_DATA_RAW);
                }
        }

        //Clean up the request and response objects, along with the 
        //buffer which was created by the XML-RPC engine.
        if(request) XMLRPC_RequestFree(request, 1);    
        if(response) XMLRPC_RequestFree(response, 1);
        if (outBuf) free(outBuf);

        return (FLAG_DATA_RAW);
}


//URL handler list
static UrlHandler urlHandlerList[]={
        {"stats",uhStats},
        {"RPC2", uhRPCHandler},    
        {"RPC2/null", uhRPCHandler},    //For Flex client
	{NULL},
};

short httpserver_start(short port)
{
	httpParam.maxClients=32;
	httpParam.httpPort=port;
	httpParam.maxReqPerConn=99;
	httpParam.pchWebPath="webroot";
	httpParam.pxUrlHandler=urlHandlerList;
	//set web callbacks
	httpParam.pfnSubst=DefaultWebSubstCallback;
#ifndef _NO_POST
	httpParam.pfnPost = DefaultWebPostCallback;
	httpParam.pfnFileUpload = DefaultWebFileUploadCallback;
#endif

    xmlrpc_engine_init();
	
	InitSocket();
	//start server
	if (mwServerStart(&httpParam)==0)
    {
        printf("SimServer: Webserver started successfully\n");
    
        return 0;
    }
    
    printf("SimServer: Failed to start webserver on port %d\n",port);
    
    return -1;
}

void httpserver_quit(void)
{
        if(xml_rpm_server_obj) XMLRPC_ServerDestroy(xml_rpm_server_obj);
        httpParam.bKillWebserver=1;
        mwServerShutdown(&httpParam);
	UninitSocket();
}

static void xmlrpc_engine_init(void)
{
        /* create a new server object */
        xml_rpm_server_obj = XMLRPC_ServerCreate();

        /* Register some public methods with the server */
#ifdef TEST_HARNESS
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_Echo", method_echo);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestNormal", method_TestNormal);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestFault", method_TestFault);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestStruct", method_TestStruct);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestArray", method_TestArray);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestBoolean", method_TestBoolean);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestInt", method_TestInt);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestString", method_TestString);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestDouble", method_TestDouble);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestBase64", method_TestBase64);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "method_TestDateTime", method_TestDateTime);
#endif
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getVal", getVal);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "setVal", setVal);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getInputName", getInputName);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getOutputName", getOutputName);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getNumInputs", getNumInputs);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getNumOutputs", getNumOutputs);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getAllInputs", getAllInputs);
        XMLRPC_ServerRegisterMethod(xml_rpm_server_obj, "getAllOutputs", getAllOutputs);
}

//////////////////////////////////////////////////////////////////////////
// callback from the web server whenever it needs to substitute variables
//////////////////////////////////////////////////////////////////////////
int DefaultWebSubstCallback(SubstParam* sp)
{
	// the maximum length of variable value should never exceed the number
	// given by sp->iMaxValueBytes
	if (!strcmp(sp->pchParamName,"mykeyword")) {
		return sprintf(sp->pchParamValue, "%d", time(NULL));
	}
	return -1;
}

//////////////////////////////////////////////////////////////////////////
// callback from the web server whenever it recevies posted data
//////////////////////////////////////////////////////////////////////////
int DefaultWebPostCallback(PostParam* pp)
{
  int iReturn=WEBPOST_OK;

  // by default redirect to config page
  //strcpy(pp->pchFilename,"index.htm");

  return iReturn;
}

//////////////////////////////////////////////////////////////////////////
// callback from the web server whenever it receives a multipart 
// upload file chunk
//////////////////////////////////////////////////////////////////////////
int DefaultWebFileUploadCallback(HttpMultipart *pxMP, OCTET *poData, size_t dwDataChunkSize)
{
  // Do nothing with the data
	int fd = (int)pxMP->pxCallBackData;
	if (!poData) {
		// to cleanup
		if (fd > 0) {
			close(fd);
			pxMP->pxCallBackData = NULL;
		}
		return 0;
	}
	if (!fd) {
		fd = open(pxMP->pchFilename, O_CREAT | O_TRUNC | O_RDWR | O_BINARY);
		pxMP->pxCallBackData = (void*)fd;
	}
	if (fd <= 0) return -1;
	write(fd, poData, dwDataChunkSize);
	if (pxMP->oFileuploadStatus & HTTPUPLOAD_LASTCHUNK) {
		close(fd);
		pxMP->pxCallBackData = NULL;
	}
	printf("Received %lu bytes for multipart upload file %s\n", dwDataChunkSize, pxMP->pchFilename);
	return 0;
}

#undef IS_HTTPWRAPPER_C
