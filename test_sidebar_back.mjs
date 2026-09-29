import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/');

  // Click Trigonometri
  await page.locator('.module-card[data-target="module-trig"]').click();
  await page.waitForTimeout(500);

  // Click Algebra in sidebar
  await page.click('.sidebar-nav a[href="#algebra"]');
  await page.waitForTimeout(500);

  const isGridVisible = await page.evaluate(() => document.getElementById('dashboard-grid').style.display);
  console.log('Dashboard display:', isGridVisible);

  const totalCards = await page.locator('.module-card:visible').count();
  console.log('Visible cards:', totalCards);

  await browser.close();
})();
