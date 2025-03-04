let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

next.addEventListener('click', function () {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(items[0]); // Move first item to last
    updateClasses();
});

prev.addEventListener('click', function () {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(items[items.length - 1]); // Move last item to first
    updateClasses();
});

function updateClasses() {
    let items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        item.classList.remove('active');
        if (index === 1) item.classList.add('active'); // Ensure second item is active
    });
}

