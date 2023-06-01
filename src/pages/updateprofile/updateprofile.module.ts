import { NgModule } from '@angular/core';
import { IonicPageModule,Loading } from 'ionic-angular';
import { UpdateprofilePage } from './updateprofile';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    UpdateprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateprofilePage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class UpdateprofilePageModule {
  
}
