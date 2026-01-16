// script.js

/**
 * Texas Grillz Abidjan - Script Principal
 * Gestion du panier, commande WhatsApp et interactions
 */

// ========================================
// NAVIGATION HIDE/SHOW AU SCROLL
// ========================================

let lastScrollTop = 0;
const nav = document.querySelector('.nav');
const navHeight = nav.offsetHeight;
const scrollThreshold = 100; // Seuil pour déclencher l'effet

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Masquer la nav quand on descend, la montrer quand on remonte
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        // On descend - masquer la nav
        nav.classList.add('hidden');
    } else {
        // On remonte - montrer la nav
        nav.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
    
    // Ajouter un effet de transparence au header en scroll
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.style.backdropFilter = 'blur(20px)';
        header.style.backgroundColor = 'rgba(var(--card-bg-rgb), 0.95)';
    } else {
        header.style.backdropFilter = 'blur(30px)';
        header.style.backgroundColor = 'var(--card-bg)';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation du panier...');
    
    // Initialiser les éléments DOM
    cartSidebar = document.getElementById('cartSidebar');
    cartToggle = document.getElementById('cartToggle');
    cartClose = document.getElementById('cartClose');
    cartItems = document.getElementById('cartItems');
    cartCount = document.getElementById('cartCount');
    cartTotal = document.getElementById('cartTotal');
    overlay = document.getElementById('overlay');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
    btnWhatsapp = document.getElementById('btnWhatsapp');
    
    // Debug: vérifier que les éléments sont trouvés
    console.log('Éléments trouvés:', {
        cartSidebar: !!cartSidebar,
        cartToggle: !!cartToggle,
        cartClose: !!cartClose,
        cartItems: !!cartItems,
        cartCount: !!cartCount,
        cartTotal: !!cartTotal,
        btnWhatsapp: !!btnWhatsapp
    });
    
    // Charger le panier depuis le localStorage
    loadCartFromStorage();
    
    // Événements du panier
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
        console.log('Événement panier attaché');
    }
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    
    // Initialiser la gestion du thème
    initTheme();
    
    // Initialiser les infos de délai
    updateDeliveryInfo();
    
    // Mettre à jour l'affichage initial
    updateCartDisplay();
    
    // Améliorer le formulaire
    enhanceOrderForm();
    
    console.log('Panier initialisé avec', cart.length, 'articles');
});

// ========================================
// AMÉLIORATION ALIGNEMENT DES CARTES
// ========================================

// Assurer l'alignement parfait des cartes
function fixCardAlignment() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const image = item.querySelector('.menu-item-image');
        const info = item.querySelector('.menu-item-info');
        const footer = item.querySelector('.item-footer');
        
        // S'assurer que la hauteur de l'image est fixe
        if (image) image.style.height = '180px';
        
        // Forcer l'affichage correct des marges
        if (info) info.style.display = 'flex';
        if (footer) footer.style.marginTop = 'auto';
    });
}

// Exécuter au chargement et au redimensionnement
document.addEventListener('DOMContentLoaded', fixCardAlignment);
window.addEventListener('resize', fixCardAlignment);

// ========================================
// OPTIMISATION MOBILE
// ========================================

// Détection mobile et ajustements
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Optimisations spécifiques mobile
        document.body.style.fontSize = '15px';
        
        // Ajuster la taille des polices pour mobile
        const titles = document.querySelectorAll('.section-title, .category-title');
        titles.forEach(title => {
            title.style.lineHeight = '1.2';
        });
        
        // Optimiser les boutons pour mobile
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-add');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px'; // Taille tactile minimum iOS
        });
    }
}

// Exécuter les optimisations
document.addEventListener('DOMContentLoaded', optimizeForMobile);
window.addEventListener('resize', optimizeForMobile);

// ========================================
// VARIABLES GLOBALES
// ========================================

// Panier stocké en mémoire
let cart = [];

// Numéro WhatsApp du restaurant (format international sans +)
const WHATSAPP_NUMBER = '2250152991237';

// Éléments DOM
let cartSidebar, cartToggle, cartClose, cartItems, cartCount, cartTotal, overlay, toast, toastMessage, btnWhatsapp;

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les éléments DOM
    cartSidebar = document.getElementById('cartSidebar');
    cartToggle = document.getElementById('cartToggle');
    cartClose = document.getElementById('cartClose');
    cartItems = document.getElementById('cartItems');
    cartCount = document.getElementById('cartCount');
    cartTotal = document.getElementById('cartTotal');
    overlay = document.getElementById('overlay');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
    btnWhatsapp = document.getElementById('btnWhatsapp');
    
    // Charger le panier depuis le localStorage si disponible
    loadCartFromStorage();
    
    // Événements du panier
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    
    // Initialiser la gestion du thème
    initTheme();
    
    // Initialiser les infos de délai
    updateDeliveryInfo();
    
    // Mettre à jour l'affichage initial
    updateCartDisplay();
    
    // Améliorer le formulaire
    enhanceOrderForm();
});

