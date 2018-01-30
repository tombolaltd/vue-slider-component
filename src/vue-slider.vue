<template>
  <div ref="wrap" :class="['vue-slider-component', flowDirection, disabledClass, { 'vue-slider-has-label': showItemLabel }]" v-show="show" :style="wrapStyles" @click="wrapClick">
    <div ref="track" aria-hidden="true" class="vue-slider-track" :style="[trackStyles, bgStyle]">
      <template>
        <div ref="dot" :class="[tooltipStatus, 'vue-slider-dot']" :style="[sliderOffsetStyle, sliderStyles]" @mousedown="onMoveStart" @touchstart="onMoveStart" v-cloak>
          <span :class="['vue-slider-tooltip-' + tooltipDirection, 'vue-slider-tooltip-wrap']">
            <slot name="tooltip" :value="val">
              <span class="vue-slider-tooltip" :style="tooltipStyles">{{ formatter ? formatting(val) : val }}</span>
            </slot>
          </span>
        </div>
      </template>
      <ul class="vue-slider-item" v-cloak>
        <li v-for="(itemDynamicStyle, index) in itemDynamicStyling" class="vue-slider-item-container" :style="[itemContainerStyle, itemDynamicStyle.style]" :key="index">
          <slot name="item" :label="itemDynamicStyle.label" :index="index" :first="index === 0" :last="index === itemDynamicStyling.length - 1" :active="itemDynamicStyle.inRange">
            <span v-if="showItems" class="vue-slider-item-dot" :style="itemDynamicStyle.currentStyle"></span>
          </slot>
          <!-- <slot name="adhoc" :label="itemDynamicStyle.label" :index="index" :first="index === 0" :last="index === itemDynamicStyling.length - 1" :active="itemDynamicStyle.inRange">
            <span v-if="showItemLabel" class="vue-slider-item-label" :style="itemDynamicStyle.labelStyle">
              {{ itemDynamicStyle.label }}
            </span>
          </slot> -->
          <slot name="label" :label="itemDynamicStyle.label" :index="index" :first="index === 0" :last="index === itemDynamicStyling.length - 1" :active="itemDynamicStyle.inRange">
            <span v-if="showItemLabel" class="vue-slider-item-label" :style="itemDynamicStyle.labelStyle">
              {{ itemDynamicStyle.label }}
            </span>
          </slot>
        </li>
      </ul>
      <div ref="progress" class="vue-slider-progress" :style="progressBarStyle"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {cssSize, eventType, formatterFunction, numberRange, style, styleFunction, tooltipDirection, tooltipVisibility } from './types';

type VueHTMLElement = Vue & HTMLElement;

