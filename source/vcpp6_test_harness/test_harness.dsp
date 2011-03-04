# Microsoft Developer Studio Project File - Name="test_harness" - Package Owner=<4>
# Microsoft Developer Studio Generated Build File, Format Version 6.00
# ** DO NOT EDIT **

# TARGTYPE "Win32 (x86) Console Application" 0x0103

CFG=test_harness - Win32 Debug
!MESSAGE This is not a valid makefile. To build this project using NMAKE,
!MESSAGE use the Export Makefile command and run
!MESSAGE 
!MESSAGE NMAKE /f "test_harness.mak".
!MESSAGE 
!MESSAGE You can specify a configuration when running NMAKE
!MESSAGE by defining the macro CFG on the command line. For example:
!MESSAGE 
!MESSAGE NMAKE /f "test_harness.mak" CFG="test_harness - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "test_harness - Win32 Release" (based on "Win32 (x86) Console Application")
!MESSAGE "test_harness - Win32 Debug" (based on "Win32 (x86) Console Application")
!MESSAGE 

# Begin Project
# PROP AllowPerConfigDependencies 0
# PROP Scc_ProjName ""
# PROP Scc_LocalPath ""
CPP=cl.exe
RSC=rc.exe

!IF  "$(CFG)" == "test_harness - Win32 Release"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 0
# PROP BASE Output_Dir "Release"
# PROP BASE Intermediate_Dir "Release"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 0
# PROP Output_Dir "Release"
# PROP Intermediate_Dir "Release"
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /c
# ADD CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /c
# ADD BASE RSC /l 0x809 /d "NDEBUG"
# ADD RSC /l 0x809 /d "NDEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /machine:I386
# ADD LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /machine:I386

!ELSEIF  "$(CFG)" == "test_harness - Win32 Debug"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 1
# PROP BASE Output_Dir "Debug"
# PROP BASE Intermediate_Dir "Debug"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 1
# PROP Output_Dir "Debug"
# PROP Intermediate_Dir "Debug"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /Gm /GX /ZI /Od /D "WIN32" /D "_DEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /GZ /c
# ADD CPP /nologo /W3 /Gm /GX /ZI /Od /I "..\xmlrpc-epi-0.54\src" /I "..\miniweb" /I "..\expat-2.0.1\lib" /I "C:\Program Files\GnuWin32\include" /D "WIN32" /D "_DEBUG" /D "_CONSOLE" /D "_MBCS" /D "_WIN32" /D "XMLRPCEPI_EXPORTS" /D "COMPILED_FROM_DSP" /D "TEST_HARNESS" /D snprintf=_snprintf /D inline=__inline /D strcasecmp=stricmp /FR /YX /FD /GZ /c
# ADD BASE RSC /l 0x809 /d "_DEBUG"
# ADD RSC /l 0x809 /d "_DEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /debug /machine:I386 /pdbtype:sept
# ADD LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib wsock32.lib C:\Progra~1\GnuWin32\lib\libiconv.lib /nologo /subsystem:console /debug /machine:I386 /pdbtype:sept

!ENDIF 

# Begin Target

# Name "test_harness - Win32 Release"
# Name "test_harness - Win32 Debug"
# Begin Group "Source Files"

# PROP Default_Filter "cpp;c;cxx;rc;def;r;odl;idl;hpj;bat"
# Begin Group "miniweb"

# PROP Default_Filter ""
# Begin Source File

SOURCE=..\miniweb\crc32.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\http.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httpauth.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httpclient.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httphandler.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httppil.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httppost.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httpvod.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\httpxml.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\mpd.c
# End Source File
# Begin Source File

SOURCE=..\miniweb\processpil.c
# End Source File
# End Group
# Begin Group "xmlrpc_epi"

# PROP Default_Filter ""
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\base64.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\encodings.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\queue.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\simplestring.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\system_methods.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xml_element.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xml_to_dandarpc.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xml_to_soap.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xml_to_xmlrpc.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xmlrpc.c"
# End Source File
# Begin Source File

SOURCE="..\xmlrpc-epi-0.54\src\xmlrpc_introspection.c"
# End Source File
# End Group
# Begin Group "expat"

# PROP Default_Filter ""
# Begin Source File

SOURCE="..\expat-2.0.1\lib\xmlparse.c"
# End Source File
# Begin Source File

SOURCE="..\expat-2.0.1\lib\xmlrole.c"
# End Source File
# Begin Source File

SOURCE="..\expat-2.0.1\lib\xmltok.c"
# End Source File
# Begin Source File

SOURCE="..\expat-2.0.1\lib\xmltok_impl.c"
# End Source File
# Begin Source File

SOURCE="..\expat-2.0.1\lib\xmltok_ns.c"
# End Source File
# End Group
# Begin Source File

SOURCE=..\httpwrapper.c
# End Source File
# Begin Source File

SOURCE=..\simserver.c
# End Source File
# Begin Source File

SOURCE=..\xml_rpc_api.c
# End Source File
# End Group
# Begin Group "Header Files"

# PROP Default_Filter "h;hpp;hxx;hm;inl"
# End Group
# Begin Group "Resource Files"

# PROP Default_Filter "ico;cur;bmp;dlg;rc2;rct;bin;rgs;gif;jpg;jpeg;jpe"
# End Group
# End Target
# End Project
