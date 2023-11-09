export default {
  async registerCoach(context, payload) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: payload.first,
      lastName: payload.last,
      description: payload.desc,
      hourlyRate: payload.rate,
      areas: payload.areas,
    };

    const token = context.rootGetters.token;

    const response = await fetch(
      `https://coach-finder-73a58-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=` +
        token,
      {
        method: "PUT",
        body: JSON.stringify(coachData),
      }
    );

    // const responseData = await response.json();

    if (!response.ok) {
      // throw new Error();
    }

    context.commit("registerCoach", {
      ...coachData,
      id: userId,
    });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) return;

    const res = await fetch(
      `https://coach-finder-73a58-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`
    );
    const data = await res.json();

    // console.log(data);

    if (!res.ok) {
      const error = new Error(data.message || "Failed to fetch");
      throw error;
    }

    const coaches = [];

    for (const key in data) {
      const coach = {
        id: key,
        firstName: data[key].firstName,
        lastName: data[key].lastName,
        description: data[key].description,
        hourlyRate: data[key].hourlyRate,
        areas: data[key].areas,
      };
      coaches.push(coach);
    }

    context.commit("setCoaches", coaches);
    context.commit("setFetchTimeStamp");
  },
};
