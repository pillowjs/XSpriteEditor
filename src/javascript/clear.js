;define('clear',function(){
    function Clear(){
        this.init();
    };
    Clear.prototype = {
        init:function(){
            this.elm = document.getElementsById();
        }
    };
    return Clear;
});
