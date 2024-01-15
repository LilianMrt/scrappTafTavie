const KASPER_API_KEY = "Bearer 01bcf57528e8400c926dba8a80dfa2cc";

const url = "https://api.developers.kaspr.io/profile/linkedin";

const kasperFunc = async (id, name) => {
  if (id===null && name===null){
    return { workEmail: "", phone: "", directEmail: "" };
  }
  const options = {
    method: "POST",
    headers: {
      "accept-version": "v2.0",
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: KASPER_API_KEY,
    },
    body: '{"id":"'+ id + '","name":"' + name + '","dataToGet":["phone","workEmail","directEmail"]}',
  };
  try{
        const response = await fetch(url, options);
        const data = await response.json();
        return {
          workEmail: data.profile.starryWorkEmail,
          phone: data.profile.starryPhone,
          directEmail: data.profile.starryDirectEmail,
        };
    } catch (error) {
      return {workEmail:"", phone: "", directEmail: ""}
    }
}
module.exports = kasperFunc