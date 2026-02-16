@echo off
REM Blog Seeder with Full Content Sections
REM This will create blogs with multiple sections and conclusion

SET API_URL=http://161.97.167.73:8001/api/blogs
SET TOKEN=3^|xDlh7Xvc7pPYHyOYNuAMmNbyQhzKaQQRsbXRmgPL9fb7b468
SET LOGO_PATH=c:\Users\TOSHIBA\OneDrive\Desktop\jamjamTrek\jamjam\public\logo.png

echo.
echo ========================================
echo   Blog Seeder with Content Sections
echo ========================================
echo.

echo [1/6] Creating Essential Trekking Tips blog...
curl -X POST "%API_URL%" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Accept: application/json" ^
  -F "title=Essential Trekking Tips for First-Time Visitors to Nepal" ^
  -F "subtitle=Everything you need to know before your first Himalayan adventure" ^
  -F "description=Planning your first trek in Nepal? This comprehensive guide covers everything from choosing the right trek to packing essentials, acclimatization tips, and cultural etiquette. Learn how to prepare physically and mentally for the adventure of a lifetime in the Himalayas." ^
  -F "excerpt=Discover essential tips and tricks for first-time trekkers in Nepal, from choosing the right season to packing smart." ^
  -F "author=JamJam Trek Team" ^
  -F "slug=essential-trekking-tips-first-time-nepal-full" ^
  -F "is_active=1" ^
  -F "image=@%LOGO_PATH%" ^
  -F "content[0][heading]=Choose the Right Trek" ^
  -F "content[0][paragraph]=Nepal offers treks for all fitness levels. Beginners should consider shorter treks like Poon Hill (4-5 days) or Ghorepani, while experienced trekkers can tackle Everest Base Camp or Annapurna Circuit. Research altitude gains, daily walking hours, and accommodation types before booking." ^
  -F "content[1][heading]=Physical Preparation" ^
  -F "content[1][paragraph]=Start training at least 2-3 months before your trek. Focus on cardiovascular exercises like hiking, running, or cycling. Include strength training for legs and core. Practice walking with a loaded backpack to simulate trekking conditions." ^
  -F "content[2][heading]=Acclimatization is Key" ^
  -F "content[2][paragraph]=Altitude sickness is serious. Follow the golden rule: climb high, sleep low. Take rest days at key altitudes. Stay hydrated, avoid alcohol, and listen to your body. Descend immediately if symptoms worsen." ^
  -F "content[3][heading]=Packing Smart" ^
  -F "content[3][paragraph]=Layer your clothing for temperature changes. Bring a good quality sleeping bag, trekking poles, and broken-in boots. Don't forget sunscreen, water purification tablets, and a basic first aid kit. Pack light but don't compromise on essentials." ^
  -F "content[4][heading]=Cultural Respect" ^
  -F "content[4][paragraph]=Learn basic Nepali phrases like Namaste and Dhanyabad. Dress modestly, especially in villages. Ask permission before photographing people. Remove shoes before entering temples. Respect local customs and traditions." ^
  -F "conclusion=Trekking in Nepal is a life-changing experience that requires proper preparation and respect for the mountains and local culture. By following these essential tips, you'll be well-prepared for an unforgettable Himalayan adventure. Remember, the journey is as important as the destination."
echo.
timeout /t 1 /nobreak >nul

