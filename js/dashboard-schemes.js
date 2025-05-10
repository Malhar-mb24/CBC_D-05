document.addEventListener('DOMContentLoaded', function() {
    const schemesList = document.getElementById('schemes-list');
    const schemeSearch = document.getElementById('scheme-search');
    const categoryFilter = document.getElementById('category-filter');
    
    // Exit if elements don't exist
    if (!schemesList) return;
    
    // Sample schemes data
    const schemesData = [
        {
            id: 1,
            title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
            category: 'subsidy',
            department: 'Ministry of Agriculture & Farmers Welfare',
            description: 'Financial benefit of Rs. 6000 per year in three equal installments to eligible farmer families.',
            eligibility: 'All landholding farmers\' families with cultivable landholding in their names.',
            benefits: '₹6,000 per year in three equal installments',
            documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
            applyLink: '#',
            deadline: 'Ongoing',
            status: 'active'
        },
        {
            id: 2,
            title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            category: 'insurance',
            department: 'Ministry of Agriculture & Farmers Welfare',
            description: 'Provides comprehensive insurance coverage against crop failure due to non-preventable risks.',
            eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
            benefits: 'Insurance coverage for crop loss due to natural calamities, pests & diseases',
            documents: ['Land Records', 'Bank Account Details', 'Identity Proof'],
            applyLink: '#',
            deadline: 'Season-based (Before sowing)',
            status: 'active'
        },
        {
            id: 3,
            title: 'Kisan Credit Card (KCC)',
            category: 'loan',
            department: 'Ministry of Finance',
            description: 'Provides short-term credit requirements for cultivation of crops, post-harvest expenses, etc.',
            eligibility: 'All farmers, tenant farmers, sharecroppers, and self-help groups of farmers.',
            benefits: 'Credit limit up to ₹3 lakhs at subsidized interest rate',
            documents: ['Land Records/Tenancy Certificate', 'Identity Proof', 'Passport size photograph'],
            applyLink: '#',
            deadline: 'Ongoing',
            status: 'active'
        },
        {
            id: 4,
            title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
            category: 'subsidy',
            department: 'Ministry of Agriculture & Farmers Welfare',
            description: 'Promotes organic farming and improves soil health through organic inputs.',
            eligibility: 'All farmers who commit to organic farming practices.',
            benefits: 'Financial assistance of ₹50,000 per hectare for 3 years',
            documents: ['Land Records', 'Bank Account Details', 'Identity Proof'],
            applyLink: '#',
            deadline: 'Ongoing',
            status: 'active'
        },
        {
            id: 5,
            title: 'Micro Irrigation Fund (MIF)',
            category: 'subsidy',
            department: 'Ministry of Agriculture & Farmers Welfare',
            description: 'Facilitates access to finance for promoting micro-irrigation systems.',
            eligibility: 'Small and marginal farmers adopting micro-irrigation systems.',
            benefits: 'Subsidy up to 55% for small and marginal farmers',
            documents: ['Land Records', 'Bank Account Details', 'Identity Proof'],
            applyLink: '#',
            deadline: 'Ongoing',
            status: 'active'
        },
        {
            id: 6,
            title: 'Agriculture Infrastructure Fund',
            category: 'loan',
            department: 'Ministry of Agriculture & Farmers Welfare',
            description: 'Financing facility for investment in post-harvest management infrastructure and community farming assets.',
            eligibility: 'Farmers, Primary Agricultural Credit Societies, FPOs, Self Help Groups.',
            benefits: 'Interest subvention and credit guarantee',
            documents: ['Business Plan', 'ID Proof', 'Bank Statement', 'Land Documents'],
            applyLink: '#',
            deadline: 'Ongoing',
            status: 'active'
        }
    ];
    
    // Function to create scheme card
    function createSchemeCard(scheme) {
        const schemeCard = document.createElement('div');
        schemeCard.className = 'scheme-card';
        schemeCard.dataset.category = scheme.category;
        
        // Define category badge class and icon
        let categoryClass = '';
        let categoryIcon = '';
        
        switch (scheme.category) {
            case 'subsidy':
                categoryClass = 'subsidy-badge';
                categoryIcon = 'fa-hand-holding-usd';
                break;
            case 'loan':
                categoryClass = 'loan-badge';
                categoryIcon = 'fa-money-bill-wave';
                break;
            case 'insurance':
                categoryClass = 'insurance-badge';
                categoryIcon = 'fa-shield-alt';
                break;
            default:
                categoryClass = 'other-badge';
                categoryIcon = 'fa-clipboard-list';
        }
        
        // HTML structure for the scheme card
        schemeCard.innerHTML = `
            <div class="scheme-card-header">
                <span class="scheme-category ${categoryClass}">
                    <i class="fas ${categoryIcon}"></i> ${scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                </span>
                <h3 class="scheme-title">${scheme.title}</h3>
                <p class="scheme-department">${scheme.department}</p>
            </div>
            <div class="scheme-card-content">
                <p class="scheme-description">${scheme.description}</p>
                <div class="scheme-eligibility">
                    <h4>Eligibility:</h4>
                    <p>${scheme.eligibility}</p>
                </div>
                <div class="scheme-benefits">
                    <h4>Benefits:</h4>
                    <p>${scheme.benefits}</p>
                </div>
                <div class="scheme-deadline">
                    <i class="fas fa-calendar-alt"></i> Deadline: ${scheme.deadline}
                </div>
            </div>
            <div class="scheme-card-footer">
                <button class="scheme-details-btn" data-scheme-id="${scheme.id}">
                    View Details
                </button>
            </div>
        `;
        
        return schemeCard;
    }
    
    // Function to render all schemes
    function renderSchemes(schemes) {
        if (!schemesList) return;
        
        schemesList.innerHTML = '';
        
        if (schemes.length === 0) {
            schemesList.innerHTML = '<div class="no-schemes">No schemes found matching your criteria.</div>';
            return;
        }
        
        schemes.forEach(scheme => {
            const schemeCard = createSchemeCard(scheme);
            schemesList.appendChild(schemeCard);
        });
        
        // Add event listeners to the "View Details" buttons
        document.querySelectorAll('.scheme-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const schemeId = parseInt(this.getAttribute('data-scheme-id'));
                const scheme = schemes.find(s => s.id === schemeId);
                if (scheme) {
                    openSchemeModal(scheme);
                }
            });
        });
    }
    
    // Function to filter schemes based on search and category
    function filterSchemes() {
        const searchTerm = schemeSearch ? schemeSearch.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        
        const filteredSchemes = schemesData.filter(scheme => {
            const matchesSearch = scheme.title.toLowerCase().includes(searchTerm) || 
                                scheme.description.toLowerCase().includes(searchTerm) ||
                                scheme.department.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category === 'all' || scheme.category === category;
            
            return matchesSearch && matchesCategory;
        });
        
        renderSchemes(filteredSchemes);
    }
    
    // Add event listeners for search and filter
    if (schemeSearch) {
        schemeSearch.addEventListener('input', filterSchemes);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSchemes);
    }
    
    // Function to create and display scheme modal
    function openSchemeModal(scheme) {
        // Check if modal container exists
        let modalContainer = document.querySelector('.modal-container');
        
        // Create modal container if it doesn't exist
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            document.body.appendChild(modalContainer);
        }
        
        // Create documents list HTML
        let documentsHTML = '';
        if (scheme.documents && scheme.documents.length) {
            documentsHTML = '<ul class="document-list">' + 
                scheme.documents.map(doc => `<li><i class="fas fa-file-alt"></i> ${doc}</li>`).join('') + 
                '</ul>';
        }
        
        // Set modal content
        modalContainer.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content scheme-modal">
                <button class="modal-close-btn"><i class="fas fa-times"></i></button>
                <div class="scheme-modal-header">
                    <span class="scheme-category ${scheme.category}-badge">
                        <i class="fas fa-${scheme.category === 'subsidy' ? 'hand-holding-usd' : 
                                        scheme.category === 'loan' ? 'money-bill-wave' : 
                                        scheme.category === 'insurance' ? 'shield-alt' : 'clipboard-list'}"></i> 
                        ${scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                    </span>
                    <h2 class="scheme-modal-title">${scheme.title}</h2>
                    <p class="scheme-modal-department">${scheme.department}</p>
                </div>
                
                <div class="scheme-modal-body">
                    <div class="scheme-section">
                        <h3 class="section-title">Description</h3>
                        <p>${scheme.description}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3 class="section-title">Eligibility</h3>
                        <p>${scheme.eligibility}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3 class="section-title">Benefits</h3>
                        <p>${scheme.benefits}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3 class="section-title">Required Documents</h3>
                        ${documentsHTML}
                    </div>
                    
                    <div class="scheme-section">
                        <h3 class="section-title">Application Details</h3>
                        <div class="application-details">
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value ${scheme.status === 'active' ? 'status-active' : 'status-inactive'}">
                                    ${scheme.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Deadline:</span>
                                <span class="detail-value">${scheme.deadline}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="scheme-modal-footer">
                    <a href="${scheme.applyLink}" class="apply-btn" target="_blank">Apply Now</a>
                </div>
            </div>
        `;
        
        // Show modal
        modalContainer.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add event listener to close button
        const closeBtn = modalContainer.querySelector('.modal-close-btn');
        const overlay = modalContainer.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modalContainer.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }
    
    // Initial render of schemes
    renderSchemes(schemesData);
});
