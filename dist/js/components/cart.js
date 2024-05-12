import {select, settings, classNames, templates} from './settings.js';
import utils from './utils.js';
import CartProduct from './components/cartProduct.js';
class cart {
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);

      thisCart.dom.orderForm = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.orderPhone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.orderAddress = thisCart.dom.wrapper.querySelector(select.cart.address);
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
        const indexOfProduct = thisCart.products.indexOf(event.detail.cartProduct);
        thisCart.remove(indexOfProduct);
      });
      thisCart.dom.orderForm.addEventListener('submit' , function(event){
        event.preventDefault();
        thisCart.sendOrder();
      })
    }

    add(menuProduct){
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      // generate HTML based on template
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      // create element using utils.createElementFromHTML
      const cartContainer = thisCart.dom.productList;
      // find menu container
      cartContainer.appendChild(generatedDOM);
      // add element to menu

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
     }
    update(){
      const thisCart = this;
      const deliveryFee = settings.cart.defaultDeliveryFee;
      let totalNumber = 0;
      let subtotalPrice = 0;
      for(let product of thisCart.products){
        totalNumber += parseInt(product.amount);
        subtotalPrice += parseInt(product.price);
      }
      if(totalNumber > 0){
        thisCart.totalPrice = subtotalPrice + deliveryFee;
      } else{
        thisCart.totalPrice= 0;
      }
        thisCart.dom.deliveryFee.innerHTML = deliveryFee;
        thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
        thisCart.dom.totalPrice.forEach(element => {
          element.innerHTML = thisCart.totalPrice;
        });
        thisCart.dom.totalNumber.innerHTML = totalNumber;
        let cartInfo = {
              totalNumber: totalNumber,
              subtotalPrice: subtotalPrice,
              deliveryFee: deliveryFee,
        }
        return cartInfo;
    }
    remove(index){
      const thisCart = this;
      thisCart.products.splice(index, 1);
      let liElements = document.querySelectorAll('ul.cart__order-summary.no-spacing > li');
      let liElementToRemove = liElements[index];
      liElementToRemove.parentNode.removeChild(liElementToRemove);
      thisCart.update();
    }
    sendOrder(){
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      const cartInfo = thisCart.update();
      const payload = {
        address: thisCart.dom.orderAddress.value,
        phone: thisCart.dom.orderPhone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: cartInfo.subtotalPrice,
        totalNumber: cartInfo.totalNumber,
        deliveryFee: cartInfo.deliveryFee,
        products: [],
      };

      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      };
      
      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    }
  }

export default cart;