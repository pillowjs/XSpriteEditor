;define('status',['msg'],function(Msg){
    var msg = new Msg();
    var scene = document.getElementById('scene');
    function Status(){
        this.init();
    };
    Status.prototype = {
        init:function(){
            this.bind();
        },
        filter:function(d){
            var that = this;
            that.data = d;
        },
        bind:function(){
            var that = this;
            msg.listen('updateName',function(d){
                scene.getElementsByClassName('title')[0].innerHTML = 'scene - ' + d;
            });
            msg.listen('fileRead',function(d){
                that.filter(d);
                msg.send('updateName',that.data.name);
                msg.send('updateSize',d.size/1024);
            });
            msg.listen('updateSize',function(d){
                document.getElementById('size').innerHTML = 'size: ' + parseInt(d) +'kb';
            });
            msg.listen('moving',function(d){
                document.getElementById('position').innerHTML = 'offset: x ' + parseInt(d.x) + ' y ' + parseInt(d.y);
                document.getElementById('able').innerHTML = 'status: ' + d.status;
            });
        }
    };
    return Status;
});
