describe('Todo app', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });

  it('creates a new task and displays it in the list', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');

    // Submit the form
    cy.get('#save-btn').click();

    // Verify the task appears in the list
    cy.get('#task-list').should('be.visible');
    cy.get('#task-list .task').should('have.length', 1);

    // Check the task contains correct content
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('contain', 'Testitaski');
        cy.get('.desc').should('contain', 'Testitaskin kuvaus');
      });

    // Verify empty state is hidden
    cy.get('#empty-state').should('not.be.visible');

    // Verify task is persisted in localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Testitaski');
      expect(tasks[0].description).to.equal('Testitaskin kuvaus');
      expect(tasks[0].priority).to.equal('medium'); // default value
      expect(tasks[0].status).to.equal('todo'); // default value
      expect(tasks[0].completed).to.be.false;
    });
  });

  it('deletes a task and verifies it is removed', () => {
    // First, create a task
    cy.get('#topic').type('Poistettava taski');
    cy.get('#description').type('Tämä poistetaan');
    cy.get('#save-btn').click();

    // Verify task was created
    cy.get('#task-list .task').should('have.length', 1);
    cy.get('#task-list .task .title').should('contain', 'Poistettava taski');

    // Delete the task
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action="delete"]').click();
      });

    // Verify task is removed from the list
    cy.get('#task-list .task').should('have.length', 0);

    // Verify empty state is displayed
    cy.get('#empty-state').should('be.visible');

    // Verify task is removed from localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(0);
    });
  });
  it('muokkaa olemassa olevaa tehtävää ja päivittää tiedot listaan', () => {
    // Luodaan ensin tehtävä
    cy.get('#topic').type('Alkuperäinen otsikko');
    cy.get('#save-btn').click();

    // Klikataan muokkauspainiketta
    cy.get('[data-action="edit"]').click();

    // Varmistetaan, että lomake täyttyy tiedoilla ja otsikko vaihtuu
    cy.get('#form-title').should('contain', 'Edit Task');
    cy.get('#topic').should('have.value', 'Alkuperäinen otsikko');

    // Muutetaan tietoja
    cy.get('#topic').clear().type('Päivitetty otsikko');
    cy.get('#priority').select('high');
    cy.get('#save-btn').click();

    // Varmistetaan muutokset listasta
    cy.get('.task .title').should('contain', 'Päivitetty otsikko');
    cy.get('.badge.prio-high').should('exist');
    cy.get('#form-title').should('contain', 'Create Task'); // Lomake nollautuu
  });
  it('merkitsee tehtävän tehdyksi ja palauttaa sen takaisin tekemättömäksi', () => {
    cy.get('#topic').type('Suoritettava tehtävä');
    cy.get('#save-btn').click();

    // Merkitään valmiiksi
    cy.get('[data-action="complete"]').click();

    // Varmistetaan visualisointi (done-luokka) ja status-badge
    cy.get('.task').should('have.class', 'done');
    cy.get('.badge').should('contain', 'Done');

    // Kumotaan suoritus (Undo)
    cy.get('[data-action="complete"]').should('contain', 'Undo').click();

    // Varmistetaan, että tila palautuu
    cy.get('.task').should('not.have.class', 'done');
    cy.get('.badge').should('contain', 'To do');
  });
  it('ei salli tehtävän luomista ilman otsikkoa', () => {
    // Yritetään tallentaa tyhjää lomaketta
    cy.get('#save-btn').click();

    // Varmistetaan, että tehtävää ei luotu (lista pysyy tyhjänä)
    cy.get('#task-list .task').should('not.exist');

    // Tarkistetaan, että focus palautuu otsikkokenttään (app.js logiikka)
    cy.get('#topic').should('be.focused');
  });
  it('suodattaa listan näyttämään vain valitun prioriteetin tehtävät', () => {
    // 1. Luodaan kaksi erilaista tehtävää
    cy.get('#topic').type('High Task');
    cy.get('#priority').select('high');
    cy.get('#save-btn').click();

    cy.get('#topic').type('Low Task');
    cy.get('#priority').select('low');
    cy.get('#save-btn').click();

    // 2. Klikataan High-suodatinta
    cy.get('.filter-btn[data-filter="high"]').click();

    // 3. Varmistetaan että vain High näkyy
    cy.get('#task-list').should('contain', 'High Task');
    cy.get('#task-list').should('not.contain', 'Low Task');

    // 4. Poistetaan suodatus (All)
    cy.get('.filter-btn[data-filter="all"]').click();
    cy.get('#task-list').should('contain', 'Low Task');
  });
});
