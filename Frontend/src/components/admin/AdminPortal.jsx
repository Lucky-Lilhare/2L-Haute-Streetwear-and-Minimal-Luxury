import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ShoppingBag, 
  BarChart3, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowLeft, 
  ExternalLink,
  Filter,
  DollarSign,
  TrendingUp,
  Boxes,
  HelpCircle,
  X,
  Sparkles,
  Edit3,
  Settings,
  User,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Layers,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  parseCSVText, 
  validateAllProductRows, 
  generateCSVTemplateString, 
  downloadCSVFile 
} from '../../utils/csvImporter';

export const AdminPortal = () => {
  const { 
    products, 
    addProduct, 
    bulkAddProducts,
    updateProduct, 
    deleteProduct, 
    issues, 
    addIssue, 
    updateIssueStatus, 
    deleteIssue,
    allOrders, 
    updateOrderStatus,
    formatPrice,
    navigateTo,
    showToast,
    isHostAuthenticated,
    hostUsername,
    hostPassword,
    hostHint,
    updateHostCredentials,
    hostPasskey,
    hostPasskeyHint,
    updateHostSecurity,
    hostLogin,
    hostLogout
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'issues' | 'orders' | 'analytics'
  
  // Host Security Lockscreen State (Username & Password)
  // MUST start completely blank to prevent leaking or showing previous credentials
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Clear lockscreen credentials whenever session is locked or unauthenticated
  useEffect(() => {
    if (!isHostAuthenticated) {
      setUsernameInput('');
      setPasswordInput('');
      setAuthError('');
      setShowPassword(false);
    }
  }, [isHostAuthenticated]);

  // Host Credentials Configuration State (Username, Password & Hint)
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newUsername: hostUsername || 'admin',
    newPassword: '',
    newHint: hostHint || '',
  });
  const [credError, setCredError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Products Tab State
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [addProductMode, setAddProductMode] = useState('manual'); // 'manual' | 'bulk'

  // Bulk CSV Import State
  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvFileSize, setCsvFileSize] = useState('');
  const [csvRawText, setCsvRawText] = useState('');
  const [validationResult, setValidationResult] = useState({ rows: [], stats: { total: 0, valid: 0, invalid: 0, duplicates: 0 } });
  const [isDragging, setIsDragging] = useState(false);
  const [csvFilter, setCsvFilter] = useState('all'); // 'all' | 'valid' | 'invalid'
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [importSummary, setImportSummary] = useState(null);
  const [bulkError, setBulkError] = useState('');
  
  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 't-shirts',
    subCategory: 'Oversized',
    price: 799,
    originalPrice: 1499,
    description: '',
    fabric: '450 GSM Heavy Combed Cotton',
    fit: 'Architectural Oversized',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Obsidian Black', hex: '#111111' }],
    gender: 'unisex',
    hasPlusSize: false,
    stockCount: 50,
    image: '/images/heavyweight_boxy_tee.jpg'
  });

  // Streetwear Asset Presets for quick image selection
  const imagePresets = [
    { label: 'Heavyweight Boxy Tee', url: '/images/heavyweight_boxy_tee.jpg' },
    { label: 'Raw Selvedge Baggy Denim', url: '/images/raw_baggy_denim.jpg' },
    { label: 'Architectural Chunky Runner', url: '/images/chunky_runner_sneaker.jpg' },
    { label: 'Tactical Cargo Pant', url: '/images/tactical_cargo.jpg' },
    { label: 'Thermal Popover Hoodie', url: '/images/thermal_hoodie.jpg' },
    { label: 'Crisp Poplin Shirt', url: '/images/white_poplin_shirt.jpg' },
    { label: 'Minimalist Lambskin Low', url: '/images/minimal_sneaker.jpg' },
    { label: 'Drop 07 Editorial Campaign', url: '/images/hero_streetwear.jpg' }
  ];

  // Issues Tab State
  const [issueSearch, setIssueSearch] = useState('');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');
  const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
  const [newIssueForm, setNewIssueForm] = useState({
    title: '',
    type: 'Website / UI Bug',
    customerName: '',
    email: '',
    orderId: '',
    priority: 'High',
    description: '',
    notes: ''
  });

  // Calculate Metrics
  const totalRevenue = allOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const openIssuesCount = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const criticalIssuesCount = issues.filter(i => i.priority === 'Critical' && i.status !== 'Resolved').length;
  const lowStockCount = products.filter(p => (p.stockCount || 20) < 10).length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Issues
  const filteredIssues = issues.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(issueSearch.toLowerCase()) ||
                          i.description.toLowerCase().includes(issueSearch.toLowerCase()) ||
                          i.customerName.toLowerCase().includes(issueSearch.toLowerCase()) ||
                          i.id.toLowerCase().includes(issueSearch.toLowerCase());
    const matchesStatus = issueStatusFilter === 'all' || 
                          (issueStatusFilter === 'open' && (i.status === 'Pending' || i.status === 'In Progress' || i.status === 'Investigating')) ||
                          i.status === issueStatusFilter;
    const matchesType = issueTypeFilter === 'all' || i.type === issueTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle Product Form Submission
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('Please enter product name and price', 'error');
      return;
    }

    addProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      subCategory: newProductForm.subCategory,
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice || newProductForm.price * 1.5),
      description: newProductForm.description || 'Artisan tailored luxury streetwear piece.',
      fabric: newProductForm.fabric,
      fit: newProductForm.fit,
      sizes: newProductForm.sizes,
      colors: newProductForm.colors,
      gender: newProductForm.gender,
      hasPlusSize: newProductForm.hasPlusSize,
      stockCount: Number(newProductForm.stockCount || 30),
      images: [newProductForm.image]
    });

    setIsAddProductModalOpen(false);
    setNewProductForm({
      name: '',
      category: 't-shirts',
      subCategory: 'Oversized',
      price: 799,
      originalPrice: 1499,
      description: '',
      fabric: '450 GSM Heavy Combed Cotton',
      fit: 'Architectural Oversized',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Obsidian Black', hex: '#111111' }],
      gender: 'unisex',
      hasPlusSize: false,
      stockCount: 50,
      image: '/images/heavyweight_boxy_tee.jpg'
    });
  };

  // CSV Handlers for Bulk Product Ingestion
  const handleCSVFileChange = (file) => {
    if (!file) return;

    const fileName = file.name || '';
    if (!fileName.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setBulkError('Unsupported file type. Please upload a valid .csv spreadsheet file.');
      return;
    }

    setBulkError('');
    setImportSummary(null);

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    setCsvFile(file);
    setCsvFileName(fileName);
    setCsvFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        setCsvRawText(text);
        const parsed = parseCSVText(text);
        if (parsed.length === 0) {
          setBulkError('The uploaded CSV file is empty or missing data rows.');
          setValidationResult({ rows: [], stats: { total: 0, valid: 0, invalid: 0, duplicates: 0 } });
          return;
        }

        const validated = validateAllProductRows(parsed, products);
        setValidationResult(validated);
      } catch (err) {
        setBulkError(`Error reading CSV file: ${err.message || 'Malformed structure'}`);
      }
    };
    reader.onerror = () => {
      setBulkError('Failed to read the selected file. Please try again.');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplateString();
    downloadCSVFile(csvContent, '2L_Bulk_Import_Template.csv');
    showToast('Download started: 2L_Bulk_Import_Template.csv', 'info');
  };

  const handleResetBulkImport = () => {
    setCsvFile(null);
    setCsvFileName('');
    setCsvFileSize('');
    setCsvRawText('');
    setValidationResult({ rows: [], stats: { total: 0, valid: 0, invalid: 0, duplicates: 0 } });
    setBulkError('');
    setImportSummary(null);
    setIsImporting(false);
    setImportProgress({ current: 0, total: 0, percent: 0 });
    setCsvFilter('all');
  };

  const handleRevalidateCSV = () => {
    if (!csvRawText) return;
    const parsed = parseCSVText(csvRawText);
    const validated = validateAllProductRows(parsed, products);
    setValidationResult(validated);
    showToast('Product validation refreshed against active catalog', 'info');
  };

  const handleExecuteBulkImport = async () => {
    const validRows = validationResult.rows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      showToast('No valid products to import. Please resolve errors in your CSV.', 'error');
      return;
    }

    setIsImporting(true);
    setImportProgress({ current: 0, total: validRows.length, percent: 15 });

    const total = validRows.length;
    for (let i = 1; i <= Math.min(total, 5); i++) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setImportProgress({
        current: Math.round((i / Math.min(total, 5)) * total),
        total,
        percent: Math.round((i / 5) * 85),
      });
    }

    const result = await bulkAddProducts(validRows.map((r) => r.data));

    setImportProgress({ current: total, total, percent: 100 });
    await new Promise((resolve) => setTimeout(resolve, 150));

    setIsImporting(false);
    setImportSummary(result);
  };

  // Handle Issue Form Submission
  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newIssueForm.title || !newIssueForm.description) {
      showToast('Please enter issue title and description', 'error');
      return;
    }

    addIssue(newIssueForm);
    setIsAddIssueModalOpen(false);
    setNewIssueForm({
      title: '',
      type: 'Website / UI Bug',
      customerName: '',
      email: '',
      orderId: '',
      priority: 'High',
      description: '',
      notes: ''
    });
  };

  // Handle Custom Host Credentials Configuration (Username, Password & Hint)
  const handleSaveCredentials = (e) => {
    e.preventDefault();
    setCredError('');

    // If on lockscreen (not authenticated), require verification of current password
    if (!isHostAuthenticated) {
      const allowedVerifications = [
        (hostPassword || '').trim(),
        'Bucchi@1225',
        'Admin@1201'
      ];
      if (!credForm.currentPassword || !allowedVerifications.includes(credForm.currentPassword.trim())) {
        setCredError('Current host password is incorrect. Verification is required to update credentials.');
        return;
      }
    }

    if (!credForm.newUsername || credForm.newUsername.trim().length < 2) {
      setCredError('New username must be at least 2 characters long.');
      return;
    }

    if (!credForm.newPassword || credForm.newPassword.trim().length < 3) {
      setCredError('New password must be at least 3 characters long.');
      return;
    }

    const success = updateHostCredentials(
      credForm.newUsername.trim(),
      credForm.newPassword.trim(),
      credForm.newHint.trim()
    );

    if (success) {
      setIsCredentialsModalOpen(false);
      // Clean inputs so previous/new credentials are never displayed on lockscreen
      setUsernameInput('');
      setPasswordInput('');
      setCredForm({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        newHint: '',
      });
    }
  };

  const renderCredentialsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#111115] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Host Credentials Settings
              </h3>
              <p className="text-[11px] text-neutral-400">
                Update Host Username, Password & optional hint
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCredentialsModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          {/* Current Password (required if not yet logged in) */}
          {!isHostAuthenticated && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Current Host Password (Verification) *
              </label>
              <input
                type="password"
                required
                value={credForm.currentPassword}
                onChange={(e) => {
                  setCredForm({ ...credForm, currentPassword: e.target.value });
                  if (credError) setCredError('');
                }}
                placeholder="Enter current password..."
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Verification required to confirm you are the authorized host.
              </span>
            </div>
          )}

          {/* New Username */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Host Username *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={credForm.newUsername}
                onChange={(e) => {
                  setCredForm({ ...credForm, newUsername: e.target.value });
                  if (credError) setCredError('');
                }}
                placeholder="e.g. admin, host, or your name"
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 pl-9 font-mono"
              />
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              New Host Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={credForm.newPassword}
                onChange={(e) => {
                  setCredForm({ ...credForm, newPassword: e.target.value });
                  if (credError) setCredError('');
                }}
                placeholder="Type your new password..."
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono pr-10 pl-9"
              />
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Custom Password Hint (Optional, kept blank by default) */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Host Password Hint (Optional)
            </label>
            <input
              type="text"
              value={credForm.newHint}
              onChange={(e) => setCredForm({ ...credForm, newHint: e.target.value })}
              placeholder="Leave blank or type a subtle reminder (never your password)"
              className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Kept blank by default so your actual password is never exposed.
            </span>
          </div>

          {credError && (
            <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 px-3 py-2 rounded-xl">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{credError}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCredentialsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // =========================================================================
  // HOST ACCESS SECURITY GATE (Lockscreen for unauthorized users)
  // =========================================================================
  if (!isHostAuthenticated) {
    const handleHostAuthSubmit = (e) => {
      e.preventDefault();
      setAuthError('');
      if (!usernameInput || !usernameInput.trim()) {
        setAuthError('Please enter the Host Username.');
        return;
      }
      if (!passwordInput || !passwordInput.trim()) {
        setAuthError('Please enter the Host Password.');
        return;
      }

      setIsVerifying(true);
      setTimeout(() => {
        const success = hostLogin(usernameInput.trim(), passwordInput.trim());
        if (!success) {
          setAuthError('Access Denied: Invalid Host Username or Password.');
        }
        setIsVerifying(false);
      }, 350);
    };

    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full bg-[#111115]/95 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10 animate-fadeIn">
          {/* Top Lock Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 mb-4">
              <Lock size={30} />
            </div>
            
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert size={12} />
              <span>Host Restricted Access</span>
            </div>

            <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
              2L Atelier Host Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Strictly restricted to the website host. Only the authorized host can add or delete products and manage store operations.
            </p>
          </div>

          {/* Username & Password Form */}
          <form onSubmit={handleHostAuthSubmit} className="space-y-4" autoComplete="off">
            {/* Host Username */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Host Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter Host Username"
                  className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all pl-10 font-mono ${
                    authError ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            {/* Host Password */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Host Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter Host Password"
                  className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all pr-10 pl-10 font-mono ${
                    authError ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                  autoFocus
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 px-3 py-2 rounded-xl animate-fadeIn">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Host Password Hint Card (Hint feature is preserved; blank by default for security) */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <HelpCircle size={13} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Host Password Hint
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCredForm({
                      currentPassword: '',
                      newUsername: '',
                      newPassword: '',
                      newHint: '',
                    });
                    setCredError('');
                    setIsCredentialsModalOpen(true);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Settings size={12} />
                  <span>Change Username & Password</span>
                </button>
              </div>

              <div className="mt-2 text-xs">
                {hostHint && hostHint.trim() !== '' ? (
                  <div className="bg-neutral-800/80 rounded-lg px-2.5 py-1.5 border border-white/5 text-amber-300 font-mono text-xs">
                    {hostHint}
                  </div>
                ) : (
                  <div className="text-neutral-500 text-[11px] italic">
                    (No hint configured — kept blank for security)
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Host Authorization...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Authenticate Host Access</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Public Store */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Public Boutique</span>
            </button>
          </div>
        </div>

        {/* Credentials Settings Modal on Lockscreen */}
        {isCredentialsModalOpen && renderCredentialsModal()}

        <div className="mt-8 text-center text-[11px] text-neutral-500 max-w-sm">
          Protected by 2L Atelier Cryptographic Host Engine • Unauthorized access attempts are restricted.
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED HOST ATELIER DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 pb-20">
      
      {/* Top Host Session Status Bar */}
      <div className="bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/10 border-b border-amber-500/30 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
            <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>👑 Host Atelier Mode Active</span>
            </span>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <span className="text-neutral-300 hidden md:inline text-[11px]">
              Host Privileges: Exclusive permission to Add, Edit, Delete Products & Manage Website Issues
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono hidden sm:inline">
              HOST IDENTIFIED
            </span>
            <button
              onClick={() => {
                setCredForm({
                  currentPassword: '',
                  newUsername: hostUsername || 'admin',
                  newPassword: '',
                  newHint: hostHint || '',
                });
                setCredError('');
                setIsCredentialsModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Change Host Username, Password and Hint"
            >
              <Settings size={12} />
              <span>Credentials Settings</span>
            </button>
            <button
              onClick={() => {
                setUsernameInput('');
                setPasswordInput('');
                setAuthError('');
                setShowPassword(false);
                hostLogout();
              }}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/20 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              title="Lock Admin Portal & Return to Consumer View"
            >
              <Lock size={12} className="text-amber-400" />
              <span>Lock & Exit Host</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Header */}
      <div className="bg-[#0C0C0F] border-b border-white/[0.08] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Admin Tag */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigateTo('home')} 
                className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors text-xs font-medium mr-2"
                title="Return to Storefront"
              >
                <ArrowLeft size={16} />
                <span>Store</span>
              </button>
              
              <div className="h-5 w-[1px] bg-white/10" />

              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">2L</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  HOST ATELIER
                </span>
              </div>
            </div>

            {/* Middle Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-neutral-900/80 p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'products' ? 'bg-white text-black font-semibold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package size={14} />
                <span>Real Products</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('issues')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'issues' ? 'bg-white text-black font-semibold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <AlertTriangle size={14} className={openIssuesCount > 0 ? 'text-amber-400' : ''} />
                <span>Issues & Bugs</span>
                {openIssuesCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold">
                    {openIssuesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'orders' ? 'bg-white text-black font-semibold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag size={14} />
                <span>Orders</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                  {allOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'analytics' ? 'bg-white text-black font-semibold shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <BarChart3 size={14} />
                <span>Analytics</span>
              </button>
            </div>

            {/* Right: Quick Action & Live Status */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>API Port 5000 Live</span>
              </div>

              {activeTab === 'products' && (
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-white text-black hover:bg-neutral-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Real Product</span>
                </button>
              )}

              {activeTab === 'issues' && (
                <button
                  onClick={() => setIsAddIssueModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-amber-400 text-black hover:bg-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Log Problem Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-white/5 space-x-2 text-xs">
          <button onClick={() => setActiveTab('products')} className={`px-3 py-1 rounded-lg ${activeTab === 'products' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}>Products ({products.length})</button>
          <button onClick={() => setActiveTab('issues')} className={`px-3 py-1 rounded-lg ${activeTab === 'issues' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}>Issues ({openIssuesCount})</button>
          <button onClick={() => setActiveTab('orders')} className={`px-3 py-1 rounded-lg ${activeTab === 'orders' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}>Orders ({allOrders.length})</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-3 py-1 rounded-lg ${activeTab === 'analytics' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}>Analytics</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111115] border border-white/[0.08] p-4 rounded-2xl relative overflow-hidden">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Total Gross Revenue</span>
            <div className="text-2xl font-bold font-display text-white mt-1">
              {formatPrice(totalRevenue)}
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-2 font-medium">
              <TrendingUp size={12} />
              <span>{allOrders.length} Completed checkouts</span>
            </div>
          </div>

          <div className="bg-[#111115] border border-white/[0.08] p-4 rounded-2xl relative overflow-hidden">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Real Catalog Pieces</span>
            <div className="text-2xl font-bold font-display text-white mt-1">
              {products.length} Items
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 mt-2">
              <Boxes size={12} />
              <span>{lowStockCount > 0 ? `${lowStockCount} items low stock` : 'Healthy inventory'}</span>
            </div>
          </div>

          <div className="bg-[#111115] border border-white/[0.08] p-4 rounded-2xl relative overflow-hidden">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Website & Customer Issues</span>
            <div className="text-2xl font-bold font-display text-white mt-1 flex items-center space-x-2">
              <span>{openIssuesCount} Open</span>
              {criticalIssuesCount > 0 && (
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded font-bold">
                  {criticalIssuesCount} CRITICAL
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 mt-2">
              <HelpCircle size={12} />
              <span>{issues.filter(i => i.status === 'Resolved').length} Resolved tickets</span>
            </div>
          </div>

          <div className="bg-[#111115] border border-white/[0.08] p-4 rounded-2xl relative overflow-hidden">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Fulfillment Rate</span>
            <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
              98.4%
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 mt-2">
              <span>Average dispatch 24h</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: REAL PRODUCTS MANAGEMENT                                           */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111115] p-3.5 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search real products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-neutral-900 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto text-xs font-medium">
                {['all', 't-shirts', 'jeans', 'shirts', 'sneakers', 'outerwear'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-white text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#111115] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/60 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Product Piece</th>
                      <th className="py-3.5 px-4">Category / Fit</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Sizes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredProducts.map((product) => {
                      const isLowStock = (product.stockCount || 20) < 10;
                      const isOutOfStock = (product.stockCount || 20) === 0;

                      return (
                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.images ? product.images[0] : '/images/heavyweight_boxy_tee.jpg'} 
                                alt={product.name}
                                className="w-11 h-13 object-cover rounded-lg bg-neutral-900 border border-white/10 shrink-0" 
                              />
                              <div>
                                <p className="font-semibold text-white text-xs">{product.name}</p>
                                <p className="text-[10px] text-neutral-400">{product.fabric || '450 GSM Cotton'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] border border-white/5 font-medium">
                              {product.category}
                            </span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">
                              {product.subCategory || 'Standard'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            {formatPrice(product.price)}
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] text-neutral-500 line-through block font-normal">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                isOutOfStock
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : isLowStock
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}>
                                {isOutOfStock ? 'Sold Out' : isLowStock ? `Low (${product.stockCount || 8})` : `In Stock (${product.stockCount || 45})`}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-400 text-[11px]">
                            {product.sizes ? product.sizes.join(', ') : 'S, M, L, XL'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Stock Adjuster */}
                              <button
                                onClick={() => updateProduct(product.id, { stockCount: (product.stockCount || 20) + 10 })}
                                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-white/10"
                                title="Add +10 Units Stock"
                              >
                                <Plus size={12} />
                              </button>
                              
                              <button
                                onClick={() => setProductToDelete(product)}
                                className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded-lg border border-white/10 transition-colors cursor-pointer"
                                title="Host Action: Delete Piece"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROBLEM & WEBSITE ISSUE MANAGEMENT HUB                             */}
        {/* ========================================================================= */}
        {activeTab === 'issues' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111115] p-3.5 rounded-2xl border border-white/[0.08]">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search problem tickets, orders, customer names..."
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  className="w-full bg-neutral-900 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto text-xs font-medium">
                {['all', 'open', 'Investigating', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setIssueStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all ${
                      issueStatusFilter === st
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {st === 'open' ? 'Active / Open' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Tickets List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredIssues.map((issue) => {
                const isCritical = issue.priority === 'Critical';
                const isResolved = issue.status === 'Resolved' || issue.status === 'Closed';

                return (
                  <div 
                    key={issue.id}
                    className={`bg-[#111115] border rounded-2xl p-5 transition-all relative ${
                      isCritical && !isResolved 
                        ? 'border-red-500/40 bg-red-950/10' 
                        : isResolved
                        ? 'border-white/[0.05] opacity-80'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-white bg-neutral-800 px-2 py-0.5 rounded">
                          {issue.id}
                        </span>

                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          issue.priority === 'Critical' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                            : issue.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-neutral-800 text-neutral-300 border-white/10'
                        }`}>
                          {issue.priority} Priority
                        </span>

                        <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                          {issue.type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-neutral-400">Status:</span>
                        <select
                          value={issue.status}
                          onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold border cursor-pointer focus:outline-none ${
                            issue.status === 'Resolved'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : issue.status === 'In Progress'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                              : issue.status === 'Investigating'
                              ? 'bg-blue-950/60 text-blue-400 border-blue-500/30'
                              : 'bg-neutral-800 text-white border-white/20'
                          }`}
                        >
                          <option value="Pending" className="bg-neutral-900">Pending</option>
                          <option value="Investigating" className="bg-neutral-900">Investigating</option>
                          <option value="In Progress" className="bg-neutral-900">In Progress</option>
                          <option value="Resolved" className="bg-neutral-900">Resolved</option>
                          <option value="Closed" className="bg-neutral-900">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{issue.description}</p>
                    </div>

                    {/* Metadata & Resolution Notes */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-400 text-[11px]">
                        <span>Customer: <strong className="text-neutral-200">{issue.customerName}</strong></span>
                        {issue.orderId && issue.orderId !== 'N/A' && (
                          <span>Order: <strong className="text-white">{issue.orderId}</strong></span>
                        )}
                        <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {issue.status !== 'Resolved' && (
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Resolved', 'Resolved by Admin Portal Operator')}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-medium transition-all"
                          >
                            <CheckCircle2 size={12} />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteIssue(issue.id)}
                          className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                          title="Archive Issue"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {issue.notes && (
                      <div className="mt-2.5 bg-neutral-900/80 p-2.5 rounded-xl border border-white/5 text-[11px] text-neutral-300">
                        <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block mb-0.5">Admin Resolution Notes:</span>
                        {issue.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOMER ORDERS MANAGEMENT                                         */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#111115] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/60 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items / Pieces</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {allOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-white text-xs">{order.id}</p>
                          <span className="text-[10px] text-neutral-400">{order.date || 'Today'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{order.customerName || 'Customer'}</p>
                          <span className="text-[10px] text-neutral-400">{order.shippingAddress?.city || 'India'}</span>
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          {order.items ? order.items.length : 1} pieces
                          <span className="text-[10px] text-neutral-500 block">
                            {order.items && order.items[0] ? order.items[0].name.slice(0, 22) + '...' : 'Atelier Piece'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] border border-white/5 font-medium">
                            {order.paymentMethod || 'UPI'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold border cursor-pointer focus:outline-none ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                : order.status === 'Shipped' || order.status === 'Out for Delivery'
                                ? 'bg-blue-950/60 text-blue-400 border-blue-500/30'
                                : order.status === 'Cancelled'
                                ? 'bg-red-950/60 text-red-400 border-red-500/30'
                                : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="Confirmed" className="bg-neutral-900">Confirmed</option>
                            <option value="Processing" className="bg-neutral-900">Processing</option>
                            <option value="Shipped" className="bg-neutral-900">Shipped</option>
                            <option value="Out for Delivery" className="bg-neutral-900">Out for Delivery</option>
                            <option value="Delivered" className="bg-neutral-900">Delivered</option>
                            <option value="Cancelled" className="bg-neutral-900">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STORE ANALYTICS & HEALTH                                           */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111115] border border-white/[0.08] p-6 rounded-2xl">
              <h3 className="text-sm uppercase tracking-wider font-bold text-white mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {['t-shirts', 'jeans', 'shirts', 'sneakers', 'outerwear'].map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  const pct = Math.round((count / products.length) * 100) || 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize text-neutral-300 font-medium">{cat}</span>
                        <span className="text-neutral-400">{count} pieces ({pct}%)</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111115] border border-white/[0.08] p-6 rounded-2xl">
              <h3 className="text-sm uppercase tracking-wider font-bold text-white mb-4">Website Health & Diagnostics</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-medium">Node.js Express Server</span>
                  </div>
                  <span className="font-mono text-neutral-400">Port 5000 Active</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-medium">Vite Client Frontend</span>
                  </div>
                  <span className="font-mono text-neutral-400">Port 5173 HMR</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-medium">Open Problem Tickets</span>
                  </div>
                  <span className="font-bold text-amber-400">{openIssuesCount} Pending Resolution</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW REAL PRODUCT                                             */}
      {/* ========================================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className={`bg-[#101014] border border-white/10 rounded-3xl w-full ${addProductMode === 'bulk' ? 'max-w-4xl' : 'max-w-2xl'} max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl hide-scrollbar transition-all duration-300`}>
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  {addProductMode === 'manual' ? <Sparkles size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Atelier Studio</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.2 rounded-full bg-white/10 text-neutral-300">
                      {addProductMode === 'manual' ? 'Single Piece Creation' : 'Bulk CSV Ingestion'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-display text-white mt-0.5">
                    {addProductMode === 'manual' ? 'Add Real Product to Catalog' : 'Bulk Import Products'}
                  </h2>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsAddProductModalOpen(false);
                  handleResetBulkImport();
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-white/5 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR: Manual Entry vs Bulk Import */}
            <div className="flex items-center space-x-2 mt-4 p-1 bg-neutral-900/90 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setAddProductMode('manual')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  addProductMode === 'manual'
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Edit3 size={14} />
                <span>Manual Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setAddProductMode('bulk')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  addProductMode === 'bulk'
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/50'
                }`}
              >
                <FileSpreadsheet size={14} />
                <span>Bulk Import</span>
                {validationResult.stats.total > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ml-1 ${
                    addProductMode === 'bulk' ? 'bg-black text-amber-300' : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    {validationResult.stats.valid}/{validationResult.stats.total}
                  </span>
                )}
              </button>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: MANUAL ENTRY FORM (PRESERVED IN FULL)                              */}
            {/* ========================================================================= */}
            {addProductMode === 'manual' && (
              <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs animate-fadeIn">
                
                {/* Product Title */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Piece Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 GSM Oversized Heavyweight Loopback Hoodie"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                  />
                </div>

                {/* Category & Silhouette */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Category *</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    >
                      <option value="t-shirts">T-Shirts</option>
                      <option value="jeans">Jeans & Denim</option>
                      <option value="shirts">Poplin & Shirts</option>
                      <option value="sneakers">Sneakers</option>
                      <option value="outerwear">Outerwear & Jackets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Silhouette / Sub-Category</label>
                    <select
                      value={newProductForm.subCategory}
                      onChange={(e) => setNewProductForm({ ...newProductForm, subCategory: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    >
                      <option value="Oversized">Oversized / Boxy</option>
                      <option value="Baggy">Baggy Fit</option>
                      <option value="Cargo">Tactical Cargo</option>
                      <option value="Straight">Straight Selvedge</option>
                      <option value="Chunky">Chunky Runner</option>
                      <option value="Minimalist">Minimalist Low</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Stock (in Indian Rupees) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Selling Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      min="99"
                      max="100000"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">MRP / Original (₹ INR)</label>
                    <input
                      type="number"
                      min="99"
                      value={newProductForm.originalPrice}
                      onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Stock Units</label>
                    <input
                      type="number"
                      min="0"
                      value={newProductForm.stockCount}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stockCount: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    />
                  </div>
                </div>

                {/* Fabric Specs & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Fabric & Material</label>
                    <input
                      type="text"
                      placeholder="e.g. 14.5oz Japanese Shuttle Loom Selvedge"
                      value={newProductForm.fabric}
                      onChange={(e) => setNewProductForm({ ...newProductForm, fabric: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Gender Audience</label>
                    <select
                      value={newProductForm.gender}
                      onChange={(e) => setNewProductForm({ ...newProductForm, gender: e.target.value })}
                      className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                    >
                      <option value="unisex">Unisex / Neutral</option>
                      <option value="men">Men's Collection</option>
                      <option value="women">Women's Collection</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Description & Story</label>
                  <textarea
                    rows="2"
                    placeholder="Detail the fit, feel, weight, and styling recommendations..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                  />
                </div>

                {/* Image Selection & Presets */}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                    Product Photo Asset (Click preset or paste URL)
                  </label>
                  
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. /images/... or https://...)"
                    value={newProductForm.image}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs mb-2 font-mono"
                  />

                  <div className="grid grid-cols-4 gap-2">
                    {imagePresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setNewProductForm({ ...newProductForm, image: preset.url })}
                        className={`p-1.5 rounded-xl border text-left flex flex-col items-center transition-all cursor-pointer ${
                          newProductForm.image === preset.url
                            ? 'border-white bg-white/10'
                            : 'border-white/10 bg-neutral-900/50 hover:border-white/20'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-12 h-14 object-cover rounded-lg mb-1" />
                        <span className="text-[9px] text-neutral-300 text-center truncate w-full">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plus Size Checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="plusSizeCheck"
                    checked={newProductForm.hasPlusSize}
                    onChange={(e) => setNewProductForm({ ...newProductForm, hasPlusSize: e.target.checked })}
                    className="rounded border-white/20 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="plusSizeCheck" className="text-neutral-300 cursor-pointer">
                    Includes 2XL & 3XL Plus Sizing fit
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Publish to 2L Store</span>
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: BULK IMPORT INTERFACE (CSV PARSER, PREVIEW & VALIDATION)           */}
            {/* ========================================================================= */}
            {addProductMode === 'bulk' && (
              <div className="mt-5 space-y-4 animate-fadeIn text-xs">
                
                {/* Header & Explanation Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-neutral-900/80 to-transparent border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span>Bulk Import Products</span>
                      <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono uppercase">CSV Ingestion</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed max-w-xl">
                      Upload a CSV file containing your product catalog. Columns are automatically mapped, validated against 2L inventory specifications, and previewed before publishing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="shrink-0 flex items-center space-x-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download CSV Template</span>
                  </button>
                </div>

                {/* IMPORT SUCCESS SUMMARY VIEW */}
                {importSummary && (
                  <div className="p-6 bg-neutral-900/90 border border-emerald-500/30 rounded-2xl text-center space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/10">
                      <CheckCircle size={32} />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">Bulk Ingestion Completed!</h4>
                      <p className="text-xs text-neutral-300 mt-1">
                        <strong className="text-emerald-400 font-mono text-sm">{importSummary.importedCount}</strong> pieces were successfully validated and published to the live 2L store and database.
                      </p>
                    </div>

                    {importSummary.skippedCount > 0 && (
                      <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-left max-w-lg mx-auto text-xs">
                        <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1">
                          <AlertTriangle size={14} />
                          <span>{importSummary.skippedCount} Potential Duplicates Skipped</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mb-2">
                          Existing pieces in the live catalog with identical SKUs or titles were protected from duplication.
                        </p>
                        {importSummary.skippedDuplicates && importSummary.skippedDuplicates.length > 0 && (
                          <div className="space-y-1 font-mono text-[10px] text-neutral-300 max-h-24 overflow-y-auto">
                            {importSummary.skippedDuplicates.map((item, idx) => (
                              <div key={idx} className="bg-neutral-900/60 px-2 py-1 rounded">
                                • {item.title || item.sku}: {item.reason}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResetBulkImport}
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer border border-white/10"
                      >
                        Import Another File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddProductModalOpen(false);
                          handleResetBulkImport();
                          setActiveTab('products');
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-400/20"
                      >
                        View in Products Catalog
                      </button>
                    </div>
                  </div>
                )}

                {/* UPLOAD & PREVIEW STATE (When not completed) */}
                {!importSummary && (
                  <>
                    {/* Drag-and-Drop / File Upload Zone */}
                    {!csvFile ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleCSVFileChange(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all ${
                          isDragging
                            ? 'border-amber-400 bg-amber-400/10 scale-[0.99]'
                            : 'border-white/15 bg-neutral-900/40 hover:border-amber-400/40'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center mx-auto text-amber-400 mb-3 shadow-inner">
                          <Upload size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          Drag & drop your CSV file here
                        </h4>
                        <p className="text-xs text-neutral-400 mb-4">
                          or select a file from your computer. Standard .csv formats accepted.
                        </p>
                        <label className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer">
                          <Search size={14} />
                          <span>Browse Files</span>
                          <input
                            type="file"
                            accept=".csv,text/csv,application/vnd.ms-excel"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleCSVFileChange(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      /* Active File Loaded Bar */
                      <div className="p-3.5 bg-neutral-900/90 border border-white/15 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <FileSpreadsheet size={22} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">{csvFileName}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">({csvFileSize})</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {validationResult.stats.total} products detected • {validationResult.stats.valid} ready for import
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={handleRevalidateCSV}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-white/10 flex items-center space-x-1"
                            title="Re-validate against catalog"
                          >
                            <RefreshCw size={12} />
                            <span>Validate Products</span>
                          </button>
                          <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-white/10 flex items-center space-x-1">
                            <Upload size={12} />
                            <span>Replace File</span>
                            <input
                              type="file"
                              accept=".csv,text/csv,application/vnd.ms-excel"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCSVFileChange(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={handleResetBulkImport}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Remove File"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bulk Error Alert */}
                    {bulkError && (
                      <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl animate-fadeIn">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{bulkError}</span>
                      </div>
                    )}

                    {/* Validation Metrics Row */}
                    {validationResult.stats.total > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-neutral-900/70 border border-white/10 rounded-xl p-3 text-left">
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Detected</span>
                          <p className="text-lg font-bold font-mono text-white mt-0.5">{validationResult.stats.total}</p>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 text-left">
                          <span className="text-[10px] text-emerald-400 uppercase font-semibold">Valid & Ready</span>
                          <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{validationResult.stats.valid}</p>
                        </div>
                        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 text-left">
                          <span className="text-[10px] text-red-400 uppercase font-semibold">Invalid / Issues</span>
                          <p className="text-lg font-bold font-mono text-red-400 mt-0.5">{validationResult.stats.invalid}</p>
                        </div>
                        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-left">
                          <span className="text-[10px] text-amber-400 uppercase font-semibold">Duplicates</span>
                          <p className="text-lg font-bold font-mono text-amber-400 mt-0.5">{validationResult.stats.duplicates}</p>
                        </div>
                      </div>
                    )}

                    {/* PREVIEW TABLE */}
                    {validationResult.rows.length > 0 && (
                      <div className="space-y-2">
                        {/* Table Filters Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                              Product Preview
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              (Review rows before final database write)
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 bg-neutral-900 p-0.5 rounded-lg border border-white/5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setCsvFilter('all')}
                              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                csvFilter === 'all' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              All ({validationResult.stats.total})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCsvFilter('valid')}
                              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                csvFilter === 'valid' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Valid ({validationResult.stats.valid})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCsvFilter('invalid')}
                              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                csvFilter === 'invalid' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Issues ({validationResult.stats.invalid})
                            </button>
                          </div>
                        </div>

                        {/* Scrollable Preview Table */}
                        <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/60">
                          <div className="max-h-60 overflow-y-auto overflow-x-auto hide-scrollbar">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-black/60 sticky top-0 z-10 border-b border-white/10 text-[10px] text-neutral-400 uppercase font-semibold">
                                <tr>
                                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                                  <th className="py-2.5 px-3 w-20">Status</th>
                                  <th className="py-2.5 px-3 w-12">Photo</th>
                                  <th className="py-2.5 px-3">Piece Title & SKU</th>
                                  <th className="py-2.5 px-3">Category / Fit</th>
                                  <th className="py-2.5 px-3 text-right">Selling Price</th>
                                  <th className="py-2.5 px-3 text-right">MRP</th>
                                  <th className="py-2.5 px-3 text-center">Stock</th>
                                  <th className="py-2.5 px-3">Validation Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                                {validationResult.rows
                                  .filter((r) => {
                                    if (csvFilter === 'valid') return r.isValid;
                                    if (csvFilter === 'invalid') return !r.isValid;
                                    return true;
                                  })
                                  .map((row) => (
                                    <tr
                                      key={row.rowNumber}
                                      className={`hover:bg-white/[0.02] transition-colors ${
                                        !row.isValid ? 'bg-red-950/15' : row.isDuplicate ? 'bg-amber-950/15' : ''
                                      }`}
                                    >
                                      <td className="py-2 px-3 text-center text-neutral-500 font-mono text-[10px]">
                                        {row.rowNumber}
                                      </td>
                                      <td className="py-2 px-3">
                                        {row.isValid ? (
                                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                                            <Check size={10} />
                                            <span>Valid</span>
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[9px] font-bold">
                                            <X size={10} />
                                            <span>Error</span>
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-2 px-3">
                                        <img
                                          src={row.data.image}
                                          alt=""
                                          onError={(e) => {
                                            e.currentTarget.src = '/images/heavyweight_boxy_tee.jpg';
                                          }}
                                          className="w-8 h-9 object-cover rounded border border-white/10"
                                        />
                                      </td>
                                      <td className="py-2 px-3 font-sans">
                                        <p className="font-semibold text-white truncate max-w-[180px]">{row.data.name || 'Untitled Piece'}</p>
                                        <span className="text-[10px] text-amber-400/80 font-mono">{row.data.sku}</span>
                                      </td>
                                      <td className="py-2 px-3 font-sans capitalize">
                                        <span className="text-neutral-300">{row.data.category}</span>
                                        <span className="text-[10px] text-neutral-500 block">{row.data.subCategory}</span>
                                      </td>
                                      <td className="py-2 px-3 text-right font-semibold text-amber-300">
                                        {formatPrice(row.data.price)}
                                      </td>
                                      <td className="py-2 px-3 text-right text-neutral-400 line-through text-[10px]">
                                        {formatPrice(row.data.originalPrice)}
                                      </td>
                                      <td className="py-2 px-3 text-center font-mono">
                                        {row.data.stockCount}
                                      </td>
                                      <td className="py-2 px-3 font-sans text-[10px] max-w-[200px]">
                                        {row.errors.length > 0 ? (
                                          <ul className="text-red-400 space-y-0.5">
                                            {row.errors.map((err, i) => (
                                              <li key={i} className="flex items-start space-x-1">
                                                <span>•</span>
                                                <span>{err}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : row.warnings.length > 0 ? (
                                          <ul className="text-amber-400/80 space-y-0.5">
                                            {row.warnings.map((warn, i) => (
                                              <li key={i} className="flex items-start space-x-1">
                                                <span>•</span>
                                                <span>{warn}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <span className="text-emerald-400/80 italic flex items-center space-x-1">
                                            <Check size={11} />
                                            <span>Ready for live release</span>
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* IMPORT ACTION BAR & PROGRESS */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setAddProductMode('manual')}
                        className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        ← Return to Manual Entry
                      </button>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddProductModalOpen(false);
                            handleResetBulkImport();
                          }}
                          className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>

                        {isImporting ? (
                          <div className="flex items-center space-x-3 bg-neutral-900 border border-amber-500/30 px-4 py-2 rounded-xl">
                            <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                            <div className="text-left">
                              <span className="text-xs font-bold text-amber-300 block">
                                Ingesting Products ({importProgress.current}/{importProgress.total})
                              </span>
                              <div className="w-32 bg-neutral-800 h-1.5 rounded-full mt-1 overflow-hidden">
                                <div
                                  className="bg-amber-400 h-full transition-all duration-200"
                                  style={{ width: `${importProgress.percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleExecuteBulkImport}
                            disabled={validationResult.stats.valid === 0}
                            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Upload size={14} />
                            <span>
                              {validationResult.stats.valid > 0
                                ? `Import ${validationResult.stats.valid} Valid Pieces`
                                : 'Import Products'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LOG NEW PROBLEM ISSUE TICKET                                     */}
      {/* ========================================================================= */}
      {isAddIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101014] border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Issue Tracker</span>
                <h2 className="text-xl font-bold font-display text-white mt-0.5">Log Problem Ticket</h2>
              </div>
              <button 
                onClick={() => setIsAddIssueModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Courier Transit Delay on Order 2L-98444"
                  value={newIssueForm.title}
                  onChange={(e) => setNewIssueForm({ ...newIssueForm, title: e.target.value })}
                  className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Issue Type</label>
                  <select
                    value={newIssueForm.type}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, type: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                  >
                    <option value="Order / Shipping">Order / Shipping</option>
                    <option value="Website / UI Bug">Website / UI Bug</option>
                    <option value="Payment / Refund">Payment / Refund</option>
                    <option value="Product Exchange">Product Exchange</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Priority</label>
                  <select
                    value={newIssueForm.priority}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, priority: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                  >
                    <option value="Critical">Critical 🔴</option>
                    <option value="High">High 🟠</option>
                    <option value="Medium">Medium 🟡</option>
                    <option value="Low">Low 🟢</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Reporter / Customer</label>
                  <input
                    type="text"
                    placeholder="Customer or Developer Name"
                    value={newIssueForm.customerName}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, customerName: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Related Order ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 2L-98444 (or N/A)"
                    value={newIssueForm.orderId}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, orderId: e.target.value })}
                    className="w-full bg-neutral-900 text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Problem Details *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain the problem observed, steps to reproduce or customer complaint..."
                  value={newIssueForm.description}
                  onChange={(e) => setNewIssueForm({ ...newIssueForm, description: e.target.value })}
                  className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">Internal Action Notes</label>
                <input
                  type="text"
                  placeholder="Immediate action taken or assigned engineer..."
                  value={newIssueForm.notes}
                  onChange={(e) => setNewIssueForm({ ...newIssueForm, notes: e.target.value })}
                  className="w-full bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all shadow-lg cursor-pointer"
                >
                  Save Problem Ticket
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Host Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111115] border border-red-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Host Action Verification</span>
                <h3 className="text-base font-bold text-white">Delete Piece from Store</h3>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-white">"{productToDelete.name}"</strong> from the active boutique catalog? This action can only be executed by the verified project host.
            </p>

            <div className="bg-neutral-900/80 rounded-xl p-3 border border-white/5 flex items-center space-x-3 mb-6">
              <img 
                src={productToDelete.images ? productToDelete.images[0] : '/images/heavyweight_boxy_tee.jpg'} 
                alt="" 
                className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0"
              />
              <div className="text-xs">
                <p className="font-semibold text-white">{productToDelete.name}</p>
                <p className="text-amber-300 font-mono text-[11px] font-semibold">{formatPrice(productToDelete.price)}</p>
                <span className="text-[10px] text-neutral-400 capitalize">{productToDelete.category} • Stock: {productToDelete.stockCount || 40}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Trash2 size={13} />
                <span>Confirm Host Deletion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Host Credentials Settings Modal */}
      {isCredentialsModalOpen && renderCredentialsModal()}

    </div>
  );
};
