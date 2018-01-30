<template>
  <div id="app">
    <div class="demo-container">
      <h2>Complex Styling</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :value="value" :progressBarStyle="progressBarStyle" :sliderStyle="sliderStyle" class="tombola-styled" >
      <template slot="tooltip">
         <span class="vue-slider-tooltip">{{ value }} / 90</span>
      </template>
    </vue-slider>
    </div>
    <div class="demo-container">
      <h2>Basic</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :current-value="value" :sliderStyle="sliderStyle" ></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Reversed</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :current-value="value" :sliderStyle="sliderStyle" :reverse="true"></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Tooltip on Hover</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :sliderStyle="sliderStyle" tooltip="hover" ></vue-slider>
    </div>
     <div class="demo-container">
       <h2>Interval & initial value (Different value, Max/Min )</h2>
      <vue-slider :value="5" :height="16" min="0" max="100" :sliderStyle="sliderStyle" :interval="5"></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Disabled</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :current-value="value" :sliderStyle="sliderStyle" :disabled="true" ></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Not Clickable (Just Draggable)</h2>
      <vue-slider v-model="value" :height="16" min="1" max="90" :current-value="value" :sliderStyle="sliderStyle" :clickable="false"></vue-slider>
    </div>

  <div>Current value= {{ value }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import {VueSliderComponent} from '../../src/index';

@Component({
  components: {
    vueSlider: VueSliderComponent
  }
})
export default class App  extends Vue {
  @Provide()
  public value: number = 1;

  @Provide()
  public progressBarStyle: object = {
      display: 'none'
  };

  @Provide()
  public sliderStyle: object = {
    'background-color': '#008080A0',
    'box-shadow': 'none'
  };

  constructor() {
    super();
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
body {
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.vue-slider-component.tombola-styled {
     .vue-slider {
      background-color: #CCCCCC;
    }
    .vue-slider-item-dot {
      background-color: #FFFFFF;
    }
    .vue-slider-tooltip {
      width: 60px;
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32)
    }
}

.header {
  height: 100vh;
  position: relative;
  width:  100%;
  background-color: #151515;
  background-image: -webkit-linear-gradient(-40deg, #000, #999);
  background-image: linear-gradient(-40deg, #000, #999);
  color: #fff;
  text-align: center;
  animation: mymove 2s linear 0s infinite;
}

#app {
  padding: 50px 20px 0;
}

.demo-container {
  h2 {
    margin-bottom: 25px;
  }
}

</style>
