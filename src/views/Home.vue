<template>
  <v-container>
    <v-row class="mx-auto" justify="center">
      <v-col cols="auto">{{ helloWorld }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "Home",
  setup() {
    return {
      helloWorld: ref("Hello world"),
    };
  },
});
</script>
