<template>
  <div :class="['vue-slider-component', flowDirection, disabledClass, { 'vue-slider-has-label': showItemLabel }]" v-show="show" :style="getContainerStyle" >
    <div ref="track" aria-hidden="true" class="vue-slider-track" :style="getTrackStyle" @click="onTrackClick">
      <template>
        <div ref="thumb" :class="[tooltipStatusClass, 'vue-slider-thumb']" :style="[thumbOffsetStyle, getThumbStyle]" @mousedown="onMoveStart" @touchstart="onMoveStart" v-cloak>
          <span :class="['vue-slider-tooltip-' + tooltipDirection, 'vue-slider-tooltip-container']">
            <slot name="tooltip" :value="val">
              <span class="vue-slider-tooltip" :style="[getTooltipStyle]">{{ formatter ? formatting(val) : val }}</span>
            </slot>
          </span>
        </div>
      </template>
      <ul class="vue-slider-item" v-cloak>
        <li v-for="(itemModel, index) in itemModels" class="vue-slider-item-container" :style="[itemContainerStyle, itemModel.style]" :key="index">
          <slot name="item" :label="itemModel.label" :index="index" :first="index === 0" :last="index === itemModels.length - 1" :active="itemModel.inRange">
            <span v-if="showDots" class="vue-slider-item-dot" :style="[itemModel.leftOffsetStyle, getDotStyle]"></span>
          </slot>
          <span :label="itemModel.label" :index="index" :first="index === 0" :last="index === itemModels.length - 1" :active="itemModel.inRange" v-if="showAdHoc">
            <span v-if="itemModel.adHocData" class="vue-slider-ad-hoc-marker" :style="[itemModel.leftOffsetStyle, itemModel.adHocMarkerStyle]" @click="onAdHocClicked(itemModel.adHocData.value, $event)"></span>
            <span v-if="itemModel.adHocData" class="vue-slider-ad-hoc-item" :style="[itemModel.leftOffsetStyle, itemModel.adHocVerticalOffsetStyle]" @click="onAdHocClicked(itemModel.adHocData.value, $event)">
               <slot name="adHoc" :itemModel="itemModel" >{{ itemModel.value }}</slot>
            </span>
          </span>
          <slot name="label" :label="itemModel.label" :index="index" :first="index === 0" :last="index === itemModels.length - 1" :active="itemModel.inRange">
            <span v-if="showItemLabel" class="vue-slider-item-label" :style="itemModel.labelStyle">
              {{ itemModel.label }}
            </span>
          </slot>
        </li>
      </ul>
      <div ref="progress" class="vue-slider-progress" :style="getProgressBarStyle"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {cssSize, cssStyleDeclarationFunction, cssStyleDefinition, eventType, formatterFunction, numberRange, tooltipDirection, tooltipVisibility } from './types';

type VueHTMLElement = Vue & HTMLElement;

