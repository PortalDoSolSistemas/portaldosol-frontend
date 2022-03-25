import { EventEmitter, Injectable } from '@angular/core';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PoSelectHelpers } from 'src/app/shared/po-select-helpers';
import { ResidentsService } from './residents.service';

@Injectable({
  providedIn: 'root'
})
export class ResidentsFilter implements PoComboFilter {
  constructor(private resource: ResidentsService) {}
  emitResidentList = new EventEmitter<any>();

  getFilteredData(
    params: any,
    filterParams?: any
  ): Observable<Array<PoComboOption>> {
    const { value } = params;
    return this.resource.filter(value || null).pipe(
      tap((items: any[]) => this.emitList([...items])),
      map((items: any[]) => {
        return PoSelectHelpers.mapToPoOptions(
          items,
          'id',
          'name'
        );
      })
    );
  }

  getObjectByValue(
    value: string | number,
    filterParams?: any
  ): Observable<PoComboOption> {
    return this.resource.getById(value).pipe(
      map((item) => {
        const data = PoSelectHelpers.mapToPoOptions(
          [item],
          'id',
          'name'
        );
        return data[0];
      }),
    );
  }

  emitList(list) {
    this.emitResidentList.emit(list);
  }

}
