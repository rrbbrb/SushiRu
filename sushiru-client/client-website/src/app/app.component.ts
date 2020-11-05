import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { ShoppingCartService } from './services/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-website';

  constructor(private translateService: TranslateService, private localStorageService: LocalStorageService) {
    translateService.addLangs(['en', 'zh']);
    const savedLang = this.localStorageService.retrieve('language');
    if (savedLang != null) {
      translateService.setDefaultLang(savedLang);
    } else {
      const browserLang = (translateService.getBrowserLang().includes('zh')) ? 'zh' : 'en';
      this.localStorageService.store('language', browserLang);
      translateService.setDefaultLang(browserLang);
    }
  }
}
