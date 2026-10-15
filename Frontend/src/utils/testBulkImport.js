import {
  parseCSVText,
  validateAllProductRows,
  generateCSVTemplateString,
  normalizeCategory,
  normalizeSubCategory
} from './csvImporter.js';

console.log('--- STARTING 2L ATELIER BULK IMPORT AUTOMATED TEST SUITE ---');

// Test 1: CSV Template Generation
const template = generateCSVTemplateString();
console.assert(template.includes('title,category,subcategory,sellingPrice,mrp,stock,fabric,gender,description,image,sku'), 'Header missing from template');
console.assert(template.includes('500 GSM Monolith Boxy T-Shirt'), 'Sample 1 missing');
console.assert(template.includes('14.5oz Raw Selvedge Baggy Denim'), 'Sample 2 missing');
console.assert(template.includes('Vaporwave Architectural Chunky Runner'), 'Sample 3 missing');
console.log('✅ Test 1 Passed: CSV Template generated with all required headers and 2L sample pieces.');

// Test 2: Parse Template
const parsedTemplate = parseCSVText(template);
console.assert(parsedTemplate.length === 4, `Expected 4 sample rows, got ${parsedTemplate.length}`);
console.log('✅ Test 2 Passed: Template correctly parsed into 4 distinct records.');

// Test 3: Validation of Template rows (All should be valid)
const valTemplate = validateAllProductRows(parsedTemplate, []);
console.assert(valTemplate.stats.total === 4, 'Stats total mismatch');
console.assert(valTemplate.stats.valid === 4, 'Stats valid mismatch');
console.assert(valTemplate.stats.invalid === 0, 'Stats invalid mismatch');
console.assert(valTemplate.stats.duplicates === 0, 'Stats duplicates mismatch');
console.log('✅ Test 3 Passed: Standard template items pass 100% of schema validation constraints.');

// Test 4: Handling of Quoted Fields with Embedded Commas & Quotes
const complexCSV = `title,category,subcategory,sellingPrice,mrp,stock,fabric,gender,description,image,sku
"Raw Selvedge, Indigo Tint",jeans,"Baggy, Wide",1299,1999,30,"100% Cotton, 14.5oz",unisex,"Crafted with rare shuttle looms, hand-treated in Okayama, Japan.",/images/raw_baggy_denim.jpg,2L-TEST-001
"Drop-Shoulder ""Oversized"" Tee",t-shirts,Oversized,699,1299,50,450 GSM Cotton,unisex,"Heavyweight boxy cut with pronounced drop shoulder.",/images/heavyweight_boxy_tee.jpg,2L-TEST-002`;

const parsedComplex = parseCSVText(complexCSV);
console.assert(parsedComplex.length === 2, `Expected 2 rows, got ${parsedComplex.length}`);
console.assert(parsedComplex[0].title === 'Raw Selvedge, Indigo Tint', `Title with comma failed: ${parsedComplex[0].title}`);
console.assert(parsedComplex[0].subcategory === 'Baggy, Wide', `Subcategory with comma failed: ${parsedComplex[0].subcategory}`);
console.assert(parsedComplex[1].title === 'Drop-Shoulder "Oversized" Tee', `Escaped quotes failed: ${parsedComplex[1].title}`);
console.log('✅ Test 4 Passed: RFC-4180 complex CSV parsing (embedded commas, quotes) parsed flawlessly.');

// Test 5: Validation of Invalid Rows & Duplicate Detection
const invalidCSV = `title,category,subcategory,sellingPrice,mrp,stock,fabric,gender,description,image,sku
,jeans,Baggy,1200,1800,10,Denim,unisex,Missing title,/images/raw_baggy_denim.jpg,2L-BAD-01
Valid Title,unknown-cat,Baggy,abc,1800,10,Denim,unisex,Invalid price,/images/raw_baggy_denim.jpg,2L-BAD-02
Valid Title 2,t-shirts,Oversized,1500,1000,10,Cotton,unisex,MRP less than price,/images/heavyweight_boxy_tee.jpg,2L-BAD-03
Valid Title 3,sneakers,Chunky,2500,3500,-5,Leather,unisex,Negative stock,/images/chunky_runner_sneaker.jpg,2L-BAD-04
Valid Piece One,shirts,Poplin,999,1499,20,Poplin,unisex,First occurrence,/images/white_poplin_shirt.jpg,2L-DUP-99
Valid Piece Two,shirts,Poplin,999,1499,20,Poplin,unisex,Duplicate SKU occurrence,/images/white_poplin_shirt.jpg,2L-DUP-99`;

const parsedInvalid = parseCSVText(invalidCSV);
const mockExistingProducts = [
  { id: 'ex-1', name: 'Existing Atelier Piece', sku: '2L-EXISTING-SKU' }
];

const valInvalid = validateAllProductRows(parsedInvalid, mockExistingProducts);
console.assert(valInvalid.stats.total === 6, `Expected 6 rows, got ${valInvalid.stats.total}`);
console.assert(valInvalid.stats.valid === 1, `Expected 1 valid row (Row 5), got ${valInvalid.stats.valid}`);
console.assert(valInvalid.stats.invalid === 5, `Expected 5 invalid rows, got ${valInvalid.stats.invalid}`);
console.assert(valInvalid.stats.duplicates === 1, `Expected 1 duplicate row (Row 6), got ${valInvalid.stats.duplicates}`);

// Check specific error messages
const row1 = valInvalid.rows[0];
console.assert(row1.errors.some(e => e.includes('Missing required Piece Title')), 'Row 1 missing title error check failed');

const row2 = valInvalid.rows[1];
console.assert(row2.errors.some(e => e.includes('Selling Price must be a valid positive number')), 'Row 2 price error check failed');

const row3 = valInvalid.rows[2];
console.assert(row3.errors.some(e => e.includes('cannot be less than Selling Price')), 'Row 3 MRP error check failed');

const row4 = valInvalid.rows[3];
console.assert(row4.errors.some(e => e.includes('Stock count cannot be negative')), 'Row 4 stock error check failed');

const row6 = valInvalid.rows[5];
console.assert(row6.errors.some(e => e.includes('Duplicate SKU')), 'Row 6 duplicate SKU error check failed');

console.log('✅ Test 5 Passed: All validation rules, error reasons, and duplicate detections enforced accurately.');

console.log('--- ALL TEST SUITE ASSERTIONS COMPLETED SUCCESSFULLY ---');
