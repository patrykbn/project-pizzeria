import {select, classNames, templates} from '/js/settings.js';
import utils from '/js/utils.js';
import AmountWidget from './amountWidget.js';
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
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;
      //start fucntion: add avent listener to clockable trigger on event click
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        //prevent default action on event
        const activeProduct = document.querySelector('.product.active');
        //find active product (product that has active class)
        thisProduct.element.classList.toggle("active");
        //toggle active class on thisProduct.element
        if(activeProduct == null){ /* tslint:disable:no-empty */
        } else if(thisProduct !== activeProduct){ 
          activeProduct.classList.remove("active");
        //if there is active product and its not thisProduct.element, remove class active from it
      }});
    }

    initOrderForm(){
    const thisProduct = this;

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
    // set price to default price
    let price = thisProduct.data.price;
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // for every option in this category
    for(let optionId in param.options) {
      // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
      const option = param.options[optionId];
      const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
      const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

      if(optionSelected){
        //check if the option is not default
        if(optionImage){
          if(optionSelected){
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
        }
        if(!option.default){
          price = price + option.price;
        } 
      } else {
        if(optionImage){
          optionImage.classList.remove(classNames.menuProduct.imageVisible);
        }
          if(option.default){
            price = price - option.price;
          }
        }
      }
    }
  const priceSingle = price;
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
      return productSummary;
    }

    addToCart(){
      const thisProduct = this;
      //const productSummary = thisProduct.prepareCartProduct();
      //app.cart.add(productSummary);
      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct.prepareCartProduct(),
        },
      }
      );
      thisProduct.element.dispatchEvent(event);
    }

    prepareCartProductParams(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {}

      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {},
        }

      for(let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if(optionSelected){
          params[paramId].options[optionId] = option.label
            }
          }
        }
      return params;
    }    
}

export default Product;