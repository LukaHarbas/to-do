var listsContainer = document.querySelector('[data-lists]')
var newListForm = document.querySelector('[data-new-list-form]')
var newListInput = document.querySelector('[data-new-list-input]')
var newListDescription = document.querySelector('[data-new-list-description]')
var deleteListButton = document.querySelector('[data-delete-list-button]')
var listDisplayContainer = document.querySelector('[data-list-display-container]')
var listTitleElement = document.querySelector('[data-list-title]')
var listDateElement = document.querySelector('[data-list-date]')
var tasksContainer = document.querySelector('[data-tasks]')
var taskTemplate = document.querySelector('.task-template')
var newTaskForm = document.querySelector('[data-new-task-form]')
var newTaskInput = document.querySelector('[data-new-task-input]')
var clearCompletedTask = document.querySelector('[data-clear-complete-task]')

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

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        var selectedList = lists.find(list => list.id === selectedListId)
        var selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
    }
  })

clearCompletedTask.addEventListener('click', e => {
    var selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
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

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    var taskName = newTaskInput.value
    var task = createTask(taskName)
    if (!taskName) return 
    var selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
    newTaskInput.value = null
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

function createList(name, param) {
    return { id: Date.now().toString(), name: name, description: param, tasks:[] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
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
    renderLists()
    var selectedList = lists.find(list => list.id === selectedListId)
    var currentDate = new Date()
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        listDateElement.innerText = 
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
      var taskElement = document.importNode(taskTemplate.content, true)
      var checkbox = taskElement.querySelector('input')
      checkbox.id = task.id
      checkbox.checked = task.complete
      var label = taskElement.querySelector('label')
      label.htmlFor = task.id
      label.append(task.name)
      tasksContainer.appendChild(taskElement)
    })
  }

function renderLists() {
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