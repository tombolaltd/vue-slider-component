import { style } from '../types';
import { IAdHocData } from './ad-hoc-data';

export interface IItemModel {
    adHocData?: IAdHocData | null;
    leftOffsetStyle: style;
    adHocVerticalOffsetStyle?: style | null;
    adHocMarkerStyle?: style | null;
    index: number;
    value: number;
    item: any;
    label: string;
}
