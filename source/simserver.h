/*
        simserver.h
 
        This module defines the public API for the simserver.c file.

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

#ifndef SIMSERVER_H
#define SIMSERVER_H

#ifdef IS_SIMSERVER_C
#define EXTERN
#else
#define EXTERN  extern
#endif

#ifdef TEST_HARNESS
typedef double real_T;
typedef char boolean_T;
#define false   (0)
#define true    (1)
#else
#include "simstruc.h"
#include "mex.h"
#endif

EXTERN boolean_T getModelValue(const char * SignalName, real_T * result);
EXTERN boolean_T setModelValue(const char * SignalName, double Value);
EXTERN short getInputSize(void);
EXTERN short getOutputSize(void);
EXTERN boolean_T getInputSignalNameByIndex(short Index, char ** SignalName);
EXTERN boolean_T getInputValueByIndex(short Index, real_T * value);
EXTERN boolean_T getOutputSignalNameByIndex(short Index, char ** SignalName);
EXTERN boolean_T getOutputValueByIndex(short Index, real_T * value);

#undef EXTERN
#endif  //SIMSERVER_H
