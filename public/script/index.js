const pagination = document.querySelector('.pagination');
const size = pages/2;
for(let i =0;i<size;i++){
    let button = document.createElement('div');
    button.classList.add('page_btn');
    if(i==0){
        button.innerHTML = `<a href="/" class="page">${i+1}</a>`
    }
    else
    button.innerHTML = `<a href="/blog/page/${i}" class="page">${i+1}</a>`
    if(i== select)
    button.innerHTML = `<a href="/blog/page/${i}" class="page selected">${i+1}</a>`
    pagination.appendChild(button);
}

