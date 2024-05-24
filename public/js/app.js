const productPhoto = document.querySelectorAll('.product-photo');
productPhoto.forEach(element => {
    element.addEventListener('click', function () {
        const id = this.dataset.productId;
        getProductById(id);
    });
});

const productModal = document.querySelector('#productModal');
const baseUrl = window.location.href;

async function getProductById(id) {
    productModal.querySelector('.modal-body').textContent = "Loading...";

    // 1
    let url = 'app/api/productdetail.php';
    let data = { productId: id };

    // 2
    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    let result = await response.json();
    productModal.querySelector('#productModalLabel').textContent = result.name;

    productModal.querySelector('.modal-body').innerHTML = `
    <div class="row">
        <div class="col-md-4">
            <img src="public/images/${result.image}" alt="" class="img-fluid">
        </div>
        <div class="col-md-8">
            <p>${result.price}</p>
            <div>${result.description}</div>    
        </div>
    </div>`;

    history.pushState({ productId: result.id }, "", slug(result.name));


    // Tăng view
    // 1
    url = 'app/api/productview.php';
    data = { productId: id };

    // 2
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    result = await response.json();
    document.querySelector(`#view-${id}`).innerHTML = `<i class="bi bi-eye-fill"></i> ${result.views}`;
}
productModal.addEventListener('hide.bs.modal', event => {
    history.pushState(null, "", baseUrl);
})

function slug(str) {
    return String(str)
        .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd') //Xóa dấu
        .trim().toLowerCase() //Cắt khoảng trắng đầu, cuối và chuyển chữ thường
        .replace(/[^a-z0-9\s-]/g, '') //Xóa ký tự đặc biệt
        .replace(/[\s-]+/g, '-') //Thay khoảng trắng bằng dấu -, ko cho 2 -- liên tục
}

// Like
const btnLike = document.querySelectorAll('.btn-like');
btnLike.forEach(element => {
    element.addEventListener('click', function () {
        const id = this.value;
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
        if (likedProducts.includes(id) == false) {
            like(id, this);

            likedProducts.push(id);
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        }
    });
});

async function like(id, target) {
    // 1
    const url = 'app/api/productlike.php';
    const data = { productId: id };

    // 2
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    result = await response.json();
    target.innerHTML = `<i class="bi bi-heart-fill"></i> ${result.likes}`;
}

// Search

const inputSearch = document.querySelector('input[name=q]');
const productList = document.querySelector('.product-list');

inputSearch.addEventListener('input', function () {
    if (this.value != '') {
        productSearch(this.value);
    }
    else {
        productList.innerHTML = '';
    }
});

async function productSearch(keyword) {
    // 1
    const url = 'app/api/productsearch.php';
    const data = { keyword: keyword };

    // 2
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    result = await response.json();
    productList.innerHTML = '';
    result.forEach(element => {
        // const regex = new RegExp(`(${keyword})`, 'gi');
        // const productName = element.name.replace(regex, `<span class="highlight">$1</span>`)
        productList.innerHTML += `<li class="list-group-item" onclick="getProductById(${element.id})">${element.name}</li>`;
    });

    var instance = new Mark(productList);
    instance.mark(keyword);
}


// Filter category
const btnCategories = document.querySelectorAll('.btn-category');
let checkedCategories = [];

btnCategories.forEach(element => {
    element.addEventListener('click', function () {
        // Cách 1
        // let checkedCategories = [];
        // btnCategories.forEach(e => {
        //     if (e.checked == true) {
        //         checkedCategories.push(e.value);
        //     }
        // });

        // Cách 2
        const checkedCat = document.querySelectorAll('.btn-category:checked');
        checkedCategories = [...checkedCat].map( (e) => { return e.value } );

        getProductByCategories(checkedCategories)
    });
});

const productContainer = document.querySelector('.product-container');
const btnLoadmore = document.querySelector('.btn-loadmore');

let page = 1;
const perPage = 4;

async function getProductByCategories(id) {
    page = 1;
    // 1
    const url = 'app/api/productcategories.php';
    const data = { categoriesId: id, page: page, perPage: perPage };

    // 2
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    result = await response.json();
    productContainer.innerHTML = '';

    if (result.length <= perPage) {
        btnLoadmore.style.display = 'none';
    }
    else {
        btnLoadmore.style.display = 'unset';
        result.pop();
    }

    result.forEach(element => {
        productContainer.innerHTML += `
        <div class="col-md-3">
            <img src="./public/images/${element.image}" alt="" class="img-fluid product-photo" data-product-id="${element.id}" data-bs-toggle="modal" data-bs-target="#productModal" onclick="getProductById(${element.id})">
            <a href="product.php?id=${element.id}">
                <h6>${element.name}</h6>
            </a>

            <span class="badge text-bg-warning" id="view-${element.id}"><i class="bi bi-eye-fill"></i> ${element.views}</span>

            <button class="btn badge text-bg-danger btn-like" value="${element.id}" onclick="like(${element.id}, this)"><i class="bi bi-heart-fill"></i> ${element.likes}</button>

            ${element.price}

        </div>
        `;
    });

}

btnLoadmore.addEventListener('click', async function () {
    page++;

    // 1
    const url = 'app/api/productcategories.php';
    const data = { categoriesId: checkedCategories, page: page, perPage: perPage };

    // 2
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // 3
    result = await response.json();
    
    if (result.length <= perPage) {
        btnLoadmore.style.display = 'none';
    }
    else {
        btnLoadmore.style.display = 'unset';
        result.pop();
    }
    result.forEach(element => {
        productContainer.innerHTML += `
        <div class="col-md-3">
            <img src="./public/images/${element.image}" alt="" class="img-fluid product-photo" data-product-id="${element.id}" data-bs-toggle="modal" data-bs-target="#productModal" onclick="getProductById(${element.id})">
            <a href="product.php?id=${element.id}">
                <h6>${element.name}</h6>
            </a>

            <span class="badge text-bg-warning" id="view-${element.id}"><i class="bi bi-eye-fill"></i> ${element.views}</span>

            <button class="btn badge text-bg-danger btn-like" value="${element.id}" onclick="like(${element.id}, this)"><i class="bi bi-heart-fill"></i> ${element.likes}</button>

            ${element.price}

        </div>
        `;
    });
});