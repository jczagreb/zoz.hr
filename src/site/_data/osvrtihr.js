// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getOsvrti() {

    // Objave array
    let sviosvrti = [];

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
                    osvrti(stage: PUBLISHED, orderBy: datum_DESC, locales: hr) {
                        datum
                        naslov
                        slug
                        locale
                        naslovnaFotografija{
                            handle
                        }
                        isjecak
                        sadrzajOsvrta {
                            html
                            text
                        }
                        fotogalerija {
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
        sviosvrti = sviosvrti.concat(response.data.osvrti);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const osvrti = sviosvrti.map((item) => {

        return {
            naslov: item.naslov,
            slug: item.slug,
            lang: item.locale,
            foto: item.naslovnaFotografija,
            sadrzaj: item.sadrzajOsvrta.html,
            sadrzajtekst: item.sadrzajOsvrta.text.replace(/\n /, "\n"),
            isjecak: item.isjecak,
            datum: item.datum,
            fotogalerija: item.fotogalerija
        };
    }).filter(Boolean);

    // return formatted blogposts
    return osvrti;
}

// export for 11ty
module.exports = getOsvrti;
