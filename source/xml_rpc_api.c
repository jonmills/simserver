/*
        xml_rpc_api.c
 
        This module defines the XML-RPC API public methods.


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

#define IS_XMLRPCAPI_C
#include "xml_rpc_api.h"
#include "string.h"

XMLRPC_VALUE getVal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        double dVal;
        const char* signalName = XMLRPC_GetValueString(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));

        getModelValue(signalName,&dVal);

        return XMLRPC_CreateValueDouble(NULL, dVal);
}

XMLRPC_VALUE setVal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        double dVal;
        int iVal;
        boolean_T result;

        const char* signalName = XMLRPC_GetValueString(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));
        dVal = XMLRPC_GetValueDouble(XMLRPC_VectorNext(XMLRPC_RequestGetData(request)));

        /* 
                    This is a hack to try to get around the problem where clients assume that setting a whole value number
                    must mean that they must send an int, rather than a float. If the value we've been sent makes sense
                    as an integer, but not as a float, assume it was an integer and then convert it to a float.                    
                    */        
        /* First, do a dummy rewind and read, to get us back to the second element */
        XMLRPC_GetValueString(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));
        iVal = XMLRPC_GetValueInt(XMLRPC_VectorNext(XMLRPC_RequestGetData(request)));
        if ((iVal!=0) && (dVal==0.0)) dVal = (double)iVal;
        
        result = setModelValue(signalName,dVal);

        return XMLRPC_CreateValueBoolean(NULL, result);
}

XMLRPC_VALUE getNumInputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        return XMLRPC_CreateValueInt(NULL, getInputSize());
}

XMLRPC_VALUE getNumOutputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        return XMLRPC_CreateValueInt(NULL, getOutputSize());
}

XMLRPC_VALUE getInputName(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        char * string;
        short index;
        
        index = XMLRPC_GetValueInt(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));

        if (index>=0 && index<getInputSize())
        {
                getInputSignalNameByIndex(index,&string);
                return XMLRPC_CreateValueString(NULL,string,strlen(string));        
        }
        else
        {
                return XMLRPC_CreateValueString(NULL,"",strlen(""));        
        }
}

XMLRPC_VALUE getOutputName(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        char * string;
        short index;
        
        index = XMLRPC_GetValueInt(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));

        if (index>=0 && index<getInputSize())
        {
                getOutputSignalNameByIndex(index,&string);
                return XMLRPC_CreateValueString(NULL,string,strlen(string));        
        }
        else
        {
                return XMLRPC_CreateValueString(NULL,"",strlen(""));        
        }
}

XMLRPC_VALUE getAllInputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        XMLRPC_VALUE output;
        XMLRPC_VALUE xe_struct;
        short i;
        char * string;
        double dVal;
 
        output = XMLRPC_CreateVector(NULL, xmlrpc_vector_array);        

        for (i=0;i<getInputSize();i++)
        {
                xe_struct = XMLRPC_CreateVector(NULL, xmlrpc_vector_struct);

                getInputSignalNameByIndex(i,&string);
                XMLRPC_VectorAppendString(xe_struct, "SignalName", string, 0);
                getInputValueByIndex(i,&dVal);
                XMLRPC_VectorAppendDouble(xe_struct, "Value", dVal);

                XMLRPC_AddValueToVector(output, xe_struct);
        }

        return output;
}

XMLRPC_VALUE getAllOutputs(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) 
{
        XMLRPC_VALUE output;
        XMLRPC_VALUE xe_struct;
        short i;
        char * string;
        double dVal;
 
        output = XMLRPC_CreateVector(NULL, xmlrpc_vector_array);        

        for (i=0;i<getOutputSize();i++)
        {
                xe_struct = XMLRPC_CreateVector(NULL, xmlrpc_vector_struct);

                getOutputSignalNameByIndex(i,&string);
                XMLRPC_VectorAppendString(xe_struct, "SignalName", string, 0);
                getOutputValueByIndex(i,&dVal);
                XMLRPC_VectorAppendDouble(xe_struct, "Value", dVal);

                XMLRPC_AddValueToVector(output, xe_struct);
        }

        return output;
}

#ifdef TEST_HARNESS
XMLRPC_VALUE method_echo(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData)
{
        return XMLRPC_RequestGetData(request);
}

