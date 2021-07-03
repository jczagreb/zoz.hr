// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getStranice() {

    // Objave array
    let svestranice = [];

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
                    stranice(stage: PUBLISHED, orderBy: redoslijed_ASC, locales: hr) {
                        id
                        naslov
                        slug
                        locale
                        banner{
                            handle
                        }
                        sadrzaj {
                            html
                        }
                        redoslijed
                        navigacija
                        inlineSlika {
                            url
                        }
                        bojaBannera{
                            css
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
        svestranice = svestranice.concat(response.data.stranice);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const stranice = svestranice.map((item) => {

        return {
            id:item.id,
            naslov: item.naslov,
            slug: item.slug,
            lang: item.locale,
            banner: item.banner,
            sadrzaj: item.sadrzaj.html,
            navigacija: item.navigacija,
            red: item.redoslijed,
            inlineslika: item.inlineSlika,
            boja: item.bojaBannera
        };
    }).filter(Boolean);

    // return formatted blogposts
    return stranice;
}

// export for 11ty
module.exports = getStranice;
