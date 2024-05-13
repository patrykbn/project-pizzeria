import { templates, select } from "/js/settings.js";
import AmountWidget from './amountWidget.js';


class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element){
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        console.log('spr', this)
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    }

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('updated' , function(){})

        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('updated' , function(){})

    }
}

export default Booking