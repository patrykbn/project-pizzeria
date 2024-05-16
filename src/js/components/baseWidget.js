import { settings } from "/js/settings.js";
class BaseWidget{
    constructor(wrapperElement, initialValue){
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.correctValue = initialValue;
    }

    get value(){
        const thisWidget = this;

        return thisWidget.correctValue;
    }

    set value(value){
        const thisWidget = this;
        if(!thisWidget.dom.input.value){
          thisWidget.dom.input.value = thisWidget.parseValue(settings.amountWidget.defaultValue);
          value = thisWidget.parseValue(settings.amountWidget.defaultValue);
        }
        const newValue = thisWidget.parseValue(value);
        //TODO: add validation
        if(thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)) {
          thisWidget.correctValue = newValue;
          thisWidget.announce(value);
        }
        thisWidget.renderValue();
      }

      setValue(value){
        const thisWidget = this;
        thisWidget.value = value;
      }
      
    parseValue(value){
        return parseInt(value);
      }
  
      isValid(value){
        return !isNaN(value);
      }
      renderValue(){
        const thisWidget = this;
  
        thisWidget.dom.wrapper.innerHTML = thisWidget.value;
      }
      announce(){
        const thisWidget = this;
  
        const event = new CustomEvent('updated', {
          bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
      }
}

export default BaseWidget;