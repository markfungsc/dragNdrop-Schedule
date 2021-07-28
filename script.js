// data
var task1 = {
    id: 1,
    code: 124,
    factory: "Factory 1",
    city: "Guangdong",
    product: "Cup",
    timeSlot: "8 a.m.",
    qc: null,
    shortName: null
}
var task2 = {
    id: 2,
    code: 125,
    factory: "Factory 2",
    city: "Sichuan",
    product: "Table",
    timeSlot: "2 p.m.",
    qc: null,
    shortName: null
}
var task3 = {
    id: 3,
    code: 126,
    factory: "Factory 3",
    city: "Beijing",
    product: "Light Bulb",
    timeSlot: "10 a.m.",
    qc: null,
    shortName: null
}

const taskList = [task1, task2, task3]

//date
function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push((new Date(currentDate)).getDate().toString() + "/" + ((new Date(currentDate)).getMonth() + 1).toString());
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

const today = new Date()

const dateList = getDates(today, addDays(today, 13))

// rows
const table = document.querySelector('tbody')
const qcs = [...document.getElementsByClassName('qc')];
const nbOfQc = qcs.length;
const weekDays = dateList.slice(0, 7);
for (var j = 0; j < weekDays.length; j++) {
    const firstRow = document.createElement('tr');
    const elem = document.createElement('td');
    elem.classList.add('day');
    elem.setAttribute('rowspan', '2');
    elem.innerText = weekDays[j];
    firstRow.appendChild(elem);

    const am = document.createElement('td');
    am.classList.add('am');
    am.innerText = "am";
    firstRow.append(am);
    for (var i = 0; i < nbOfQc; i++) {
        const label = document.createElement('td');
        label.id = weekDays[j] + '-' + "am" + '-' + qcs[i].innerHTML;
        label.classList.add('box', 'label');
        firstRow.append(label);
    }

    const secondRow = document.createElement('tr');
    const pm = document.createElement('td');
    pm.classList.add('pm');
    pm.innerText = "pm";
    secondRow.append(pm);
    for (var i = 0; i < nbOfQc; i++) {
        const label = document.createElement('td');
        label.id = weekDays[j] + '-' + "pm" + '-' + qcs[i].innerHTML;
        label.classList.add('box', 'label');
        secondRow.append(label);
    }

    table.appendChild(firstRow);
    table.appendChild(secondRow);
}


// task container
const taskContainer = document.querySelector('.task-container');
const createTaskButton = document.querySelector('#createTask-btn');

// show tasks
const taskIcons = taskList.map(getTaskId)

function getTaskId(task) {
    task.shortName = task.city + '-' + task.code
    return task.shortName
}

taskIcons.forEach(taskIcon => {
    const task = document.createElement('p');
    task.classList.add('draggable');
    task.id = taskIcon
    task.setAttribute('draggable', 'true');
    task.innerText = taskIcon
    taskContainer.appendChild(task);

    task.addEventListener('dragstart', () => {
        console.log('drag start');
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        console.log('drag end');
    });

    task.addEventListener('dblclick', () => {
        taskContainer.appendChild(task);
    });
})

createTaskButton.addEventListener('click', () => {
    // draggable
    const task = document.createElement('p');
    task.classList.add('draggable');
    task.setAttribute('draggable', 'true');
    task.innerText = "Task" + Math.floor(Math.random()*10);
    taskContainer.appendChild(task);

    task.addEventListener('dragstart', () => {
        console.log('drag start');
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        console.log('drag end');
        const labelId = task.parentElement.id;
        console.log(labelId);
    });

    task.addEventListener('dblclick', () => {
        taskContainer.appendChild(task);
    });

    // task.addEventListener('click', event => {
    //     const willDeleteCard = window.confirm('Do you want to delete this card?');
    //     if (willDeleteCard) {
    //         task.remove();
    //     }
    // })
})



//box label
const labels = document.querySelectorAll('.label');

labels.forEach(label => {
    label.addEventListener('dragover', event => {
        event.preventDefault();
        const afterElement = getDragAfterElement(label, event.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            label.appendChild(draggable);
        } else {
            label.insertBefore(draggable, afterElement);
        }
    });

    label.addEventListener('drop', event => {
        event.preventDefault()
        labels.forEach(label => {
            const oldInputs = label.querySelectorAll('input')
            oldInputs.forEach(input => {
                input.remove()
            })
            const tasksInLabel = label.querySelectorAll('.draggable')
            if (tasksInLabel !== null) {
                tasksInLabel.forEach(task => {
                    const inputElem = document.createElement('input')
                    inputElem.setAttribute('type', 'hidden')
                    const existingInput = label.querySelectorAll('input')
                    inputElem.setAttribute('name', 'iuput' + '-' + label.id + '-' + existingInput.length)
                    inputElem.value = task.id
                    label.appendChild(inputElem)
                })
            }
        })
    })
});

// task container
taskContainer.addEventListener('dragover', event => {
    event.preventDefault();
    const afterElement = getDragAfterElement(taskContainer, event.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        taskContainer.appendChild(draggable);
    } else {
        taskContainer.insertBefore(draggable, afterElement);
    }
});


function getDragAfterElement(label, y) {
    const draggableElements = [...label.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        console.log(offset)
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

//form
var inputList = []

function formHandleClick() {
    alert("Submit form");
    //event.preventDefault(); // disable normal form submit behavior
    try {
        inputList = []
        const inputs = document.querySelectorAll('input')
        inputs.forEach(input => {
            const strList = (input.name).split('-')
            const qc = strList[3]
            const order = strList[4]
            const task = input.value
            const inputDetail = {
                qc: qc,
                order: order,
                taskShortName: task
            }
            inputList.push(inputDetail)
        })
        console.log(inputList)
        var xdd = document.querySelector('.lable')
        var storedTask = taskList.filter(findTask)
        console.log(storedTask)
        
    } catch(e) {
        console.log(e)
    }
    return false; // prevent further bubbling of event
}

// load stored value
var xdd = document.querySelector('.lable')
var storedTask = taskList.filter(findTask)
console.log(storedTask)

function findTask(task) {
    return task.code == 124
}

