import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        HelpRoutingModule,
        FormsModule
    ],
    declarations: [HelpComponent]
})
export class HelpModule { }
