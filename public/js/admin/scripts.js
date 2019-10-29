const navbarToggler = document.getElementById("openProfile");
const navbar = document.getElementById('dropdownProfile');
navbarToggler.addEventListener('click', (e) => {
    navbar.classList.toggle('show');

});

const megamenus = document.getElementsByClassName('mega-menu-item');
if (megamenus && megamenus.length > 0) {
    for (let i = 0; i < megamenus.length; i++) {
        let arrow = megamenus[i].getElementsByClassName('has-arrow');
        if (arrow && arrow.length > 0) {
            arrow[0].addEventListener('click', (e) => {
                e.preventDefault();
                let menu = megamenus[i].getElementsByClassName('mega-menu')[0];
                menu.classList.toggle('collapse');
                megamenus[i].classList.toggle('opened');
            })

        }
    }
}

var fileInput = document.querySelector(".form-control-file"),
    fileLabel = document.querySelector(".form-control-file-label")
fileBtn = document.querySelector(".form-control-file-btn");

fileInput.addEventListener("change", function (event) {
    if (this.value) {
        console.log(event.target.files)
        const newName = event.target.files[0].name;
        fileLabel.innerHTML = event.target.files[0].name;
    }else{
        fileLabel.innerHTML = '';
    }
});

fileBtn.addEventListener( "click", function( event ) {
    fileInput.click();
});
