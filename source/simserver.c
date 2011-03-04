/*
        simserver.c

        This module implements an HTTP and XML-RPC server s-function
        for Mathworks Simulink.


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

#define S_FUNCTION_NAME  simserver
#define S_FUNCTION_LEVEL 2
#define BUFFER_SIZE (1024)
#define IS_SIMSERVER_C

/*
 * Need to include simstruc.h for the definition of the SimStruct and
 * its associated macro definitions.
 */
#include <string.h>
#include <winsock2.h>
#include "httpwrapper.h"

#ifndef TEST_HARNESS
#include "simstruc.h"
#include "mex.h"
#else
#include <stdio.h>
int kbhit(void); //dummy prototype to prevent warning
#include <crtdbg.h>
#endif

#ifdef TEST_HARNESS
typedef double real_T;
typedef char boolean_T;
#define false   (0)
#define true    (1)
#endif

/* Definitions */
#define MAX_NO_INPUTS           1000
#define MAX_NO_OUTPUTS          1000
#define MAX_SIGNALNAME_LENGTH   100
#define ROGUE_VALUE             -9999.99

#define CR 13            /* Decimal code of Carriage Return char */
#define LF 10            /* Decimal code of Line Feed char */

/* Global variable definitions */
char*   inputSignals[MAX_NO_INPUTS];
char*   outputSignals[MAX_NO_OUTPUTS];
real_T  inputValues[MAX_NO_OUTPUTS];
real_T  outputValues[MAX_NO_OUTPUTS];
short   numberOfInputs=0;
short   numberOfOutputs=0;
short   PortNumber;
HANDLE  hEvent;
HANDLE  hThreadID;

/* Local private function prototypes */
static boolean_T readConfigFile(const char* configFileStr);
static boolean_T setSignalNames(char* blockHandle);
static void startServer(void);
static void stopServer(void);
static DWORD WINAPI ServerThread(LPVOID iValue);
static real_T privateGetInputValByIndex(short i);
static real_T privateGetOutputValByIndex(short i);
static void privateSetOutputValByIndex(short i,real_T value);
static void privateSetInputValByIndex(short i,real_T value);

/* Define the parameters passed from Matlab */
#define NUMBER_OF_PARAMETERS    3

#define PORT_NUMBER_IDX         0
#define PORT_NUMBER_PARAM           (ssGetSFcnParam(S,PORT_NUMBER_IDX))
#define PORT_NUMBER_VALUE       ((int)(mxGetPr(PORT_NUMBER_PARAM)[0]))

#define CONFIG_FILE_IDX         1
#define CONFIG_FILE_PARAM           (ssGetSFcnParam(S,CONFIG_FILE_IDX))

#define BLOCK_HANDLE_IDX        2
#define BLOCK_HANDLE_PARAM          (ssGetSFcnParam(S,BLOCK_HANDLE_IDX))

/*===========================*
 * S-function public methods *
 *===========================*/

/* Function: mdlInitializeSizes ===============================================
 * Abstract:
 *    The sizes information is used by Simulink to determine the S-function
 *    block's characteristics (number of inputs, outputs, states, etc.).
 */

#ifndef TEST_HARNESS
static void mdlCheckParameters(SimStruct *S)
{
        PortNumber = PORT_NUMBER_VALUE;

        /* Check config file parameter */
        {
                int_T     nu;
                char_T    *configFileStr;
                char_T    *blockHandleStr;
                boolean_T illegalParam = 0;

                //Read the config file definition
                if (!mxIsChar(CONFIG_FILE_PARAM) || (nu=mxGetNumberOfElements(CONFIG_FILE_PARAM)) < 1)
                {
                        illegalParam = 1;
                }
                else
                {
                        if ((configFileStr=(char_T*)malloc(nu+1)) == NULL)
                        {
                                ssSetErrorStatus(S,"Memory allocation error while parsing config file parameter");
                                return;
                        }

                        if (mxGetString(CONFIG_FILE_PARAM,configFileStr,nu+1) != 0)
                        {
                                free(configFileStr);
                                ssSetErrorStatus(S,"mxGetString error while parsing config file");
                                return;
                        }
                        else
                        {
                                //Try to read the config file
                                if (!readConfigFile(configFileStr))
                                {
                                        free(configFileStr);
                                        ssSetErrorStatus(S,"Failed to read config file");
                                        return;
                                }
                        }
                }

                if (illegalParam)
                {
                        ssSetErrorStatus(S,"Config file parameter should be a string that points to a file.");
                        return;
                }

                //Read the block handle definition
                if (!mxIsChar(BLOCK_HANDLE_PARAM) || (nu=mxGetNumberOfElements(BLOCK_HANDLE_PARAM)) < 1)
                {
                        illegalParam = 1;
                }
                else
                {
                        if ((blockHandleStr=(char_T*)malloc(nu+1)) == NULL)
                        {
                                ssSetErrorStatus(S,"Memory allocation error while parsing block handle parameter");
                                return;
                        }

                        if (mxGetString(BLOCK_HANDLE_PARAM,blockHandleStr,nu+1) != 0)
                        {
                                free(blockHandleStr);
                                ssSetErrorStatus(S,"mxGetString error while parsing block handle parameter");
                                return;
                        }
                        else
                        {
                                if (!setSignalNames(blockHandleStr))
                                {
                                        free(blockHandleStr);
                                        ssSetErrorStatus(S,"Failed to set signal names");
                                        return;
                                }
                        }
                }

                if (illegalParam)
                {
                        ssSetErrorStatus(S,"Illegal block handle parameter.");
                        return;
                }
        }
}
#endif

