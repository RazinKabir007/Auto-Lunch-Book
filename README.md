# 🍱 LUNCH_BOOK – Automated Lunch Booking  
**Playwright + GitHub Actions**

Automates lunch booking on  
👉 https://www.ulka.autos/lunch-booking  

Login **once manually**, then let GitHub Actions handle booking automatically on schedule.

---

## 📌 Features

- One-time manual login (OTP supported)
- Secure session storage using GitHub Secrets
- Automatic booking via cron schedule
- Retry logic for reliability
- Full-page screenshot proof committed to repo

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── lunch.yml
├── auto_lunch_book.js
├── package.json
├── package-lock.json
├── holidays.json
├── README.md
```

> ⚠️ `ulka-auth.json` is **NOT committed**. It is stored securely in GitHub Secrets.

---

## 1️⃣ Prerequisites

- Windows (no admin access required)
- Node.js ≥ 18
- GitHub account
- Internet access

---

## 2️⃣ Install Node.js (No Admin)

Download ZIP from:
https://nodejs.org/dist/

Choose:
```
node-v20.x.x-win-x64.zip
```

Extract to:
```
C:\Users\<YOUR_USER>\nodejs
```

Add to PATH:
```powershell
setx PATH "$env:PATH;C:\Users\<YOUR_USER>\nodejs"
```

Verify:
```powershell
node -v
npm -v
```

---

## 3️⃣ Create Playwright Project

```powershell
mkdir LUNCH_BOOK
cd LUNCH_BOOK
npm init -y
npm i playwright
npx playwright install chromium
```

---

## 4️⃣ One-Time Manual Login

### login-once.js

```js
const { chromium } = require('playwright');
const readline = require('readline');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.ulka.autos/lunch-booking');

  console.log(`
========================================
 LOGIN MANUALLY IN THE BROWSER
 After login is COMPLETE, press ENTER
========================================
`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise(resolve => rl.question('', resolve));
  rl.close();

  await context.storageState({ path: 'ulka-auth.json' });
  console.log('✅ Session saved to ulka-auth.json');

  await browser.close();
})();
```

Run:
```powershell
node login-once.js
```

---

## 5️⃣ Convert Session File to Secret

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ulka-auth.json")) | Set-Clipboard
```

GitHub → Repo → Settings → Secrets → Actions

```
Name: ULKA_AUTH_JSON
Value: (paste clipboard)
```

---

## 6️⃣ Create holidays.json file and upload it to repo

```json
{
  "country": "Bangladesh",
  "year": 2026,
  "source": "ULKA Holiday Calendar 2026",
  "holidays": [
    {
      "date": "2026-02-04",
      "name": "Shab-e-Barat",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-02-21",
      "name": "International Mother Language Day",
      "type": "General"
    },
    {
      "date": "2026-03-17",
      "name": "Laylat al-Qadr",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-03-19",
      "name": "Eid ul-Fitr Holiday",
      "type": "Executive Order"
    },
    {
      "date": "2026-03-20",
      "name": "Jumatul Bidah + Eid ul-Fitr Holiday",
      "type": "General + Executive Order"
    },
    {
      "date": "2026-03-21",
      "name": "Eid ul-Fitr Holiday",
      "type": "General",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-03-22",
      "name": "Eid ul-Fitr Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-03-23",
      "name": "Eid ul-Fitr Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-03-26",
      "name": "Independence Day",
      "type": "General"
    },
    {
      "date": "2026-04-14",
      "name": "Bengali New Year",
      "type": "Executive Order"
    },
    {
      "date": "2026-05-01",
      "name": "May Day + Buddha Purnima",
      "type": "General",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-26",
      "name": "Eid ul-Adha Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-27",
      "name": "Eid ul-Adha Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-28",
      "name": "Eid ul-Adha Holiday",
      "type": "General",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-29",
      "name": "Eid ul-Adha Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-30",
      "name": "Eid ul-Adha Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-05-31",
      "name": "Eid ul-Adha Holiday",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-06-26",
      "name": "Ashura",
      "type": "Executive Order",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-08-05",
      "name": "July Uprising Day",
      "type": "General"
    },
    {
      "date": "2026-08-26",
      "name": "Eid-e-Milad un-Nabi",
      "type": "General",
      "remarks": "Subject to moon sighting"
    },
    {
      "date": "2026-09-04",
      "name": "Shuba Janmashtami",
      "type": "General"
    },
    {
      "date": "2026-10-20",
      "name": "Durga Puja (Nabami)",
      "type": "Executive Order"
    },
    {
      "date": "2026-10-21",
      "name": "Durga Puja (Vijaya Dashami)",
      "type": "General"
    },
    {
      "date": "2026-12-16",
      "name": "Victory Day",
      "type": "General"
    },
    {
      "date": "2026-12-25",
      "name": "Christmas Day",
      "type": "General"
    }
  ]
}

```

## 7️⃣ Auto Booking Script

### auto_lunch_book.js

```js
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
```

---

## 8️⃣ GitHub Actions Workflow

### .github/workflows/lunch.yml

```yml
name: Auto Lunch Booking

on:
  schedule:
    # Saturday to Thursday (UTC+6 = Bangladesh)
    - cron: '0 3 * * 0,1,2,3,4'
  workflow_dispatch:
  
permissions:
  contents: write   # 👈 REQUIRED to push PNG to main branch

jobs:
  book:
    if: vars.WORKFLOW_ENABLED == 'true'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          persist-credentials: true   # 👈 allow push

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browser
        run: npx playwright install chromium

      - name: Run lunch booking
        env:
          ULKA_AUTH_JSON: ${{ secrets.ULKA_AUTH_JSON }}
        run: node auto_lunch_book.js

      - name: Upload screenshot
        uses: actions/upload-artifact@v4
        with:
          name: booking-proof
          path: final-state.png

          # 🔽 NEW STEP: Commit PNG to main branch
      - name: Commit screenshot to main branch
        run: |
          if [ -f final-state.png ]; then
            git config user.name "github-actions"
            git config user.email "github-actions@github.com"
            git add final-state.png
            git commit -m "📸 Update lunch booking screenshot [auto]" || echo "No changes to commit"
            git push origin main
          else
            echo "❌ Screenshot not found"
          fi
```
## Upload the following file in repo:

- `package.json`
- `package-lock.json`
  
---

## Set WORKFLOW_ENABLED variable:

- Go to the settings ⚙️ tab.
- Enter **Secrets and variables** -> **Actions** -> **Variables**.
- **New repository variable**
- **Name: WORKFLOW_ENABLED** ; **Value: true**

## 🔐 Security Notes

- Repository must be **PRIVATE**
- Never commit `ulka-auth.json`
- Rotate session if login expires

---

## ✅ Done

Lunch booking will now run automatically via GitHub Actions.

---

## ⏸️ Pause the workflow for a certain amount of time manually (e.g. Ramadan month)

- Set the WORKFLOW_ENABLED variable ***false*** in the setting tab.
- Change it to ***true*** when the event is over.
