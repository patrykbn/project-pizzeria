  import {settings, select, classNames} from './settings.js';
  import Product from './components/product.js';
  import cart from './components/cart.js';
  import Booking from './components/booking.js';
  import mainPage from './components/mainPage.js';
  const app = {
    initPages: function(){
      const thisApp = this;

      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      
      const idFromHash = window.location.hash.replace('#/', '');

      let pageMatchingHash = thisApp.pages[0].id;

      for(let page of thisApp.pages){
        if(page.id == idFromHash){
          pageMatchingHash = page.id;
          break;
        }
      }

      thisApp.activatePage(pageMatchingHash);

      for(let link of thisApp.navLinks){
        link.addEventListener('click', function(event){
          const clickedElement = this;
          event.preventDefault();
          
          //get page id from href attribute
          const id = clickedElement.getAttribute('href').replace('#','');
          //rin thisApp.activatePage with that id
          thisApp.activatePage(id);

          // change URL hash
          window.location.hash = '#/' + id;
        });
      }
    },

    activatePage: function(pageId){
      const thisApp = this;

      // add class "active" to matching pages, remove from non-matching
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id == pageId);
      }
      // add class "active" to matching links, remofe from non-matching
      for(let link of thisApp.navLinks){
        link.classList.toggle(
          classNames.nav.active, 
          link.getAttribute('href') == '#' + pageId);
      }
    },

    initMenu: function(){
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
       fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          thisApp.data.products = parsedResponse;
          // save parsedResponse as thisApp.data.products
          thisApp.initMenu();
          // execute initMenu method
        });
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });
    },

    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initPages();

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
      thisApp.initBooking();
      thisApp.initHome();
    },

    initBooking: function(){
      const thisApp = this;
      const bookingContainer = document.querySelector(select.containerOf.booking);
      thisApp.Booking = new Booking(bookingContainer);
      console.log(thisApp.Booking)
    },
    
    initHome: function(){
      const thisApp = this;
      const mainPageContainer = document.querySelector(select.containerOf.mainPage);
      thisApp.home = new mainPage(mainPageContainer)
    }

  };

  app.init();

  export default app;