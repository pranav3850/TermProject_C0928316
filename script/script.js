document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    function calculateTotal() {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        return total.toFixed(2);
    }

    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h2 class="product-title">${product.name}</h2>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    function renderCart() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-title">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <button class="remove-item" data-index="${index}"><i class="fa fa-trash-o" aria-hidden="true"></i> Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
        cartTotal.textContent = `Total: $${calculateTotal()}`;
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(products);
            updateCartCount();
            renderCart();
        })
        .catch(error => console.error('Error fetching products:', error));

    productList.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart')) {
            addToCart(event.target.getAttribute('data-id'));
        }
    });

    cartItems.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-item')) {
            removeFromCart(event.target.getAttribute('data-index'));
        }
    });
});
