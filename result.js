window.onload = () => {
  const resultData = JSON.parse(localStorage.getItem("dietResult"));
  if (!resultData) return;

  let html = `<h2>Goal: ${resultData.goal}</h2>`;
  html += `<p><b>Weight:</b> ${resultData.weight} kg | <b>Height:</b> ${resultData.height} cm</p>`;

  html += `<h3>Meals:</h3>`;
  resultData.mealsSelected.forEach(m => {
    html += `<div class="meal">
      <h4>${m.type}: ${m.name} (${m.grams} g)</h4>
      <p>Calories: ${Math.round(m.cal)} kcal | Protein: ${Math.round(m.prot)} g</p>
    </div>`;
  });

  html += `<hr><p><b>Total Calories:</b> ${resultData.totalCalories} kcal</p>`;
  html += `<p><b>Total Protein:</b> ${resultData.totalProtein} g</p>`;
  html += `<p><b>Target Calories:</b> ${resultData.targetCalories} kcal</p>`;
  html += `<p><b>Recommended Protein Intake:</b> ${resultData.proteinTarget} g/day</p>`;

  if (resultData.totalProtein < resultData.proteinTarget) {
    html += `<div class="suggestion">⚡ You need more protein. Suggested foods: Eggs, Paneer, Chicken, Tofu, Lentils.</div>`;
  }

  document.getElementById("resultSection").innerHTML = html;
};
