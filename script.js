const goalInput = document.getElementById("goalInput");
const categorySelect = document.getElementById("categorySelect");
const addBtn = document.getElementById("addBtn");
const mobileAddBtn = document.getElementById("mobileAddBtn");
const goalList = document.getElementById("goalList");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".nav-btn");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const emptyState = document.getElementById("emptyState");
const themeToggle = document.getElementById("themeToggle");
const mobileThemeToggle = document.getElementById("mobileThemeToggle");

let goals = JSON.parse(localStorage.getItem("goals")) || [];
let currentFilter = "all";

/* Theme */
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);

/* Save */
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

/* Dashboard */
function updateDashboard() {
    const completed = goals.filter(g => g.completed).length;
    totalCount.textContent = goals.length;
    completedCount.textContent = completed;
    pendingCount.textContent = goals.length - completed;
}

/* Render */
function renderGoals() {
    goalList.innerHTML = "";
    const search = searchInput.value.toLowerCase();

    const filtered = goals.filter(goal => {
        const match = goal.text.toLowerCase().includes(search);
        if (currentFilter === "completed") return goal.completed && match;
        if (currentFilter === "pending") return !goal.completed && match;
        return match;
    });

    emptyState.style.display = filtered.length ? "none" : "block";

    filtered.forEach(goal => {
        const li = document.createElement("li");
        li.className = "goal-item";

        li.innerHTML = `
            <div class="goal-left">
                <input type="checkbox" ${goal.completed ? "checked" : ""}>
                <span class="goal-text ${goal.completed ? "completed" : ""}">
                    ${goal.text}
                </span>
                <span class="tag">${goal.category}</span>
            </div>
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        li.querySelector("input").addEventListener("change", () => {
            goal.completed = !goal.completed;
            saveGoals();
            renderGoals();
            updateDashboard();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            goals.splice(goals.indexOf(goal), 1);
            saveGoals();
            renderGoals();
            updateDashboard();
        });

        goalList.appendChild(li);
    });

    updateDashboard();
}

/* Add */
function addGoal() {
    const text = goalInput.value.trim();
    if (!text) return;

    goals.push({
        text,
        category: categorySelect.value,
        completed: false
    });

    goalInput.value = "";
    saveGoals();
    renderGoals();
}

addBtn.addEventListener("click", addGoal);
mobileAddBtn.addEventListener("click", addGoal);

goalInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addGoal();
});

/* Filters */
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderGoals();
    });
});

/* Search */
searchInput.addEventListener("input", renderGoals);

/* Init */
renderGoals();
updateDashboard();
