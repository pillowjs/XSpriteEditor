;define('sprite',function(){
    function spriteClass(cfg){
        this.image = cfg.image;
        this.offsetX = cfg.offsetX;
        this.offsetY = cfg.offsetY;
        this.width = cfg.width;
        this.height = cfg.height;
        this.NumX = cfg.NumX-1;
        this.NumY = cfg.NumY-1;
        this.loop = cfg.loop;
        this.x = 0;
        this.y = 0;
    }
    spriteClass.prototype = {
        jump:function(){
            var that = this;
            if(that.x == that.NumX){
                if(that.y == that.NumY){
                    if(that.loop){
                        that.x = 0;
                        that.y = 0;
                    }
                }else {
                    that.x = 0;
                    that.y++;
                }
            }else {
                that.x++;
            }
        }
    };
    return spriteClass;
});
