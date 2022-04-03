import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  order(list: Array<any>, filter: string) {
    if (list) {
      const reg = /[0-9]+/g;

      return [...list].sort((a, b) => {
        const v0 = a[filter]?.replace(reg, (v) => v.padStart(10, '0'));
        const v1 = b[filter]?.replace(reg, (v) => v.padStart(10, '0'));
        if (v0 && v1) {
          return v0.localeCompare(v1);
        }
      });
    }
    return null;
  }

}
