// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getPera() {

    // Objave array
    let svapera = [];

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
                    rabinovoPeros(orderBy: datumObjave_DESC, stage: PUBLISHED) {
                        sadrzaj {
                            html
                        }
                        datumObjave
                        naslov
                        parshat
                        slug
                        naslovnaSlika {
                            handle
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
        svapera = svapera.concat(response.data.rabinovoPeros);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const pera = svapera.map((item) => {

        return {
            naslov: item.naslov,
            datum: item.datumObjave,
            sadrzaj: item.sadrzaj,
            parshat: item.parshat,
            slug: item.slug,
            naslovnica: item.naslovnaSlika
        };
    }).filter(Boolean);

    // return formatted blogposts
    return pera;
}

// export for 11ty
module.exports = getPera;
