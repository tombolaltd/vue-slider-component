export declare type cssSize = number | string;
export declare type eventType = 'auto' | 'none';
export declare type formatterFunction = (val: number) => string;
export declare type numberRange = [number, number];
export declare type cssStyleDefinition = CSSStyleDeclaration | cssStyleDeclarationFunction | null;
export declare type cssStyleDeclarationFunction = (val: number, index: number) => CSSStyleDeclaration;
export declare type tooltipVisibility = 'hover' | 'always' | boolean;
export declare type tooltipDirection = 'top' | 'bottom' | 'left' | 'right';
