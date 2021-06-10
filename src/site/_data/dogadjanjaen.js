// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getNajave() {

    // Objave array
    let svenajave = [];
    const today = new Date().toISOString();

    try {
        // initiate fetch
        const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/cklnybnwlodm801xu62dm373a/master", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                variables: { today },
                query: `query SveNajave($today: DateTime!) {
                    najave (orderBy: datumIVrijemeDogadanja_ASC, stage: PUBLISHED, where: {datumIVrijemeDogadanja_gt: $today}, locales: [en,hr]) {
                        nazivDogadanja
                        datumIVrijemeDogadanja
                        datumIVrijemeZavrsetkaDogadaja
                        lokacija
                        locale
                        publishedAt
                        slug
                        opisDogadanja {
                            html
                            text
                        }
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
        svenajave = svenajave.concat(response.data.najave);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatnajave = svenajave.map((item) => {
        return {
            naziv: item.nazivDogadanja,
            datum: item.datumIVrijemeDogadanja,
            datumend: item.datumIVrijemeZavrsetkaDogadaja,
            lokacija: item.lokacija,
            lang: item.locale,
            objavljeno: item.publishedAt,
            slug: item.slug,
            opis: item.opisDogadanja.html,
            opistekst: item.opisDogadanja.text.replace(/\n /, "\n")
        };
    }).filter(Boolean);

    if (formatnajave === undefined || formatnajave.length == 0) {
        formatnajave.push({
            'naziv': 'prazno',
            'datum': 'prazno',
            'datumend': 'prazno',
            'lokacija': 'prazno',
            'lang': 'en',
            'objavljeno': 'prazno',
            'slug': 'prazno',
            'opis': 'prazno',
            'opistekst': 'prazno'
        });
    }

    // return formatted blogposts
    return formatnajave;
}

// export for 11ty
module.exports = getNajave;