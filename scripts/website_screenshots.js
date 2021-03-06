const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.setViewport({ width: 1920, height: 1080 })
  await page.goto('http://localhost:16326')

  await page.click('#theme_select')
  await connectWithServer(page)
  await removeSnackbar(page)
  await clickToNavigateAndScreenshot(page, '#navbar_home', 'screenshot_0_home_white.jpg')
  await page.click('#theme_select')
  await clickToNavigateAndScreenshot(page, '#navbar_nodes', 'screenshot_1_nodes.jpg')
  await clickToNavigateAndScreenshot(page, '#navbar_indices', 'screenshot_2_indices.jpg')
  await clickToNavigateAndScreenshot(page, ['button[title="Options"]', '#app > div.v-menu__content.theme--dark.menuable__content__active > div > div:nth-child(2) > div.v-list-item__content > div'], 'screenshot_3_index.jpg')
  await page.reload()
  await page.click('#theme_select')
  await clickToNavigateAndScreenshot(page, '#navbar_search', 'screenshot_4_search_dark.jpg', async page => {
    await page.click('#index-pattern')
    await page.waitFor(50)
    await page.click('input[type="checkbox"]')
    await page.click('#search_submit')
    await page.waitFor(250)
    await page.click('th[aria-label="author_name: Not sorted. Activate to sort ascending."')
    await page.waitFor(250)
  })
  await clickToNavigateAndScreenshot(page, ['#navbar_query', '#navbar_query_rest'], 'screenshot_5_query_dark.jpg', async page => {
    await page.click('#execute_query')
    await page.waitFor(500)
  })
  await clickToNavigateAndScreenshot(page, '#navbar_snapshots', 'screenshot_6_snapshots_dark.jpg')
  await clickToNavigateAndScreenshot(page, '#navbar_utilities', 'screenshot_7_utilities_dark.jpg')

  await browser.close()
})()

async function connectWithServer (page) {
  await page.waitFor('#test_connection')
  await page.click('#test_connection')
  await page.waitFor('#connect:not(.v-btn--disabled)')
  await page.click('#connect')
  await page.waitFor(50)
}

async function removeSnackbar (page) {
  await page.waitFor('.v-snack')
  await page.evaluate(() => {
    let div = document.querySelector('.v-snack')
    div.parentNode.removeChild(div)
  })
}

async function clickToNavigateAndScreenshot (page, selectors, screenshot, callback) {
  if (Array.isArray(selectors)) {
    for (let selector of selectors) {
      await page.waitFor(200)
      await page.click(selector)
    }
  } else {
    await page.waitFor(200)
    await page.click(selectors)
  }

  await page.waitFor(500)
  if (typeof callback === 'function') await callback(page)
  await page.screenshot({ path: 'scripts/website_screenshots/' + screenshot })
}
