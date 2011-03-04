Simulink SimServer - an open-source HTTP and XML-RPC server for Matlab Simulink
 
What is it?

Its an s-function for Matlab Simulink that serves HTTP and XML-RPC data to a client or browser. It can be used to interact 'live' with a running Simulink simulation.

What version of Matlab does it work with?

I’ve used SimServer successfully under Matlab 2007a, but I don’t see any reason why it shouldn’t work with other versions (although it might need rebuilding from source to get it to work). Please let me know of any other versions you get it to work with.

What operating system does it work with?

SimServer builds and works fine on Windows XP. I haven’t tried it, but it ought to be possible to get it working under Linux too, with a few changes to the mex_simserver.m file. All of the dependencies are cross-platform. Please let me know if you have any success, and contribute the changes back, so everybody can benefit.
