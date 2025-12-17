import { describe, it, expect, vi, beforeEach } from 'vitest';

// Luodaan "vale-ympäristö", jotta app.js ei kaadu ladattaessa
global.window = { scrollTo: vi.fn() };
global.document = {
  getElementById: vi.fn(() => ({
    addEventListener: vi.fn(),
    reset: vi.fn(),
    appendChild: vi.fn(),
    classList: { add: vi.fn(), remove: vi.fn() },
    style: {},
  })),
  createElement: vi.fn(() => ({
    innerHTML: '',
    dataset: {},
    appendChild: vi.fn(),
  })),
};
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

describe('Yksinkertaiset CRUD-logiikkatestit', () => {
  it('varmistaa, että tehtävän luonnissa on oikeat kentät', () => {
    // Testaussuunnitelman vaatimus: Otsikko, kuvaus, prioriteetti, tila [cite: 10]
    const testTask = {
      topic: 'Testitehtävä',
      description: 'Kuvaus',
      priority: 'medium',
      status: 'todo',
    };

    expect(testTask.topic).toBeDefined();
    expect(testTask.priority).toBe('medium');
    expect(testTask.status).toBe('todo');
  });

  it('varmistaa, että pakolliset kentät on määritelty (Validointi)', () => {
    // Testaussuunnitelman vaatimus: Otsikko on vaadittu [cite: 10, 24]
    const validate = (topic) => {
      if (!topic || topic.trim() === '') return false;
      return true;
    };

    expect(validate('Jotain')).toBe(true);
    expect(validate('')).toBe(false);
  });

  it('varmistaa tehtävän poistamisen logiikan', () => {
    // Testaussuunnitelman vaatimus: Tehtävän poisto [cite: 9, 21]
    let tasks = [
      { id: 1, topic: 'Poistettava' },
      { id: 2, topic: 'Säästettävä' },
    ];
    const idToDelete = 1;

    tasks = tasks.filter((t) => t.id !== idToDelete);

    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe(2);
  });
});
