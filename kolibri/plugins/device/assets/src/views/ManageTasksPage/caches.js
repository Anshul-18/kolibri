import Vue from 'vue';

// Cache object to save names from
// RemoteChannel, FacilityUser API response
export const cache = Vue.observable({ studioChannels: [], users: [] });