import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { PatchedEventListener } from './event-listener-patch';
import { IAdHocData } from './interfaces/ad-hoc-data';
import { IEventPosition } from './interfaces/event-position';
import { IItemModel } from './interfaces/item-model';

  @Component({ })
  export default class VueSliderComponent extends Vue {

    @Prop({default: () => [] })
    public adHocData: IAdHocData[];

    @Prop({default: null})
    public containerStyle: cssStyleDefinition;

    @Prop({default: true})
    public clickable: boolean;

    @Prop({default: null})
    public data: any[] | null;

    @Prop({default: process && process.env && process.env.NODE_ENV !== 'production'})
    public debug: boolean;

    @Prop({default: false})
    public disabled: boolean;

    @Prop()
    public dotStyle: cssStyleDefinition;

    @Prop({default: 'auto'})
    public eventType: eventType;

    @Prop()
    public formatter: string | formatterFunction;

    @Prop({default: 6})
    public height: cssSize;

    @Prop({default: 1})
    public interval: number;

    @Prop()
    public labelStyle: cssStyleDefinition;

    @Prop({default: false})
    public lazy: boolean;

    @Prop({default: 0})
    public min: number;

    @Prop({default: 100})
    public max: number;

    @Prop()
    public progressBarStyle: cssStyleDefinition;

    @Prop({default: false})
    public realTime: boolean;

    @Prop({default: false})
    public reverse: boolean;

    @Prop({default: true})
    public showAdHoc: boolean;

    @Prop({default: true})
    public show: boolean;

    @Prop({default: true})
    public showDots: boolean;

    @Prop({default: false})
    public showItemLabel: boolean;

    @Prop({default: 0.5})
    public speed: number;

    @Prop({default: false})
    public stopPropagation: boolean;

    @Prop({default: null})
    public thumbHeight: number | null;

    @Prop({default: 16})
    public thumbSize: number;

    @Prop({default: null})
    public thumbStyle: cssStyleDefinition;

    @Prop({default: null})
    public thumbWidth: number | null;

    @Prop({default: 'always'})
    public tooltip: tooltipVisibility;

    @Prop({default: null})
    public tooltipDir: tooltipDirection | null;

    @Prop({default: null})
    public tooltipStyle: cssStyleDefinition;

    @Prop()
    public trackStyle: cssStyleDefinition;

    @Prop({default: 0})
    public value: number;

    @Prop({default: 'auto'})
    public width: cssSize;

    @Provide()
    private currentValue: number  = 0;

    @Provide()
    private flag: boolean = false;

    @Provide()
    private isComponentExists: boolean = true;

    @Provide()
    private size: number = 0;

    private thumb: VueHTMLElement;
    private track: VueHTMLElement;
    private progressBar: VueHTMLElement;

    constructor() {
        super();
    }

    public get currentIndex(): number {
        return (this.currentValue - this.minimum) / this.getInterval;
    }

    public get getInterval(): number {
        return this.data ? 1 : this.interval;
    }

    public get gapWidth(): number {
        return (this.size - (this.thumbSize || 0)) / this.total;
    }

    public get isDisabled(): boolean {
        return this.eventType === 'none' ? true : this.disabled;
    }

    public get limit(): numberRange {
        return [0, this.size];
    }

    public get minimum(): number {
        return this.data ? 0 : this.min;
    }

    public get maximum (): number {
      return this.data ? (this.data.length - 1) : this.max;
    }

    public get position(): number {
        return ((this.currentValue - this.minimum) / this.getInterval * this.gapWidth);
    }

    public get sliderContainerHeight(): number {
      if (!this.track)
      {
        return 0;
      }
      return this.track.clientHeight;
    }

    public get sliderContainerWidth(): number {
      if (!this.track)
      {
        return 0;
      }
      return this.track.clientWidth;
    }

    public get thumbWidthVal(): number {
        return typeof this.thumbWidth === 'number' ? this.thumbWidth : this.thumbSize;
    }

    public get thumbHeightVal(): number {
        return typeof this.thumbHeight === 'number' ? this.thumbHeight : this.thumbSize;
    }

    public get total(): number {
      if (this.data) {
        return this.data.length - 1;
      } else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
        this.printError('[VueSlider error]: Prop[interval] is illegal, Please make sure that the interval can be divisible');
      }
      return (this.maximum - this.minimum) / this.interval;
    }

    public get val(): number {
      if (this.data){
        return this.data[this.currentValue];
      }
      return this.currentValue;
    }

    public set val(val: number) {
        if (this.data === null) {
          this.currentValue = val;
        } else {
          const index = this.data.indexOf(val);
          if (index > -1) {
            this.currentValue = index;
          }
        }
    }

    public get valueLimit(): numberRange {
        return [this.minimum, this.maximum];
    }

    private get disabledClass(): string {
        return this.disabled ? 'vue-slider-disabled' : '';
    }

    private get flowDirection(): string {
        return `${ (this.reverse ? 'vue-slider-reverse' : 'vue-slider-normal')}`;
    }

    private get getContainerStyle(): Array<CSSStyleDeclaration | null> {
      const rootContainerStyle = {} as CSSStyleDeclaration;
      rootContainerStyle.width = typeof this.width === 'number' ? `${this.width}px` : this.width,
      rootContainerStyle.padding = `${this.thumbHeightVal / 2}px ${this.thumbWidthVal / 2}px`;
      return [rootContainerStyle, this.unpackStyle(this.containerStyle)];
    }

    private get getDotStyle(): CSSStyleDeclaration | null {
      return this.unpackStyle(this.dotStyle);
    }

    private get getProgressBarStyle(): CSSStyleDeclaration | null {
      return this.unpackStyle(this.progressBarStyle);
    }

    private get getThumbStyle(): CSSStyleDeclaration | null {
      return this.unpackStyle(this.thumbStyle);
    }

    private get getTooltipStyle(): CSSStyleDeclaration | null {
        return this.unpackStyle(this.tooltipStyle);
    }

    private get getTrackStyle(): Array<CSSStyleDeclaration | null> {
      const trackStyle = {} as CSSStyleDeclaration;
      trackStyle.height = `${this.height}px`;
      return [ trackStyle,  this.unpackStyle(this.trackStyle)];
    }

    private get itemContainerStyle(): CSSStyleDeclaration {
      const itemContainerStyle = {} as CSSStyleDeclaration;
      itemContainerStyle.width = `${this.height}px`;
      itemContainerStyle.height = `${this.height}px`;
      return itemContainerStyle;
    }

    private get itemModels(): IItemModel[] | boolean {
        if (!(this.showDots || this.showItemLabel)) {
          return false;
        }

        const arr = [];
        const adHocVerticalOffsetStyle =  {} as CSSStyleDeclaration;
        adHocVerticalOffsetStyle.top =  `${ this.thumbSize * 1.5 }px`;

        const adHocMarkerStyle =  {} as CSSStyleDeclaration;
        adHocMarkerStyle.top = `-${this.thumbSize / 2}px`;
        adHocMarkerStyle.height = `${this.thumbSize * 2}px`;

        for (let i = 0; i <= this.total; i++) {
          const position =  (this.gapWidth * i) + (this.thumbSize / 2);
          const leftOffsetStyle = {} as CSSStyleDeclaration;
          leftOffsetStyle.left = `${[position]}px`;

          const index = this.reverse ? (this.total - i) : i;
          const value =  this.convertIndexToValue(index);
          const adHocData = this.adHocData ? this.adHocData.find((x: IAdHocData) =>  x.value === value) || null : null;
          const item = this.data ? this.data[index] : null;

          const label = this.data ? this.data[index] : (this.getInterval * index) + this.min;
          arr.push({
            adHocData,
            adHocMarkerStyle,
            adHocVerticalOffsetStyle,
            index,
            labelStyle: this.unpackStyle(this.labelStyle),
            leftOffsetStyle,
            value,
            item,
            label: this.formatter ? this.formatting(label) : label
          });
        }

        return arr;
    }

    private get multiple(): number {
      const decimals = `${this.interval}`.split('.')[1];
      return decimals ? Math.pow(10, decimals.length) : 1;
    }

    private get showAdHocData(): boolean {
      return this.showAdHoc;
    }

    private get thumbOffsetStyle(): CSSStyleDeclaration {
      const thumbOffsetStyle = {} as CSSStyleDeclaration;
      if (this.reverse){
          thumbOffsetStyle.left = `${this.size - (this.thumbSize * 1.5)}px`;
      }
      else {
        thumbOffsetStyle.left = `${this.thumbSize / 2}px`;
      }
      return thumbOffsetStyle;
    }

    private get tooltipClass(): [string, string] {
        return [`vue-slider-tooltip-${this.tooltipDirection}`, 'vue-slider-tooltip'];
    }

    private get tooltipDirection(): tooltipDirection {
        return this.tooltipDir || 'top';
    }

    private get tooltipStatusClass(): string {
        return this.tooltip === 'hover' && this.flag ? 'vue-slider-always' : this.tooltip ? `vue-slider-${this.tooltip}` : '';
    }

    private get trackContainerStyle(): CSSStyleDeclaration {
      return this.track.style;
    }

    @Watch('max', { immediate: true, deep: true })
    public onMaxChange (val: number): void {
      if (val < this.min) {
        return this.printError('[VueSlider error]: The maximum value can not be less than the minimum value.');
      }

      const resetVal = this.limitValue(this.val);
      this.setValue(resetVal);
      this.refresh();
    }

    @Watch('min', { immediate: true, deep: true })
    public onMinChange (val: number): void {
        if (val > this.max) {
          return this.printError('[VueSlider error]: The minimum value can not be greater than the maximum value.');
        }

        const resetVal = this.limitValue(this.val);
        this.setValue(resetVal);
        this.refresh();
    }

    @Watch('show', { immediate: true, deep: true })
    public onShowChanged (val: boolean): void{
      if (val && !this.size) {
        this.$nextTick(() => {
          this.refresh();
        });
      }
    }

    @Watch('value', { immediate: true, deep: true })
    public onValueChanged(val: number): void {
        this.flag || this.setValue(val, true);
    }

    public getItemPosition(e: IEventPosition): number {
      if (this.realTime) {
        // Force update of static data
        this.updateTrackSize();
      }

      return this.reverse ? (this.size - (e.clientX - this.thumb.clientWidth)) : (e.clientX - (2 * this.thumb.clientWidth));
    }

    public setIndex (val: number, skipPositionSet?: boolean): void{
      if (val < this.minimum || val > this.maximum) {
        return;
      }
      if (this.isDiff(this.currentValue, val)) {
        this.currentValue = val;
        if (!this.lazy || !this.flag) {
          this.syncValue();
        }
      }
      skipPositionSet || this.setPosition();
      return;
    }

    public setValue (val: number, noCallback?: any, speed?: number): void {
      if (this.isDiff(this.val, val)) {
        const resetVal = this.limitValue(val);
        this.val = resetVal;
        this.syncValue(noCallback);
      }
      this.$nextTick(() => this.setPosition(speed));
    }

    public getValue(): number {
      return this.val;
    }

    public getIndex(): number {
      return this.currentIndex;
    }

    public refresh(): void {
      if (this.track) {
        this.updateTrackSize();
        this.setPosition();
      }
    }

    public mounted(): void {
      this.track = this.$refs.track as VueHTMLElement;
      this.thumb = this.$refs.thumb as VueHTMLElement;
      this.progressBar = this.$refs.progress as VueHTMLElement;
      this.isComponentExists = true;

      this.updateThumbStyle();
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return this.printError('[VueSlider error]: window or document is undefined, can not be initialization.');
      }

      this.$nextTick(() => {
        if (this.isComponentExists) {
          this.updateTrackSize();
          this.setValue(this.limitValue(this.value), true, 0);
          this.bindEvents();
        }
      });
    }

    public beforeDestroy(): void {
      this.isComponentExists = false;
      this.unbindEvents();
    }

    private bindEvents(): void {
      const patchedAddEventListener = document.addEventListener as PatchedEventListener;
      patchedAddEventListener('touchmove', this.onTouchMove, {passive: false});
      patchedAddEventListener('touchend', this.onMoveEnd, {passive: false});
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMoveEnd);
      document.addEventListener('mouseleave', this.onMoveEnd);

      window.addEventListener('resize', this.refresh);
    }

    private unbindEvents(): void {
      window.removeEventListener('resize', this.refresh);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMoveEnd);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMoveEnd);
      document.removeEventListener('mouseleave', this.onMoveEnd);
    }

    private convertIndexToValue(index: number): number {
      const value  = (index * this.interval) + this.minimum;
      return (index * this.interval) + this.minimum;
    }

    private formatting (value: any): string {
      return typeof this.formatter === 'string' ? this.formatter.replace(/\{value\}/, value) : this.formatter(value);
    }

    private isDiff (a: any, b: any): boolean {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true;
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i]);
      }
      return a !== b;
    }

    private limitValue(val: number): any {
      if (this.data) {
        return val;
      }

      const inRange = (v: number) => {
        if (v < this.min) {
          this.printError(`[VueSlider warn]: The value of the slider is ${val}, the minimum value is ${this.min}, the value of this slider can not be less than the minimum value`);
          return this.min;
        } else if (v > this.max) {
          this.printError(`[VueSlider warn]: The value of the slider is ${val}, the maximum value is ${this.max}, the value of this slider can not be greater than the maximum value`);
          return this.max;
        }
        return v;
      };

      return inRange(val);
    }

    private printError(msg: string): void {
      if (this.debug) {
        /* tslint:disable:no-console */
        console.error(msg);
        /* tslint:enable:no-console */
      }
    }

    private onAdHocClicked(val: number, $event: Event): void {
      if (!this.clickable) {
        return;
      }
      $event.stopPropagation();
      this.setIndex(val);
    }

    private onTrackClick (e: IEventPosition): boolean {
      if (this.isDisabled || !this.clickable) {
        return false;
      }
      const pos = this.getItemPosition(e);
      this.setValueOnPos(pos);
      return true;
    }

    private onMoveStart (e: UIEvent, index: number): void {
        if (this.stopPropagation) {
          e.stopPropagation();
        }

        if (this.isDisabled) {
          return;
        }

        this.flag = true;
        this.$emit('drag-start', this);
        return;
    }

    private onMouseMove (event: MouseEvent): void {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (!this.flag) {
        return;
      }

      event.preventDefault();

      this.setValueOnPos(this.getItemPosition(event), true);
    }

    private onTouchMove (event: TouchEvent): void {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (!this.flag) {
        return;
      }

      event.preventDefault();

      if (event.targetTouches[0]) {
        this.setValueOnPos(this.getItemPosition(event.targetTouches[0]), true);
      }
    }

    private onMoveEnd (event: UIEvent): void {
      if (this.stopPropagation) {
        event.stopPropagation();
      }
      if (this.flag) {
        this.$emit('drag-end', this);
        if (this.lazy && this.isDiff(this.val, this.value)) {
          this.syncValue();
        }
        this.flag = false;
        this.setPosition();
      }
    }

    private setPosition (speed?: number): void {
      this.flag || this.setTransitionTime(speed === undefined ? this.speed : speed);
      this.setTransform(this.position);
      this.flag || this.setTransitionTime(0);
    }

    private setTransform (position: number): void {
      const value = (position - (this.thumbWidthVal / 2)) * (this.reverse ? -1 : 1);
      const translateValue =  `translateX(${value}px)`;
      const progressSize = `${this.position - position}px`;
      const progressPos = `${position}px`;

      this.thumb.style.transform = translateValue;
      this.thumb.style.webkitTransform = translateValue;
      // this.trackContainerStyle.msTransform = translateValue;
      this.progressBar.style.width = `${position + this.thumbSize}px`;
      this.progressBar.style[this.reverse ? 'right' : 'left'] = '0';
    }

    private setTransitionTime(time: number): void {
      this.trackContainerStyle.transitionDuration = `${time}s`;
      this.trackContainerStyle.webkitTransitionDuration = `${time}s`;
      this.progressBar.style.transitionDuration = `${time}s`;
      this.progressBar.style.webkitTransitionDuration = `${time}s`;
    }

    private setValueOnPos (pos: number, isDrag?: boolean): void {
      const range = this.limit;
      const valueRange =  this.valueLimit;
      if (pos >= range[0] && pos <= range[1]) {
        this.setTransform(pos);
        const v = (Math.round(pos / this.gapWidth) * (this.getInterval * this.multiple) + (this.minimum * this.multiple)) / this.multiple;
        this.setIndex(v, isDrag);
      } else if (pos < range[0]) {
        this.setTransform(range[0]);
        this.setIndex(valueRange[0]);
      } else {
        this.setTransform(range[1]);
        this.setIndex(valueRange[1]);
      }
    }

    private syncValue(noCallback?: boolean): void {
      const val =  this.val;
      this.$emit('input', val);
      noCallback || this.$emit('callback', val);
    }

    private unpackStyle(definition: cssStyleDefinition ): CSSStyleDeclaration | null {
        if (typeof definition === 'function') {
          return definition(this.val, this.currentIndex);
        }
        else {
          return definition;
        }
    }

    private updateThumbStyle(): void {
      this.thumb.style.width = `${this.thumbWidthVal}px`;
      this.thumb.style.height = `${this.thumbHeightVal}px`;
      // this.thumb.style.left =  `${(-(this.thumbWidthVal / 4))}px`;  /*`${(-(this.thumbWidthVal - this.sliderContainerWidth) / 2)}px`;*/
    }

    private updateTrackSize(): any {
      const element = this.track;
      if (element) {
        this.size = element.offsetWidth;
      }
    }
  }
