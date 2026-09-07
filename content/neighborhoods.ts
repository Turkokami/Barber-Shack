/**
 * Neighborhood data drives /locations/bellingham/[neighborhood].
 * localContext is the Rule 5 payload: 400+ words genuinely unique to this place.
 * A row that fails isPublishable() produces no route and enters no sitemap.
 *
 * Facts here (neighborhoods, parks, colleges, landmarks) are real and researched.
 * Drive times are written as approximate ("about X minutes") from the shop at
 * 2500 Cedarwood Ave in Birchwood — reconcile against live routing if precision
 * ever matters. Nothing about the business is invented; the hours, walk-in policy,
 * and $12 Tuesday program are all confirmed.
 */

export type Neighborhood = {
  slug: string;
  name: string;
  city: "Bellingham";
  localContext: string;
  landmarks: string[];
  driveTimeMin: number;
  /** exactly 2 sibling slugs — lateral linking */
  siblings: [string, string];
  /** 3 service slugs — downward linking */
  services: [string, string, string];
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "birchwood",
    name: "Birchwood",
    city: "Bellingham",
    landmarks: ["Cornwall Park", "Birchwood Park", "Squalicum Creek"],
    driveTimeMin: 3,
    siblings: ["cordata", "columbia"],
    services: ["clipper-cut", "kids-cut", "senior-military-cut"],
    localContext:
      "Barber Shack is a Birchwood shop. We are on Cedarwood Avenue, right in the middle of the " +
      "neighborhood, which means for most of Birchwood a haircut here is a two- or three-minute drive " +
      "or a genuinely walkable trip. If you live off Northwest Avenue, Alderwood, or up toward Sunset, " +
      "this is your corner barbershop in the most literal sense.\n\n" +
      "Birchwood is one of northwest Bellingham's steady, established residential neighborhoods, built " +
      "around Cornwall Park — the big one, with the old-growth trees, the rose garden, the playfields, " +
      "and the trails along Squalicum Creek. Families have been coming to Cornwall for generations, and " +
      "Birchwood Park adds a quieter pocket of green closer to the north end. It is a neighborhood of " +
      "single-family homes, long-time residents, and the kind of daily errands that happen without " +
      "getting on the freeway, with Sunset Square and the shops along Northwest Avenue handling most of " +
      "what people need.\n\n" +
      "That rhythm is exactly what a walk-in barbershop is built for. You do not schedule a haircut here " +
      "the way you would across town; you notice you need one on the way past, put your name down, and " +
      "sit down. We are open seven days a week, nine to six on weekdays, nine to five on Saturday, and " +
      "ten to four on Sunday, so a Birchwood haircut fits around work, school pickup, or a Sunday with " +
      "nothing else on it. Every Tuesday, cuts are twelve dollars for everyone, all day, no questions " +
      "asked — which for a neighborhood shop means the regulars who come in every few weeks can time it " +
      "to a Tuesday and never think twice about the cost.\n\n" +
      "Being the neighborhood's own shop shapes how it feels inside. Kids get their first haircuts here, " +
      "seniors have a standing chair, and the same faces come back often enough that the barbers learn " +
      "how they like it. A clipper cut, a kids' cut, or a senior and military cut are the everyday work " +
      "of a Birchwood chair, and the price on the board is the price you pay. If you are new to the " +
      "neighborhood, this is the easiest introduction to it there is: walk in, and you are a regular by " +
      "the second visit.\n\n" +
      "Cedarwood Avenue also makes the shop a natural stop while you are already out. Drop in on the way " +
      "back from Cornwall Park, after the grocery run at Sunset Square, or between school drop-off and " +
      "work, and you are in and out without rearranging the day. Parking is easy and the entrance is " +
      "wheelchair accessible, and there is no wrong time to come — if the chairs happen to be full, the " +
      "wait in a neighborhood shop is the kind where you end up talking to someone you already know. For " +
      "Birchwood, that is the whole appeal: a good barber you never have to plan your week around.",
  },
  {
    slug: "cordata",
    name: "Cordata",
    city: "Bellingham",
    landmarks: ["Whatcom Community College", "Cordata Park", "Bellis Fair"],
    driveTimeMin: 7,
    siblings: ["bakerview", "birchwood"],
    services: ["clipper-cut", "kids-cut", "skin-fade"],
    localContext:
      "Cordata sits just north of the shop, and from most of the neighborhood Barber Shack is about a " +
      "seven-minute drive down Cordata Parkway and over toward Cedarwood. For students, staff, and " +
      "families on the north end, that is close enough to swing by between classes, errands, or a shift " +
      "without making a project of it.\n\n" +
      "Cordata is one of Bellingham's newer, more deliberately planned neighborhoods, and it is anchored " +
      "by Whatcom Community College. The college brings a steady flow of students who want a sharp, " +
      "affordable cut on a schedule that bends around exams and work, and the surrounding area — Cordata " +
      "Park with its wetlands boardwalk, the retail around Bellis Fair, and the medical and business " +
      "offices along the parkway — fills in with families and professionals. It is a part of town where " +
      "people are used to driving a few minutes for what they need, and a barbershop that is open every " +
      "day and takes walk-ins fits that pattern better than one that runs on appointments only.\n\n" +
      "For a college neighborhood, the two things that matter most are price and availability, and both " +
      "are the point here. Twelve-dollar Tuesdays run all day, every Tuesday, for everyone, with no " +
      "proof and no separate line — which for a student stretching a budget is the difference between a " +
      "fresh cut before an interview and putting it off. And because the shop is open seven days, " +
      "including Sunday from ten to four, there is no week where the only free afternoon is one the shop " +
      "is closed.\n\n" +
      "The work Cordata comes in for tends to be clean and quick: a clipper cut before the week starts, " +
      "a skin fade kept tight, or a kids' cut for the families in the newer developments off Aldrich and " +
      "Stuart. Walk in any day, give your name, and take the next chair — no account, no app required, " +
      "though you can book ahead on Vagaro if you would rather lock in a time between classes.\n\n" +
      "The north end keeps growing, and Cordata is where much of that growth has landed — new apartments, " +
      "new families, and a steady stream of students cycling through the college every term. A shop that " +
      "stays open seven days and holds its prices on a posted board is easy to build a routine around " +
      "when your own schedule keeps changing. Come in between a morning class and an afternoon shift, or " +
      "on a Sunday before the week resets. The entrance is wheelchair accessible, parking is simple, and " +
      "the walk-in list moves; you are never committing your whole afternoon to a haircut. Whatever the " +
      "reason you are on the north end, a good cut is only a few minutes away.",
  },
  {
    slug: "bakerview",
    name: "Bakerview / Guide Meridian",
    city: "Bellingham",
    landmarks: ["Guide Meridian (WA-539)", "Bellis Fair", "Bellingham International Airport"],
    driveTimeMin: 6,
    siblings: ["cordata", "birchwood"],
    services: ["clipper-cut", "skin-fade", "kids-cut"],
    localContext:
      "The Bakerview and Guide Meridian corridor is the north end's front door, and Barber Shack is only " +
      "about six minutes from it — an easy hop off the Guide or Bakerview Road toward Cedarwood Avenue. " +
      "If you are already up here running errands, catching a flight out of Bellingham International, or " +
      "working one of the businesses along the corridor, a haircut barely adds a detour.\n\n" +
      "This is the commercial spine of north Bellingham. The Guide Meridian — state route 539 — carries " +
      "most of the county's big-box shopping, and Bakerview Road ties it to the airport and the retail " +
      "around Bellis Fair. It is a part of town defined less by front porches than by everything you can " +
      "get done in one loop: groceries, hardware, a flight, a return, a quick meal. The people who spend " +
      "time here are shoppers from all over Whatcom County, airport travelers, and the workers who keep " +
      "the corridor running, and what they value is a stop that is fast and does not require planning " +
      "ahead.\n\n" +
      "A walk-in barbershop is exactly that kind of stop. There is no appointment to make and no account " +
      "to set up — you walk in, put your name down, and the next barber takes you. The shop is open " +
      "seven days a week, so a Saturday shopping run or a Sunday between ten and four both work, and the " +
      "twelve-dollar Tuesday rate applies to everyone, all day, which makes a mid-week cut on the way " +
      "past an easy call rather than a splurge.\n\n" +
      "The cuts that suit this corridor are the efficient ones: a clean clipper cut, a skin fade kept " +
      "sharp, or a kids' cut while the family knocks out the rest of the shopping list. Prices are posted " +
      "on the board and they are the prices you pay at the chair — no surprises. And if you would rather " +
      "time it exactly, you can book ahead on Vagaro before you head up the Guide.\n\n" +
      "It is also the easiest part of town to reach from out of the county, which matters more than it " +
      "sounds. Plenty of people drive in from Lynden, Ferndale, and the north county to shop the Guide, " +
      "and a haircut folded into that trip saves a second outing. The shop sits just off the corridor, " +
      "so it is a quick turn from the main road rather than a hunt through side streets. Parking is " +
      "straightforward, the door is wheelchair accessible, and because walk-ins are always open, you do " +
      "not have to have timed it in advance to get seen. Being this close to the busiest stretch of north " +
      "Bellingham means a good haircut is never out of the way.",
  },
  {
    slug: "columbia",
    name: "Columbia",
    city: "Bellingham",
    landmarks: ["Elizabeth Park", "Broadway", "Columbia Elementary"],
    driveTimeMin: 7,
    siblings: ["sunnyland", "birchwood"],
    services: ["clipper-cut", "kids-cut", "senior-military-cut"],
    localContext:
      "Columbia sits between the shop and downtown, about seven minutes away, and it is one of the " +
      "neighborhoods where a Barber Shack haircut feels like a natural part of the day rather than a trip " +
      "across town. Come up Cornwall or over from Broadway and you are here quickly.\n\n" +
      "Columbia is one of Bellingham's older, leafier neighborhoods, built around Elizabeth Park — the " +
      "oldest park in the city, with its bandstand, mature trees, and the summer concerts and markets " +
      "that draw the whole neighborhood out. The streets are lined with well-kept older homes, Columbia " +
      "Elementary anchors the family side of things, and Broadway carries the small, walkable mix of " +
      "cafes and corner spots that give the area its character. It is a neighborhood of long-time owners " +
      "and young families settling into first houses, the kind of place where people know their block " +
      "and prefer to keep their routine close to home.\n\n" +
      "That preference is what a neighborhood barbershop runs on. You do not need to plan around us — " +
      "walk in any day we are open, give your name, and take the next chair. Seven days a week, including " +
      "Sunday from ten to four, means a haircut can happen on the day that is actually free, and the " +
      "twelve-dollar Tuesday rate is there for everyone, all day, with no qualifying and no separate " +
      "line. For a household watching a budget, timing the family's cuts to a Tuesday adds up fast.\n\n" +
      "The chairs here see a lot of everyday, all-ages work from Columbia: a clean clipper cut, a kids' " +
      "cut for the families near Elizabeth Park, and a senior and military cut for the neighborhood's " +
      "long-time residents at a rate that respects them. Whatever you come in for, the price is on the " +
      "board and it is the price at the chair.\n\n" +
      "Elizabeth Park keeps the neighborhood social — the summer concerts, the market days, the dog " +
      "walkers making their loops — and a barbershop a few minutes away fits that same easy, local " +
      "rhythm. You can get a cut before a park evening or after a Broadway coffee without it eating the " +
      "afternoon. The shop's entrance is wheelchair accessible and parking is uncomplicated, and because " +
      "there is nothing to book, a Columbia haircut can be a spur-of-the-moment decision as easily as a " +
      "planned one. It is the kind of standing option a settled neighborhood appreciates: close, " +
      "dependable, and open when you actually have the time. Book on Vagaro if you want a set time, or " +
      "just walk in — from Columbia, you will be back home before you know it.",
  },
  {
    slug: "sunnyland",
    name: "Sunnyland",
    city: "Bellingham",
    landmarks: ["Sunnyland Memorial Park", "Sunnyland Elementary", "downtown Bellingham"],
    driveTimeMin: 9,
    siblings: ["columbia", "york"],
    services: ["clipper-cut", "kids-cut", "beard-trim"],
    localContext:
      "Sunnyland is just northeast of downtown, about a nine-minute drive from the shop, and it is one of " +
      "the most characterful neighborhoods in Bellingham — the kind of place where a good, unpretentious " +
      "barbershop fits right in. Head up from downtown or over from Columbia and Barber Shack is a short " +
      "trip.\n\n" +
      "Sunnyland is an older, close-in neighborhood of craftsman bungalows and tidy streets, tucked " +
      "between downtown and the arts-and-makers pocket along the north side. Sunnyland Memorial Park " +
      "gives the neighborhood its green center, Sunnyland Elementary anchors the families, and the whole " +
      "area has a creative, independent streak — small studios, makers, and a walkability that keeps " +
      "people close to home. Downtown and the Bellingham Farmers Market at Depot Market Square are just " +
      "minutes away, so residents get the best of both: a quiet neighborhood and a city center within " +
      "reach.\n\n" +
      "For a neighborhood that values the independent and the local, a shop that takes you as you are — " +
      "no appointment, no fuss — is a good match. Walk in any day we are open, put your name down, and " +
      "take the next chair. We are open seven days, including Sunday from ten to four, and every Tuesday " +
      "haircuts are twelve dollars for everyone, all day, no questions asked. It is an access program " +
      "first, and in a neighborhood with a mix of students, young families, and long-time residents, that " +
      "unconditional price matters.\n\n" +
      "Sunnyland's chairs run to clean everyday work and detail: a sharp clipper cut, a kids' cut for the " +
      "families near the park and school, and a beard trim to keep things lined up between visits. The " +
      "prices are on the board and they hold at the chair.\n\n" +
      "Because Sunnyland runs right up against downtown and the market district, a lot of daily life here " +
      "happens on foot or on a quick hop in the car, and a barbershop that takes you without an " +
      "appointment slots into that neatly. Grab a cut around a Saturday at the market or a weekday errand " +
      "run, no scheduling required. The entrance is wheelchair accessible, parking is easy to find, and " +
      "the walk-in list keeps moving. For a neighborhood that prizes the independent and the unpolished, " +
      "a shop that is exactly what it says it is — good haircuts, honest prices, open every day — is a " +
      "comfortable fit. If you would rather set a time or a specific barber, book on Vagaro; otherwise " +
      "just walk in, and a fresh cut is a quick, easy part of the day.",
  },
  {
    slug: "york",
    name: "York",
    city: "Bellingham",
    landmarks: ["downtown Bellingham", "Whatcom Falls Park", "historic York homes"],
    driveTimeMin: 10,
    siblings: ["sunnyland", "columbia"],
    services: ["clipper-cut", "skin-fade", "beard-trim"],
    localContext:
      "York is one of Bellingham's oldest neighborhoods, sitting just east of downtown, and it is about a " +
      "ten-minute drive from the shop. For a neighborhood this close to the city center, a walk-in " +
      "barbershop that is open every day is a genuinely useful thing to have a few minutes up the road.\n\n" +
      "York's character comes from its age. It is a compact, historic neighborhood of early Bellingham " +
      "homes — some of the oldest housing stock in the city — on a tight, walkable grid that runs right " +
      "up to the edge of downtown. To the east, the neighborhood opens toward Whatcom Falls Park, one of " +
      "the best-loved green spaces in town, with its stone bridge, falls, and miles of trail. It is a mix " +
      "of long-time residents, renters, and people who want to be able to walk to work and to dinner, and " +
      "it carries the lived-in, unpolished feel of a neighborhood that has been here a long time.\n\n" +
      "A barbershop that runs on walk-ins suits that spirit. There is nothing to schedule and no account " +
      "to make — you walk in during opening hours, give your name, and take the next chair. Seven days a " +
      "week, including Sunday from ten to four, means the one free afternoon in a busy week is never the " +
      "day the shop is dark, and the twelve-dollar Tuesday rate is open to everyone, all day, with no " +
      "proof required. In a neighborhood with a wide mix of incomes, that unconditional price is the " +
      "whole idea.\n\n" +
      "From York, the everyday requests are clean and current: a crisp clipper cut, a skin fade kept " +
      "tight, or a beard trim to sharpen the edges. What is posted on the board is what you pay at the " +
      "chair.\n\n" +
      "York's closeness to both downtown and Whatcom Falls means people here are often already moving — " +
      "walking the dog toward the falls, heading in for dinner, cutting across to work — and a barbershop " +
      "a few minutes up the road is easy to fold into any of it. There is no appointment to keep and " +
      "nothing to set up; you simply stop in. The entrance is wheelchair accessible and parking is " +
      "manageable, even on the tighter historic streets nearby. Book on Vagaro if you want a set time or " +
      "a particular barber, or simply walk in on your way to or from downtown. For one of Bellingham's " +
      "oldest neighborhoods, an old-fashioned walk-in barbershop that keeps its doors open seven days a " +
      "week is a fitting match — and ten minutes each way is a small price for a cut you never have to " +
      "plan around.",
  },
  {
    slug: "barkley",
    name: "Barkley",
    city: "Bellingham",
    landmarks: ["Barkley Village", "Barkley Boulevard", "Whatcom Falls Park"],
    driveTimeMin: 11,
    siblings: ["silver-beach", "york"],
    services: ["clipper-cut", "beard-trim", "long-haircut"],
    localContext:
      "Barkley is on Bellingham's east side, about eleven minutes from the shop, built around Barkley " +
      "Village — one of the busiest gathering spots in that part of town. If you spend time around the " +
      "Village, a Barber Shack haircut is a short, straightforward drive across town well worth the " +
      "trip.\n\n" +
      "Barkley is one of Bellingham's newer mixed-use neighborhoods, and Barkley Village is its heart: a " +
      "walkable center of shops, restaurants, a cinema, and a summer farmers market, wrapped in " +
      "apartments and townhomes along Barkley Boulevard and Woburn Street. It draws people from across " +
      "the east side for dinner, a movie, or a Saturday errand run, and it sits a short distance from " +
      "Whatcom Falls Park, which gives the neighborhood its outdoor anchor. It is a busy, contemporary " +
      "part of town where people are comfortable driving a few minutes for the right spot rather than " +
      "settling for the nearest one.\n\n" +
      "That willingness to travel a little for something better is worth rewarding with a shop that earns " +
      "the trip. Barber Shack takes walk-ins every day it is open — no appointment, no account, just your " +
      "name and the next chair — and it is open seven days a week, including Sunday from ten to four, so " +
      "a cut can land on whatever day the Village side of town has free. Twelve-dollar Tuesdays run all " +
      "day for everyone, no separate line and no questions, which turns a routine cut into an easy " +
      "mid-week stop.\n\n" +
      "The work that comes over from Barkley leans a little longer and more finished: a clean clipper " +
      "cut, a beard trim to keep things sharp, or a longer scissor cut shaped to grow out well. Whatever " +
      "it is, the price on the board is the price at the chair.\n\n" +
      "Barkley Village fills up in the evenings and on weekends, and a haircut is easy to pair with " +
      "whatever brought you over — dinner, a movie, the Saturday market in summer. Because the shop holds " +
      "regular seven-day hours, a Sunday trip works as well as a weeknight one, and the posted prices " +
      "mean you know the cost before you sit down. The entrance is wheelchair accessible and parking is " +
      "straightforward on the shop's side of town. If you would rather book a set time or a particular " +
      "barber before heading across town, Vagaro has you covered; otherwise, just walk in. For a " +
      "neighborhood used to driving a few minutes for the right spot, eleven minutes to a barber who " +
      "takes walk-ins every day is an easy habit to keep.",
  },
  {
    slug: "silver-beach",
    name: "Silver Beach",
    city: "Bellingham",
    landmarks: ["Lake Whatcom", "Bloedel Donovan Park", "Whatcom Falls Park"],
    driveTimeMin: 13,
    siblings: ["barkley", "york"],
    services: ["clipper-cut", "beard-trim", "long-haircut"],
    localContext:
      "Silver Beach sits on the northwest shore of Lake Whatcom, on Bellingham's east side, about a " +
      "thirteen-minute drive from the shop. It is one of the prettier corners of town, and for the " +
      "families who live along the lake, a walk-in barbershop open every day is a handy thing to have " +
      "within a short drive.\n\n" +
      "The neighborhood is defined by the water. Lake Whatcom is right there, and Bloedel Donovan Park is " +
      "its center of gravity — a lakeside park with a swimming beach, a boat launch, playfields, and an " +
      "old mill building turned community space, busy all summer and steady the rest of the year. Just up " +
      "the hill, Whatcom Falls Park adds trails, the falls, and the fish hatchery. Silver Beach is largely " +
      "residential, a mix of lake homes and family streets, the kind of neighborhood where weekends " +
      "revolve around the park and the water rather than errands across town.\n\n" +
      "For a neighborhood that keeps close to home, a barbershop that does not demand an appointment is " +
      "the easy choice. Walk in on your way to or from the lake, give your name, and take the next chair " +
      "— no account, no app needed. The shop is open seven days a week, including Sunday from ten to " +
      "four, so a cut fits around a lake day instead of competing with it, and the twelve-dollar Tuesday " +
      "rate is open to everyone, all day, with nothing to prove.\n\n" +
      "The cuts Silver Beach comes in for run from clean to relaxed: a sharp clipper cut, a beard trim to " +
      "keep the edges tidy, or a longer scissor cut that grows out well between visits — practical for a " +
      "neighborhood that spends its summers outdoors. The board price is the chair price, every time.\n\n" +
      "Life in Silver Beach bends toward the lake — mornings at Bloedel Donovan, a paddle after work, " +
      "weekends on the water — and a barbershop that does not require you to leave a summer day early is " +
      "worth the short drive. Catch a cut on the way in from the lake or before heading out, no " +
      "appointment needed. The shop's entrance is wheelchair accessible and parking is easy, and the " +
      "walk-in list keeps moving so a haircut stays a quick errand rather than a commitment. Book ahead " +
      "on Vagaro if you want to guarantee a time, or simply walk in when you are already on that side of " +
      "town. For a neighborhood built around Lake Whatcom, a dependable barber a few minutes off the " +
      "water is a small but real convenience.",
  },
  {
    slug: "happy-valley",
    name: "Happy Valley",
    city: "Bellingham",
    landmarks: ["Western Washington University", "Happy Valley Park", "Connelly Creek"],
    driveTimeMin: 13,
    siblings: ["fairhaven", "york"],
    services: ["skin-fade", "clipper-cut", "long-haircut"],
    localContext:
      "Happy Valley is in south Bellingham, wrapped around the south edge of Western Washington " +
      "University, about a thirteen-minute drive from the shop. It is a young, lively part of town, and " +
      "for students and south-side families alike, an affordable walk-in barbershop is exactly the kind " +
      "of place that gets a standing spot in the routine.\n\n" +
      "The university sets the tone here. Happy Valley is one of the most student-heavy neighborhoods in " +
      "Bellingham, full of rentals and shared houses within walking distance of campus, mixed with " +
      "long-time family homes on the quieter streets. Happy Valley Park and the Connelly Creek Nature " +
      "Area give the neighborhood its green breathing room, and the whole area feeds into Fairhaven and " +
      "the south-side trails. It is a place where budgets are real, schedules are irregular, and people " +
      "value anything that is both good and easy to get to.\n\n" +
      "That is the heart of what this shop offers. Twelve-dollar Tuesdays run all day, every Tuesday, for " +
      "everyone — no proof, no separate line — which for a student is the difference between a fresh cut " +
      "before an interview or a presentation and going without. And because the shop is open seven days a " +
      "week, including Sunday from ten to four, there is no stretch of the term when the only free " +
      "afternoon is one the shop is closed. Walk in, give your name, take the next chair; book on Vagaro " +
      "only if you want to.\n\n" +
      "The requests out of Happy Valley skew current and sharp: a clean skin fade, a versatile clipper " +
      "cut, or a longer scissor cut shaped to last between trims when time and money are tight. Whatever " +
      "it is, the price is on the board and it holds at the chair — no student surcharge, no surprises.\n\n" +
      "Term time or summer, Happy Valley keeps its own hours — late classes, shifting work schedules, " +
      "houses full of roommates on different clocks — and a barbershop open seven days with a posted " +
      "price board is easy to fit into that. There is no appointment to miss and no account to make; walk " +
      "in when you have a gap and take the next chair. The entrance is wheelchair accessible and parking " +
      "is workable even on the busier student streets nearby. For a neighborhood where money and time are " +
      "both tight, a good cut you can get on a Tuesday for twelve dollars is exactly the kind of thing " +
      "that earns a regular — and thirteen minutes from campus is a short ride to get it any day of the " +
      "week.",
  },
  {
    slug: "fairhaven",
    name: "Fairhaven",
    city: "Bellingham",
    landmarks: ["Fairhaven Historic District", "Fairhaven Village Green", "Marine Park"],
    driveTimeMin: 14,
    siblings: ["happy-valley", "york"],
    services: ["long-haircut", "straight-razor-face-shave", "clipper-cut"],
    localContext:
      "Fairhaven is south Bellingham's historic district, down on the waterfront, about a fourteen-minute " +
      "drive from the shop. It is the most storied corner of the city, and while it is the longest trip " +
      "on this list, it is a straight shot down through town — and an easy one to fold into a day already " +
      "spent on the south side.\n\n" +
      "Fairhaven has a character all its own. Its red-brick buildings date to the 1890s, and the district " +
      "today is a walkable mix of independent shops, restaurants, and the beloved Village Books, all " +
      "gathered around the Fairhaven Village Green, where summer brings outdoor films and a farmers " +
      "market. Down at the water, Marine Park and the Bellingham Cruise Terminal — the southern end of " +
      "the Alaska Marine Highway — open onto the bay, and Padden Creek and the Interurban Trail thread " +
      "the neighborhood into the south-side park system. It is a district that draws visitors and locals " +
      "alike, with a settled, unhurried feel.\n\n" +
      "For a neighborhood that appreciates things done properly, a traditional barbershop is a natural " +
      "fit — and one that still takes walk-ins any day of the week. Come in, give your name, and take the " +
      "next chair; no appointment required, though you can book a specific time or barber on Vagaro. The " +
      "shop is open seven days, including Sunday from ten to four, and every Tuesday cuts are twelve " +
      "dollars for everyone, all day, with no qualifying and no separate line.\n\n" +
      "Fairhaven tends toward the considered end of the menu: a longer scissor cut shaped with care, a " +
      "hot-towel straight-razor face shave done the traditional way, or a clean, classic clipper cut. " +
      "The price on the board is the price at the chair, start to finish.\n\n" +
      "Fairhaven fills with visitors in the warmer months — cruise passengers, cyclists off the " +
      "Interurban, weekenders browsing the shops — but it stays a real neighborhood underneath, with " +
      "residents who want the same thing everyone does: a good haircut without a fuss. Fold a cut into a " +
      "day already spent down on the waterfront and the fourteen minutes back up through town hardly " +
      "registers. The shop's entrance is wheelchair accessible and parking is straightforward once you " +
      "are out of the busiest blocks. For a district that values craft and keeps its own traditions, a " +
      "barbershop open seven days that still does a proper straight-razor shave is well worth the drive. " +
      "Book on Vagaro for a set time, or simply walk in the next time you are already down in the district.",
  },
];

