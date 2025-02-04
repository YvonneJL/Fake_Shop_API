console.log("Projekt Fakestore");

//&alle Elemente aus DOM ziehen

const productSection = document.querySelector("#hero");

const productInput = document.querySelector<HTMLInputElement>("#search-input");
const productButtonSearch = document.querySelector("#search-button");

const productCategoryElButton = document.querySelector("#category-1");
const productCategoryJeButton = document.querySelector("#category-2");
const productCategoryMeButton = document.querySelector("#category-3");
const productCategoryWoButton = document.querySelector("#category-4");
const productCategoryAllButton = document.querySelector("#category-0");

const headlineSectionElement = document.querySelector("#headline-section");



//& Typ für die Daten bestimmen
type Product =  {
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: {
        rate: number,
        count: number
    }
};


//& Daten innerhalb try catch ziehen mit asynchroner Funktion
async function getShopProducts() {
        try {
        const productResponse = await fetch("https://fakestoreapi.com/products");
        const productData: Product[] =  await productResponse.json();
    
        //hier überprüfe ich, ob das fetchengeklappt hat-also die Daten in der Konsole geloggt werden
        console.log(productData);
        return productData;
    } catch(error) {
        console.log(error);
    };    
};

//muss die Funktion in einer Variablen speichern
// dann erhalte ich ein Promise
//wenn ich das await davor packe bekomme ich die Response, also die Daten, die ich möchte
//da shopProductData auch undefined sein kann, muss ich immer kontrollieren, ob es existiert mit if
const shopProductData = await getShopProducts();



//hier speichere ich am Ende der Shcleife alle Button-Elemente, damit ich noch Eventlistener darauf setzen kann.
//---ist das wirklich nötig? 
//---oder würde ich die Funktion sowieso in der Schleife schreiben mit i, da die Funktion ja auch wieder dieselbe ist..
//---ansonstena ußerhalb mit querySelectorAll? bzw. Schleife durchs Array aus Buttons
//! War jetzt hier nicht nötig--> addToCart noch innerhab des Loops gemacht
let allButtonAddToCart: HTMLButtonElement[] = [];

// Variable für Cart
//entweder leer (ganz hinten) oder alles was im localStorage ist
let allCartItems: Product[] = JSON.parse(localStorage.getItem("cart") ?? "[]");



//& im Loop alle Produkte in die DOM schieben


// Funktion definieren, die gewünschte Artikel in DOM pusht
function putDataIntoDom (products: Product[]) {
    if (shopProductData && productSection && headlineSectionElement) {
        for (let i = 0; i<= products.length -1; i++) {
             //äußeren Container definieren, sodass ich auf flex kann und einheitliches Bild entsteht, da Bilder unterschiedlich groß
        const productContainerAußen = document.createElement("section");
        productSection.appendChild(productContainerAußen);
        productContainerAußen.className = "bg-white border-2 border-yellow-200 p-3 flex flex-col justify-end"

        // Container definieren
        const productContainer = document.createElement("article");
        productContainerAußen.appendChild(productContainer);

         //img und Container dazu
        const imgDivElement = document.createElement("div");
        const imgElement = document.createElement("img");
        productContainer.appendChild(imgDivElement);
        imgDivElement.appendChild(imgElement);
        imgElement.src = products[i].image;
        imgElement.className = "w-1/2"
        imgDivElement.className = "flex justify-center mb-5"

         //Produkttitel und Linie
        const titlePElement = document.createElement("p");
    productContainer.appendChild(titlePElement);
        titlePElement.textContent = products[i].title;
        titlePElement.className = "font-[orbitron] text-bold text-left mb-5 w-[90%] mx-auto";
        const lineDiv = document.createElement("div");
        productContainer.appendChild(lineDiv);
        lineDiv.className = "w-[90%] h-[1px] bg-gray-400 mx-auto mb-5";

         //Preis und Button Teil
        const preisContainer = document.createElement("article");
        productContainer.appendChild(preisContainer);
        preisContainer.className = "mb-5 flex justify-between items-center p-2 w-[90%] mx-auto";
        const pricePElement = document.createElement("p");
        preisContainer.appendChild(pricePElement);
        pricePElement.textContent = `$ ${products[i].price.toString()}`;
        pricePElement.className = "font-[orbitron]"
        const buttonAddToCart = document.createElement("button");
        preisContainer.appendChild(buttonAddToCart);
        buttonAddToCart.setAttribute("id", products[i].id.toString());
        buttonAddToCart.className = "font-[orbitron] bg-yellow-200 p-2";
        buttonAddToCart.textContent = "Add to cart";
        

        //addToCart
        //alle Produkte in einem Array speichern
        buttonAddToCart.addEventListener("click", ()=> {
            allCartItems.push(products[i]);
            console.log(allCartItems);
            //im localStorage speichern
            localStorage.setItem("cart", JSON.stringify(allCartItems))

            const itemsInCart = document.createElement("div");
            headlineSectionElement.appendChild(itemsInCart);
            //als Zähler wird jetzt die Länge des Array genutzt
            itemsInCart.textContent = allCartItems.length.toString();
            itemsInCart.className = "w-7 h-7 bg-white rounded-full p-2 absolute right-8 top-36 sm:top-21 flex items-center justify-center text-red-500"
        })

         //hier pushe ich die Button-Elemente in das Array, dass ich vor der Schleife initialisiert habe
        allButtonAddToCart.push(buttonAddToCart);
        };
    };
};
if (shopProductData) {
    putDataIntoDom(shopProductData);
};


