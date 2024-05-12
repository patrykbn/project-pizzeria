import {select, settings} from './settings.js';
class AmountWidget{
    constructor(element){
      const thisWidget = this;

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
      //TODO: add validation
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= parseInt(settings.amountWidget.defaultMin) && newValue <= parseInt(settings.amountWidget.defaultMax)) {
        thisWidget.value = newValue;
        thisWidget.announce(value);
      }
      thisWidget.input.value = thisWidget.value;
    }
    
    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
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

  export default AmountWidget;