let ramenMenu; // Define the variable here

document.addEventListener("DOMContentLoaded", () => {
  // query selectors
  ramenMenu = document.querySelector("#ramen-menu");
  const ramenDetail = document.querySelector("#ramen-detail");
  const ramenName = document.querySelector(".name"); // Use class selector
  const ramenRestaurant = document.querySelector(".restaurant"); // Use class selector
  const ramenImage = document.querySelector(".detail-image"); // Use class selector
  const ramenRating = document.querySelector("#rating-display");
  const ramenComment = document.querySelector("#comment-display");

  // Challenge 1: Fetch and render ramen images
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((ramenArray) => {
      ramenArray.forEach((ramenObj) => {
        renderRamen(ramenObj);
      });
    });

  // Fetch and display details of the first ramen on page load (Advanced Deliverable 1)
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((ramenArray) => {
      if (ramenArray.length > 0) {
        const firstRamen = ramenArray[0];
        renderRamenDetail(firstRamen); // Display the details in the #ramen-detail section
      }
    });

  // Challenge 2: Click on an image to see details
  ramenMenu.addEventListener("click", (event) => {
    const clickedImage = event.target.closest("img"); // Get the closest img element
    if (clickedImage) {
      const ramenId = clickedImage.dataset.id;

      // Check if the clicked image is a new ramen entry
      if (ramenId === "new") {
        // Handle new ramen entry differently (e.g., show form)
        // For now, let's just clear the detail section
        clearRamenDetail();
      } else {
        // Fetch details of the selected ramen and render its details
        fetch(`http://localhost:3000/ramens/${ramenId}`)
          .then((response) => response.json())
          .then((ramenObj) => {
            renderRamenDetail(ramenObj);
          });
      }
    }
  });

  // Advanced Deliverable 2: Update rating and comment for a ramen
  const editRamenForm = document.querySelector("#edit-ramen");
  editRamenForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent reload

    // Get the ID of the ramen currently displayed in the detail section
    const ramenId = ramenDetail.dataset.id;

    // Update the rating and comment for the displayed ramen
    const newRating = document.querySelector("#edit-new-rating").value;
    const newComment = document.querySelector("#edit-new-comment").value;

    // Update the frontend directly without sending a request to the server
    ramenRating.textContent = newRating;
    ramenComment.textContent = newComment;

    // Reset the form
    editRamenForm.reset();
    console.log("Edit form submitted");
    console.log("Ramen ID:", ramenId);
    console.log("New Rating:", newRating);
    console.log("New Comment:", newComment);
  });

  // Advanced Deliverable 3: Delete a ramen
  const deleteButton = document.querySelector("#delete-button");
  deleteButton.addEventListener("click", async () => {
    // Get the ID of the ramen currently displayed in the detail section
    const ramenId = ramenDetail.dataset.id;

    // Send a DELETE request to the server to remove the ramen
    try {
      await fetch(`http://localhost:3000/ramens/${ramenId}`, {
        method: "DELETE",
      });

      // Remove the ramen from the menu and detail sections
      const ramenContainer = document.querySelector(`[data-id="${ramenId}"]`);
      if (ramenContainer) {
        ramenContainer.remove();
      }
      clearRamenDetail();
    } catch (error) {
      console.error("Error deleting ramen:", error);
    }
  });

  // Create a new ramen after submitting the `new-ramen` form
  const newRamenForm = document.querySelector("#new-ramen");
  newRamenForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent reload

    // Create new ramen object from input values
    const newRamen = {
      name: document.querySelector("#new-name").value,
      restaurant: document.querySelector("#new-restaurant").value,
      image: document.querySelector("#new-image").value,
      rating: document.querySelector("#new-rating").value,
      comment: document.querySelector("#new-comment").value,
    };

    // Create a new ramen entry on the server and get its ID
    const response = await fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRamen),
    });
    const newRamenData = await response.json();

    // Render the new ramen entry in the nav bar
    renderRamen(newRamenData);

    // Reset the form
    newRamenForm.reset();
  });

  // Function to render a ramen object in the nav bar
  function renderRamen(ramenObj) {
    const ramenImg = document.createElement("img");
    ramenImg.src = ramenObj.image; // Use the provided image link
    ramenImg.dataset.id = ramenObj.id;
    ramenMenu.append(ramenImg);
  }

  // Function to render ramen details
  function renderRamenDetail(ramenObj) {
    ramenDetail.dataset.id = ramenObj.id;
    ramenName.textContent = ramenObj.name;
    ramenRestaurant.textContent = ramenObj.restaurant;
    ramenImage.src = ramenObj.image;
    ramenRating.textContent = ramenObj.rating;
    ramenComment.textContent = ramenObj.comment;
  }

  // Function to clear the ramen detail section
  function clearRamenDetail() {
    ramenDetail.dataset.id = "";
    ramenName.textContent = "";
    ramenRestaurant.textContent = "";
    ramenImage.src = "";
    ramenRating.textContent = "";
    ramenComment.textContent = "";
  }
});


// Done 

