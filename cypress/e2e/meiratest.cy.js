describe('Test QA-Jubelio', () => {
  it('Membuka Link Test Jubelio dan Login', () => {
    cy.visit('https://v2.jubelio.com/auth/login');
    cy.get('input[type="email"]').type('meiratesting@gmail.com');
    cy.get('input[type="password"]').type('');
    cy.contains('Login').click();
    cy.url().should('include', 'dashboard');
  });
});

    it('should successfully create a new order (Pesanan)', () => {
        cy.get('a[href*="/penjualan"]').click();
        cy.get('a[href*="/penjualan/pesanan"]').click();
        cy.contains('Tambah Pesanan').click();
        cy.get('input[placeholder="Cari Pelanggan"]').type('Pelanggan Baru{enter}');
        cy.get('input[placeholder="Cari Produk"]').type('Produk Contoh{enter}');
        cy.get('.product-search-results .product-item').first().click();
        cy.get('input[placeholder="Jumlah"]').clear().type('2');
        cy.contains('Tambahkan').click();
        cy.contains('Simpan').click();
        cy.url().should('include', '/penjualan/pesanan');
        cy.get('.order-list-table tbody tr').first().find('.order-number-column').invoke('text').then((text) => {
            createdOrderNumber = text.trim();
            cy.log(`Created Order Number: ${createdOrderNumber}`);
        });
    });

    it('should successfully edit an existing order (Pesanan)', () => {
        cy.get('a[href*="/penjualan"]').click();
        cy.get('a[href*="/penjualan/pesanan"]').click();

        if (createdOrderNumber) {
            cy.get('input[placeholder="Cari Pesanan"]').type(createdOrderNumber);
            cy.get('.search-button').click();
            cy.contains(createdOrderNumber).should('be.visible');
        } else {
            cy.log('No createdOrderNumber found, selecting the first order in the list.');
            cy.get('.order-list-table tbody tr').first().click(); 
        }

        cy.get('.order-list-table tbody tr').first().find('.edit-button').click(); /
        cy.get('input[placeholder="Jumlah"]').eq(0).clear().type('3'); 
        cy.get('input[placeholder="Cari Produk"]').type('Produk Lain{enter}');
        cy.get('.product-search-results .product-item').first().click();
        cy.get('input[placeholder="Jumlah"]').last().clear().type('1');
        cy.contains('Tambahkan').click();
        cy.contains('Simpan').click();
        cy.url().should('include', '/penjualan/pesanan');
    });

    it('should successfully search for an order (Pesanan)', () => {
        cy.get('a[href*="/penjualan"]').click();
        cy.get('a[href*="/penjualan/pesanan"]').click();
        const searchTerm = createdOrderNumber || 'Pelanggan Contoh';
        cy.get('input[placeholder="Cari Pesanan"]').type(searchTerm);
        cy.get('.search-button').click(); 
        cy.get('.order-list-table tbody tr').should('have.length.at.least', 1);
        cy.get('.order-list-table tbody').contains(searchTerm).should('be.visible');
    });
