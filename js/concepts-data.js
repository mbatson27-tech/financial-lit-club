/* Single source of truth for the Key Concepts glossary.
   Loaded on every page (the site-wide search uses it) and rendered into
   collapsible cards on key-concepts.html by js/concepts.js.

   Fields:
     slug     - stable id used for deep links (key-concepts.html#slug)
     term     - display name
     group    - key into CONCEPT_GROUPS
     def      - plain-English definition (may contain simple inline HTML)
     why      - "Why it matters" sentence(s)
     example  - real-world example
     related  - array of slugs to cross-link
     formula  - optional { name, code, note, worked }
     html     - optional extra HTML appended to the card body (tables etc.)
*/

const CONCEPT_GROUPS = [
  { id: "foundations", name: "Economic Foundations", color: "navy" },
  { id: "gdp-cycle", name: "GDP & the Business Cycle", color: "teal" },
  { id: "policy", name: "Fiscal & Monetary Policy", color: "purple" },
  { id: "capitalism", name: "Modern Capitalism", color: "slate" },
  { id: "stocks", name: "Investing: Stocks", color: "gold" },
  { id: "bonds", name: "Investing: Bonds", color: "green" },
  { id: "accounting", name: "Accounting & Financial Statements", color: "maroon" },
  { id: "ratios", name: "Key Ratios", color: "blue" }
];

