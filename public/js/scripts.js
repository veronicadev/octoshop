let oldScroll=0;
const header = document.getElementById('mainHeader');
window.addEventListener("scroll", function(e){
    let current = window.scrollY;
    if(current>100)
        header.classList.add('main-header--fixed');
    else
        header.classList.remove('main-header--fixed');

   /* if(oldScroll<current){
        header.classList.add('main-header--hidden');
    }else{
        header.classList.remove('main-header--hidden');
    }
    oldScroll = current;*/
});