/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
    templateOf: {
      menuProduct: "#template-menu-product",
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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

      thisProduct.processOrder();

      console.log('new product:', thisProduct);
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
      console.log('accordionTrigger', thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      console.log('form', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      console.log('allformInputs', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      console.log('cartButton', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      console.log('priceElem', thisProduct.priceElem);
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
    console.log('initOrderForm');

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
    });
  }

  processOrder(){
    const thisProduct = this;

  // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
  const formData = utils.serializeFormToObject(thisProduct.form);
  console.log('formData', formData);

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
      if(formData[paramId] && formData[paramId].includes(optionId)){
        //console.log('this option is included');
        //check if the option is not default
        
        if(!option.default){
          //console.log('nie zawiera default');
          //console.log('price of option', option.price);
          price = price + option.price;
          //console.log('new price', price);
        } 
      } else {
          if(option.default){
            //console.log('zawiera default');
            price = price - option.price;
            //console.log('price of option', option.price);
          }
        }
          
        
      }
    }
    console.log('new price', price);

  // update calculated price in the HTML
  thisProduct.priceElem.innerHTML = price;
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

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
