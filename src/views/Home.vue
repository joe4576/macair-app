<template>
  <v-container>
    <v-data-table
      :items="aircraftSummaries"
      :headers="headers"
      item-key="SerialNumber"
      disable-pagination
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { csvToJson, AircraftByKey } from "@/utils/files";

interface AircraftSummary {
  SerialNumber: string;
  MakeModel: string;
  Registration: string;
  Location: string;
  RentedBy: string;
  PctFuel: string;
  NeedsRepair: string;
  AirframeTime: string;
  EngineTime: string;
  TimeLast100hr: string;
}

export default defineComponent({
  name: "Home",
  setup() {
    const aircrafts = ref<AircraftByKey[]>([]);
    const aircraftSummaries = ref<AircraftSummary[]>([]);
    const headers = ref([
      { text: "Serial Number", value: "SerialNumber" },
      { text: "Make/model", value: "MakeModel" },
      { text: "Registration", value: "Registration" },
      { text: "Location", value: "Location" },
      { text: "Rented By", value: "RentedBy" },
      { text: "Fuel Percentage", value: "PctFuel" },
      { text: "Needs Repair", value: "NeedsRepair" },
      { text: "Airframe Time", value: "AirframeTime" },
      { text: "Engine Time", value: "EngineTime" },
      { text: "Time Last 100 Hours", value: "TimeLast100hr" },
    ]);

    onMounted(async () => {
      const url = `https://server.fseconomy.net/data?userkey=${process.env.VUE_APP_USER_KEY}&format=csv&query=aircraft&search=key&readaccesskey=${process.env.VUE_APP_READ_ACCESS_KEY}`;
      const data = await fetch(url);
      const responseData = await data.text();
      aircrafts.value = csvToJson(responseData) as AircraftByKey[];

      aircraftSummaries.value = aircrafts.value.map((aircraft) => {
        return {
          SerialNumber: aircraft.SerialNumber,
          MakeModel: aircraft.MakeModel,
          Registration: aircraft.Registration,
          Location: aircraft.Location,
          RentedBy: aircraft.RentedBy,
          PctFuel: aircraft.PctFuel,
          NeedsRepair: aircraft.NeedsRepair,
          AirframeTime: aircraft.AirframeTime,
          EngineTime: aircraft.EngineTime,
          TimeLast100hr: aircraft.TimeLast100hr,
        };
      });
    });

    return {
      aircraftSummaries,
      headers,
    };
  },
});
</script>
