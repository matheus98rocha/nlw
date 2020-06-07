
//Função para preencher o dropdown das Estados.
function populateUFs(){
	const ufSelect = document.querySelector("select[name=uf]")
	
		fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
			.then( res => res.json() )
			.then( states => {
				for (const state of states){
				ufSelect.innerHTML += `<option value='${state.id}'>${state.nome}</option>`
		}
	})
}

populateUFs()

//Função para preencher o dropdown das Cidades.
function getCities(event){
	const citySelect = document.querySelector("[name=city]")
	const stateInput = document.querySelector("[name=state]")

	const ufValue = event.target.value 
	
	const indexOfSelectedState = event.target.selectedIndex
	stateInput.value = event.target.options[indexOfSelectedState].text


	const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`


	citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
	citySelect.disabled = true;
	fetch(url)
		.then( res => res.json() )
		.then( cities => {

			for (const city of cities){
			citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
		}
		citySelect.disabled = false
	})
}

//Função para selecionar a mudança de estado selecionado.
document.querySelector("select[name=uf]").addEventListener("change", getCities)

//Itens de coleta (parte inferior do formulário)
//pegar todos os lis

const itemsToCollect = document.querySelectorAll(".items-grid li")
for(item of itemsToCollect){
	item.addEventListener("click", handleSelectedItem)
}


//Atualizar o campo escondido.
const collectedItems = document.querySelector("input[name=items]")

//Array de itens delecionados.
let selectedItems = []

//função para tratar itens do array.
function handleSelectedItem(event){
	
	const itemLi = event.target

	//Adicionar ou remover uma classe css com JS
	itemLi.classList.toggle("selected");
	
	const itemId = itemLi.dataset.id

	//Verificar itens selecionados, se sim, pegar os itens selecionados.
	const alreadySelected = selectedItems.findIndex(item=>{
		const itemFound = item == itemId //Isso sera true ou false
		return itemFound
	})


	//Se clicar e já estiver selecionado, tirar da seleção. Filtar é o mesmo que retirar.
	if(alreadySelected >= 0){
		const filteredItems = selectedItems.filter(item =>{
			const itemIsDiferent = item != itemId
			return itemIsDiferent
		})
		selectedItems = filteredItems
	}else{
	//Se não tiver selecionado, adicionar.
		selectedItems.push(itemId)
	}
	collectedItems.value = selectedItems
}