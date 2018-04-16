import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { FilterPipe } from './filter.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DatePipe, FilterPipe, SafePipe],
  exports: [DatePipe, FilterPipe, SafePipe]
})
export class PipesModule {
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: PipesModule,
          providers: []
        };
      }
 }
