// ### minified file: xmlrpc_lib.js ###

var xmlrpcI4='i4';var xmlrpcInt='int';var xmlrpcBoolean='boolean';var xmlrpcDouble='double';var xmlrpcString='string';var xmlrpcDateTime='dateTime.iso8601';var xmlrpcBase64='base64';var xmlrpcArray='array';var xmlrpcStruct='struct';var xmlrpcValue='undefined';var xmlrpcNull='null';var xmlrpcTypes={xmlrpcI4:4,xmlrpcInt:4,xmlrpcBoolean:6,xmlrpcString:1,xmlrpcDouble:5,xmlrpcDateTime:7,xmlrpcBase64:8,xmlrpcArray:2,xmlrpcStruct:3,xmlrpcNull:9}
var xmlrpcName='XML-RPC for JAVASCRIPT';var xmlrpcVersion='0.3';var xmlrpcerruser=800;var xmlrpcerrxml=100;var xmlrpcerr={invalid_return:2,http_error:5,no_data:6,no_curl:16,multicall_error:18,no_parser:19}
var xmlrpcstr={invalid_return:'Invalid return payload: enable debugging to examine incoming payload',http_error:'Didn\'t receive 200 OK from remote server.',no_data:'No data received from server.',no_curl:'no support for executing http requests compiled in',multicall_error:'Received from server invalid multicall response',no_parser:'no support for parsing xml compiled in'}
var _xh=null;var _msxml_progid=['MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];var _msxmldoc_progid=['MSXML2.DOMDOCUMENT.6.0','MSXML2.DOMDOCUMENT.3.0','MSXML2.DOMDOCUMENT.4.0','MSXML2.DOMDOCUMENT','Microsoft.XMLDOM'];function xmlrpc_client(path,server,port,method)
{this.path='';this.server='';this.port=0;this.method='http';this.debug=0;this.username='';this.password='';this.no_multicall=false;this.cookies={};this.return_type='xmlrpcvals';this.keepalive=true;this.accepted_charset_encodings='auto';this.accepted_compression='auto';this.polling_interval=50;this.polling_queue=[];this.tid=0;this.init(path,server,port,method);}
xmlrpc_client.prototype.init=function(path,server,port,method)
{if(method===undefined&&port===undefined&&server===undefined)
{if(path!==undefined&&path.search(/^https?:\/\/[^\/:]/)!=-1)
{var matches=path.match(/(https?):\/\/([^\/:]+)(:\d+)?(.+)?/);method=matches[1];server=matches[2];port=matches[3]==undefined?matches[3]:matches[3].substr(1);path=matches[4]!==undefined?matches[4]:'';}
else
{if(path===undefined)
{path=window.location.pathname+window.location.search;}
server=window.location.hostname;port=window.location.port;method=window.location.protocol=='https:'?'https':'http';}}
if(path==''||path.substr(0,1)!='/')
{this.path='/'+path;}
else
{this.path=path;}
this.server=server;if(port!=undefined&&port!='')
{this.port=port;}
if(method!=undefined)
{this.method=method;}}
xmlrpc_client.prototype.setDebug=function(dbg)
{this.debug=dbg;}
xmlrpc_client.prototype.setAcceptedCompression=function(compmethod)
{if(compmethod=='auto')
this.accepted_compression=compmethod;else if(compmethod=='any')
this.accepted_compression=['gzip','deflate'];else
this.accepted_compression=array[compmethod];}
xmlrpc_client.prototype.setCredentials=function(username,password,authtype)
{this.username=username;this.password=password;}
xmlrpc_client.prototype.send=function(msg,timeout,method)
{var async=false;if(method===undefined||method===''){method=this.method;}
else if(typeof(method)=='function')
{async=method;method=this.method;}
if(this.port==0)
{if(window.location.port=='')
{var port='';}
else
{var port=':80';}}
else
{var port=':'+this.port;}
if(typeof(msg)=='object'&&msg instanceof Array){return this.multiCall(msg,timeout,method);}else if(typeof(msg)=='string'){var n=new xmlrpcmsg('');n.payload=msg;msg=n;}
msg.debug=this.debug;var httpconn=null;try{httpconn=new XMLHttpRequest();}
catch(e)
{for(var i=0;i<_msxml_progid.length;++i){try{httpconn=new ActiveXObject(_msxml_progid[i]);break;}
catch(e){}}}
if(httpconn===null)
{var resp=new xmlrpcresp(0,xmlrpcerr['no_curl'],xmlrpcstr['no_curl']);if(async)
{async(resp);return false;}
return resp;}
if(msg.payload=='')
{msg.createPayload();}
var payload=msg.payload;var encoding_hdr='';if(this.debug>1)
{xmlrpc_debug_log('<PRE>\n---SENDING---\n'+htmlentities(payload)+'\n---END---\n</PRE>');}
try
{if(this.username!='')
{httpconn.open('POST',method+'://'+this.server+port+this.path,Boolean(async),this.username,this.password);}
else
{httpconn.open('POST',method+'://'+this.server+port+this.path,Boolean(async));}}
catch(e)
{httpconn=null;var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' (open failed)');if(async)
{async(resp);return false;}
return resp;}
try
{if(this.accepted_compression!='auto')
{httpconn.setRequestHeader('Accept-Encoding',this.accepted_compression.join(','));}
httpconn.setRequestHeader('User-Agent',xmlrpcName+' '+xmlrpcVersion);httpconn.setRequestHeader('Content-type',msg.content_type);if(!this.keepalive)
{httpconn.setRequestHeader('Connection','close');httpconn.setRequestHeader('Keep-Alive','');}
httpconn.setRequestHeader('Accept',msg.content_type);if(this.accepted_charset_encodings!='auto')
{httpconn.setRequestHeader('Accept-Charset',this.accepted_charset_encodings.join(','));}
httpconn.setRequestHeader('Content-length',payload.length);}
catch(e)
{}
if(async)
{if(timeout>0)
{var client=this;var tid=this.tid;this.polling_queue[this.tid]=[];this.polling_queue[this.tid][0]=window.setTimeout(function(){window.clearInterval(client.polling_queue[tid][1]);delete client.polling_queue[tid][1];delete client.polling_queue[tid][0];client.handleTransaction(msg,httpconn,async,true);},timeout*1000);this.polling_queue[this.tid][1]=window.setInterval(function(){if(httpconn.readyState==4)
{window.clearInterval(client.polling_queue[tid][1]);window.clearTimeout(client.polling_queue[tid][0]);delete client.polling_queue[tid][1];delete client.polling_queue[tid][0];client.handleTransaction(msg,httpconn,async,false);}},this.polling_interval);++this.tid;}
else
{var client=this;httpconn.onreadystatechange=function(){if(httpconn.readyState==4)
{if(httpconn.status!=200)
{var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' ( HTTP '+httpconn.status+' '+httpconn.statusText+')');}
else
{var resp=msg.parseResponse(httpconn.responseText,httpconn.getAllResponseHeaders(),client.return_type);}
httpconn=null;async(resp);}}}}
try
{httpconn.send(payload);}
catch(e)
{httpconn=null;var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' (send failed)');if(async)
{async(resp);return false;}
return resp;}
if(!async)
{if(httpconn.status!=200)
{var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' ( HTTP '+httpconn.status+' '+httpconn.statusText+')');}
else
{var resp=msg.parseResponse(httpconn.responseText,httpconn.getAllResponseHeaders(),this.return_type);}
httpconn=null;return resp;}}
xmlrpc_client.prototype.handleTransaction=function(msg,httpconn,callback,is_timeout)
{if(is_timeout)
{httpconn.abort();var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' (send timeout)');}
else
{if(httpconn.status!=200)
{var resp=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' ( HTTP '+httpconn.status+' '+httpconn.statusText+')');}
else
{var resp=msg.parseResponse(httpconn.responseText,httpconn.getAllResponseHeaders(),this.return_type);}}
callback(resp);}
xmlrpc_client.prototype.multiCall=function(messages,timeout,method,fallback)
{if(fallback==undefined)
{fallback=true;}
if(method==undefined)
{method=this.method;}
if(!this.no_multicall)
{var results=this._try_multicall(messages,timeout,method);if(results instanceof Array)
{return results;}
else
{if(fallback)
{this.no_multicall=true;}
else
{if(results instanceof xmlrpcresp)
{var result=results;}
else
{var result=new xmlrpcresp(0,xmlrpcerr['multicall_error'],xmlrpcstr['multicall_error']);}}}}
else
{fallback=true;var results;}
results=array();if(fallback)
{for(var i=0;i<messages.length;++i)
{results[results.length]=this.send(messages[i],timeout,method);}}
else
{for(var i=0;i<messages.length;++i)
{results[results.length]=result;}}
return results;}
xmlrpc_client.prototype._try_multicall=function(msgs,timeout,method)
{var calls=[];var call={}
var numParams;var msg;var params;for(var i=0;i<msgs.length;++i)
{msg=msgs[i];call['methodName']=new xmlrpcval(msgs.method(),'string');numParams=msg.getNumParams();params=[];for(var j=0;j<numParams;++j)
{params[j]=msg.getParam(j);}
call['params']=new xmlrpcval(params,'array');calls[i]=new xmlrpcval(call,'struct');}
var multicall=new xmlrpcmsg('system.multicall');multicall.addParam(new xmlrpcval(calls,'array'));var result=this.send(multicall,timeout,method);if(result.faultCode()!=0)
{return result;}
var rets=result.value();if(this.return_type=='xml')
{return rets;}
else if(this.return_type=='jsvals')
{rets=result.value();if(!rets instanceof Array)
{return false;}
var numRets=rets.length;if(numRets!=msgs.length)
{return false;}
var response=[];var val;for(i=0;i<numRets;++i)
{val=rets[i];switch(val.length)
{case 1:if(val[0]===undefined)
{return false;}
response[i]=new xmlrpcresp(val[0],0,'','jsvals');break;case 2:try
{var code=val['faultCode'];if(typeof(code)!='number')
{return false;}
var str=val['faultString'];if(typeof(str)!='string')
{return false;}
response[i]=new xmlrpcresp(0,code,str);}
catch(e)
{return false;}
break;default:return false;}}
return response;}
else
{rets=result.value();if(rets.kindOf()!='array')
{return false;}
var numRets=rets.arraysize();if(numRets!=msgs.length)
{return false;}
var response=[];var val;for(i=0;i<numRets;++i)
{val=rets.arraymem(i);switch(val.kindOf())
{case'array':if(val.arraySize()!=1)
{return false;}
response[i]=new xmlrpcresp(val.arrayMem(0));break;case'struct':var code=val.structmem('faultCode');if(code.kindOf()!='scalar'||code.scalarTyp()!='int')
{return false;}
var str=val.structmem('faultString');if(str.kindOf()!='scalar'||str.scalarTyp()!='string')
{return false;}
response[i]=new xmlrpcresp(0,code.scalarVal(),str.scalarVal());break;default:return false;}}
return response;}}
function xmlrpcval(val,type)
{this.me=null;this.mytype=0;this._js_class='';this.init(val,type);}
xmlrpcval.prototype.init=function(val,type){if(val!==undefined)
{this.me=val;switch(type)
{case'string':case undefined:case'':this.mytype=1;break;case'i4':case'int':this.mytype=4;break;case'double':this.mytype=5;break;case'boolean':this.mytype=6;break;case'dateTime.iso8601':this.mytype=7;break;case'base64':this.mytype=8;break;case'null':this.mytype=9;break;case'array':this.mytype=2;break;case'struct':this.mytype=3;this.myidx=0;break;default:xmlrpc_error_log('XML-RPC: xmlrpcval::xmlrpcval: not a known type ('+type+')');}}}
xmlrpcval.prototype.addScalar=function(val,type){if(type===undefined)
type='string';if(xmlrpcTypes[type]===undefined)
{xmlrpc_error_log('XML-RPC: xmlrpcval::addScalar: not a scalar type ('+type+')');return 0;}
switch(this.mytype)
{case 0:this.me=val;this.mytype=xmlrpcTypes[type];return 1;case 2:this.me[this.me.lenght]=new xmlrpcval(val,type);return 1;case 3:xmlrpc_error_log('XML-RPC: xmlrpcval::addScalar: cannot add anonymous scalar to struct xmlrpcval');return 0;default:xmlrpc_error_log('XML-RPC: xmlrpcval::addScalar: scalar xmlrpcval can have only one value');return 0;}}
xmlrpcval.prototype.addArray=function(vals){if(this.mytype==0){this.mytype=2;this.me=vals;return 1;}
else if(this.mytype==2)
{for(var i=0;i<vals.length;i++)
this.me[this.me.length]=vals[i];return 1;}
else
{return 0;}}
xmlrpcval.prototype.addStruct=function(vals){if(this.mytype==0)
{this.mytype=3;this.me=vals;this.myidx=0;return 1;}
else if(this.mytype==3)
{for(var i in vals)
this.me[i]=vals[i];return 1;}
else
{return 0;}}
xmlrpcval.prototype.kindOf=function(){switch(this.mytype)
{case 3:return'struct';case 2:return'array';case 0:return'undef';default:return'scalar';}}
xmlrpcval.prototype.serialize=function(charset_encoding)
{switch(this.mytype)
{case 1:var result='<string>'+xmlrpc_encode_entities(this.me)+'</string>';break;case 4:if(isFinite(this.me)&&this.me!==null)
{var result='<int>'+this.me.toFixed()+'</int>';}
else
{var result='<int>0</int>';}
break;case 5:if(isFinite(this.me)&&this.me!==null)
{var result='<double>'+this.me.toString()+'</double>';}
else
{var result='<double>0</double>';}
break;case 6:if(this.me)
var result='<boolean>1</boolean>';else
var result='<boolean>0</boolean>';break;case 7:result='<dateTime.iso8601>'+this.me+'</dateTime.iso8601>';break;case 8:var result='<base64>'+base64_encode(this.me)+'</base64>';break;case 9:var result='<nil/>';break;case 2:var result='<array>\n<data>\n';for(var i=0;i<this.me.length;i++)
{result=result+this.me[i].serialize(charset_encoding);}
result=result+'</data>\n</array>';break;case 3:var result='<struct>\n';for(var attr in this.me)
{result=result+'<member><name>'+xmlrpc_encode_entities(attr)+'</name>\n'+this.me[attr].serialize(charset_encoding)+'</member>\n';}
result=result+'</struct>';break;default:var result='';}
return'<value>'+result+'</value>\n';}
xmlrpcval.prototype.structMemExists=function(m){for(var attr in this.me)
if(attr==m)
return true;return false;}
xmlrpcval.prototype.structMem=function(m){return this.me[m];}
xmlrpcval.prototype.structReset=function(){this.myidx=0;}
xmlrpcval.prototype.structEach=function(){++this.myidx;var i=0;for(var attr in this.me){++i;if(i==this.myidx){return{0:attr,1:this.me[attr],key:attr,value:this.me[attr]}}}
return false;}
xmlrpcval.prototype.scalarVal=function(){return this.me;}
xmlrpcval.prototype.scalarTyp=function(){switch(this.mytype)
{case 3:return'struct';case 2:return'array';case 1:return'string';case 4:return'int';case 5:return'double';case 6:return'boolean';case 7:return'dateTime.iso8601';case 8:return'base64';case 9:return'null';case 0:return'undef';default:return'undef: '+this.mytype;}}
xmlrpcval.prototype.arrayMem=function(m){return this.me[m];}
xmlrpcval.prototype.arraySize=function(){return this.me.length;}
xmlrpcval.prototype.structSize=function(){var i=0;for(var attr in this.me)
++i;return i;}
xmlrpcval.prototype.toXmlRpcVal=function(){return this;}
function xmlrpcmsg(meth,pars){this.methodname='';this.params=[];this.payload='';this.debug=0;this.content_type='text/xml';this.init(meth,pars);}
xmlrpcmsg.prototype.init=function(meth,pars){this.methodname=meth;if(pars!=undefined)
{for(var i=0;i<pars.length;++i)
{this.addParam(pars[i]);}}}
xmlrpcmsg.prototype.kindOf=function(){return'msg';}
xmlrpcmsg.prototype.xml_header=function(charset_encoding){if(charset_encoding!=undefined&&charset_encoding!='')
{return'<?xml version="1.0" encoding="'+charset_encoding+'" ?'+'>\n<methodCall>\n';}
else
{return'<?xml version="1.0"?'+'>\n<methodCall>\n';}}
xmlrpcmsg.prototype.xml_footer=function(){return'</methodCall>';}
xmlrpcmsg.prototype.createPayload=function(charset_encoding){if(charset_encoding!=undefined&&charset_encoding!='')
this.content_type='text/xml; charset='+charset_encoding;else
this.content_type='text/xml';this.payload=this.xml_header(charset_encoding);this.payload=this.payload+'<methodName>'+xmlrpc_encode_entities(this.methodname)+'</methodName>\n';this.payload=this.payload+'<params>\n';for(var i=0;i<this.params.length;i++)
{this.payload=this.payload+'<param>\n'+this.params[i].serialize(charset_encoding)+'</param>\n';}
this.payload=this.payload+'</params>\n';this.payload=this.payload+this.xml_footer();}
xmlrpcmsg.prototype.method=function(meth)
{if(meth!=undefined&&meth!='')
{this.methodname=meth;}
return this.methodname;}
xmlrpcmsg.prototype.serialize=function(charset_encoding)
{this.createPayload(charset_encoding);return this.payload;}
xmlrpcmsg.prototype.addParam=function(par){if(typeof(par)=='object')
{this.params[this.params.length]=par;return true;}
else
{return false;}}
xmlrpcmsg.prototype.getParam=function(i){return this.params[i];}
xmlrpcmsg.prototype.getNumParams=function(){return this.params.length;}
xmlrpcmsg.prototype.parseResponseHeaders=function(data,headers_processed){if(headers_processed===undefined)
{headers_processed=false;}
var pos,bd;if(data.search(/^HTTP\/1\.[0-1] 200 Connection established/)!=-1)
{pos=data.indexOf('\r\n\r\n');if(pos!=-1)
{bd=pos+4;}
else
{pos=data.indexOf('\n\n');if(pos!=-1)
{bd=pos+2;}
else
{bd=0;}}
if(bd)
{data=data.slice(bd);}
else
{xmlrpc_error_log('XML-RPC: xmlrpcmsg::parseResponse: HTTPS via proxy error, tunnel connection possibly failed');var r=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' (HTTPS via proxy error, tunnel connection possibly failed)');return r;}}
while(data.search(/^HTTP\/1\.1 1[0-9]{2} /)!=-1)
{pos=data.indexOf('HTTP',12);if(pos==-1)
{break;}
data=data.substr(pos);}
var ar=data.match(/^HTTP\/[0-9.]+ ([0-9]{3}) /);if(ar!=null&&ar[0]!='200')
{var errstr=(data.indexOf('\n')!=-1)?data.substring(0,data.indexOf('\n')-1):data;xmlrpc_error_log('XML-RPC: xmlrpcmsg::parseResponse: HTTP error, got response: '+errstr);var r=new xmlrpcresp(0,xmlrpcerr['http_error'],xmlrpcstr['http_error']+' ('+errstr+')');return r;}
_xh['headers']={};_xh['cookies']={};pos=data.indexOf('\r\n\r\n');if(pos!=-1)
{bd=pos+4;}
else
{pos=data.indexOf('\n\n');if(pos!=-1)
{bd=pos+2;}
else
{bd=0;pos=data.length;}}
ar=data.substring(0,pos).replace(/^\s/,'').replace(/\s$/,'').split(/\r?\n/);var line,arr;for(var i=0;i<ar.length;++i)
{line=ar[i];arr=line.split(':');if(arr.length>1)
{for(var j=2;j<arr.length;++j)
arr[1]+=':'+arr[j];var header_name=arr[0].replace(/^\s/,'').replace(/\s$/,'').toLowerCase();if(header_name=='set-cookie'||header_name=='set-cookie2')
{if(header_name=='set-cookie2')
{var cookies=arr[1].split(',');}
else
{var cookies=[arr[1]];}
for(j=0;j<cookies.length;++j)
{var cookie=cookies[j];if(_xh['headers'][header_name]!==undef)
_xh['headers'][header_name]+=', '+cookie.replace(/^\s/,'').replace(/\s$/,'');else
_xh['headers'][header_name]=cookie.replace(/^\s/,'').replace(/\s$/,'');cookie=cookie.split(';');for(var k=0;k<cookie.length;++k)
{var val=cookie[k].split('=');if(val.length==1)
val[1]='';else if(val.length>1)
{for(var l=2;l<val.length;++l)
val[1]+='='+val[l];}
var tag=val[0].replace(/^\s/,'').replace(/\s$/,'');val=val[1].replace(/^\s/,'').replace(/\s$/,'');if(k==0)
{var cookiename=tag;_xh['cookies'][tag]=[];_xh['cookies'][cookiename]['value']=decodeURIComponent(val);}
else
{_xh['cookies'][cookiename][tag]=val;}}}}
else
{_xh['headers'][header_name]=arr[1].replace(/^\s/,'').replace(/\s$/,'');}}
else if(header_name!==undefined)
{_xh['headers'][header_name]+=' '+line.replace(/^\s/,'').replace(/\s$/,'');}}
data=data.slice(0,bd);if(this.debug)
{xmlrpc_debug_log('<PRE>');for(i in _xh['headers'])
{xmlrpc_debug_log(htmlentities('HEADER: '+i+': '+_xh['headers'][i]));}
for(i in _xh['cookies'])
{xmlrpc_debug_log(htmlentities('COOKIE: '+i+'='+_xh['cookies'][i]));}
xmlrpc_debug_log('</PRE>');}
if(!headers_processed)
{}
return data;}
xmlrpcmsg.prototype.parseResponse=function(data,headers_processed,return_type){var headers='';if(headers_processed===undefined)
{headers_processed=false;}
else if(typeof(headers_processed)=='string')
{headers=headers_processed;headers_processed=true;}
if(return_type===undefined)
{return_type='xmlrpcvals';}
if(this.debug)
{xmlrpc_debug_log('<PRE>---GOT---\n'+htmlentities(data)+'\n---END---\n</PRE>');}
if(data=='')
{xmlrpc_error_log('XML-RPC: xmlrpcmsg::parseResponse: no response received from server.');var r=new xmlrpcresp(0,xmlrpcerr['no_data'],xmlrpcstr['no_data']);return r;}
_xh={headers:[],cookies:{}};var raw_data=data;if(headers!='')
{var r=this.parseResponseHeaders(headers,true);}
else if(data.slice(0,4)=='HTTP')
{var r=this.ParseResponseHeaders(data,headers_processed);if(typeof(r)!=='string')
{r.raw_data=data;return r;}
else
{data=r;}}
if(this.debug)
{var start=data.indexOf('<!-- SERVER DEBUG INFO (BASE64 ENCODED):');if(start!=-1)
{start+=41;var end=data.indexOf('-->',start);var comments=data.slice(start,end-1);xmlrpc_debug_log('<PRE>---SERVER DEBUG INFO (DECODED)---\n\t'+htmlentities(base64_decode(comments).replace(/\n/g,'\n\t'))+'\n---END---\n</PRE>');}}
data=data.replace(/^\s/,'').replace(/\s$/,'');var pos=data.lastIndexOf('</methodResponse>');if(pos>=0)
{data=data.slice(0,pos+17);}
if(return_type=='xml')
{var r=new xmlrpcresp(data,0,'','xml');r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}
var obj=null;var isMoz=false;var isIE=false;var isASV=false;try
{obj=window.parseXML;if(obj==null)
{throw'No ASV paseXML';}
isASV=true;}
catch(e)
{try
{obj=new DOMParser();isMoz=true;}
catch(e)
{for(var i=0;i<_msxmldoc_progid.length;++i)
{try
{obj=new ActiveXObject(_msxmldoc_progid[i]);isIE=true;break;}
catch(e){}}}}
if(!isIE&&!isMoz&&!isASV)
{var r=new xmlrpcresp(0,xmlrpcerr['no_parser'],xmlrpcstr['no_parser']);r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}
try
{if(isMoz)
{obj=obj.parseFromString(data,'text/xml');}
else if(isIE)
{obj.loadXML(data);}
else if(isASV)
{obj=window.parseXML(data,null);}}
catch(e)
{xmlrpc_error_log('XML Error');if(this.debug)
{xmlrpc_debug_log('XML Error');}
var r=new xmlrpcresp(0,xmlrpcerr['invalid_return'],xmlrpcstr['invalid_return']);r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}
try
{var node=obj.documentElement;if(node==null)
{throw'No documentElement found.';}
switch(node.tagName)
{case'methodResponse':node=getSingleChild(node,['params','fault']);if(node.tagName=='fault')
{node=getSingleChild(node,['value']);var value=parseXmlrpcValue(node,true);if(typeof(value)!='object'||!value.hasOwnProperty('faultCode')||!value.hasOwnProperty('faultString'))
{var r=new xmlrpcresp(0,xmlrpcerr['invalid_return'],xmlrpcstr['invalid_return']+' (malformed fault response)');}
else
{if(value['faultCode']==0)
{value['faultCode']=-1;}
var r=new xmlrpcresp(0,value['faultCode'],value['faultString']);}}
else
{node=getSingleChild(node,['param']);node=getSingleChild(node,['value']);var value=parseXmlrpcValue(node,return_type=='jsval');var r=new xmlrpcresp(value,0,'',return_type);}
if(this.debug)
{xmlrpc_debug_log('<PRE>---PARSED---');xmlrpc_debug_log(htmlentities(var_export(value)));xmlrpc_debug_log('\n---END---</PRE>');}
r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;default:throw'missing top level xmlrpc element';}}
catch(e)
{if(this.debug)
{}
var r=new xmlrpcresp(0,xmlrpcerr['invalid_return'],xmlrpcstr['invalid_return']+' ('+e.toString()+')');r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}}
function xmlrpcresp(val,fcode,fstr,valtyp){this.val=0;this.valtyp='';this.errno=0;this.errstr='';this.payload='';this.hdrs=[];this._cookies={};this.raw_data='';this.init(val,fcode,fstr,valtyp);}
xmlrpcresp.prototype.init=function(val,fcode,fstr,valtyp){if(fcode!=undefined&&fcode!=0)
{this.errno=fcode;this.errstr=fstr;}
else
{this.val=val;if(valtyp==undefined)
{if(typeof(val)=='object')
{this.valtyp='xmlrpcvals';}
else if(typeof(val)=='string')
{this.valtyp='xml';}
else
{this.valtyp='jsvals';}}
else
{this.valtyp=valtyp;}}}
xmlrpcresp.prototype.faultCode=function(){return this.errno;}
xmlrpcresp.prototype.faultString=function(){return this.errstr;}
xmlrpcresp.prototype.value=function(){return this.val;}
xmlrpcresp.prototype.cookies=function(){return this._cookies;}
xmlrpcresp.prototype.xml_header=function(charset_encoding){if(charset_encoding!=undefined&&charset_encoding!='')
{return'<?xml version="1.0" encoding="'+charset_encoding+'" ?'+'>\n<methodResponse>\n';}
else
{return'<?xml version="1.0"?'+'>\n<methodResponse>\n';}}
xmlrpcresp.prototype.serialize=function(charset_encoding){result=this.xml_header(charset_encoding);if(this.errno)
{result+='<fault>\n'+'<value>\n<struct><member><name>faultCode</name>\n<value><int>'+this.errno+'</int></value>\n</member>\n<member>\n<name>faultString</name>\n<value><string>'+
xmlrpc_encode_entities(this.errstr)+'</string></value>\n</member>\n'+'</struct>\n</value>\n</fault>';}
else
{if(typeof(this.val)!='object')
{if(typeof(this.val)=='string'&&this.valtyp=='xml')
{result+='<params>\n<param>\n'+
this.val+'</param>\n</params>';}
else
{}}
else
{result+='<params>\n<param>\n'+
this.val.serialize(charset_encoding)+'</param>\n</params>';}}
result+='\n</methodResponse>';this.payload=result;return result;}
function xmlrpc_decode(xmlrpc_val,options){switch(xmlrpc_val.kindOf())
{case'scalar':return xmlrpc_val.scalarVal();case'array':var size=xmlrpc_val.arraySize();var arr=[];for(var i=0;i<size;++i)
{arr[arr.length]=xmlrpc_decode(xmlrpc_val.arrayMem(i),options);}
return arr;case'struct':if((options!=undefined&&options['decode_js_objs'])&&xmlrpc_val._js_class!='')
{var obj=new xmlrpc_val._js_class;}
else
{var obj={};}
for(var key in xmlrpcval.me)
{obj[key]=xmlrpc_decode(xmlrpc_val.me[key],options);}
return obj;case'msg':var paramcount=xmlrpc_val.getNumParams();var arr=[];for(var i=0;i<paramcount;++i)
{arr[arr.lenght]=xmlrpc_decode(xmlrpc_val.getParam(i));}
return arr;}}
function xmlrpc_encode(js_val,options){var type=typeof js_val;switch(type)
{case'string':if((options!=undefined&&options['auto_dates'])&&js_val.search(/^[0-9]{8}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/)!=-1)
var xmlrpc_val=new xmlrpcval(js_val,'dateTime.iso8601');else
var xmlrpc_val=new xmlrpcval(js_val,'string');break;case'number':var num=new Number(js_val);if(num==parseInt(num))
{var xmlrpc_val=new xmlrpcval(js_val,'int');}
else
{var xmlrpc_val=new xmlrpcval(js_val,'double');}
break;case'boolean':var xmlrpc_val=new xmlrpcval(js_val,'boolean');break;case'object':if(js_val===null)
{if(options!=undefined&&options['null_extension'])
{var xmlrpc_val=new xmlrpcval(null,'null');}
else
{var xmlrpc_val=new xmlrpcval();}}
else
if(js_val.toXmlRpcVal)
{var xmlrpc_val=js_val.toXmlRpcVal();}
else
if(js_val instanceof Array)
{var arr=[];for(var i=0;i<js_val.length;++i)
{arr[arr.length]=xmlrpc_encode(js_val[i],options);}
var xmlrpc_val=new xmlrpcval(arr,'array');}
else
{var arr={};for(var attr in js_val)
{if(typeof js_val[attr]!='function')
{arr[attr]=xmlrpc_encode(js_val[attr],options);}}
var xmlrpc_val=new xmlrpcval(arr,'struct');}
break;default:var xmlrpc_val=new xmlrpcval();break;}
return xmlrpc_val;}
function xmlrpc_decode_xml(xml_val,options){}
function base64_decode(aString){if((aString.length%4)==0)
{if(typeof atob=='function')
{return atob(aString);}
else
{if(aString=='')
return'';var nBits;var sDecoded=[aString.length/4];var base64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';for(var i=0;i<aString.length;i+=4)
{nBits=(base64.indexOf(aString.charAt(i))&0xff)<<18|(base64.indexOf(aString.charAt(i+1))&0xff)<<12|(base64.indexOf(aString.charAt(i+2))&0xff)<<6|base64.indexOf(aString.charAt(i+3))&0xff;sDecoded[i]=String.fromCharCode((nBits&0xff0000)>>16,(nBits&0xff00)>>8,nBits&0xff);}
sDecoded[sDecoded.length-1]=sDecoded[sDecoded.length-1].substring(0,3-((aString.charCodeAt(i-2)==61)?2:(aString.charCodeAt(i-1)==61?1:0)));return sDecoded.join('');}}
else
{return null;}}
function base64_encode(aString){if(typeof btoa=='function')
{return btoa(aString);}
else
{var base64=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'];var sbin;var pad=0;var s=''+aString;if((s.length%3)==1)
{s+=String.fromCharCode(0);s+=String.fromCharCode(0);pad=2;}
else if((s.length%3)==2)
{s+=String.fromCharCode(0);pad=1;}
var rslt=[s.length/3];var ri=0;for(var i=0;i<s.length;i+=3)
{sbin=((s.charCodeAt(i)&0xff)<<16)|((s.charCodeAt(i+1)&0xff)<<8)|(s.charCodeAt(i+2)&0xff);rslt[ri]=(base64[(sbin>>18)&0x3f]+base64[(sbin>>12)&0x3f]+base64[(sbin>>6)&0x3f]+base64[sbin&0x3f]);ri++;}
if(pad>0)
{rslt[rslt.length-1]=rslt[rslt.length-1].substr(0,4-pad)+((pad==2)?'==':(pad==1)?'=':'');}
return rslt.join('');}}
function iso8601_encode(time,utc){var padd=function(s,p)
{s=p+s;return s.substring(s.length-p.length);}
if(utc)
{var y=padd(time.getUTCFullYear(),"0000");var m=padd(time.getUTCMonth()+1,"00");var d=padd(time.getUTCDate(),"00");var h=padd(time.getUTCHours(),"00");var min=padd(time.getUTCMinutes(),"00");var s=padd(time.getUTCSeconds(),"00");}
else
{var y=padd(time.getFullYear(),"0000");var m=padd(time.getMonth()+1,"00");var d=padd(time.getDate(),"00");var h=padd(time.getHours(),"00");var min=padd(time.getMinutes(),"00");var sec=padd(time.getSeconds(),"00");}
return y+m+d+"T"+h+":"+min+":"+sec;}
function iso8601_decode(time,utc){if(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.test(time))
{if(utc)
return new Date(Date.UTC(RegExp.$1,RegExp.$2-1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6));else
return new Date(RegExp.$1,RegExp.$2-1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6);}
else
return null;}
function xmlrpc_encode_entities(data,src_encoding,dest_encoding)
{return new String(data).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
String.prototype.toXmlRpcVal=function(options){return new xmlrpcval(this.toString());}
Number.prototype.toXmlRpcVal=function(options){if(this==parseInt(this))
{return new xmlrpcval(this.valueOf(),'int');}
else
{return new xmlrpcval(this.valueOf(),'double');}}
Boolean.prototype.toXmlRpcVal=function(options){return new xmlrpcval(this.valueOf(),'boolean');}
Date.prototype.toXmlRpcVal=function(options){return new xmlrpcval(iso8601_encode(this),'dateTime.iso8601');}
function getSingleChild(node,expectedType)
{var k;var ret=null;var child;for(var i=0,j=0;i<node.childNodes.length;i++)
{child=node.childNodes.item(i);if(child.nodeType==1)
{for(k=0;k<expectedType.length;k++)
{if(child.tagName==expectedType[k])
{ret=child;break;}}
if(ret===null)
{throw'Found incorrect element inside '+node.tagName+': '+child.tagName;}
if(++j>1)
{throw'Found too many elements inside '+node.tagName;}}}
if(j==0)
{throw'Found no element inside '+node.tagName;}
return ret;}
function getChildText(node)
{var ret='';for(var i=0;i<node.childNodes.length;i++)
{child=node.childNodes.item(i);if(child.nodeType==3)
{ret+=String(child.nodeValue)}
else if(child.nodeType==1)
{throw'elements found inside a '+node.tagName;}}
return ret;}
function parseXmlrpcValue(node,return_jsvals)
{if(return_jsvals===undefined)
{return_jsvals=false;}
var s='';var ret=null;var child;var valtyp;for(var i=0,j=0;i<node.childNodes.length;i++)
{child=node.childNodes.item(i);if(child.nodeType==1)
{valtyp=child.tagName;switch(child.tagName)
{case'string':ret=getChildText(child);break;case'int':case'i4':ret=getChildText(child);if(ret.search(/^[+-]?[0123456789 \t]+$/)==-1)
{xmlrpc_error_log('XML-RPC: non numeric value received in INT: '+ret);ret='ERROR_NON_NUMERIC_FOUND';}
else
{ret=parseInt(ret);}
break;case'double':ret=getChildText(child);if(ret.search(/^[+-]?[eE0123456789 \t.]+$/)==-1)
{xmlrpc_error_log('XML-RPC: non numeric value received in DOUBLE: '+ret);ret='ERROR_NON_NUMERIC_FOUND';}
else
{ret=parseFloat(ret);}
break;case'boolean':ret=getChildText(child);if(ret=='1'||ret.search(/^true$/i)!=-1)
{ret=true;}
else
{if(ret!='0'&&ret.search(/^false$/i)==-1)
xmlrpc_error_log('XML-RPC: invalid value received in BOOLEAN: '+ret);ret=false;}
break;case'base64':ret=base64_decode(getChildText(child));break;case'dateTime.iso8601':ret=getChildText(child);if(ret.search(/^[0-9]{8}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/)==-1)
{xmlrpc_error_log('XML-RPC: invalid value received in DATETIME: '+ret);}
break;case'array':child=getSingleChild(child,['data']);ret=[];for(var k=0;k<child.childNodes.length;k++)
{if(child.childNodes[k].nodeType==1)
{if(child.childNodes[k].tagName!='value')
{throw'invalid element found inside array: '+child.childNodes[k].tagName;}
ret[ret.length]=parseXmlrpcValue(child.childNodes[k],return_jsvals);}}
break;case'struct':ret={};var membername,member,memberval;for(var k=0;k<child.childNodes.length;++k)
{if(child.childNodes[k].nodeType==1)
{if(child.childNodes[k].tagName!='member')
{throw'invalid element found inside struct: '+child.childNodes[k].tagName;}
member=child.childNodes[k];membername='';memberval=undefined;for(var l=0;l<member.childNodes.length;++l)
{if(member.childNodes[l].nodeType==1)
{switch(member.childNodes[l].tagName)
{case'name':membername=getChildText(member.childNodes[l]);break;case'value':memberval=parseXmlrpcValue(member.childNodes[l],return_jsvals);break;default:throw'invalid element found inside struct: '+member.childNodes[l].tagName;}}}
if(memberval===undefined)
throw'invalid member found inside struct: missing value';ret[membername]=memberval;}}
break;default:throw'Found incorrect element inside \'value\' :'+child.tagName;}
if(++j>1)
{throw'Found too many elements inside '+node.tagName;}}
else if(child.nodeType==3)
{s+=new String(child.nodeValue);}}
if(j==0)
{if(!return_jsvals)
{return new xmlrpcval(s);}
else
{return s;}}
else
{if(!return_jsvals)
{return new xmlrpcval(ret,valtyp);}
else
{return ret;}}}
function xmlrpc_error_log(errormsg){if(typeof(xmlrpc_error_log_handler)!='function')
{if(window.console&&typeof window.console.error=='function')
window.console.error(logmsg);else
window.setTimeout(function(){throw new Error(errormsg);},0);}
else
{xmlrpc_error_log_handler(errormsg);}}
function xmlrpc_debug_log(logmsg){if(typeof(xmlrpc_debug_log_handler)!='function')
{if(window.console&&typeof window.console.debug=='function')
window.console.debug(logmsg);else
{var el=document.createElement('pre');el.innerHTML=logmsg;document.body.appendChild(el);}}
else
{xmlrpc_debug_log_handler(logmsg);}}
function htmlentities(val,quote_style){var out=new String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');if(quote_style!=0)
out=out.replace(/"/g,'&quot;').replace(/'/g,'&apos;');return out;}
function var_export(val,ret,whitespaces){var type=typeof val;var indent='';if(whitespaces!==undefined)
{for(var i=0;i<whitespaces;i++)
indent+='  ';}
else
{whitespaces=0;}
switch(type)
{case'string':return'\''+val.replace(/'/g,'\'\'')+'\'';case'number':case'boolean':return val.toString();case'object':if(val===null)
{return'null';}
else if(val instanceof Array)
{var arr='[\n';for(var i=0;i<val.length;++i)
{arr+=indent+'  '+var_export(val[i],ret,whitespaces+1)+',\n';}
arr+=indent+']';return arr;}
else
{var arr='{\n';for(var attr in val)
{if(typeof val[attr]!='function')
{arr+=indent+'  \''+attr+'\' => '+var_export(val[attr],ret,whitespaces+1)+',\n';}}
arr+=indent+'}';return arr;}
default:return indent+type;}}
// ### minified file: jsonrpc_lib.js ###

function json_encode_entities(data,src_encoding,dest_encoding)
{if(data==undefined)
{return'';}
return data.replace('\\','\\\\').replace('"','\\"').replace('/','\\/').replace('\t','\\t').replace('\n','\\n').replace('\r','\\r').replace('\b','\\b').replace('\v','\\v').replace('\f','\\f');}
function json_parse(data,return_jsvals,src_encoding,dest_encoding)
{if(return_jsvals==undefined)
{return_jsvals=false;}
if(src_encoding==undefined)
{src_encoding='UTF-8';}
if(dest_encoding==undefined)
{dest_encoding='ISO-8859-1';}
_xh['isf_reason']='non-native JSON parsing not yet implemented.';return false;}
function json_parse_native(data)
{try
{var out=eval('('+data+')');_xh['value']=out;return true;}
catch(e)
{_xh['isf_reason']='JSON parsing failed';return false;}}
function jsonrpc_parse_resp(data,return_jsvals,use_native_parsing)
{if(return_jsvals==undefined)
{return_jsvals=false;}
if(use_native_parsing==undefined)
{use_native_parsing=true;}
_xh['isf']=0;_xh['isf_reason']='';if(use_native_parsing)
{var ok=json_parse_native(data);}
else
{var ok=json_parse(data,return_jsvals);}
if(ok)
{if(typeof(_xh['value'])!='object'||_xh['value']['result']===undefined||_xh['value']['error']===undefined||_xh['value']['id']===undefined)
{_xh['isf_reason']='JSON parsing did not return correct jsonrpc response object';return false;}
var d_error=_xh['value']['error'];_xh['id']=_xh['value']['id'];if(d_error!=null)
{_xh['isf']=1;if(typeof(d_error)=='object'&&d_error['faultCode']!==undefined&&d_error['faultString']!==undefined)
{if(d_error['faultCode']==0)
{d_error['faultCode']=-1;}
_xh['value']=d_error;}
else
{if(return_jsvals)
{_xh['value']={'faultCode':-1,'faultString':var_export(_xh['value']['error'])};}
else
{_xh['value']={'faultCode':-1,'faultString':serialize_jsonrpcval(jsonrpc_encode(_xh['value']['error']))};}}}
else
{if(!return_jsvals)
_xh['value']=jsonrpc_encode(_xh['value']['result']);else
_xh['value']=_xh['value']['result'];}
return true;}
else
{return false;}}
function jsonrpc_client(path,server,port,method)
{this.no_multicall=true;this.return_type='jsonrpcvals';this.init(path,server,port,method);}
jsonrpc_client.prototype=new xmlrpc_client();function jsonrpcmsg(meth,pars,id)
{this.id=null;this.params=[];this.content_type='application/json';if(id!==undefined)
{this.id=id;}
this.init(meth,pars);}
jsonrpcmsg.prototype=new xmlrpcmsg();jsonrpcmsg.prototype.parseResponse=function(data,headers_processed,return_type)
{var headers='';if(headers_processed===undefined)
{headers_processed=false;}
else if(typeof(headers_processed)=='string')
{headers=headers_processed;headers_processed=true;}
if(return_type===undefined)
{return_type='jsonrpcvals';}
if(this.debug)
{xmlrpc_debug_log('<PRE>---GOT---\n'+htmlentities(data)+'\n---END---\n</PRE>');}
if(data=='')
{xmlrpc_error_log('XML-RPC: jsonrpcmsg::parseResponse: no response received from server.');var r=new jsonrpcresp(0,xmlrpcerr['no_data'],xmlrpcstr['no_data']);return r;}
_xh={headers:[],cookies:[]};var raw_data=data;if(headers!='')
{var r=this.parseResponseHeaders(headers,true);}
else if(data.slice(0,4)=='HTTP')
{var r=this.ParseResponseHeaders(data,headers_processed);if(typeof(r)!=='string')
{r.raw_data=data;return r;}
else
{data=r;}}
if(this.debug)
{var start=data.indexOf('/* SERVER DEBUG INFO (BASE64 ENCODED):');if(start!=-1)
{start+=39;var end=data.indexOf('*/',start);var comments=data.slice(start,end-1);xmlrpc_debug_log('<PRE>---SERVER DEBUG INFO (DECODED)---\n\t'+htmlentities(base64_decode(comments).replace(/\n/g,'\n\t'))+'\n---END---\n</PRE>');}}
data=data.replace(/^\s/,'').replace(/\s$/,'');var pos=data.lastIndexOf('}');if(pos>=0)
{data=data.slice(0,pos+17);}
if(return_type=='json')
{var r=new jsonrpcresp(data,0,'','json');r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}
if(!jsonrpc_parse_resp(data,return_type=='jsvals'))
{if(this.debug)
{}
var r=new jsonrpcresp(0,xmlrpcerr['invalid_return'],xmlrpcstr['invalid_return']+' '+_xh['isf_reason']);}
else
{var v=_xh['value'];if(this.debug)
{xmlrpc_debug_log("<PRE>---PARSED---\n");xmlrpc_debug_log(var_export(v));xmlrpc_debug_log("\n---END---</PRE>");}
if(_xh['isf'])
{var r=new jsonrpcresp(0,v['faultCode'],v['faultString']);}
else
{var r=new jsonrpcresp(v,0,'',return_type);}
r.id=_xh['id'];}
r.hdrs=_xh['headers'];r._cookies=_xh['cookies'];r.raw_data=raw_data;return r;}
jsonrpcmsg.prototype.createPayload=function(charset_encoding)
{this.payload='{\n"method": "'+json_encode_entities(this.methodname,'',charset_encoding)+'",\n"params": [ ';for(var i=0;i<this.params.length;++i)
{this.payload+='\n  '+serialize_jsonrpcval(this.params[i],charset_encoding)+',';}
this.payload=this.payload.slice(0,-1)+'\n],\n"id": '+(this.id==null?'null':this.id)+'\n}\n';}
function jsonrpcresp(val,fcode,fstr,valtyp)
{this.id=null;this.init(val,fcode,fstr,valtyp);}
jsonrpcresp.prototype=new xmlrpcresp();jsonrpcresp.prototype.serialize=function(charset_encoding)
{this.payload=serialize_jsonrpcresp(this,this.id,charset_encoding);return this.payload;}
function jsonrpcval(val,type)
{this.init(val,type);}
jsonrpcval.prototype=new xmlrpcval();jsonrpcval.prototype.serialize=function(charset_encoding)
{return serialize_jsonrpcval(this,charset_encoding);}
function jsonrpc_decode(jsonrpc_val,options)
{switch(jsonrpc_val.kindOf())
{case'scalar':return jsonrpc_val.scalarVal();case'array':var size=jsonrpc_val.arraySize();var arr=[];for(var i=0;i<size;++i)
{arr[arr.length]=jsonrpc_decode(jsonrpc_val.arrayMem(i),options);}
return arr;case'struct':if((options!=undefined&&options['decode_js_objs'])&&jsonrpc_val._js_class!='')
{var obj=new jsonrpc_val._js_class;}
else
{var obj={};}
for(var key in jsonrpc_val.me)
{obj[key]=jsonrpc_decode(jsonrpc_val.me[key],options);}
return obj;case'msg':var paramcount=jsonrpc_val.getNumParams();var arr=[];for(var i=0;i<paramcount;++i)
{arr[arr.lenght]=jsonrpc_val(jsonrpc_val.getParam(i));}
return arr;}}
function jsonrpc_encode(js_val,options)
{var type=typeof js_val;switch(type)
{case'string':var jsonrpc_val=new jsonrpcval(js_val,'string');break;case'number':var num=new Number(js_val);if(num==parseInt(num))
{var jsonrpc_val=new jsonrpcval(js_val,'int');}
else
{var jsonrpc_val=new jsonrpcval(js_val,'double');}
break;case'boolean':var jsonrpc_val=new jsonrpcval(js_val,'boolean');break;case'object':if(js_val===null)
{var jsonrpc_val=new jsonrpcval(null,'null');}
else
if(js_val.toJsonRpcVal)
{var jsonrpc_val=js_val.toJsonRpcVal();}
else
if(js_val instanceof Array)
{var arr=[];for(var i=0;i<js_val.length;++i)
{arr[arr.length]=jsonrpc_encode(js_val[i],options);}
var jsonrpc_val=new jsonrpcval(arr,'array');}
else
{var arr={};for(var attr in js_val)
{if(typeof js_val[attr]!='function')
{arr[attr]=jsonrpc_encode(js_val[attr],options);}}
var jsonrpc_val=new jsonrpcval(arr,'struct');}
break;default:var jsonrpc_val=new jsonrpcval();break;}
return jsonrpc_val;}
function jsonrpc_decode_json(json_val,options)
{_xh={};if(!json_parse_native(json_val))
{xmlrpc_error_log(_xh['isf_reason']);return false;}
else
{if(typeof(_xh['value'])=='object')
{if(_xh['value']['result']!==undefined&&_xh['value']['error']!==undefined&&_xh['value']['id']!==undefined)
{if(_xh['value']['error']!=null)
{if(typeof(_xh['value']['error'])=='object'&&_xh['value']['error']['faultCode']!==undefined&&_xh['value']['error']['faultString']!==undefined)
{if(_xh['value']['error']['faultCode']==0)
{_xh['value']['error']['faultCode']=-1;}}
else
{_xh['value']={'faultCode':-1,'faultString':var_export(_xh['value']['error'])};}
var r=new jsonrpcresp(0,_xh['value']['faultCode'],_xh['value']['faultString']);}
else
{var r=new jsonrpcresp(jsonrpc_encode(_xh['value']['result']));}
r.id=_xh['value']['id'];return r;}
else if(_xh['value']['method']!==undefined&&_xh['value']['params']!==undefined&&_xh['value']['id']!==undefined)
{var r=new jsonrpcmsg(_xh['value']['method'],null,_xh['value']['id']);for(var i=0;i<_xh['value']['params'].length;i++)
r.addParam(jsonrpc_encode(_xh['value']['params'][i]));return r;}}
return jsonrpc_encode(_xh['value']);}}
function serialize_jsonrpcresp(resp,id,charset_encoding)
{var result='{\n"id": '+(id==undefined?'null':id)+', ';if(resp.errno)
{result+='"error": { "faultCode": '+resp.errno+', "faultString": "'+json_encode_entities(resp.errstr,null,charset_encoding)+'" }, "result": null';}
else
{if(typeof resp.val!='object'||!(resp.val instanceof xmlrpcval))
{if(typeof resp.val=='string'&&resp.valtyp=='json')
{result+='"error": null, "result": '+resp.val;}
else
{}}
else
{result+='"error": null, "result": '+
serialize_jsonrpcval(resp.val,charset_encoding);}}
result+='\n}';return result;}
function serialize_jsonrpcval(value,charset_encoding)
{var rs='';switch(value.mytype)
{case 1:rs+='"'+json_encode_entities(value.me,null,charset_encoding)+'"';break;case 4:if(isFinite(value.me))
{rs+=value.me.toFixed();}
else
{rs+='0';}
break;case 5:if(isFinite(value.me)&&value.me!==null)
{rs+=value.me.toString();var num=new Number(value.me);if(num==parseInt(num))
{rs+='.0';}}
else
{rs+='0';}
break;case 6:rs+=(value.me?'true':'false');break;case 7:rs+='"'+value.me+'"';break;case 8:rs+='"'+base64_encode(value.me)+'"';break;case 9:rs+="null";break;case 2:rs+="[";len=(value.me.length);if(len)
{for(var i=0;i<len-1;++i)
{rs+=serialize_jsonrpcval(value.me[i],charset_encoding);rs+=",";}
rs+=serialize_jsonrpcval(value.me[i],charset_encoding);}
rs+="]";break;case 3:for(var val in value.me)
{rs+=',"'+json_encode_entities(val,null,charset_encoding)+'":';rs+=serialize_jsonrpcval(value.me[val],charset_encoding);}
rs='{'+rs.slice(1)+'}';break;}
return rs;}
// ### minified file: xmlrpc_wrappers.js ###

function xmlrpc_2_js_type(xmlrpctype)
{switch(xmlrpctype.toLowerCase())
{case'base64':case'string':return'string';case'datetime.iso8601':return'Date';case'int':case'i4':return'integer';case'struct':return'object';case'array':return'array';case'double':return'number';case'undefined':return'mixed';case'boolean':case'null':default:return xmlrpctype.toLowerCase();}}
function wrap_xmlrpc_method(client,methodname,extra_options)
{if(extra_options===undefined)extra_options={};var signum=extra_options['signum']!=undefined?parseInt(extra_options['signum']):0;var timeout=extra_options['timeout']!=undefined?parseInt(extra_options['timeout']):0;var protocol=extra_options['protocol']!=undefined?extra_options['protocol']:'';var newfuncname=extra_options['new_function_name']!=undefined?extra_options['new_function_name']:'';var encode_js_objects=extra_options['encode_js_objs']!=undefined?Boolean(extra_options['encode_js_objs']):false;var decode_js_objects=extra_options['decode_js_objs']!=undefined?Boolean(extra_options['decode_js_objs']):false;var simple_client_copy=extra_options['simple_client_copy']!=undefined?parseInt(extra_options['simple_client_copy']):0;var buildit=extra_options['return_source']!=undefined?!(extra_options['return_source']):true;var prefix=extra_options['prefix']!=undefined?extra_options['prefix']:'xmlrpc';if(extra_options['return_on_fault']!=undefined)
{var decode_fault=true;var fault_response=extra_options['return_on_fault'];}
else
{var decode_fault=false;var fault_response='';}
var debug=extra_options['debug']!=undefined?(extra_options['debug']):0;var msgclass=prefix+'msg';var valclass=prefix+'val';var decodefunc=prefix+'_decode';var msg=new this[msgclass]('system.methodSignature');msg.addParam(new this[valclass](methodname));client.setDebug(debug);var response=client.send(msg,timeout,protocol);if(response.faultCode())
{xmlrpc_error_log('XML-RPC: could not retrieve method signature from remote server for method '+methodname);return false;}
else
{var msig=response.value();if(client.return_type!='jsvals')
{msig=this[decodefunc](msig);}
if(!(msig instanceof Array)||msig.length<=signum)
{xmlrpc_error_log('XML-RPC: could not retrieve method signature nr.'+signum+' from remote server for method '+methodname);return false;}
else
{var msig=msig[signum];var mdesc='';if(buildit)
{var xmlrpcfuncname='';}
else
{if(newfuncname!='')
{var xmlrpcfuncname=newfuncname;}
else
{var xmlrpcfuncname=prefix+'_'+methodname.replace(/\./g,'_').replace(/[^a-zA-Z0-9_\x7f-\xff]/g,'');}
msg=new this[msgclass]('system.methodHelp');msg.addParam(new this[valclass](methodname));response=client.send(msg,timeout,protocol);if(!response.faultCode())
{mdesc=response.value();if(client.return_type!='jsvals')
{mdesc=mdesc.scalarVal();}}}
var results=build_remote_method_wrapper_code(client,methodname,xmlrpcfuncname,msig,mdesc,timeout,protocol,simple_client_copy,prefix,decode_js_objects,encode_js_objects,decode_fault,fault_response);if(buildit)
{var func=false;eval('func = '+results['source']);if(func)
{return func;}
else
{xmlrpc_error_log('XML-RPC: could not create function '+xmlrpcfuncname+' to wrap remote method '+methodname);return false;}}
else
{results['function']=xmlrpcfuncname;return results;}}}}
function wrap_xmlrpc_server(client,extra_options)
{if(extra_options===undefined)extra_options={};var methodfilter=extra_options['method_filter']!==undefined?extra_options['method_filter']:'';var signum=extra_options['signum']!==undefined?parseInt(extra_options['signum']):0;var timeout=extra_options['timeout']!==undefined?parseInt(extra_options['timeout']):0;var protocol=extra_options['protocol']!==undefined?extra_options['protocol']:'';var newclassname=extra_options['new_class_name']!==undefined?extra_options['new_class_name']:'';var encode_js_objects=extra_options['encode_js_objs']!==undefined?Boolean(extra_options['encode_js_objs']):false;var decode_js_objects=extra_options['decode_js_objs']!==undefined?Boolena(extra_options['decode_js_objs']):false;var verbatim_client_copy=extra_options['simple_client_copy']!==undefined?!Boolean(extra_options['simple_client_copy']):true;var buildit=extra_options['return_source']!==undefined?!Boolean(extra_options['return_source']):true;var prefix=extra_options['prefix']!==undefined?extra_options['prefix']:'xmlrpc';var msgclass=prefix+'msg';var decodefunc=prefix+'_decode';var msg=new this[msgclass]('system.listMethods');var response=client.send(msg,timeout,protocol);if(response.faultCode())
{xmlrpc_error_log('XML-RPC: could not retrieve method list from remote server');return false;}
else
{var mlist=response.value();if(client.return_type!='jsvals')
{mlist=this[decodefunc](mlist);}
if(!(mlist instanceof Array)||!mlist.length)
{xmlrpc_error_log('XML-RPC: could not retrieve meaningful method list from remote server');return false;}
else
{if(newclassname!='')
{var xmlrpcclassname=newclassname;}
else
{var xmlrpcclassname=prefix+'_'+client.server.replace(/\./g,'_').replace(/[^a-zA-Z0-9_\x7f-\xff]/g,'')+'_client';}
var source='function '+xmlrpcclassname+'()\n{\nvar client;\n\n';source+=build_client_wrapper_code(client,verbatim_client_copy,prefix);source+='this.client = \client;\n\n';var opts={'simple_client_copy':2,'return_source':true,'timeout':timeout,'protocol':protocol,'encode_js_objs':encode_js_objects,'prefix':prefix,'decode_js_objs':decode_js_objects};for(var i=0;i<mlist.length;i++)
{var mname=mlist[i];if(methodfilter==''||mname.search(methodfilter)!=-1)
{var new_function_name=mname.replace(/\./,'_').replace(/[^a-zA-Z0-9_\x7f-\xff]/,'');opts['new_function_name']=' ';var methodwrap=wrap_xmlrpc_method(client,mname,opts);if(methodwrap)
{if(!buildit)
{source+=methodwrap['docstring'];}
source+='this.'+new_function_name+' = '+methodwrap['source']+'\n';}
else
{xmlrpc_error_log('XML-RPC: will not create class method to wrap remote method '+mname);}}}
source+='}\n';if(buildit)
{var func=false;eval('func = '+source);if(func)
{return func;}
else
{xmlrpc_error_log('XML-RPC: could not create class '+xmlrpcclassname+' to wrap remote server '+client.server);return false;}}
else
{return{'class':xmlrpcclassname,'code':source,'docstring':''};}}}}
function build_remote_method_wrapper_code(client,methodname,xmlrpcfuncname,msig,mdesc,timeout,protocol,client_copy_mode,prefix,decode_js_objects,encode_js_objects,decode_fault,fault_response)
{var code='function '+xmlrpcfuncname+' (';if(client_copy_mode<2)
{var innercode=build_client_wrapper_code(client,client_copy_mode,prefix);innercode+='if (debug !== undefined) client.setDebug(debug);\n';var this_='';}
else
{var innercode='';var this_='this.';}
innercode+='var msg = new '+prefix+'msg(\''+methodname+'\');\n';if(mdesc!='')
{mdesc="/**\n* "+mdesc.replace(/\*\//g,'* /')+'\n';}
else
{mdesc='/**\nFunction '+xmlrpcfuncname+'\n';}
var plist=[];var pcount=msig.length;for(var i=1;i<pcount;++i)
{plist[i-1]='p'+i;ptype=msig[i];if(ptype=='i4'||ptype=='int'||ptype=='boolean'||ptype=='double'||ptype=='string'||ptype=='base64'||ptype=='null')
{innercode+='var p'+i+' = new '+prefix+'val(p'+i+', \''+ptype+'\');\n';}
else
{if(encode_js_objects)
{innercode+='var p'+i+' = '+prefix+'_encode(p'+i+', {\'encode_js_objs\': true};\n';}
else
{innercode+='var p'+i+' = '+prefix+'_encode(p'+i+');\n';}}
innercode+='msg.addParam(p'+i+');\n';mdesc+='* @param '+xmlrpc_2_js_type(ptype)+' p'+i+'\n';}
if(client_copy_mode<2)
{plist[i-1]='debug';mdesc+='* @param int debug when 1 (or 2) will enable debugging of the underlying '+prefix+' call (defaults to 0)\n';}
plist=plist.join(', ');mdesc+='* @return '+xmlrpc_2_js_type(msig[0])+' (or an '+prefix+'resp obj instance if call fails)\n*/\n';innercode+='var res = '+this_+'client.send(msg, '+timeout+', \''+protocol+'\');\n';if(decode_fault)
{if(typeof(fault_response)=='string'&&(fault_response.indexOf('%faultCode%')!=-1||fault_response.indexOf('%faultString%')!=-1))
{var respcode='\''+fault_response.replace(/'/g,'\'\'').replace(/\%faultCode\%/g,'\' + res.faultCode() + \'').replace(/\%faultString\%/g,'\' + res.faultString() + \'')+'\'';}
else
{var respcode=var_export(fault_response,true);}}
else
{var respcode='res';}
if(decode_js_objects)
{innercode+='if (res.faultCode()) return '+respcode+'; else return '+prefix+'_decode(res.value(), {\'decode_js_objs\': true});';}
else
{innercode+='if (res.faultCode()) return '+respcode+'; else return '+prefix+'_decode(res.value());';}
code=code+plist+") {\n"+innercode+'\n}\n';return{'source':code,'docstring':mdesc};}
function build_client_wrapper_code(client,verbatim_client_copy,prefix)
{var code='client = new '+prefix+'_client(\''+client.path.replace(/'/g,'\'')+'\', \''+client.server.replace(/'/g,'\'')+'\', '+client.port+');\n';if(verbatim_client_copy)
{for(var fld in client)
{if(fld!='debug'&&fld!='return_type'&&typeof client[fld]!='function')
{val=var_export(client[fld],true);code+='client.'+fld+' = '+val+';\n';}}
code+='client.return_type = \''+prefix+'vals\';\n';}
return code;}