import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { PatchedEventListener } from './event-listener-patch';
import { IAdHocData } from './interfaces/ad-hoc-data';
import { IEventPosition } from './interfaces/event-position';

  @Component({ })
  export default class VueSliderComponent extends Vue {

    // @Prop({default: [] })
    // public adHocData: IAdHocData[];

    @Prop({default: null})
    public data: any[] | null;

    @Prop({default: 16})
    public dotSize: number;

    @Prop({default: null})
    public dotWidth: number | null;

    @Prop({default: null})
    public dotHeight: number | null;

    @Prop({default: 0})
    public min: number;

    @Prop({default: 100})
    public max: number;

    @Prop({default: 1})
    public interval: number;

    @Prop({default: true})
    public show: boolean;

    @Prop({default: false})
    public disabled: boolean;

    @Prop({default: true})
    public showItems: boolean;

    @Prop({default: 'always'})
    public tooltip: tooltipVisibility;

    @Prop({default: 'auto'})
    public eventType: eventType;

    @Prop({default: false})
    public reverse: boolean;

    @Prop({default: false})
    public lazy: boolean;

    @Prop({default: true})
    public clickable: boolean;

    @Prop({default: 0.5})
    public speed: number;

    @Prop({default: false})
    public realTime: boolean;

    @Prop({default: false})
    public stopPropagation: boolean;

    @Prop({default: 0})
    public value: number;

    @Prop({default: false})
    public showItemLabel: boolean;

    @Prop({default: process && process.env && process.env.NODE_ENV !== 'production'})
    public debug: boolean;

    @Prop({default: null})
    public sliderStyle: style | styleFunction | null;

    @Prop({default: null})
    public tooltipDir: tooltipDirection | null;

    @Prop()
    public formatter: string | formatterFunction;

    @Prop()
    public itemStyle: object;

    @Prop()
    public progressBarStyle: object;

    @Prop()
    public bgStyle: object;

    @Prop({default: null})
    public tooltipStyle: style | styleFunction | null;

    @Prop()
    public labelStyle: object;

    @Prop()
    public labelActiveStyle: object;

    @Provide()
    private flag: boolean = false;

    @Provide()
    private size: number = 0;

    @Provide()
    private currentValue: number  = 0;

    @Provide()
    private isComponentExists: boolean = true;

    @Prop({default: 'auto'})
    private width: cssSize;

    @Prop({default: 6})
    private height: cssSize;

    private thumb: VueHTMLElement;
    private track: VueHTMLElement;
    private progressBar: VueHTMLElement;

    constructor() {
        super();
    }

    public get dotWidthVal(): number {
        return typeof this.dotWidth === 'number' ? this.dotWidth : this.dotSize;
    }

    public get dotHeightVal(): number {
        return typeof this.dotHeight === 'number' ? this.dotHeight : this.dotSize;
    }

    public get flowDirection(): string {
        return `${ (this.reverse ? 'vue-slider-reverse' : 'vue-slider-normal')}`;
    }

    public get tooltipDirection(): tooltipDirection {
        return this.tooltipDir || 'top';
    }

    public get tooltipStatus(): string {
        return this.tooltip === 'hover' && this.flag ? 'vue-slider-always' : this.tooltip ? `vue-slider-${this.tooltip}` : '';
    }

    public get tooltipClass(): [string, string] {
        return [`vue-slider-tooltip-${this.tooltipDirection}`, 'vue-slider-tooltip'];
    }

    public get isDisabled(): boolean {
        return this.eventType === 'none' ? true : this.disabled;
    }

    public get disabledClass(): string {
        return this.disabled ? 'vue-slider-disabled' : '';
    }

    public get trackContainerStyle(): CSSStyleDeclaration {
      return this.track.style;
    }

    public get sliderContainerHeight(): number {
      if (!this.track)
      {
        return 6;
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

    public get minimum(): number {
        return this.data ? 0 : this.min;
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

    public get currentIndex(): number {
        return (this.currentValue - this.minimum) / this.spacing;
    }

    public get indexRange(): numberRange {
        return [0, this.currentIndex];
    }

    public get maximum (): number {
      return this.data ? (this.data.length - 1) : this.max;
    }

    public get multiple(): number {
      const decimals = `${this.interval}`.split('.')[1];
      return decimals ? Math.pow(10, decimals.length) : 1;
    }

    public get spacing(): number {
        return this.data ? 1 : this.interval;
    }

    public get total(): number {
      if (this.data) {
        return this.data.length - 1;
      } else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
        this.printError('[VueSlider error]: Prop[interval] is illegal, Please make sure that the interval can be divisible');
      }
      return (this.maximum - this.minimum) / this.interval;
    }

    public get gap(): number {
        return (this.size - (this.dotSize || 0)) / this.total;
    }

    public get position(): number {
        return ((this.currentValue - this.minimum) / this.spacing * this.gap);
    }

    public get limit(): numberRange {
        return [0, this.size];
    }

    public get valueLimit(): numberRange {
        return [this.minimum, this.maximum];
    }

    public get wrapStyles(): style {
        return {
          width: typeof this.width === 'number' ? `${this.width}px` : this.width,
          padding: `${this.dotHeightVal / 2}px ${this.dotWidthVal / 2}px`
        };
    }

    public get sliderStyles(): style | null {
        if (typeof this.sliderStyle === 'function') {
          return this.sliderStyle(this.val, this.currentIndex);
        } else {
          return this.sliderStyle;
        }
    }

    public get sliderOffsetStyle(): style {
      if (this.reverse){
        return {
          left: `${this.size - (this.dotSize * 1.5)}px`
        };
      }
      return {
        left: `${this.dotSize / 2}px`
      };
    }

    public get tooltipStyles(): style | null {
        if (typeof this.tooltipStyle === 'function') {
          return this.tooltipStyle(this.val, this.currentIndex);
        }
        else {
          return this.tooltipStyle;
        }
    }

    public get trackStyles(): style {
      const baseStyle: style = {
        height: `${this.height}px`
      };
      return baseStyle;
    }

    public get itemContainerStyle(): style {
        return {
          width: `${this.height}px`,
          height: `${this.height}px`
        };
    }

    public get itemDynamicStyling(): Array<{currentStyle: style, label: string}> | boolean {
        if (!(this.showItems || this.showItemLabel)) {
          return false;
        }

        const arr = [];
        for (let i = 0; i <= this.total; i++) {
          const position =  (this.gap * i) + 8;
          const currentStyle: style = {
              left: `${[position]}px`
          };

          const index = this.reverse ? (this.total - i) : i;
          const label = this.data ? this.data[index] : (this.spacing * index) + this.min;
          arr.push({
            currentStyle,
            label: this.formatter ? this.formatting(label) : label,
          });
        }

        return arr;
    }

    @Watch('value', { immediate: true, deep: true })
    public onValueChanged(val: number): void {
        this.flag || this.setValue(val, true);
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

    public updateSliderStyle(): void {
      this.thumb.style.width = `${this.dotWidthVal}px`;
      this.thumb.style.height = `${this.dotHeightVal}px`;
      // this.thumb.style.left =  `${(-(this.dotWidthVal / 4))}px`;  /*`${(-(this.dotWidthVal - this.sliderContainerWidth) / 2)}px`;*/
    }

    public bindEvents(): void {
      const patchedAddEventListener = document.addEventListener as PatchedEventListener;
      patchedAddEventListener('touchmove', this.onTouchMove, {passive: false});
      patchedAddEventListener('touchend', this.onMoveEnd, {passive: false});
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMoveEnd);
      document.addEventListener('mouseleave', this.onMoveEnd);

      window.addEventListener('resize', this.refresh);
    }

    public unbindEvents(): void {
      window.removeEventListener('resize', this.refresh);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMoveEnd);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMoveEnd);
      document.removeEventListener('mouseleave', this.onMoveEnd);
    }

    public formatting (value: any): string {
      return typeof this.formatter === 'string' ? this.formatter.replace(/\{value\}/, value) : this.formatter(value);
    }

    public getItemPosition(e: IEventPosition): number {
      if (this.realTime) {
        // Force update of static data
        this.updateTrackSize();
      }

      return this.reverse ? (this.size - (e.clientX - this.thumb.clientWidth)) : (e.clientX - (2 * this.thumb.clientWidth));
    }

    public wrapClick (e: IEventPosition): boolean {
      if (this.isDisabled || !this.clickable) {
        return false;
      }
      const pos = this.getItemPosition(e);
      this.setValueOnPos(pos);
      return true;
    }

    public onMoveStart (e: UIEvent, index: number): void {
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

    public onMouseMove (event: MouseEvent): void {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (!this.flag) {
        return;
      }

      event.preventDefault();

      this.setValueOnPos(this.getItemPosition(event), true);
    }

    public onTouchMove (event: TouchEvent): void {
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

    public onMoveEnd (event: UIEvent): void {
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

    public setValueOnPos (pos: number, isDrag?: boolean): void {
      const range = this.limit;
      const valueRange =  this.valueLimit;
      if (pos >= range[0] && pos <= range[1]) {
        this.setTransform(pos);
        const v = (Math.round(pos / this.gap) * (this.spacing * this.multiple) + (this.minimum * this.multiple)) / this.multiple;
        this.setCurrentValue(v, isDrag);
      } else if (pos < range[0]) {
        this.setTransform(range[0]);
        this.setCurrentValue(valueRange[0]);
      } else {
        this.setTransform(range[1]);
        this.setCurrentValue(valueRange[1]);
      }
    }

    public isDiff (a: any, b: any): boolean {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true;
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i]);
      }
      return a !== b;
    }

    public setCurrentValue (val: number, skipPositionSet?: boolean): boolean {
      if (val < this.minimum || val > this.maximum) {
        return false;
      }
      if (this.isDiff(this.currentValue, val)) {
        this.currentValue = val;
        if (!this.lazy || !this.flag) {
          this.syncValue();
        }
      }
      skipPositionSet || this.setPosition();
      return true;
    }

    public setIndex (val: number): void {
        val = this.spacing * val + this.minimum;
        this.setCurrentValue(val);
    }

    public setValue (val: number, noCallback?: any, speed?: number): void {
      if (this.isDiff(this.val, val)) {
        const resetVal = this.limitValue(val);
        this.val = resetVal;
        this.syncValue(noCallback);
      }
      this.$nextTick(() => this.setPosition(speed));
    }

    public setPosition (speed?: number): void {
      this.flag || this.setTransitionTime(speed === undefined ? this.speed : speed);
      this.setTransform(this.position);
      this.flag || this.setTransitionTime(0);
    }

    public setTransform (position: number): void {
      const value = (position - (this.dotWidthVal / 2)) * (this.reverse ? -1 : 1);
      const translateValue =  `translateX(${value}px)`;
      const progressSize = `${this.position - position}px`;
      const progressPos = `${position}px`;

      this.thumb.style.transform = translateValue;
      this.thumb.style.webkitTransform = translateValue;
      // this.trackContainerStyle.msTransform = translateValue;
      this.progressBar.style.width = `${position + this.dotSize}px`;
      this.progressBar.style[this.reverse ? 'right' : 'left'] = '0';
    }

    public setTransitionTime(time: number): void {
      this.trackContainerStyle.transitionDuration = `${time}s`;
      this.trackContainerStyle.webkitTransitionDuration = `${time}s`;
      this.progressBar.style.transitionDuration = `${time}s`;
      this.progressBar.style.webkitTransitionDuration = `${time}s`;
    }

    public limitValue(val: number): any {
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

    public syncValue(noCallback?: boolean): void {
      const val =  this.val;
      this.$emit('input', val);
      noCallback || this.$emit('callback', val);
    }

    public getValue(): number {
      return this.val;
    }

    public getIndex(): number {
      return this.currentIndex;
    }

    public updateTrackSize(): any {
      const element = this.track;
      if (element) {
        this.size = element.offsetWidth;
      }
    }

    public refresh(): void {
      if (this.track) {
        this.updateTrackSize();
        this.setPosition();
      }
    }

    public printError(msg: string): void {
      if (this.debug) {
        /* tslint:disable:no-console */
        console.error(msg);
        /* tslint:enable:no-console */
      }
    }

    public mounted(): void {
      this.track = this.$refs.track as VueHTMLElement;
      this.thumb = this.$refs.dot as VueHTMLElement;
      this.progressBar = this.$refs.progress as VueHTMLElement;
      this.isComponentExists = true;

      this.updateSliderStyle();
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
  }
</script>

<style lang="less">
  //TODO: lessify
  .vue-slider-component {
    position: relative;
    box-sizing: border-box;
    user-select: none;
    &.vue-slider-disabled {
      opacity: .5;
      cursor: not-allowed;
       .vue-slider-dot {
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
      .vue-slider-dot {
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
      .vue-slider-dot {
        right: 0;
      }
    }
    .vue-slider-track {
      position: relative;
      display: block;
      border-radius: 15px;
      background-color: #ccc;
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
      border-radius: 15px;
      background-color: #3498db;
      transition: all 0s;
      z-index: 1;
      width: 0;
      height: 100%;
      top: 0;
      will-change: width;
    }
    .vue-slider-dot {
      position: absolute;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
      transition: all 0s;
      will-change: transform;
      cursor: pointer;
      z-index: 3;
      &.vue-slider-hover:hover .vue-slider-tooltip-wrap {
        display: block;
      }
      &.vue-slider-always .vue-slider-tooltip-wrap {
        display: block!important;
      }
    }
    .vue-slider-tooltip-wrap {
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
      width: 25%;
      height: 25%;
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      transform: translate(-50%, -50%);
        z-index: 2;
      transition: all .3s;
    }
    .vue-slider-tooltip {
      display: block;
      font-size: 14px;
      white-space: nowrap;
      padding: 2px 5px;
      min-width: 20px;
      text-align: center;
      color: #fff;
      border-radius: 5px;
      border: 1px solid #3498db;
      background-color: #3498db;
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
