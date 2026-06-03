const { chromium } = require('playwright');
const fs = require('fs');

/* =====================================================
   🇧🇩 HOLIDAY CHECK (NEXT DAY)
   If tomorrow is a holiday → skip today’s booking
   ===================================================== */

// Load holidays
const holidayData = JSON.parse(fs.readFileSync('holidays.json', 'utf8'));
const holidays = holidayData.holidays;

// Current time in Bangladesh
const now = new Date(
  new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
);

// Calculate tomorrow (Bangladesh time)
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);

// Format YYYY-MM-DD safely (Bangladesh timezone)
const tomorrowStr = tomorrow.toLocaleDateString('en-CA', {
  timeZone: 'Asia/Dhaka'
});

// Check if tomorrow is a holiday
const tomorrowHoliday = holidays.find(h => h.date === tomorrowStr);

if (tomorrowHoliday) {
  console.log(`🎉 Tomorrow is a holiday: ${tomorrowHoliday.name}`);
  console.log('🚫 Skipping today’s lunch booking');
  process.exit(0); // ✅ graceful success exit
} else {
  console.log(`✅ Tomorrow ${tomorrowStr} is a working day`);
  console.log('🍱 Initiating today’s lunch booking...');
}

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
   page.setDefaultTimeout(60000);
   page.setDefaultNavigationTimeout(60000);
   
   console.log('Launching browser...');
  await page.goto(
     'https://www.ulka.autos/lunch-booking',
     { waitUntil: 'domcontentloaded', timeout: 60000 }
  );
   // Debug current page
   console.log('Current URL:', page.url());
   await page.screenshot({ path: 'debug-before-switch.png' });

  // 1️⃣ Wait for UI
   console.log('Waiting for switch...');
  await page.waitForSelector('[role="switch"]', { timeout: 60000 });
   console.log('Switch found');

  // 2️⃣ Wait for backend booking-state sync
  await page.waitForLoadState('networkidle');

  // 3️⃣ Stabilization delay (React re-render protection)
  await page.waitForTimeout(3000);

  const sw = page.locator('[role="switch"]').first();

  // 4️⃣ Read state BEFORE click (robust)
   console.log('Reading state...');
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
     console.log('Clicking switch...');
    await sw.click();

    // Wait for backend decision
    //await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

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
   console.log('Taking screenshot...');
  await page.screenshot({ path: 'final-state.png' });

    // 📅 Date / Time / Day of execution (UTC+6 Bangladesh)
  const now = new Date();

  const options = {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(now);

  console.log(`
⏰ Execution Info
----------------
${formatted}

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
