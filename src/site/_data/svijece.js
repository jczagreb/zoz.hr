// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getSvijece() {

    // Objave array
    let svesvijece = [];
    const today = new Date().toISOString();
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    try {
        // initiate fetch
        const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/cklnybnwlodm801xu62dm373a/master", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                variables: { yesterday },
                query: `query SveSvijece($yesterday: Date!) {
                    paljenjaSvijeca (orderBy: zaPetak_ASC, stage: PUBLISHED, where: {zaPetak_gt: $yesterday}) {
                        zaPetak
                        zaPetakHebrew
                        datumSabata
                        plagHaminha
                        paljenjeSabatnihSvijeca
                        zalazakSunca
                        pocetakSabata
                        parasa
                        haftara
                        izrekeOtaca
                        zavrsetakSabata
                    }
                }`
            })
        });

        // store the JSON response when promise resolves
        const response = await graphcms.json();

        // handle DatoCMS errors
        if (response.errors) {
            let errors = response.errors;
            errors.map((error) => {
                console.log(error.message);
            });
            throw new Error("Aborting: GraphCMS errors");
        }

        // update blogpost array with the data from the JSON response
        svesvijece = svesvijece.concat(response.data.paljenjaSvijeca);

    } catch (error) {
        throw new Error(error);
    }
    
    // format blogposts objects
    const formatsvijece = svesvijece.map((item) => {
        let pet = new Date(item.zaPetak);
        let petak = new Date(pet).toISOString();
        let subota = pet.setDate(pet.getDate() + 1);
        subota = new Date(subota).toISOString();
        return {
            petak: petak,
            petakhebrew: item.zaPetakHebrew,
            sabat: subota,
            sabathebrew: item.datumSabata,
            plaghaminha: item.plagHaminha,
            paljenje: item.paljenjeSabatnihSvijeca,
            zalazak: item.zalazakSunca,
            pocetak: item.pocetakSabata,
            parasa: item.parasa,
            haftara: item.haftara,
            izreke: item.izrekeOtaca,
            zavrsetak: item.zavrsetakSabata
        };
    }).filter(Boolean);

    // return formatted blogposts
    return formatsvijece;
}

// export for 11ty
module.exports = getSvijece;