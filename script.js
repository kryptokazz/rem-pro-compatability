const manufacturerSelect = document.getElementById('manufacturerSelect');
const modelSelect = document.getElementById('modelSelect');
const carImagesContainer = document.getElementById('carImagesContainer');
let carData; // Variable to store the fetched JSON data

// Fetch car data from the server
fetch('http://localhost:3000/api/items')
  .then(response => response.json())
  .then(data => {
    // Store the fetched data
    carData = data;

    // Extract manufacturer names from the array of objects
    const manufacturerNames = data.map(item => item.manufacturer);

    // Call the function to populate the manufacturer dropdown and update models
    populateDropdowns(manufacturerNames);
  })
  .catch(error => {
    console.error('Error fetching car data', error);
  });
function populateDropdowns(manufacturerNames) {
  // Clear existing options
  manufacturerSelect.innerHTML = '';
  modelSelect.innerHTML = '';
  carImagesContainer.innerHTML = '';

  // Add default options
  const defaultManufacturerOption = document.createElement('option');
  defaultManufacturerOption.value = 'selectManufacturer';
  defaultManufacturerOption.text = 'Select Manufacturer';
  manufacturerSelect.add(defaultManufacturerOption);

  const defaultModelOption = document.createElement('option');
  defaultModelOption.value = 'selectModel';
  defaultModelOption.text = 'Select Model';
  modelSelect.add(defaultModelOption);

  // Populate manufacturer dropdown
  manufacturerNames.forEach(manufacturerName => {
    const manufacturerOption = document.createElement('option');
    manufacturerOption.value = manufacturerName.toLowerCase();
    manufacturerOption.text = manufacturerName;
    manufacturerSelect.add(manufacturerOption);
  });

  // Add event listeners
  manufacturerSelect.addEventListener('change', handleManufacturerChange);
  modelSelect.addEventListener('change', () => handleSelectionChange(modelSelect));
}

function updateModels(manufacturer) {
  // Find the selected manufacturer in the carData array
  const selectedManufacturer = carData.find(item => item.manufacturer.toLowerCase() === manufacturer);
  const models = selectedManufacturer ? selectedManufacturer.models : [];

  modelSelect.innerHTML = '';
  carImagesContainer.innerHTML = '';

  if (models.length > 0) {
    modelSelect.disabled = false;

    models.forEach(modelText => {
      const modelOption = document.createElement('option');
      modelOption.value = modelText.toLowerCase();
      modelOption.text = modelText;
      modelSelect.add(modelOption);
    });

    // Additional logic to update car images if needed
  } else {
    modelSelect.disabled = true;
  }
}

function handleManufacturerChange() {
  const selectedManufacturer = manufacturerSelect.value.toLowerCase();
  updateModels(selectedManufacturer);
}

function handleSelectionChange(selectBox) {
  console.log(`Selected value in ${selectBox.id}: ${selectBox.value}`);
}

