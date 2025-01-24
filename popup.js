// Get references to the buttons and elements
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// Event listener for starting the analysis
startBtn.addEventListener("click", () => {
  // Send a message to start data tracking
  chrome.runtime.sendMessage({ action: "start" });

  // Disable the start button and enable the stop button
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

// Event listener for stopping the analysis
stopBtn.addEventListener("click", () => {
  // Send a message to stop data tracking
  chrome.runtime.sendMessage({ action: "stop" });

  // Disable the stop button and enable the start button
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Event listener for resetting the data
resetBtn.addEventListener("click", () => {
  // Reset data usage in local storage
  chrome.storage.local.set({ dataUsage: 0 });

  // Update the UI with the new results
  updateResults(0);
});

// Function to update the results displayed on the page
function updateResults(dataUsage) {
  const dataMB = (dataUsage / (1024 * 1024)).toFixed(2); // Convert bytes to MB
  const electricity = (dataMB * 0.005).toFixed(2); // Example: 5 kWh per GB
  const ghg = (electricity * 0.4 * 1000).toFixed(2); // Convert kg CO₂ to milligrams

  // Update the text content of the elements with the calculated values
  document.getElementById("data-usage").textContent = `${dataMB} MB`;
  document.getElementById("electricity").textContent = `${electricity} kWh`;
  document.getElementById("ghg").textContent = `${ghg} mg CO₂`; // Display in milligrams

  // Calculate and display equivalence
  calculateEquivalence(ghg);
}

// Function to calculate equivalence of GHG emissions
function calculateEquivalence(ghg) {
  // 1 cigarette = 14 mg CO₂
  const cigarettes = (ghg / 14).toFixed(2);

  // 1 minute of car running = 6000 mg CO₂ (assuming 30 mph, 180 grams CO₂ per mile)
  const carMinutes = (ghg / 6000).toFixed(2);

  // Update the equivalence messages
  document.getElementById("cigarettes-equivalent").textContent = `Equivalent to smoking ${cigarettes} cigarettes`;
  document.getElementById("car-equivalent").textContent = `Equivalent to running a car for ${carMinutes} minutes`;
}

// Get the data usage from local storage when the popup is opened
chrome.storage.local.get("dataUsage", (data) => {
  // Update the results with the stored data usage or 0 if not set
  updateResults(data.dataUsage || 0);
});
