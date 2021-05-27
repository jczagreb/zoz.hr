// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getNovosti() {

    // Objave array
    let svenovosti = [];

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
                    novosti(stage: PUBLISHED, orderBy: datum_DESC, locales: hr) {
                        naslov
                        slug
                        publishedAt
                        locale
                        naslovnaFotografija{
                            handle
                        }
                        isjecak
                        sadrzaj {
                            html
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
        svenovosti = svenovosti.concat(response.data.novosti);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const novosti = svenovosti.map((item) => {

        return {
            naslov: item.naslov,
            slug: item.slug,
            lang: item.locale,
            foto: item.naslovnaFotografija,
            sadrzaj: item.sadrzaj.html,
            isjecak: item.isjecak,
            datum: item.publishedAt
        };
    }).filter(Boolean);

    // return formatted blogposts
    return novosti;
}

// export for 11ty
module.exports = getNovosti;