#ifndef TEST_HARNESS
static void mdlInitializeSizes(SimStruct *S)
{
        int x;

        ssSetNumSFcnParams(S, NUMBER_OF_PARAMETERS);  /* Number of expected parameters */
        if (ssGetNumSFcnParams(S) != ssGetSFcnParamsCount(S)) {
                /* Return if number of expected != number of actual parameters */
                return;
        }

        //Check (and populate) the model parameters
        mdlCheckParameters(S);

        if (numberOfInputs>0)
        {
                if (!ssSetNumInputPorts(S, numberOfInputs)) return;
                for (x=0; x<numberOfInputs;x++)
                {
                        ssSetInputPortWidth(S, x, 1);
                        ssSetInputPortDirectFeedThrough(S, x, 1);
                }
        }
        else
        {
                if (!ssSetNumInputPorts(S, 0)) return;
        }

        if (numberOfOutputs>0)
        {
                if (!ssSetNumOutputPorts(S, numberOfOutputs)) return;
                for (x=0; x<numberOfOutputs;x++)
                {
                        ssSetOutputPortWidth(S, x, 1);
                }
        }
        else
        {
                if (!ssSetNumOutputPorts(S, 0)) return;
        }

        ssSetNumSampleTimes(S, 1);
}
#endif

#ifndef TEST_HARNESS
/* Function: mdlInitializeSampleTimes =========================================
 * Abstract:
 *    This function is used to specify the sample time(s) for your
 *    S-function. You must register the same number of sample times as
 *    specified in ssSetNumSampleTimes.
 */
static void mdlInitializeSampleTimes(SimStruct *S)
{
        ssSetSampleTime(S, 0, CONTINUOUS_SAMPLE_TIME);
        ssSetOffsetTime(S, 0, 0.0);
}
#endif

#ifndef TEST_HARNESS
#define MDL_START  /* Change to #undef to remove function */
#else
#undef MDL_START
#endif
#if defined(MDL_START)
/* Function: mdlStart =======================================================
* Abstract:
*    This function is called once at start of model execution. If you
*    have states that should be initialized once, this is the place
*    to do it.
*/
static void mdlStart(SimStruct *S)
{
        startServer();
}
#endif /*  MDL_START */

/* Function: mdlOutputs =======================================================
 * Abstract:
 *    In this function, you compute the outputs of your S-function
 *    block. Generally outputs are placed in the output vector, ssGetY(S).
 */
#ifndef TEST_HARNESS
static void mdlOutputs(SimStruct *S, int_T tid)
{
        short i;
        int_T portWidth;
        InputRealPtrsType uPtrs;

        //Read the inputs
        for(i=0;i<numberOfInputs;i++)
        {
                portWidth = ssGetInputPortWidth(S,i);
                uPtrs = ssGetInputPortRealSignalPtrs(S,i);

                if (portWidth>0)
                {
                        if (uPtrs[0]!=NULL)
                        {
                                privateSetInputValByIndex(i,*uPtrs[0]);
                        }
                }
        }

        //Update the outputs
        for(i=0;i<numberOfOutputs;i++)
        {
                double *y = (double *)ssGetOutputPortSignal(S,i);
                y[0] = privateGetOutputValByIndex(i);
        }
}
#endif

/* Function: mdlTerminate =====================================================
 * Abstract:
 *    In this function, you should perform any actions that are necessary
 *    at the termination of a simulation.  For example, if memory was
 *    allocated in mdlStart, this is the place to free it.
 */
