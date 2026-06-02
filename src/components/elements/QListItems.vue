<template>
  <q-list>
    <template v-for="(item, index) in items" :key="index">
      <!-- Expandable group -->
      <q-expansion-item
        v-if="item.isMenuGroup && item.children"
        :label="item.label"
        expand-separator
      >
        <q-item
          v-for="(child, cIdx) in item.children"
          :key="`child-${index}-${cIdx}`"
          clickable
          v-close-popup
          @click="handleItemClick(child)"
        >
          <q-item-section avatar v-if="child.icon">
            <q-icon :name="child.icon" />
          </q-item-section>
          <q-item-section>{{ child.label }}</q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- Regular item -->
      <q-item
        v-else
        clickable
        v-close-popup
        @click="handleItemClick(item)"
      >
        <q-item-section avatar v-if="item.icon">
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script>
export default {
  name: 'SimpleDropdownMenu',
  props: {
    items: { type: Array, required: true }
  },
  methods: {
    handleItemClick(item) {
      if (item.click && typeof item.click === 'function') {
        item.click()
      } else if (item.to) {
        this.$router.push(item.to)
      } else if (item.externalLink) {
        window.open(item.externalLink, '_blank')
      }
    }
  }
}
</script>

<style lang="sass">
.q-expansion-item__content
  background-color: rgba(0, 0, 0, 0.04)   // slightly stronger tint
  border-radius: 4px
  padding: 4px

.no-hover-tint
  position: relative
  &::before,
  &:hover::before,
  &:focus::before
    background-color: transparent !important
    opacity: 0 !important

  .q-focus-helper
    background-color: transparent !important
    opacity: 0 !important

// .underline-hover
//   &:hover
//     text-decoration: underline

// .active-link
//   font-weight: 600
//   color: var(--q-primary)
</style>
