<template>
  <v-app>
    <mac-app-bar @toggle="drawer = !drawer" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import MacNavDrawer from "@/components/controls/app/MacNavDrawer.vue";
import MacAppBar from "@/components/controls/app/MacAppBar.vue";

export default defineComponent({
  name: "App",
  components: {
    MacNavDrawer,
    MacAppBar,
  },
  setup() {
    return {
      drawer: ref<boolean | null>(null),
    };
  },
});
</script>
