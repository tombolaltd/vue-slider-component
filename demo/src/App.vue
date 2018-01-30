<template>
  <div id="app">
    <div class="demo-container complex">
      <h2>Complex Styling</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :value="value" :progressBarStyle="progressBarStyle" class="tombola-styled" :ad-hoc-data="adHocData" >
      <template slot="tooltip">
         <span class="vue-slider-tooltip">{{ value }} / 90</span>
      </template>
      <template slot="adHoc" scope="props">
        <span class="additional-info">{{props.itemModel.adHocData.data.prize}}: {{ props.itemModel.adHocData.value }}
          <span class="additional-info-text">
              <div v-for="(winner, index) in props.itemModel.adHocData.data.winners" :index="index">{{ winner }}</div>
              <!-- <div>{{ props.itemModel.adHocData.data.winners }}</div> -->
          </span>
        </span>
      </template>
    </vue-slider>
    </div>
    <div class="demo-container complex">
      <h2>Reversed Complex Styling</h2>
      <vue-slider v-model="value" :reverse="true" :height="16" :min="1" :max="90" :value="value" :progressBarStyle="progressBarStyle" :thumbStyle="thumbStyle" :ad-hoc-data="adHocData" >
      <template slot="tooltip">
         <span class="vue-slider-tooltip">{{ value }} / 90</span>
      </template>
    </vue-slider>
    </div>
    <div class="demo-container">
      <h2>Basic</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" ></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Reversed</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :thumbStyle="thumbStyle" :reverse="true"></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Tooltip on Hover</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :thumbStyle="thumbStyle" tooltip="hover"></vue-slider>
    </div>
     <div class="demo-container">
       <h2>Interval &amp; initial value (Different value, max &amp; min )</h2>
      <vue-slider :value="5" :height="16" :min="0" :max="100" :thumbStyle="thumbStyle" :interval="5"></vue-slider>
    </div>
    <div class="demo-container">
      <h2>Disabled</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :thumbStyle="thumbStyle" :disabled="true" ></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Not Clickable (Just Draggable)</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :thumbStyle="thumbStyle" :clickable="false"></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Dot Style</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :dotStyle="thumbStyle"></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Track Style</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :trackStyle="thumbStyle"></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Tooltip Style</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :tooltipStyle="tooltipStyle"></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Progress Bar Style</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :progressBarStyle="tooltipStyle"></vue-slider>
    </div>
    <div class="demo-container">
       <h2>Container Style</h2>
      <vue-slider v-model="value" :height="16" :min="1" :max="90" :current-value="value" :containerStyle="tooltipStyle"></vue-slider>
    </div>

  <div>Current value= {{ value }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { VueSliderComponent } from '../../src/index';
import { IAdHocData } from '../../src/interfaces/ad-hoc-data';

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
  public adHocData: IAdHocData[] = [
    {
      value: 1,
      data: {
        prize: 'line',
        winners: [
          'MrEd Brand Glue',
          'Arthur Pewty'
        ]
      }
    },
    {
      value: 32,
      data: {
        prize: 'two line',
        winners: [
          'Radnor',
          'Splash'
        ]
      }
    },
    {
      value: 90,
      data: {
        prize: 'full house',
        winners: [
          'Jams',
          'Fishpaste'
        ]
      }
    }
  ];

  @Provide()
  public thumbStyle: object = {
    'background-color': '#008080A0',
    'box-shadow': 'none'
  };

  @Provide()
  public tooltipStyle: object = {
    'background-color': '#008080',
    'border-color': '#008080',
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
    .vue-slider-thumb {
        background-color: #15A49C;
    }
    .vue-slider-tooltip {
      width: 60px;
      color: #ccc;
      border: 1px solid #FFFFFF;
      background-color: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    .vue-slider-ad-hoc-item {
      width: 100px;
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
  &.complex {
    .vue-slider-component {
        margin-bottom: 40px;
      }
  }
}

.additional-info {
    position: relative;
    display: inline-block;
    .additional-info-text {
        visibility: hidden;
        font-size: 14px;
        width: 120px;
        background-color: #CCCCCC;
        color: #FFFFFF;
        text-align: center;
        top: 20px;
        left: -20px;
        padding: 4px 0;
        border-radius: 4px;
        position: absolute;
        z-index: 1;
    }
    &:hover .additional-info-text {
      visibility: visible;
    }

}

</style>
