import { XddWanderNewPage } from './app.po';

describe('xdd-wander-new App', () => {
  let page: XddWanderNewPage;

  beforeEach(() => {
    page = new XddWanderNewPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