XMLRPC_VALUE method_TestStruct(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData)
{
        XMLRPC_VALUE output;
        XMLRPC_VALUE str;
        XMLRPC_VALUE xe_struct;
        const char *cardholder;

        output = XMLRPC_CreateVector(NULL, xmlrpc_vector_array);
        str = XMLRPC_VectorRewind(XMLRPC_RequestGetData(request));
        cardholder = XMLRPC_VectorGetStringWithID(str, "Cardholder");
        xe_struct = XMLRPC_CreateVector(NULL, xmlrpc_vector_struct);

        if(cardholder) {
                XMLRPC_VectorAppendString(xe_struct, "Cardholder", cardholder, 0);
        }

        XMLRPC_VectorAppendString(xe_struct, "Reason", "Whew!!!", 0);
        XMLRPC_VectorAppendString(xe_struct, "Rubadubdub", "Inmytub", 0);
        XMLRPC_AddValueToVector(output, xe_struct);

        return output;
}

XMLRPC_VALUE method_TestArray(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData)
{
        const char *string;
        char *testing[3] = {
                "One",
                "Two",
                "Three and four",
        };
        int i;
        XMLRPC_VALUE output;
        XMLRPC_VALUE xIter;
 
        output = XMLRPC_CreateVector(NULL, xmlrpc_vector_array);

        xIter = XMLRPC_VectorRewind(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)));
        while(xIter) {
                string = XMLRPC_GetValueString(xIter);

                if(string) {
                        XMLRPC_VectorAppendString(output, NULL, string, 0);
                }

                xIter = XMLRPC_VectorNext(XMLRPC_RequestGetData(request));
        }

        for(i = 0; i < 3; i++) {
                XMLRPC_VectorAppendString(output, NULL, testing[i], 0);
        }

        return output;
}

XMLRPC_VALUE method_TestBoolean(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        int iVal = 1;
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)), "boolean");

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_boolean) {
                iVal = XMLRPC_GetValueBoolean(xVal);
        }

        return XMLRPC_CreateValueBoolean(NULL, iVal);
}


XMLRPC_VALUE method_TestInt(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        int iVal = 25;
        XMLRPC_VALUE xParams = XMLRPC_RequestGetData(request);
        XMLRPC_VALUE xArg1Struct = XMLRPC_VectorRewind(xParams);
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(xArg1Struct, "int");

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_int) {
                iVal = XMLRPC_GetValueInt(xVal);
        }

        return XMLRPC_CreateValueInt(NULL, iVal);
}

XMLRPC_VALUE method_TestString(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        const char* pVal = "Hello World";
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)), "string");

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_string) {
                pVal = XMLRPC_GetValueString(xVal);
        }

        return XMLRPC_CreateValueString(NULL, pVal, 0);
}

XMLRPC_VALUE method_TestDouble(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        double dVal = 25;
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)), "double");

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_double) {
                dVal = XMLRPC_GetValueDouble(xVal);
        }

        return XMLRPC_CreateValueDouble(NULL, dVal);
}

XMLRPC_VALUE method_TestBase64(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        const char* pVal = "U29tZUJhc2U2NFN0cmluZw==";
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)), "base64");
        int buf_len = 0;

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_base64) {
                pVal = XMLRPC_GetValueBase64(xVal);
                buf_len = XMLRPC_GetValueStringLen(xVal);
        }

        return XMLRPC_CreateValueBase64(NULL, pVal, buf_len);
}

XMLRPC_VALUE method_TestDateTime(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData) {
        const char* pVal = "19980717T14:08:55";
        XMLRPC_VALUE xVal = XMLRPC_VectorGetValueWithID(XMLRPC_VectorRewind(XMLRPC_RequestGetData(request)), "datetime");

        if(xVal && XMLRPC_GetValueType(xVal) == xmlrpc_datetime) {
                pVal = XMLRPC_GetValueDateTime_ISO8601(xVal);
        }

        return XMLRPC_CreateValueDateTime_ISO8601(NULL, pVal);
}

XMLRPC_VALUE method_TestNormal(XMLRPC_SERVER server, XMLRPC_REQUEST request, void* userData)
{
        XMLRPC_VALUE output;

        output = XMLRPC_CreateVector(NULL, xmlrpc_vector_struct);

        XMLRPC_AddValuesToVector(output,
                           method_TestStruct(server, request, userData),
                           method_TestArray(server, request, userData),
                           method_TestBoolean(server, request, userData),
                           method_TestInt(server, request, userData),
                           method_TestString(server, request, userData),
                           method_TestDouble(server, request, userData),
                           method_TestDateTime(server, request, userData),
                           method_TestBase64(server, request, userData),
                           NULL);

        return output;
}

XMLRPC_VALUE method_TestFault(XMLRPC_SERVER server, XMLRPC_REQUEST input, void* userData)
{
        return XMLRPC_UtilityCreateFault(404, "Page Not Found");
}
#endif

#undef IS_XMLRPCAPI_C
