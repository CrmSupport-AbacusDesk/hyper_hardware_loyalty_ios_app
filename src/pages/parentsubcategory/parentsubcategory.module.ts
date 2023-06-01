import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentsubcategoryPage } from './parentsubcategory';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    ParentsubcategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ParentsubcategoryPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class ParentsubcategoryPageModule {}
