document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://dummyjson.com/products';
    const productsPerPage = 12;
    let currentPage = 1;
    let totalProducts = 0;

    const productList = document.getElementById('product-list');
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchData();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentPage < Math.ceil(totalProducts / productsPerPage)) {
            currentPage++;
            fetchData();
        }
    });

    function fetchData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${apiUrl}?limit=${productsPerPage}&skip=${(currentPage - 1) * productsPerPage}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                totalProducts = data.total;
                renderProducts(data.products);
                updatePagination();
            } else {
                console.error('Error fetching data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error.');
        };
        xhr.send();
    }

    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p class="price">$${product.price}</p>
                <button class="show-details">Show Details</button>
                <p class="details">${product.description}</p>
            `;
            productList.appendChild(productDiv);

            const showDetailsButton = productDiv.querySelector('.show-details');
            const details = productDiv.querySelector('.details');
            showDetailsButton.addEventListener('click', function() {
                if (details.style.display === 'none' || details.style.display === '') {
                    details.style.display = 'block';
                    showDetailsButton.textContent = 'Hide Details';
                } else {
                    details.style.display = 'none';
                    showDetailsButton.textContent = 'Show Details';
                }
            });
        });
    }

    function updatePagination() {
        pageInfo.textContent = `Page ${currentPage}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(totalProducts / productsPerPage);
    }

    fetchData();
});