// ========================================
// GESTION DU MODE SOMBRE/CLAIR
// ========================================

function initTheme() {
    // Vérifier la préférence utilisateur
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Appliquer le thème sauvegardé ou la préférence système
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.checked = false;
    }
    
    // Gérer le toggle du thème
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                showToast('Mode sombre activé');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                showToast('Mode clair activé');
            }
            updateThemeIcons();
        });
    }
    
    // Mettre à jour les icônes en fonction du thème
    updateThemeIcons();
}

function updateThemeIcons() {
    const sunIcons = document.querySelectorAll('.fa-sun');
    const moonIcons = document.querySelectorAll('.fa-moon');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    sunIcons.forEach(icon => {
        icon.style.opacity = isDark ? '0.5' : '1';
    });
    
    moonIcons.forEach(icon => {
        icon.style.opacity = isDark ? '1' : '0.5';
    });
}

// ========================================
// AMÉLIORATION DES INTERACTIONS BOUTONS
// ========================================

// Animation de clic améliorée pour les boutons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add') || 
        e.target.closest('.btn-add')) {
        
        const btn = e.target.classList.contains('btn-add') ? 
                   e.target : e.target.closest('.btn-add');
        
        // Animation de pulsation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        // Effet de particules (optionnel)
        createParticleEffect(e.clientX, e.clientY);
    }
});

// Effet de particules pour l'ajout au panier
function createParticleEffect(x, y) {
    const particles = 5;
    const colors = ['#C41E3A', '#D4AF37', '#FFFFFF'];
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animation
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let opacity = 1;
        const animation = setInterval(() => {
            opacity -= 0.05;
            particle.style.opacity = opacity;
            particle.style.left = `${parseFloat(particle.style.left) + vx}px`;
            particle.style.top = `${parseFloat(particle.style.top) + vy}px`;
            
            if (opacity <= 0) {
                clearInterval(animation);
                particle.remove();
            }
        }, 16);
    }
}

// ========================================
// GESTION DU PANIER
// ========================================

/**
 * Ajoute un article au panier
 * @param {number} id - ID de l'article
 * @param {string} name - Nom de l'article
 * @param {number} price - Prix de l'article
 */
function addToCart(id, name, price) {
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Augmenter la quantité
        existingItem.quantity += 1;
    } else {
        // Ajouter un nouvel article
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Mettre à jour l'affichage
    updateCartDisplay();
    
    // Sauvegarder dans le localStorage
    saveCartToStorage();
    
    // Afficher la notification
    showToast('Article ajouté au panier');
    
    // Mettre à jour les infos de délai
    updateDeliveryInfo();
}

/**
 * Supprime un article du panier
 * @param {number} id - ID de l'article à supprimer
 */
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    saveCartToStorage();
    showToast('Article supprimé du panier');
    updateDeliveryInfo();
}

/**
 * Augmente la quantité d'un article
 * @param {number} id - ID de l'article
 */
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCartDisplay();
        saveCartToStorage();
        updateDeliveryInfo();
    }
}

/**
 * Diminue la quantité d'un article
 * @param {number} id - ID de l'article
 */
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
            saveCartToStorage();
            updateDeliveryInfo();
        }
    }
}

/**
 * Calcule le total du panier
 * @returns {number} - Total en FCFA
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Met à jour l'affichage du panier
 */
