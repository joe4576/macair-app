<template>
  <v-container
    fluid
    fill-height
    pa-0
    class="grey lighten-4"
    style="align-content: flex-start"
  >
    <slot />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  name: "MacPage",
});
</script>
