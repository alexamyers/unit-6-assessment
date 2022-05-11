
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})


test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})


test('Bots are generated when Draw button is clicked', async () => {
    const drawBtn = await driver.findElement(By.id('draw'))
    await drawBtn.click()
    await driver.sleep(300)

    const botSelection = await driver.findElement(By.id('choices'))
    expect(await botSelection).toBeTruthy();
})

test('When Add to Duo button is clicked that bot is moved to players duo', async () => {
    const drawBtn = await driver.findElement(By.id('draw'))
    await drawBtn.click()
    await driver.sleep(300)

    const addToDuo = await driver.findElement(By.xpath('(//*[@class="bot-btn"])'))
    await addToDuo.click()
    await driver.sleep(1000)

    const playerDuo = await driver.findElement(By.id('player-duo'))
    expect(await playerDuo).toBeDefined()
})