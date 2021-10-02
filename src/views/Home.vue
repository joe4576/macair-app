<template>
  <v-container>
    <v-row class="pt-2">
      <v-col cols="auto" align-self="center" class="red--text">
        <span v-if="error">
          Error: too many request sent in the last 60 seconds (max 10). Please
          try again.
        </span>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          @click="
            refresh(true);
            showRefreshSnackbar = false;
          "
        >
          Refresh
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="aircraftSummaries"
          :headers="headers"
          disable-pagination
        />
      </v-col>
    </v-row>
    <v-snackbar
      v-model="showRefreshSnackbar"
      :timeout="2000"
      :color="error ? 'red darken-2' : 'blue-grey darken-1'"
    >
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Fetching data...
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { csvToJson } from "@/utils/files";
import { AircraftByKey, AircraftByConfig } from "@/types/types";

interface AircraftSummary {
  MakeModel: string;
  Registration: string;
  Location: string;
  RentedBy: string;
  PctFuel: string;
  MaxPax: string;
  MaxFuel: string;
  MaxLoad: string;
  AvailablePax: string;
  AvailableCargo: string;
}

export default defineComponent({
  name: "Home",
  setup() {
    const aircrafts = ref<AircraftByKey[]>([]);
    const aircraftConfigs = ref<AircraftByConfig[]>([]);
    const aircraftSummaries = ref<AircraftSummary[]>([]);
    const showRefreshSnackbar = ref(false);
    const error = ref(false);
    const snackbarText = ref<string>("");
    const loading = ref(false);

    const headers = ref([
      { text: "Make/model", value: "MakeModel" },
      { text: "Registration", value: "Registration" },
      { text: "Location", value: "Location" },
      { text: "Rented By", value: "RentedBy" },
      { text: "Fuel Percentage", value: "PctFuel" },
      { text: "Max Pax", value: "MaxPax" },
      { text: "Max Fuel", value: "MaxFuel" },
      { text: "Max Load", value: "MaxLoad" },
      { text: "Available Pax", value: "AvailablePax" },
      { text: "Available Cargo", value: "AvailableCargo" },
    ]);

    onMounted(async () => {
      await refresh();
    });

    const refresh = async (manualRefresh = false) => {
      loading.value = true;
      const aircraftByKeyUrl = `https://server.fseconomy.net/data?userkey=${process.env.VUE_APP_USER_KEY}&format=csv&query=aircraft&search=key&readaccesskey=${process.env.VUE_APP_READ_ACCESS_KEY}`;
      const aircraftConfigUrl = `	https://server.fseconomy.net/data?userkey=${process.env.VUE_APP_USER_KEY}&format=csv&query=aircraft&search=configs`;

      // fetch aircraft by key
      const aircraftByKeyData = await fetch(aircraftByKeyUrl);
      const aircraftByKeyResponse = await aircraftByKeyData.text();

      // fetch aircraft configs
      const aircraftConfigData = await fetch(aircraftConfigUrl);
      const aircraftConfigResponse = await aircraftConfigData.text();

      // handle api errors
      if (
        aircraftByKeyResponse.includes(
          "<Error>To many requests in 60 second period (Max=10).</Error>"
        )
      ) {
        error.value = true;
      } else {
        error.value = false;
      }

      if (!error.value) {
        aircrafts.value = csvToJson(aircraftByKeyResponse) as AircraftByKey[];

        aircraftConfigs.value = csvToJson(
          aircraftConfigResponse
        ) as AircraftByConfig[];

        const makeModels: string[] = aircrafts.value
          .map((row) => row.MakeModel)
          .filter((value, index, self) => self.indexOf(value) === index);

        const configMakeModels: string[] = aircraftConfigs.value.map(
          (config) => config.MakeModel
        );

        // map makeModel to index in aircraft configs
        const makeModelMap = new Map<string, number>();
        makeModels.forEach((makeModel) => {
          const index = configMakeModels.indexOf(makeModel);
          if (index) {
            makeModelMap.set(makeModel, index);
          }
        });

        const numberOfPilots = (config: AircraftByConfig): number => {
          return config.Crew === "0" ? 1 : 2;
        };

        const getMaxPax = (makeModel: string) => {
          const index = makeModelMap.get(makeModel);
          if (index) {
            const config = aircraftConfigs.value[index];
            const pilots = numberOfPilots(config);
            const maxPax = +config.Seats - pilots;
            return maxPax.toString();
          }
          return "n/a";
        };

        const getMaxFuel = (makeModel: string) => {
          const index = makeModelMap.get(makeModel);
          if (index) {
            const config = aircraftConfigs.value[index];
            const sum =
              +config.Ext1 +
              +config.LTip +
              +config.LAux +
              +config.LMain +
              +config.Center1 +
              +config.Center2 +
              +config.Center3 +
              +config.RMain +
              +config.RAux +
              +config.RTip +
              +config.RExt2;
            return sum.toString();
          }
          return "n/a";
        };

        const getMaxLoad = (makeModel: string) => {
          const index = makeModelMap.get(makeModel);
          if (index) {
            const config = aircraftConfigs.value[index];
            return (
              +config.MTOW -
              +config.EmptyWeight -
              77 * numberOfPilots(config)
            ).toString();
          }
          return "n/a";
        };

        const getAvailableLoad = (makeModel: string, pctFuel: string) => {
          return (
            +getMaxLoad(makeModel) -
            +pctFuel * +getMaxFuel(makeModel) * 2.685950413
          );
        };

        const getAvailablePax = (makeModel: string, pctFuel: string) => {
          const index = makeModelMap.get(makeModel);
          if (index) {
            const availableLoad = getAvailableLoad(makeModel, pctFuel);
            let availablePax = Math.floor(availableLoad / 77);
            const maxPax = getMaxPax(makeModel);

            if (availablePax > +maxPax) {
              availablePax = +maxPax;
            }

            return availablePax.toString();
          }
          return "n/a";
        };

        const getAvailableCargo = (makeModel: string, pctFuel: string) => {
          return Math.floor(
            getAvailableLoad(makeModel, pctFuel) -
              77 * +getAvailablePax(makeModel, pctFuel)
          ).toString();
        };

        aircraftSummaries.value = aircrafts.value
          .filter((aircraft) => aircraft.MakeModel)
          .map((aircraft) => {
            return {
              MakeModel: aircraft.MakeModel,
              Registration: aircraft.Registration,
              Location: aircraft.Location,
              RentedBy: aircraft.RentedBy,
              PctFuel: aircraft.PctFuel,
              MaxPax: getMaxPax(aircraft.MakeModel),
              MaxFuel: getMaxFuel(aircraft.MakeModel),
              MaxLoad: getMaxLoad(aircraft.MakeModel),
              AvailablePax: getAvailablePax(
                aircraft.MakeModel,
                aircraft.PctFuel
              ),
              AvailableCargo: getAvailableCargo(
                aircraft.MakeModel,
                aircraft.PctFuel
              ),
            };
          });
      }

      if (manualRefresh) {
        error.value === true
          ? (snackbarText.value = "Error: could not fetch data")
          : (snackbarText.value = "Data refreshed successfully");
        showRefreshSnackbar.value = true;
      }
      loading.value = false;
    };

    return {
      aircraftSummaries,
      headers,
      refresh,
      showRefreshSnackbar,
      error,
      snackbarText,
      loading,
    };
  },
});
</script>
