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

// Custom Links functionality
document.addEventListener("DOMContentLoaded", () => {
  const addCustomLinkBtn = document.getElementById("add-custom-link");
  const customLinkForm = document.getElementById("custom-link-form");
  const cancelCustomLinkBtn = document.getElementById("cancel-custom-link");
  const saveCustomLinkBtn = document.getElementById("save-custom-link");
  const sortableOptions = document.getElementById("sortable-options");
  const menu = document.getElementById("menu");

  // Load saved custom links
  const loadCustomLinks = () => {
    const savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];
    savedLinks.forEach(link => {
      addCustomLinkToUI(link.name, link.url, link.id);
    });
  };

  // Add custom link to UI
  const addCustomLinkToUI = (name, url, id) => {
    // Add to settings panel
    const listItem = document.createElement("li");
    listItem.className = "flex items-center justify-between p-2 bg-gray-100 dark:bg-[#212121] hover:bg-gray-200 dark:hover:bg-[#2f2f2f] border border-gray-200 dark:border-[#ffffff26] rounded shadow-sm translate duration-300 group";
    listItem.setAttribute("draggable", "true");
    listItem.setAttribute("data-button-id", `custom-${id}`);

    listItem.innerHTML = `
      <div class="flex items-center flex-grow">
        <input type="checkbox" data-button-id="custom-${id}" class="w-4 h-4 border-gray-300 rounded" checked />
        <label class="ml-2 text-sm font-medium text-gray-700 dark:text-white">${name}</label>
      </div>
      <div class="flex items-center">
        <button class="delete-link text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div class="sortable-icon ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-black dark:text-[#fff] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    `;

    sortableOptions.appendChild(listItem);

    // Add to menu
    const menuItem = document.createElement("li");
    menuItem.innerHTML = `
      <button id="custom-${id}" class="bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] hover:text-[var(--accent-color)] focus:bg-gray-100 dark:focus:bg-[#2f2f2f] w-full p-4 border-b border-gray-200 dark:border-[#ffffff26] font-medium text-sm">
        <a href="${url}" target="_blank" class="w-full h-full flex justify-center items-center">${name}</a>
      </button>
    `;
    menu.appendChild(menuItem);

    // Add event listeners
    const deleteBtn = listItem.querySelector(".delete-link");
    deleteBtn.addEventListener("click", () => deleteCustomLink(id));

    const checkbox = listItem.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", (e) => {
      const buttonId = e.target.getAttribute('data-button-id');
      const button = document.getElementById(buttonId);
      const savedVisibility = JSON.parse(localStorage.getItem("menuVisibility")) || {};

      if (e.target.checked) {
        button.classList.remove("hidden");
        savedVisibility[buttonId] = true;
      } else {
        button.classList.add("hidden");
        savedVisibility[buttonId] = false;
      }

      localStorage.setItem("menuVisibility", JSON.stringify(savedVisibility));
    });
  };

  // Delete custom link
  const deleteCustomLink = (id) => {
    // Remove from UI
    document.querySelector(`[data-button-id="custom-${id}"]`).remove();
    document.getElementById(`custom-${id}`).parentElement.remove();

    // Update localStorage
    const savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];
    const updatedLinks = savedLinks.filter(link => link.id !== id);
    localStorage.setItem("customLinks", JSON.stringify(updatedLinks));

    // Update visibility state
    const savedVisibility = JSON.parse(localStorage.getItem("menuVisibility")) || {};
    delete savedVisibility[`custom-${id}`];
    localStorage.setItem("menuVisibility", JSON.stringify(savedVisibility));
  };

  // Show custom link form
  addCustomLinkBtn.addEventListener("click", () => {
    customLinkForm.classList.add("active");
  });

  // Hide custom link form
  cancelCustomLinkBtn.addEventListener("click", () => {
    customLinkForm.classList.remove("active");
    document.getElementById("custom-link-name").value = "";
    document.getElementById("custom-link-url").value = "";
  });

  // Save custom link
  saveCustomLinkBtn.addEventListener("click", () => {
    const name = document.getElementById("custom-link-name").value.trim();
    const url = document.getElementById("custom-link-url").value.trim();

    if (!name || !url) {
      alert("Please fill in both name and URL fields");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const id = Date.now().toString();
    const newLink = { id, name, url };

    // Add to UI
    addCustomLinkToUI(name, url, id);

    // Save to localStorage
    const savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];
    savedLinks.push(newLink);
    localStorage.setItem("customLinks", JSON.stringify(savedLinks));

    // Reset form
    document.getElementById("custom-link-name").value = "";
    document.getElementById("custom-link-url").value = "";
    customLinkForm.classList.remove("active");
  });

  // Initialize custom links
  loadCustomLinks();
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
    const order = [...sortableOptions.children].map((item) => {
      const buttonId = item.querySelector("input[type='checkbox']").getAttribute("data-button-id");
      return buttonId;
    });
    localStorage.setItem("menuOrder", JSON.stringify(order));
    applyOrder(order);
  };

  // Apply the saved order to the menu
  const applyOrder = (order) => {
    order.forEach((buttonId) => {
      const menuButton = document.getElementById(buttonId);
      if (menuButton) {
        menu.appendChild(menuButton.parentElement);
      }
    });
  };

  // Load and apply saved order
  const loadOrder = () => {
    const savedOrder = JSON.parse(localStorage.getItem("menuOrder")) || [];
    if (savedOrder.length > 0) {
      applyOrder(savedOrder);
      savedOrder.forEach((buttonId) => {
        const option = [...sortableOptions.children].find(
          (item) => item.querySelector("input[type='checkbox']").getAttribute("data-button-id") === buttonId
        );
        if (option) {
          sortableOptions.appendChild(option);
        }
      });
    }
  };

  // Initialize by loading saved order
  loadOrder();

  // Enable drag-and-drop functionality for each list item
  [...sortableOptions.children].forEach((item) => {
    item.setAttribute("draggable", true);
  });
});

// Color picker functionality
document.addEventListener("DOMContentLoaded", () => {
  const colorPicker = document.getElementById("accent-color-picker");
  const colorValue = document.getElementById("accent-color-value");
  
  // Load saved color or use default
  const savedColor = localStorage.getItem("accentColor") || "#3b82f6";
  colorPicker.value = savedColor;
  colorValue.textContent = savedColor;
  document.documentElement.style.setProperty("--accent-color", savedColor);

  // Update color when picker changes
  colorPicker.addEventListener("input", (e) => {
    const newColor = e.target.value;
    colorValue.textContent = newColor;
    document.documentElement.style.setProperty("--accent-color", newColor);
    localStorage.setItem("accentColor", newColor);
  });

  // Update color when picker changes (for change event)
  colorPicker.addEventListener("change", (e) => {
    const newColor = e.target.value;
    colorValue.textContent = newColor;
    document.documentElement.style.setProperty("--accent-color", newColor);
    localStorage.setItem("accentColor", newColor);
  });
});

