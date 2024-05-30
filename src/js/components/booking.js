import { templates, select , settings, classNames} from "../settings.js";
import AmountWidget from './amountWidget.js';
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
import utils from "../utils.js"


class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.pickedTable = [];
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
    }
    
    getData(){
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.maxDate);
        
        const params = {
            booking: [
                startDateParam,
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam,
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam,
            ],
        };

        //console.log('getData params', params)

        const urls = {
            booking:       settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events   + '?' + params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url + '/' + settings.db.events   + '?' + params.eventsRepeat.join('&'),
        };
        //console.log('getData urls', urls)

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function(allResponses){
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function([bookings, eventsCurrent, eventsRepeat]){
                // console.log(bookings);
                // console.log(eventsCurrent);
                // console.log(eventsRepeat);
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });
    }

    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of bookings){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table)
        }

        for (let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table)
        }

        const minDate = thisBooking.datePickerWidget.minDate;
        const maxDate = thisBooking.datePickerWidget.maxDate;


        for (let item of eventsRepeat){
            if(item.repeat == 'daily'){
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }
        //console.log('thisBooking.booked', thisBooking.booked);

        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table){
        const thisBooking = this;

        if(typeof thisBooking.booked[date] == 'undefined'){
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
            // console.log('loop', hourBlock);
            if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
                thisBooking.booked[date][hourBlock] = [];
            }
            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDOM(){
        const thisBooking = this;

        thisBooking.date = thisBooking.datePickerWidget.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPickerWidget.value);

        let allAvailable = false;

        if(
            typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ){
            allAvailable = true;
        }

        for(let table of thisBooking.dom.tables){
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if(
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    render(element){
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.tableContainer = document.querySelector(select.booking.tableContainer);
        thisBooking.dom.bookTableBTN = document.querySelector(select.booking.bookTableBTN);
        thisBooking.dom.bookingAddress = document.querySelector(select.booking.bookingAddress);
        thisBooking.dom.bookingTel = document.querySelector(select.booking.bookingTel);
        thisBooking.dom.starters = document.querySelectorAll(select.booking.starters);
        console.log('spr1', thisBooking.dom.starters);


    }

    initTables(clickedTable){
        const thisBooking = this;
        thisBooking.pickedTable = [];
        const allTables = document.querySelectorAll(select.booking.tables);
        //console.log("allTables", allTables);
        //console.log("clicked div:", clickedTable);
        if(clickedTable.classList.contains('booked')){
            alert("Table is already booked!");
            return;
        }
        allTables.forEach(table => {
            if(table !== clickedTable && table.classList.contains('picked')) {
                table.classList.remove('picked');
            }
        })
        clickedTable.classList.toggle('picked');
        if (clickedTable.classList.contains('picked')){
            thisBooking.pickedTable.push(clickedTable.getAttribute('data-table'));
            } else {
                thisBooking.pickedTable = [];
            }
        
        //console.log(thisBooking.pickedTable);
        //console.log('thisBooking.dom.bookTableBTN', thisBooking.dom.bookTableBTN);
    }

    tableReset(){
        const thisBooking = this;
        const allTables = document.querySelectorAll(select.booking.tables);
        allTables.forEach(table => {
            table.classList.remove('picked');
        })
        thisBooking.pickedTable = [];
    }

    sendBooking(){
        const thisBooking = this;
        console.log('works');

        const url = settings.db.url + '/' + settings.db.bookings;
        console.log(url);
        const bookingInfo = {
            date: thisBooking.datePickerWidget.value,
            hour: thisBooking.hourPickerWidget.value,
            table: parseInt(thisBooking.pickedTable),
            duration: parseInt(thisBooking.dom.hoursAmount.querySelector('input').value),
            ppl: parseInt(thisBooking.dom.peopleAmount.querySelector('input').value),
            starters: [],
            phone: thisBooking.dom.bookingTel.value.trim(),
            address: thisBooking.dom.bookingAddress.value.trim(),
        }
        thisBooking.dom.starters.forEach(function(checkbox){
            //console.log('działa')
            if(checkbox.checked) {
                bookingInfo.starters.push(checkbox.getAttribute("value"))
            }
        })
        console.log(bookingInfo);

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingInfo)
          };
          
          fetch(url, options)
            .then(function(response){
              return response.json();
            }).then(function(parsedResponse){
              console.log('parsedResponse', parsedResponse);
            });
        
        thisBooking.makeBooked(bookingInfo.date, bookingInfo.hour, bookingInfo.duration, bookingInfo.table)
    }

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('updated' , function(){
            thisBooking.tableReset();
        })

        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('updated' , function(){
            thisBooking.tableReset();
        })

        thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.dom.datePicker.addEventListener('updated', function(){
            thisBooking.tableReset();
        })

        thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.hourPicker.addEventListener('updated', function(){
            thisBooking.tableReset();
        })

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDOM();
        });

        thisBooking.dom.tableContainer.addEventListener('click', function(event){
            event.preventDefault();
            if (event.target.classList.contains('table')){
            thisBooking.initTables(event.target);
            }
        });

        thisBooking.dom.bookTableBTN.addEventListener('click', function(event){
            event.preventDefault();
            //const thisBooking = this;
            if(thisBooking.dom.bookingAddress.value.trim() === '' || thisBooking.dom.bookingTel.value.trim() === ''){
                alert("Address and telephone number are required to book a table!");
            } else if (thisBooking.pickedTable.length === 0){
                alert("Please select a table!");
            } else {
                thisBooking.sendBooking();
            }
        })
    }

}

export default Booking