;define('loadImg',function(){
    function PreLoadImages(arr){   
        var images=[], 
            num=0
        var callback=function(){};
        var arr= (typeof arr!="object")? [arr] : arr;
        function loadImg(){
            num++;
            if (num==arr.length){
                callback(images);
            }
        }
        for (var i=0; i<arr.length; i++){
            images[i]=new Image();
            images[i].src=arr[i];
            images[i].onload=function(){
                loadImg();
            }
            images[i].onerror=function(){
                loadImg();
            }
        }
        return {
            ready:function(f){
                callback = f || callback;
            }
        }
    }
    return PreLoadImages;
});

