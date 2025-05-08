document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("settings");
  const options = document.getElementById("options");
  const menu = document.getElementById("menu");
  const html = document.documentElement;

  // Set initial theme based on system preference
  const setTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  // Initialize theme
  setTheme();

  // Listen for system theme changes
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  });

  // Load saved visibility state from localStorage
  const savedVisibility = JSON.parse(localStorage.getItem("menuVisibility")) || {};

  // Map button IDs to specific paths
  const buttonUrls = {
    button1: `https://mc.exacttarget.com/cloud/#app/Marketing%20Cloud%20Dashboard/`,
    button2: `https://mc.exacttarget.com/cloud/#app/Email/Default.aspx?ks=ks%23Overview`,
    button3: `https://mc.exacttarget.com/cloud/#app/Email/Default.aspx?ks=ks%23Content`,
    button4: `https://mc.exacttarget.com/cloud/#app/Email/Default.aspx?ks=ks%23Subscribers`,
    button5: `https://mc.exacttarget.com/cloud/#app/CloudPages/`,
    button6: `https://mc.exacttarget.com/cloud/#app/Reports/Reports/`,
    button7: `https://mc.exacttarget.com/cloud/#app/Automation%20Studio/AutomationStudioFuel3/`,
    button8: `https://mc.exacttarget.com/cloud/#app/Journey%20Builder/%23dashboard/view/all-journeys/`,
    button9: `https://mc.exacttarget.com/cloud/#app/Content%20Builder/`,
    button10: `https://mc.exacttarget.com/cloud/#app/Contact%20Builder/`,
    button11: `https://mc.exacttarget.com/cloud/#app/Email/Default?ks=ks%23Admin`,
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
          link.className = "w-full h-full flex justify-center items-center";
          button.innerHTML = "";
          button.appendChild(link);
        } else {
          // Update href if anchor already exists
          link.href = buttonUrls[buttonId];
        }
      }
    });
  };

  initializeState();

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

// Settings button functionality
document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("settings");
  const options = document.getElementById("options");
  const menu = document.getElementById("menu");

  // SVG icons for settings (cog) and close (X)
  const cogIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;

  // Toggle the button icon and visibility of options
  settingsButton.addEventListener("click", () => {
    const isCog = settingsButton.innerHTML.includes("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0");

    // Clear button's innerHTML to remove all existing content
    settingsButton.innerHTML = "";

    // Add the appropriate icon
    settingsButton.innerHTML = isCog ? closeIcon : cogIcon;

    // Toggle visibility of menu and options
    if (options && menu) {
      const isOptionsHidden = options.classList.contains("hidden");
      options.classList.toggle("hidden", !isOptionsHidden);
      menu.classList.toggle("hidden", isOptionsHidden);
    }
  });
});

// Sortable functionality
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

