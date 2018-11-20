import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { FilterPipe } from './filter.pipe';
import { SafePipe } from './safe.pipe';
import { OrderBy } from './orderby.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DatePipe, FilterPipe, SafePipe, OrderBy],
  exports: [DatePipe, FilterPipe, SafePipe, OrderBy]
})
export class PipesModule {
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: PipesModule,
          providers: []
        };
      }
 }
