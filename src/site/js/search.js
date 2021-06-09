/*------------------------------------------------------------------------------*/
/* Search funkcija
/*------------------------------------------------------------------------------*/
$(function () {
    // fetch lang
    var pathArray = window.location.pathname.split('/');
    var lang = pathArray[1];

    // fetch JSON data

    if (lang === "hr") {
        const najavehr = [];
        fetch('/searchindex-najave-hr.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
        const novostihr = [];
        fetch('/searchindex-novosti-hr.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
        const osvrtihr = [];
        fetch('/searchindex-osvrti-hr.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
    } else {
        const najaveen = [];
        fetch('/searchindex-najave-en.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
        const novostien = [];
        fetch('/searchindex-novosti-en.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
        const osvrtien = [];
        fetch('/searchindex-osvrti-en.json')
            .then(blob => blob.json())
            .then(data => objave.push(...data));
    }

    //search functions
    function findRezNajaveHr(wordToMatch, najavehr) {
        return najavehr.filter(rezNajaveHr => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNajaveHr.title.match(regex);
        });
    }
    function findRezNajaveEn(wordToMatch, najaveen) {
        return najaveen.filter(rezNajaveEn => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNajaveEn.title.match(regex);
        });
    }
    function findRezOsvrtiHr(wordToMatch, osvrtihr) {
        return osvrtihr.filter(rezOsvrtiHr => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezOsvrtiHr.title.match(regex);
        });
    }
    function findRezOsvrtiEn(wordToMatch, osvrtien) {
        return osvrtien.filter(rezOsvrtiEn => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezOsvrtiEn.title.match(regex);
        });
    }
    function findRezNovostiHr(wordToMatch, novostihr) {
        return novostihr.filter(rezNovostiHr => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNovostiHr.title.match(regex);
        });
    }
    function findRezNovostiEn(wordToMatch, novostien) {
        return novostien.filter(rezNovostiEn => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNovostiEn.title.match(regex);
        });
    }

    // display search results
    function displayRez() {

        if (lang === "hr") {
            
            //najavehr
            const matchObjave = findRezObjave(this.value, objave);
            if ((matchObjave.length > 0) && (searchInput.value.length > 2)) {

                var elem1 = $('.header_search_content');
                if (!elem1.hasClass('on')) {
                    elem1.addClass('on');
                }

                document.getElementById('objavebanner').style.display = "block";
                const htmlobjave = matchObjave.map(rezObjave => {
                    const regex = new RegExp(this.value, 'gi');
                    const posttitle = rezObjave.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezObjave.url + '">' + posttitle + '</a></span>';
                }).join('');
                suggobjave.innerHTML = htmlobjave;
            }
            else {
                document.getElementById('objavebanner').style.display = "none";
                suggobjave.innerHTML = '';
            }

            // osvrtihr
            const matchSeminari = findRezSeminari(this.value, seminari);
            if ((matchSeminari.length > 0) && (searchInput.value.length > 2)) {

                var elem2 = $('.header_search_content');
                if (!elem2.hasClass('on')) {
                    elem2.addClass('on');
                }

                document.getElementById('seminaribanner').style.display = "block";
                const htmlseminari = matchSeminari.map(rezSeminari => {
                    const regex = new RegExp(this.value, 'gi');
                    const seminarititle = rezSeminari.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezSeminari.url + '">' + seminarititle + '</a></span>';
                }).join('');
                suggseminari.innerHTML = htmlseminari;
            }
            else {
                document.getElementById('seminaribanner').style.display = "none";
                suggseminari.innerHTML = '';
            }

            // novostihr
            const matchEdukacije = findRezEdukacije(this.value, edukacije);
            if ((matchEdukacije.length > 0) && (searchInput.value.length > 2)) {

                var elem3 = $('.header_search_content');
                if (!elem3.hasClass('on')) {
                    elem3.addClass('on');
                }

                document.getElementById('edukacijebanner').style.display = "block";
                const htmledukacije = matchEdukacije.map(rezEdukacije => {
                    const regex = new RegExp(this.value, 'gi');
                    const edukacijetitle = rezEdukacije.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezEdukacije.url + '">' + edukacijetitle + '</a></span>';
                }).join('');
                suggedukacije.innerHTML = htmledukacije;
            }
            else {
                document.getElementById('edukacijebanner').style.display = "none";
                suggedukacije.innerHTML = '';
            }

            if (searchInput.value.length < 3) {
                document.getElementById('hsc').classList.remove("on");
            }

        } else {

            //najaveen
            const matchObjave = findRezObjave(this.value, objave);
            if ((matchObjave.length > 0) && (searchInput.value.length > 2)) {

                var elem1 = $('.header_search_content');
                if (!elem1.hasClass('on')) {
                    elem1.addClass('on');
                }

                document.getElementById('objavebanner').style.display = "block";
                const htmlobjave = matchObjave.map(rezObjave => {
                    const regex = new RegExp(this.value, 'gi');
                    const posttitle = rezObjave.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezObjave.url + '">' + posttitle + '</a></span>';
                }).join('');
                suggobjave.innerHTML = htmlobjave;
            }
            else {
                document.getElementById('objavebanner').style.display = "none";
                suggobjave.innerHTML = '';
            }

            // osvrtien
            const matchSeminari = findRezSeminari(this.value, seminari);
            if ((matchSeminari.length > 0) && (searchInput.value.length > 2)) {

                var elem2 = $('.header_search_content');
                if (!elem2.hasClass('on')) {
                    elem2.addClass('on');
                }

                document.getElementById('seminaribanner').style.display = "block";
                const htmlseminari = matchSeminari.map(rezSeminari => {
                    const regex = new RegExp(this.value, 'gi');
                    const seminarititle = rezSeminari.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezSeminari.url + '">' + seminarititle + '</a></span>';
                }).join('');
                suggseminari.innerHTML = htmlseminari;
            }
            else {
                document.getElementById('seminaribanner').style.display = "none";
                suggseminari.innerHTML = '';
            }

            // novostien
            const matchEdukacije = findRezEdukacije(this.value, edukacije);
            if ((matchEdukacije.length > 0) && (searchInput.value.length > 2)) {

                var elem3 = $('.header_search_content');
                if (!elem3.hasClass('on')) {
                    elem3.addClass('on');
                }

                document.getElementById('edukacijebanner').style.display = "block";
                const htmledukacije = matchEdukacije.map(rezEdukacije => {
                    const regex = new RegExp(this.value, 'gi');
                    const edukacijetitle = rezEdukacije.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                    return '<li><span class="name"><a href="' + rezEdukacije.url + '">' + edukacijetitle + '</a></span>';
                }).join('');
                suggedukacije.innerHTML = htmledukacije;
            }
            else {
                document.getElementById('edukacijebanner').style.display = "none";
                suggedukacije.innerHTML = '';
            }

            if (searchInput.value.length < 3) {
                document.getElementById('hsc').classList.remove("on");
            }
        }
    }

    const searchInput = document.querySelector('#searchInput');
    const suggobjave = document.querySelector('#suggNajave');
    const suggedukacije = document.querySelector('#suggNovosti');
    const suggseminari = document.querySelector('#suggOsvrti');

    searchInput.addEventListener('keyup', displayRez, { passive: true });

});