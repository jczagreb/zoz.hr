// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getKnjige() {

    // Objave array
    let sveknjige = [];

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
                    knjiges (stage: PUBLISHED, locales: hr, orderBy: godina_DESC) {
                        autor
                        godina
                        brojStranica
                        cip
                        isbn
                        izdavac
                        jezik
                        naslovnica {
                            handle
                        }
                        naziv
                        slug
                        opis {
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
        sveknjige = sveknjige.concat(response.data.knjiges);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatknjige = sveknjige.map((item) => {

        return {
            naziv: item.naziv,
            slug: item.slug,
            godina: item.godina,
            lang: item.locale,
            autor: item.autor,
            brojStranica: item.brojStranica,
            cip: item.cip,
            isbn: item.isbn,
            izdavac: item.izdavac,
            jezik: item.jezik,
            naslovnica: item.naslovnica,
            opis: item.opis.html,
            opistekst: item.opis.text.replace(/\n /, "\n"),
        };
    }).filter(Boolean);

    if (formatknjige=== undefined || formatknjige.length == 0) {
        formatknjige.push({
            'naziv': 'prazno',
            'slug': 'prazno',
            'godina': 'prazno',
            'lang': 'hr',
            'autor': 'prazno',
            'cip': 'prazno',
            'isbn': 'prazno',
            'izdavac': 'prazno',
            'jezik': 'prazno',
            'naslovnica': 'prazno',
            'opis': 'prazno',
            'opistekst': 'prazno'
        });
    }

    // return formatted blogposts
    return formatknjige;
}

// export for 11ty
module.exports = getKnjige;
