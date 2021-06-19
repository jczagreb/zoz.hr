/*------------------------------------------------------------------------------*/
/* Search funkcija
/*------------------------------------------------------------------------------*/
$(function () {
    // fetch lang
    var pathArray = window.location.pathname.split('/');
    var lang = pathArray[1];

    // fetch JSON data

    if (lang === "hr") {
        var novosti = [];
        fetch('/searchindex-novosti-hr.json')
            .then(blob => blob.json())
            .then(data => novosti.push(...data));
        var najave = [];
        fetch('/searchindex-najave-hr.json')
            .then(blob => blob.json())
            .then(data => najave.push(...data));
        var osvrti = [];
        fetch('/searchindex-osvrti-hr.json')
            .then(blob => blob.json())
            .then(data => osvrti.push(...data));
    } else {
        var novosti = [];
        fetch('/searchindex-novosti-en.json')
            .then(blob => blob.json())
            .then(data => novosti.push(...data));
        var najave = [];
        fetch('/searchindex-najave-en.json')
            .then(blob => blob.json())
            .then(data => najave.push(...data));
        var osvrti = [];
        fetch('/searchindex-osvrti-en.json')
            .then(blob => blob.json())
            .then(data => osvrti.push(...data));
    }

    //search functions
    function findRezNovosti(wordToMatch, novosti) {
        return novosti.filter(rezNovosti => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNovosti.title.match(regex);
        });
    }
    function findRezNajave(wordToMatch, najave) {
        return najave.filter(rezNajave => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezNajave.title.match(regex);
        });
    }
    function findRezOsvrti(wordToMatch, osvrti) {
        return osvrti.filter(rezOsvrti => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezOsvrti.title.match(regex);
        });
    }

    // display search results
    function displayRez() {
            
        // novosti
        const matchNovosti = findRezNovosti(this.value, novosti);
        if ((matchNovosti.length > 0) && (searchInput.value.length > 2)) {
            
            var elem1 = $('.header_search_content');
            if (!elem1.hasClass('on')) {
                elem1.addClass('on');
            }

            document.getElementById('novostibanner').style.display = "block";
            const htmlnovosti = matchNovosti.map(rezNovosti => {
                const regex = new RegExp(this.value, 'gi');
                const novostititle = rezNovosti.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezNovosti.url + '">' + novostititle + '</a></span>';
            }).join('');
            suggnovosti.innerHTML = htmlnovosti;
        }
        else {
            document.getElementById('novostibanner').style.display = "none";
            suggnovosti.innerHTML = '';
        }

        if (searchInput.value.length < 3) {
            document.getElementById('hsc').classList.remove("on");
        }

        //najave
        const matchNajave = findRezNajave(this.value, najave);
        if ((matchNajave.length > 0) && (searchInput.value.length > 2)) {

            var elem2 = $('.header_search_content');
            if (!elem2.hasClass('on')) {
                elem2.addClass('on');
            }

            document.getElementById('najavebanner').style.display = "block";
            const htmlnajave = matchNajave.map(rezNajave => {
                const regex = new RegExp(this.value, 'gi');
                const najavetitle = rezNajave.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezNajave.url + '">' + najavetitle + '</a></span>';
            }).join('');
            suggnajave.innerHTML = htmlnajave;
        }
        else {
            document.getElementById('najavebanner').style.display = "none";
            suggnajave.innerHTML = '';
        }

        // osvrti
        const matchOsvrti = findRezOsvrti(this.value, osvrti);
        if ((matchOsvrti.length > 0) && (searchInput.value.length > 2)) {

            var elem3 = $('.header_search_content');
            if (!elem3.hasClass('on')) {
                elem3.addClass('on');
            }

            document.getElementById('osvrtibanner').style.display = "block";
            const htmlosvrti = matchOsvrti.map(rezOsvrti => {
                const regex = new RegExp(this.value, 'gi');
                const osvrtititle = rezOsvrti.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezOsvrti.url + '">' + osvrtititle + '</a></span>';
            }).join('');
            suggosvrti.innerHTML = htmlosvrti;
        }
        else {
            document.getElementById('osvrtibanner').style.display = "none";
            suggosvrti.innerHTML = '';
        }

    }

    const searchInput = document.querySelector('#searchInput');
    const suggnovosti = document.querySelector('#suggNovosti');
    const suggnajave = document.querySelector('#suggNajave');
    const suggosvrti = document.querySelector('#suggOsvrti');

    searchInput.addEventListener('keyup', displayRez, { passive: true });

});