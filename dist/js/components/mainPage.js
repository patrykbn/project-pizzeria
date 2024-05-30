import {templates, settings} from "/js/settings.js";
//import Flickity from "/vendor/flickity.pkgd.js";

class mainPage{
    constructor(element){
        const thisMainPage = this;

        thisMainPage.renderMainPage(element);
    }

    async renderMainPage(element) {
        const thisMainPage = this;
        const url = `${settings.db.url}/${settings.db.homePage}`;
        console.log('Fetching data from URL:', url);
        
        
        const response = await fetch(url);
        
        const data = await response.json();
        console.log('Fetched data:', data);

        const homePageData = data[0];
        const generatedHTML = templates.homePage(homePageData);

        thisMainPage.dom = {};
        thisMainPage.dom.wrapper = element;
        thisMainPage.dom.wrapper.innerHTML = generatedHTML;

        thisMainPage.rednerCarousel();
    }
    rednerCarousel(){
      const thisMainPage = this;
      var elem = document.querySelector('.main-carousel');
      var flkty = new Flickity( elem, {
      autoPlay: 'true',
      reset: 'true',
      cellAlign: 'left',
      contain: true
    });
    }
}

export default mainPage;