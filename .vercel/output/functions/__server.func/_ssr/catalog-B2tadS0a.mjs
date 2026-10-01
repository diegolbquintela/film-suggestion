import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-B2tadS0a.js
function work(input) {
	return {
		id: input.id,
		name: input.name,
		year: input.year,
		kind: input.kind ?? "film",
		runtime: input.runtime,
		loved: input.loved ?? false,
		weight: input.weight ?? (input.loved ? 1 : 0),
		hidden: input.hidden ?? false,
		fromChat: input.fromChat ?? false,
		family: input.family,
		vibes: input.vibes,
		seasons: input.seasons ?? ["any"],
		facets: input.facets,
		summary: input.summary,
		why: input.why,
		vibeLine: input.vibeLine,
		preachy: input.preachy ?? 0
	};
}
var LOVED = [
	work({
		id: "wild-tales",
		name: "Wild Tales",
		year: "2014",
		runtime: "2h 2m",
		loved: true,
		family: "satire",
		vibes: ["heat", "rewatch"],
		facets: {
			satire: .95,
			moral: .75,
			crime: .35,
			talk: .4
		},
		summary: "Six Argentine stories about ordinary people who decide the slight was enough. Each one starts civil and ends in wreckage.",
		why: "Your satire is not cute. Death of Stalin, Another Round, and this — manners fail, and nobody is let off.",
		vibeLine: "A sharp night. Laugh, then feel the bruise."
	}),
	work({
		id: "leviathan",
		name: "Leviathan",
		year: "2014",
		runtime: "2h 20m",
		loved: true,
		family: "faith",
		vibes: ["dusk", "folk"],
		seasons: ["autumn", "winter"],
		facets: {
			faith: .7,
			moral: .9,
			grief: .65,
			folk: .35,
			talk: .55
		},
		summary: "On the Barents coast a man fights the mayor for his house, and the state, the church, and the vodka close in together.",
		why: "Austere, political, and religious without a sermon. Sits with The Hunt and The Passion as judgment, not inspiration.",
		vibeLine: "Cold coast. Faith as weather, not a lesson."
	}),
	work({
		id: "you-wont-be-alone",
		name: "You Won't Be Alone",
		year: "2022",
		runtime: "1h 48m",
		loved: true,
		family: "folk",
		vibes: ["folk"],
		seasons: ["autumn"],
		facets: {
			folk: .95,
			grief: .7,
			faith: .4,
			weird: .55,
			moral: .45
		},
		summary: "A girl taken by a witch in 19th-century Macedonia learns how to wear other people's lives. Quiet, bodily, and strange.",
		why: "This is the Lamb cluster at its most literal: folk ritual, a stolen body, tenderness that never turns into a speech.",
		vibeLine: "October folk. Soft voice, hard magic."
	}),
	work({
		id: "gotti",
		name: "Gotti",
		year: "1996",
		runtime: "1h 56m",
		loved: true,
		weight: .7,
		family: "crime",
		vibes: ["heat"],
		facets: {
			crime: .9,
			moral: .45,
			talk: .5,
			cool: .35
		},
		summary: "Armand Assante as John Gotti, from the Bergin Hunt & Fish Club to the courtroom. The 1996 film, not the later one.",
		why: "A straight mob portrait on the Goodfellas shelf — appetite and law, without Scorsese's music doing the moral work.",
		vibeLine: "Heat. Suits, tapes, and a man who likes being seen."
	}),
	work({
		id: "marty-supreme",
		name: "Marty Supreme",
		year: "2025",
		runtime: "2h 30m",
		loved: true,
		family: "obsession",
		vibes: ["heat", "rewatch"],
		facets: {
			obsession: .95,
			cool: .4,
			moral: .45,
			talk: .55,
			crime: .25
		},
		summary: "A ping-pong hustler in postwar New York tries to will himself into greatness and drags everyone into the grift.",
		why: "Whiplash energy with a con man's mouth. Mastery as a vice, which is the part of your shelf that isn't folk and isn't the mob.",
		vibeLine: "Lean-in. Ambition with dirt under it."
	}),
	work({
		id: "hamnet",
		name: "Hamnet",
		year: "2025",
		runtime: "2h 5m",
		loved: true,
		family: "grief",
		vibes: ["folk", "dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			grief: .95,
			folk: .45,
			domestic: .6,
			talk: .4,
			faith: .25
		},
		summary: "Agnes and Will lose a boy, and a play becomes the only place the loss can live. Period England, but the wound is the point.",
		why: "Parenthood and grief without the horror furniture. Lamb and Manchester by the Sea, moved into a Tudor house.",
		vibeLine: "A quiet autumn night. Bring nothing else on."
	}),
	work({
		id: "bronx-tale",
		name: "A Bronx Tale",
		year: "1993",
		runtime: "2h 1m",
		loved: true,
		family: "crime",
		vibes: ["heat", "rewatch"],
		facets: {
			crime: .75,
			moral: .7,
			talk: .65,
			comfort: .4
		},
		summary: "A boy in the Bronx is pulled between his bus-driver father and the neighborhood boss who likes him.",
		why: "Moral crime, not a body count. The same choice Sopranos keeps staging, told as one street and one kid.",
		vibeLine: "Heat, but the kind you can rewatch with dinner."
	}),
	work({
		id: "dead-poets",
		name: "Dead Poets Society",
		year: "1989",
		runtime: "2h 8m",
		loved: true,
		family: "obsession",
		vibes: ["rewatch", "court"],
		seasons: ["autumn"],
		facets: {
			obsession: .55,
			talk: .8,
			moral: .6,
			grief: .45,
			comfort: .5
		},
		summary: "A new teacher at a strict boys' school asks them to stand on their desks. The school does not thank him.",
		why: "Mentor, language, and a cost. Closer to Whiplash's institution than to a cozy school movie — the poem does not save you.",
		vibeLine: "Autumn term. A rewatch with a last scene that still lands."
	}),
	work({
		id: "warfare",
		name: "Warfare",
		year: "2025",
		runtime: "1h 35m",
		loved: true,
		family: "war",
		vibes: ["dusk"],
		facets: {
			war: .95,
			moral: .4,
			obsession: .3,
			domestic: .2
		},
		summary: "One Navy SEAL team, one house, one fight in Iraq, played almost in real time. Procedure, noise, and no speech about what it meant.",
		why: "Dunkirk's craft pulled in tighter. You like war when it refuses the speech. This one barely has a plot on purpose.",
		vibeLine: "Not a comfort night. Short, loud, exact."
	}),
	work({
		id: "bullitt",
		name: "Bullitt",
		year: "1968",
		runtime: "1h 54m",
		loved: true,
		weight: .8,
		family: "cool",
		vibes: ["heat", "rewatch"],
		facets: {
			cool: .9,
			crime: .55,
			spy: .25,
			moral: .3
		},
		summary: "Steve McQueen is a San Francisco detective who will not perform for the politicians around a witness. Then the Mustang.",
		why: "You wrote Bullet. This is Bullitt — cool as a method, not a pose. The bridge between crime and the Bond films you actually rewatch.",
		vibeLine: "Night drive. Precision over talk."
	}),
	work({
		id: "thomas-crown",
		name: "The Thomas Crown Affair",
		year: "1968",
		runtime: "1h 42m",
		loved: true,
		weight: .8,
		family: "cool",
		vibes: ["summer", "heat"],
		seasons: ["summer"],
		facets: {
			cool: .85,
			crime: .45,
			euro: .25,
			satire: .2
		},
		summary: "A bored rich man robs a bank because he can, and the investigator starts to enjoy the game.",
		why: "You wrote Thomas Cromwell. This is Thomas Crown — a heist with manners. Ocean's without the crew, McQueen without the Mustang.",
		vibeLine: "Summer cool. A game, not a tragedy."
	}),
	work({
		id: "promised-land",
		name: "The Promised Land",
		year: "2023",
		runtime: "2h 7m",
		loved: true,
		family: "folk",
		vibes: ["folk", "court"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .6,
			moral: .85,
			faith: .35,
			war: .35,
			grief: .4
		},
		summary: "Mads Mikkelsen tries to farm the Jutland heath while a local lord decides the land is not his to give. Danish title Bastarden.",
		why: "Listed under Steve McQueen; read here as the 2023 Mads film, next to The Hunt. Drop it on the Taste page if that was the wrong picture.",
		vibeLine: "Heath, frost, and a man who will not bow."
	}),
	work({
		id: "american-beauty",
		name: "American Beauty",
		year: "1999",
		runtime: "2h 2m",
		loved: true,
		family: "domestic",
		vibes: ["dusk", "rewatch"],
		seasons: ["autumn"],
		facets: {
			domestic: .8,
			moral: .65,
			satire: .55,
			grief: .4,
			weird: .25
		},
		summary: "A suburban father quits the performance of his own life. The roses and the bag are doing more work than the plot.",
		why: "Domestic rupture with a joke in its mouth. Not Fight Club's manifesto — a household coming apart in plain sight.",
		vibeLine: "Autumn suburb. Darker than it looks in memory."
	}),
	work({
		id: "whiplash",
		name: "Whiplash",
		year: "2014",
		runtime: "1h 47m",
		loved: true,
		family: "obsession",
		vibes: ["heat", "rewatch"],
		facets: {
			obsession: .95,
			moral: .5,
			talk: .45,
			institution: .4
		},
		summary: "A drummer at a conservatory meets the teacher who will bleed the music out of him. The room gets smaller every scene.",
		why: "Mastery against a person. Marty Supreme, Black Swan, Dead Poets — the institution that calls abuse a standard.",
		vibeLine: "Lean-in. One room, one tempo, no mercy."
	}),
	work({
		id: "fight-club",
		name: "Fight Club",
		year: "1999",
		runtime: "2h 19m",
		loved: true,
		weight: .8,
		family: "weird",
		vibes: ["heat"],
		facets: {
			weird: .55,
			moral: .5,
			satire: .6,
			crime: .35,
			obsession: .45
		},
		summary: "An insomniac and a soap salesman start a club that is not about the club. The twist is the culture now; the rot is still the point.",
		why: "Male rupture, a sermon the film only half believes. You keep it. The deck will not flood you with copies of it.",
		vibeLine: "Night energy. Mean, funny, already half-remembered."
	}),
	work({
		id: "donnie-darko",
		name: "Donnie Darko",
		year: "2001",
		runtime: "1h 53m",
		loved: true,
		family: "weird",
		vibes: ["folk", "rewatch"],
		seasons: ["autumn"],
		facets: {
			weird: .9,
			grief: .45,
			domestic: .5,
			faith: .25,
			satire: .3
		},
		summary: "A teenager is told the world ends in twenty-eight days. Suburb, jet engine, rabbit, and a school that explains nothing.",
		why: "Dream logic with a family still in the house. Twin Peaks' small-town wrongness, younger, and set in a hallway you know.",
		vibeLine: "October suburb. Rewatch if you want the feeling, not the diagram."
	}),
	work({
		id: "it-follows",
		name: "It Follows",
		year: "2014",
		runtime: "1h 40m",
		loved: true,
		family: "folk",
		vibes: ["folk", "dusk"],
		seasons: ["autumn", "summer"],
		facets: {
			folk: .55,
			weird: .6,
			domestic: .4,
			grief: .25,
			moral: .35
		},
		summary: "Something walks toward you, slowly, and only you can see it. Passing it on is the whole moral problem.",
		why: "Dread without a jump factory. Shape is horror; manners are Lamb — rules, shame, and a suburb that looks ordinary.",
		vibeLine: "Lights low. It does not run."
	}),
	work({
		id: "crazy-stupid-love",
		name: "Crazy, Stupid, Love",
		year: "2011",
		runtime: "1h 58m",
		loved: true,
		weight: .65,
		family: "satire",
		vibes: ["rewatch", "summer"],
		seasons: ["summer"],
		facets: {
			satire: .45,
			comfort: .7,
			talk: .55,
			domestic: .6,
			moral: .3
		},
		summary: "A marriage cracks in a mall, and a smoother man tries to teach the husband how to be someone else.",
		why: "The warm end of your comedy shelf. Not Superbad, not Stalin — people being foolish because they still want the household.",
		vibeLine: "A lighter night. Romance with a spine."
	}),
	work({
		id: "death-of-stalin",
		name: "The Death of Stalin",
		year: "2017",
		runtime: "1h 47m",
		loved: true,
		family: "satire",
		vibes: ["heat", "court"],
		facets: {
			satire: .95,
			moral: .7,
			court: .55,
			talk: .75,
			crime: .35
		},
		summary: "Stalin dies and the men around the body start the next regime before the corpse is cold. Panic in good tailoring.",
		why: "Vicious comedy about power. Court intrigue with a joke that knows someone is about to be shot.",
		vibeLine: "Mean laughter. A committee as a crime family."
	}),
	work({
		id: "oceans",
		name: "Ocean's Eleven",
		year: "2001–2007",
		runtime: "one film of the trilogy",
		loved: true,
		family: "cool",
		vibes: [
			"rewatch",
			"summer",
			"heat"
		],
		seasons: ["summer"],
		facets: {
			cool: .9,
			crime: .55,
			comfort: .75,
			satire: .35,
			talk: .4
		},
		summary: "Danny Ocean gets out and collects a crew to take a casino. The trilogy is the love — start wherever the mood is.",
		why: "Comfort heist. Thomas Crown's game, played by friends. A rewatch night when you want craft without grief.",
		vibeLine: "Rewatch. Suits, timing, no one important dies."
	}),
	work({
		id: "batman-nolan",
		name: "Nolan's Batman",
		year: "2005–2012",
		runtime: "one film of the trilogy",
		loved: true,
		weight: .85,
		family: "cool",
		vibes: [
			"rewatch",
			"dusk",
			"heat"
		],
		facets: {
			cool: .7,
			moral: .65,
			crime: .55,
			institution: .45,
			comfort: .6,
			obsession: .35
		},
		summary: "Begins, The Dark Knight, Rises. A city as a moral argument, dressed as a blockbuster you already know by heart.",
		why: "Spectacle you respect because the question is about order, not the toy. Comfort, but not empty.",
		vibeLine: "Rewatch. A long one, city lights, a known ending."
	}),
	work({
		id: "harry-potter",
		name: "Harry Potter",
		year: "2001–2011",
		runtime: "one film of the sequence",
		loved: true,
		family: "comfort",
		vibes: ["rewatch"],
		seasons: ["autumn", "winter"],
		facets: {
			comfort: .95,
			folk: .45,
			court: .25,
			grief: .35,
			weird: .3
		},
		summary: "The sequence, from the cupboard to the battle. Pick the year you want. Autumn is the honest season for it.",
		why: "You named this as fall rewatch weather, next to The Americans and Lamb. Comfort with a school, a death, and a house that remembers you.",
		vibeLine: "October rewatch. Start at the one you miss, not at the beginning."
	}),
	work({
		id: "lotr",
		name: "The Lord of the Rings",
		year: "2001–2003",
		runtime: "one film of the trilogy",
		loved: true,
		family: "comfort",
		vibes: ["rewatch", "folk"],
		seasons: ["autumn", "winter"],
		facets: {
			comfort: .9,
			war: .55,
			folk: .5,
			faith: .35,
			moral: .6,
			grief: .4
		},
		summary: "Fellowship, Towers, Return. Fellowship if you want friends on a road. Return if you want the cost.",
		why: "Saga comfort that still believes in sacrifice. A winter rewatch, not a discovery.",
		vibeLine: "Rewatch. Firelight, a long road, a known grief."
	}),
	work({
		id: "lamb",
		name: "Lamb",
		year: "2021",
		runtime: "1h 46m",
		loved: true,
		family: "folk",
		vibes: ["folk"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .95,
			grief: .85,
			domestic: .6,
			faith: .3,
			weird: .45
		},
		summary: "A couple on an Icelandic farm find something in the barn and decide it is theirs. Almost no music tells you how to feel.",
		why: "The anchor. Parenthood, folk dread, austerity. The whole folk side of the deck is measured against this, not against slashers.",
		vibeLine: "Fog, a barn, no sermon. The Lamb night."
	}),
	work({
		id: "hereditary",
		name: "Hereditary",
		year: "2018",
		runtime: "2h 7m",
		loved: true,
		family: "domestic",
		vibes: ["folk", "dusk"],
		seasons: ["autumn"],
		facets: {
			domestic: .75,
			grief: .9,
			folk: .7,
			weird: .55,
			faith: .35
		},
		summary: "A family starts to come apart after a funeral, and the house has older plans than their therapy.",
		why: "Grief horror with a family argument still audible under the cult. Heavier than Lamb, meaner than Servant, same wound.",
		vibeLine: "Not a casual night. Family, then the floor drops."
	}),
	work({
		id: "american-pie",
		name: "American Pie",
		year: "1999–2003",
		runtime: "one film of the trilogy",
		loved: true,
		weight: .55,
		family: "satire",
		vibes: ["rewatch", "summer"],
		seasons: ["summer"],
		facets: {
			satire: .7,
			comfort: .65,
			talk: .3
		},
		summary: "The trilogy. Crude on purpose, sentimental underneath, best when you already know the jokes.",
		why: "Youth raunch you actually like, with Superbad. The deck will not pretend this is Lamb. It is a summer rewatch or nothing.",
		vibeLine: "Light, dumb, yours. A palate cleanse, not a taste."
	}),
	work({
		id: "superbad",
		name: "Superbad",
		year: "2007",
		runtime: "1h 53m",
		loved: true,
		weight: .6,
		family: "satire",
		vibes: ["rewatch", "summer"],
		seasons: ["summer"],
		facets: {
			satire: .75,
			comfort: .6,
			talk: .45
		},
		summary: "Two friends try to get to a party before high school ends and the friendship has to change shape.",
		why: "The sincere one inside the raunch. A rewatch, not a clue about folk horror.",
		vibeLine: "Summer noise. Friendship, panic, a bad plan."
	}),
	work({
		id: "skyfall",
		name: "Skyfall",
		year: "2012",
		runtime: "2h 23m",
		loved: true,
		weight: .32,
		family: "spy",
		vibes: ["dusk", "rewatch"],
		seasons: ["autumn"],
		facets: {
			spy: .85,
			cool: .6,
			grief: .4,
			moral: .45,
			comfort: .4
		},
		summary: "Bond is shot, comes back old, and goes home to a house in Scotland. The autumn Bond.",
		why: "One of seven Bonds on your list, weighted as a cluster so they don't drown Lamb. This is the dusk one.",
		vibeLine: "Autumn spy. A house, a mother-figure, a last stand."
	}),
	work({
		id: "casino-royale",
		name: "Casino Royale",
		year: "2006",
		runtime: "2h 24m",
		loved: true,
		weight: .36,
		family: "spy",
		vibes: [
			"summer",
			"dusk",
			"rewatch"
		],
		seasons: ["summer"],
		facets: {
			spy: .9,
			euro: .55,
			cool: .7,
			moral: .4,
			grief: .35
		},
		summary: "Bond before the pose, bleeding in a stairwell, then in love at a poker table in Montenegro.",
		why: "Listed twice for a reason: it is both a Bond and a euro-summer film. Heat, water, and a feeling he is not supposed to have.",
		vibeLine: "Late summer. Beautiful, and it ends badly."
	}),
	work({
		id: "tomorrow-never-dies",
		name: "Tomorrow Never Dies",
		year: "1997",
		runtime: "1h 59m",
		loved: true,
		weight: .28,
		family: "spy",
		vibes: ["rewatch", "heat"],
		facets: {
			spy: .7,
			cool: .55,
			comfort: .45
		},
		summary: "A media baron starts a war for the exclusive. Bond and a Chinese agent steal a car and a night.",
		why: "The playful Bond on your list. Craft and a chase, not a tragedy.",
		vibeLine: "Rewatch when you want the machine, not the mood."
	}),
	work({
		id: "goldfinger",
		name: "Goldfinger",
		year: "1964",
		runtime: "1h 50m",
		loved: true,
		weight: .3,
		family: "spy",
		vibes: ["rewatch", "summer"],
		facets: {
			spy: .75,
			cool: .8,
			comfort: .55,
			satire: .25
		},
		summary: "The template: gold, a laser, a crime that is almost a joke. Connery already bored of being impressed.",
		why: "Cool as lineage. Thomas Crown and Bullitt inherit this shrug.",
		vibeLine: "Classic rewatch. Style first."
	}),
	work({
		id: "spectre",
		name: "Spectre",
		year: "2015",
		runtime: "2h 28m",
		loved: true,
		weight: .26,
		family: "spy",
		vibes: ["dusk", "rewatch"],
		facets: {
			spy: .7,
			cool: .5,
			institution: .35,
			comfort: .35
		},
		summary: "Bond goes after the author of his own story, through Mexico, Rome, and a clinic in the Alps.",
		why: "You kept it on the list. It is the connective Bond — less sharp than Casino Royale, still part of the craft cluster.",
		vibeLine: "A long spy night. Rome in the middle."
	}),
	work({
		id: "live-and-let-die",
		name: "Live and Let Die",
		year: "1973",
		runtime: "2h 1m",
		loved: true,
		weight: .28,
		family: "spy",
		vibes: ["summer", "rewatch"],
		seasons: ["summer"],
		facets: {
			spy: .65,
			cool: .5,
			weird: .35,
			comfort: .4
		},
		summary: "Moore's first Bond, tarot and boats in Louisiana, a villain who believes his own religion.",
		why: "The strange Bond. A little folk at the edges of the tuxedo — which is why it survived on your list.",
		vibeLine: "Summer oddity. Boats, cards, a grin."
	}),
	work({
		id: "no-time-to-die",
		name: "No Time to Die",
		year: "2021",
		runtime: "2h 43m",
		loved: true,
		weight: .3,
		family: "spy",
		vibes: ["dusk"],
		seasons: ["autumn"],
		facets: {
			spy: .75,
			grief: .55,
			moral: .45,
			cool: .4
		},
		summary: "Bond is done, then isn't. A last film about whether a man in this job gets to have a life.",
		why: "The grief Bond. Closer to Skyfall's house than to Goldfinger's joke.",
		vibeLine: "Dusk. An ending, so only if you want one."
	}),
	work({
		id: "style-woody",
		name: "Woody Allen",
		year: "",
		runtime: "",
		loved: true,
		hidden: true,
		weight: .9,
		family: "euro",
		vibes: ["summer"],
		facets: {
			talk: .85,
			euro: .55,
			moral: .6,
			satire: .65,
			domestic: .4
		},
		summary: "The mode, not one film.",
		why: "Hidden anchor so the talky, guilty, sometimes-European comedies pull the shelf without pretending you named forty titles.",
		vibeLine: ""
	}),
	work({
		id: "vicky-cristina",
		name: "Vicky Cristina Barcelona",
		year: "2008",
		runtime: "1h 36m",
		loved: true,
		family: "euro",
		vibes: ["summer"],
		seasons: ["summer"],
		facets: {
			euro: .95,
			talk: .8,
			satire: .45,
			moral: .4,
			comfort: .35
		},
		summary: "Two Americans in Barcelona get pulled into an artist's life and then his ex-wife's. Summer, desire, and talk that goes too far.",
		why: "The Woody film you named. Euro summer as a moral mess with good light, not as a postcard.",
		vibeLine: "Hot stone, a villa, people saying the unsafe thing."
	}),
	work({
		id: "raging-bull",
		name: "Raging Bull",
		year: "1980",
		runtime: "2h 9m",
		loved: true,
		weight: .55,
		family: "obsession",
		vibes: ["heat"],
		facets: {
			obsession: .85,
			crime: .35,
			moral: .6,
			grief: .55,
			cool: .3
		},
		summary: "Jake LaMotta in the ring and at the table, destroying the people who stay. Black and white, and mean at home.",
		why: "Scorsese when the subject is the body and the jealousy, not the crew. Whiplash's cousin, with no teacher to blame.",
		vibeLine: "Heat without glamour. A man who cannot stop."
	}),
	work({
		id: "casino",
		name: "Casino",
		year: "1995",
		runtime: "2h 58m",
		loved: true,
		weight: .55,
		family: "crime",
		vibes: ["heat"],
		facets: {
			crime: .9,
			cool: .45,
			moral: .4,
			talk: .55,
			obsession: .4
		},
		summary: "Las Vegas skim, a marriage made of money, and the voiceover that already knows how it ends.",
		why: "Goodfellas' colder twin. You like the business of crime as much as the friendship.",
		vibeLine: "A long heat night. Count the money, then the bodies."
	}),
	work({
		id: "goodfellas",
		name: "Goodfellas",
		year: "1990",
		runtime: "2h 25m",
		loved: true,
		weight: .7,
		family: "crime",
		vibes: ["heat", "rewatch"],
		facets: {
			crime: .95,
			cool: .5,
			talk: .6,
			moral: .45,
			comfort: .4
		},
		summary: "Henry Hill wants to be a gangster, and for a while the film agrees with him. Then the helicopters.",
		why: "The other pole from Lamb. Appetite, talk, loyalty that was always a transaction. The crime side of the deck answers to this.",
		vibeLine: "Heat. Copacabana night, or the coke night. You know which."
	}),
	work({
		id: "gangs-of-new-york",
		name: "Gangs of New York",
		year: "2002",
		runtime: "2h 47m",
		loved: true,
		weight: .5,
		family: "crime",
		vibes: ["heat", "court"],
		facets: {
			crime: .7,
			war: .45,
			court: .35,
			moral: .5,
			faith: .3
		},
		summary: "Five Points, a boy back for his father, and a city about to be drafted into a larger war.",
		why: "You wrote NY Gangs. Historical crime — the street as a nation, which is also Boardwalk and Gangs' own priest problem.",
		vibeLine: "Heat with mud on it. A long one."
	}),
	work({
		id: "the-departed",
		name: "The Departed",
		year: "2006",
		runtime: "2h 31m",
		loved: true,
		weight: .6,
		family: "crime",
		vibes: ["heat", "dusk"],
		facets: {
			crime: .85,
			moral: .6,
			spy: .35,
			talk: .5,
			institution: .4
		},
		summary: "A cop in the gang, a gangster in the police, Boston as a small town with badges.",
		why: "Crime plus the double life, which is your spy shelf leaking into Scorsese. Identity under pressure.",
		vibeLine: "Dusk heat. Phones, roofs, nobody clean."
	}),
	work({
		id: "bone-collector",
		name: "The Bone Collector",
		year: "1999",
		runtime: "1h 58m",
		loved: true,
		weight: .45,
		family: "crime",
		vibes: ["dusk"],
		facets: {
			crime: .6,
			institution: .35,
			obsession: .4,
			moral: .3
		},
		summary: "A paralyzed detective and a young cop work a killer through a radio and a grid of New York clues.",
		why: "Procedural, which you also keep via The Killing and The Bone Collector's puzzle. Not the taste's center. A rewatch when you want the case.",
		vibeLine: "A case night. Clues, not myth."
	}),
	work({
		id: "interstellar",
		name: "Interstellar",
		year: "2014",
		runtime: "2h 49m",
		loved: true,
		weight: .45,
		family: "weird",
		vibes: ["rewatch", "dusk"],
		facets: {
			weird: .55,
			grief: .6,
			moral: .45,
			obsession: .5,
			comfort: .35,
			faith: .2
		},
		summary: "A father leaves Earth through a wormhole because the children will starve. Time is the villain that loves him back.",
		why: "Nolan when the engine is grief, not the heist. Parenthood again — your quiet theme, here with a spaceship.",
		vibeLine: "A long rewatch. Father and clock."
	}),
	work({
		id: "passion",
		name: "The Passion of the Christ",
		year: "2004",
		runtime: "2h 7m",
		loved: true,
		weight: .75,
		family: "faith",
		vibes: ["folk"],
		seasons: ["winter"],
		facets: {
			faith: .95,
			grief: .7,
			war: .35,
			moral: .5
		},
		summary: "The last hours, in Aramaic, with the body as the argument. Not a gentle holy week film.",
		why: "Faith on your shelf is austere and physical — Leviathan, this, not a lesson with a smile. The deck treats preachy as a penalty; this one you already chose.",
		vibeLine: "Only if you want the weight. Not a mood pick."
	}),
	work({
		id: "dunkirk",
		name: "Dunkirk",
		year: "2017",
		runtime: "1h 46m",
		loved: true,
		weight: .5,
		family: "war",
		vibes: ["dusk", "rewatch"],
		facets: {
			war: .9,
			cool: .45,
			moral: .4,
			obsession: .3
		},
		summary: "The evacuation told as three clocks: the mole, the sea, the air. Almost no backstory. The ticking is the script.",
		why: "War as craft. Warfare's older brother. Nolan without the speech about feelings, until the reading of the newspaper.",
		vibeLine: "Tight, loud, short. A dusk you can finish."
	}),
	work({
		id: "inception",
		name: "Inception",
		year: "2010",
		runtime: "2h 28m",
		loved: true,
		weight: .45,
		family: "weird",
		vibes: ["rewatch", "heat"],
		facets: {
			weird: .7,
			cool: .65,
			grief: .45,
			obsession: .5,
			crime: .3
		},
		summary: "A thief steals through dreams and is hired to plant an idea. The job is also a marriage he cannot leave.",
		why: "Puzzle craft you love, with a grief hiding in the mechanism. Prestige and Arrival live next door.",
		vibeLine: "Rewatch for the architecture. Stay for the guilt."
	}),
	work({
		id: "gone-with-the-wind",
		name: "Gone with the Wind",
		year: "1939",
		runtime: "3h 58m",
		loved: true,
		weight: .7,
		family: "court",
		vibes: ["court", "rewatch"],
		facets: {
			court: .75,
			war: .55,
			moral: .45,
			comfort: .4,
			grief: .5,
			talk: .4
		},
		summary: "Scarlett will not be poor, and the war takes the world that made that sentence possible. A full evening, not a whim.",
		why: "Scale and want. Court and ruin — the same muscle as The Age of Innocence, ruder and longer.",
		vibeLine: "Only when you have the night. A rewatch with an intermission."
	}),
	work({
		id: "age-of-innocence",
		name: "The Age of Innocence",
		year: "1993",
		runtime: "2h 19m",
		loved: true,
		weight: .75,
		family: "court",
		vibes: ["court", "summer"],
		seasons: ["summer", "autumn"],
		facets: {
			court: .85,
			talk: .7,
			moral: .65,
			euro: .35,
			grief: .45,
			cool: .3
		},
		summary: "Newland Archer is engaged to the right woman and in love with the wrong one. New York society does the violence with invitations.",
		why: "Scorsese without a gun. Manners as the mob. This is how your crime shelf and your period shelf are the same taste.",
		vibeLine: "Lamps, gloves, a feeling nobody is allowed to finish."
	}),
	work({
		id: "the-witch",
		name: "The Witch",
		year: "2015",
		runtime: "1h 32m",
		loved: true,
		family: "folk",
		vibes: ["folk"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .95,
			faith: .7,
			domestic: .65,
			grief: .55,
			weird: .4
		},
		summary: "A Puritan family banished to the edge of the wood starts to lose the children, the crop, and the story they tell about God.",
		why: "Folk and faith in one house. Lamb's austerity, with a theology that is the horror instead of a twist.",
		vibeLine: "Grey field. The folk night, stricter than Lamb."
	}),
	work({
		id: "another-round",
		name: "Another Round",
		year: "2020",
		runtime: "1h 57m",
		loved: true,
		family: "satire",
		vibes: ["dusk", "rewatch"],
		facets: {
			satire: .45,
			moral: .6,
			talk: .65,
			grief: .5,
			euro: .35,
			comfort: .3
		},
		summary: "Four teachers test the theory that life is better with a constant low dose of alcohol. It works, and then it is a tragedy.",
		why: "Mads, melancholy, a joke that becomes a life. The Hunt's director, softer, still unwilling to flatter them.",
		vibeLine: "Evening with friends. The dance at the end earns the rest."
	}),
	work({
		id: "prestige",
		name: "The Prestige",
		year: "2006",
		runtime: "2h 10m",
		loved: true,
		weight: .5,
		family: "obsession",
		vibes: ["dusk", "rewatch"],
		facets: {
			obsession: .9,
			weird: .45,
			moral: .55,
			cool: .5,
			crime: .25
		},
		summary: "Two magicians in London ruin their lives trying to own one trick. The pledge, the turn, the prestige.",
		why: "Nolan as obsession, which is your Whiplash register. A rewatch you can still argue about after.",
		vibeLine: "Dusk puzzle. Don't explain it to the room."
	}),
	work({
		id: "arrival",
		name: "Arrival",
		year: "2016",
		runtime: "1h 56m",
		loved: true,
		family: "weird",
		vibes: ["dusk", "folk"],
		facets: {
			weird: .65,
			grief: .75,
			talk: .7,
			moral: .55,
			faith: .25
		},
		summary: "A linguist is asked to talk to whatever landed. The language changes what a sentence can do to a life.",
		why: "Grief and a system of meaning. Not a war-of-the-worlds film. Closer to Hamnet and Interstellar than to spectacle.",
		vibeLine: "Quiet dusk. Words, a child, a choice."
	}),
	work({
		id: "once-upon-america",
		name: "Once Upon a Time in America",
		year: "1984",
		runtime: "3h 49m",
		loved: true,
		weight: .8,
		family: "crime",
		vibes: ["heat", "dusk"],
		facets: {
			crime: .85,
			grief: .6,
			moral: .55,
			euro: .2,
			talk: .4
		},
		summary: "Jewish boys in New York become gangsters, and an old man tries to remember which betrayal was his. A long evening.",
		why: "Crime as memory and regret, not as a good time. The anti-Goodfellas on the same shelf — you kept both.",
		vibeLine: "Only with the whole night. Opium, friendship, the bill."
	}),
	work({
		id: "the-hunt",
		name: "The Hunt",
		year: "2012",
		runtime: "1h 55m",
		loved: true,
		family: "grief",
		vibes: ["dusk", "folk"],
		seasons: ["autumn", "winter"],
		facets: {
			moral: .95,
			grief: .7,
			talk: .6,
			domestic: .55,
			faith: .35
		},
		summary: "A kindergarten teacher in a Danish town is accused of the worst thing. The community decides before the facts do.",
		why: "Mads, judgment, a small town that would rather be certain. Leviathan's cousin, without the mayor's office.",
		vibeLine: "Winter village. Hard to watch, which is the point."
	}),
	work({
		id: "manchester",
		name: "Manchester by the Sea",
		year: "2016",
		runtime: "2h 17m",
		loved: true,
		family: "grief",
		vibes: ["dusk", "folk"],
		seasons: ["winter"],
		facets: {
			grief: .95,
			domestic: .6,
			moral: .5,
			talk: .45
		},
		summary: "A janitor goes home when his brother dies and is asked to raise the boy. He is not able to become that man.",
		why: "Grief that does not redeem. Hamnet weeps toward art. This one refuses the third act you might want.",
		vibeLine: "Cold harbor. No lesson at the end."
	}),
	work({
		id: "the-killing",
		name: "The Killing",
		year: "2007",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "crime",
		vibes: ["dusk", "folk"],
		seasons: ["autumn", "winter"],
		facets: {
			crime: .7,
			moral: .75,
			grief: .65,
			talk: .5,
			institution: .4
		},
		summary: "The Danish one. A detective and a family, a murdered girl, a case that ruins the people solving it. Copenhagen rain.",
		why: "Procedure with a moral cost. The Bridge, The Hunt, and your Apple legal dramas all answer to this weather.",
		vibeLine: "Rain. One episode if you are tired, a run if you are not."
	}),
	work({
		id: "hannibal",
		name: "Hannibal",
		year: "2013",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "weird",
		vibes: ["folk", "dusk"],
		facets: {
			weird: .7,
			crime: .55,
			faith: .25,
			obsession: .65,
			cool: .45,
			moral: .4
		},
		summary: "Will Graham profiles killers and eats dinner with the one he cannot see. Baroque, awful, and oddly tender.",
		why: "Horror as taste and friendship. Not Lamb's austerity — the ornate twin. Mindhunter is the dry version, on the new shelf.",
		vibeLine: "A rich, uneasy episode. Not while you eat, unless you mean to."
	}),
	work({
		id: "true-detective",
		name: "True Detective",
		year: "2014",
		kind: "series",
		runtime: "season one",
		loved: true,
		family: "folk",
		vibes: ["folk", "dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .6,
			crime: .7,
			moral: .65,
			weird: .45,
			talk: .55,
			faith: .3
		},
		summary: "Season one only, on your list. Two Louisiana detectives, a cult in the cane, a time jump that makes them liars.",
		why: "Crime wearing folk horror's mask. From is the maze you still watch. This is the season where the philosophy and the body both count.",
		vibeLine: "Flat land, yellow light, a long conversation in a car."
	}),
	work({
		id: "fargo",
		name: "Fargo",
		year: "2014",
		kind: "series",
		runtime: "season one",
		loved: true,
		family: "crime",
		vibes: ["dusk", "folk"],
		seasons: ["winter"],
		facets: {
			crime: .75,
			satire: .55,
			moral: .6,
			folk: .3,
			weird: .35
		},
		summary: "Season one. A mild man in Minnesota meets a drifter who is not mild, and the snow covers the rest.",
		why: "Coen moral comedy stretched into a season. Death of Stalin's cousin in a nicer voice: violence, politeness, consequence.",
		vibeLine: "Winter. Polite, then not."
	}),
	work({
		id: "breaking-bad",
		name: "Breaking Bad",
		year: "2008",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .85,
		family: "crime",
		vibes: ["heat", "rewatch"],
		facets: {
			crime: .85,
			moral: .8,
			obsession: .55,
			domestic: .5,
			talk: .4
		},
		summary: "A chemistry teacher decides pride is a better death than cancer. The family is who pays.",
		why: "Moral decay inside a household. You have the whole crime canon. This is the one about a man choosing to become the villain.",
		vibeLine: "Heat. An episode, or the slide you already know."
	}),
	work({
		id: "mad-men",
		name: "Mad Men",
		year: "2007",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "court",
		vibes: ["dusk", "rewatch"],
		seasons: ["autumn"],
		facets: {
			talk: .85,
			moral: .6,
			cool: .55,
			domestic: .5,
			satire: .35,
			comfort: .4
		},
		summary: "Advertising men in the sixties perform being fine. The work is the costume. The marriage is the plot.",
		why: "Talk, double lives, a beautiful surface over a moral mess. The Americans without the spy excuse — or with a different one.",
		vibeLine: "Dusk rewatch. One episode, a drink, no rush."
	}),
	work({
		id: "the-americans",
		name: "The Americans",
		year: "2013",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "spy",
		vibes: ["dusk", "rewatch"],
		seasons: ["autumn"],
		facets: {
			spy: .95,
			moral: .85,
			domestic: .8,
			grief: .45,
			talk: .55,
			faith: .2
		},
		summary: "Two Soviet illegals in Reagan's Washington raise children and bury people in the same week. The marriage is the operation.",
		why: "The dusk anchor. Fall, you said, is this — secrecy inside a family, craft, and a bill that comes due. The spy shelf is measured here, not on gadget Bond.",
		vibeLine: "October. Kitchen light, a wig, a conversation they shouldn't survive."
	}),
	work({
		id: "medici",
		name: "Medici",
		year: "2016",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .7,
		family: "court",
		vibes: ["court", "summer"],
		seasons: ["summer"],
		facets: {
			court: .85,
			crime: .35,
			faith: .3,
			moral: .45,
			euro: .4
		},
		summary: "Florence, the bank, the family that buys a republic and calls it patronage.",
		why: "Court as a business. Tudors, Plantagenets, Age of Innocence — power in clothes, here with better stone.",
		vibeLine: "Warm stone. Intrigue you can leave after one episode."
	}),
	work({
		id: "band-of-brothers",
		name: "Band of Brothers",
		year: "2001",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "war",
		vibes: ["rewatch", "dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			war: .95,
			moral: .6,
			grief: .5,
			comfort: .35,
			talk: .3
		},
		summary: "Easy Company from training to the Eagle's Nest. The interviews with the real men are part of the memory of it.",
		why: "War you rewatch because of the unit, not the battle. Dunkirk is the clock. This is the friendship.",
		vibeLine: "A known episode on a cold night. Currahee, or the one you avoid."
	}),
	work({
		id: "boardwalk",
		name: "Boardwalk Empire",
		year: "2010",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .75,
		family: "crime",
		vibes: ["heat", "court"],
		facets: {
			crime: .85,
			court: .45,
			moral: .5,
			cool: .4,
			talk: .45
		},
		summary: "Atlantic City, Prohibition, a treasurer who is also the gangster. Politics and booze as the same ledger.",
		why: "Goodfellas slowed down and put in a suit. Historical crime, which is half your shelf.",
		vibeLine: "Heat in winter clothes. One careful episode."
	}),
	work({
		id: "entourage",
		name: "Entourage",
		year: "2004",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .4,
		family: "satire",
		vibes: ["summer", "rewatch"],
		seasons: ["summer"],
		facets: {
			satire: .45,
			comfort: .7,
			cool: .4,
			talk: .35
		},
		summary: "An actor and his friends from Queens take Hollywood as a group sport. Light on purpose.",
		why: "Kept small in the math so it doesn't pull the whole shelf toward hangout TV. A summer rewatch when the day was enough.",
		vibeLine: "Easy. Sun, insults, nothing at stake."
	}),
	work({
		id: "sopranos",
		name: "The Sopranos",
		year: "1999",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "crime",
		vibes: [
			"heat",
			"dusk",
			"rewatch"
		],
		facets: {
			crime: .9,
			domestic: .75,
			moral: .8,
			talk: .7,
			grief: .4,
			satire: .3
		},
		summary: "A New Jersey boss starts therapy because the panic attacks are bad for business. The family at home is the other crew.",
		why: "The crime anchor that is also a marriage. Goodfellas is the rise. This is the life after you got what you wanted and it made you sick.",
		vibeLine: "Dusk heat. Therapy, gravy, a dream you don't explain."
	}),
	work({
		id: "the-wire",
		name: "The Wire",
		year: "2002",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "institution",
		vibes: ["heat", "dusk"],
		facets: {
			institution: .9,
			crime: .75,
			moral: .85,
			talk: .65,
			grief: .35
		},
		summary: "Baltimore as a set of systems: corners, police, docks, city hall, schools, the paper. People are what the system spends.",
		why: "Institution over myth. Severance is the surreal office. This is the real one, and you already did the work of watching it.",
		vibeLine: "A serious episode. The case is the city."
	}),
	work({
		id: "tudors",
		name: "The Tudors",
		year: "2007",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .7,
		family: "court",
		vibes: ["court"],
		facets: {
			court: .9,
			faith: .45,
			moral: .4,
			crime: .3,
			euro: .2
		},
		summary: "Henry, the marriages, the ministers who think they can manage a king. Sex and execution on a short fuse.",
		why: "Court as appetite. Wolf Hall, on the new shelf, is the colder Cromwell. This is the one you already live with.",
		vibeLine: "Court. Jewels, then the axe."
	}),
	work({
		id: "plantagenets",
		name: "The Plantagenets",
		year: "documentary",
		kind: "series",
		runtime: "one part",
		loved: true,
		weight: .55,
		family: "court",
		vibes: ["court", "rewatch"],
		facets: {
			court: .8,
			war: .45,
			faith: .3,
			talk: .5
		},
		summary: "The YouTube history you already use. Dynasty, murder, and the long English argument about who gets the crown.",
		why: "Background court. It anchors the period shelf so Wolf Hall and Rome have somewhere to stand. A rewatch, not a premiere.",
		vibeLine: "Background on a quiet night. Maps and bad kings."
	}),
	work({
		id: "fringe",
		name: "Fringe",
		year: "2008",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "weird",
		vibes: ["rewatch", "dusk"],
		facets: {
			weird: .85,
			institution: .45,
			grief: .5,
			moral: .45,
			comfort: .55,
			faith: .15
		},
		summary: "An FBI agent, a mad scientist, and his son investigate cases that break physics. It becomes a story about a father.",
		why: "You were rewatching it. Pattern mysteries that turn into family. The comfort weird, next to Twin Peaks' harsher dream.",
		vibeLine: "Rewatch. One case, then the mythology if you want it."
	}),
	work({
		id: "twin-peaks-return",
		name: "Twin Peaks: The Return",
		year: "2017",
		kind: "series",
		runtime: "one part",
		loved: true,
		family: "weird",
		vibes: ["folk", "dusk"],
		facets: {
			weird: .95,
			folk: .45,
			grief: .4,
			moral: .35,
			domestic: .3
		},
		summary: "Twenty-five years later, and the town is not the comfort people misremember. Dougie, the arm, a nuclear test, a long drive.",
		why: "Dream logic you stayed with. Not a cozy mystery. The deck uses this as the far end of weird, so it doesn't recommend puzzle clones.",
		vibeLine: "Only if you want to be lost. Not a tonight for tired."
	}),
	work({
		id: "from",
		name: "From",
		year: "2022",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .65,
		family: "weird",
		vibes: ["folk", "dusk"],
		facets: {
			weird: .7,
			folk: .55,
			domestic: .4,
			moral: .35,
			institution: .2
		},
		summary: "A town you cannot leave, things in the dark, and a mythology that keeps adding doors. You are in it, including season four.",
		why: "Kept, and ranked under Widow's Bay. The maze is real for you. The deck will not assume it is the peak of the folk shelf.",
		vibeLine: "If you are mid-season, this is the rewatch. Otherwise let it cool."
	}),
	work({
		id: "severance",
		name: "Severance",
		year: "2022",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "institution",
		vibes: ["dusk", "rewatch"],
		facets: {
			institution: .95,
			weird: .7,
			moral: .6,
			cool: .45,
			grief: .35
		},
		summary: "A company splits your memory so the work-you never meets the home-you. The office is polite and wrong.",
		why: "The institution anchor. Sterile surreal, identity as an HR policy. Devs and Counterpart, on the shelf, have to beat this.",
		vibeLine: "Fluorescent dusk. One episode if the day already felt like an office."
	}),
	work({
		id: "silo",
		name: "Silo",
		year: "2023",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .8,
		family: "institution",
		vibes: ["dusk"],
		facets: {
			institution: .85,
			moral: .55,
			weird: .4,
			spy: .25,
			faith: .2
		},
		summary: "Humanity lives in a buried silo and is not allowed to ask what the outside is. A sheriff starts asking anyway.",
		why: "Institutional mystery with a physical world. Severance is the mind. This is the staircase. Same love of a rule that is a lie.",
		vibeLine: "Dusk bunker. One episode down the stairs."
	}),
	work({
		id: "presumed-innocent",
		name: "Presumed Innocent",
		year: "2024",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .7,
		family: "crime",
		vibes: ["dusk"],
		facets: {
			crime: .6,
			moral: .7,
			domestic: .55,
			talk: .6,
			institution: .45
		},
		summary: "A prosecutor is accused of murdering the colleague he was sleeping with. The marriage watches the trial.",
		why: "Legal dread inside a household. The Killing's question — who do you become in a case — moved into an American marriage.",
		vibeLine: "One tense episode. Not if you wanted to relax."
	}),
	work({
		id: "defending-jacob",
		name: "Defending Jacob",
		year: "2020",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .75,
		family: "grief",
		vibes: ["dusk", "folk"],
		facets: {
			grief: .7,
			moral: .75,
			domestic: .8,
			crime: .55,
			talk: .45
		},
		summary: "A prosecutor's son is accused of killing a classmate. The parents have to decide what they are willing to know.",
		why: "Parenthood as moral horror without a monster in the barn. Lamb's question in a courtroom: what will you protect, and what is it.",
		vibeLine: "Family dread. A suburban night, no supernatural required."
	}),
	work({
		id: "black-bird",
		name: "Black Bird",
		year: "2022",
		kind: "series",
		runtime: "one episode",
		loved: true,
		weight: .7,
		family: "crime",
		vibes: ["dusk"],
		facets: {
			crime: .7,
			moral: .65,
			talk: .6,
			institution: .4,
			grief: .35
		},
		summary: "A convict is offered freedom if he can draw a confession out of a suspected serial killer in the next cell.",
		why: "Two-handed dread. Hannibal's intimacy without the opera — a limited run, which suits a tonight better than a mythology.",
		vibeLine: "A short series. Talk in a cell."
	}),
	work({
		id: "drops-of-god",
		name: "Drops of God",
		year: "2023",
		kind: "series",
		runtime: "one episode",
		loved: true,
		family: "obsession",
		vibes: ["summer", "court"],
		seasons: ["summer"],
		facets: {
			obsession: .7,
			euro: .55,
			talk: .5,
			moral: .35,
			comfort: .3,
			grief: .35
		},
		summary: "A father's wine legacy splits between his daughter and his star pupil. Taste is the contest. Family is the wound.",
		why: "Obsession with a sensual craft, euro light, inheritance. The Taste of Things is on the shelf because of this, not because of food TV.",
		vibeLine: "Summer evening. One glass, one episode, no rush."
	}),
	work({
		id: "servant",
		name: "Servant",
		year: "2019",
		kind: "series",
		runtime: "one episode",
		loved: true,
		fromChat: true,
		family: "domestic",
		vibes: ["folk", "dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			domestic: .95,
			folk: .55,
			grief: .8,
			faith: .55,
			weird: .6
		},
		summary: "A Philadelphia couple hires a nanny for a baby that is not what the house pretends. You finished it. Cult, grief, and the apartment.",
		why: "From the earlier chat, not this paste. Domestic uncanny — parenthood, faith-adjacent, rooms that won't open. Drop it on Taste if it shouldn't anchor.",
		vibeLine: "Closed rooms. One half-hour if the night is already strange."
	}),
	work({
		id: "widows-bay",
		name: "Widow's Bay",
		year: "2026",
		kind: "series",
		runtime: "one episode",
		loved: true,
		fromChat: true,
		family: "folk",
		vibes: ["folk", "rewatch"],
		seasons: ["autumn", "summer"],
		facets: {
			folk: .75,
			weird: .6,
			satire: .55,
			domestic: .4,
			grief: .35,
			comfort: .35
		},
		summary: "Matthew Rhys is the mayor of a cursed New England island. Horror and comedy in the same breath. You preferred it to From.",
		why: "From the earlier chat. Folk dread that is allowed to be funny, which is why it outranks From. Not preachy. Not a puzzle for its own sake.",
		vibeLine: "Island night. A scare and a joke, neither apologizing."
	})
];
var SHELF = [
	work({
		id: "godfather",
		name: "The Godfather",
		year: "1972",
		runtime: "2h 55m",
		family: "crime",
		vibes: ["heat", "dusk"],
		seasons: ["autumn"],
		facets: {
			crime: .9,
			moral: .75,
			domestic: .7,
			talk: .55,
			faith: .25,
			cool: .4
		},
		summary: "A war hero comes home for his sister's wedding and ends up heir to the family. The business is olive oil until it isn't.",
		why: "You built Goodfellas, Casino, Sopranos, A Bronx Tale, Once Upon a Time in America — and left the Corleones off the list. Dynastic, quieter, heavier at the table.",
		vibeLine: "Heat that behaves. A long night, family first."
	}),
	work({
		id: "heat",
		name: "Heat",
		year: "1995",
		runtime: "2h 50m",
		family: "crime",
		vibes: ["heat", "dusk"],
		facets: {
			crime: .85,
			cool: .8,
			moral: .45,
			domestic: .4,
			talk: .4
		},
		summary: "A thief and a detective in Los Angeles recognize each other. There is a coffee, and later a street.",
		why: "Goodfellas is appetite and friends. Heat is the same city as craft: professionals, a cold marriage, Bullitt's precision instead of a party.",
		vibeLine: "Night city. Professional, not glamorous."
	}),
	work({
		id: "millers-crossing",
		name: "Miller's Crossing",
		year: "1990",
		runtime: "1h 55m",
		family: "crime",
		vibes: ["heat", "court"],
		facets: {
			crime: .8,
			talk: .75,
			moral: .55,
			cool: .6,
			satire: .25
		},
		summary: "A political boss's right hand tries to keep a gang war from eating the town, and from eating him.",
		why: "Coen crime with manners. The Age of Innocence's cruelty, plus a hat in the woods. Talkier than Goodfellas, meaner than Ocean's.",
		vibeLine: "Heat in a overcoat. Loyalty as a tactic."
	}),
	work({
		id: "a-prophet",
		name: "A Prophet",
		year: "2009",
		runtime: "2h 35m",
		family: "crime",
		vibes: ["heat"],
		facets: {
			crime: .85,
			moral: .6,
			institution: .55,
			obsession: .4,
			faith: .2
		},
		summary: "A young Arab man enters a French prison illiterate and leaves it as someone the Corsicans did not plan.",
		why: "Education inside a crew. Breaking Bad's rise, without the American myth. Hard, long, and fair about what power costs the face.",
		vibeLine: "A serious heat night. Not a comfort crime film."
	}),
	work({
		id: "irishman",
		name: "The Irishman",
		year: "2019",
		runtime: "3h 29m",
		family: "crime",
		vibes: ["heat", "dusk"],
		facets: {
			crime: .8,
			grief: .65,
			moral: .7,
			talk: .5
		},
		summary: "An old hitman remembers the man he loved and the union man he was told to remove. Scorsese at the end of the party.",
		why: "You have the young Scorsese crime films. This is the hangover: Goodfellas' narrator if he had to sit with it. Only if you have the length of Once Upon a Time in America.",
		vibeLine: "The long one. Regret, not the Copacabana."
	}),
	work({
		id: "donnie-brasco",
		name: "Donnie Brasco",
		year: "1997",
		runtime: "2h 7m",
		family: "crime",
		vibes: ["heat", "dusk"],
		facets: {
			crime: .8,
			moral: .65,
			spy: .45,
			domestic: .4,
			talk: .5
		},
		summary: "An FBI agent becomes the friend of a small-time wise guy who vouches for him. The friendship is the crime.",
		why: "The Departed's double life, played as melancholy instead of a thriller. Sopranos' small soldiers, seen from the one who isn't really one.",
		vibeLine: "Heat, subdued. A friendship with a wire."
	}),
	work({
		id: "gomorrah",
		name: "Gomorrah",
		year: "2014",
		kind: "series",
		runtime: "one episode",
		family: "crime",
		vibes: ["heat"],
		facets: {
			crime: .85,
			institution: .6,
			moral: .65,
			euro: .3
		},
		summary: "Naples' Camorra as a system: housing projects, haute couture, teenagers with guns. Not a family you root for.",
		why: "The Wire's method, in Italian crime. If Goodfellas still feels too much like a good time, this is the correction.",
		vibeLine: "Heat without charm. One episode is enough to know."
	}),
	work({
		id: "the-bureau",
		name: "The Bureau",
		year: "2015",
		kind: "series",
		runtime: "one episode",
		family: "spy",
		vibes: ["dusk"],
		seasons: ["autumn"],
		facets: {
			spy: .95,
			moral: .7,
			domestic: .45,
			talk: .55,
			institution: .6
		},
		summary: "French foreign intelligence. A handler comes home from Damascus and the lie he lived there follows him into the office.",
		why: "The Americans if the institution were the point as much as the marriage. Tradecraft, guilt, no gadgets. The highest spy suggestion on the shelf.",
		vibeLine: "October, fluorescent. One episode of careful talk."
	}),
	work({
		id: "tinker-tailor",
		name: "Tinker Tailor Soldier Spy",
		year: "2011",
		runtime: "2h 7m",
		family: "spy",
		vibes: ["dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			spy: .95,
			moral: .6,
			institution: .7,
			talk: .55,
			cool: .35,
			grief: .3
		},
		summary: "A retired spy is asked who in the Circus is Moscow's man. Rooms, files, and men who have already disappointed themselves.",
		why: "Skyfall is the autumn Bond with a house. This is the autumn spy film with no house left. The Americans' bureaucracy, British and exhausted.",
		vibeLine: "Dusk in an office. Patience required, and rewarded."
	}),
	work({
		id: "lives-of-others",
		name: "The Lives of Others",
		year: "2006",
		runtime: "2h 17m",
		family: "spy",
		vibes: ["dusk", "court"],
		seasons: ["autumn"],
		facets: {
			spy: .75,
			moral: .85,
			institution: .7,
			talk: .5,
			grief: .4
		},
		summary: "A Stasi officer wiretaps a playwright and starts to want the life he is destroying. East Berlin, 1984.",
		why: "Surveillance as a moral education. The Americans from the other side of the wall — one listener, not a marriage.",
		vibeLine: "Grey dusk. Headphones, a typewriter, a choice."
	}),
	work({
		id: "deutschland-83",
		name: "Deutschland 83",
		year: "2015",
		kind: "series",
		runtime: "one episode",
		family: "spy",
		vibes: ["dusk", "summer"],
		facets: {
			spy: .8,
			moral: .55,
			cool: .35,
			euro: .4,
			satire: .25
		},
		summary: "A young East German officer is thrown into the West as an aide. Pop songs, a possible war, a man not ready for either.",
		why: "The Americans, earlier and lonelier. Period craft, a moral education he didn't request. Shorter than a mythology.",
		vibeLine: "Night drive on the autobahn. One episode, then see."
	}),
	work({
		id: "munich",
		name: "Munich",
		year: "2005",
		runtime: "2h 44m",
		family: "spy",
		vibes: ["dusk"],
		facets: {
			spy: .7,
			moral: .9,
			war: .45,
			grief: .5,
			talk: .4
		},
		summary: "After the Olympic murders, a team is sent to kill the men Israel holds responsible. The list does not stay clean.",
		why: "Spy work as conscience. No Time to Die's grief without the tuxedo. You can take a film that argues with its own mission.",
		vibeLine: "Heavy dusk. Not a revenge fantasy."
	}),
	work({
		id: "army-of-shadows",
		name: "Army of Shadows",
		year: "1969",
		runtime: "2h 25m",
		family: "war",
		vibes: ["dusk"],
		facets: {
			war: .7,
			spy: .65,
			moral: .85,
			grief: .55
		},
		summary: "The French Resistance as logistics and betrayal. Brave, and often ugly about what the cell must do to itself.",
		why: "The Americans' moral bill, in occupied France. Band of Brothers believes in the unit. This one counts the cost of staying loyal.",
		vibeLine: "Grey, adult, no triumph score."
	}),
	work({
		id: "ronin",
		name: "Ronin",
		year: "1998",
		runtime: "2h 2m",
		family: "spy",
		vibes: ["heat", "summer"],
		seasons: ["summer"],
		facets: {
			spy: .55,
			cool: .75,
			crime: .5,
			euro: .35
		},
		summary: "Mercenaries in France chase a case nobody will explain. The car chases are the character work.",
		why: "Bullitt's attention, Casino Royale's Europe, none of the quips. A craft night when you want bodies in motion and thin talk.",
		vibeLine: "Summer asphalt. Chase, then a quiet double-cross."
	}),
	work({
		id: "the-leftovers",
		name: "The Leftovers",
		year: "2014",
		kind: "series",
		runtime: "one episode",
		family: "grief",
		vibes: ["folk", "dusk"],
		seasons: ["autumn"],
		facets: {
			grief: .9,
			faith: .7,
			weird: .65,
			domestic: .6,
			moral: .55
		},
		summary: "Two percent of the world vanishes. A town tries cults, police work, and family to explain a thing that will not explain.",
		why: "The strongest unseen match. Hamnet's grief, Twin Peaks' refusal to solve, Leviathan's faith without a sermon. Not a puzzle box.",
		vibeLine: "October. Start at season one. It becomes stranger, on purpose."
	}),
	work({
		id: "the-returned",
		name: "The Returned",
		year: "2012",
		kind: "series",
		runtime: "one episode",
		family: "folk",
		vibes: ["folk", "dusk"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .7,
			grief: .85,
			weird: .6,
			domestic: .65,
			faith: .25
		},
		summary: "The dead of a French town walk back in, the age they were, and sit down to dinner. The living are not ready.",
		why: "Servant's domestic impossible, Lamb's quiet, a whole town. Prefer this to another maze like From — the feeling is the plot.",
		vibeLine: "Damp night. The French series, not the remake."
	}),
	work({
		id: "devs",
		name: "Devs",
		year: "2020",
		kind: "series",
		runtime: "one episode",
		family: "institution",
		vibes: ["dusk"],
		facets: {
			institution: .8,
			weird: .6,
			moral: .55,
			faith: .35,
			grief: .4,
			cool: .3
		},
		summary: "A coder at a quantum company looks for her boyfriend inside a project that might already know the future.",
		why: "Severance's campus, Arrival's determinism, Garland's cold tone — you already trusted him with Warfare. Short series.",
		vibeLine: "Glass and redwoods. One episode, then the idea has you."
	}),
	work({
		id: "counterpart",
		name: "Counterpart",
		year: "2017",
		kind: "series",
		runtime: "one episode",
		family: "institution",
		vibes: ["dusk"],
		facets: {
			institution: .75,
			spy: .7,
			weird: .45,
			moral: .55,
			domestic: .4
		},
		summary: "A quiet UN clerk in Berlin learns there is another him across a door, and the other one is better at the life.",
		why: "Fringe's double world, played as The Americans: offices, marriages, spies. Identity without a speech about identity.",
		vibeLine: "Berlin dusk. Two men, one name."
	}),
	work({
		id: "dark",
		name: "Dark",
		year: "2017",
		kind: "series",
		runtime: "one episode",
		family: "weird",
		vibes: ["folk", "dusk"],
		seasons: ["autumn"],
		facets: {
			weird: .85,
			grief: .55,
			folk: .4,
			domestic: .5,
			faith: .2
		},
		summary: "Children go missing in a German town that is stuck in its own family tree. Time is not a metaphor.",
		why: "Fringe and Donnie Darko if they had stayed with one town. A diagram, yes — only start it if you want the diagram, unlike a Lamb night.",
		vibeLine: "Woods, bunkers, a chart you will pause."
	}),
	work({
		id: "andor",
		name: "Andor",
		year: "2022",
		kind: "series",
		runtime: "one episode",
		family: "institution",
		vibes: ["dusk", "court"],
		facets: {
			institution: .8,
			moral: .75,
			spy: .55,
			war: .45,
			talk: .5
		},
		summary: "A thief becomes useful to a rebellion that is mostly meetings, prisons, and people who will be spent.",
		why: "You like crafted sagas — LOTR, Bond, Nolan — when the institution has a moral cost. This is the one in that universe that behaves like The Bureau.",
		vibeLine: "Dusk politics. Skip if you wanted space noise."
	}),
	work({
		id: "silence",
		name: "Silence",
		year: "2016",
		runtime: "2h 41m",
		family: "faith",
		vibes: ["folk", "court"],
		seasons: ["winter"],
		facets: {
			faith: .95,
			moral: .8,
			grief: .6,
			folk: .35,
			war: .25
		},
		summary: "Two Jesuit priests go to Japan to find a mentor who may have renounced God. The film waits with them.",
		why: "Scorsese, whom you already trust, on faith as endurance rather than triumph. Passion is the body. This is the silence after. Not a sermon.",
		vibeLine: "Winter. Mud, a choice, no comfort music."
	}),
	work({
		id: "first-reformed",
		name: "First Reformed",
		year: "2017",
		runtime: "1h 53m",
		family: "faith",
		vibes: ["dusk", "folk"],
		facets: {
			faith: .85,
			moral: .8,
			grief: .55,
			obsession: .5,
			talk: .45
		},
		summary: "A small-church pastor keeps a journal, meets a radical, and starts to come apart in the rectory.",
		why: "Faith in crisis, Paul Schrader, austere as Leviathan. It does not tell you to agree with him. Whiplash's single-mindedness, pointed at God.",
		vibeLine: "A bare room. Only if you want the argument."
	}),
	work({
		id: "loveless",
		name: "Loveless",
		year: "2017",
		runtime: "2h 7m",
		family: "grief",
		vibes: ["dusk"],
		seasons: ["winter"],
		facets: {
			grief: .85,
			moral: .7,
			domestic: .75,
			faith: .15
		},
		summary: "A divorcing Moscow couple notice, late, that their son is gone. Zvyagintsev again, after Leviathan.",
		why: "You already live with Leviathan. This is the domestic one: a missing child as the verdict on a household. Manchester's refusal, Russian.",
		vibeLine: "Winter city. Cold on purpose."
	}),
	work({
		id: "return-2003",
		name: "The Return",
		year: "2003",
		runtime: "1h 50m",
		family: "grief",
		vibes: ["folk", "dusk"],
		seasons: ["summer", "autumn"],
		facets: {
			grief: .75,
			folk: .4,
			moral: .65,
			domestic: .55
		},
		summary: "Zvyagintsev. Two boys are taken on a trip by a father they do not remember. An island, a knife, a test.",
		why: "Not Twin Peaks. The other Return: fathers, silence, a landscape that judges. The Hunt and Lamb understand this quiet.",
		vibeLine: "Water and a father. Short, hard, plain."
	}),
	work({
		id: "a-separation",
		name: "A Separation",
		year: "2011",
		runtime: "2h 3m",
		family: "grief",
		vibes: ["dusk", "court"],
		facets: {
			moral: .9,
			domestic: .8,
			talk: .75,
			faith: .35,
			grief: .45
		},
		summary: "A Tehran marriage comes apart, and a fight with a caretaker becomes a court case nobody can tell honestly.",
		why: "Moral weight in a household, the way The Hunt and Defending Jacob work: everyone has a reason, and the reason is not enough.",
		vibeLine: "Talk in a kitchen, then a courtroom. No villains."
	}),
	work({
		id: "aftersun",
		name: "Aftersun",
		year: "2022",
		runtime: "1h 42m",
		family: "grief",
		vibes: ["summer", "dusk"],
		seasons: ["summer"],
		facets: {
			grief: .85,
			domestic: .55,
			euro: .45,
			moral: .3
		},
		summary: "A father and daughter on a cheap Turkish holiday, remembered later by the daughter who finally understands the trip.",
		why: "Parenthood without horror furniture. Hamnet and Manchester, whispered. Euro light used for sadness, not for Vicky Cristina's mess.",
		vibeLine: "Late summer. Small, and it stays."
	}),
	work({
		id: "festen",
		name: "Festen",
		year: "1998",
		runtime: "1h 45m",
		family: "domestic",
		vibes: ["heat", "court"],
		facets: {
			domestic: .85,
			moral: .8,
			satire: .35,
			talk: .6,
			grief: .55
		},
		summary: "A Danish birthday. The eldest son stands up and says what the family did. Nobody wants dessert interrupted.",
		why: "The Hunt's country, a family instead of a town. Manners as violence — Age of Innocence with the gloves off.",
		vibeLine: "A dinner you cannot leave. Danish, handheld, short."
	}),
	work({
		id: "babadook",
		name: "The Babadook",
		year: "2014",
		runtime: "1h 34m",
		family: "domestic",
		vibes: ["folk", "dusk"],
		facets: {
			domestic: .8,
			grief: .85,
			folk: .55,
			weird: .4
		},
		summary: "A widow and her son read a pop-up book that will not leave the house. The monster is grief with a hat.",
		why: "Lamb's parenthood, Servant's house, louder. Not a sermon about loss — the loss is allowed to be monstrous.",
		vibeLine: "One sitting. House, child, no joke except the book."
	}),
	work({
		id: "saint-maud",
		name: "Saint Maud",
		year: "2019",
		runtime: "1h 24m",
		family: "faith",
		vibes: ["folk"],
		seasons: ["autumn"],
		facets: {
			faith: .85,
			obsession: .7,
			folk: .4,
			grief: .45,
			domestic: .35
		},
		summary: "A private nurse believes God wants a special suffering from her and from the dying dancer she cares for.",
		why: "Faith as obsession, which you already keep in Passion and Whiplash. Austere, short, not a tract. It is afraid of her certainty.",
		vibeLine: "Coastal town, one woman, a private god."
	}),
	work({
		id: "let-the-right-one-in",
		name: "Let the Right One In",
		year: "2008",
		runtime: "1h 54m",
		family: "folk",
		vibes: ["folk"],
		seasons: ["winter"],
		facets: {
			folk: .7,
			grief: .55,
			domestic: .4,
			moral: .45,
			weird: .5
		},
		summary: "A bullied boy in a Swedish suburb meets a child who is not a child. Snow, and a friendship with rules.",
		why: "Horror as a lonely contract. It Follows' rules, Lamb's tenderness, none of the American gloss. The Swedish one, not the remake.",
		vibeLine: "Winter dark at 3pm. Quiet on purpose."
	}),
	work({
		id: "the-orphanage",
		name: "The Orphanage",
		year: "2007",
		runtime: "1h 45m",
		family: "domestic",
		vibes: ["folk"],
		seasons: ["autumn"],
		facets: {
			domestic: .7,
			grief: .8,
			folk: .6,
			faith: .2,
			weird: .35
		},
		summary: "A woman returns to the orphanage where she grew up, and her son starts to play with children who are not there.",
		why: "Servant and Hereditary's lost child, Spanish, and more tender than either. A ghost story that is actually about a mother.",
		vibeLine: "An old house. Sad more than cruel."
	}),
	work({
		id: "innocents-2021",
		name: "The Innocents",
		year: "2021",
		runtime: "1h 57m",
		family: "folk",
		vibes: ["folk", "summer"],
		seasons: ["summer"],
		facets: {
			folk: .55,
			moral: .6,
			domestic: .45,
			weird: .5,
			grief: .3
		},
		summary: "Norwegian children on a housing estate discover what they can do to each other when the adults are inside. Summer light, bad games.",
		why: "The Hunt's question — what children are capable of knowing — without the courtroom. Not cute magic. A bright, uneasy day.",
		vibeLine: "Summer that goes wrong. Quiet apartment blocks."
	}),
	work({
		id: "his-house",
		name: "His House",
		year: "2020",
		runtime: "1h 33m",
		family: "folk",
		vibes: ["folk", "dusk"],
		facets: {
			folk: .7,
			grief: .75,
			domestic: .65,
			moral: .6,
			faith: .25
		},
		summary: "A refugee couple in an English house are haunted by what they did to get on the boat. The walls know.",
		why: "Folk horror as guilt and parenthood. Lamb's quiet bargain, moved into a council house. It does not lecture you about borders.",
		vibeLine: "Short. A house that should have been safety."
	}),
	work({
		id: "lighthouse",
		name: "The Lighthouse",
		year: "2019",
		runtime: "1h 49m",
		family: "weird",
		vibes: ["folk"],
		seasons: ["winter"],
		facets: {
			weird: .75,
			folk: .55,
			obsession: .5,
			faith: .3,
			satire: .25
		},
		summary: "Two wickies on a rock lose the difference between work, drink, and myth. Black and white, and loud.",
		why: "The Witch's director, funnier and drunker. Folk without a family — obsession and weather. A stretch from Lamb toward Raging Bull's body.",
		vibeLine: "Storm night. Not subtle. Not long."
	}),
	work({
		id: "november",
		name: "November",
		year: "2017",
		runtime: "1h 55m",
		family: "folk",
		vibes: ["folk"],
		seasons: ["autumn", "winter"],
		facets: {
			folk: .95,
			faith: .45,
			weird: .6,
			euro: .2,
			grief: .3
		},
		summary: "Estonian peasants bargain with the devil, build servants out of farm tools, and still manage to fall in love badly.",
		why: "You Won't Be Alone's village magic, stranger and drier. If Lamb felt too restrained, this is the pagan one. Not a jump film.",
		vibeLine: "Black and white village. The title is the season."
	}),
	work({
		id: "you-are-not-my-mother",
		name: "You Are Not My Mother",
		year: "2021",
		runtime: "1h 33m",
		family: "folk",
		vibes: ["folk"],
		seasons: ["autumn"],
		facets: {
			folk: .75,
			domestic: .7,
			grief: .55,
			faith: .25
		},
		summary: "A Dublin teenager's mother disappears and comes back wrong, just as the neighborhood prepares a folk fire.",
		why: "Servant's replaced person, Irish, smaller than Hereditary. Family horror that still cares about the girl at school.",
		vibeLine: "Halloween streets. A short, sad one."
	}),
	work({
		id: "wolf-hall",
		name: "Wolf Hall",
		year: "2015",
		kind: "series",
		runtime: "one episode",
		family: "court",
		vibes: ["court", "dusk"],
		facets: {
			court: .9,
			talk: .7,
			moral: .65,
			faith: .4,
			spy: .35
		},
		summary: "Thomas Cromwell, low-born, keeps Henry VIII's will from breaking the state. Candlelight, and very little shouting.",
		why: "You wrote Thomas Cromwell under Steve McQueen. This is the Cromwell: court as a crime family, a still face, patience. Tudors is the soap. This is the knife under it.",
		vibeLine: "Court at dusk. Speak softly. The first series."
	}),
	work({
		id: "barry-lyndon",
		name: "Barry Lyndon",
		year: "1975",
		runtime: "3h 5m",
		family: "court",
		vibes: ["court", "summer"],
		facets: {
			court: .85,
			moral: .55,
			cool: .5,
			war: .3,
			satire: .35,
			euro: .4
		},
		summary: "An Irish nobody climbs into the aristocracy by duel, marriage, and luck, and the narration already pities him.",
		why: "The Age of Innocence's cruel manners, painted. A long euro-court night. Kubrick, so the beauty is a trap, not a postcard.",
		vibeLine: "Only with three hours. Candlelight, a rise, a fall."
	}),
	work({
		id: "shogun",
		name: "Shōgun",
		year: "2024",
		kind: "series",
		runtime: "one episode",
		family: "court",
		vibes: ["court", "dusk"],
		facets: {
			court: .85,
			spy: .45,
			war: .5,
			moral: .55,
			faith: .3,
			talk: .4
		},
		summary: "An English pilot is wrecked in Japan and becomes useful to a lord who is not supposed to win. Translation is power.",
		why: "Court, war, and a stranger who doesn't know the rules — Medici's intrigue with The Americans' double understanding. Limited series.",
		vibeLine: "Rain on wood. One episode to see if the patience fits."
	}),
	work({
		id: "rome",
		name: "Rome",
		year: "2005",
		kind: "series",
		runtime: "one episode",
		family: "court",
		vibes: ["court", "heat"],
		facets: {
			court: .8,
			crime: .45,
			war: .5,
			moral: .4,
			faith: .25
		},
		summary: "The end of the Republic, told through two soldiers and the families who use them. Dirt under the marble.",
		why: "Tudors' appetite with Band of Brothers' rank and file. Historical power as a street, which is also Gangs of New York.",
		vibeLine: "Court with mud. An episode, not a lecture."
	}),
	work({
		id: "thin-red-line",
		name: "The Thin Red Line",
		year: "1998",
		runtime: "2h 50m",
		family: "war",
		vibes: ["dusk", "folk"],
		facets: {
			war: .85,
			faith: .4,
			grief: .55,
			moral: .6,
			folk: .25
		},
		summary: "Guadalcanal, whispered. Men in tall grass ask what a soul is doing in a battle. Malick, so the island answers back.",
		why: "Dunkirk is a clock. This is the war film that behaves like folk: awe, cruelty, no briefing. A stretch, and a real one.",
		vibeLine: "Long, green, quiet between the assaults."
	}),
	work({
		id: "come-and-see",
		name: "Come and See",
		year: "1985",
		runtime: "2h 22m",
		family: "war",
		vibes: ["folk"],
		facets: {
			war: .95,
			grief: .8,
			folk: .35,
			faith: .2,
			moral: .55
		},
		summary: "A Belarusian boy joins the partisans and the war removes his face. The harshest thing on this shelf. Not a tonight if you wanted Bond.",
		why: "Only because Warfare and Dunkirk are clean by comparison, and Leviathan proved you can sit with Russian dread. All-time weight, low tonight unless you mean it.",
		vibeLine: "Do not put this on casually. Once is the point."
	}),
	work({
		id: "chernobyl",
		name: "Chernobyl",
		year: "2019",
		kind: "series",
		runtime: "one episode",
		family: "institution",
		vibes: ["dusk"],
		facets: {
			institution: .85,
			moral: .8,
			war: .25,
			grief: .45,
			talk: .5
		},
		summary: "The reactor burns and the state decides what may be said about it. Scientists, miners, and a lie with a deadline.",
		why: "The Wire's system failure, Soviet, five episodes. Leviathan's state, with a physical emergency. Limited, so it can be a week rather than a life.",
		vibeLine: "Dusk, procedural. Start at the beginning. It's short."
	}),
	work({
		id: "all-quiet",
		name: "All Quiet on the Western Front",
		year: "2022",
		runtime: "2h 28m",
		family: "war",
		vibes: ["dusk"],
		seasons: ["autumn"],
		facets: {
			war: .9,
			grief: .6,
			moral: .5
		},
		summary: "German boys are sent to the trenches and the mud keeps the uniform longer than the person. The recent one.",
		why: "Dunkirk's craft from the other trench, less triumphant on purpose. A war night when Band of Brothers feels too much like legend.",
		vibeLine: "Mud and a ceasefire that lies. One sitting."
	}),
	work({
		id: "oppenheimer",
		name: "Oppenheimer",
		year: "2023",
		runtime: "3h",
		family: "obsession",
		vibes: ["dusk", "court"],
		facets: {
			obsession: .8,
			moral: .85,
			institution: .6,
			talk: .7,
			war: .45
		},
		summary: "The man who built the bomb, then the hearing that tries to unbuild the man. Nolan, mostly in rooms.",
		why: "You have Prestige, Inception, Interstellar, Dunkirk, Batman — not this. Less spectacle than Interstellar, more guilt. A hearing as a thriller.",
		vibeLine: "A long dusk. Talk, then the light."
	}),
	work({
		id: "civil-war",
		name: "Civil War",
		year: "2024",
		runtime: "1h 49m",
		family: "war",
		vibes: ["heat"],
		facets: {
			war: .8,
			moral: .45,
			cool: .3,
			obsession: .25
		},
		summary: "Journalists drive toward a White House that is about to fall. Garland again, after the mode of Warfare: look, don't explain.",
		why: "You already took Warfare. This is the sister film — a road, photographs, violence without a speech telling you the lesson.",
		vibeLine: "Tense, short, contemporary. Not a comfort."
	}),
	work({
		id: "in-the-loop",
		name: "In the Loop",
		year: "2009",
		runtime: "1h 46m",
		family: "satire",
		vibes: ["heat", "court"],
		facets: {
			satire: .9,
			talk: .85,
			moral: .55,
			institution: .6,
			war: .25
		},
		summary: "A British minister says the wrong thing about a war and the rooms on two continents try to use him. Swearing as policy.",
		why: "The Death of Stalin's director, aimed at a war that has not started. Satire with teeth, not a lecture about politics.",
		vibeLine: "Mean laughter. Committees, corridors, a coming war."
	}),
	work({
		id: "force-majeure",
		name: "Force Majeure",
		year: "2014",
		runtime: "2h",
		family: "domestic",
		vibes: ["summer", "dusk"],
		seasons: ["winter"],
		facets: {
			domestic: .8,
			moral: .75,
			satire: .4,
			euro: .45,
			talk: .55
		},
		summary: "An avalanche misses a ski resort family. The father ran. The holiday has to continue anyway.",
		why: "A marriage examined like The Hunt examines a town — one reflex, then days of talk. Euro setting, moral bruise, not a postcard.",
		vibeLine: "Snow and a restaurant. Uncomfortable on purpose."
	}),
	work({
		id: "in-bruges",
		name: "In Bruges",
		year: "2008",
		runtime: "1h 47m",
		family: "crime",
		vibes: ["heat", "summer"],
		seasons: ["winter"],
		facets: {
			crime: .6,
			satire: .7,
			moral: .65,
			euro: .55,
			grief: .4,
			talk: .6
		},
		summary: "Two hitmen are sent to hide in Bruges, which one of them hates on sight. Guilt is the job they can't finish.",
		why: "Crime comedy that still believes in damnation. Death of Stalin's laugh, Goodfellas' work, a European city used as purgatory.",
		vibeLine: "Night walk, a joke, then the point."
	}),
	work({
		id: "la-piscine",
		name: "La Piscine",
		year: "1969",
		runtime: "2h 2m",
		family: "euro",
		vibes: ["summer"],
		seasons: ["summer"],
		facets: {
			euro: .95,
			moral: .45,
			talk: .4,
			crime: .3,
			cool: .35
		},
		summary: "A couple at a villa near Saint-Tropez are joined by an old friend and his daughter. The pool does not stay innocent.",
		why: "Vicky Cristina Barcelona and The Talented Mr. Ripley, meaner and French. Desire that curdles. The euro-summer film your list implied and didn't name.",
		vibeLine: "Hot afternoon. Skin, a guest, a turn."
	}),
	work({
		id: "taste-of-things",
		name: "The Taste of Things",
		year: "2023",
		runtime: "2h 15m",
		family: "euro",
		vibes: ["summer", "court"],
		seasons: ["summer", "autumn"],
		facets: {
			euro: .7,
			obsession: .55,
			grief: .4,
			talk: .35,
			comfort: .35
		},
		summary: "A cook and the gourmet she works with in a 19th-century French kitchen. The love is in the sequence of dishes.",
		why: "Drops of God's attention — taste as a moral life — without a contest. Slow on purpose. A night you don't fill with a phone.",
		vibeLine: "Late summer kitchen. Sensual, not sweet."
	}),
	work({
		id: "call-me",
		name: "Call Me by Your Name",
		year: "2017",
		runtime: "2h 12m",
		family: "euro",
		vibes: ["summer"],
		seasons: ["summer"],
		facets: {
			euro: .9,
			grief: .45,
			talk: .5,
			comfort: .3
		},
		summary: "A teenage boy in 1980s Lombardy falls for the graduate student staying the summer. Peaches, a bike, an ending that waits.",
		why: "Euro summer in the Ripley landscape, tender instead of criminal. Only when the mood is heat and feeling, not a heist.",
		vibeLine: "Italian summer. Slow, then it hurts."
	}),
	work({
		id: "mindhunter",
		name: "Mindhunter",
		year: "2017",
		kind: "series",
		runtime: "one episode",
		family: "crime",
		vibes: ["dusk"],
		facets: {
			crime: .7,
			institution: .65,
			talk: .7,
			moral: .55,
			obsession: .45
		},
		summary: "FBI agents interview locked-up killers to build a language for the ones still outside. Two seasons, then it stops.",
		why: "Hannibal's subject, Fincher's dryness. Black Bird's cell talk as a method. You like the conversation more than the gore.",
		vibeLine: "Tape recorder dusk. One interview."
	}),
	work({
		id: "zodiac",
		name: "Zodiac",
		year: "2007",
		runtime: "2h 37m",
		family: "obsession",
		vibes: ["dusk"],
		facets: {
			obsession: .85,
			crime: .65,
			institution: .4,
			talk: .5,
			moral: .35
		},
		summary: "A cartoonist and a reporter chase the Zodiac killer until the chase replaces their lives. The case does not oblige them.",
		why: "Obsession without a win, which Whiplash refuses and this film allows. Procedural like The Killing, American newspapers instead of Danish rain.",
		vibeLine: "A long dusk. The point is not catching him."
	}),
	work({
		id: "anatomy-of-a-fall",
		name: "Anatomy of a Fall",
		year: "2023",
		runtime: "2h 31m",
		family: "domestic",
		vibes: ["dusk", "court"],
		facets: {
			domestic: .75,
			moral: .8,
			talk: .85,
			institution: .45,
			grief: .4
		},
		summary: "A man dies at a chalet. His wife is tried. Their blind son listens to a marriage become evidence.",
		why: "Presumed Innocent and A Separation share this: a household turned into a case. Talk is the action. No twist required.",
		vibeLine: "Snow, a court, a marriage played back on tape."
	}),
	work({
		id: "prisoners",
		name: "Prisoners",
		year: "2013",
		runtime: "2h 33m",
		family: "grief",
		vibes: ["folk", "dusk"],
		seasons: ["autumn"],
		facets: {
			grief: .75,
			moral: .8,
			crime: .65,
			domestic: .55,
			faith: .35
		},
		summary: "Two girls vanish on Thanksgiving. One father stops trusting the police. Rain, basements, a knot that may be religious.",
		why: "Defending Jacob's parental terror, darker, with a folk streak in the clues. Autumn on purpose. Not empty cruelty — it asks what you'll do.",
		vibeLine: "Thanksgiving rain. Grim, complete, one sitting."
	}),
	work({
		id: "black-swan",
		name: "Black Swan",
		year: "2010",
		runtime: "1h 48m",
		family: "obsession",
		vibes: ["dusk"],
		facets: {
			obsession: .9,
			weird: .55,
			domestic: .35,
			grief: .3
		},
		summary: "A dancer is cast as the swan who has to be both innocent and ruined. Her body starts keeping score.",
		why: "Whiplash in a tutu, stranger. Mastery as self-erasure. A stretch toward Hereditary's body horror if you want the obsession first.",
		vibeLine: "One tense night. Mirrors, a role, a mother."
	}),
	work({
		id: "amadeus",
		name: "Amadeus",
		year: "1984",
		runtime: "2h 40m",
		family: "obsession",
		vibes: ["court", "rewatch"],
		facets: {
			obsession: .8,
			court: .65,
			satire: .35,
			faith: .3,
			talk: .45,
			moral: .4
		},
		summary: "Salieri tells God why Mozart had to be punished for being better. Court, laughter, and a very small man.",
		why: "Whiplash's envy without the teacher-as-hero. Court spectacle you can trust because the joke is on mediocrity, including the narrator.",
		vibeLine: "A long, bright, cruel rewatch-to-be. Music loud."
	}),
	work({
		id: "social-network",
		name: "The Social Network",
		year: "2010",
		runtime: "2h",
		family: "obsession",
		vibes: ["heat", "dusk"],
		facets: {
			obsession: .75,
			talk: .85,
			moral: .55,
			institution: .4,
			cool: .45
		},
		summary: "A college slight becomes a company, and the friendships are in depositions. Sorkin talk, Fincher temperature.",
		why: "Marty Supreme's hustle in a deposition. Talk as combat, which is Mad Men and In the Loop. Ambition without a gangster excuse.",
		vibeLine: "Fast talk. A complete story in one night."
	}),
	work({
		id: "the-bridge",
		name: "The Bridge",
		year: "2011",
		kind: "series",
		runtime: "one episode",
		family: "crime",
		vibes: ["dusk", "folk"],
		seasons: ["autumn", "winter"],
		facets: {
			crime: .7,
			moral: .6,
			institution: .45,
			euro: .25,
			talk: .4
		},
		summary: "The Danish-Swedish one. A body on the Øresund bridge, two detectives who do not work the same way, a case that widens.",
		why: "You named the Danish Killing. This is the next weather: cross-border, colder jokes, the same patience with a case.",
		vibeLine: "Rain and a bridge. Season one. Stop there if you want."
	}),
	work({
		id: "ripley-note",
		name: "Purple Noon",
		year: "1960",
		runtime: "1h 58m",
		family: "euro",
		vibes: ["summer"],
		seasons: ["summer"],
		facets: {
			euro: .9,
			crime: .55,
			cool: .6,
			moral: .35
		},
		summary: "The French Ripley, Alain Delon in the sun, before the 1999 film and the 2024 series you already love. A boat, a friend, a theft of a life.",
		why: "You said both Ripleys. If those were the Minghella film and the Netflix series, this is the third, the one that is pure euro summer — cruel and beautiful.",
		vibeLine: "Mediterranean. The oldest Ripley, the brightest water."
	})
];
var catalog_exports = /* @__PURE__ */ __exportAll({
	CATALOG: () => CATALOG,
	mergeWorks: () => mergeWorks,
	useShelf: () => useShelf
});
var CATALOG = [...LOVED, ...SHELF];
function mergeWorks(remote, extras) {
	const base = useShelf.getState().ready ? remote : CATALOG;
	const map = /* @__PURE__ */ new Map();
	for (const work of base) map.set(work.id, work);
	for (const work of extras) {
		const key = work.name.toLowerCase();
		if ([...map.values()].some((item) => item.name.toLowerCase() === key)) continue;
		map.set(work.id, work);
	}
	return [...map.values()];
}
var useShelf = create((set) => ({
	films: [],
	incoming: [],
	ready: false,
	setFilms: (films) => set({
		films,
		ready: true
	}),
	setCatalog: (films, incoming) => set({
		films,
		incoming,
		ready: true
	})
}));
//#endregion
export { mergeWorks as n, useShelf as r, catalog_exports as t };
