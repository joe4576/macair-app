<template>
  <v-navigation-drawer
    :value="value"
    @input="inputEvent($event)"
    :clipped="$vuetify.breakpoint.smAndUp"
    app
  >
    <v-list nav expand>
      <v-list-item-group v-for="menuItem in menuItems" :key="menuItem.title">
        <v-list-item :to="menuItem.path">
          <v-list-item-icon>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ menuItem.title }} </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { menuItems } from "@/router/index";

// Component not currently used, but keep for future use
export default defineComponent({
  name: "MacNavDrawer",
  props: {
    value: {
      type: Boolean,
    },
  },
  setup(_, context) {
    return {
      menuItems,
      inputEvent: (event: InputEvent) => {
        context.emit("input", event);
      },
    };
  },
});
</script>
