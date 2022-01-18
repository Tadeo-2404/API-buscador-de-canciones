//VARIABLES
const formulario = document.querySelector('.form');
const lupa = document.querySelector('#lupa');
const generado = document.querySelector('#generado')


//EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
	lupa.addEventListener('click', comprobarCampo);
})




//FUNCIONES
function comprobarCampo(e) {
	e.preventDefault();

	const campo = document.querySelector('#buscar').value;

	if (campo === '') {
		mostrarMensaje('Rellena este campo');
		return
	}

	fetch(`https://genius.p.rapidapi.com/search?q=${campo}&per_page=20"`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "genius.p.rapidapi.com",
				"x-rapidapi-key": "625b640650msh9838dc001912b21p1a85ebjsnda0f4fcc1758"
			}
		})
		.then(datos => datos.json())
		.then(resultado => mostrarDatos(resultado));
}

function mostrarMensaje(mensaje) {
	const mensajeDiv = document.createElement('p');
	mensajeDiv.textContent = mensaje;
	mensajeDiv.classList.add('MensajeDiv');
	formulario.appendChild(mensajeDiv);

	setInterval(() => {
		mensajeDiv.remove()
	}, 3000);

}

function mostrarDatos(datos) {
	const {response ,response: {hits}} = datos;
    
	const parent = document.querySelector('#generado');
	while(parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}


	hits.forEach((cancion) => {
		let {result: {artist_names ,title , id ,header_image_thumbnail_url}} = cancion;
		const divArtista = document.createElement('div');
		divArtista.innerHTML = `
		<h2 class="divArtista-title">${title}</h2>
		<h2 class="divArtista-title">${artist_names}</h2>
		<img class="img-divArtista" src="${header_image_thumbnail_url}">
		<button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#myModal" data-id="${id}">Ver Letra</button>
		`;
		divArtista.classList.add('divArtista')
		generado.appendChild(divArtista);
		})

		const btnLetra = document.querySelectorAll('.btn-warning');
		btnLetra.forEach((btn) => {
			btn.addEventListener('click', () => {
				const idBTN = (btn.dataset.id)
				obtenerID(idBTN)
			}) 
		})
}

function obtenerID(id) {
	fetch(`https://genius-song-lyrics1.p.rapidapi.com/songs/${id}/lyrics`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com",
				"x-rapidapi-key": "625b640650msh9838dc001912b21p1a85ebjsnda0f4fcc1758"
			}
		})
		.then(info => info.json())
		.then(resultadosId => ExtraerLetra(resultadosId))
}

function ExtraerLetra(dato) {
   const {response: {lyrics: {lyrics: {body: {html}}}}} = dato;
   const {response: {lyrics: {trackingData: {Title}}}} = dato;
   console.log(Title)

   const modal = document.querySelector('.modal-body');
   modal.innerHTML = `
    <h2>${Title}</h2>
    <p class="letra">${html}</p>
   `;
   
}