</script>

<style lang="less">
  //TODO: lessify
  @tooltip-color: #3498db;
  @slider-track-color: #CCCCCC;
  @dot-color: #FFFFFF;

  @border-radius: 5px;
  @fly-out-font-size: 14px;
  @track-border-radius: 15px;
  @ad-hoc-marker-height: 5px;
  @dot-width: 25%;

  .vue-slider-component {
    position: relative;
    box-sizing: border-box;
    user-select: none;
    &.vue-slider-disabled {
      opacity: .5;
      cursor: not-allowed;
       .vue-slider-thumb {
          cursor: not-allowed;
       }
    }
    &.vue-slider-has-label {
      margin-bottom: 15px;
    }
    &.vue-slider-normal {
      .vue-slider-progress {
        left: 0;
      }
      .vue-slider-thumb {
        left: 0;
        z-index: 50;
      }
      .vue-slider-item-label, .vue-slider-component.vue-slider-reverse .vue-slider-item-label {
          position: absolute;
          display: inline-block;
          top: 100%;
          left: 50%;
          white-space: nowrap;
          font-size: 12px;
          color: #333;
          transform: translate(-50%, 8px);
          visibility: visible;
        }
    }
    &.vue-slider-reverse {
      .vue-slider-progress {
        right: 0;  
      }
      .vue-slider-thumb {
        right: 0;
        z-index: 50;
      }
    }
    .vue-slider-track {
      position: relative;
      display: block;
      border-radius: @track-border-radius;
      background-color: @slider-track-color;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
      }
    }
    .vue-slider-progress {
      position: absolute;
      border-radius: @track-border-radius;
      background-color: @tooltip-color;
      transition: all 0s;
      z-index: 1;
      width: 0;
      height: 100%;
      top: 0;
      will-change: width;
    }
    .vue-slider-thumb {
      position: absolute;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
      transition: all 0s;
      will-change: transform;
      cursor: pointer;
      z-index: 3;
      &.vue-slider-hover:hover .vue-slider-tooltip-container {
        display: block;
      }
      &.vue-slider-always .vue-slider-tooltip-container {
        display: block!important;
      }
    }
    .vue-slider-tooltip-container {
      display: none;
      position: absolute;
      z-index: 9;
      &.vue-slider-tooltip-top {
        top: -9px;
        left: 50%;
        transform: translate(-50%, -100%);
        .vue-slider-tooltip::before {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border: 6px solid transparent\0;
          border-top-color: inherit;
          transform: translate(-50%, 0);
        }
      }
      &.vue-slider-tooltip-bottom {
        bottom: -9px;
        left: 50%;
        transform: translate(-50%, 100%);
        .vue-slider-tooltip::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border: 6px solid transparent\0;
          border-bottom-color: inherit;
          transform: translate(-50%, 0);
        }
      }
      &.vue-slider-tooltip-left {
        top: 50%;
        left: -9px;
        transform: translate(-100%, -50%);
        .vue-slider-tooltip::before {
          content: '';
          position: absolute;
          top: 50%;
          right: -10px;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border: 6px solid transparent\0;
          border-left-color: inherit;
          transform: translate(0, -50%);
        }
      }
      &.vue-slider-tooltip-right {
        top: 50%;
        right: -9px;
        transform: translate(100%, -50%);
        .vue-slider-tooltip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -10px;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border: 6px solid transparent\0;
          border-right-color: inherit;
          transform: translate(0, -50%);
        }
      }
    }
    .vue-slider-item-container {
      position: absolute;
      width: 8px;
      height: 8px;
      z-index: 10;

    }
    .vue-slider-item {
      position: absolute;
      width: 100%;
      padding: 0;
      margin: 0;
      left: 0;
      top: 0;
      height: 100%;
      list-style: none;
    }
    .vue-slider-item-dot {
      position: absolute;
      left: 50%;
      top: 50%;
      width: @dot-width;
      height: @dot-width;
      display: inline-block;
      background-color: @dot-color;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      transition: all .3s;
    }
    .vue-slider-ad-hoc-item {
      position: absolute;
      font-size: @fly-out-font-size;
      display: inline-block;
      background-color: @slider-track-color;
      border-radius: @border-radius;
      padding: 0 7px;
      transform: translate(-50%, 0px);
      z-index: -10;
      transition: all .3s;
      color: @dot-color;
      text-align: center;
    }
    .vue-slider-ad-hoc-marker {
      position: absolute;
      width: @dot-width;
      display: inline-block;
      background-color: @slider-track-color;
      padding: 0;
      transform: translate(-50%, 0px);
      z-index: -20;
      transition: all .3s;
    }
    .vue-slider-tooltip {
      display: block;
      font-size: @fly-out-font-size;
      white-space: nowrap;
      padding: 2px 5px;
      min-width: 20px;
      text-align: center;
      color: #fff;
      border-radius: @border-radius;
      border: 1px solid @tooltip-color;
      background-color: @tooltip-color;
    }
    .vue-slider-sr-only {
        clip: rect(1px, 1px, 1px, 1px);
        height: 1px;
        width: 1px;
        overflow: hidden;
        position: absolute !important;
    }
  }
</style>
