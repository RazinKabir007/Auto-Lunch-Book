const { chromium } = require('playwright');
const fs = require('fs');

/* 🔐 ADD THIS PART (secrets handling) */
if (!process.env.ULKA_AUTH_JSON) {
  throw new Error('ULKA_AUTH_JSON secret is missing');
}
 
fs.writeFileSync(
  'ulka-auth.json',
  Buffer.from(process.env.ULKA_AUTH_JSON, 'base64')
);
/* 🔐 END secrets handling */

(async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: 'ulka-auth.json'
  });

  const page = await context.newPage();
  await page.goto('https://www.ulka.autos/lunch-booking');

  // 1️⃣ Wait for UI
  await page.waitForSelector('[role="switch"]', { timeout: 60000 });

  // 2️⃣ Wait for backend booking-state sync
  await page.waitForLoadState('networkidle');

  // 3️⃣ Stabilization delay (React re-render protection)
  await page.waitForTimeout(5000);

  const sw = page.locator('[role="switch"]').first();

  // 4️⃣ Read state BEFORE click (robust)
  const stateBefore = await sw.evaluate(el => {
    const aria = el.getAttribute('aria-checked');
    const cls = el.classList.contains('ant-switch-checked');
    return {
      ariaChecked: aria,
      classChecked: cls,
      final: aria === 'true' || cls === true
    };
  });

  let result;
  let stateAfter = null;

  if (stateBefore.final === true) {
    result = 'ALREADY_BOOKED';
  } else {
    // Attempt booking ONCE
    await sw.click();

    // Wait for backend decision
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Read state AFTER click
    stateAfter = await sw.evaluate(el => {
      const aria = el.getAttribute('aria-checked');
      const cls = el.classList.contains('ant-switch-checked');
      return {
        ariaChecked: aria,
        classChecked: cls,
        final: aria === 'true' || cls === true
      };
    });

    result = stateAfter.final ? 'BOOKING_SUCCESS' : 'BOOKING_REJECTED';
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final-state.png' });

  console.log(`
🍱 Lunch booking attempt finished
--------------------------------
State BEFORE click:
  aria-checked  : ${stateBefore.ariaChecked}
  class checked : ${stateBefore.classChecked}
  final         : ${stateBefore.final}

${stateAfter ? `State AFTER click:
  aria-checked  : ${stateAfter.ariaChecked}
  class checked : ${stateAfter.classChecked}
  final         : ${stateAfter.final}
` : ''}
Result : ${result}
`);

  await browser.close();

  console.log(`
🧹 Browser closed
`);
})();
