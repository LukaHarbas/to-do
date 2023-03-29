var listsContainer = document.querySelector('[data-lists]')
var newListForm = document.querySelector('[data-new-list-form]')
var newListInput = document.querySelector('[data-new-list-input]')
var newListDescription = document.querySelector('[data-new-list-description]')

var LOCAL_STORAGE_LIST_KEY = 'todo.lists'
var LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'todo.selectedListId'


var lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] 
var selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    var listName = newListInput.value
    var listDescription = newListDescription.value
    var list = createList(listName, listDescription)
    if (!listName) return
    lists.push(list)
    saveAndRender()
    newListInput.value = null
    newListDescription.value = null
})



function createList(name, param) {
    return { id: Date.now().toString(), name: name, description: param, tasks:[] }
}

function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElement(listsContainer)
    lists.forEach(list => {
        var listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerHTML = list.name + " " + `<p>${list.description}</p>`
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()