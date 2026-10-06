import asyncio, datetime, json, os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE=os.path.dirname(os.path.abspath(__file__))
URL="file://"+os.path.join(ROOT,"index.html")
S=os.path.join(HERE,"screenshots")
os.makedirs(S, exist_ok=True)
today=datetime.date.today()
async def setup(page):
    await page.goto(URL)
    await page.screenshot(path=os.path.join(S,"onboarding.png"))
    await page.fill("#f-name","Biscuit"); await page.click("[data-act=age][data-v=adolescent]")
    await page.fill("#f-breed","Golden Retriever mix"); await page.fill("#f-start",(today-datetime.timedelta(days=3)).isoformat())
    await page.click("[data-act=onb-save]")
    await page.click("[data-act=sess][data-i='0']"); await page.click("[data-act=sess][data-i='1']")
    await page.click("[data-act=rate][data-v='3']")
    await page.fill("#notes","Biscuit loved the hand target! 8/10 touches from a foot away.")
    await page.wait_for_timeout(500)
    notes={3:"Eye contact got to 3 sec. Needed a quieter room in the afternoon.",2:"Fast head turns — even from the kitchen.",1:"Marker charged quickly. Head whips round on “Yes!”."}
    for d in (3,2,1):
        await page.click("[data-act=prev]")
        for i in range(await page.locator("[data-act=sess]").count()): await page.click(f"[data-act=sess][data-i='{i}']")
        await page.click(f"[data-act=rate][data-v='{2 if d==3 else 3}']")
        await page.fill("#notes",notes[d]); await page.wait_for_timeout(450)
    await page.click("[data-act=master][data-id=marker]")
    # simulate that days 1-3 were trained on their own calendar dates (for a realistic streak)
    await page.evaluate("""()=>{const k='pawsteps-dog-training-v1';const s=JSON.parse(localStorage.getItem(k));
      const pad=n=>String(n).padStart(2,'0');const f=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
      s.activity={};for(const n of [1,2,3,4]){const d=new Date();d.setDate(d.getDate()-(4-n));const ds=f(d);const r=s.days[n];
        r.sd=r.s.map(x=>x?ds:null);s.activity[ds]=r.s.filter(Boolean).length;}
      localStorage.setItem(k,JSON.stringify(s));}""")
    await page.goto(URL+"#today"); await page.reload(); await page.wait_for_timeout(300); await page.evaluate("window.scrollTo(0,0)")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,has_touch=True)
        page=await ctx.new_page(); errs=[]
        page.on("pageerror", lambda e: errs.append(str(e))); page.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        await setup(page)
        await page.screenshot(path=f"{S}/phone-today.png")
        await page.screenshot(path=os.path.join(S,"phone-today-full.png"), full_page=True)
        await page.click(".nav [data-r=progress]"); await page.wait_for_timeout(200)
        await page.screenshot(path=f"{S}/phone-progress.png")
        await page.screenshot(path=os.path.join(S,"phone-progress-full.png"), full_page=True)
        await page.click(".nav [data-r=program]"); await page.wait_for_timeout(200)
        await page.screenshot(path=f"{S}/phone-program.png")
        await page.screenshot(path=os.path.join(S,"phone-program-full.png"), full_page=True)
        await page.click(".nav [data-r=skills]"); await page.click(".skill-card[data-id=recall] summary"); await page.wait_for_timeout(200)
        await page.screenshot(path=os.path.join(S,"phone-skills.png"))
        await page.click(".nav [data-r=settings]"); await page.wait_for_timeout(200)
        await page.screenshot(path=os.path.join(S,"phone-settings-full.png"), full_page=True)
        state=await page.evaluate("localStorage.getItem('pawsteps-dog-training-v1')")
        ctx2=await b.new_context(viewport={"width":1280,"height":800})
        p2=await ctx2.new_page(); p2.on("pageerror", lambda e: errs.append(str(e)))
        await p2.goto(URL); await p2.evaluate(f"localStorage.setItem('pawsteps-dog-training-v1', {json.dumps(state)})")
        await p2.goto(URL+"#today"); await p2.reload(); await p2.wait_for_timeout(300)
        await p2.screenshot(path=f"{S}/desktop-today.png")
        await p2.screenshot(path=os.path.join(S,"desktop-today-full.png"), full_page=True)
        await p2.click(".topnav [data-r=progress]"); await p2.wait_for_timeout(200)
        await p2.screenshot(path=os.path.join(S,"desktop-progress.png"), full_page=True)
        print("errors:",errs); await b.close()
asyncio.run(main())
