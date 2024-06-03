import {templates, settings} from "../settings.js";
//import Flickity from "/vendor/flickity.pkgd.js";

class mainPage{
    constructor(element){
        //const thisMainPage = this;

        this.renderMainPage(element);
    }

    async renderMainPage(element) {
        const url = `${settings.db.url}/${settings.db.homePage}`;
        console.log('Fetching data from URL:', url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched data:', data);

            const homePageData = data[0];
            const generatedHTML = templates.homePage(homePageData);

            this.dom = {};
            this.dom.wrapper = element;
            this.dom.wrapper.innerHTML = generatedHTML;

            this.renderCarousel();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    renderCarousel(){
      var elem = document.querySelector('.main-carousel');
      // eslint-disable-next-line no-undef
      var flkty = new Flickity( elem, {
      autoPlay: true,
      wrapAround: true,
      cellAlign: 'left',
      contain: true
    });
    console.log(flkty);
    }
}

export default mainPage;