(function () {

	angular.module("main")
		.filter('percent', percentFilter);

    function percentFilter()
    {
    	return function(input)
    	{
    		if(typeof input !== 'undefined')
    		{
    			if(input <= 1)
    			{
    				return Math.round(input * 100);	
    			}
    			else
    			{
    				return Math.round(input);
    			}
    		}
    		else
    		{
    			return input;
    		}
    	};
    }
})();

