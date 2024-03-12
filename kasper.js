const KASPER_API_KEY = "Bearer 56ab2f32090b419798fb630528330a4e";

const url = "https://api.developers.kaspr.io/profile/linkedin";

const kasperFunc = async (id, name) => {
  if (id === null && name === null) {
    return { workEmail: "" };
  }
  const options = {
    method: "POST",
    headers: {
      "accept-version": "v2.0",
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: KASPER_API_KEY,
    },
    body: '{"id":"' + id + '","name":"' + name + '","dataToGet":["workEmail"]}',
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      workEmail: data?.profile?.starryWorkEmail || "",
    };
  } catch (error) {
    if (error.response.status === 429) {
      throw new Error(error.response.data)
    } 
    return { workEmail: "" };
  }
};
module.exports = kasperFunc;