echo [2/6] Creating ABC vs EBC blog...
curl -X POST "%API_URL%" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Accept: application/json" ^
  -F "title=Annapurna Base Camp vs Everest Base Camp: Which Trek is Right for You?" ^
  -F "subtitle=A detailed comparison of Nepal's two most popular treks" ^
  -F "description=Can't decide between Annapurna Base Camp and Everest Base Camp? This in-depth comparison explores the differences in difficulty, scenery, altitude, cost, and cultural experiences." ^
  -F "excerpt=Compare the two most iconic treks in Nepal and find out which one suits your adventure style and fitness level." ^
  -F "author=Rajesh Sharma" ^
  -F "slug=annapurna-vs-everest-base-camp-full" ^
  -F "is_active=1" ^
  -F "image=@%LOGO_PATH%" ^
  -F "content[0][heading]=Difficulty and Duration" ^
  -F "content[0][paragraph]=ABC takes 7-10 days with a maximum altitude of 4,130m, making it more accessible for beginners. EBC requires 12-14 days and reaches 5,364m, demanding better fitness and acclimatization. ABC has gentler altitude gains, while EBC involves steeper climbs and longer daily walks." ^
  -F "content[1][heading]=Scenery and Views" ^
  -F "content[1][paragraph]=ABC offers 360-degree mountain views surrounded by peaks like Annapurna I, Machapuchare, and Hiunchuli. The trail passes through diverse landscapes from subtropical forests to alpine meadows. EBC provides iconic views of Everest, Lhotse, and Nuptse, with the dramatic Khumbu Icefall. The Sherpa villages and Buddhist monasteries add cultural richness." ^
  -F "content[2][heading]=Cost Comparison" ^
  -F "content[2][paragraph]=ABC is generally more budget-friendly, costing $500-800 for a guided trek. Permits are cheaper and flights to Pokhara are less expensive. EBC costs $1,200-1,800 due to higher permit fees, expensive flights to Lukla, and pricier accommodation at higher altitudes." ^
  -F "content[3][heading]=Accessibility" ^
  -F "content[3][paragraph]=ABC starts with a short drive from Pokhara, making it easily accessible. EBC requires a thrilling flight to Lukla, which can be delayed by weather. ABC has more teahouses and better facilities, while EBC is more remote with basic amenities at higher elevations." ^
  -F "conclusion=Both treks offer incredible experiences. Choose ABC if you're a beginner, have limited time, or prefer a more affordable option with diverse scenery. Choose EBC if you're experienced, dream of standing at the base of the world's highest mountain, and don't mind the higher cost and longer duration. Either way, you'll create memories that last a lifetime."
echo.
timeout /t 1 /nobreak >nul

echo [3/6] Creating Best Time to Trek blog...
curl -X POST "%API_URL%" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Accept: application/json" ^
  -F "title=Best Time to Trek in Nepal: A Month-by-Month Guide" ^
  -F "subtitle=Plan your trek with our comprehensive seasonal guide" ^
  -F "description=Timing is everything when it comes to trekking in Nepal. This detailed guide covers weather patterns, trail conditions, and crowd levels throughout the year." ^
  -F "excerpt=Find out the best months to trek in Nepal based on weather, crowds, and your personal preferences." ^
  -F "author=Maya Gurung" ^
  -F "slug=best-time-to-trek-nepal-full" ^
  -F "is_active=1" ^
  -F "image=@%LOGO_PATH%" ^
  -F "content[0][heading]=Spring Season (March-May)" ^
  -F "content[0][paragraph]=Spring is peak trekking season with clear skies, moderate temperatures, and blooming rhododendrons. March sees fewer crowds, April offers the best weather, and May can be warmer at lower altitudes. Perfect for all major treks including EBC and ABC. Expect busy trails and higher accommodation prices." ^
  -F "content[1][heading]=Monsoon Season (June-August)" ^
  -F "content[1][paragraph]=Monsoon brings heavy rain to most regions, making trails muddy and leeches common. However, Upper Mustang and Dolpo are in rain shadow areas and excellent during this time. Lower altitude treks are challenging but offer lush green landscapes and fewer tourists. Not recommended for high-altitude treks." ^
  -F "content[2][heading]=Autumn Season (September-November)" ^
  -F "content[2][paragraph]=Autumn is the most popular trekking season with stable weather, crystal-clear mountain views, and comfortable temperatures. September can have lingering monsoon rain, October is perfect, and November gets colder at high altitudes. Trails are crowded, especially in October. Book accommodation in advance." ^
  -F "content[3][heading]=Winter Season (December-February)" ^
  -F "content[3][paragraph]=Winter offers solitude and clear skies but very cold temperatures, especially at high altitudes. Lower altitude treks like Poon Hill and Ghorepani are excellent. High passes may be closed due to snow. December is manageable, but January-February are extremely cold. Perfect for experienced winter trekkers seeking solitude." ^
  -F "conclusion=The best time depends on your priorities. For perfect weather and views, choose October or April. For fewer crowds and lower prices, consider March or November. For unique experiences, try monsoon treks in rain shadow areas or winter treks at lower altitudes. Whatever you choose, Nepal's mountains await your arrival."
echo.
timeout /t 1 /nobreak >nul

echo Seeding complete! Delete this file after use.
pause
