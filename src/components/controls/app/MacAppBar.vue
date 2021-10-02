<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.smAndUp"
    class="cyan lighten-4"
    app
  >
    <v-app-bar-nav-icon class="text-no-wrap" @click="toggleMenu" />
    <router-link to="/">
      <v-app-bar-title><div>MacAir Web App</div></v-app-bar-title>
    </router-link>
    <v-spacer />
    <a href="https://server.fseconomy.net/index.jsp" target="_blank">
      <v-icon>mdi-open-in-new</v-icon>
    </a>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  name: "MacAppBar",
  setup(_, context) {
    return {
      toggleMenu: () => {
        context.emit("toggle");
      },
    };
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: black !important;
}
</style>
