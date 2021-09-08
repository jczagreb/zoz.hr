// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getTagovi() {

    // Objave array
    let svitagovi = [];

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
                    receptiTagovi(orderBy: naziv_ASC) {
						naziv
						slug
						recept {
							nazivRecepta
							slug
							kratakOpis
							naslovnaFotografija {
								handle
							}
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
        svitagovi = svitagovi.concat(response.data.receptiTagovi);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const tagovi = svitagovi.map((item) => {

        return {
            naziv: item.naziv,
			slug: item.slug,
			recept: item.recept
        };
	}).filter(Boolean);
	
	// return formatted blogposts
    return tagovi;
}

// export for 11ty
module.exports = getTagovi;
