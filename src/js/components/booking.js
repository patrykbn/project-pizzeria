import { templates, select } from "/js/settings.js";
import AmountWidget from './amountWidget.js';
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";


class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
        //thisBooking.initdatePicker();
        //thisBooking.initHourPicker();
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
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        console.log('1',thisBooking.dom.datePicker)
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
        console.log('2',thisBooking.dom.hourPicker)


    }

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('updated' , function(){})

        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('updated' , function(){})

        thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.dom.datePicker.addEventListener('updated', function(){})

        thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.hourPicker.addEventListener('updated', function(){})
    }

    /*initdatePicker(){
        const thisBooking = this;
        thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);
    }
    initHourPicker(){
        const thisBooking = this;
        thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.HourPicker);
    }*/
}

export default Booking