/**
 * One image per neighbourhood page, indexed by row order. All ten pages used to
 * share a single shop-floor photo; a distinct image per page is better for
 * readers and stops ten routes looking like one duplicated template.
 * Every entry is compliant with the photography rule in CLAUDE.md.
 */
export const NEIGHBORHOOD_IMAGES: { src: string; alt: string }[] = [
  { src: "/images/interior-shop-floor.webp", alt: "Inside Barber Shack on Cedarwood Avenue — the shop floor and chairs." },
  { src: "/images/cut-fade-nape.webp", alt: "A tapered fade blended down to the nape at Barber Shack." },
  { src: "/images/interior-chair.webp", alt: "A vintage barber chair on the shop floor at Barber Shack." },
  { src: "/images/cut-fade-back.webp", alt: "A finished fade seen from behind at Barber Shack." },
  { src: "/images/tools-flatlay.webp", alt: "Barbering tools laid out — shears, clippers, and a straight razor." },
  { src: "/images/interior-2.webp", alt: "A styling room inside Barber Shack — chairs, mirrors, and a ring light." },
  { src: "/images/cut-fade-top.webp", alt: "A short fade seen from above, edges cleaned up at Barber Shack." },
  { src: "/images/shave-hot-towel.webp", alt: "A hot towel wrapped for a straight-razor shave at Barber Shack." },
  { src: "/images/cut-clipper-closeup.webp", alt: "Clippers detailing the side of a client's cut at Barber Shack." },
  { src: "/images/barber-pole.webp", alt: "A classic barber pole beside the Barber Shack BS logo wall." },
];

export const getNeighborhood = (slug: string) => NEIGHBORHOODS.find((n) => n.slug === slug);
