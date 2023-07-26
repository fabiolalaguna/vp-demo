"use strict";

/****** CUSTOMERS *****/
const btnContainer = document.querySelector(".btn-container");
const tabBtns = document.querySelectorAll(".tab-btn");
const contentCustom = document.querySelectorAll(".content");
const imgCustoms = document.querySelectorAll(".customers-img--item");

btnContainer.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  // console.log(id);

  tabBtns.forEach((btns) => {
    btns.classList.remove("active");
    e.target.classList.add("active");
  });

  contentCustom.forEach((content) => content.classList.remove("active"));

  const elementContent = document.getElementById(id);
  elementContent.classList.add("active");
});

/*****************/
// CART
/*****************/

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");

const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".item-total");
const cartInfo = document.querySelector(".item-info");

const iconUp = document.querySelector("qty-up");
const iconDown = document.querySelector("qty-down");

const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelectorAll(".products");
const catalogTable = document.querySelector(".catalog-table");
const tablebody = document.querySelector(".table-body");
// const btnTable = document.querySelectorAll(".cart-table-icon");

// cart
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      console.log(products);
      products = products.map((item) => {
        const { id } = item.sys;
        const {
          description,
          material,
          widthIN,
          lenghtIN,
          widthCM,
          lengthCM,
          mil,
          calibre,
          quantity,
          capacity,
          price,
        } = item.fields;

        return {
          id,
          description,
          material,
          widthIN,
          lenghtIN,
          widthCM,
          lengthCM,
          mil,
          calibre,
          quantity,
          capacity,
          price,
        };
      });
      return products;
    } catch (error) {
      console.error(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    // console.log(products);
    let result = "";
    products.forEach((product) => {
      result += ` 
      
      <tbody>
        <div class="products cart-vp-001" id=${product.id} name="cart">
          <tr>
            <td>${product.id}</td>
            <td>${product.description}</td>
            <td>${product.material}</td>
            <td>${product.widthIN}</td>
            <td>${product.lenghtIN}</td>
            <td>${product.widthCM}</td>
            <td>${product.lengthCM}</td>
            <td>${product.mil}</td>
            <td>${product.calibre}</td>
            <td>${product.quantity}</td>
            <td>${product.capacity}</td>
            <td>${product.price}</td>
            <td class="cart-table">
              <button class="bag-btn" data-id=${product.id}>
                <ion-icon name="cart-outline"></ion-icon>
              </button>
            </td>
          </tr>
        </div>
      </tbody>
    
      `;
      tablebody.innerHTML = result;
    });
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    // console.log(btnsCart);
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        // console.log(event);
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        // 1. get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);

        // 2. add product to the cart
        cart = [...cart, cartItem];
        // console.log(cart);

        // 3. save cart in local Storage
        Storage.saveCart(cart);

        // 4. set cart values
        this.setCartValues(cart);

        // 5. display cart items
        this.addCartItem(cartItem);

        // 6. show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    // cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    // cartItems.innerHTML = itemsTotal;
    cartTotal.innerText = Number.parseFloat(tempTotal).toFixed(2);
    cartItems.innerText = itemsTotal;

    console.log(cartTotal, cartItems);
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="item-container-heading">
        <h4>ID</h4>
        <h4>Description</h4>
        <h4>Quantity</h4>
        <h4>Price</h4>
        <h4>Total</h4>
        <div></div>
      </div>

      <div class="item-info">
      <p>${item.id}</p>
      <p>${item.description}</p>
      <div class="qty-icons">
        <div class="icon-up">
          <ion-icon
            data-id="${item.id}"
            class="qty-up"
            name="chevron-up-outline"
          ></ion-icon>
        </div>
        <span class="item-amount">${item.amount}</span>
        <ion-icon data-id=${item.id}
        class="qty-down"
        name="chevron-down-outline"
        ></ion-icon>
      </div>
        <p>$${item.price}</p>
        <div class="item-box">
          <span class="item-total">$${item.total}</span>
          <button class="clear-cart" data-id=${item.id}>Remove</button>
        </div>
        
    </div>
    `;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart btn
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", function (event) {
      // console.log(event.target);
      if (event.target.classList.contains("clear-cart")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;

        cartContent.removeChild(
          removeItem.parentElement.parentElement.parentElement
        );
        this.removeItem(id);
      }
      if (event.target.classList.contains("qty-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // console.log(id);
        console.log(addAmount);

        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;

        cartItems;
        console.log(tempItem);

        Storage.saveCart(cart);

        this.setCartValues(cart);

        addAmount.parentNode.nextElementSibling.innerText = tempItem;
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    console.log(cartItems);
    cartItems.forEach((id) => this.removeItem(id));

    console.log(cartContent.children);

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `
    <ion-icon name="cart-outline"></ion-icon>
    `;

    // console.log(button);
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// eventLISTENER
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
