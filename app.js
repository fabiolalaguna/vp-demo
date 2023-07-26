"use strict";

// smooth scrolling
const allLinks = document.querySelectorAll("a:link");
console.log(allLinks);

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");
    console.log(href);

    // Scroll back to top
    if (href == "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

// Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

// sticky navigation
const sectionHeroElement = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroElement);

// CLOSE MENU CART=
// const cartDOM = document.querySelector(".cart");
// const cartOverlay = document.querySelector(".cart-overlay");

const closeMenuCart = function () {
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart");
};

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    cartOverlay.classList.contains("transparentBcg") &&
    cartDOM.classList.contains("showCart")
  ) {
    closeMenuCart();
  }
});

//

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

/************************/
// CART

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

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
      products = products.map((item) => {
        const {
          description,
          material,
          widthIN,
          lengthIN,
          widthCM,
          lengthCM,
          mil,
          calibre,
          quantity,
          capacityGallon,
          price,
        } = item.fields;
        const { id } = item.sys;
        // const image = item.fields.image.fields.file.url;
        return {
          id,
          description,
          material,
          widthIN,
          lengthIN,
          widthCM,
          lengthCM,
          mil,
          calibre,
          quantity,
          capacityGallon,
          price,
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((product) => {
      result += `

          <table class="product">
          
              <tbody class="product-container">
                <tr>
                  <td><p>${product.id}</p> </td> 
                  <td><p>${product.description}</p> </td>
                  <td><p>${product.material}</p> </td>
                  <td><p>${product.widthIN}</p> </td>
                  <td><p>${product.lengthIN}</p> </td>
                  <!--<td><p>${product.widthCM}</p></td>-->
                  <!--<td><p>${product.lengthCM}</p> </td>-->
                  <td><p>${product.mil}</p> </td>
                  <!--<td><p>${product.calibre}</p> </td>-->
                  <td><p>${product.quantity}</p> </td>
                  <!--<td><p>${product.capacityGallon}</p> </td>-->
                  
                  <td class="price-btn"><p>$${product.price}</p> <button class="bag-btn" data-id=${product.id}>
                      <!--<i class="fas fa-shopping-cart"></i>-->
                      <ion-icon class="fas fa-shopping-cart" name="cart-outline"></ion-icon>
                      </button> 
                  </td>
                </tr>
              </tbody>
          </table>
      `;
      productsDOM.innerHTML = result;
    });
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "in cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.currentTarget.innerText = "in cart";
        event.currentTarget.disabled = true;

        // get products from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);

        // add product to the cart
        cart = [...cart, cartItem];
        // console.log(cart);

        // save cart in local storage
        Storage.saveCart(cart);

        // set cart values
        this.setCartValues(cart);

        // display cart item
        this.addCartItem(cartItem);

        // show the cart
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
    // cartTotal.innerText = parseFloat(tempTotal).toFixed(2);

    cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    // console.log(cartTotal, cartItems);
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <p class="id-name">${item.id}</p>

    <div>
      <h4>${item.description}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id =${item.id}>Remove</span>
    </div>

    <div>
    
      <ion-icon data-id=${item.id} class="fas fa-chevron-up" name="chevron-up-outline"></ion-icon>  
      <!-- <i class="fas fa-chevron-up" data-id=${item.id}></i>-->
      <p class="item-amount">${item.amount}</p>
      <!--<i class="fas fa-chevron-down" data-id =${item.id}></i>-->
      <ion-icon class="fas fa-chevron-down" data-id =${item.id} name="chevron-down-outline"></ion-icon>
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
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    // console.log(cartItems);
    cartItems.forEach((id) => this.removeItem(id));
    // console.log(cartContent.children);
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
    button.innerHTML = ` <ion-icon class="fas fa-shopping-cart" name="cart-outline"></ion-icon>`;
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

// DOM
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then((products) => {
      // console.log(products);
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});

//
