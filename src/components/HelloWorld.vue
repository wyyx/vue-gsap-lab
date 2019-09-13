<template>
  <div>
    <div class="container">
      <div class="rating-wrapper">
        <div
          class="box-wrapper"
          v-for="index in lineNumber"
          :key="index"
          @mouseenter="startAnimation(index)"
        >
          <div
            class="box"
            :class="`box-${index}`"
            @click="startAnimation(index)"
            :style="{
              'background-color': startColor,
              width: minWidth + 'px',
              height: minHeight + 'px'
            }"
          >
            {{ index }}
          </div>
        </div>
      </div>
    </div>

    <div class="button"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TweenMax, TimelineLite, Power3, Linear } from "gsap/TweenMax";
import { interpolateRgbBasis, interpolateNumber } from "d3-interpolate";

export default Vue.extend({
  data: function() {
    return {
      currentLine: 5,
      lineNumber: 25,
      expand: 4,
      minWidth: 50,
      maxWidth: 120,
      minHeight: 6,
      maxHeight: 18,
      startColor: "#7fffd4",
      endColor: "#d87093"
    };
  },
  methods: {
    startAnimation(midIndex: number) {
      const tl = new TimelineLite();

      const minIndex = midIndex - this.expand;
      const maxIndex = midIndex + this.expand;
      for (let i = minIndex; i <= maxIndex; i++) {
        tl.to(
          `.box-${i}`,
          0.2,
          {
            width: this.getWidth(i, midIndex),
            height: this.getHeight(i, midIndex),
            backgroundColor: this.getColor(i, midIndex)
          },
          0
        );
      }
    },

    startAnimationReset(midIndex: number) {
      //
    },

    getWidth(index: number, midIndex: number) {
      const widthInterpolater = interpolateNumber(this.minWidth, this.maxWidth);
      const position = (this.expand - Math.abs(index - midIndex)) / this.expand;

      return widthInterpolater(position);
    },

    getHeight(index: number, midIndex: number) {
      const heightInterpolater = interpolateNumber(
        this.minHeight,
        this.maxHeight
      );
      const position = (this.expand - Math.abs(index - midIndex)) / this.expand;

      return heightInterpolater(position);
    },

    getColor(index: number, midIndex: number) {
      const colorInterpolater = interpolateRgbBasis([
        this.startColor,
        this.endColor
      ]);
      const position = (this.expand - Math.abs(index - midIndex)) / this.expand;

      return colorInterpolater(position);
    }
  }
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}

.rating-wrapper {
  width: 250px;
  border: 1px solid grey;
}

.box-wrapper {
  width: 200px;
  height: 30px;
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
}

.box {
  margin: 5px 0px;
  font-size: 10px;
  display: flex;
  align-items: center;
}

.button {
  background-color: #7fffd4;
  border-radius: 100px;
  width: 36px;
  height: 36px;
  position: fixed;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
