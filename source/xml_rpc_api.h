/*
        xml_rpc_api.h
 
        This module defines the public API for the xml_rpc_api.c file.

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

#ifndef XMLRPCAPI_H
#define XMLRPCAPI_H

#include "xmlrpc.h"
#include "simserver.h"

#ifdef IS_XMLRPCAPI_C
#define EXTERN
#else
#define EXTERN  extern
#endif

EXTERN XMLRPC_VALUE getVal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE setVal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getInputName(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getOutputName(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getNumInputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getNumOutputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getAllInputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE getAllOutputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);

#ifdef TEST_HARNESS
EXTERN XMLRPC_VALUE method_echo(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestStruct(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestArray(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestBoolean(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestInt(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestString(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestDouble(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestBase64(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestDateTime(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestNormal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData);
EXTERN XMLRPC_VALUE method_TestFault(XMLRPC_SERVER server, XMLRPC_REQUEST input, void* userData);
#endif

#undef EXTERN
#endif  //XMLRPCAPI_H