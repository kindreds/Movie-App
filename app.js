const API_KEY = '4ee5467e0d79a3e98e890394ac42ff02';
const language = 'es-ES';
const urlPantallaPrincipal = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&page=1`;
const resultado = document.querySelector('.card-columns');
const spin = document.querySelector('.sk-chase');

const pantallaPrincipal = async ()=> {
    const {results} = await fetch( urlPantallaPrincipal ).then( resp => resp.json() );
    console.log(results);
    results.forEach( pelicula=> {
        imprimir( pelicula );
    })
}

pantallaPrincipal();

const busqueda = async (texto)=> {
    spin.style.display = 'block';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&query=${texto}`;
    console.time( 'request' )
    
    const { total_pages } = await fetch( url ).then( resp=> resp.json() );
    
    let arrayD = [];
    let arrayO = [];

    for ( page = 1 ; page <= total_pages; page++) {   
         const {results} = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&query=${texto}&page=${page}`)
            .then( resp=> resp.json() );

         results.forEach(elem => {
            if ( elem.hasOwnProperty('release_date') && elem.overview !== '' && elem.poster_path !== null ){
                arrayD.push( elem )
            }
         });
    }

    for (let i = 2022; i > 1900 ; i--) {
        for (const pelicula of arrayD) {
            const anio = pelicula['release_date'].slice(0,4)*1;
            if( anio ===  i){
                arrayO.push( pelicula )
            }
        }
        
    }
    spin.style.display = 'none';
    if(arrayO.length === 0){
        sinResultados(texto);
    }
    console.log(arrayO);
    console.timeEnd( 'request' )
    return arrayO;
}

const sinResultados = (titulo)=> {
    let html = `
    <div class="alertas">
        <h1>No se ha encontrado pelicula con el nombre: ${titulo}</h1>
    </div>`;
    resultado.innerHTML += html;
}
const campoRequerido = ()=> {
    let html = `
    <div class="alertas">
        <h1>Si vas a buscar una pelicula pon algo .... </h1>
    </div>`;
    resultado.innerHTML += html;
}

const imprimir = ({ title, overview , release_date , poster_path})=>  {

    // if(overview.length > 170 ) {
    //     overview = overview.slice(0, 170) + ' ...'
    // }
    if( title.search(/\(/) !== -1 && title.length > 21 ){
        title = title.slice( 0 , title.search(/\(/))
        overview = overview.slice(0, 100) + ' ...'
    }
    release_date = release_date.slice( 0 , 4);

    let html = `
    <div class="card">
        <img src="http://image.tmdb.org/t/p/w500${poster_path}" class="card-img-top" alt="Poster: ${title}">
        <span class="text-muted">${release_date}</span>
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text cuarenta">${overview}</p>
        </div>
    </div>`;
    resultado.innerHTML += html;
}

const valor = document.querySelector('.buscador input');
const valor_button = document.querySelector('.buscador button');

valor.addEventListener('keyup', (event) => {
    if( event.code === 'Enter' ){
        resultado.innerHTML = '';
        if ( event.target.value === ''){
            console.log('Campo Requerido');
        }else{
            busqueda( event.target.value ).then( resp=> {
                resp.forEach( pelicula=> {
                    imprimir( pelicula );
                })
            })
        }
    }
});

valor_button.addEventListener('click', () => {
    if ( valor.value === '' ){
        resultado.innerHTML = '';
        campoRequerido();
    }else{
        resultado.innerHTML = '';
        busqueda( valor.value ).then( resp=> {
            resp.forEach( pelicula=> {
                imprimir( pelicula );
            })
        })
    }
    
})


    






