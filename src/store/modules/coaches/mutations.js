export default {
  registerCoach(state, payload) {
    console.log("mutations coach triggered");
    console.log(payload);
    state.coaches.push(payload);
  },
  setCoaches(state, payload) {
    state.coaches = payload;
  },
  setFetchTimeStamp(state) {
    state.lastFetch = new Date().getTime();
  },
};
