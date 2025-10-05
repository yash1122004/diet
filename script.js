function setupSearch(inputId, suggestionsId, hiddenInputId, mealType) {
  const input = document.getElementById(inputId);
  const suggestionsContainer = document.getElementById(suggestionsId);
  const hiddenInput = document.getElementById(hiddenInputId);

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestionsContainer.innerHTML = "";
    hiddenInput.value = "";
    if (query.length > 0) {
      const filteredMeals = meals[mealType].filter(item =>
        item.name.toLowerCase().includes(query)
      );
      if (filteredMeals.length > 0) {
        suggestionsContainer.style.display = "block";
        filteredMeals.forEach(item => {
          const div = document.createElement("div");
          div.className = "item";
          div.textContent = `${item.name} (~${item.caloriesPer100g} kcal / ${item.proteinPer100g}g protein per 100g)`;
          div.addEventListener("click", () => {
            input.value = item.name;
            hiddenInput.value = JSON.stringify(item);
            suggestionsContainer.style.display = "none";
          });
          suggestionsContainer.appendChild(div);
        });
      }
    }
  });
}

setupSearch("breakfastSearch", "breakfastSuggestions", "selectedBreakfast", "breakfast");
setupSearch("lunchSearch", "lunchSuggestions", "selectedLunch", "lunch");
setupSearch("dinnerSearch", "dinnerSuggestions", "selectedDinner", "dinner");

document.getElementById("dietForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const goal = this.getAttribute("data-goal");
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  const breakfast = document.getElementById("selectedBreakfast").value ? JSON.parse(document.getElementById("selectedBreakfast").value) : null;
  const lunch = document.getElementById("selectedLunch").value ? JSON.parse(document.getElementById("selectedLunch").value) : null;
  const dinner = document.getElementById("selectedDinner").value ? JSON.parse(document.getElementById("selectedDinner").value) : null;

  const grams = {
    breakfast: parseFloat(document.getElementById("breakfastGrams").value) || 0,
    lunch: parseFloat(document.getElementById("lunchGrams").value) || 0,
    dinner: parseFloat(document.getElementById("dinnerGrams").value) || 0
  };

  let totalCalories = 0, totalProtein = 0;
  const mealsSelected = [];

  function processMeal(meal, type, gramsVal) {
    if (meal && gramsVal > 0) {
      const cal = (meal.caloriesPer100g / 100) * gramsVal;
      const prot = (meal.proteinPer100g / 100) * gramsVal;
      totalCalories += cal;
      totalProtein += prot;
      mealsSelected.push({ type, name: meal.name, grams: gramsVal, cal, prot });
    }
  }

  processMeal(breakfast, "Breakfast", grams.breakfast);
  processMeal(lunch, "Lunch", grams.lunch);
  processMeal(dinner, "Dinner", grams.dinner);

  const maintenanceCalories = weight * 30;
  const targetCalories = goal === "fat-loss" ? maintenanceCalories - 500 : maintenanceCalories + 500;
  const proteinTarget = Math.round(weight * 1.8); // g protein

  const resultData = {
    goal,
    weight,
    height,
    mealsSelected,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    targetCalories,
    proteinTarget
  };

  localStorage.setItem("dietResult", JSON.stringify(resultData));

  if (goal === "fat-loss") {
    window.location.href = "fat-loss-result.html";
  } else {
    window.location.href = "bulking-result.html";
  }
  document.getElementById("dietForm").addEventListener("submit", function (e) {
  e.preventDefault(); // stop page reload

  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;
  const breakfast = document.getElementById("breakfastSearch").value + " (" + document.getElementById("breakfastGrams").value + "g)";
  const lunch = document.getElementById("lunchSearch").value + " (" + document.getElementById("lunchGrams").value + "g)";
  const dinner = document.getElementById("dinnerSearch").value + " (" + document.getElementById("dinnerGrams").value + "g)";

  let resultHTML = `
    <h2>Your Fat Loss Plan</h2>
    <p><strong>Weight:</strong> ${weight} kg</p>
    <p><strong>Height:</strong> ${height} cm</p>
    <div class="card"><h3>Breakfast</h3><p>${breakfast}</p></div>
    <div class="card"><h3>Lunch</h3><p>${lunch}</p></div>
    <div class="card"><h3>Dinner</h3><p>${dinner}</p></div>
  `;

  const planResult = document.getElementById("planResult");
  planResult.innerHTML = resultHTML;
  planResult.style.display = "block";
});

});
