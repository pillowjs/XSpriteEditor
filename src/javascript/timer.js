;define('timer',['msg','util'],function(Msg,_){
    var msg = new Msg();
    var frameName = 'J_frame';
    var layers = document.getElementById('layers');
    function Timer(){
        this.init();
    };
    Timer.prototype = {
        init:function(){
            this.bind();
        },
        upDateView:function(){
            var that = this;
            layers.innerHTML = '';
            _.each(that.query,function(i,key){
                var _key = key.charAt(key.length-1);
                var elm = document.createElement("li");
                elm.id = frameName + key;
                if(that.index == key){
                    elm.className="current";
                }
                elm.innerHTML = _key;
                layers.appendChild(elm);
            });
        },
        bind:function(){
            var that = this;
            msg.listen('timerView',function(data){
                that.query = data.query;
                that.index = data.current;
                that.upDateView();
            });
            layers.addEventListener('click',function(e){
                var target = e.target;
                if(target.nodeName == 'LI'){
                    msg.send('timerClick',target.id.split(frameName)[1]||0);
                }
            });
        }
    };
    return Timer;
});
