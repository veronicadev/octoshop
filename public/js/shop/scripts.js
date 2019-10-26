let oldScroll = 0;
const header = document.getElementById('mainHeader');
window.addEventListener("scroll", function(e) {
    let current = window.scrollY;
    if (current > 100)
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

const navbarToggler = document.getElementById("navbarToggler");
const navbar = document.getElementById('navbarToggle');
navbarToggler.addEventListener('click', (e) => {
    e.preventDefault();
    navbar.classList.toggle('collapse');

});
/*
const deleteBtns = document.getElementsByClassName('delete-button');
if (deleteBtns && deleteBtns.length > 0) {
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', (e) => {
            const btn = e.target;
            const prodId = btn.parentNode.querySelector('[name="productId"]').value;
            const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
            const productElement = btn.closest('tr');
            console.log(productElement)
            fetch('/product/' + prodId, {
                    method: "DELETE",
                    headers: {
                        'csrf-token': csrf
                    }
                })
                .then(result => {
                    return result.json();
                })
                .then(data => {
                    console.log(data);
                    productElement.parentNode.removeChild(productElement);
                })
                .catch(error => {
                    console.log(error)
                });
        })
    }
}*/