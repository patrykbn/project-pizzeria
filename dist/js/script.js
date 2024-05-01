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

      //thisProduct.getElements();

      thisProduct.initAccordion();

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
    /*getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    };*/

    initAccordion(){
      const thisProduct = this;
      //console.log('this', this);
      
      //find clickable trigger (the element that shoulkd react to clicking)
      const clickableTrigger = this.element.querySelector(select.menuProduct.clickable);
      //console.log('clickableTrigger', clickableTrigger);

      //start fucntion: add avent listener to clockable trigger on event click
      clickableTrigger.addEventListener('click', function(event){
        event.preventDefault();
        //prevent default action on event
        const activeProduct = document.querySelector('.product.active');
        console.log('activeProduct', activeProduct);
        console.log('this', thisProduct);
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
  };
};



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