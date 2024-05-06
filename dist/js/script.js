/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
    templateOf: {
      menuProduct: "#template-menu-product",
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: { //NEW CODE
      defaultDeliveryFee: 20,
    },//NEW CODE END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id= id;
      thisProduct.data= data;

      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();

      thisProduct.initOrderForm();

      thisProduct.initAmountWidget();

      thisProduct.processOrder();

      thisProduct.prepareCartProduct();

      thisProduct.prepareCartProductParams();

      //console.log('new product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);
      // generate HTML based on template
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      // create element using utils.createElementFromHTML
      const menuContainer = document.querySelector(select.containerOf.menu);
      // find menu container
      menuContainer.appendChild(thisProduct.element);
      // add element to menu
    }
    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('accordionTrigger', thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      //console.log('form', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      //console.log('allformInputs', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      //console.log('cartButton', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      //console.log('priceElem', thisProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      //console.log('imageWrapper', thisProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;
      //console.log('this', this);
      
      //find clickable trigger (the element that shoulkd react to clicking)
      //const clickableTrigger = this.element.querySelector(select.menuProduct.clickable);
      //console.log('clickableTrigger', clickableTrigger);

      //start fucntion: add avent listener to clockable trigger on event click
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        //prevent default action on event
        const activeProduct = document.querySelector('.product.active');
        //console.log('activeProduct', activeProduct);
        //console.log('this', thisProduct);
        //find active product (product that has active class)
        thisProduct.element.classList.toggle("active");
        //toggle active class on thisProduct.element

        if(activeProduct == null){
          //console.log('variable is null');
        } else if(thisProduct !== activeProduct) {
          activeProduct.classList.remove("active");
          //console.log('removed!');
        }
        //if there is active product and its not thisProduct.element, remove class active from it
      });
    }

    initOrderForm(){
    const thisProduct = this;
    //console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
    }

    processOrder(){
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);

    // set price to default price
    let price = thisProduct.data.price;
    //console.log('price', price);

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      //console.log(paramId, param);

      // for every option in this category
    for(let optionId in param.options) {
      // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
      const option = param.options[optionId];
      //console.log(optionId, option);
      //console.log('test', formData[paramId]);
      //console.log('test2', option['default']);
      const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
      //console.log('optionImage', optionImage);
      const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

      if(optionSelected){
        //console.log('this option is included');
        //check if the option is not default
        if(optionImage){
          //console.log('image found!')
          if(optionSelected){
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
        }
        if(!option.default){
          //console.log('nie zawiera default');
          //console.log('price of option', option.price);
          price = price + option.price;
          //console.log('new price', price);
        } 
      } else {
        if(optionImage){
          optionImage.classList.remove(classNames.menuProduct.imageVisible);
        }
          if(option.default){
            //console.log('zawiera default');
            price = price - option.price;
            //console.log('price of option', option.price);
          }
        }
      }
    }
    //console.log('new price', price);
  const priceSingle = price;
  //console.log('price single', priceSingle);
  price *= thisProduct.amountWidget.value;
  // update calculated price in the HTML
  thisProduct.priceElem.innerHTML = price;
  return priceSingle;
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated' , function(){
        thisProduct.processOrder();
      });
    }
    prepareCartProduct(){
      const thisProduct = this;
      //console.log('thisProduct', thisProduct);
      const priceSingle = thisProduct.processOrder();
      const price = priceSingle * parseInt(thisProduct.amountWidget.value)
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: priceSingle,
        price: price,
        params: thisProduct.prepareCartProductParams(),
      };
      //console.log('productSummary', productSummary);
      return productSummary;
    }
    addToCart(){
      const thisProduct = this;
      const productSummary = thisProduct.prepareCartProduct();
      app.cart.add(productSummary);
      //console.log('add to cart' , productSummary);
    }
    prepareCartProductParams(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);
      const params = {}

      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        //console.log('param', param);
        params[paramId] = {
          label: param.label,
          options: {},
        }

      for(let optionId in param.options) {
        const option = param.options[optionId];
        //console.log('option', option);
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        //console.log('optionSelected', optionSelected);
        if(optionSelected){
          params[paramId].options[optionId] = option.label
            }
          }
        }
      
      //console.log('params nowe' , params);
      return params;
    }    
}
  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      //console.log('AmountWidget:' , thisWidget);
      //console.log('constructor arguments:' , element);

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
    }
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value){
      const thisWidget = this;
      if(!thisWidget.input.value){
        thisWidget.input.value = parseInt(settings.amountWidget.defaultValue);
        value = parseInt(settings.amountWidget.defaultValue);
      }
      const newValue = parseInt(value);
      //console.log('newValue', newValue);
      //TODO: add validation
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= parseInt(settings.amountWidget.defaultMin) && newValue <= parseInt(settings.amountWidget.defaultMax)) {
        thisWidget.value = newValue;
        //console.log('opcja2', newValue);
        thisWidget.announce(value);
      }
      //console.log('opcja3', thisWidget.value);
      thisWidget.input.value = thisWidget.value;
    }
    
    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
      //console.log('dziala');
    }

    initActions(){
      
      const thisWidget = this;
      thisWidget.input.addEventListener('change' , function(){
        thisWidget.setValue(this.value);
      });
      thisWidget.linkDecrease.addEventListener('click' , function(){
        const newValue = thisWidget.value -1;
        thisWidget.setValue(newValue)
      });
      thisWidget.linkIncrease.addEventListener('click' , function(){
        const newValue = thisWidget.value +1;
        thisWidget.setValue(newValue)
      });
    }
  }

  class cart {
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      //console.log('new Cart' , thisCart);
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      //console.log('dziala' , thisCart.dom.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      //console.log('sprawdzenie22' , thisCart.dom.productList);
      //console.log('thisCart.dom' , thisCart.dom)
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      console.log('thisCart.dom.deliveryFee', thisCart.dom.deliveryFee)
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      console.log('thisCart.dom.subtotalPrice', thisCart.dom.subtotalPrice)
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      console.log('thisCart.dom.totalPrice', thisCart.dom.totalPrice)
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      console.log('thisCart.dom.totalNumber', thisCart.dom.totalNumber)
    }

    initActions(){
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove' , function(){
        console.log('działa listener remove');
        thisCart.remove(event.detail.cartProduct);
      })
    }

    add(menuProduct){
      console.log('adding product', menuProduct);
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      // generate HTML based on template
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      //console.log('generatedHTML', generatedHTML)
      //console.log('generatedDOM', generatedDOM)
      // create element using utils.createElementFromHTML
      const cartContainer = thisCart.dom.productList;
      // find menu container
      cartContainer.appendChild(generatedDOM);
      // add element to menu

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      //console.log('thisCart.products', thisCart.products);
      thisCart.update();
      console.log('thisCart.products' , thisCart.products);
     }
    update(){
      const thisCart = this;
      const deliveryFee = settings.cart.defaultDeliveryFee;
      console.log('deliveryFee' , deliveryFee);
      let totalNumber = 0;
      let subtotalPrice = 0;
      console.log('thisCart.products', thisCart.products);
      for(let product of thisCart.products){
        console.log('product', product);
        totalNumber += parseInt(product.amount);
        subtotalPrice += parseInt(product.price);
      }
      if(totalNumber > 0){
        thisCart.totalPrice = subtotalPrice + deliveryFee;
      } else{
        thisCart.totalPrice= 0;
      }
        console.log('totalNumber', totalNumber);
        console.log('subtotalPrice', subtotalPrice);
        console.log('thisCart.totalPrice' , thisCart.totalPrice);
        thisCart.dom.deliveryFee.innerHTML = deliveryFee;
        thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
        thisCart.dom.totalPrice.forEach(element => {
          element.innerHTML = thisCart.totalPrice;
          //element = thisCart.totalPrice;
        });
        thisCart.dom.totalNumber.innerHTML = totalNumber;
        console.log('thisCart.dom.deliveryFee', thisCart.dom.deliveryFee);
        console.log('thisCart.dom.subtotalPrice', thisCart.dom.subtotalPrice);
        console.log('thisCart.dom.totalPrice', thisCart.dom.totalPrice);
        console.log('thisCart.dom.totalNumber', thisCart.dom.totalNumber);
    }
    remove(element){
      const thisCart = this;
      console.log('element' , element);
      console.log('thisCart.products' , thisCart.products);
      //const indexOfProduct = thisCart.products.indexof(element);
      //console.log('indexOfProduct' , indexOfProduct);
    }
  }

  class CartProduct {
    constructor(menuProduct, element){
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;

      //const element = thisCart.generatedDOM;
      
      thisCartProduct.getElements(element);
      console.log('thisCartProduct', thisCartProduct);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {}
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

    }
    initAmountWidget(){
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener('updated' , function(){

        //console.log('działa widget w CartProduct', thisCartProduct.dom.amountWidget);
        //console.log('ilosc sztuk w cartProduct', thisCartProduct.amountWidget);
        thisCartProduct.amount = parseInt(thisCartProduct.amountWidget.value);
        //console.log('nowy amount', thisCartProduct.amount);
        const newPrice = parseInt(thisCartProduct.priceSingle *  thisCartProduct.amount);
        thisCartProduct.price = newPrice;
        //console.log('nowy price', thisCartProduct.price);
        thisCartProduct.dom.price.innerHTML = newPrice;
        //console.log('nowy price', thisCartProduct.dom.price);
        //thisProduct.processOrder();
      });

      //console.log('check', thisCartProduct.dom.price);
  }

  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });

    thisCartProduct.dom.wrapper.dispatchEvent(event);
    console.log('dziala remove');
  };

  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click' , function(event){
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click' , function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}
  const app = {
    initMenu: function(){
      const thisApp = this;

      //console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new cart(cartElem);
    },


    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}
