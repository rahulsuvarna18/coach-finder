export default {
  async contactCoach(context, payload) {
    const newRequest = {
      // id: new Date().toISOString(),
      // coachId: payload.coachId,
      userEmail: payload.email,
      message: payload.message,
    };

    const res = await fetch(
      `https://coach-finder-73a58-default-rtdb.europe-west1.firebasedatabase.app/requests/${payload.coachId}.json`,
      {
        method: "POST",
        body: JSON.stringify(newRequest),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch");
    }

    newRequest.id = data.name;
    newRequest.coachId = payload.coachId;

    context.commit("addRequest", newRequest);
  },

  async fetchRequest(context) {
    const token = context.rootGetters.token;

    const coachId = context.rootGetters.userId;
    const res = await fetch(
      `https://coach-finder-73a58-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=` +
        token
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch");
    }

    const requests = [];

    for (const key in data) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: data[key].userEmail,
        message: data[key].message,
      };

      requests.push(request);
    }
    context.commit("setRequests", requests);
  },
};
