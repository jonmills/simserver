function [result] = set_input_signal_name(handle,port,name)
    ph = get_param(handle, 'porthandles');
    signal_dim = size(ph.Inport);
    number_of_inputs = signal_dim(2);
    
    if ((number_of_inputs>0) && (port<=number_of_inputs) && (port>=1))
        lh = get_param(ph.Inport(port),'line');
        set_param(lh,'Name',name);
        result=1;       
    else
        result=0;               
    end
    

    