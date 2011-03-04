function [result] = set_output_signal_name(handle,port,name)
    ph = get_param(handle, 'porthandles');
    signal_dim = size(ph.Outport);
    number_of_outputs = signal_dim(2);
    
    if ((number_of_outputs>0) && (port<=number_of_outputs) && (port>=1))
        lh = get_param(ph.Outport(port),'line');
        set_param(lh,'Name',name);
        result=1;
    else
        result=0;               
    end
    

    