const CONCEPTS_DATA = [
  /* ============ 1. ECONOMIC FOUNDATIONS ============ */
  {
    slug: "economics",
    term: "Economics",
    group: "foundations",
    def: "How a society allocates scarce resources amidst unlimited human wants.",
    why: "Every economic question — what to produce, how, and for whom — comes back to scarcity. If resources were unlimited, there would be nothing to study.",
    example: "A school has one gym and two teams that want practice time. Deciding who gets the court, and when, is an economic decision.",
    related: ["opportunity-cost", "factors-of-production"]
  },
  {
    slug: "opportunity-cost",
    term: "Opportunity Cost",
    group: "foundations",
    def: "The second best alternative when you are confronted with two good choices — what you give up when you pick one option over another.",
    why: "Every choice has a hidden price tag: the value of the thing you did not choose. Thinking in opportunity costs is the core habit of economic reasoning.",
    example: "If you spend Saturday working a shift that pays $60, the opportunity cost might be the soccer game you missed. If you invest $1,000 in one stock, the opportunity cost is what a different investment would have earned.",
    related: ["economics", "ppf"]
  },
  {
    slug: "law-of-supply",
    term: "Law of Supply",
    group: "foundations",
    def: "All other things being equal, producers tend to produce more of a good or service if prices are rising and less if prices are falling. This law is tied to the profit motive.",
    why: "It explains the upward slope of the supply curve and why high prices attract new producers into a market.",
    example: "When lumber prices spiked in 2021, sawmills added shifts and ramped up output to capture the higher prices.",
    related: ["law-of-demand", "equilibrium"]
  },
  {
    slug: "law-of-demand",
    term: "Law of Demand",
    group: "foundations",
    def: "All other things being equal, consumers tend to buy more of a good or service if prices are falling and less if prices are rising. This law is tied to common sense.",
    why: "It explains the downward slope of the demand curve and why sales and discounts move product.",
    example: "When streaming services raise monthly prices, some subscribers cancel; when gas prices fall, people drive more.",
    related: ["law-of-supply", "equilibrium"]
  },
  {
    slug: "wealth-effect",
    term: "Wealth Effect",
    group: "foundations",
    def: "According to the economist Pigou, when people feel wealthier, they tend to spend more money. Conversely, when people feel less wealthy, they tend to spend less — and if enough people become fearful, a recession or bust may follow.",
    why: "It links asset prices (homes, stocks) to consumer spending, which is the largest part of GDP. Rising markets can feed booms; falling markets can deepen busts.",
    example: "In the mid-2000s housing boom, homeowners who saw their house values jump spent more freely; after 2008, the same households cut back sharply.",
    related: ["interest-rates", "booms-busts", "gdp"]
  },
  {
    slug: "interest-rates",
    term: "Interest Rates",
    group: "foundations",
    def: "The cost of borrowing money. When interest rates go up, asset prices (stocks, bonds, real estate, etc.) tend to fall over time. When interest rates fall, asset prices tend to rise over time.",
    why: "Interest rates are the gravity of finance: they set the price of borrowing for homes, cars, and businesses, and they anchor the value of every asset.",
    example: "When the Fed raised rates rapidly in 2022, 30-year mortgage rates roughly doubled and both stocks and bonds fell.",
    related: ["monetary-policy", "wealth-effect", "bonds-def"]
  },
  {
    slug: "productivity",
    term: "Productivity",
    group: "foundations",
    def: "The rate of output per unit of input — often measured by how much a worker produces in a given hour or day.",
    why: "Rising productivity is the main driver of higher wages and long-run economic growth: the more each worker produces, the more there is to go around.",
    example: "If you owned a beanbag company, you would measure how many beanbags a worker produces per hour. Key factors for an individual's productivity: (1) mental and physical health; (2) critical thinking skills; (3) the ability to learn, retain, integrate, and apply knowledge; (4) work ethic and grit; and (5) the ability to get along with and motivate others.",
    related: ["ppf", "factors-of-production", "technological-innovation"]
  },
  {
    slug: "ppf",
    term: "Production Possibilities Frontier (PPF)",
    group: "foundations",
    def: "A curve showing the maximum combinations of two goods an economy (or company, or person) can produce with its current resources. The goal is to be on the frontier and then push it outward via (1) better education and job training — improved \"human\" capital — and (2) technological innovation — improved \"physical\" capital.",
    why: "Points inside the curve mean resources are being wasted; points outside are unattainable today. The PPF turns scarcity and trade-offs into a picture.",
    example: "A country choosing between \"guns and butter\": producing more military goods means producing less of everything else. See the interactive version on the Graphs page.",
    related: ["productivity", "factors-of-production", "opportunity-cost"]
  },
  {
    slug: "factors-of-production",
    term: "Four Factors of Production",
    group: "foundations",
    def: "Land + Labor + Capital + Entrepreneurial Ability — the four inputs every economy combines to produce goods and services.",
    why: "An economy grows by using these four inputs more efficiently. If a country or company is inside its PPF, it is being inefficient with one or more of them.",
    example: "A food truck needs a parking spot (land), a cook (labor), the truck and grill (capital), and someone willing to take the risk and organize it all (entrepreneurial ability).",
    related: ["ppf", "productivity", "creative-destruction"]
  },
  {
    slug: "equilibrium",
    term: "Equilibrium",
    group: "foundations",
    def: "The point where supply meets demand, setting the market price and quantity. Rarely achieved perfectly in any market, but still useful as a theoretical roadmap for how an economy reaches a stable point.",
    why: "Equilibrium is the reference point for every supply-and-demand story: shifts in either curve move the market to a new equilibrium price and quantity.",
    example: "The economy is considered to be in a state of general equilibrium when GDP growth = 3–4%, inflation = 1–2%, and unemployment = 4–5%.",
    related: ["law-of-supply", "law-of-demand", "key-macro-variables"]
  },

  /* ============ 2. GDP & THE BUSINESS CYCLE ============ */
  {
    slug: "gdp",
    term: "Gross Domestic Product (GDP)",
    group: "gdp-cycle",
    def: "The total dollar value of all final goods and services produced within a country's border within a given time period (quarter or year). Intermediate goods are excluded to prevent double counting.",
    why: "GDP is the headline scorecard for an economy. Whether it is growing or shrinking drives jobs, incomes, elections, and markets.",
    example: "A $30 car tire sold to Ford is an intermediate good and is not counted; the finished $40,000 truck is counted once when sold.",
    related: ["expansion", "bc-contraction", "key-macro-variables"],
    formula: {
      name: "GDP Formula",
      code: "GDP = C + I + G + Xn",
      note: "Consumer Spending (C) + Business Investment (I) + Government Spending (G) + Net Exports (Xn = Exports − Imports).",
      worked: "Worked example: C = $14T, I = $4T, G = $5T, Exports = $3T, Imports = $4T → GDP = 14 + 4 + 5 + (3 − 4) = $22 trillion."
    }
  },
  {
    slug: "expansion",
    term: "Expansion",
    group: "gdp-cycle",
    def: "The phase of the business cycle when GDP (Gross Domestic Product = National Income) is growing.",
    why: "Expansions are when jobs are created, wages rise, and most investment gains happen. Knowing where you are in the cycle shapes policy and investing decisions.",
    example: "The U.S. expansion from 2009 to 2020 was the longest on record — nearly 11 years of uninterrupted GDP growth.",
    related: ["peak", "bc-contraction", "trough", "gdp"]
  },
  {
    slug: "peak",
    term: "Peak",
    group: "gdp-cycle",
    def: "The point where GDP reaches a high point and then falls. Note: a peak can only be identified in hindsight.",
    why: "Peaks mark the turning point from expansion to contraction. Because they are only visible after the fact, timing the market around them is notoriously difficult.",
    example: "February 2020 was later identified as a business-cycle peak — but no one could confirm it until the data arrived months afterward.",
    related: ["expansion", "bc-contraction", "booms-busts"]
  },
  {
    slug: "bc-contraction",
    term: "Contraction / Recession",
    group: "gdp-cycle",
    def: "A contraction occurs when GDP growth turns negative. A recession is typically defined by two consecutive quarters of GDP decline.",
    why: "Recessions mean rising unemployment and falling incomes — and they trigger the fiscal and monetary policy responses covered in this guide.",
    example: "The 2008–09 Great Recession: U.S. GDP shrank for four straight quarters and unemployment reached 10%.",
    related: ["recession-qa", "trough", "fiscal-policy", "monetary-policy"]
  },
  {
    slug: "trough",
    term: "Trough",
    group: "gdp-cycle",
    def: "The low point of the business cycle, where GDP decline bottoms out before growth resumes. Like the peak, it can only be identified in hindsight.",
    why: "The trough marks the start of recovery. Markets often turn up before the trough is officially recognized.",
    example: "April 2020 was later dated as a trough — the fastest, deepest trough in modern U.S. history.",
    related: ["bc-contraction", "expansion", "peak"]
  },
  {
    slug: "booms-busts",
    term: "Booms and Busts",
    group: "gdp-cycle",
    def: "Booms are often driven by excessive greed, while busts are often driven by excessive fear. Keynes's \"animal spirits\" — \"the spontaneous urge to action rather than inaction\" — helps explain the cycle, because it focuses on irrational patterns of human behavior.",
    why: "It is irrational to believe good (or bad) times will last forever, yet many people fall into these traps by letting their animal spirits guide their decisions.",
    example: "The late-1990s dot-com boom (greed: profitless companies valued in the billions) was followed by the 2000–02 bust (fear: the NASDAQ fell almost 80%).",
    related: ["wealth-effect", "peak", "trough", "boom-qa"]
  },
  {
    slug: "recession-qa",
    term: "What Happens During a Recession?",
    group: "gdp-cycle",
    def: "GDP goes down and becomes negative for at least two consecutive quarters → unemployment goes up → incomes go down and so does inflation (unless stagflation occurs).",
    why: "This chain reaction is the standard playbook policymakers respond to — and the test question you will most likely see.",
    example: "Typical responses: (1) The federal government may lower taxes and/or increase government spending (this almost always causes the national debt to rise). (2) The Federal Reserve often lowers interest rates and/or raises the money supply → over time this typically increases asset prices → people feel wealthier and spend more → the recession turns into an expansion. But if rates stay too low for too long, a boom — and possibly a bust — may follow.",
    related: ["bc-contraction", "fiscal-policy", "monetary-policy", "boom-qa"]
  },
  {
    slug: "boom-qa",
    term: "What Happens During an Economic Boom?",
    group: "gdp-cycle",
    def: "GDP grows above 4% for too long → unemployment falls below the natural rate (4–5%) for too long → inflation rises above 2% for too long.",
    why: "Booms feel great but sow the seeds of the next bust — which is why the Fed often acts to cool them down.",
    example: "Typical responses: (1) The federal government could raise taxes or cut spending — but rarely does, because politicians who raise taxes tend not to get reelected (e.g., George H.W. Bush in 1992). (2) Congressional inaction puts more pressure on the Federal Reserve. (3) The Fed often raises interest rates and lowers the money supply → asset prices fall → spending cools. But raising rates too high too fast can overcorrect into a recession.",
    related: ["booms-busts", "recession-qa", "monetary-policy"]
  },

  /* ============ 3. FISCAL & MONETARY POLICY ============ */
  {
    slug: "fiscal-policy",
    term: "Fiscal Policy",
    group: "policy",
    def: "The federal government's economic toolkit: raising and lowering <strong>taxes</strong>, and raising and lowering <strong>government spending</strong>.",
    why: "Fiscal policy is one of the two levers (with monetary policy) used to keep GDP growth, inflation, and unemployment in their target ranges.",
    example: "The 2020–21 pandemic stimulus checks and the 2017 tax cuts are both fiscal policy — and both added to the national debt.",
    related: ["monetary-policy", "recession-qa", "key-macro-variables"]
  },
  {
    slug: "monetary-policy",
    term: "Monetary Policy",
    group: "policy",
    def: "The Federal Reserve's toolkit: raising and lowering <strong>interest rates</strong> — primarily by setting a target for the <strong>federal funds rate</strong>, the overnight rate banks charge each other — and raising and lowering the <strong>money supply</strong> (via buying and selling bonds). The discount rate, which the Fed charges banks directly, is a secondary tool.",
    why: "The Fed's rate decisions ripple through every loan, mortgage, and asset price in the economy — usually faster and more predictably than fiscal policy.",
    example: "To fight inflation, the Fed raised its federal funds rate target from near 0% to over 5% between March 2022 and mid-2023.",
    related: ["interest-rates", "fiscal-policy", "inflation"]
  },
  {
    slug: "inflation",
    term: "Inflation",
    group: "policy",
    def: "A period of rising prices.",
    why: "Inflation quietly shrinks the purchasing power of every dollar you hold. The Fed targets roughly 2% — enough to grease the economy without eroding savings.",
    example: "In 2022, U.S. inflation peaked above 9% — the highest in 40 years — meaning a $100 grocery cart from a year earlier cost about $109.",
    related: ["deflation", "stagflation", "monetary-policy"]
  },
  {
    slug: "deflation",
    term: "Deflation",
    group: "policy",
    def: "A period of falling prices.",
    why: "Falling prices sound nice but can be dangerous: consumers delay purchases, businesses cut jobs, and debts get harder to repay — a downward spiral.",
    example: "Japan battled deflation through much of the 1990s and 2000s, and its economy stagnated for decades.",
    related: ["inflation", "bc-contraction"]
  },
  {
    slug: "stagflation",
    term: "Stagflation",
    group: "policy",
    def: "A period of negative (or sluggish) GDP growth accompanied by both rising inflation and rising unemployment. This often happens after a \"supply shock\" moves the supply curve to the left.",
    why: "Stagflation is the policymaker's nightmare: fighting inflation (raising rates) makes unemployment worse, and fighting unemployment (cutting rates) makes inflation worse.",
    example: "The OPEC Oil Shock of the 1970s and Covid (2020–22) both produced stagflationary pressure. See the Supply Shock scenario on the Graphs page.",
    related: ["inflation", "recession-qa", "key-macro-variables"]
  },
  {
    slug: "key-macro-variables",
    term: "Key Macroeconomic Variables",
    group: "policy",
    def: "The three numbers fiscal and monetary policy try to keep in range: GDP growth, unemployment, and inflation. When all three are in range, the economy approximates general equilibrium.",
    why: "Almost every policy debate — rate hikes, stimulus, tax cuts — is an argument about getting these three numbers back into their target ranges.",
    example: "",
    related: ["gdp", "inflation", "equilibrium"],
    html:
      '<div class="table-wrap"><table class="data-table"><caption>Key Macroeconomic Variables</caption>' +
      '<thead><tr><th scope="col">Variable</th><th scope="col">Target Range</th><th scope="col">Current Reading (June 30, 2026)</th></tr></thead>' +
      '<tbody>' +
      '<tr><th scope="row">GDP Growth</th><td>3–4%</td><td><span class="status-low">1.5% (Low)</span></td></tr>' +
      '<tr><th scope="row">Unemployment</th><td>4–5%</td><td><span class="status-good">4.3% (Good)</span></td></tr>' +
      '<tr><th scope="row">Inflation</th><td>1–2%</td><td><span class="status-high">3.5% (High)</span></td></tr>' +
      '</tbody></table></div>' +
      '<div class="note-box">Normally, during a boom: GDP growth above 4%, unemployment below 4%, inflation well above 2%. During a bust: negative GDP growth, rising unemployment, falling inflation.</div>'
  },

  /* ============ 4. MODERN CAPITALISM ============ */
  {
    slug: "creative-destruction",
    term: "Creative Destruction",
    group: "capitalism",
    def: "The process where a government allows old, inefficient businesses and industries to die off (by no longer protecting them with tariffs) so the four factors of production can be reallocated to more efficient uses. Clever entrepreneurs force creative destruction by spotting inefficiencies and exploiting them — including with tools like AI.",
    why: "Coined by Joseph Schumpeter, this is the engine of capitalism: painful in the short run for displaced workers and firms, but the source of long-run growth and rising living standards.",
    example: "The U.S. allowed old, large steel mills to go bankrupt in the 1970s–80s, which led entrepreneurs to build newer, smaller \"MiniMills\" that used the latest technology to compete with Japan and Korea.",
    related: ["technological-innovation", "globalization", "factors-of-production"]
  },
  {
    slug: "globalization",
    term: "Globalization",
    group: "capitalism",
    def: "The process through which virtually all countries can be part of an integrated worldwide economic system, where countries and companies produce and sell goods and services based on their comparative advantages.",
    why: "Globalization lowered prices and lifted hundreds of millions out of poverty, but it also hit workers in industries that moved overseas — one of the defining economic tensions of our time.",
    example: "A country with low labor costs tends to produce lower-value goods such as clothes, shoes, or produce, while a richer country produces higher-value goods such as cars, planes, and advanced technology (e.g., Pixar movies).",
    related: ["creative-destruction", "technological-innovation"]
  },
  {
    slug: "technological-innovation",
    term: "Technological Innovation",
    group: "capitalism",
    def: "The process through which a new or improved product is developed using cutting-edge technology — including robots that have replaced (and will continue to replace) low-skilled factory workers. Advances in artificial intelligence are accelerating this trend.",
    why: "Technology raises productivity and creates whole new industries, but it also disrupts existing jobs — often at the same time as globalization.",
    example: "By the late 1970s, large U.S. manufacturers were spending billions per year to automate production. Factory workers and unions were hit by globalization and automation simultaneously.",
    related: ["creative-destruction", "productivity", "globalization"]
  },

  /* ============ 5. INVESTING: STOCKS ============ */
  {
    slug: "investment-capital",
    term: "Investment Capital",
    group: "stocks",
    def: "Money that individuals (and companies) earn and save for investments — real estate, stocks, bonds, certificates of deposit, businesses, and so on.",
    why: "Capital you invest can compound and grow; capital you spend is gone. Building investment capital early is the foundation of financial independence.",
    example: "Saving $200 a month from a part-time job gives you $2,400 a year of investment capital to put to work.",
    related: ["equity-investment", "roe"]
  },
  {
    slug: "equity-investment",
    term: "Equity Investment",
    group: "stocks",
    def: "Buying shares (stock) in a company. The terms \"shares\" and \"stocks\" are often used interchangeably.",
    why: "Equity makes you a part-owner: you share in profits and growth, but you also bear the risk of losses.",
    example: "Buying one share of Apple makes you a part-owner of Apple — entitled to any dividends and a vote at shareholder meetings.",
    related: ["stocks-shares", "common-stock", "limited-liability"]
  },
  {
    slug: "primary-markets",
    term: "Primary Markets",
    group: "stocks",
    def: "Where companies raise money by selling shares or issuing bonds (e.g., Initial Public Offerings and secondary offerings). Owning shares is an equity investment; buying a bond makes you a creditor who must be repaid on the bond's maturity date.",
    why: "The primary market is where investment money actually reaches companies to fund growth — every share you trade later started life here.",
    example: "When Airbnb went public in December 2020, the shares it sold in the IPO raised about $3.5 billion for the company — that was a primary-market transaction.",
    related: ["secondary-markets", "ipo", "bonds-def"]
  },
  {
    slug: "secondary-markets",
    term: "Secondary Markets",
    group: "stocks",
    def: "Where shares and bonds are traded between individuals (or companies). The proceeds of the sale go to the seller, not to the company (or government) that originally issued them.",
    why: "Secondary markets provide liquidity — the confidence that you can sell when you need to — which is what makes people willing to invest in the first place.",
    example: "When you buy Microsoft stock through a brokerage app, you are buying it from another investor on the secondary market; Microsoft receives nothing from that trade.",
    related: ["primary-markets", "nyse", "nasdaq"]
  },
  {
    slug: "stocks-shares",
    term: "Stocks = Shares",
    group: "stocks",
    def: "Owning shares in a company is an equity investment. Publicly traded companies have their shares traded in the stock market (e.g., NYSE, NASDAQ) — a stock market is where shares are issued and then bought and sold in the secondary market.",
    why: "Understanding that a stock is a slice of ownership — not a lottery ticket — is the first step to investing like an owner instead of a gambler.",
    example: "Apple has roughly 15 billion shares outstanding; owning 15 of them means you own about one-billionth of the company.",
    related: ["equity-investment", "common-stock", "secondary-markets"]
  },
  {
    slug: "limited-liability",
    term: "Limited Liability",
    group: "stocks",
    def: "When you invest in a company, you can only lose the full amount of your investment — you cannot be sued for additional funds if the company (or its executives) breaks the law.",
    why: "Limited liability is what makes stock investing possible for ordinary people: your downside is capped at what you put in.",
    example: "Shareholders of a company that goes bankrupt may lose their entire investment, but creditors cannot come after the shareholders' houses or savings.",
    related: ["equity-investment", "stocks-shares"]
  },
  {
    slug: "growth-stocks",
    term: "Growth Stocks",
    group: "stocks",
    def: "Companies that rarely pay a dividend because they typically reinvest their profits (and cash flow) back into the business via technological or other innovation that provides an ongoing comparative advantage.",
    why: "Growth stocks offer higher potential returns in exchange for higher volatility and no dividend income along the way.",
    example: "Amazon has never paid a dividend — for decades it poured every dollar back into warehouses, logistics, and new businesses like AWS.",
    related: ["value-stocks", "dividends", "technological-innovation"]
  },
  {
    slug: "value-stocks",
    term: "Value Stocks",
    group: "stocks",
    def: "Companies with steady profits and cash flows. They typically pay a dividend because their period of high growth is over — the dividend keeps investors interested in holding the shares.",
    why: "Value stocks tend to be steadier and pay you to wait, making them a counterweight to growth stocks in a portfolio.",
    example: "Coca-Cola has paid — and increased — its dividend for over 60 consecutive years.",
    related: ["growth-stocks", "dividends", "blue-chip-stocks"]
  },
  {
    slug: "common-stock",
    term: "Common Stock",
    group: "stocks",
    def: "What most people buy (vs. preferred stock). Common stock is riskier and more volatile than preferred stock, largely because its price moves up and down more frequently. It may or may not pay a dividend.",
    why: "Over long periods, common stock has provided a much higher return than preferred stock, bonds, or cash — the reward for accepting more risk.",
    example: "When you buy a share of Tesla or Nike in a brokerage app, you are buying common stock.",
    related: ["preferred-stock", "stocks-shares", "roe"]
  },
  {
    slug: "preferred-stock",
    term: "Preferred Stock",
    group: "stocks",
    def: "Less risky than common stock: it almost always pays a dividend, and those dividends are almost always paid before dividends on common stock. In a bankruptcy, preferred shareholders are paid before common shareholders.",
    why: "Preferred stock sits between bonds and common stock: steadier income than common shares, but less upside if the company thrives.",
    example: "Warren Buffett's Berkshire Hathaway bought $5 billion of Bank of America preferred stock in 2011, locking in a 6% dividend.",
    related: ["common-stock", "dividends", "bond-features"]
  },
  {
    slug: "dividends",
    term: "Dividends",
    group: "stocks",
    def: "A payment, usually in cash (but sometimes in additional stock), that attracts investors looking for a higher return. The dividend yield is the annual dividend divided by the stock price at purchase.",
    why: "Dividends are the portion of your return you actually receive in hand — historically a large share of the stock market's total return.",
    example: "If you purchased McDonald's stock at $100/share and it paid a quarterly dividend of $0.50, your dividend yield = ($0.50 × 4) ÷ $100 = <strong>2.0%</strong>.",
    related: ["dividend-yield", "value-stocks", "preferred-stock"]
  },
  {
    slug: "blue-chip-stocks",
    term: "Blue Chip Stocks",
    group: "stocks",
    def: "Generally the largest, most profitable companies, often considered \"household\" names. There is no official list, but today Apple, Microsoft, Google, Amazon, and Nvidia would certainly be on it.",
    why: "Blue chips anchor major indexes like the Dow and are often the core holdings of long-term portfolios because of their stability and staying power.",
    example: "The term comes from poker, where blue chips are the highest-value chips on the table.",
    related: ["dow-jones", "sp500", "value-stocks"]
  },
  {
    slug: "ipo",
    term: "Public Company / IPO / Secondary Offering",
    group: "stocks",
    def: "A public company is one whose shares are publicly traded on a stock exchange. An Initial Public Offering (IPO) occurs when a company sells shares to the public for the first time. A <strong>secondary offering</strong> occurs when an already-public company sells additional shares to raise more money.",
    why: "Going public gives companies access to huge pools of capital — and gives everyday investors the chance to own a piece of them.",
    example: "Meta (Facebook) held its IPO in 2012. Tesla, already public, has used secondary offerings several times — including raising about $5 billion in late 2020 by selling additional shares.",
    related: ["primary-markets", "nyse", "nasdaq"]
  },
  {
    slug: "nyse",
    term: "New York Stock Exchange (NYSE)",
    group: "stocks",
    def: "The most prestigious stock exchange in the United States (and many would say the world). Its roots date back to 1792.",
    why: "Listing on the NYSE signals size and credibility; it remains the world's largest exchange by the total value of listed companies.",
    example: "It began with 24 brokers signing the Buttonwood Agreement under a tree on Wall Street in 1792.",
    related: ["nasdaq", "dow-jones", "secondary-markets"]
  },
  {
    slug: "dow-jones",
    term: "Dow Jones Industrial Average",
    group: "stocks",
    def: "A weighted index of thirty high-profile, \"Blue Chip\" companies.",
    why: "The Dow is the oldest and most quoted shorthand for \"the market,\" even though its 30 companies make it far narrower than the S&P 500.",
    example: "\"The Dow dropped 500 points today\" is usually the first market headline you will hear on the news.",
    related: ["sp500", "blue-chip-stocks", "nyse"]
  },
  {
    slug: "nasdaq",
    term: "NASDAQ",
    group: "stocks",
    def: "The world's first electronic trading market, founded in 1971 — about 200 years after the NYSE. Most high-tech companies that have gone public list their shares on NASDAQ.",
    why: "The NASDAQ's tech-heavy listings make its index a barometer for the technology sector specifically.",
    example: "Apple, Microsoft, Nvidia, Amazon, and Google all list on NASDAQ.",
    related: ["nyse", "ipo", "secondary-markets"]
  },
  {
    slug: "sp500",
    term: "S&P 500 Index",
    group: "stocks",
    def: "An index of 500 high-profile companies. It is a better barometer for the overall health of the U.S. economy than the Dow Jones because it contains such a wide variety of companies.",
    why: "The S&P 500 is the benchmark most professional investors are measured against — and the index most retirement funds quietly track.",
    example: "An S&P 500 index fund lets you own a slice of all 500 companies in a single purchase.",
    related: ["dow-jones", "roe", "blue-chip-stocks"]
  },
  {
    slug: "roe",
    term: "Return on Equity / Return on Investment (ROE / ROI)",
    group: "stocks",
    def: "The profit or loss made on an investment over a given time period — usually one year — expressed as a percentage.",
    why: "Return is the whole point of investing; comparing returns across assets (stocks vs. bonds vs. cash) is how you decide where to put capital.",
    example: "Between 1926 and 2025, a basket of stocks has averaged roughly a 10% annual return, a basket of bonds 4–5%, and short-term U.S. Treasury Bills about 3%.",
    related: ["investment-capital", "sp500", "capital-gain-loss"]
  },
  {
    slug: "paper-gain-loss",
    term: "Paper Gain / Paper Loss",
    group: "stocks",
    def: "A paper gain is when a stock you own rises in value but you have not sold it yet. A paper loss is when it declines in value but you have not sold it yet.",
    why: "Paper gains and losses are not real until you sell — a crucial distinction for both taxes and investor psychology.",
    example: "If your $1,000 of stock is now worth $1,300, you have a $300 paper gain; no tax is owed until you actually sell.",
    related: ["capital-gain-loss", "roe"]
  },
  {
    slug: "capital-gain-loss",
    term: "Capital Gain / Capital Loss",
    group: "stocks",
    def: "A capital gain occurs after you sell a stock at a profit (you then owe capital gains tax). A capital loss occurs after you sell a stock at a loss — the loss is a <strong>tax deduction</strong> that can offset capital gains (and, in the U.S., up to $3,000 of ordinary income per year).",
    why: "Realizing gains and losses has tax consequences, which is why investors often time their sales around them (\"tax-loss harvesting\").",
    example: "Sell a stock for a $2,000 profit and a different stock for a $1,500 loss in the same year, and you only owe capital gains tax on the net $500.",
    related: ["paper-gain-loss", "roe"]
  },

  /* ============ 6. INVESTING: BONDS ============ */
  {
    slug: "bonds-def",
    term: "Bonds",
    group: "bonds",
    def: "A debt instrument issued by a company (or government) that, like a bank loan, must be paid back by a certain date in the future. A bond market is where bonds are issued and then bought and sold.",
    why: "Bonds are the quieter half of investing: steadier than stocks, they provide income and balance in a portfolio — and the bond market is actually larger than the stock market.",
    example: "The U.S. Treasury market — government bonds — is the largest and most important financial market in the world.",
    related: ["bond-features", "interest-rates", "preferred-stock"]
  },
  {
    slug: "bond-features",
    term: "Bonds: Risks & Features",
    group: "bonds",
    def: "Unlike purchasing stock (an equity investment), buying a bond means purchasing a piece of debt that must be repaid on a certain date. Bondholders receive interest payments, often every six months. Every bond has three distinct features: (1) an amount to be repaid; (2) a maturity date; and (3) an interest rate.",
    why: "Two key risks: <strong>credit risk</strong> — the issuer will not pay you back — and <strong>interest rate risk</strong> — rates rise while you hold the bond, pushing its market value down.",
    example: "If you hold a 10-year bond paying 2% and new bonds pay 5%, no one will pay full price for yours — its resale value falls (interest rate risk in action).",
    related: ["bonds-def", "interest-rates", "primary-markets"]
  },

  /* ============ 7. ACCOUNTING & FINANCIAL STATEMENTS ============ */
  {
    slug: "balance-sheet",
    term: "Balance Sheet",
    group: "accounting",
    def: "A snapshot of what a company owns (assets), what it owes (liabilities), and the difference (equity) at a single point in time.",
    why: "The balance sheet reveals a company's financial strength: how much debt it carries, how much cash it holds, and what shareholders actually own.",
    example: "",
    related: ["assets", "liabilities", "equity-accounting", "income-statement"],
    formula: {
      name: "The Basic Accounting Equation",
      code: "Assets = Liabilities + Equity",
      note: "The two sides must always balance — hence the name.",
      worked: "Worked example: a company with $10M in assets and $6M in liabilities must have $4M in equity (10 = 6 + 4)."
    }
  },
  {
    slug: "assets",
    term: "Assets (Something You Own)",
    group: "accounting",
    def: "<strong>Current Assets:</strong> Cash, Accounts Receivable, Inventory.<br><strong>Fixed Assets:</strong> Plant, Property &amp; Equipment (PP&amp;E).<br><strong>Intangible (non-physical) Assets:</strong> Goodwill, Patents.",
    why: "Assets are the resources a company uses to generate profit — and the collateral creditors look to if things go wrong.",
    example: "For an airline: cash in the bank (current), its fleet of planes (fixed), and its landing-slot rights and brand (intangible).",
    related: ["balance-sheet", "liabilities", "equity-accounting"]
  },
  {
    slug: "liabilities",
    term: "Liabilities (Something You Owe)",
    group: "accounting",
    def: "<strong>Current Liabilities:</strong> Accounts Payable (employees, suppliers, etc.), short-term bank loans due within one year, and the portion of any loan or bond due within one year.<br><strong>Long-Term Liabilities:</strong> Long-term bank loans and the portion of a bond not due within one year.",
    why: "Liabilities must be paid regardless of how business is going — too many of them is what sinks companies in downturns.",
    example: "A $500M bond due in 8 years is a long-term liability; the interest payment due next month is a current liability.",
    related: ["balance-sheet", "assets", "financial-leverage"]
  },
  {
    slug: "equity-accounting",
    term: "Equity (= Net Worth)",
    group: "accounting",
    def: "The difference between assets and liabilities. It includes: Preferred Stock (less risky than common), Common Stock (what most people buy), and Retained Earnings (the cumulative total of all profits and losses).",
    why: "Equity is what would be left for shareholders if the company sold everything and paid every debt — the \"book value\" of ownership.",
    example: "Your personal net worth works the same way: everything you own minus everything you owe.",
    related: ["balance-sheet", "common-stock", "preferred-stock"]
  },
  {
    slug: "income-statement",
    term: "Income Statement",
    group: "accounting",
    def: "The statement showing a company's revenue and expenses over a period, stepping down from Revenue to Net Profit. There are four expense categories — Cost of Goods Sold, SG&amp;A, Interest Expense, and Tax Expense — and four profit categories: Gross Profit, Operating Profit, Pre-Tax Profit, and Net Profit.",
    why: "The income statement answers the most basic business question: is the company actually making money, and where along the way is it losing it?",
    example: "",
    related: ["balance-sheet", "cash-flow-statement", "eps"],
    html:
      '<div class="table-wrap"><table class="data-table step-down"><caption>Income Statement (Step-Down Format)</caption><tbody>' +
      '<tr><td class="label">Revenue (= Sales)</td><td></td></tr>' +
      '<tr><td class="less">Less: Cost of Goods Sold (COGS)</td><td></td></tr>' +
      '<tr class="subtotal"><td>Gross Profit</td><td></td></tr>' +
      '<tr><td class="less">Less: Selling, General &amp; Administrative Expenses (SG&amp;A)</td><td></td></tr>' +
      '<tr class="subtotal"><td>Operating Profit</td><td></td></tr>' +
      '<tr><td class="less">Less: Interest Expense</td><td></td></tr>' +
      '<tr class="subtotal"><td>Pre-Tax Profit</td><td></td></tr>' +
      '<tr><td class="less">Less: Taxes</td><td></td></tr>' +
      '<tr class="final"><td>Net Profit (= Net Earnings or Net Income)</td><td></td></tr>' +
      '</tbody></table></div>'
  },
  {
    slug: "cash-flow-statement",
    term: "Cash Flow Statement",
    group: "accounting",
    def: "Shows how much cash a company takes in, from what sources, and how it uses that cash. Uses include: (1) investing in PP&amp;E; (2) paying dividends, interest, or loan/bond principal; (3) purchasing other companies; (4) parking cash in stocks or bonds until it is needed for a large project.",
    why: "Profits are an opinion; cash is a fact. Companies fail when they run out of cash, not when accounting profit dips — which is why investors watch this statement closely.",
    example: "A fast-growing retailer can report profits yet burn cash buying inventory for new stores — the cash flow statement exposes that gap.",
    related: ["income-statement", "balance-sheet", "interest-coverage"]
  },

  /* ============ 8. KEY RATIOS ============ */
  {
    slug: "market-cap",
    term: "Market Capitalization",
    group: "ratios",
    def: "The total market value of a company's common shares.",
    why: "Market cap is how companies are sized and compared — \"large-cap\" vs. \"small-cap\" — and what headlines mean by \"a $3 trillion company.\"",
    example: "",
    related: ["eps", "pe-ratio", "financial-leverage"],
    formula: {
      name: "Market Capitalization (Market Value)",
      code: "Market Cap = Common Share Price × Common Shares Outstanding",
      note: "Common Shares Outstanding is typically found on the balance sheet.",
      worked: "Worked example: $100/share × 5,000,000 shares = a $500 million market cap."
    }
  },
  {
    slug: "eps",
    term: "Earnings Per Share (EPS)",
    group: "ratios",
    def: "The slice of a company's annual profit attributable to each common share. \"Earnings\" means the same as \"income\" and \"profits.\"",
    why: "EPS puts profits on a per-share basis so you can compare them to the share price — it is the denominator of the P/E ratio.",
    example: "",
    related: ["pe-ratio", "income-statement", "market-cap"],
    formula: {
      name: "Earnings Per Share (EPS)",
      code: "EPS = Annualized Net Earnings ÷ Common Shares Outstanding",
      note: "Use net earnings from the income statement.",
      worked: "Worked example: $10,000,000 of net earnings ÷ 5,000,000 shares = $2.00 EPS."
    }
  },
  {
    slug: "pe-ratio",
    term: "Price Earnings (P/E) Ratio",
    group: "ratios",
    def: "How many dollars investors pay for each dollar of a company's annual earnings.",
    why: "The P/E is the quickest gauge of how expensive a stock is relative to its profits — high P/Es price in high expected growth.",
    example: "",
    related: ["eps", "market-cap", "dividend-yield"],
    formula: {
      name: "Price Earnings (P/E) Ratio",
      code: "P/E = Common Share Price ÷ EPS",
      note: "The historical average for S&P 500 companies is roughly 19 since 1971 — for every dollar of earnings, you're paying $19.",
      worked: "Worked example: a $38 share price ÷ $2.00 EPS = a P/E of 19x."
    }
  },
  {
    slug: "dividend-yield",
    term: "Dividend Yield",
    group: "ratios",
    def: "The annual dividend expressed as a percentage of the share price — the cash return you earn just for holding the stock.",
    why: "Yield lets you compare a stock's cash payout to alternatives such as a savings account or a U.S. Treasury Bill, Note, or Bond.",
    example: "",
    related: ["dividends", "value-stocks", "pe-ratio"],
    formula: {
      name: "Dividend Yield",
      code: "Dividend Yield = Annualized Dividend ÷ Common Share Price",
      note: "Compare this yield to a comparable company's yield or to what you could earn from savings or Treasuries.",
      worked: "Worked example: a $0.50 quarterly dividend = $2.00/year; $2.00 ÷ $100 share price = a 2.0% yield."
    }
  },
  {
    slug: "financial-leverage",
    term: "Financial Leverage",
    group: "ratios",
    def: "How much debt a company carries relative to its market value.",
    why: "Leverage amplifies both gains and losses: a little debt boosts returns, too much turns a slowdown into a bankruptcy.",
    example: "",
    related: ["liabilities", "interest-coverage", "market-cap"],
    formula: {
      name: "Financial Leverage",
      code: "Leverage = Total Debt ÷ Market Capitalization",
      note: "Stated as a percentage. Typically, the lower the number, the better.",
      worked: "Worked example: $100M of debt ÷ $500M market cap = 20% leverage."
    }
  },
  {
    slug: "interest-coverage",
    term: "Interest Coverage Ratio",
    group: "ratios",
    def: "How many times over a company's cash flow can cover its annual interest bill.",
    why: "It measures the margin of safety on a company's debt: the higher the coverage, the less likely a rough year forces a default.",
    example: "",
    related: ["financial-leverage", "cash-flow-statement", "bonds-def"],
    formula: {
      name: "Interest Coverage Ratio",
      code: "Interest Coverage = EBITDA ÷ Interest Expense",
      note: "EBITDA = Cash Flow = Net Earnings before Interest, Taxes, Depreciation & Amortization. 4x or higher is good to very good; above 8–10x is spectacular.",
      worked: "Worked example: $40M EBITDA ÷ $5M interest expense = 8x coverage."
    }
  }
];

/* Index consumed by the site-wide search in js/common.js. */
const KEY_CONCEPTS_INDEX = CONCEPTS_DATA.map(function (c) {
  const group = CONCEPT_GROUPS.find(function (g) { return g.id === c.group; });
  return { term: c.term, slug: c.slug, section: group ? group.name : "" };
});
