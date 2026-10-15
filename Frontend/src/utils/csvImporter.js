/**
 * 2L Atelier — High-Reliability CSV Parsing, Validation & Template Engine
 * Designed for Luxury Streetwear Bulk Product Ingestion
 */

// Preset valid image assets from 2L Atelier
export const PRESET_IMAGES = [
  { label: 'Heavyweight Boxy Tee', url: '/images/heavyweight_boxy_tee.jpg' },
  { label: 'Raw Selvedge Baggy Denim', url: '/images/raw_baggy_denim.jpg' },
  { label: 'Architectural Chunky Runner', url: '/images/chunky_runner_sneaker.jpg' },
  { label: 'Tactical Cargo Pant', url: '/images/tactical_cargo.jpg' },
  { label: 'Thermal Popover Hoodie', url: '/images/thermal_hoodie.jpg' },
  { label: 'Crisp Poplin Shirt', url: '/images/white_poplin_shirt.jpg' },
  { label: 'Minimalist Lambskin Low', url: '/images/minimal_sneaker.jpg' },
  { label: 'Drop 07 Editorial Campaign', url: '/images/hero_streetwear.jpg' },
];

export const VALID_CATEGORIES = ['t-shirts', 'jeans', 'shirts', 'sneakers', 'outerwear'];

export const VALID_GENDERS = ['unisex', 'men', 'women'];

export const VALID_SUBCATEGORIES = {
  't-shirts': ['Oversized', 'Boxy', 'Standard', 'Drop-Shoulder', 'Graphic'],
  'jeans': ['Baggy', 'Cargo', 'Straight', 'Wide-Leg', 'Flared', 'Raw'],
  'shirts': ['Poplin', 'Oxford', 'Resort', 'Bowling', 'Overshirt'],
  'sneakers': ['Chunky', 'Minimalist', 'High-Top', 'Runner', 'Skate'],
  'outerwear': ['Hoodie', 'Bomber', 'Puffer', 'Tactical Vest', 'Trench'],
};

/**
 * Normalizes input category to valid 2L catalog enum
 */
export const normalizeCategory = (input) => {
  if (!input) return 't-shirts';
  const c = String(input).trim().toLowerCase();
  if (c.includes('jean') || c.includes('denim')) return 'jeans';
  if (c.includes('t-shirt') || c.includes('tee') || c === 'tshirt' || c === 'tshirts') return 't-shirts';
  if (c.includes('shirt') || c.includes('poplin') || c.includes('oxford')) return 'shirts';
  if (c.includes('sneaker') || c.includes('shoe') || c.includes('runner') || c.includes('footwear')) return 'sneakers';
  if (c.includes('outerwear') || c.includes('hoodie') || c.includes('jacket') || c.includes('puffer')) return 'outerwear';
  return 't-shirts';
};

/**
 * Normalizes silhouette / subcategory
 */
