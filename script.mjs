/* ================= CLOCK ================= */
function updateClock() {
    const now = new Date();

    let h = String(now.getHours()).padStart(2, "0");
    let m = String(now.getMinutes()).padStart(2, "0");
    let s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerText = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ================= TODO APP ================= */
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.innerText = task.text;
    if (task.done) span.classList.add("done");
    span.onclick = () => {
        span.classList.toggle("done");
        task.done = !task.done;
        updateTaskInStorage(task.id, task);
    };

    /* EDIT BUTTON */
    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.className = "edit-btn";

    editBtn.onclick = () => {
        const newText = prompt("Edit your task:", span.innerText);
        if (newText !== null && newText.trim() !== "") {
            span.innerText = newText;
            task.text = newText;
            updateTaskInStorage(task.id, task);
        }
    };

    /* DELETE BUTTON */
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.className = "delete-btn";

    delBtn.onclick = () => {
        li.classList.add("fade-out");
        setTimeout(() => {
            li.remove();
            removeTaskFromStorage(task.id);
        }, 300);
    };

    const btnBox = document.createElement("div");
    btnBox.className = "btn-box";
    btnBox.append(editBtn, delBtn);

    li.append(span, btnBox);
    document.getElementById("taskList").appendChild(li);
}

function updateTaskInStorage(id, updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasks(tasks);
    }
}

function removeTaskFromStorage(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
}

document.addEventListener('DOMContentLoaded', loadTasks);
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    const task = {
        id: Date.now().toString(),
        text: text,
        done: false
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);

    renderTask(task);

    input.value = "";
}
