// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getPublikacije() {

    // Objave array
    let svepublikacije = [];

    try {
        // initiate fetch
        const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/cklnybnwlodm801xu62dm373a/master", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: `{
                    publikacijes(orderBy: updatedAt_DESC, stage: PUBLISHED) {
                        izdanje
                        brojIzdanja
                        period
                        naslovnica {
                            handle
                            url
                        }
                        pdf {
                            url
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
        svepublikacije = svepublikacije.concat(response.data.publikacijes);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const publikacije = svepublikacije.map((item) => {

        return {
            izdanje: item.izdanje,
            broj: item.brojIzdanja,
            period: item.period,
            naslovnica: item.naslovnica,
            pdf: item.pdf
        };
    }).filter(Boolean);

    // return formatted blogposts
    return publikacije;
}

// export for 11ty
module.exports = getPublikacije;
