const pappersFunction = async (startDate, endDate, number) => {
  const responseEntreprise = await fetch(
    `https://api.pappers.fr/v2/recherche?categorie_juridique=5499,5710&date_creation_min=${startDate}&date_creation_max=${endDate}&capital_min=1000&capital_max=100000&api_token=97a405f1664a83329a7d89ebf51dc227b90633c4ba4a2575&precision=standard&bases=entreprises,dirigeants,beneficiaires,publications&curseur=*&par_curseur=${number}`
  );
  const myJson = await responseEntreprise.json(); //extract JSON from the http response
  let results = [];
  await Promise.all(
    myJson.resultats.map(async (entreprise) => {
      const responseDirigeants = await fetch(
        `https://api.pappers.fr/v2/recherche-dirigeants?api_token=97a405f1664a83329a7d89ebf51dc227b90633c4ba4a2575&siren=${entreprise.siren}`
      );
      const dirigeants = await responseDirigeants.json();
      let nomDirigeants = [];
      dirigeants.resultats.map((dirigeant) => {
        if (dirigeant.prenom_usuel&&dirigeant.nom){
          nomDirigeants.push(`${dirigeant.prenom_usuel} ${dirigeant.nom}`);
        } else {
          nomDirigeants.push("Dirigeant is private")
        }
      });
      const siege = entreprise.siege;
      nomDirigeants.forEach(element => {
        results.push({
          nomEntreprise: entreprise.nom_entreprise,
          nomDirigeant: element,
          adresse: `${siege.numero_voie} ${siege.type_voie} ${siege.libelle_voie} ${siege.adresse_ligne_1} ${siege.code_postal} ${siege.ville} ${siege.pays}`,
        });
      })
    })
  )
  return results;
};

module.exports = pappersFunction;