function updateCartDisplay() {
    // Mettre à jour le compteur
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Mettre à jour la liste des articles
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="cart-empty">Votre panier est vide</p>';
        if (btnWhatsapp) btnWhatsapp.disabled = true;
    } else {
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="item-price">${formatPrice(item.price)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
                    </div>
                </div>
            `;
        });
        if (cartItems) cartItems.innerHTML = html;
        if (btnWhatsapp) btnWhatsapp.disabled = false;
    }
    
    // Mettre à jour le total
    if (cartTotal) cartTotal.textContent = formatPrice(calculateTotal());
}

/**
 * Formate un prix en FCFA
 * @param {number} price - Prix à formater
 * @returns {string} - Prix formaté
 */
function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' FCFA';
}

// ========================================
// AMÉLIORATION DES INFORMATIONS DE LIVRAISON
// ========================================

// Fonction pour calculer le délai estimé
function calculateDeliveryTime() {
    const basePreparationTime = 20; // minutes moyennes de préparation
    const baseDeliveryTime = 35; // minutes moyennes de livraison
    
    // Calcul dynamique basé sur le contenu du panier
    let additionalTime = 0;
    
    cart.forEach(item => {
        // Certains plats prennent plus de temps
        if (item.name.includes('Mix Grill') || item.name.includes('Poulet Entier')) {
            additionalTime += 5;
        }
        if (item.name.includes('Ribs') || item.name.includes('Steak')) {
            additionalTime += 3;
        }
        // Plus il y a d'articles, plus la préparation est longue
        if (item.quantity > 1) {
            additionalTime += 2;
        }
    });
    
    const totalTime = basePreparationTime + baseDeliveryTime + additionalTime;
    return {
        preparation: basePreparationTime + additionalTime,
        delivery: baseDeliveryTime,
        total: totalTime
    };
}

// Mettre à jour l'affichage des délais dans le panier
function updateDeliveryInfo() {
    const deliveryInfo = document.querySelector('.delivery-info');
    if (deliveryInfo) {
        if (cart.length > 0) {
            const times = calculateDeliveryTime();
            deliveryInfo.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Délai estimé : ${times.preparation}min préparation + ${times.delivery}min livraison</span>
            `;
        } else {
            deliveryInfo.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>Livraison incluse dans Abidjan (délai selon adresse)</span>
            `;
        }
    }
}

// ========================================
// MISE À JOUR DU FORMULAIRE DE COMMANDE
// ========================================

// Ajouter un champ pour les notes spéciales
function enhanceOrderForm() {
    const cartForm = document.getElementById('cartForm');
    if (cartForm && !document.getElementById('orderNotes')) {
        // Ajouter une section pour les notes
        const notesSection = document.createElement('div');
        notesSection.className = 'form-group';
        notesSection.innerHTML = `
            <label for="orderNotes">
                <i class="fas fa-sticky-note"></i> Notes pour la commande (optionnel)
            </label>
            <textarea id="orderNotes" placeholder="Ex: Sans oignons, Sauce à part, etc." rows="2"></textarea>
            <small style="display: block; margin-top: 0.25rem; color: var(--text-tertiary); font-size: 0.8rem;">
                Précisions sur la cuisson, allergies, ou instructions spéciales
            </small>
        `;
        
        // Insérer avant le bouton WhatsApp
        const whatsappBtn = document.querySelector('.btn-whatsapp');
        if (whatsappBtn) {
            cartForm.insertBefore(notesSection, whatsappBtn);
        }
    }
}

// ========================================
// GESTION DU SIDEBAR PANIER
// ========================================

/**
 * Ouvre le panier
 */
function openCart() {
    if (cartSidebar) cartSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ferme le panier
 */
function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// STOCKAGE LOCAL
// ========================================

/**
 * Sauvegarde le panier dans le localStorage
 */
function saveCartToStorage() {
    try {
        localStorage.setItem('texasGrillzCart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Impossible de sauvegarder le panier:', e);
    }
}

/**
 * Charge le panier depuis le localStorage
 */
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('texasGrillzCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.warn('Impossible de charger le panier:', e);
        cart = [];
    }
}

// ========================================
// COMMANDE WHATSAPP
// ========================================

/**
 * Envoie la commande via WhatsApp
 */
function sendToWhatsApp() {
    // Récupérer les informations du client
    const customerName = document.getElementById('customerName') ? document.getElementById('customerName').value.trim() : '';
    const customerPhone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value.trim() : '';
    const customerAddress = document.getElementById('customerAddress') ? document.getElementById('customerAddress').value.trim() : '';
    const orderNotes = document.getElementById('orderNotes') ? document.getElementById('orderNotes').value.trim() : '';
    
    // Validation des champs
    if (!customerName) {
        showToast('Veuillez saisir votre nom');
        document.getElementById('customerName').focus();
        return;
    }
    
    if (!customerPhone) {
        showToast('Veuillez saisir votre numéro de téléphone');
        document.getElementById('customerPhone').focus();
        return;
    }
    
    if (!customerAddress) {
        showToast('Veuillez saisir votre adresse de livraison');
        document.getElementById('customerAddress').focus();
        return;
    }
    
    if (cart.length === 0) {
        showToast('Votre panier est vide');
        return;
    }
    
    // Calculer le délai estimé
    const times = calculateDeliveryTime();
    
    // Construire le message
    let message = '🔥 *NOUVELLE COMMANDE - TEXAS GRILLZ ABIDJAN* 🔥\n\n';
    message += '━━━━━━━━━━━━━━━━━━━━━━\n';
    message += '📋 *DÉTAILS DE LA COMMANDE*\n';
    message += `⏰ *Délai estimé : ${times.total} minutes*\n`;
    message += `   (Préparation : ${times.preparation}min, Livraison : ${times.delivery}min)\n`;
    message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    // Liste des articles
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantité: ${item.quantity}\n`;
        message += `   Prix unitaire: ${formatPrice(item.price)}\n`;
        message += `   Sous-total: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += '━━━━━━━━━━━━━━━━━━━━━━\n';
    message += `💰 *TOTAL: ${formatPrice(calculateTotal())}*\n`;
    message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    message += '👤 *INFORMATIONS CLIENT*\n';
    message += `Nom: ${customerName}\n`;
    message += `Téléphone: ${customerPhone}\n`;
    message += `Adresse: ${customerAddress}\n`;
    
    if (orderNotes) {
        message += `Notes: ${orderNotes}\n`;
    }
    
    message += '\n━━━━━━━━━━━━━━━━━━━━━━\n';
    message += '🙏 Merci pour votre commande !\n';
    message += 'Nous vous contacterons rapidement.\n';
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construire l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
    
    // Vider le panier après la commande
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    
    // Réinitialiser le formulaire
    if (document.getElementById('customerName')) document.getElementById('customerName').value = '';
    if (document.getElementById('customerPhone')) document.getElementById('customerPhone').value = '';
    if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = '';
    if (document.getElementById('orderNotes')) document.getElementById('orderNotes').value = '';
    
    // Fermer le panier
    closeCart();
    
    // Notification
    showToast('Commande envoyée via WhatsApp');
}

// ========================================
// FAQ ACCORDÉON
// ========================================

/**
 * Basculer l'affichage d'une question FAQ
 * @param {HTMLElement} button - Bouton cliqué
 */
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fermer toutes les questions
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Ouvrir la question cliquée si elle n'était pas déjà ouverte
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ========================================
// NOTIFICATIONS TOAST
// ========================================

/**
 * Affiche une notification toast
 * @param {string} message - Message à afficher
 */
function showToast(message) {
    if (toastMessage) toastMessage.textContent = message;
    if (toast) toast.classList.add('active');
    
    // Masquer après 3 secondes
    setTimeout(() => {
        if (toast) toast.classList.remove('active');
    }, 3000);
}

// ========================================
// FONCTIONS POUR LE CONTACT MODERNISÉ
// ========================================

/**
 * Basculer l'affichage d'une section contact
 */
function toggleContact(button) {
    const contactItem = button.closest('.contact-item');
    const isActive = contactItem.classList.contains('active');
    
    // Fermer toutes les autres sections
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Ouvrir la section cliquée si elle n'était pas déjà ouverte
    if (!isActive) {
        contactItem.classList.add('active');
    }
}

/**
 * Ouvrir Google Maps avec notre adresse
 */
function openGoogleMaps() {
    const address = encodeURIComponent('Texas Grillz Abidjan, Plateau, Abidjan, Côte d\'Ivoire');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
    
    showToast('Ouverture de Google Maps...');
}

/**
 * Copier l'adresse dans le presse-papier
 */
function copyAddress() {
    const address = 'Texas Grillz Abidjan, Plateau, Abidjan, Côte d\'Ivoire';
    
    navigator.clipboard.writeText(address).then(() => {
        showToast('Adresse copiée dans le presse-papier !');
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        showToast('Erreur lors de la copie');
    });
}

/**
 * S'abonner à la newsletter
 */
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Veuillez entrer votre email');
        emailInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Veuillez entrer un email valide');
        emailInput.focus();
        return;
    }
    
    // Simuler l'envoi
    showToast('🎉 Merci pour votre inscription à la newsletter !');
    emailInput.value = '';
    
    // Ici, vous devriez envoyer l'email à votre backend
    console.log('Newsletter subscription:', email);
}

/**
 * Valider un email
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Exposer les nouvelles fonctions globalement
window.toggleContact = toggleContact;
window.openGoogleMaps = openGoogleMaps;
window.copyAddress = copyAddress;
window.subscribeNewsletter = subscribeNewsletter;

// ========================================
// NAVIGATION FLUIDE
// ========================================

// Fermer le panier si on clique sur un lien de navigation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', closeCart);
    });
    
    // Scroll fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 130;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Exposer les fonctions globales au window pour les appels onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.sendToWhatsApp = sendToWhatsApp;
window.toggleFaq = toggleFaq;
window.openCart = openCart;
window.closeCart = closeCart;
