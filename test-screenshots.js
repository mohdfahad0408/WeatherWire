import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'desktop_1280', width: 1280, height: 900 },
    { name: 'tablet_768', width: 768, height: 1200 },
    { name: 'mobile_390', width: 390, height: 1600 },
    { name: 'small_360', width: 360, height: 1600 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:3000/test-responsive.html`, { waitUntil: 'networkidle0', timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `/tmp/resp_${vp.name}.png`, fullPage: true });
    console.log(`Screenshot: ${vp.name}`);

    // Check overflow
    const overflow = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        overflowing: body.scrollWidth > body.clientWidth
      };
    });
    console.log(`[${vp.name}] overflow:`, overflow);

    await page.close();
  }

  await browser.close();
  console.log('Done.');
})();
