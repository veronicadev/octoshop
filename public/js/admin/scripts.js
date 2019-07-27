const navbarToggler = document.getElementById("openProfile");
const navbar = document.getElementById('dropdownProfile');
navbarToggler.addEventListener('click', (e)=>{
    e.preventDefault();
    navbar.classList.toggle('show');

});

const megamenus = document.getElementsByClassName('mega-menu-item');
if(megamenus && megamenus.length>0){
    for(let i=0; i<megamenus.length; i++){
        let arrow = megamenus[i].getElementsByClassName('has-arrow');
        if(arrow && arrow.length>0){
            arrow[0].addEventListener('click', (e)=>{
                e.preventDefault();
                let menu =  megamenus[i].getElementsByClassName('mega-menu')[0];
                menu.classList.toggle('collapse');
                megamenus[i].classList.toggle('opened');
            })
    
        }
    }
}
