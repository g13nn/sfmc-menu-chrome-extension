document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const settingsButton = document.getElementById('settings');
  const cogIcon = document.getElementById('cog-icon');
  const closeIcon = document.getElementById('close-icon');
  const mainMenu = document.getElementById('main-menu');
  const settingsMenu = document.getElementById('settings-menu');
  const sortableOptions = document.getElementById('sortable-options');
  const addLinkForm = document.getElementById('add-link-form');
  const linkNameInput = document.getElementById('link-name');
  const linkUrlInput = document.getElementById('link-url');
  const colorPicker = document.getElementById('accent-color');
  const colorValue = document.getElementById('color-value');
  const alignLeftBtn = document.getElementById('align-left');
  const alignCenterBtn = document.getElementById('align-center');
  const alignRightBtn = document.getElementById('align-right');
  const textSize = document.getElementById('text-size');
  
  // Default accent color
  const DEFAULT_ACCENT_COLOR = '#0176d3';
  
  // Store the original menu items for reference
  const originalMenuItems = [];
  
  // Store custom links separately
  let customLinks = [];
  
  // Load custom links from local storage
  function loadCustomLinks() {
    const savedCustomLinks = localStorage.getItem('sfmcCustomLinks');
    if (savedCustomLinks) {
      customLinks = JSON.parse(savedCustomLinks);
    }
  }
  
  // Save custom links to local storage
  function saveCustomLinks() {
    localStorage.setItem('sfmcCustomLinks', JSON.stringify(customLinks));
  }
  
  // Load custom links on startup
  loadCustomLinks();
  
  // Load and apply saved accent color
  function loadSavedAccentColor() {
    const savedColor = localStorage.getItem('sfmcAccentColor');
    if (savedColor) {
      applyAccentColor(savedColor);
      colorPicker.value = savedColor;
      colorValue.textContent = savedColor;
    }
  }
  
  // Apply accent color to the CSS root variables
  function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    // Create a darker version for hover states
    const darker = darkenColor(color, 20);
    document.documentElement.style.setProperty('--accent-color-dark', darker);
    // Create a light pastel version for backgrounds
    const light = hexToRgba(color, 0.1);
    document.documentElement.style.setProperty('--accent-color-light', light);
  }

  // Apply fixed color to header cloud icon
  function applyHeaderIconColor() {
    const headerIcon = document.querySelector('.header-icon');
    if (headerIcon) {
      headerIcon.style.fill = '#27a1e0';
    }
  }
  
  // Function to darken a hex color
  function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  
  // Function to convert hex color to rgba with alpha
  function hexToRgba(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(1, 118, 211, ${alpha})`; // fallback to default blue
  }
  
  // Save accent color to local storage
  function saveAccentColor(color) {
    localStorage.setItem('sfmcAccentColor', color);
  }
  
  // Initialize color picker with saved value or default
  loadSavedAccentColor();

  // Apply fixed color to header icon
  applyHeaderIconColor();
  
  // Handle color picker changes
  colorPicker.addEventListener('input', function(e) {
    const newColor = e.target.value;
    applyAccentColor(newColor);
    colorValue.textContent = newColor;
  });
  
  // Handle color picker change completion (save on mouseup)
  colorPicker.addEventListener('change', function(e) {
    const newColor = e.target.value;
    saveAccentColor(newColor);
  });

  // Text alignment functionality
  function loadTextAlignment() {
    const savedAlignment = localStorage.getItem('sfmcTextAlignment') || 'left';
    setActiveAlignmentButton(savedAlignment);
    applyTextAlignment(savedAlignment);
  }

  function setActiveAlignmentButton(alignment) {
    // Remove active class from all buttons
    document.querySelectorAll('.alignment-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to the selected button
    if (alignment === 'left') {
      alignLeftBtn.classList.add('active');
    } else if (alignment === 'center') {
      alignCenterBtn.classList.add('active');
    } else if (alignment === 'right') {
      alignRightBtn.classList.add('active');
    }
  }

  function applyTextAlignment(alignment) {
    document.documentElement.style.setProperty('--menu-text-align', alignment);
    // Update CSS for menu links
    const menuLinks = document.querySelectorAll('.sf-nav-link');
    menuLinks.forEach(link => {
      link.style.textAlign = alignment;
      if (alignment === 'center') {
        link.style.justifyContent = 'center';
      } else if (alignment === 'right') {
        link.style.justifyContent = 'flex-end';
      } else {
        link.style.justifyContent = 'flex-start';
      }
    });
  }

  function saveTextAlignment(alignment) {
    localStorage.setItem('sfmcTextAlignment', alignment);
  }

  // Text size functionality  
  function loadTextSize() {
    const savedSize = localStorage.getItem('sfmcTextSize') || '16';
    textSize.value = savedSize;
    applyTextSize(savedSize);
  }

  function applyTextSize(size) {
    document.documentElement.style.setProperty('--menu-text-size', size + 'px');
    // Update CSS for menu links
    const menuLinks = document.querySelectorAll('.sf-nav-link');
    menuLinks.forEach(link => {
      link.style.fontSize = size + 'px';
    });
  }

  function saveTextSize(size) {
    localStorage.setItem('sfmcTextSize', size);
  }

  // Handle text alignment changes
  alignLeftBtn.addEventListener('click', function() {
    const alignment = 'left';
    setActiveAlignmentButton(alignment);
    applyTextAlignment(alignment);
    saveTextAlignment(alignment);
  });

  alignCenterBtn.addEventListener('click', function() {
    const alignment = 'center';
    setActiveAlignmentButton(alignment);
    applyTextAlignment(alignment);
    saveTextAlignment(alignment);
  });

  alignRightBtn.addEventListener('click', function() {
    const alignment = 'right';
    setActiveAlignmentButton(alignment);
    applyTextAlignment(alignment);
    saveTextAlignment(alignment);
  });

  // Handle text size changes
  textSize.addEventListener('input', function(e) {
    const newSize = e.target.value;
    applyTextSize(newSize);
  });

  textSize.addEventListener('change', function(e) {
    const newSize = e.target.value;
    saveTextSize(newSize);
  });

  // Initialize text settings
  loadTextAlignment();
  loadTextSize();

  // Apply text settings to all existing menu items
  function applySettingsToExistingMenuItems() {
    const currentAlignment = localStorage.getItem('sfmcTextAlignment') || 'left';
    const currentSize = localStorage.getItem('sfmcTextSize') || '16';
    
    const menuLinks = document.querySelectorAll('.sf-nav-link');
    menuLinks.forEach(link => {
      link.style.textAlign = currentAlignment;
      link.style.fontSize = currentSize + 'px';
      
      if (currentAlignment === 'center') {
        link.style.justifyContent = 'center';
      } else if (currentAlignment === 'right') {
        link.style.justifyContent = 'flex-end';
      } else {
        link.style.justifyContent = 'flex-start';
      }
    });
  }

  // Apply settings to existing menu items on load
  applySettingsToExistingMenuItems();

  // Helper function to apply text settings to a menu link element
  function applyTextSettingsToLink(linkElement) {
    const currentAlignment = localStorage.getItem('sfmcTextAlignment') || 'left';
    const currentSize = localStorage.getItem('sfmcTextSize') || '16';
    
    linkElement.style.textAlign = currentAlignment;
    linkElement.style.fontSize = currentSize + 'px';
    
    if (currentAlignment === 'center') {
      linkElement.style.justifyContent = 'center';
    } else if (currentAlignment === 'right') {
      linkElement.style.justifyContent = 'flex-end';
    } else {
      linkElement.style.justifyContent = 'flex-start';
    }
  }
  
  // Capture the original menu structure before any modifications
  function captureOriginalMenu() {
    originalMenuItems.length = 0; // Clear the array
    
    Array.from(mainMenu.querySelectorAll('.sf-nav-item')).forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        // Extract text content, excluding the icon
        const textContent = link.textContent.trim();
        
        // Check if this is a custom link
        const isCustom = customLinks.some(customLink => 
          customLink.text === textContent && 
          customLink.href === link.getAttribute('href'));
        
        originalMenuItems.push({
          text: textContent,
          href: link.getAttribute('href'),
          isCustom: isCustom,
          isHidden: item.classList.contains('hidden')
        });
      }
    });
    
    console.log('Captured original menu items:', originalMenuItems);
  }
  
  // Capture original menu on load
  captureOriginalMenu();

  // Apply saved menu order if it exists
  applySavedMenuOrder();
  
  // If we've applied a saved order, re-capture the current menu
  captureOriginalMenu();

  // Flag to track if the sortable options have been populated
  let sortableOptionsPopulated = false;

  // Toggle between main menu and settings
  settingsButton.addEventListener('click', function() {
    if (mainMenu.classList.contains('hidden')) {
      // Show main menu, hide settings
      mainMenu.classList.remove('hidden');
      settingsMenu.classList.add('hidden');
      
      // Show cog icon, hide X icon
      cogIcon.style.display = 'inline-block';
      closeIcon.style.display = 'none';
      
      // Only update if the sortable options have been populated and changed
      if (sortableOptionsPopulated && sortableOptions.children.length > 0) {
        updateMenuFromSortableOptions();
        
        // Re-capture the menu after applying changes
        captureOriginalMenu();
      }
    } else {
      // Show settings, hide main menu
      mainMenu.classList.add('hidden');
      settingsMenu.classList.remove('hidden');
      
      // Hide cog icon, show X icon
      cogIcon.style.display = 'none';
      closeIcon.style.display = 'inline-block';
      
      // Populate sortable options based on current menu
      populateSortableOptions();
      sortableOptionsPopulated = true;
    }
  });
  
  // Handle add link form submission
  addLinkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    if (name && url) {
      // Add the new link to the menu
      addLinkToMenu(name, url, true); // true indicates it's a custom link
      
      // Re-populate the sortable options
      populateSortableOptions();
      
      // Reset the form
      addLinkForm.reset();
      
      // Provide visual feedback
      const button = document.getElementById('add-link-button');
      const originalText = button.textContent;
      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    }
  });
  
  // Function to get appropriate SLDS icon for a menu item - removed icons for now
  function getIconForMenuItem(text) {
    // Return empty string - no icons
    return '';
  }

  // Function to add a new link to the menu
  function addLinkToMenu(name, url, isCustom = false, isHidden = false) {
    // Create new menu item
    const li = document.createElement('li');
    li.className = 'sf-nav-item';
    if (isHidden) li.classList.add('hidden');
    
    const a = document.createElement('a');
    a.className = 'sf-nav-link';
    a.href = url;
    a.target = '_blank';
    
    // Apply current text settings
    applyTextSettingsToLink(a);
    
    // Add icon and text
    const iconHtml = getIconForMenuItem(name);
    a.innerHTML = iconHtml + name;
    
    li.appendChild(a);
    
    // Add to the main menu
    mainMenu.appendChild(li);
    
    // Add to the original menu items array
    originalMenuItems.push({
      text: name,
      href: url,
      isCustom: isCustom,
      isHidden: isHidden
    });
    
    // If it's a custom link, add to the custom links array
    if (isCustom) {
      customLinks.push({
        text: name,
        href: url
      });
      saveCustomLinks();
    }
    
    // Save the updated menu to local storage
    saveUpdatedMenu();
    
    console.log('Added new link:', name, url, 'Custom:', isCustom);
  }
  
  // Function to delete a custom link
  function deleteCustomLink(text, href) {
    // Remove from customLinks array
    customLinks = customLinks.filter(link => 
      !(link.text === text && link.href === href));
    saveCustomLinks();
    
    // Remove from originalMenuItems
    const index = originalMenuItems.findIndex(item => 
      item.text === text && item.href === href);
    if (index !== -1) {
      originalMenuItems.splice(index, 1);
    }
    
    // Remove from the DOM
    const menuItems = Array.from(mainMenu.querySelectorAll('.sf-nav-item'));
    const itemToRemove = menuItems.find(item => {
      const link = item.querySelector('a');
      return link && link.textContent.trim() === text && link.getAttribute('href') === href;
    });
    
    if (itemToRemove) {
      mainMenu.removeChild(itemToRemove);
    }
    
    // Save the updated menu
    saveUpdatedMenu();
    
    // Re-populate sortable options
    populateSortableOptions();
  }
  
  // Function to save the updated menu to local storage
  function saveUpdatedMenu() {
    const currentMenuItems = Array.from(mainMenu.querySelectorAll('.sf-nav-item')).map(item => {
      const link = item.querySelector('a');
      const isHidden = item.classList.contains('hidden');
      
      // Check if this is a custom link
      const isCustom = customLinks.some(customLink => 
        customLink.text === link.textContent.trim() && 
        customLink.href === link.getAttribute('href'));
      
      return {
        text: link.textContent.trim(),
        href: link.getAttribute('href'),
        isCustom: isCustom,
        isHidden: isHidden
      };
    });
    
    // Save to local storage
    saveMenuOrder(currentMenuItems);
  }
  
  // Function to load saved menu order from local storage
  function getSavedMenuOrder() {
    const savedOrder = localStorage.getItem('sfmcMenuOrder');
    return savedOrder ? JSON.parse(savedOrder) : null;
  }

  // Function to save menu order to local storage
  function saveMenuOrder(menuItems) {
    localStorage.setItem('sfmcMenuOrder', JSON.stringify(menuItems));
  }

  // Function to apply the saved menu order to the main menu
  function applySavedMenuOrder() {
    const savedMenuItems = getSavedMenuOrder();
    if (!savedMenuItems || !Array.isArray(savedMenuItems) || savedMenuItems.length === 0) {
      console.log('No valid saved menu order found, using original menu');
      return; // No saved order, use default
    }
    
    console.log('Applying saved menu order:', savedMenuItems);
    
    // Validate saved menu items
    const validItems = savedMenuItems.filter(item => 
      item && typeof item === 'object' && item.text && item.href);
    
    if (validItems.length === 0) {
      console.error('No valid items in saved menu, reverting to original');
      applySavedMenuOrderFromOriginal();
      return;
    }
    
    // Clear the main menu
    mainMenu.innerHTML = '';
    
    // Add menu items in the saved order
    validItems.forEach(item => {
      // If the href is undefined, missing or '#', try to find the original
      let href = item.href;
      if (!href || href === '#' || href === 'undefined') {
        href = findOriginalHref(item.text);
        console.log('Fixed missing href for', item.text, 'to', href);
      }
      
      const li = document.createElement('li');
      li.className = 'sf-nav-item';
      if (item.isHidden) li.classList.add('hidden');
      
      const a = document.createElement('a');
      a.className = 'sf-nav-link';
      a.href = href;
      a.target = '_blank';
      
      // Apply current text settings
      applyTextSettingsToLink(a);
      
      // Add icon and text
      const iconHtml = getIconForMenuItem(item.text);
      a.innerHTML = iconHtml + item.text;
      
      li.appendChild(a);
      mainMenu.appendChild(li);
      
      // If this is a custom link, add it to the customLinks array if not already there
      if (item.isCustom) {
        const exists = customLinks.some(link => 
          link.text === item.text && link.href === href);
        
        if (!exists) {
          customLinks.push({
            text: item.text,
            href: href
          });
        }
      }
    });
    
    // Save custom links
    saveCustomLinks();
  }

  // Function to populate sortable options from main menu items
  function populateSortableOptions() {
    // Clear existing items
    sortableOptions.innerHTML = '';
    
    // Get all current menu items
    const currentMenuItems = Array.from(mainMenu.querySelectorAll('.sf-nav-item'));
    console.log('Current menu items for sortable options:', currentMenuItems);
    
    // Add each menu item to the sortable list
    currentMenuItems.forEach((menuItem, index) => {
      const link = menuItem.querySelector('a');
      const linkText = link.textContent.trim();
      const href = link.getAttribute('href');
      const isHidden = menuItem.classList.contains('hidden');
      
      // Check if this is a custom link
      const isCustom = customLinks.some(customLink => 
        customLink.text === linkText && customLink.href === href);
      
      console.log('Adding sortable item:', linkText, 'Href:', href, 'Custom:', isCustom);
      
      const listItem = document.createElement('li');
      if (isCustom) listItem.classList.add('custom-link');
      if (isHidden) listItem.classList.add('hidden-menu-item');
      
      // Add checkbox for visibility
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'menu-item-checkbox';
      checkbox.checked = !isHidden;
      checkbox.title = isHidden ? 'Show this link' : 'Hide this link';
      checkbox.addEventListener('change', function() {
        const hidden = !this.checked;
        
        // Toggle hidden class in sortable list
        if (hidden) {
          listItem.classList.add('hidden-menu-item');
        } else {
          listItem.classList.remove('hidden-menu-item');
        }
        
        // Store the visibility state
        listItem.dataset.hidden = hidden;
        
        // Update the menu immediately
        updateMenuFromSortableOptions();
      });
      listItem.appendChild(checkbox);
      
      // Use a span to hold the text
      const textSpan = document.createElement('span');
      textSpan.textContent = linkText;
      listItem.appendChild(textSpan);
      
      // Add delete icon for custom links
      if (isCustom) {
        const deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = '✕';
        deleteIcon.className = 'delete-icon';
        deleteIcon.title = 'Delete this link';
        deleteIcon.addEventListener('click', function(e) {
          e.stopPropagation();
          
          if (confirm(`Delete "${linkText}"?`)) {
            deleteCustomLink(linkText, href);
          }
        });
        listItem.appendChild(deleteIcon);
      }
      
      // Store href as an explicit attribute
      listItem.setAttribute('data-href', href);
      listItem.setAttribute('data-custom', isCustom);
      listItem.setAttribute('data-hidden', isHidden);
      
      listItem.draggable = true;
      sortableOptions.appendChild(listItem);
    });
    
    // Add event listeners for drag and drop functionality
    setupDragAndDrop();
  }

  // Function to update the main menu based on the sortable options
  function updateMenuFromSortableOptions() {
    const sortableItems = Array.from(sortableOptions.querySelectorAll('li'));
    
    // Verify we have sortable items to work with
    if (sortableItems.length === 0) return;
    
    console.log('Sortable items:', sortableItems);
    
    const menuItems = sortableItems.map(item => {
      // Get the text from the span element
      const textElement = item.querySelector('span');
      const text = textElement ? textElement.textContent.trim() : '';
      
      // Get href and other attributes from the data attributes
      const href = item.getAttribute('data-href');
      const isCustom = item.getAttribute('data-custom') === 'true';
      const isHidden = item.getAttribute('data-hidden') === 'true';
      
      console.log('Item:', text, 'Href:', href, 'Custom:', isCustom, 'Hidden:', isHidden);
      
      return {
        text: text,
        href: href,
        isCustom: isCustom,
        isHidden: isHidden
      };
    });
    
    console.log('Menu items to save:', menuItems);
    
    // Only save if we have valid items
    if (menuItems.some(item => item.text === '' || !item.href)) {
      console.error('Invalid menu items detected, using original menu items instead');
      // Use original menu items as a fallback
      saveMenuOrder(originalMenuItems);
      applySavedMenuOrderFromOriginal();
      return;
    }
    
    // Save the new order to local storage
    saveMenuOrder(menuItems);
    
    // Apply the new order immediately
    applySavedMenuOrder();
  }
  
  // Function to apply the saved menu order using original items as fallback
  function applySavedMenuOrderFromOriginal() {
    // Clear the main menu
    mainMenu.innerHTML = '';
    
    // Add menu items directly from original items
    originalMenuItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'sf-nav-item';
      if (item.isHidden) li.classList.add('hidden');
      
      const a = document.createElement('a');
      a.className = 'sf-nav-link';
      a.href = item.href;
      a.target = '_blank';
      
      // Apply current text settings
      applyTextSettingsToLink(a);
      
      // Add icon and text
      const iconHtml = getIconForMenuItem(item.text);
      a.innerHTML = iconHtml + item.text;
      
      li.appendChild(a);
      mainMenu.appendChild(li);
    });
  }

  // Helper function to find the original href for a menu item text
  function findOriginalHref(text) {
    if (!text) {
      console.error('Empty text provided to findOriginalHref');
      return '#';
    }
    
    console.log('Finding original href for:', text);
    
    // If originalMenuItems is empty, return a fallback URL
    if (!originalMenuItems.length) {
      console.error('Original menu items array is empty');
      return 'https://mc.exacttarget.com/cloud/';
    }
    
    // Try exact match first
    let originalItem = originalMenuItems.find(item => item.text === text);
    
    // If no exact match, try case-insensitive match
    if (!originalItem) {
      originalItem = originalMenuItems.find(item => 
        item.text.toLowerCase() === text.toLowerCase());
    }
    
    // If still no match, try to find a partial match
    if (!originalItem) {
      originalItem = originalMenuItems.find(item => 
        item.text.toLowerCase().includes(text.toLowerCase()) || 
        text.toLowerCase().includes(item.text.toLowerCase()));
    }
    
    // If all else fails, just return the first menu item's href as a fallback
    if (!originalItem && originalMenuItems.length > 0) {
      console.warn('No match found for', text, 'using first menu item as fallback');
      return originalMenuItems[0].href;
    }
    
    console.log('Found item:', originalItem);
    return originalItem ? originalItem.href : 'https://mc.exacttarget.com/cloud/';
  }

  // Set up drag and drop functionality for sortable list
  function setupDragAndDrop() {
    const items = sortableOptions.querySelectorAll('li');
    let draggedItem = null;
    
    items.forEach(item => {
      // When drag starts
      item.addEventListener('dragstart', function(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
      });
      
      // When drag ends
      item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedItem = null;
      });
      
      // When dragging over an item
      item.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
      
      // When entering a drag target
      item.addEventListener('dragenter', function(e) {
        e.preventDefault();
        if (this !== draggedItem) {
          this.classList.add('drag-over');
        }
      });
      
      // When leaving a drag target
      item.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
      });
      
      // When dropping
      item.addEventListener('drop', function(e) {
        e.preventDefault();
        if (this !== draggedItem) {
          // Get the positions in the list
          const allItems = Array.from(sortableOptions.querySelectorAll('li'));
          const draggedPos = allItems.indexOf(draggedItem);
          const droppedPos = allItems.indexOf(this);
          
          // Reorder the items
          if (draggedPos < droppedPos) {
            sortableOptions.insertBefore(draggedItem, this.nextSibling);
          } else {
            sortableOptions.insertBefore(draggedItem, this);
          }
          
          this.classList.remove('drag-over');
          
          // Update the menu order in real-time
          updateMenuFromSortableOptions();
        }
      });
    });
  }
});
