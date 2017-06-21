;define('msg',function(){
    var win = window;
    function Msg(){
        this.init();
    };
    Msg.prototype = {
        init:function(){
            win.__msg__xdf = window.__msg__xdf || {};
        },
        listen:function(id,func){
            if(!win.__msg__xdf[id]){
                win.__msg__xdf[id] = func;
            }
        },
        send:function(id,data){
            if(win.__msg__xdf[id]){
                win.__msg__xdf[id].call(this,data);
            }
        }
    };
    return Msg;
});
