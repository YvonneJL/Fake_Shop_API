import { Product } from "./api";
import { getShopProducts } from "./api";

const productSection = document.querySelector("#hero");
const productInput = document.querySelector<HTMLInputElement>("#search-input");
const productButtonSearch = document.querySelector("#search-button");
const productCategoryElButton = document.querySelector("#category-1");
const productCategoryJeButton = document.querySelector("#category-2");
const productCategoryMeButton = document.querySelector("#category-3");
const productCategoryWoButton = document.querySelector("#category-4");
const productCategoryAllButton = document.querySelector("#category-0");
const headlineSectionElement = document.querySelector("#headline-section");
const itemsInCart = document.querySelector("#cart-counter");
const clearCartButton = document.querySelector("#clear-cart");


//Daten aus Promise
const shopProductData = await getShopProducts();
console.log(shopProductData);

//buttons in Array für Eventlistener
let allButtonAddToCart: HTMLButtonElement[] = [];
// Variable für Cart
//entweder ?? leer oder alles was im localStorage ist
let allCartItems: Product[] = JSON.parse(localStorage.getItem("cart") ?? "[]");

// Funktion, um Daten in Dom zu rendern
function putDataIntoDom(products: Product[]) {
  if (
    shopProductData &&
    productSection &&
    headlineSectionElement &&
    itemsInCart
  ) {
    for (let i = 0; i <= products.length - 1; i++) {
      const productContainerAußen = document.createElement("section");
      productSection.appendChild(productContainerAußen);
      productContainerAußen.className =
        "bg-white border-2 border-yellow-200 p-3 flex flex-col justify-end";
      // Container definieren
      const productContainer = document.createElement("article");
      productContainerAußen.appendChild(productContainer);
      //img und imgContainer dazu
      const imgDivElement = document.createElement("div");
      const imgElement = document.createElement("img");
      productContainer.appendChild(imgDivElement);
      imgDivElement.appendChild(imgElement);
      imgElement.src = products[i].image;
      imgElement.className = "w-1/2";
      imgDivElement.className = "flex justify-center mb-5";
      //Produkttitel und Linie
      const titlePElement = document.createElement("p");
      productContainer.appendChild(titlePElement);
      titlePElement.textContent = products[i].title;
      titlePElement.className =
        "font-[orbitron] text-bold text-left mb-5 w-[90%] mx-auto";
      const lineDiv = document.createElement("div");
      productContainer.appendChild(lineDiv);
      lineDiv.className = "w-[90%] h-[1px] bg-gray-400 mx-auto mb-5";
      //Preis und Button Teil
      const preisContainer = document.createElement("article");
      productContainer.appendChild(preisContainer);
      preisContainer.className =
        "mb-5 flex justify-between items-center p-2 w-[90%] mx-auto";
      const pricePElement = document.createElement("p");
      preisContainer.appendChild(pricePElement);
      pricePElement.textContent = `$ ${products[i].price.toString()}`;
      pricePElement.className = "font-[orbitron]";
      const buttonAddToCart = document.createElement("button");
      preisContainer.appendChild(buttonAddToCart);
      buttonAddToCart.setAttribute("id", products[i].id.toString());
      buttonAddToCart.className = "font-[orbitron] bg-yellow-200 p-2";
      buttonAddToCart.textContent = "Add to cart";
      //Button-Elemente in Array, das global initialisiert
      allButtonAddToCart.push(buttonAddToCart);
    }
  }
}
//Funktionsaufruf
if (shopProductData) {
  putDataIntoDom(shopProductData);
}

//show number of cart items
function updateCart() {
  if (itemsInCart) {
    if (allCartItems.length === 0) {
      itemsInCart.classList.add("invisible");
    } else if (allCartItems.length >= 1) {
      itemsInCart.classList.remove("invisible");
      itemsInCart.textContent = allCartItems.length.toString();
    }
  }
}

//addToCart eventlistener
if (shopProductData) {
  //index mitgeben, um Button mit Produkt zu verknüpfen
  allButtonAddToCart.forEach((button, index) => {
    button.addEventListener("click", () => {
      //alle Produkte in einem Array speichern
      allCartItems.push(shopProductData[index]);
      //Funktion, um Menge im Warenkorb darzustellen
      updateCart();
      //im localStorage speichern
      localStorage.setItem("cart", JSON.stringify(allCartItems));
    });
  });
}

//clear Cart EventListener
if (clearCartButton && itemsInCart) {
  clearCartButton.addEventListener("click", () => {
    localStorage.clear();
    allCartItems = [];
    updateCart();
    console.log(allCartItems);
  });
}

// Suchfunktion nach Titel
if (productInput && productButtonSearch && shopProductData && productSection) {
  productButtonSearch.addEventListener("click", () => {
    //trim() entfernt so Leerzeichen am Anfang und am Ende
    const productValue = productInput.value.toLowerCase().trim();
    productInput.value = "";
    //wenn nichts ins Inputfeld eingegeben wurde
    //return --> bricht dann ab
    if (!productValue) {
      return;
    }
    let searchResults = shopProductData.filter((product) => {
      return product.title.toLowerCase().includes(productValue);
    });
    productSection.innerHTML = "";
    putDataIntoDom(searchResults);
  });
}

// Filterfunktion nach Kategorie
//Filterfunktion
function filterProducts (shopProductData: Product[], category: string) {
  if (productSection) {
    let searchedCategory = shopProductData.filter((product) => {
      if (product.category.toLowerCase() === category) {
        return product;
      }
    });
    if (searchedCategory) {
      productSection.innerHTML = "";
      putDataIntoDom(searchedCategory);
    }
  }
}

//electronics
if (productCategoryElButton && shopProductData) {
  productCategoryElButton.addEventListener("click", () => {
    filterProducts(shopProductData, "electronics")
  });
}
//jewelery
if (productCategoryJeButton && shopProductData) {
  productCategoryJeButton.addEventListener("click", () => {
    filterProducts(shopProductData, "jewelery")
  });
}
//men's clothes
if (productCategoryMeButton && shopProductData) {
  productCategoryMeButton.addEventListener("click", () => {
    filterProducts(shopProductData, "men's clothing")
  });
}
//women's clothes
if (productCategoryWoButton && shopProductData) {
  productCategoryWoButton.addEventListener("click", () => {
    filterProducts(shopProductData, "women's clothing")
  });
}
//wieder alle Produkte
if (productSection && productCategoryAllButton && shopProductData) {
  productCategoryAllButton.addEventListener("click", () => {
    productSection.innerHTML = "";
    putDataIntoDom(shopProductData);
  });
}
