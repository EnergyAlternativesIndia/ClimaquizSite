// script.js

let urls = [];

function addUrlInput() {
  const urlInputs = document.getElementById('urlInputs');
  const input = document.createElement('input');
  input.type = 'url';
  input.name = 'url';
  urlInputs.appendChild(input);
}

function removeUrlInput() {
  const urlInputs = document.getElementById('urlInputs');
  if (urlInputs.children.length > 0) {
    urlInputs.removeChild(urlInputs.lastChild);
  }
}

document.getElementById('urlForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const urlValues = formData.getAll('url');
  urls = urlValues;
  console.log(urls);
  sendUrlsToApi(urls);
});

async function sendUrlsToApi(urls) {
  try {
    const response = await fetch('https://kikipe5563.pythonanywhere.com/article-parser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls : urls }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from the Flask API');
    }

    const data = await response.json();
        if (typeof data.errors === 'number' && data.errors > 0) {
      const errorLinks = data.error_links.join('\n');
      displayErrorLinks(errorLinks);}
    const articles = data.articles;

    // Send the list of articles to the second API endpoint
    const secondApiResponse = await fetch('https://suryars123.pythonanywhere.com/quiz-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articles : articles }),
    });

    if (!secondApiResponse.ok) {
      throw new Error('Failed to fetch data from the second API');
    }

    const secondApiData = await secondApiResponse.json();
    console.log('Final response from second API:', secondApiData);
    displayResponse(secondApiData); // Assuming you have a function to display the response
  } catch (error) {
    console.error('Error sending URLs to API and getting articles:', error);
  }
}


function displayErrorLinks(errorLinks) {
  const errorBox = document.createElement('div');
  errorBox.className = 'error-box';
  errorBox.textContent = errorLinks;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.onclick = function () {
    errorBox.parentNode.removeChild(errorBox);
  };

  errorBox.appendChild(closeButton);
  document.getElementById('errorContainer').appendChild(errorBox);
}

  function displayResponse(responseObject) {
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = ''; // Clear previous content
  
    if (Array.isArray(responseObject.mcqs)) {
      responseObject.mcqs.forEach(element => {
        const textarea = document.createElement('textarea');
        textarea.textContent = element;
        responseContainer.appendChild(textarea);
  
        const addButton = document.createElement('button');
        addButton.textContent = 'Add MCQ';
        addButton.className = 'add-mcq-button';
        addButton.onclick = function() {
          sendMcqToApi(textarea.value);
        };
        responseContainer.appendChild(addButton);
      });
    } else {
      console.error('Invalid response format:', responseObject);
    }
  }
  
  function sendMcqToApi(mcqContent) {
    fetch('https://kikipe5563.pythonanywhere.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mcq: mcqContent }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from API:', data);
        // Handle response as needed
      })
      .catch(error => {
        console.error('Error sending MCQ to API:', error);
      });
  }
  
