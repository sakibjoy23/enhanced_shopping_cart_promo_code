const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    // Prevent duplicate entry of product to cart
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("This item is already in the cart!");
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="fa-regular fa-trash-can cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector(".decrement");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.classList.contains("decrement") && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
            }
        } else if (event.target.classList.contains("increment")) {
            quantity++;
            decrementButton.style.color = "#333";
        }

        numberElement.textContent = quantity;
        updateTotalPrice();
    });

    updateCartCount(1);
    updateTotalPrice();
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = parseFloat(priceElement.textContent.replace("$", ""));
        const quantity = parseInt(quantityElement.textContent);
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
    applyPromoCode(); // Recalculate discount if total price changes
};

let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your cart is empty, Please add items to your cart before buying.");
        return;
    }
    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    alert("Thank you for your purchase!");
});

// Apply Promo Code Functionality- this part will apply ,trim,, check promo code functionality - subtotal before discount, discount amount, final total
const promoInput = document.querySelector("#promo-code");
const applyPromoButton = document.querySelector("#apply-promo");
const discountAmountElement = document.querySelector(".discount-amount");
const finalTotalElement = document.querySelector(".final-total");
const promoMessage = document.querySelector(".promo-message");
let appliedPromo = null;

applyPromoButton.addEventListener("click", applyPromoCode);

function applyPromoCode() {
    const promoCode = promoInput.value.trim().toLowerCase();
    const totalElement = document.querySelector(".total-price");
    let total = parseFloat(totalElement.textContent.replace("$", ""));
    let discount = 0;

    if (appliedPromo) {
        promoMessage.textContent = "Promo code already applied!";
        promoMessage.style.color = "red";
        return;
    }

    if (promoCode === "ostad10") {
        discount = total * 0.10;
    } else if (promoCode === "ostad5") {
        discount = total * 0.05;
    } else {
        promoMessage.textContent = "Invalid promo code!";
        promoMessage.style.color = "red";
        return;
    }

    appliedPromo = promoCode;
    discountAmountElement.textContent = `-$${discount.toFixed(2)}`;
    finalTotalElement.textContent = `$${(total - discount).toFixed(2)}`;
    promoMessage.textContent = "Promo code applied successfully!";
    promoMessage.style.color = "green";
}
