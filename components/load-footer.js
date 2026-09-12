// load-footer.js
//  /components/footer.js
// Add the folder name to the fetch path
fetch('/components/footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Error loading the footer:', error));