import { PoSelectOption } from '@po-ui/ng-components';

export class PoSelectHelpers {
  static mapToPoOptions(
    options: Array<any>,
    valueKey: string,
    nameKey: string
  ): PoSelectOption[] {
    return options && valueKey && nameKey
      ? options.map(
          (item) =>
            <PoSelectOption>{
              value:
                item[valueKey] != null && item[valueKey] != undefined
                  ? item[valueKey]
                  : '-',
              label: item[nameKey] || '',
            }
        )
      : [];
  }

  static mapToPoOptionsTwoLabels(
    options: Array<any>,
    valueKey: string,
    nameKey: string,
    secondNameKey: string
  ): PoSelectOption[] {
    return options && valueKey && nameKey
      ? options.map(
          (item) =>
            <PoSelectOption>{
              value: item[valueKey] || '-',
              label: `${item[nameKey]} - ${item[secondNameKey]}` || '-',
            }
        )
      : [];
  }
}