export const normalizeSubCategory = (input, category) => {
  if (input && String(input).trim()) {
    const trimmed = String(input).trim();
    // Capitalize first letter
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
  const cat = normalizeCategory(category);
  if (cat === 'jeans') return 'Baggy';
  if (cat === 'sneakers') return 'Chunky';
  if (cat === 'shirts') return 'Poplin';
  if (cat === 'outerwear') return 'Hoodie';
  return 'Oversized';
};

/**
 * Robust RFC 4180 CSV Text Parser
 * Correctly parses multi-line values, quoted strings with commas, and escaped quotes.
 */
export const parseCSVText = (csvString) => {
  if (!csvString || typeof csvString !== 'string') return [];

  // Remove potential UTF-8 BOM
  let str = csvString.charCodeAt(0) === 0xFEFF ? csvString.slice(1) : csvString;
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote ("")
        currentField += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\n' && !insideQuotes) {
      // End of row
      currentRow.push(currentField);
      // Only push non-empty rows
      if (currentRow.some((f) => f.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Final field/row if text doesn't end with newline
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // Map header row
  const rawHeaders = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Normalize header mapping
  const fieldMapping = {
    title: ['title', 'name', 'piecetitle', 'productname', 'itemname'],
    category: ['category', 'cat', 'department', 'type'],
    subcategory: ['subcategory', 'subcat', 'silhouette', 'style', 'sub_category'],
    sellingPrice: ['sellingprice', 'price', 'selling_price', 'sale_price', 'inr', 'priceinr'],
    mrp: ['mrp', 'originalprice', 'original_price', 'regularprice', 'retailprice'],
    stock: ['stock', 'stockcount', 'stockunits', 'quantity', 'qty', 'units'],
    fabric: ['fabric', 'material', 'composition', 'textile'],
    gender: ['gender', 'audience', 'target', 'genderaudience'],
    description: ['description', 'desc', 'story', 'details', 'about'],
    image: ['image', 'images', 'imageurl', 'photo', 'picture', 'asset'],
    sku: ['sku', 'code', 'productid', 'itemcode', 'item_sku', 'sku_code'],
  };

  const headerIndices = {};
  rawHeaders.forEach((header, index) => {
    for (const [standardKey, aliases] of Object.entries(fieldMapping)) {
      if (aliases.includes(header) && headerIndices[standardKey] === undefined) {
        headerIndices[standardKey] = index;
        break;
      }
    }
  });

  // Extract row objects
  const parsedItems = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const item = { rowNumber: r + 1 };

    for (const [key, colIdx] of Object.entries(headerIndices)) {
      item[key] = row[colIdx] !== undefined ? row[colIdx].trim() : '';
    }

    parsedItems.push(item);
  }

  return parsedItems;
};

/**
 * Validates a single parsed row against 2L inventory specifications
 */
export const validateProductRow = (row, index, existingProducts = [], batchSkus = new Set(), batchTitles = new Set()) => {
  const errors = [];
  const warnings = [];

  const rowNum = row.rowNumber || index + 2;

  // Title validation
  const rawTitle = (row.title || '').trim();
  if (!rawTitle) {
    errors.push('Missing required Piece Title');
  } else if (rawTitle.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  // Category validation
  const rawCat = (row.category || '').trim();
  if (!rawCat) {
    errors.push('Missing required Category');
  }
  const category = normalizeCategory(rawCat);
  const subCategory = normalizeSubCategory(row.subcategory, category);

  // Price validation
  const cleanPriceStr = String(row.sellingPrice || '').trim();
  const sellingPrice = parseFloat(cleanPriceStr);
  if (isNaN(sellingPrice) || sellingPrice <= 0) {
    errors.push('Selling Price must be a valid positive number');
  } else if (sellingPrice < 99) {
    warnings.push('Selling Price is unusually low (₹' + sellingPrice + ')');
  }

  // MRP validation
  const cleanMrpStr = String(row.mrp || '').trim();
  let mrp = parseFloat(cleanMrpStr);
  if (cleanMrpStr === '') {
    mrp = !isNaN(sellingPrice) ? Math.round(sellingPrice * 1.5) : 1499;
    warnings.push('MRP was omitted; automatically calculated as ₹' + mrp);
  } else if (isNaN(mrp) || mrp <= 0) {
    errors.push(`MRP must be a valid positive number ("${row.mrp}")`);
  } else if (!isNaN(sellingPrice) && mrp < sellingPrice) {
    errors.push(`MRP (₹${mrp}) cannot be less than Selling Price (₹${sellingPrice})`);
  }

  // Stock validation
  const cleanStockStr = String(row.stock || '').trim();
  let stock = parseInt(cleanStockStr, 10);
  if (cleanStockStr === '') {
    stock = 25;
    warnings.push('Stock unit was empty; defaulted to 25 units');
  } else if (isNaN(stock) || stock < 0) {
    errors.push(`Stock count cannot be negative or invalid ("${row.stock}")`);
  }

  // Fabric validation
  const fabric = (row.fabric || '450 GSM Heavy Combed Cotton').trim();

  // Gender validation
  let gender = (row.gender || 'unisex').toLowerCase().trim();
  if (!VALID_GENDERS.includes(gender)) {
    gender = 'unisex';
    warnings.push(`Gender "${row.gender}" normalized to "unisex"`);
  }

  // Description validation
  const description = (row.description || `${rawTitle} - Handcrafted luxury streetwear piece created with artisanal construction.`).trim();

  // Image validation
  let image = (row.image || '').trim();
  if (!image) {
    image = '/images/heavyweight_boxy_tee.jpg';
    warnings.push('No image specified; default atelier photo assigned');
  } else if (
    !image.startsWith('/images/') &&
    !image.startsWith('http://') &&
    !image.startsWith('https://') &&
    !image.startsWith('data:image/')
  ) {
    warnings.push(`Image path "${image}" may be inaccessible; ensure asset exists in public folder`);
  }

  // SKU validation & Duplicate checking
  let sku = (row.sku || '').trim();
  let isDuplicate = false;

  if (sku) {
    const skuLower = sku.toLowerCase();
    const existsInDb = existingProducts.some((p) => p.sku && String(p.sku).toLowerCase() === skuLower);
    const existsInBatch = batchSkus.has(skuLower);

    if (existsInDb) {
      isDuplicate = true;
      errors.push(`Duplicate SKU "${sku}" already exists in the live catalog`);
    } else if (existsInBatch) {
      isDuplicate = true;
      errors.push(`Duplicate SKU "${sku}" appears multiple times in this CSV file`);
    } else {
      batchSkus.add(skuLower);
    }
  } else {
    sku = `2L-SKU-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // Title duplicate checking
  if (rawTitle) {
    const titleLower = rawTitle.toLowerCase();
    const titleInDb = existingProducts.some((p) => p.name && p.name.toLowerCase() === titleLower);
    const titleInBatch = batchTitles.has(titleLower);

    if (titleInDb) {
      warnings.push(`A piece named "${rawTitle}" already exists in catalog`);
    } else if (titleInBatch) {
      warnings.push(`Multiple rows in this file have the title "${rawTitle}"`);
    } else {
      batchTitles.add(titleLower);
    }
  }

  const isValid = errors.length === 0;

  return {
    rowNumber: rowNum,
    isValid,
    isDuplicate,
    errors,
    warnings,
    data: {
      name: rawTitle,
      title: rawTitle,
      category,
      subCategory,
      price: !isNaN(sellingPrice) ? sellingPrice : 799,
      sellingPrice: !isNaN(sellingPrice) ? sellingPrice : 799,
      originalPrice: mrp,
      mrp,
      stockCount: stock,
      stock,
      fabric,
      gender,
      description,
      image,
      images: [image],
      sku,
    },
  };
};

/**
 * Validates an entire batch of parsed rows
 */
export const validateAllProductRows = (parsedRows, existingProducts = []) => {
  const batchSkus = new Set();
  const batchTitles = new Set();

  const validatedList = parsedRows.map((row, index) =>
    validateProductRow(row, index, existingProducts, batchSkus, batchTitles)
  );

  const total = validatedList.length;
  const valid = validatedList.filter((r) => r.isValid).length;
  const invalid = validatedList.filter((r) => !r.isValid).length;
  const duplicates = validatedList.filter((r) => r.isDuplicate).length;

  return {
    rows: validatedList,
    stats: { total, valid, invalid, duplicates },
  };
};

/**
 * Generates official downloadable CSV template with realistic sample products
 * Protects against spreadsheet formula injection by sanitizing leading symbols
 */
export const generateCSVTemplateString = () => {
  const headers = [
    'title',
    'category',
    'subcategory',
    'sellingPrice',
    'mrp',
    'stock',
    'fabric',
    'gender',
    'description',
    'image',
    'sku',
  ];

  const sampleRows = [
    [
      '500 GSM Monolith Boxy T-Shirt',
      't-shirts',
      'Oversized',
      '799',
      '1499',
      '40',
      '450 GSM Heavy Combed Cotton',
      'unisex',
      'Architectural drop-shoulder boxy tee cut from combed heavyweight loopback cotton.',
      '/images/heavyweight_boxy_tee.jpg',
      '2L-TEE-001',
    ],
    [
      '14.5oz Raw Selvedge Baggy Denim',
      'jeans',
      'Baggy',
      '1699',
      '2499',
      '30',
      '14.5oz Japanese Kurabo Selvedge Cotton',
      'unisex',
      'Constructed from rare 14.5oz Japanese shuttle-loom selvedge denim with intentional relaxed wide drape.',
      '/images/raw_baggy_denim.jpg',
      '2L-JNS-002',
    ],
    [
      'Monolith Tactical Cargo Pant',
      'jeans',
      'Cargo',
      '1899',
      '2799',
      '25',
      '13oz Japanese Twill Denim with DWR finish',
      'men',
      'Utilitarian military archive cargo pant featuring 6 gusseted 3D compartments and bungee-toggle cuff adjustments.',
      '/images/tactical_cargo.jpg',
      '2L-CRG-003',
    ],
    [
      'Vaporwave Architectural Chunky Runner',
      'sneakers',
      'Chunky',
      '2499',
      '3799',
      '18',
      'Italian Lambskin and Ballistic Nylon Mesh',
      'unisex',
      'Architectural sculpted dual-density foam midsole paired with full-grain lambskin overlays.',
      '/images/chunky_runner_sneaker.jpg',
      '2L-SNK-004',
    ],
  ];

  const sanitizeCell = (cell) => {
    let str = String(cell ?? '');
    // Prevent formula injection in Excel / Google Sheets
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = "'" + str;
    }
    // Escape quotes if needed
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(','),
    ...sampleRows.map((row) => row.map(sanitizeCell).join(',')),
  ];

  return lines.join('\r\n');
};

/**
 * Triggers browser download of CSV string
 */
export const downloadCSVFile = (content, filename = '2L_Bulk_Import_Template.csv') => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
