describe('Wikipedia: Jamk-haku, Skrollaus ja Kielen vaihto', () => {
  // Määritellään hakusana ja odotetut URL-osat muuttujiin
  const hakusana = 'Jamk';
  const fi_url_osa = 'Jyv%C3%A4skyl%C3%A4n_ammattikorkeakoulu'; // URL-koodattu ÄÄKKÖS-osoite
  const en_url_osa = 'JAMK_University_of_Applied_Sciences';

  it('Suorittaa hakuprosessin, skrollaa ja vaihtaa kieltä', () => {
    // --- 1. Menee suomenkieliselle Wikipedia pääsivulle ---
    cy.log('1. Siirrytään Suomenkieliselle Wikipedia-sivulle...');
    cy.visit('https://fi.wikipedia.org/wiki/Etusivu');

    // --- 2. Etsii hakukentän, kirjoittaa siihen "Jamk" ja hakee ---
    cy.log(`2. Kirjoitetaan hakukenttään "${hakusana}" ja suoritetaan haku.`);
    cy.get('#searchInput').type(hakusana);

    // Klikataan hakunappia suoraan siirtymiseksi
    cy.get('#searchButton').click();

    // --- 3. Tarkistaa, että olemme oikealla sivulla ---
    cy.log(
      '3. Tarkistetaan, että URL on oikea (Jyväskylän ammattikorkeakoulu).'
    );
    cy.url().should('include', fi_url_osa);
    cy.title().should('include', 'Jyväskylän ammattikorkeakoulu');

    // --- 4. Rullaa kohtaan "Kampukset" ---
    // Etsitään "Kampukset"-otsikko, joka on yleensä h2-tunnisteessa
    // ja jolla on erityinen ID (Wikipediassa ID:t ovat tärkeitä ankkureita).
    const kampukset_id = 'Kampukset';

    cy.log(`4. Rullataan sivua kohtaan "${kampukset_id}".`);

    // Cypressin `scrollIntoView()` on paras tapa varmistaa, että elementti tulee näkyviin
    cy.get(`#${kampukset_id}`)
      .scrollIntoView({ duration: 1000 }) // Skrollaus vie 1 sekunnin
      .wait(500); // Lyhyt odotus varmistamaan renderöinti

    // --- 5. Tarkistaa, että "Kampukset" on näkyvillä ---
    cy.log('5. Varmistetaan, että otsikko on näkyvillä.');
    cy.get(`#${kampukset_id}`).should('be.visible');

    // --- 6. Odottaa 5 sekuntia ---
    cy.log(
      '6. Odotetaan 5 sekuntia (tyypillisesti vältettävä, mutta toteutetaan pyynnöstä).'
    );
    cy.wait(5000); // Odota 5000 millisekuntia

    // --- 7. Vaihtaa kielen englanniksi ---
    // Kielen vaihtopainike on usein Link languages (Muut kielet) -listassa.
    cy.log('7. Vaihdetaan kieli englanniksi.');

    // Etsitään linkkiä, joka sisältää tekstin "English" ja jolla on luokka
    // tai tunnus, joka viittaa kielen vaihtoon.
    cy.get('#p-lang a').contains('English').click();

    // --- 8. Tarkistaa, että uusi sivu on oikea (englanninkielinen JAMK-sivu) ---
    cy.log(
      '8. Tarkistetaan, että sivu on nyt englanninkielinen JAMK-artikkeli.'
    );
    cy.url().should('include', en_url_osa);
    cy.title().should('include', 'JAMK University of Applied Sciences');
  });
});