#ifndef TEST_HARNESS
static void mdlTerminate(SimStruct *S)
{
        stopServer();
}
#endif

/*==================================*
 * End of S-function public methods *
 *==================================*/


/*======================*
 * Other public methods *
 *======================*/

boolean_T getModelValue(const char * SignalName, real_T * result)
{
        short i;

        *result = ROGUE_VALUE;

        //Try to find the specified signal in the inputs list
        for(i=0;i<numberOfInputs;i++)
        {
                if (strncmp(SignalName,inputSignals[i],strlen(inputSignals[i]))==0)
                {
                        //Found the specified signal
                        *result = privateGetInputValByIndex(i);
                        return true;
                }
        }

        //Try to find the specified signal in the outputs list
        for(i=0;i<numberOfOutputs;i++)
        {
                if (strncmp(SignalName,outputSignals[i],strlen(outputSignals[i]))==0)
                {
                        //Found the specified signal
                        *result = privateGetOutputValByIndex(i);
                        return true;
                }
        }

        return false;
}

boolean_T setModelValue(const char * SignalName, real_T Value)
{
        short i;

        //Try to find the specified output
        for(i=0;i<numberOfOutputs;i++)
        {
                if (strncmp(SignalName,outputSignals[i],strlen(outputSignals[i]))==0)
                {
                        //Found the specified signal
                        privateSetOutputValByIndex(i,Value);

                        return true;
                }
        }

        return false;
}

short getInputSize(void)
{
        return (numberOfInputs);
}

short getOutputSize(void)
{
        return (numberOfOutputs);
}

boolean_T getInputSignalNameByIndex(short Index, char ** SignalName)
{
        if ((Index>=0) && (Index<=numberOfInputs))
        {
                if ((inputSignals[Index]!=NULL) && (*SignalName != NULL))
                {
                        *SignalName = inputSignals[Index];
                        return true;
                }
        }

        return false;
}

boolean_T getOutputSignalNameByIndex(short Index, char ** SignalName)
{
        if ((Index>=0) && (Index<=numberOfOutputs))
        {
                if ((outputSignals[Index]!=NULL) && (*SignalName != NULL))
                {
                        *SignalName = outputSignals[Index];
                        return true;
                }
        }

        return false;
}

boolean_T getInputValueByIndex(short Index, real_T * value)
{
        if ((Index>=0) && (Index<=numberOfInputs))
        {
                *value = privateGetInputValByIndex(Index);
                return true;
        }

        *value = ROGUE_VALUE;
        return false;
}

boolean_T getOutputValueByIndex(short Index, real_T * value)
{
        if ((Index>=0) && (Index<=numberOfOutputs))
        {
                *value = privateGetOutputValByIndex(Index);
                return true;
        }

        *value = ROGUE_VALUE;
        return false;
}

/*=============================*
 * End of other public methods *
 *=============================*/


/*=======================*
 * Local private methods *
 *=======================*/

#ifndef TEST_HARNESS
static boolean_T   setSignalNames(char* blockHandle)
{
        short i;
        char buffer [120];

        for(i=0;i<numberOfInputs;i++)
        {
                sprintf (buffer, "set_input_signal_name('%s',%d,'%s');",blockHandle,i+1,inputSignals[i]);
                mexEvalString(buffer);
        }

        for(i=0;i<numberOfOutputs;i++)
        {
                sprintf (buffer, "set_output_signal_name('%s',%d,'%s');",blockHandle,i+1,outputSignals[i]);
                mexEvalString(buffer);
        }

        return true;
}
#endif

static void startServer(void)
{
        printf("SimServer: Starting webserver thread\n");
        hEvent = CreateEvent(NULL,FALSE,FALSE,NULL);
        hThreadID = CreateThread(NULL, 0, ServerThread, NULL, 0, NULL);
        SetThreadPriority(hThreadID,THREAD_PRIORITY_HIGHEST);
}

static void stopServer(void)
{
        printf("SimServer: Stopping webserver thread\n");
        SetEvent(hEvent);
        WaitForSingleObject(hThreadID, INFINITE);
        CloseHandle(hThreadID);
        CloseHandle(hEvent);
}

static DWORD WINAPI ServerThread(LPVOID iValue)
{
        DWORD dwRes;

        printf("SimServer: ServerThread: Starting webserver on port %d\n",PortNumber);

        httpserver_start(PortNumber);

        //Keep looping until we get an event signal from the mdlTerminate function.
        while(1)
        {
                dwRes = WaitForSingleObject(hEvent, 1000);
                if (WAIT_OBJECT_0 == dwRes) break;
        }

        printf("SimServer: ServerThread: Shutting down webserver\n");

        httpserver_quit();

        return (0);
}

