document.addEventListener('DOMContentLoaded', function() {
  // Test localStorage availability
  console.log('=== SFMC Menu Extension Loading ===');
  try {
    const testKey = 'sfmc-test-' + Date.now();
    localStorage.setItem(testKey, 'test');
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (testValue === 'test') {
      console.log('✓ localStorage is working');
    } else {
      console.error('✗ localStorage test failed');
    }
    
    // Log current saved language
    const savedLang = localStorage.getItem('sfmcLanguage');
    console.log('Current saved language in localStorage:', savedLang || '(not set - will default to en)');
  } catch (error) {
    console.error('✗ localStorage error:', error);
  }
  
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
  const fontWeight = document.getElementById('font-weight');
  const fontWeightValue = document.getElementById('font-weight-value');
  const languageSelect = document.getElementById('language-select');
  
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

  // Font weight functionality
  function loadFontWeight() {
    const savedWeight = localStorage.getItem('sfmcFontWeight') || '400';
    fontWeight.value = savedWeight;
    fontWeightValue.textContent = savedWeight;
    applyFontWeight(savedWeight);
  }

  function applyFontWeight(weight) {
    document.documentElement.style.setProperty('--menu-font-weight', weight);
    // Update CSS for menu links
    const menuLinks = document.querySelectorAll('.sf-nav-link');
    menuLinks.forEach(link => {
      link.style.fontWeight = weight;
    });
  }

  function saveFontWeight(weight) {
    localStorage.setItem('sfmcFontWeight', weight);
  }

  // Handle font weight changes
  fontWeight.addEventListener('input', function(e) {
    const newWeight = e.target.value;
    fontWeightValue.textContent = newWeight;
    applyFontWeight(newWeight);
  });

  fontWeight.addEventListener('change', function(e) {
    const newWeight = e.target.value;
    saveFontWeight(newWeight);
  });

  // Initialize text settings
  loadTextAlignment();
  loadTextSize();
  loadFontWeight();

  // ============================================
  // Language Translations
  // ============================================
  
  const translations = {
    en: {
      // Menu items
      'Home': 'Home',
      'Content': 'Content',
      'Subscribers': 'Subscribers',
      'Cloud Pages': 'Cloud Pages',
      'Reporting': 'Reporting',
      'Automation Studio': 'Automation Studio',
      'Journey Builder': 'Journey Builder',
      'Content Builder': 'Content Builder',
      'Contact Builder': 'Contact Builder',
      'Admin': 'Admin',
      // UI Labels
      'editMenuItems': 'Edit Menu Items',
      'customLink': 'Custom Link',
      'appearance': 'Appearance',
      'language': 'Language',
      'linkName': 'Link Name',
      'linkUrl': 'Link URL',
      'accentColor': 'Accent Color',
      'textAlignment': 'Text Alignment',
      'textSize': 'Text Size (px)',
      'fontWeight': 'Font Weight',
      'menuLanguage': 'Menu Language',
      'addCustomLink': 'Add Custom Link',
      'enterLinkName': 'Enter link name'
    },
    es: {
      // Menu items
      'Home': 'Inicio',
      'Content': 'Contenido',
      'Subscribers': 'Suscriptores',
      'Cloud Pages': 'Páginas en la nube',
      'Reporting': 'Informes',
      'Automation Studio': 'Estudio de automatización',
      'Journey Builder': 'Constructor de recorridos',
      'Content Builder': 'Generador de contenido',
      'Contact Builder': 'Generador de contactos',
      'Admin': 'Administración',
      // UI Labels
      'editMenuItems': 'Editar elementos del menú',
      'customLink': 'Enlace personalizado',
      'appearance': 'Apariencia',
      'language': 'Idioma',
      'linkName': 'Nombre del enlace',
      'linkUrl': 'URL del enlace',
      'accentColor': 'Color de acento',
      'textAlignment': 'Alineación del texto',
      'textSize': 'Tamaño del texto (px)',
      'fontWeight': 'Grosor de fuente',
      'menuLanguage': 'Idioma del menú',
      'addCustomLink': 'Agregar enlace personalizado',
      'enterLinkName': 'Ingrese el nombre del enlace'
    },
    pt: {
      // Menu items
      'Home': 'Início',
      'Content': 'Conteúdo',
      'Subscribers': 'Assinantes',
      'Cloud Pages': 'Páginas na nuvem',
      'Reporting': 'Relatórios',
      'Automation Studio': 'Estúdio de automação',
      'Journey Builder': 'Construtor de jornadas',
      'Content Builder': 'Criador de conteúdo',
      'Contact Builder': 'Criador de contatos',
      'Admin': 'Administração',
      // UI Labels
      'editMenuItems': 'Editar itens do menu',
      'customLink': 'Link personalizado',
      'appearance': 'Aparência',
      'language': 'Idioma',
      'linkName': 'Nome do link',
      'linkUrl': 'URL do link',
      'accentColor': 'Cor de destaque',
      'textAlignment': 'Alinhamento do texto',
      'textSize': 'Tamanho do texto (px)',
      'fontWeight': 'Peso da fonte',
      'menuLanguage': 'Idioma do menu',
      'addCustomLink': 'Adicionar link personalizado',
      'enterLinkName': 'Digite o nome do link'
    },
    fr: {
      // Menu items
      'Home': 'Accueil',
      'Content': 'Contenu',
      'Subscribers': 'Abonnés',
      'Cloud Pages': 'Pages cloud',
      'Reporting': 'Rapports',
      'Automation Studio': 'Studio d\'automatisation',
      'Journey Builder': 'Générateur de parcours',
      'Content Builder': 'Générateur de contenu',
      'Contact Builder': 'Générateur de contacts',
      'Admin': 'Administration',
      // UI Labels
      'editMenuItems': 'Modifier les éléments du menu',
      'customLink': 'Lien personnalisé',
      'appearance': 'Apparence',
      'language': 'Langue',
      'linkName': 'Nom du lien',
      'linkUrl': 'URL du lien',
      'accentColor': 'Couleur d\'accentuation',
      'textAlignment': 'Alignement du texte',
      'textSize': 'Taille du texte (px)',
      'fontWeight': 'Épaisseur de la police',
      'menuLanguage': 'Langue du menu',
      'addCustomLink': 'Ajouter un lien personnalisé',
      'enterLinkName': 'Entrez le nom du lien'
    },
    de: {
      // Menu items
      'Home': 'Startseite',
      'Content': 'Inhalt',
      'Subscribers': 'Abonnenten',
      'Cloud Pages': 'Cloud-Seiten',
      'Reporting': 'Berichte',
      'Automation Studio': 'Automatisierungsstudio',
      'Journey Builder': 'Journey-Builder',
      'Content Builder': 'Content-Builder',
      'Contact Builder': 'Contact-Builder',
      'Admin': 'Verwaltung',
      // UI Labels
      'editMenuItems': 'Menüelemente bearbeiten',
      'customLink': 'Benutzerdefinierter Link',
      'appearance': 'Erscheinungsbild',
      'language': 'Sprache',
      'linkName': 'Link-Name',
      'linkUrl': 'Link-URL',
      'accentColor': 'Akzentfarbe',
      'textAlignment': 'Textausrichtung',
      'textSize': 'Textgröße (px)',
      'fontWeight': 'Schriftstärke',
      'menuLanguage': 'Menüsprache',
      'addCustomLink': 'Benutzerdefinierten Link hinzufügen',
      'enterLinkName': 'Geben Sie den Link-Namen ein'
    },
    it: {
      // Menu items
      'Home': 'Home',
      'Content': 'Contenuto',
      'Subscribers': 'Iscritti',
      'Cloud Pages': 'Pagine cloud',
      'Reporting': 'Report',
      'Automation Studio': 'Studio di automazione',
      'Journey Builder': 'Generatore di percorsi',
      'Content Builder': 'Generatore di contenuti',
      'Contact Builder': 'Generatore di contatti',
      'Admin': 'Amministrazione',
      // UI Labels
      'editMenuItems': 'Modifica voci di menu',
      'customLink': 'Link personalizzato',
      'appearance': 'Aspetto',
      'language': 'Lingua',
      'linkName': 'Nome del link',
      'linkUrl': 'URL del link',
      'accentColor': 'Colore di accento',
      'textAlignment': 'Allineamento del testo',
      'textSize': 'Dimensione del testo (px)',
      'fontWeight': 'Spessore carattere',
      'menuLanguage': 'Lingua del menu',
      'addCustomLink': 'Aggiungi link personalizzato',
      'enterLinkName': 'Inserisci il nome del link'
    },
    nl: {
      // Menu items
      'Home': 'Home',
      'Content': 'Inhoud',
      'Subscribers': 'Abonnees',
      'Cloud Pages': 'Cloudpagina\'s',
      'Reporting': 'Rapporten',
      'Automation Studio': 'Automatiseringsstudio',
      'Journey Builder': 'Reisopbouwer',
      'Content Builder': 'Contentbouwer',
      'Contact Builder': 'Contactbouwer',
      'Admin': 'Beheer',
      // UI Labels
      'editMenuItems': 'Menu-items bewerken',
      'customLink': 'Aangepaste link',
      'appearance': 'Uiterlijk',
      'language': 'Taal',
      'linkName': 'Linknaam',
      'linkUrl': 'Link-URL',
      'accentColor': 'Accentkleur',
      'textAlignment': 'Tekstuitlijning',
      'textSize': 'Tekstgrootte (px)',
      'fontWeight': 'Letterdikte',
      'menuLanguage': 'Menutaal',
      'addCustomLink': 'Aangepaste link toevoegen',
      'enterLinkName': 'Voer de linknaam in'
    },
    pl: {
      // Menu items
      'Home': 'Strona główna',
      'Content': 'Zawartość',
      'Subscribers': 'Subskrybenci',
      'Cloud Pages': 'Strony w chmurze',
      'Reporting': 'Raporty',
      'Automation Studio': 'Studio automatyzacji',
      'Journey Builder': 'Kreator ścieżek',
      'Content Builder': 'Kreator treści',
      'Contact Builder': 'Kreator kontaktów',
      'Admin': 'Administracja',
      // UI Labels
      'editMenuItems': 'Edytuj elementy menu',
      'customLink': 'Niestandardowy link',
      'appearance': 'Wygląd',
      'language': 'Język',
      'linkName': 'Nazwa linku',
      'linkUrl': 'Adres URL linku',
      'accentColor': 'Kolor akcentu',
      'textAlignment': 'Wyrównanie tekstu',
      'textSize': 'Rozmiar tekstu (px)',
      'fontWeight': 'Grubość czcionki',
      'menuLanguage': 'Język menu',
      'addCustomLink': 'Dodaj niestandardowy link',
      'enterLinkName': 'Wprowadź nazwę linku'
    },
    sv: {
      // Menu items
      'Home': 'Hem',
      'Content': 'Innehåll',
      'Subscribers': 'Prenumeranter',
      'Cloud Pages': 'Molnsidor',
      'Reporting': 'Rapporter',
      'Automation Studio': 'Automationsstudio',
      'Journey Builder': 'Resebyggare',
      'Content Builder': 'Innehållsverktyg',
      'Contact Builder': 'Kontaktverktyg',
      'Admin': 'Administration',
      // UI Labels
      'editMenuItems': 'Redigera menyalternativ',
      'customLink': 'Anpassad länk',
      'appearance': 'Utseende',
      'language': 'Språk',
      'linkName': 'Länknamn',
      'linkUrl': 'Länk-URL',
      'accentColor': 'Accentfärg',
      'textAlignment': 'Textjustering',
      'textSize': 'Textstorlek (px)',
      'fontWeight': 'Typsnittsvikt',
      'menuLanguage': 'Menypråk',
      'addCustomLink': 'Lägg till anpassad länk',
      'enterLinkName': 'Ange länknamn'
    },
    da: {
      // Menu items
      'Home': 'Hjem',
      'Content': 'Indhold',
      'Subscribers': 'Abonnenter',
      'Cloud Pages': 'Cloud-sider',
      'Reporting': 'Rapporter',
      'Automation Studio': 'Automationsstudie',
      'Journey Builder': 'Rejsebygger',
      'Content Builder': 'Indholdsværktøj',
      'Contact Builder': 'Kontaktværktøj',
      'Admin': 'Administration',
      // UI Labels
      'editMenuItems': 'Rediger menupunkter',
      'customLink': 'Brugerdefineret link',
      'appearance': 'Udseende',
      'language': 'Sprog',
      'linkName': 'Linknavn',
      'linkUrl': 'Link-URL',
      'accentColor': 'Accentfarve',
      'textAlignment': 'Tekstjustering',
      'textSize': 'Tekststørrelse (px)',
      'fontWeight': 'Skrifttypevægt',
      'menuLanguage': 'Menusprog',
      'addCustomLink': 'Tilføj brugerdefineret link',
      'enterLinkName': 'Indtast linknavn'
    },
    no: {
      // Menu items
      'Home': 'Hjem',
      'Content': 'Innhold',
      'Subscribers': 'Abonnenter',
      'Cloud Pages': 'Skysider',
      'Reporting': 'Rapporter',
      'Automation Studio': 'Automatiseringsstudio',
      'Journey Builder': 'Reisebygger',
      'Content Builder': 'Innholdsverktøy',
      'Contact Builder': 'Kontaktverktøy',
      'Admin': 'Administrasjon',
      // UI Labels
      'editMenuItems': 'Rediger menyelementer',
      'customLink': 'Egendefinert lenke',
      'appearance': 'Utseende',
      'language': 'Språk',
      'linkName': 'Lenkenavn',
      'linkUrl': 'Lenke-URL',
      'accentColor': 'Aksentfarge',
      'textAlignment': 'Tekstjustering',
      'textSize': 'Tekststørrelse (px)',
      'fontWeight': 'Skriftvekt',
      'menuLanguage': 'Menyspråk',
      'addCustomLink': 'Legg til egendefinert lenke',
      'enterLinkName': 'Skriv inn lenkenavn'
    },
    fi: {
      // Menu items
      'Home': 'Koti',
      'Content': 'Sisältö',
      'Subscribers': 'Tilaajat',
      'Cloud Pages': 'Pilvesivut',
      'Reporting': 'Raportit',
      'Automation Studio': 'Automaatiostudio',
      'Journey Builder': 'Matkarakentaja',
      'Content Builder': 'Sisällönluoja',
      'Contact Builder': 'Yhteystietojen luoja',
      'Admin': 'Hallinta',
      // UI Labels
      'editMenuItems': 'Muokkaa valikon kohteita',
      'customLink': 'Mukautettu linkki',
      'appearance': 'Ulkoasu',
      'language': 'Kieli',
      'linkName': 'Linkin nimi',
      'linkUrl': 'Linkin URL',
      'accentColor': 'Korostusväri',
      'textAlignment': 'Tekstin tasaus',
      'textSize': 'Tekstin koko (px)',
      'fontWeight': 'Fontin paksuus',
      'menuLanguage': 'Valikon kieli',
      'addCustomLink': 'Lisää mukautettu linkki',
      'enterLinkName': 'Anna linkin nimi'
    },
    ru: {
      // Menu items
      'Home': 'Главная',
      'Content': 'Контент',
      'Subscribers': 'Подписчики',
      'Cloud Pages': 'Облачные страницы',
      'Reporting': 'Отчеты',
      'Automation Studio': 'Студия автоматизации',
      'Journey Builder': 'Конструктор путей',
      'Content Builder': 'Конструктор контента',
      'Contact Builder': 'Конструктор контактов',
      'Admin': 'Администрирование',
      // UI Labels
      'editMenuItems': 'Редактировать элементы меню',
      'customLink': 'Пользовательская ссылка',
      'appearance': 'Внешний вид',
      'language': 'Язык',
      'linkName': 'Название ссылки',
      'linkUrl': 'URL ссылки',
      'accentColor': 'Цвет акцента',
      'textAlignment': 'Выравнивание текста',
      'textSize': 'Размер текста (px)',
      'fontWeight': 'Толщина шрифта',
      'menuLanguage': 'Язык меню',
      'addCustomLink': 'Добавить пользовательскую ссылку',
      'enterLinkName': 'Введите название ссылки'
    },
    ja: {
      // Menu items
      'Home': 'ホーム',
      'Content': 'コンテンツ',
      'Subscribers': '購読者',
      'Cloud Pages': 'クラウドページ',
      'Reporting': 'レポート',
      'Automation Studio': 'オートメーションスタジオ',
      'Journey Builder': 'ジャーニービルダー',
      'Content Builder': 'コンテンツビルダー',
      'Contact Builder': 'コンタクトビルダー',
      'Admin': '管理',
      // UI Labels
      'editMenuItems': 'メニュー項目を編集',
      'customLink': 'カスタムリンク',
      'appearance': '外観',
      'language': '言語',
      'linkName': 'リンク名',
      'linkUrl': 'リンクURL',
      'accentColor': 'アクセントカラー',
      'textAlignment': 'テキストの配置',
      'textSize': 'テキストサイズ (px)',
      'fontWeight': 'フォントの太さ',
      'menuLanguage': 'メニュー言語',
      'addCustomLink': 'カスタムリンクを追加',
      'enterLinkName': 'リンク名を入力'
    },
    ko: {
      // Menu items
      'Home': '홈',
      'Content': '콘텐츠',
      'Subscribers': '구독자',
      'Cloud Pages': '클라우드 페이지',
      'Reporting': '보고',
      'Automation Studio': '자동화 스튜디오',
      'Journey Builder': '여정 빌더',
      'Content Builder': '콘텐츠 빌더',
      'Contact Builder': '연락처 빌더',
      'Admin': '관리',
      // UI Labels
      'editMenuItems': '메뉴 항목 편집',
      'customLink': '사용자 지정 링크',
      'appearance': '모양',
      'language': '언어',
      'linkName': '링크 이름',
      'linkUrl': '링크 URL',
      'accentColor': '강조 색상',
      'textAlignment': '텍스트 정렬',
      'textSize': '텍스트 크기 (px)',
      'fontWeight': '글꼴 굵기',
      'menuLanguage': '메뉴 언어',
      'addCustomLink': '사용자 지정 링크 추가',
      'enterLinkName': '링크 이름 입력'
    },
    'zh-cn': {
      // Menu items
      'Home': '主页',
      'Content': '内容',
      'Subscribers': '订阅者',
      'Cloud Pages': '云页面',
      'Reporting': '报告',
      'Automation Studio': '自动化工作室',
      'Journey Builder': '旅程构建器',
      'Content Builder': '内容生成器',
      'Contact Builder': '联系人生成器',
      'Admin': '管理',
      // UI Labels
      'editMenuItems': '编辑菜单项',
      'customLink': '自定义链接',
      'appearance': '外观',
      'language': '语言',
      'linkName': '链接名称',
      'linkUrl': '链接URL',
      'accentColor': '强调色',
      'textAlignment': '文本对齐',
      'textSize': '文本大小 (px)',
      'fontWeight': '字体粗细',
      'menuLanguage': '菜单语言',
      'addCustomLink': '添加自定义链接',
      'enterLinkName': '输入链接名称'
    },
    'zh-tw': {
      // Menu items
      'Home': '首頁',
      'Content': '內容',
      'Subscribers': '訂閱者',
      'Cloud Pages': '雲端頁面',
      'Reporting': '報告',
      'Automation Studio': '自動化工作室',
      'Journey Builder': '旅程建立器',
      'Content Builder': '內容產生器',
      'Contact Builder': '聯絡人產生器',
      'Admin': '管理',
      // UI Labels
      'editMenuItems': '編輯選單項目',
      'customLink': '自訂連結',
      'appearance': '外觀',
      'language': '語言',
      'linkName': '連結名稱',
      'linkUrl': '連結URL',
      'accentColor': '強調色',
      'textAlignment': '文字對齊',
      'textSize': '文字大小 (px)',
      'fontWeight': '字體粗細',
      'menuLanguage': '選單語言',
      'addCustomLink': '新增自訂連結',
      'enterLinkName': '輸入連結名稱'
    },
    ar: {
      // Menu items
      'Home': 'الصفحة الرئيسية',
      'Content': 'المحتوى',
      'Subscribers': 'المشتركون',
      'Cloud Pages': 'صفحات السحابة',
      'Reporting': 'التقارير',
      'Automation Studio': 'استوديو الأتمتة',
      'Journey Builder': 'منشئ الرحلات',
      'Content Builder': 'منشئ المحتوى',
      'Contact Builder': 'منشئ جهات الاتصال',
      'Admin': 'الإدارة',
      // UI Labels
      'editMenuItems': 'تحرير عناصر القائمة',
      'customLink': 'رابط مخصص',
      'appearance': 'المظهر',
      'language': 'اللغة',
      'linkName': 'اسم الرابط',
      'linkUrl': 'عنوان URL للرابط',
      'accentColor': 'لون التمييز',
      'textAlignment': 'محاذاة النص',
      'textSize': 'حجم النص (px)',
      'fontWeight': 'سمك الخط',
      'menuLanguage': 'لغة القائمة',
      'addCustomLink': 'إضافة رابط مخصص',
      'enterLinkName': 'أدخل اسم الرابط'
    },
    hi: {
      // Menu items
      'Home': 'होम',
      'Content': 'सामग्री',
      'Subscribers': 'सब्सक्राइबर्स',
      'Cloud Pages': 'क्लाउड पेज',
      'Reporting': 'रिपोर्टिंग',
      'Automation Studio': 'स्वचालन स्टूडियो',
      'Journey Builder': 'यात्रा निर्माता',
      'Content Builder': 'कंटेंट बिल्डर',
      'Contact Builder': 'कॉन्टैक्ट बिल्डर',
      'Admin': 'व्यवस्थापक',
      // UI Labels
      'editMenuItems': 'मेनू आइटम संपादित करें',
      'customLink': 'कस्टम लिंक',
      'appearance': 'रूप',
      'language': 'भाषा',
      'linkName': 'लिंक नाम',
      'linkUrl': 'लिंक URL',
      'accentColor': 'एक्सेंट रंग',
      'textAlignment': 'टेक्स्ट संरेखण',
      'textSize': 'टेक्स्ट आकार (px)',
      'fontWeight': 'फ़ॉन्ट वज़न',
      'menuLanguage': 'मेनू भाषा',
      'addCustomLink': 'कस्टम लिंक जोड़ें',
      'enterLinkName': 'लिंक नाम दर्ज करें'
    },
    th: {
      // Menu items
      'Home': 'หน้าแรก',
      'Content': 'เนื้อหา',
      'Subscribers': 'ผู้สมัครสมาชิก',
      'Cloud Pages': 'หน้าคลาวด์',
      'Reporting': 'รายงาน',
      'Automation Studio': 'สตูดิโออัตโนมัติ',
      'Journey Builder': 'ตัวสร้างเส้นทาง',
      'Content Builder': 'ตัวสร้างเนื้อหา',
      'Contact Builder': 'ตัวสร้างผู้ติดต่อ',
      'Admin': 'ผู้ดูแลระบบ',
      // UI Labels
      'editMenuItems': 'แก้ไขรายการเมนู',
      'customLink': 'ลิงก์กำหนดเอง',
      'appearance': 'รูปลักษณ์',
      'language': 'ภาษา',
      'linkName': 'ชื่อลิงก์',
      'linkUrl': 'URL ลิงก์',
      'accentColor': 'สีเน้น',
      'textAlignment': 'การจัดแนวข้อความ',
      'textSize': 'ขนาดข้อความ (px)',
      'fontWeight': 'ความหนาของฟอนต์',
      'menuLanguage': 'ภาษาเมนู',
      'addCustomLink': 'เพิ่มลิงก์กำหนดเอง',
      'enterLinkName': 'ป้อนชื่อลิงก์'
    }
  };

  // Store original English text of menu items for translation reference
  const menuItemMapping = new Map();

  // Function to initialize menu item mapping
  function initializeMenuMapping() {
    console.log('Initializing menu item mapping...');
    const menuItems = Array.from(mainMenu.querySelectorAll('.sf-nav-item'));
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        
        // Check if this is a custom link
        const isCustom = customLinks.some(cl => 
          cl.text === text && cl.href === href);
        
        if (!isCustom) {
          // Store the original English text with the href as key
          // At this point, menu is in English (default from HTML)
          menuItemMapping.set(href, text);
          console.log('Mapped', href, 'to English key:', text);
        }
      }
    });
    console.log('Menu mapping initialized with', menuItemMapping.size, 'items');
  }

  // Function to translate menu items
  function translateMenuItems(language) {
    const menuItems = Array.from(mainMenu.querySelectorAll('.sf-nav-item'));
    const targetTranslations = translations[language] || translations['en'];
    
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        const currentText = link.textContent.trim();
        
        // Check if this is a custom link
        const isCustom = customLinks.some(cl => cl.href === href);
        
        if (!isCustom) {
          // Get the original English text for this menu item
          const originalEnglishText = menuItemMapping.get(href);
          
          if (originalEnglishText && targetTranslations[originalEnglishText]) {
            // Translate from English to target language
            link.textContent = targetTranslations[originalEnglishText];
          } else {
            // Fallback: try to reverse translate current text to English first
            let englishKey = null;
            
            // Search through all languages to find which one has current text
            for (const [langCode, langTranslations] of Object.entries(translations)) {
              for (const [enText, translatedText] of Object.entries(langTranslations)) {
                if (translatedText === currentText) {
                  englishKey = enText;
                  break;
                }
              }
              if (englishKey) break;
            }
            
            // If we found the English key, translate it to target language
            if (englishKey && targetTranslations[englishKey]) {
              link.textContent = targetTranslations[englishKey];
              // Update mapping
              menuItemMapping.set(href, englishKey);
            }
          }
        }
      }
    });
    
    // Also update the sortable options if they exist
    updateSortableTranslations(language);
    
    // Update UI text
    updateUIText(language);
  }
  
  // Function to update all UI text elements
  function updateUIText(language) {
    const targetTranslations = translations[language] || translations['en'];
    console.log('Updating UI text to language:', language);
    
    // Update all elements with data-i18n attribute
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    console.log('Found', elementsWithI18n.length, 'elements with data-i18n');
    
    elementsWithI18n.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (targetTranslations[key]) {
        element.textContent = targetTranslations[key];
        console.log('Translated', key, 'to', targetTranslations[key]);
      } else {
        console.warn('No translation found for key:', key, 'in language:', language);
      }
    });
    
    // Update placeholders
    const elementsWithPlaceholder = document.querySelectorAll('[data-i18n-placeholder]');
    console.log('Found', elementsWithPlaceholder.length, 'elements with data-i18n-placeholder');
    
    elementsWithPlaceholder.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (targetTranslations[key]) {
        element.placeholder = targetTranslations[key];
        console.log('Translated placeholder', key, 'to', targetTranslations[key]);
      } else {
        console.warn('No translation found for placeholder key:', key, 'in language:', language);
      }
    });
  }

  // Function to update sortable options with translations
  function updateSortableTranslations(language) {
    const sortableItems = Array.from(sortableOptions.querySelectorAll('li'));
    const targetTranslations = translations[language] || translations['en'];
    console.log('Updating sortable translations to language:', language, 'for', sortableItems.length, 'items');
    
    sortableItems.forEach(item => {
      const textElement = item.querySelector('span');
      const href = item.getAttribute('data-href');
      const isCustom = item.getAttribute('data-custom') === 'true';
      
      if (textElement && !isCustom && href) {
        const originalEnglishText = menuItemMapping.get(href);
        
        if (originalEnglishText && targetTranslations[originalEnglishText]) {
          textElement.textContent = targetTranslations[originalEnglishText];
          console.log('Translated sortable item:', originalEnglishText, 'to', targetTranslations[originalEnglishText]);
        } else {
          console.warn('Could not translate sortable item with href:', href, 'originalText:', originalEnglishText);
        }
      }
    });
  }

  // Language selection functionality
  function loadLanguage() {
    const savedLanguage = localStorage.getItem('sfmcLanguage') || 'en';
    console.log('=== Loading saved language:', savedLanguage, '===');
    console.log('Available in localStorage:', localStorage.getItem('sfmcLanguage'));
    
    if (languageSelect) {
      languageSelect.value = savedLanguage;
      console.log('Language select dropdown set to:', languageSelect.value);
    } else {
      console.error('Language select element not found!');
      return;
    }
    
    // Menu mapping should already be initialized, but check
    if (menuItemMapping.size === 0) {
      console.warn('Menu mapping not initialized, initializing now...');
      initializeMenuMapping();
    }
    
    console.log('Applying language:', savedLanguage, 'to menu and UI');
    
    // Apply the saved language
    translateMenuItems(savedLanguage);
    updateUIText(savedLanguage);
    
    console.log('=== Language initialization complete ===');
  }

  function applyLanguage(language) {
    translateMenuItems(language);
    updateUIText(language);
  }

  function saveLanguage(language) {
    console.log('Saving language to localStorage:', language);
    try {
      localStorage.setItem('sfmcLanguage', language);
      
      // Verify save
      const saved = localStorage.getItem('sfmcLanguage');
      console.log('Language saved and verified:', saved);
      
      if (saved !== language) {
        console.error('Language save failed! Expected:', language, 'Got:', saved);
      } else {
        console.log('✓ Language successfully saved to localStorage');
      }
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }

  // Handle language selection changes
  languageSelect.addEventListener('change', function(e) {
    const selectedLanguage = e.target.value;
    console.log('Language changed to:', selectedLanguage);
    applyLanguage(selectedLanguage);
    saveLanguage(selectedLanguage);
    
    // Verify it was saved
    setTimeout(() => {
      const verifyLanguage = localStorage.getItem('sfmcLanguage');
      console.log('Verified saved language:', verifyLanguage);
    }, 100);
  });

  // Initialize language
  console.log('Initializing language system...');
  
  // IMPORTANT: Initialize menu mapping FIRST before loading saved language
  // This ensures we capture the original English keys before any translation
  initializeMenuMapping();
  
  // Now load and apply the saved language
  loadLanguage();

  // Apply text settings to all existing menu items
  function applySettingsToExistingMenuItems() {
    const currentAlignment = localStorage.getItem('sfmcTextAlignment') || 'left';
    const currentSize = localStorage.getItem('sfmcTextSize') || '16';
    const currentWeight = localStorage.getItem('sfmcFontWeight') || '400';
    
    const menuLinks = document.querySelectorAll('.sf-nav-link');
    menuLinks.forEach(link => {
      link.style.textAlign = currentAlignment;
      link.style.fontSize = currentSize + 'px';
      link.style.fontWeight = currentWeight;
      
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
    const currentWeight = localStorage.getItem('sfmcFontWeight') || '400';
    
    linkElement.style.textAlign = currentAlignment;
    linkElement.style.fontSize = currentSize + 'px';
    linkElement.style.fontWeight = currentWeight;
    
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
      
      // Apply current language to sortable list and UI
      const currentLanguage = localStorage.getItem('sfmcLanguage') || 'en';
      console.log('Settings opened - applying language:', currentLanguage);
      
      // Update language select dropdown to match saved language
      if (languageSelect && languageSelect.value !== currentLanguage) {
        console.log('Updating language select from', languageSelect.value, 'to', currentLanguage);
        languageSelect.value = currentLanguage;
      }
      
      updateSortableTranslations(currentLanguage);
      updateUIText(currentLanguage);
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
