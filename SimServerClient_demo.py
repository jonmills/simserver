#!/usr/bin/env python
###############################################################################
## Simulink SimServer demo client
## Filename: SimServerClient_demo.py
##
## Original Author: Jon Mills
###############################################################################

import xmlrpclib

class SimServerClient():
    objectName = "SimServerClient"
    ROGUE_VALUE = -9999.99
    
    def __init__(self,URL,Port):
        self.URL = URL
        self.Port = Port
        self.s = xmlrpclib.Server('http://' + URL + ":" + str(Port))

    def GetVal(self,TagName):
        try:
            retval = self.s.getVal(TagName)
        except:
            retval = self.ROGUE_VALUE
        return (retval)

    def SetVal(self,TagName,Value):        
        try:
            retval = self.s.setVal(TagName,Value)
        except:
            retval = self.ROGUE_VALUE            
        return (retval)
        
def main():
    """ Main program - an example """
    s = SimServerClient("127.0.0.1",80)
    print s.GetVal("InputSignal1")
    s.SetVal("OutputSignal1",1.5)    
    

if __name__ == "__main__":
    main()
