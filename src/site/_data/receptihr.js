// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getRecepti() {

    // Objave array
    let svirecepti = [];

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
                    recepti(stage: PUBLISHED, orderBy: nazivRecepta_ASC, locales: hr) {
                        nazivRecepta
						slug
						naslovnaFotografija {
							handle
						}
						kratakOpis
                        sastojci {
                            html
                        }
						detaljanOpisRecepta {
							html
						}
						fotogalerija {
							handle
							url
						}
						receptiTagovi {
							naziv
							slug
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
        svirecepti = svirecepti.concat(response.data.recepti);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const recepti = svirecepti.map((item) => {

        return {
            naziv: item.nazivRecepta,
            slug: item.slug,
			foto: item.naslovnaFotografija,
            kratakopis: item.kratakOpis,
            sastojci: item.sastojci,
			opis: item.detaljanOpisRecepta,
			tagovi: item.receptiTagovi,
			fotogalerija: item.fotogalerija,
        };
    }).filter(Boolean);

	// return formatted blogposts
    return recepti;
}

// export for 11ty
module.exports = getRecepti;
