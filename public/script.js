let carData;
document.addEventListener('DOMContentLoaded', function() {
    const manufacturerSelect = document.getElementById('manufacturerSelect');
    const modelSelect = document.getElementById('modelSelect');
    const carImagesContainer = document.getElementById('imageContainer');

    const apiUrl = 'http://localhost:3000/api/items';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            carData = data;
            const manufacturerNames = data.map(item => item.manufacturer);
            populateDropdowns(manufacturerNames);
        })
        .catch(error => {
            console.error('Error fetching car data:', error);
        });

    function populateDropdowns(manufacturerNames) {
        clearDropdowns();
        const defaultOption = createOption('Select', 'select');
        manufacturerSelect.add(defaultOption);

        manufacturerNames.forEach(manufacturerName => {
            const option = createOption(manufacturerName, manufacturerName.toLowerCase());
            manufacturerSelect.add(option);
        });

        manufacturerSelect.addEventListener('change', handleManufacturerChange);
        modelSelect.addEventListener('change', handleModelChange);
    }

    function clearDropdowns() {
        manufacturerSelect.innerHTML = '';
        modelSelect.innerHTML = '';
        carImagesContainer.innerHTML = '';
    }

    function createOption(text, value) {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        return option;
    }

    function handleManufacturerChange() {
        const manufacturer = manufacturerSelect.value;
        updateModels(manufacturer);
    }

    function handleModelChange() {
        const manufacturer = manufacturerSelect.value;
        const model = modelSelect.value;
        updateImages(manufacturer, model);
    }

    function updateModels(manufacturer) {
        const selectedManufacturer = carData.find(item => item.manufacturer.toLowerCase() === manufacturer);
        const models = selectedManufacturer ? selectedManufacturer.models : [];

        clearModels();

        if (models.length > 0) {
            models.forEach(modelText => {
                const option = createOption(modelText, modelText.toLowerCase());
                modelSelect.add(option);
            });
            modelSelect.disabled = false;
            updateImages(manufacturer, 'select');
        } else {
            modelSelect.disabled = true;
        }
    }

    function clearModels() {
        modelSelect.innerHTML = '';
        carImagesContainer.innerHTML = '';
    }

    function updateImages(manufacturer, model) {
        clearImages();
        const selectedCar = carData.find(item => item.manufacturer.toLowerCase() === manufacturer && item.models.includes(model));

        if (selectedCar && selectedCar.images && selectedCar.images.length > 0) {
            selectedCar.images.forEach(imageSrc => {
                const imageElement = document.createElement('img');
                imageElement.src = imageSrc;
                imageElement.alt = `${selectedCar.manufacturer} ${selectedCar.model}`;
                carImagesContainer.appendChild(imageElement);
            });
        } else {
            const noImagesMessage = document.createElement('p');
            noImagesMessage.textContent = 'No images available for the selected model.';
            carImagesContainer.appendChild(noImagesMessage);
        }
    }

    function clearImages() {
        carImagesContainer.innerHTML = '';
    }
});

function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const searchResultsContainer = document.getElementById('searchResults');
    
    // Clear previous search results
    searchResultsContainer.innerHTML = '';

    // Filter data based on search input
    const filteredData = carData.filter(item => {
        const manufacturerMatch = item.manufacturer.toLowerCase().includes(searchInput);
        const modelMatch = item.models.some(model => model.toLowerCase().includes(searchInput));
        return manufacturerMatch || modelMatch;
    });

    // Limit the number of search results to 60
    const limitedResults = filteredData.slice(0, 60);

    // Create HTML elements for each search result and append to container
    limitedResults.forEach(item => {
        const manufacturer = item.manufacturer;
        const models = item.models;

        // Create a div for manufacturer and models
        const resultElement = document.createElement('div');
        resultElement.classList.add('search-result'); // Add a CSS class for styling

        // Display models for the manufacturer
        models.forEach(model => {
            const modelWithManufacturer = `${manufacturer}: ${model}`;
            const modelNode = document.createElement('p');
            modelNode.textContent = modelWithManufacturer;
            resultElement.appendChild(modelNode);
        });

        // Append a line break after each manufacturer's models
        resultElement.appendChild(document.createElement('br'));

        // Append result element to container
        searchResultsContainer.appendChild(resultElement);
    });
}