//Zugriff auf Alle Button-Elemente, die ich in Schleife definiert habe
console.log(allButtonAddToCart);



//& Suchfunktion nach Titel

if (productInput && productButtonSearch && shopProductData && productSection) {
    productButtonSearch.addEventListener("click", ()=> {

        //trim() entfernt so Leerzeichen am Anfang und am Ende
        const productValue = productInput.value.toLowerCase().trim();
        productInput.value = "";
        //wenn nichts ins Inputfeld eingegeben wurde
        //return --> bricht dann ab
        if (!productValue) {
            return;
        }
        let searchResults = shopProductData.filter((product)=> {
            return product.title.toLowerCase().includes(productValue)

        });
        console.log(searchResults);

        productSection.innerHTML = "";
        putDataIntoDom(searchResults);
    });
};



//& Filterfunktion nach Kategorie


//electronics
if (productSection && productCategoryElButton && shopProductData ) {
    productCategoryElButton.addEventListener("click", ()=> {

        let electronicItems = shopProductData.filter((product)=> {
            if (product.category.toLowerCase() === "electronics") {
                return product;
            };
        }); 
        if (electronicItems) {
            productSection.innerHTML = "";
            putDataIntoDom(electronicItems);
        };
    });
};


//jewelery
if (productSection && productCategoryJeButton && shopProductData ) {
    productCategoryJeButton.addEventListener("click", ()=> {

        let jeweleryItems = shopProductData.filter((product)=> {
            if (product.category.toLowerCase() === "jewelery") {
                return product;
            };
        }); 
        if (jeweleryItems) {
            productSection.innerHTML = "";
            putDataIntoDom(jeweleryItems);
        };
    });
};


//men's clothes
if (productSection && productCategoryMeButton && shopProductData ) {
    productCategoryMeButton.addEventListener("click", ()=> {

        let mensItems = shopProductData.filter((product)=> {
            if (product.category.toLowerCase() === "men's clothing") {
                return product;
            };
        }); 
        if (mensItems) {
            productSection.innerHTML = "";
            putDataIntoDom(mensItems);
        };
    });
};


//women's clothes
if (productSection && productCategoryWoButton && shopProductData ) {
    productCategoryWoButton.addEventListener("click", ()=> {

        let womensItems = shopProductData.filter((product)=> {
            if (product.category.toLowerCase() === "women's clothing") {
                return product;
            };
        }); 
        if (womensItems) {
            productSection.innerHTML = "";
            putDataIntoDom(womensItems);
        };
    });
};



//wieder alle Produkte
if (productSection && productCategoryAllButton && shopProductData ) {
    productCategoryAllButton.addEventListener("click", ()=> {
        productSection.innerHTML = "";
        putDataIntoDom(shopProductData);
    });
};



//!Responsiv gestalten
//!Button, um Warenkorb zu leeren (clear localStorage)
//!Design?