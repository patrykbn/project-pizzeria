import {select, settings} from '../settings.js';
import BaseWidget from './baseWidget.js';
class AmountWidget extends BaseWidget{
    constructor(element){
      super(element, parseInt(settings.amountWidget.defaultValue));
      const thisWidget = this;

      thisWidget.getElements(element);
      //console.log('thisWidget', thisWidget);
      thisWidget.initActions();
    }
    getElements(){
      const thisWidget = this;

      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    isValid(value){
      return !isNaN(value) 
      && value >= parseInt(settings.amountWidget.defaultMin) 
      && value <= parseInt(settings.amountWidget.defaultMax)
    }
    renderValue(){
      const thisWidget = this;

      thisWidget.dom.input.value = thisWidget.value;
    }
    
    initActions(){
      
      const thisWidget = this;
      thisWidget.dom.input.addEventListener('change' , function(){
        //thisWidget.setValue(thisWidget.dom.input.value);
        thisWidget.value = thisWidget.dom.input.value;
      });
      thisWidget.dom.linkDecrease.addEventListener('click' , function(){
        const newValue = thisWidget.value -1;
        thisWidget.setValue(newValue)
      });
      thisWidget.dom.linkIncrease.addEventListener('click' , function(){
        const newValue = thisWidget.value +1;
        thisWidget.setValue(newValue)
      });
    }
  }

  export default AmountWidget;