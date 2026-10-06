import asyncio, os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); page=await b.new_page(viewport={"width":390,"height":844})
        await page.goto("file://"+os.path.join(ROOT,"index.html"))
        await page.fill("#f-name","Biscuit"); await page.click("[data-act=age][data-v=adolescent]"); await page.click("[data-act=onb-save]")
        await page.click(".nav [data-r=program]")
        print(await page.locator(".day-row").count()); await page.wait_for_timeout(300); print(await page.locator(".day-row").count())
        await b.close()
asyncio.run(main())
