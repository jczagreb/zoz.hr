// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getAktivnosti() {

    // Objave array
    let sveaktivnosti = [];
    const daterange = new Date();
    daterange.setMonth(daterange.getMonth() - 6);

    try {
        // initiate fetch
        const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/cklnybnwlodm801xu62dm373a/master", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                variables: { daterange },
                query: `query SveAktivnosti($daterange: DateTime!){
                    najaveAktivnosti(orderBy: publishedAt_DESC, stage: PUBLISHED, where: {publishedAt_gt: $daterange}) {
                        naslov
                        stranica
                        publishedAt
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
        sveaktivnosti = sveaktivnosti.concat(response.data.najaveAktivnosti);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const aktivnosti = sveaktivnosti.map((item) => {

        return {
            naslov: item.naslov,
            stranica: item.stranica,
            datum: item.publishedAt
        };
    }).filter(Boolean);

    // return formatted blogposts
    return aktivnosti;
}

// export for 11ty
module.exports = getAktivnosti;
