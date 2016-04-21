(function(moduleOrigin){
    
    /*
     *  taken from angularjs (function annotate(fn)) and deleted some lines (https://angularjs.org/)
     */
    var getParamNames = function(fn){
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var $inject = [],
            fnText,
            argDecl,
            last;

        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg){
        arg.replace(FN_ARG, function(all, underscore, name){
                $inject.push(name);
            });
        });
        
        fn.$inject = $inject;
        return $inject;
    }
    
    /* This function will enhance the implementation of the returned object of angular.module('anyModule',[]) by logging information according to the parameters.
     * Example: 
     *  myModule = angular.module('myModule',[]);
     *  instanceDecorator(myModule.controller, "controller", myModule);
     *  myModule.controller('myCtrl', function(){});
     * 
     * Result:
     *  The registration of the controller will be logged (last line of the example above)
     *  Each call of the controller function will be logged (not shown here)
     *  
     * @orig: Function of the module to enhance (myModule.controller e.g.)
     * @name: Name of the function ("controller" e.g.)
     * @obj: Reference to the module that should be enhanced (myModule e.g.)
     */
    var instanceDecorator = function(orig, name, obj){
        obj[name] = function(){ 
            console.log("Registered: " + arguments[0]);

            var func = arguments[1];
            var functionParams = getParamNames(func);
            
            eval("function newFunction("+functionParams.join(',')+"){"+
                    "console.log(\"Called "+arguments[0]+"\");"+
                    "return ("+func.toString()+")("+functionParams.join(',')+");"+
                "}");
            
            arguments[1] = newFunction;

            var old = orig.apply(null, arguments);
            return old;
        }
    }
    
    /* This function overrides the angular.module function.
     * If a module will be declared (angular.module("myModule",[])) the controller, factory, 
     * service and directive functions will be enhanced by using instanceDecorator().
     * At least the modified module object will be returned.
     *
     */
    angular.module = function(){        
        var newModule = moduleOrigin.apply(null, arguments);
        if(arguments.length > 1){
            instanceDecorator(newModule.controller, "controller", newModule);
            instanceDecorator(newModule.factory, "factory", newModule);
            instanceDecorator(newModule.service, "service", newModule);
            instanceDecorator(newModule.directive, "directive", newModule);
        }
        
        return newModule;
    }
})(angular.module);