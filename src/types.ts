export type cssSize = number | string;
export type eventType = 'auto' | 'none';
export type formatterFunction = (val: number) => string;
export type numberRange = [number, number];
export type cssStyleDefinition = CSSStyleDeclaration | cssStyleDeclarationFunction | null;
export type cssStyleDeclarationFunction  = (val: number, index: number) => CSSStyleDeclaration;
export type tooltipVisibility = 'hover'|'always'| boolean;
export type tooltipDirection = 'top'|'bottom'|'left'|'right';
