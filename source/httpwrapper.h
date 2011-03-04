/*
        httpwrapper.h
 
        This module defines the public API for the httpwrapper.c file.

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

#ifndef HTTPWRAPPER_H
#define HTTPWRAPPER_H

#ifdef IS_HTTPWRAPPER_C
#define EXTERN
#else
#define EXTERN  extern
#endif

EXTERN short httpserver_start(short port);
EXTERN void httpserver_quit(void);

#undef EXTERN
#endif  //HTTPWRAPPER_H
