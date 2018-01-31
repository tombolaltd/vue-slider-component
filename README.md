# vue-slider-component
This is a vastly simplified and typescript-based/importable fork of the vue-slider-component. The option to support ranged (with two thumbs) and vertical (not horizontal :) ) sliders have been removed, as these are not use cases for us and it greatly reduces the amount of code needed. Some key differences:

* Dropped Vue 1.x support
* The thing you slide is called "thumb" (previously "dot" and "slider")
* The thing you slide on is called "track" (previously "elem")
* The default blue bar has been renamed "progress" (previously "process")
* The tooltip is not re-named.
* Additional "Add hoc" - specify the value these relate to and any data you want in the template. When specified, a fly-out will appear under the track, allowing highlighting of important items

This has only been tested via the demo - other scenerios may not work, nor have other versions of vue been tested. There is some work still to do - the code is currently too monolithic for my liking, partly as it has no notion of a model (though arguably the separation between viewmodel and model is blurred in a pure component). There is some repeated code surrounding calculations (e.g. halving the thumb size to find its centre).


## Install
``` bash
npm install git://github.com/tombolaltd/leading-line-remover-loader.git#1.0.0 --save
```

## Exceptions
if the component initialization in a `v-show="false" / display: none` container or use `transform / animation / margin` to change the location of the component, there may be an exception ( The slider cannot be used, because the component can not initialize the size or slider position ).

The solution:
 1. using `v-if` instead of `v-show` or `display: none`.
 2. use prop `show` to control display.
 3. After the component appears, to call the `refresh` method.

Example: <https://jsfiddle.net/2xy72dod/254/>

## Demo
Run
```
npm run dev
```
The demo is available on localhost:08080
## Usage

Import the component from the UMD, and include the component in HTML. The demo examples provide a more exhaustive guide - there are lots of configuration options even in this cut down verison.
<br>

## Options

### Props

| Props           | Type          | Default  | Description  |
| ------------------ |:--------------| ---------|--------------|
| adHocData          | IAdHocData    | null     | Allows the creation of ad-hoc call outs, a slot is provided to format, otheriwse the value is displayed |
| event-type         | String        | auto     | the event type, optional value: ['auto', 'none'] |
| width              | CSSSize       | auto     | width of the component |
| height             | CSSSize       | 6        | height of the component |
| thumb-size         | Number        | 16       | determines width and height of the slider thumb. See  also `thumb-width` & `thumb-height` props |
| thumb-width        | Number        | value of `thumb-size` prop | width of slider's thumb. if specified, overrides value of `thumb-size` |
| thumb-height       | Number        | value of `thumb-size` prop | height of slider's thumb. if specified, overrides value of `dot-thumb` |
| min                | Number        | 0        | the minimum value   |
| max                | Number        | 100      | the maximum value   |
| interval           | Number        | 1        | the interval between the values, must be a factor of max - min |
| show               | Boolean       | true     | show the component |
| show-ad-hoc        | Boolean       | true     | show the ad-hoc-data flyout |
| showDots           | Boolean       | true     | show the trackbar dots |
| show-item-label    | Boolean       | false    | show item lables |
| speed              | Number        | 0.5      | transition time |
| disabled           | Boolean       | false    | whether to disable components |
| debug              | Boolean       | process.env.NODE_ENV !== 'production' | `debug="true"` will print errors in the console |
| item               | Boolean       | false    | whether to display the item |
| item-label         | Boolean       | false    | whether to display the item |
| tooltip            | String, Boolean | always    | control the tooltip, optional value: ['hover', 'always', false] |
| tooltip-dir        | String[,Array(in range model) | top | set the direction of the tooltip, optional value: ['top', 'bottom', 'left', 'right'] |
| tooltip-visibility | 'hover', 'always', Boolean | 'always'| sets the visibility of the tooltip above the bar |
| reverse            | Boolean       | false    | reverse the component (Right to left) |
| value              | Number,Array  | 0        | initial value (if the value for the array open range model) |
| data               | Array         | null     | the custom data. |
| clickable          | Boolean       | true     | Whether or not the slider is clickable as well as drag-able |
| stop-propagation   | Boolean       | false    | All events call `stopPropagation` |
| real-time          | Boolean       | false    | Whether the real-time computing the layout of the components |
| lazy                | Boolean       | false    | At the end of the drag and drop, to synchronization value (if each update to high consumption of operation (such as Ajax), it is more useful) |
| formatter          | String,Function | null   | Formatting a tooltip values, Example: `formatter='¥{value}'` or `` formatter: (v) => `¥${v}` ``. |
| track-style        | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the trackbar/background. |
| thumb-style        | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the slider thumb. |
| progress-bar-style | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the progress bar. |
| dot-style          | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the piecewise dot. |
| tooltip-style      | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the tooltip. |
| label-style        | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the label. |
| ad-hoc-style       | CSSStyleDeclaration,  null, Function<Value, Index> | null  | The style of the ad-hoc data box. |

Note that, in general, styles can be defined directly, or are functions which have the value and index passed which return a CSSStyleDeclaration. That latter can be used to change style according to value, though this is untested by the demo.

### Function
| Name        | Type           | Description                |
| ----------- |:---------------| ---------------------------|
| setValue    | Params: value [, noCallback] | set value of the component |
| setIndex    | Params: index* | set index of the component |
| getValue    | Return: value  | get value of the component |
| getIndex    | Return: index* | get index of the component |
| refresh     | null           | Refresh the component      |

* [ index ] is the index to the array in the custom data model *
* [ index ] is equal to (( value - min ) / interval ) in normal mode *

### Events
| Name          | Type          | Description  |
| --------------|:--------------|--------------|
| callback      | Params: value[Number]  | values change when the callback function |
| drag-start    | Params: context[Object]| Drag the start event |
| drag-end      | Params: context[Object]| Drag the end event |

### Slot
| Name          | Description  |
| --------------|--------------|
| tooltip       | Customize the tooltip slot. optional value: [`value`, `index`(only range model)]  |
| item          | Customize the item slot. optional value: [`label`, `index`, `active`, `first`, `last`] |
| label         | Customize the label slot. optional value: [`label`, `index`, `active`, `first`, `last`] |
| adHoc         | Customize the ad-hoc data fly-out, this is scoped. An ItemModel is supplied per element |


## License

[MIT](LICENSE)
