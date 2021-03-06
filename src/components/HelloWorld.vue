<template>
  <div class="wrapper">
    <div class="container">
      <div class="rating-wrapper" @mouseleave="reset">
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
        <div class="realtime-scores">{{ getScores(midIndex) }}分</div>
      </div>
    </div>

    <div
      class="rating-button"
      @touchstart="startAnimationLoop"
      @touchend="onTouchEnd($event)"
      @touchmove="onTouchMove($event)"
    ></div>

    <div v-if="showHelpHint" class="help-hint">
      松开，取消打分
    </div>
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
      lineNumber: 26,
      expand: 4,
      minWidth: 24,
      maxWidth: 56,
      minHeight: 4,
      maxHeight: 12,
      startColor: "#7fffd4",
      endColor: "#ec598a",
      loopId: 0,
      midIndex: 26,
      realtimeScoresTl: {} as any,
      showHelpHint: false,
      canRating: true
    };
  },
  methods: {
    startAnimation(midIndex: number) {
      this.midIndex = midIndex;

      const tl = new TimelineLite();

      const minIndex = midIndex - this.expand;
      const maxIndex = midIndex + this.expand;
      for (let i = minIndex; i <= maxIndex; i++) {
        tl.to(
          `.box-${i}`,
          0.4,
          {
            width: this.getWidth(i, midIndex),
            height: this.getHeight(i, midIndex),
            backgroundColor: this.getColor(i, midIndex)
          },
          0
        );
      }
    },

    reset() {
      clearInterval(this.loopId);

      const tl = new TimelineLite();
      for (let index = 1; index <= this.lineNumber; index++) {
        tl.to(
          `.box-${index}`,
          0.2,
          {
            width: this.minWidth,
            height: this.minHeight,
            backgroundColor: this.startColor
          },
          0
        );
      }
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
    },

    getScores(midIndex: number) {
      const scores = (this.lineNumber - midIndex) * 0.2 + 5;
      return scores.toFixed(1);
    },

    startAnimationLoop() {
      if (!this.canRating) return;

      this.startRealtimeScoresLoop();

      let mode = 0;
      let index = this.lineNumber;
      this.loopId = setInterval(() => {
        this.startAnimation(index);

        if (mode === 0) {
          index--;
        } else {
          index++;
        }

        if (index === this.lineNumber) {
          mode = 0;
        }

        if (index === 1) {
          mode = 1;
        }
      }, 125);
    },

    startRealtimeScoresLoop() {
      this.realtimeScoresTl = new TimelineLite();

      this.realtimeScoresTl
        .set(`.realtime-scores`, {
          display: "inherit",
          opacity: 1
        })
        .to(
          `.realtime-scores`,
          3.125,
          {
            repeat: -1,
            yoyo: true,
            top: "-8px",
            ease: Linear.easeNone
          },
          0.25
        );
    },

    stopRealtimeScores() {
      this.realtimeScoresTl.kill();
    },

    resetRealtimeScores() {
      const tl = new TimelineLite();
      tl.to(
        `.realtime-scores`,
        0.2,
        {
          ease: Linear.easeNone,
          display: "none",
          opacity: 0
        },
        0
      ).to(`.realtime-scores`, 0, {
        top: "auto",
        ease: Linear.easeNone
      });
    },

    onTouchEnd(event: TouchEvent) {
      if (!this.canRating) return;

      this.canRating = false;

      let elementUnderTouchEnd;

      if (event && event.changedTouches && event.changedTouches.item(0)) {
        elementUnderTouchEnd = document.elementFromPoint(
          (event as any).changedTouches.item(0).clientX,
          (event as any).changedTouches.item(0).clientY
        );
      }

      const ratingButton = document.querySelector(".rating-button");

      if (elementUnderTouchEnd === ratingButton) {
        const scores = this.getScores(this.midIndex);
        console.log("TCL: onTouchEnd -> scores", scores);
        this.reset();
        this.stopRealtimeScores();
        setTimeout(() => {
          this.resetRealtimeScores();
          this.canRating = true;
        }, 500);
      } else {
        this.reset();
        this.stopRealtimeScores();
        this.resetRealtimeScores();
        this.canRating = true;
      }

      this.showHelpHint = false;
    },

    onTouchMove(event: TouchEvent) {
      if (!this.canRating) return;

      let elementUnderTouchMove;

      if (event && event.changedTouches && event.changedTouches.item(0)) {
        elementUnderTouchMove = document.elementFromPoint(
          (event as any).changedTouches.item(0).clientX,
          (event as any).changedTouches.item(0).clientY
        );
      }

      const ratingButton = document.querySelector(".rating-button");

      if (elementUnderTouchMove === ratingButton) {
        this.showHelpHint = true;
        this.showHelpHint = false;
      } else {
        this.showHelpHint = true;
      }
    }
  }
});
</script>

<style scoped>
.wrapper {
  height: 100%;
  /* background-color: rgb(231, 231, 231); */
  background-color: rgb(80, 80, 80);
  /* color: white; */
}

.container {
  height: 100%;
}

.rating-wrapper {
  position: absolute;
  top: 50%;
  width: 156px;
  /* border: 1px solid grey; */
  display: flex;
  flex-direction: column;
  transform: translateY(-50%);
}

.box-wrapper {
  width: 156px;
  height: 18px;
  display: flex;
  align-items: center;
  /* border: 1px solid lightgray; */
}

.box {
  font-size: 10px;
  display: flex;
  align-items: center;
}

.rating-button {
  background-color: #7fffd4;
  border-radius: 100px;
  border: 4px solid rgb(226, 255, 245);
  width: 56px;
  height: 56px;
  position: fixed;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
}

.realtime-scores {
  background-color: aquamarine;
  position: absolute;
  bottom: -8px;
  right: 0px;
  width: 84px;
  height: 48px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  opacity: 0;
}

.help-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: aquamarine;
  border-radius: 8px;
  padding: 24px;
}
</style>