static boolean_T readConfigFile(const char* configFileStr)
{
        FILE *inputFilePtr;
        char  cThisLine[1000]; /* Contents of current line */
        long  lLineLen;               /* Current line length */

        printf("SimServer: Reading config file: %s\n",configFileStr);

        inputFilePtr = fopen(configFileStr, "r");

        if (inputFilePtr == NULL )
        {
                printf("SimServer: Error opening config file\n");
                return false;
        }

        numberOfInputs=0;
        numberOfOutputs=0;
        while((!ferror(inputFilePtr)) && (!feof(inputFilePtr)))
        {
                if (fgets(cThisLine, MAX_SIGNALNAME_LENGTH, inputFilePtr)==NULL) break;

                if (strncmp(cThisLine,"//Inputs",strlen("//Inputs"))==0)
                {
                        //Read the inputs
                        short i=0;
                        while((!ferror(inputFilePtr)) && (!feof(inputFilePtr)))
                        {
                                if (fgets(cThisLine, MAX_SIGNALNAME_LENGTH, inputFilePtr)==NULL) break;
                                lLineLen = strlen(cThisLine);
                                if (lLineLen<=1) break;
                                if (lLineLen<MAX_SIGNALNAME_LENGTH)
                                {
                                        inputSignals[i] = malloc((lLineLen)*sizeof(char));
                                        strncpy(inputSignals[i],cThisLine,lLineLen-1);
                                        *(inputSignals[i] + lLineLen - 1) = 0x00;
                                        numberOfInputs++;
                                        //Initialise the value to zero
                                        privateSetInputValByIndex(i,0.0);
                                        i++;
                                }
                        }
                }

                if (strncmp(cThisLine,"//Outputs",strlen("//Outputs"))==0)
                {
                        short i=0;
                        while((!ferror(inputFilePtr)) && (!feof(inputFilePtr)))
                        {
                                if (fgets(cThisLine, MAX_SIGNALNAME_LENGTH, inputFilePtr)==NULL) break;
                                lLineLen = strlen(cThisLine);
                                if (lLineLen<=1) break;
                                if (lLineLen<MAX_SIGNALNAME_LENGTH)
                                {
                                        outputSignals[i] = malloc((lLineLen + 1)*sizeof(char));
                                        strncpy(outputSignals[i],cThisLine,lLineLen-1);
                                        *(outputSignals[i] + lLineLen - 1) = 0x00;
                                        numberOfOutputs++;
                                        //Initialise the value to zero
                                        privateSetOutputValByIndex(i,0.0);
                                        i++;
                                }
                        }
                }
        }

        fclose(inputFilePtr);

        return true;
}

static real_T privateGetInputValByIndex(short i)
{
        return(inputValues[i]);
}

static real_T privateGetOutputValByIndex(short i)
{
        return(outputValues[i]);
}

static void privateSetOutputValByIndex(short i,real_T value)
{
        if ((i>=0) && (i<numberOfOutputs))
        {
                outputValues[i] = value;
        }
}

static void privateSetInputValByIndex(short i,real_T value)
{
        if ((i>=0) && (i<numberOfInputs))
        {
                inputValues[i] = value;
        }
}

/*==============================*
 * End of local private methods *
 *==============================*/


#ifdef TEST_HARNESS
void main(void)
{
        int tmpFlag;
        tmpFlag = _CrtSetDbgFlag( _CRTDBG_REPORT_FLAG );
        tmpFlag |= _CRTDBG_CHECK_ALWAYS_DF;
        tmpFlag |= _CRTDBG_LEAK_CHECK_DF;
        _CrtSetDbgFlag( tmpFlag );

        readConfigFile("C:\\Simulink_SimServer\\io_config.cfg");

        PortNumber = 80;

        startServer();

        printf("\n");
        printf("***** Press any key to quit *****\n");
        printf("\n");

        while(1)
        {

                if(kbhit())
                {
                        break;
                }
        }

        stopServer();

#ifdef TEST_HARNESS
_ASSERTE(_CrtCheckMemory());
#endif
}
#endif

/*=============================*
 * Required S-function trailer *
 *=============================*/

#ifndef TEST_HARNESS
#ifdef  MATLAB_MEX_FILE    /* Is this file being compiled as a MEX-file? */
#include "simulink.c"      /* MEX-file interface mechanism */
#else
#include "cg_sfun.h"       /* Code generation registration function */
#endif
#endif

#undef IS_SIMSERVER_C
