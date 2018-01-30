export type cssSize = number | string;
export type eventType = 'auto' | 'none';
export type formatterFunction = (val: number) => string;
export type numberRange = [number, number];
export type style = object | any[];
export type styleFunction  = (val: number, index: number) => CSSStyleDeclaration;
export type tooltipVisibility = 'hover'|'always'| boolean;
export type tooltipDirection = 'top'|'bottom'|'left'|'right';
