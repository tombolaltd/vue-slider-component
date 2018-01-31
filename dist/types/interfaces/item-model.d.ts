import { IAdHocData } from './ad-hoc-data';
export interface IItemModel {
    adHocData?: IAdHocData | null;
    adHocMarkerStyle?: CSSStyleDeclaration | null;
    adHocVerticalOffsetStyle?: CSSStyleDeclaration | null;
    index: number;
    item: any;
    label: string;
    labelStyle?: CSSStyleDeclaration | null;
    leftOffsetStyle: CSSStyleDeclaration;
    value: number;
}
