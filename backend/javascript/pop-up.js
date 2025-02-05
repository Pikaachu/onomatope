// Declare a variable to hold the fetched data and the current index
const nextButton = document.getElementById("btn-next");
 
let data = [];
let currentIndex = 0;
 
// Fetch the data from the PHP script when the button is clicked
document.querySelector('.btn').addEventListener('click', function() {
  fetch('../db_get_onomatope.php')
    .then(response => response.json())
    .then(fetchedData => {
      if (fetchedData.error) {
        alert(fetchedData.error);
      } else {
        // Store the data globally
        data = fetchedData;
 
        // Load the first item into the popup
        loadPopupContent(currentIndex);
 
        // Show the popup and overlay
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('explanation-popup').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
 
// Function to load content into the popup based on the current index
function loadPopupContent(index) {
  const popupExplanation = document.getElementById('popup-explanation');
  popupExplanation.innerHTML = ''; // Clear previous content
 
  // If there's data to display
  if (data.length > 0 && data[index]) {
    const item = data[index];
    const p = document.createElement('p');
    p.innerHTML = `<strong>Japanese Explanation:</strong> ${item.explanation_ja}<br><strong>English Explanation:</strong> ${item.explanation_en}`;
    popupExplanation.appendChild(p);
  }
}
 
// Next button functionality
nextButton.addEventListener('click', function() {
  // Check if the data is loaded
  if (data.length === 0) {
    // If data is not loaded yet, fetch it first
    fetch('../db_get_onomatope.php')
      .then(response => response.json())
      .then(fetchedData => {
        if (fetchedData.error) {
          alert(fetchedData.error);
        } else {
          // Store the fetched data globally
          data = fetchedData;
 
          // Move to the next example
          currentIndex++;
 
          // If we've reached the end of the array, loop back to the first item
          if (currentIndex >= data.length) {
            currentIndex = 0;
          }
 
          // Load the content for the new index
          loadPopupContent(currentIndex);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  } else {
    // Move to the next example
    currentIndex++;
 
    // If we've reached the end of the array, loop back to the first item
    if (currentIndex >= data.length) {
      currentIndex = 0;
    }
 
    // Load the content for the new index
    loadPopupContent(currentIndex);
  }
});
 
// Close the popup
document.getElementById('close-explanation').addEventListener('click', function() {
  document.getElementById('popup-overlay').style.display = 'none';
  document.getElementById('explanation-popup').style.display = 'none';
});
 