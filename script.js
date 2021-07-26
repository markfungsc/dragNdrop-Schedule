// rows
const table = document.querySelector('tbody')
const qcs = document.getElementsByClassName('qc');
const nbOfQc = [...qcs].length;
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursaday", "Friday", "Saturday", "Sunday"]
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
        label.classList.add('box', 'label');
        secondRow.append(label);
    }

    table.appendChild(firstRow);
    table.appendChild(secondRow);
}


// task container
const taskContainer = document.querySelector('.task-container');
const createTaskButton = document.querySelector('#createTask-btn');
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


