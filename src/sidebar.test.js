
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<div>Sidebar content</div>'), // Mock response of fetch
  })
);

const loadSidebar = require('./sidebar.js'); // Update this path

describe('loadSidebar', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
    document.body.innerHTML = '<div id="sidebar-container"></div>'; 
  });

  it('loads sidebar content into sidebar-container', async () => {
    await loadSidebar();

    expect(fetch).toHaveBeenCalledWith('./sidebar.html');
    expect(document.getElementById('sidebar-container').innerHTML).toBe('<div>Sidebar content</div>');
  });

  it('handles fetch failure', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Fetch failed')));

    await loadSidebar(); });
});
