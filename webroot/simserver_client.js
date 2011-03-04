/*
		simserver_client.js

		SimServer "wrapper" functions
		Stubs to transparently access SimServer XML-RPC methods as js functions

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
 
 // requires: xmlrpc_lib.js and xmlrpc_wrappers.js
 
var simserver_client = new xmlrpc_client('/RPC2', 'localhost', 80);
simserver_client.path = '/RPC2';
simserver_client.server = 'localhost';
simserver_client.port = 80;
simserver_client.method = 'http';
simserver_client.username = '';
simserver_client.password = '';
simserver_client.no_multicall = false;
simserver_client.cookies = {};
simserver_client.keepalive = true;
simserver_client.accepted_charset_encodings = 'auto';
simserver_client.accepted_compression = 'auto';
simserver_client.polling_interval = 50;
simserver_client.polling_queue = [];
simserver_client.tid = 0;
simserver_client.return_type = 'xmlrpcvals';

function SimServer_getVal(SignalName)
{
    var msg = new xmlrpcmsg('getVal');
    msg.addParam(new xmlrpcval(SignalName, 'string'));
    
	getServerAddress();
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function SimServer_setVal(SignalName,Value)
{
    var msg = new xmlrpcmsg('setVal');
    msg.addParam(new xmlrpcval(SignalName, 'string'));
    msg.addParam(new xmlrpcval(Value, 'double'));
    
	getServerAddress();	
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function SimServer_getInputName(InputNum)
{
    var msg = new xmlrpcmsg('getInputName');
    msg.addParam(new xmlrpcval(InputNum, 'int'));
    
	getServerAddress();	
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function SimServer_getOutputName(OutputNum)
{
    var msg = new xmlrpcmsg('getOutputName');
    msg.addParam(new xmlrpcval(OutputNum, 'int'));
    
	getServerAddress();	
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function SimServer_getNumInputs()
{
    var msg = new xmlrpcmsg('getNumInputs');    
	
	getServerAddress();	
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function SimServer_getNumOutputs()
{
    var msg = new xmlrpcmsg('getNumOutputs');    
	
	getServerAddress();	
    var res = simserver_client.send(msg, 0, '');
    if (res.faultCode())
    {
        return res; 
    }
    else
    {
        return xmlrpc_decode(res.value());
    }
}

function getServerAddress()
{
	simserver_client.server = window.location.hostname;
	if (simserver_client.server == "")
	{
		simserver_client.server = "localhost";
	}
}
