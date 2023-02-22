/* Находим элементы на странице */

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask (task));
}

checkEmptyList ();

/* Добавление задачи */
form.addEventListener('submit', addTask);

/* Удаление задачи */
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);


/* Функции */
    function addTask(event) {
        /* отмена перезагрузки  */
        event.preventDefault();
        
        /* Достаем текст задачи из поля инпут */
        const taskText = taskInput.value;

        /* Описываем задачу в виде объекта */
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        };

        /* Добавляем задачу в массив с задачами */
        tasks.push(newTask);

        /* Сохраняем задачи в хранилище браузера local storage */
        saveToLocalStorage();

        renderTask (newTask);

        /* Очищаем поле ввода и возвращаем на него фокус */
        taskInput.value = '';
        taskInput.focus();

        checkEmptyList ();

        /* Проверка. если в списке задач более 1-го элемента, скрываем блок */
      /*   if (tasksList.children.length > 1) {
            emptyList.classList.add('none');
        }    */
    }

    function deleteTask (event) {
        /* Проверяем если клик был не по кнопке "удалить задачу" */

        if (event.target.dataset.action !== 'delete') return;

        const parentNode = event.target.closest('.list-group-item');

        /* Определяем ID задачи */
        const id = parentNode.id;

        /* Находим индекс задачи в массиве */
        const index = tasks.findIndex((task) => task.id === +id);

        /* Удаляем задачу из массива с задачами */
        tasks.splice(index, 1);

        /* Сохраняем задачи в хранилище браузера local storage */
        saveToLocalStorage();


        /* Удаляем задачу из разметки */
        parentNode.remove();

        checkEmptyList ();


            /* Проверка. если в списке задач 1-ин элемент,показать блок */
      /*   if (tasksList.children.length === 1) {
            emptyList.classList.remove('none');
        }  */
    }

    function doneTask (event) {

        if (event.target.dataset.action !=='done') return;

        const parentNode = event.target.closest('.list-group-item');

        /* Определяем ID задачи */
        const id = +parentNode.id;
        const task = tasks.find((task) => task.id === id);
        task.done = !task.done;

        
        /* Сохраняем задачи в хранилище браузера local storage */
        saveToLocalStorage(); 

        const taskTitle = parentNode.querySelector('.task-title');
        parentNode.classList.toggle('task-title--done');
        console.log(parentNode);
    }

    function checkEmptyList () {
        if (tasks.length === 0 ) {
            const emtyListHtml = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                  </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emtyListHtml);
        }

        if (tasks.length > 0 ) {
            const emptyListEl = document.querySelector('#emptyList');
            emptyListEl ? emptyListEl.remove() : null;
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTask (task) {
        /* Формируем CSS класс */
      const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

      /* Формируем разметку для новой задачи */
      const taskHtml = `
                  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task-item__buttons">
                          <button type="button" data-action="done" class="btn-action">
                              <img src="./img/tick.svg" alt="Done" width="18" height="18">
                          </button>
                          <button type="button" data-action="delete" class="btn-action">
                              <img src="./img/cross.svg" alt="Done" width="18" height="18">
                          </button>
                      </div>
                  </li>`;
                  
      /* Добавляем задачу на страницу */
      tasksList.insertAdjacentHTML('beforeend', taskHtml);
    }