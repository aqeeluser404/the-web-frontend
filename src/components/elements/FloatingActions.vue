<template>
  <div
    class="floating-action-rail"
    :class="{ 'is-expanded': isExpanded }"
    @click="handleRailClick"
  >
    <div
      v-for="action in actions"
      :key="action.label"
      class="floating-action-item"
      :style="{ backgroundColor: action.color }"
      @click="handleActionClick(action, $event)"
    >
      <q-icon
        v-if="!action.image"
        :name="action.icon"
        size="24px"
        class="action-icon"
      />

      <img
        v-else
        :src="action.image"
        :alt="action.label"
        class="action-image"
      />

      <span class="action-label">
        {{ action.label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatingActions",

  props: {
    actions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isExpanded: false,
    };
  },

  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },

  methods: {
    handleRailClick() {
      // Toggle on tap — works for both revealing and closing
      this.isExpanded = !this.isExpanded;
    },
    handleActionClick(action, event) {
      if (window.innerWidth <= 768 && !this.isExpanded) {
        event.stopPropagation();
        this.isExpanded = true;
        return;
      }
      action.action();
      if (window.innerWidth <= 768) {
        this.isExpanded = false; // close after an action fires too
      }
    },
    handleOutsideClick(event) {
      if (this.isExpanded && !this.$el.contains(event.target)) {
        this.isExpanded = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>

.floating-action-rail
  position: fixed
  left: 0
  top: 75%
  transform: translateY(-50%)
  z-index: 9999

  display: flex
  flex-direction: column
  align-items: flex-start

.floating-action-item
  width: 40px
  height: 40px
  display: flex
  flex-direction: row-reverse
  align-items: center
  overflow: hidden
  cursor: pointer
  transition: width .3s ease
  color: white
  box-shadow: -3px 4px 12px rgba(0,0,0,.18)

.floating-action-item:first-child
  border-top-right-radius: 12px

.floating-action-item:last-child
  border-bottom-right-radius: 12px

.floating-action-item:hover
  width: 200px
  border-top-right-radius: 12px
  border-bottom-right-radius: 12px

.action-icon
  min-width: 40px
  display: flex
  justify-content: center

.action-image
  width: 26px
  height: 26px
  min-width: 40px
  object-fit: contain

.action-label
  white-space: nowrap
  font-weight: 600
  font-size: 15px
  padding-left: 20px

@media (max-width: 768px)

  .floating-action-rail
    top: 72%
    left: 0
    transform: translate(-70%, -50%)
    transition: transform .3s ease

  .floating-action-rail.is-expanded
    transform: translate(0, -50%)

  .floating-action-item
    width: 42px
    height: 42px
    box-shadow: -2px 3px 8px rgba(0,0,0,.15)

  .floating-action-item:hover
    width: 42px
    border-top-left-radius: 0px
    border-top-right-radius: 0px
    border-bottom-left-radius: 0px
    border-bottom-right-radius: 0px

  .action-icon
    min-width: 42px
    font-size: 18px !important

  .action-image
    width: 20px
    height: 20px
    min-width: 42px

  .action-label
    display: none
</style>
