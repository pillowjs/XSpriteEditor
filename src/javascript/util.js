;define('util',function(){
    function __typeof(type){
        return function(obj){
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    };
    var Util = {
        indexOf:function(i,s){
            return !!~s.indexOf(i);
        },
        mix:function(r,s){
            for(var i in s){
                r[i] = s[i];
            };
            return r;
        },
        each:function(object, fn) {
            if(!object){
                return;
            }
            for(var i in object){
                if(i !== 'length' && i !== 'item' && object.hasOwnProperty(i)){
                    fn.call(this,object[i],i);
                }
            }
            return object;
        },
        isString:function(){
            return __typeof('String');
        },
        isObject:function(){
            return __typeof('Object');
        }
    };
    return Util;
});

