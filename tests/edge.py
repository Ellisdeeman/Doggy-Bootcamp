import asyncio, datetime, os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE=os.path.dirname(os.path.abspath(__file__))
URL="file://"+os.path.join(ROOT,"index.html")
SHOTS=os.path.join(HERE,"screenshots")
async def run(b, offset, age, label):
    page=await b.new_page(viewport={"width":390,"height":844}); errs=[]
    page.on("pageerror", lambda e: errs.append(str(e))); page.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    await page.goto(URL)
    await page.fill("#f-name","<b>Rex</b>"); await page.click(f"[data-act=age][data-v={age}]")
    await page.fill("#f-start",(datetime.date.today()+datetime.timedelta(days=offset)).isoformat()); await page.click("[data-act=onb-save]")
    h1=await page.locator(".day-hero h1").inner_text(); chips=await page.locator(".day-hero .chips").inner_text()
    ban=await page.locator(".banner").all_inner_texts()
    for r in ["program","progress","skills","settings","today"]:
        await page.click(f".nav [data-r={r}]")
    await page.click("[data-act=prev]:not([disabled]), [data-act=next]:not([disabled]) >> nth=0")
    os.makedirs(SHOTS, exist_ok=True)
    await page.screenshot(path=os.path.join(SHOTS, f"edge-{label}.png"))
    print(label, "|", h1, "|", chips.replace("\n"," "), "|", [x[:70] for x in ban], "| errs:", errs)
    await page.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b, 5, "puppy", "future")
        await run(b, -60, "senior", "finished")
        await run(b, 0, "adult", "today")
        await b.close()
asyncio.run(main())
