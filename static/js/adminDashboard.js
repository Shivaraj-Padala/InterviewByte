const menu = document.getElementById('menu'),
sideNav = document.getElementById('side-nav'),
adminNav = document.querySelector('.admin-nav'),
menuClose = document.createElement('i');

menuClose.classList.add('bx', 'bx-x');

menu.addEventListener('click', ()=>{
    adminNav.removeChild(adminNav.firstChild);
    adminNav.append(menuClose);
    sideNav.classList.add('show-menu'); 
})

menuClose.addEventListener('click', ()=>{
    adminNav.removeChild(adminNav.firstChild);
    adminNav.append(menu);
    sideNav.classList.remove('show-menu');
})