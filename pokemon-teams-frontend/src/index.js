const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", () => {
    getTrainers()
    createClickHandlers()
})

const getTrainers = () => {
    fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(trainers => {
        trainers.forEach(trainer => {
            createTrainerCards(trainer)
        })
        
    })
}

const createTrainerCards = (trainer) => {
    const mainContainer = document.querySelector('main')
    const trainerCard = document.createElement('div')
    trainerCard.className = "card"
    trainerCard.setAttribute('data-id', `${trainer.id}`) 
    trainerCard.innerHTML = `
        <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>`

    const pokemonUl = document.createElement('ul')

    trainer.pokemons.forEach(pokemon => {
        const newPokemon = renderPokemon(pokemon)
        pokemonUl.append(newPokemon) 
    })

    trainerCard.append(pokemonUl)
    mainContainer.append(trainerCard)
}

const renderPokemon = (pokemon) => {
    const pokemonLi = document.createElement('li')
        pokemonLi.textContent = `${pokemon.nickname}`

        const button = document.createElement('button')
        button.className = "release"
        button.dataset.id = `${pokemon.id}`
        button.textContent = "Release"

        pokemonLi.append(button)
        
        return pokemonLi
}

const createClickHandlers = () => {
    document.addEventListener('click', e => {
        if (e.target.innerText === "Add Pokemon"){
            const pokeUl = e.target.nextElementSibling
            const trainerId = e.target.dataset.trainerId
            const pokeLi = addPokemon(trainerId, pokeUl)

        } else if (e.target.matches(".release")){
            const pokeId = e.target.dataset.id
            releasePokemon(pokeId)
        }
    })
}

const releasePokemon = (id) => {
    let options = {
        method: "DELETE",
    }

    fetch(POKEMONS_URL+`/${id}`, options)
    .then(resp => resp.json())
    .then(data => {
        const pokeButton = document.querySelector(`button[data-id='${data.id}'`)
        pokeButton.parentElement.remove()
    })
}

const addPokemon = (id, parentUl) => {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'trainer_id': `${id}`
        })
    }
    fetch(POKEMONS_URL, options)
    .then(resp => resp.json())
    .then(data => {
        if(parentUl.children.length < 6) {
        const pokeLi = renderPokemon(data)
        parentUl.append(pokeLi)
        } else {
            alert(`${data.error}`)
        }
    })
}
