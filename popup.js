document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("settings");
  const options = document.getElementById("options");
  const menu = document.getElementById("menu");

  // Load saved visibility state from localStorage
  const savedVisibility = JSON.parse(localStorage.getItem("menuVisibility")) || {};

  // Base URL for the instance
  const instance = "https://mc.exacttarget.com/cloud/#app/Email/Default.aspx";

  // Map button IDs to specific paths
  const buttonUrls = {
    button1: `${instance}/home`,
    button2: `${instance}/overview`,
    button3: `${instance}/email-studio`,
    button4: `${instance}/subscribers`,
    button5: `${instance}/cloud-pages`,
    button6: `${instance}/reporting`,
    button7: `${instance}/automation-studio`,
    button8: `${instance}/journey-builder`,
    button9: `${instance}/content-builder`,
    button10: `${instance}/contact-builder`,
    button11: `${instance}/admin`,
  };

  // Initialize menu and checkboxes based on saved state
  const initializeState = () => {
    const checkboxes = document.querySelectorAll('[data-button-id]');
    checkboxes.forEach((checkbox) => {
      const buttonId = checkbox.getAttribute('data-button-id');
      const button = document.getElementById(buttonId);

      // Set checkbox state
      checkbox.checked = savedVisibility[buttonId] !== false;

      // Set menu button visibility
      if (savedVisibility[buttonId] === false) {
        button.classList.add("hidden");
      } else {
        button.classList.remove("hidden");
      }

      // Set button URL
      if (buttonUrls[buttonId]) {
        // Check if there's already an anchor inside
        let link = button.querySelector("a");
        if (!link) {
          // Wrap button content in an anchor
          const buttonText = button.textContent.trim();
          link = document.createElement("a");
          link.textContent = buttonText;
          link.href = buttonUrls[buttonId];
          link.target = "_blank";
          link.className = "w-full h-full flex justify-center items-center"; // Optional: Adjust styles
          button.innerHTML = ""; // Clear existing content
          button.appendChild(link); // Add anchor to button
        } else {
          // Update href if anchor already exists
          link.href = buttonUrls[buttonId];
        }
      }
    });
  };

  initializeState();

  // Toggle settings options and menu visibility
  settingsButton.addEventListener("click", () => {
    const isOptionsHidden = options.classList.contains("hidden");
    if (isOptionsHidden) {
      options.classList.remove("hidden");
      menu.classList.add("hidden");
    } else {
      options.classList.add("hidden");
      menu.classList.remove("hidden");
    }
  });

  // Handle checkbox changes
  options.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (!checkbox.hasAttribute('data-button-id')) return;

    const buttonId = checkbox.getAttribute('data-button-id');
    const button = document.getElementById(buttonId);

    if (checkbox.checked) {
      button.classList.remove("hidden");
      savedVisibility[buttonId] = true;
    } else {
      button.classList.add("hidden");
      savedVisibility[buttonId] = false;
    }

    // Save visibility state to localStorage
    localStorage.setItem("menuVisibility", JSON.stringify(savedVisibility));
  });
});





document.addEventListener("DOMContentLoaded", () => {
  const sortableOptions = document.getElementById("sortable-options");
  const menu = document.getElementById("menu");

  // Enable drag-and-drop sorting
  sortableOptions.addEventListener("dragstart", (event) => {
    event.target.classList.add("dragging");
  });

  sortableOptions.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
    saveOrder();
  });

  sortableOptions.addEventListener("dragover", (event) => {
    event.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(sortableOptions, event.clientY);
    if (afterElement == null) {
      sortableOptions.appendChild(draggingItem);
    } else {
      sortableOptions.insertBefore(draggingItem, afterElement);
    }
  });

  // Find the element to insert after
  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  // Save the order of items to localStorage
  const saveOrder = () => {
    const order = [...sortableOptions.children].map((item) =>
      item.querySelector("input").getAttribute("data-button-id")
    );
    localStorage.setItem("menuOrder", JSON.stringify(order));
    applyOrder(order);
  };

  // Apply the saved order to the menu
  const applyOrder = (order) => {
    order.forEach((buttonId) => {
      const menuButton = document.getElementById(buttonId);
      if (menuButton) {
        menu.appendChild(menuButton);
      }
    });
  };

  // Load and apply saved order
  const loadOrder = () => {
    const savedOrder = JSON.parse(localStorage.getItem("menuOrder")) || [];
    applyOrder(savedOrder);
    savedOrder.forEach((buttonId) => {
      const option = [...sortableOptions.children].find(
        (item) => item.querySelector("input").getAttribute("data-button-id") === buttonId
      );
      if (option) {
        sortableOptions.appendChild(option);
      }
    });
  };

  // Initialize by loading saved order
  loadOrder();

  // Enable drag-and-drop functionality for each list item
  [...sortableOptions.children].forEach((item) => {
    item.setAttribute("draggable", true);
  });
});
