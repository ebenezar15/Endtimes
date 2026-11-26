import { t } from '../../lib/i18n'

/** The views compared on this page, with their colours. */
export const VIEWS = () => ({
  premil: { label: t('Premillennial'), color: 'var(--violet, #9b8cf0)' },
  amil: { label: t('Amillennial'), color: 'var(--gold)' },
  right: { label: t('The right view'), color: 'var(--accent)' },
})

export const PILLARS = () => [
  { n: t('Christ reigns now'), text: t('Daniel 7 is an ascension scene: the Son of Man comes to the Ancient of Days and receives the kingdom. Psalm 110 and Peter place the enthronement at the ascension.'), refs: ['Daniel 7:13-14', 'Psalm 110:1-2', 'Acts 2:30-36', 'Ephesians 1:20-22', 'Colossians 1:13', 'Revelation 1:5'] },
  { n: t('The church is Zion, Jerusalem and the temple'), text: t('The apostles call the church the Jerusalem above, Mount Zion, God’s temple and the bride. Jesus said his kingdom is not from this world, and is among you.'), refs: ['Galatians 4:26', 'Hebrews 12:22-24', 'Ephesians 2:19-22', '1 Peter 2:5', 'John 18:36', 'Luke 17:21'] },
  { n: t('The thousand years is now'), text: t('Symbolic and present: Satan is bound from deceiving the nations, and the saints reign with Christ as his body, he the head.'), refs: ['Revelation 20:1-6', 'Matthew 12:29', 'Luke 10:18'] },
  { n: t('The new creation has begun'), text: t('The new heavens and earth began with the new covenant and grow to fullness. The Spirit and the bride say “come” now.'), refs: ['Isaiah 65:17', '2 Corinthians 5:17', 'Hebrews 12:26-28', 'Revelation 22:17'] },
  { n: t('One coming brings the end'), text: t('At his coming: the resurrection, immortality, one judgement, death destroyed as the last enemy, and the kingdom handed to the Father.'), refs: ['1 Corinthians 15:23-26, 52-54', 'John 5:28-29', 'Matthew 25:31-46'] },
  { n: t('The age that ended was the old covenant'), text: t('AD 30-70 was an overlap of the two covenants. Many “coming” texts are judgement-comings in the Old Testament pattern.'), refs: ['Hebrews 8:13', 'Matthew 24:3, 34', 'Isaiah 19:1', 'Micah 1:3-4'] },
]

export const ORDER = () => [
  { when: t('c. AD 30'), title: t('Ascension'), text: t('Christ enthroned; the kingdom inaugurated.'), refs: ['Daniel 7:13-14', 'Acts 2:30-36'] },
  { when: t('AD 30-70'), title: t('Transition'), text: t('The old covenant vanishing; the end of the age; judgement on old Jerusalem.'), refs: ['Hebrews 8:13', 'Matthew 24:3, 34'] },
  { when: t('Now'), title: t('The gospel age: the thousand years'), text: t('Satan bound as to the nations; the church is Zion, temple and bride, reigning with Christ. Death being defeated, the new creation advancing.'), refs: ['Revelation 20:3', 'Revelation 22:17'] },
  { when: t('Future'), title: t('The second coming'), text: t('The last trumpet: one resurrection and immortality, one judgement.'), refs: ['1 Corinthians 15:52-54', 'John 5:28-29', 'Matthew 25:31-46'] },
  { when: t('Eternity'), title: t('Handover and fullness'), text: t('Death, the last enemy, destroyed; the kingdom given to the Father; no more tears.'), refs: ['1 Corinthians 15:24-26', 'Revelation 21:4'] },
]

export const LANES = () => ({
  premil: [t('Second coming'), t('First resurrection'), t('A thousand-year reign: mortals and glorified together'), t('Satan loosed, rebellion'), t('Second resurrection, judgement'), t('Death destroyed'), t('New earth')],
  amil: [t('Ascension: reign begins'), t('A thousand years = church age'), t('Brief final rebellion'), t('Coming: one resurrection and judgement'), t('Death destroyed, new earth')],
  right: [t('Ascension: reign begins'), t('AD 30-70 transition'), t('A thousand years = gospel age, new creation advancing'), t('Coming, resurrection, judgement'), t('Death destroyed, handover, fullness')],
})

export const COLLIDE = () => [
  { issue: t('When Christ reigns'), premil: t('After his return, on earth'), amil: t('Now, from heaven'), right: t('Now, with the church as his body') },
  { issue: t('The thousand years'), premil: t('Literal, after the return'), amil: t('The church age'), right: t('The gospel age, symbolic') },
  { issue: t('Death destroyed'), premil: t('After the thousand years'), amil: t('At the coming'), right: t('At the coming (1 Cor 15:26, 54)') },
  { issue: t('The resurrection'), premil: t('Two phases'), amil: t('One, general'), right: t('One, at the last trumpet') },
  { issue: t('Jerusalem, Zion, temple'), premil: t('A future physical role'), amil: t('The church, mostly'), right: t('The church, fully') },
  { issue: t('Matthew 24'), premil: t('Mostly future'), amil: t('Often all the final coming'), right: t('AD 70 judgement; 1 Corinthians 15 for the final return') },
  { issue: t('New creation'), premil: t('After the millennium'), amil: t('At the return'), right: t('Begun now, complete at the return') },
]

export const THEMES = () => [
  { k: t('Reign now'), v: t('Enthroned at the ascension; the saints share the reign as the body under the head.'), refs: ['Daniel 7:13-14, 18, 27', 'Ephesians 1:20-23', 'Ephesians 2:6', 'Revelation 1:5-6'] },
  { k: t('Enemies under his feet'), v: t('He reigns until his enemies are subdued; the body obeys the head and brings subjection through the gospel. Death is last.'), refs: ['1 Corinthians 15:25-26', 'Hebrews 2:8-9', 'Matthew 28:18-20', 'Romans 16:20'] },
  { k: t('Not an earthly fantasy'), v: t('The kingdom is righteousness, peace and joy. The disciples did not fight, because it is not worldly in source or method.'), refs: ['Romans 14:17', 'John 18:36', 'Luke 17:20-21', '2 Corinthians 10:3-5'] },
  { k: t('Zion and temple'), v: t('Jesus never pointed to a rebuilt city or temple; the apostles apply both to the church.'), refs: ['John 2:19-21', 'John 4:21-24', 'Galatians 4:26', 'Hebrews 12:22'] },
  { k: t('The transition'), v: t('The old and new covenants overlapped until AD 70; Hebrews speaks into that moment.'), refs: ['Hebrews 8:13', 'Hebrews 9:8-10', 'Matthew 23:36-38'] },
  { k: t('Satan bound'), v: t('Bound as to deceiving the nations, yet still active in individual minds, as sin and death are defeated yet not believed by all.'), refs: ['Revelation 20:3', 'Colossians 2:15', '2 Corinthians 4:4', '1 Peter 5:8'] },
  { k: t('Progress to no more tears'), v: t('Revelation 21-22 holds an open invitation: the gates stay open and the nations are healed. The new creation is advancing now.'), refs: ['Revelation 21:24-26', 'Revelation 22:2, 17', '2 Corinthians 5:17'] },
  { k: t('Isaiah 65:20'), v: t('A gospel-age picture: the curse being reversed and early death shrinking, until the final resurrection; Revelation 21:4 shows completion.'), refs: ['Isaiah 65:17-25', 'Revelation 21:1-4'] },
  { k: t('The last trumpet'), v: t('The gospel goes out; then the resurrection at his coming brings fullness.'), refs: ['1 Corinthians 15:52', '1 Thessalonians 4:16', 'Matthew 24:14, 31'] },
  { k: t('One resurrection, one judgement'), v: t('Jesus speaks of a single hour and a single last day.'), refs: ['John 5:28-29', 'John 6:39-54', 'Acts 24:15'] },
  { k: t('The handover'), v: t('He reigns until the end, then delivers the kingdom to the Father.'), refs: ['1 Corinthians 15:24-28'] },
]

export const STRAINS = () => ({
  premil: [
    { k: t('Mortals and immortals together'), v: t('Those of the age to come cannot die any more. A world of glorified saints beside dying nations mixes the two ages.'), refs: ['Luke 20:35-36'] },
    { k: t('Death after the resurrection'), v: t('Death is swallowed up when we are changed at the last trumpet; premillennialism leaves death at work for a thousand years afterwards.'), refs: ['1 Corinthians 15:54'] },
    { k: t('Two “last days”'), v: t('Jesus raises believers on the last day, and gives one hour for both groups.'), refs: ['John 6:39-54', 'John 5:28-29'] },
    { k: t('A deferred throne'), v: t('Peter ties David’s throne to the resurrection and ascension; James sees David’s tent rebuilt now.'), refs: ['Acts 2:30-36', 'Acts 15:15-17'] },
    { k: t('Time texts pushed away'), v: t('“Soon”, “near”, “this generation”. Daniel was told to seal his book; John is told not to.'), refs: ['Revelation 22:6, 10', 'Daniel 12:4', 'Matthew 24:34'] },
    { k: t('A restored temple'), v: t('Hebrews says there is no more offering for sin, yet Ezekiel’s sacrifices “make atonement”.'), refs: ['Hebrews 10:1-4, 18', 'Ezekiel 45:15, 17'] },
  ],
  amil: [
    { k: t('All of Matthew 24 as the final coming'), v: t('“This generation” in Matthew means Jesus’ contemporaries.'), refs: ['Matthew 24:34', 'Matthew 23:36', 'Matthew 11:16'] },
    { k: t('Every coming merged into one'), v: t('Old Testament cloud-comings were judgements in history. Not every coming must be the last.'), refs: ['Isaiah 19:1', 'Micah 1:3-4', 'Psalm 18:7-15'] },
    { k: t('A binding with no visible effect'), v: t('If the strong man is bound and plundered, the nations should be discipled, not described mainly by decline.'), refs: ['Matthew 12:29', 'Matthew 28:18-20'] },
    { k: t('Revelation 21-22 only as the eternal state'), v: t('The invitation “come” and the healing of the nations are present-age activities inside the final vision.'), refs: ['Revelation 22:2, 17'] },
    { k: t('A stone that fills the earth'), v: t('Daniel 2 describes growth, not only a sudden end; a pessimistic reading struggles with that growth.'), refs: ['Daniel 2:35, 44'] },
    { k: t('Revelation 19 as the end, yet “soon”'), v: t('Reading the fall of Babylon as future collides with the time statements of chapters 1 and 22.'), refs: ['Revelation 1:1-3', 'Revelation 22:10'] },
  ],
})

export const DEBATE = () => ({
  premil: [
    { q: t('If glorified saints cannot die, how do they live for a thousand years beside mortals who do?'), r: t('Jesus lived among his disciples after his resurrection, so immortal and mortal can coexist.'), f: t('That was forty days, not a governed age. And where does Paul say death is destroyed after a thousand more years of dying, when it is swallowed up at the resurrection?'), refs: ['Luke 20:35-36', '1 Corinthians 15:54'] },
    { q: t('Paul says “then comes the end” after his coming. Where does the text place a thousand-year gap?'), r: t('“Then” allows an interval, and Revelation 20 supplies it.'), f: t('An allowed gap is not a stated one. Christ reigns until the last enemy falls, and it falls at the resurrection. Where is the reign after that?'), refs: ['1 Corinthians 15:24-26, 54'] },
    { q: t('Peter says Jesus now sits on David’s throne. Why defer it?'), r: t('Revelation 3:21 distinguishes the Father’s throne from Christ’s own; David’s throne is future.'), f: t('Peter links the promise to the resurrection and Psalm 110, and James says David’s tent is being rebuilt. Which apostle says the throne is still waiting?'), refs: ['Acts 2:30-36', 'Acts 15:15-17', 'Revelation 3:21'] },
    { q: t('Hebrews says the old sacrifices could never take away sins. Why would Ezekiel’s sacrifices return?'), r: t('They are memorials, as the Lord’s Supper looks back.'), f: t('Ezekiel says they make atonement. Why use atonement language for a memorial, and why return to shadows after the reality has come?'), refs: ['Ezekiel 45:15, 17', 'Hebrews 10:1'] },
    { q: t('Jesus gives one “hour” for both resurrections. Why two phases a thousand years apart?'), r: t('Revelation 20:4-6 distinguishes a first and a second resurrection.'), f: t('Revelation 20:4 speaks of souls who lived; Jesus and Paul speak of one last day and one resurrection of just and unjust. Why not read Revelation 20 in their light?'), refs: ['John 5:28-29', 'Acts 24:15', 'Revelation 20:4-6'] },
    { q: t('Revelation’s events must “soon” take place. How long is soon for the seven churches?'), r: t('It means suddenly, or swiftly once it begins.'), f: t('Revelation 22:10 contrasts Daniel’s sealed vision with John’s unsealed one because the time is near. A far future empties the contrast.'), refs: ['Revelation 1:1', 'Revelation 22:10', 'Daniel 12:4'] },
    { q: t('The New Testament calls the church Zion, temple, Jerusalem and bride. Where does it tell us to await a physical city or temple?'), r: t('Luke 21:24 and Romans 11:26 keep a future for Israel.'), f: t('Luke 21:24 sits inside an AD 70 context, and Paul calls the church the Israel of God and one olive tree. Which text commands us to expect a rebuilt temple?'), refs: ['Luke 21:24', 'Galatians 6:16', 'Romans 11:17-24'] },
  ],
  amil: [
    { q: t('If the whole of Matthew 24 is the final return, which generation is “this generation”?'), r: t('The Jewish people, or a kind of people, not a time span.'), f: t('Matthew uses it for Jesus’ contemporaries elsewhere. Why would 24:34 change meaning without a signal?'), refs: ['Matthew 24:34', 'Matthew 11:16', 'Matthew 23:36'] },
    { q: t('If every coming is the final one, what of Old Testament cloud-comings?'), r: t('Those are types; the New Testament uses them for the final coming.'), f: t('Then the pattern is granted: God comes in historical judgement. Where does Matthew 24 mark the switch from AD 70 to the end?'), refs: ['Isaiah 19:1', 'Micah 1:3-4'] },
    { q: t('Satan is bound now. Why expect steady decline?'), r: t('The binding is limited, and the church suffers until the end.'), f: t('The strong man’s house is plundered and Christ has all authority. What does a bound enemy and a discipling church look like, if not progress?'), refs: ['Matthew 12:29', 'Matthew 28:18', '2 Timothy 3:13'] },
    { q: t('Revelation 22:17 invites people to come, inside the final vision. If chapters 21-22 are only the eternal state, who is invited?'), r: t('Present readers are addressed inside a vision of the future.'), f: t('Then the chapters blend present and final. Why not accept that the new creation is already advancing?'), refs: ['Revelation 22:17'] },
    { q: t('The stone grows into a mountain that fills the earth. Is that growth, or only an instant at the end?'), r: t('The stone strikes at the end and the kingdom is eternal.'), f: t('Daniel says it became a great mountain and filled the whole earth. Where is the growth in a view that expects the world mostly to resist?'), refs: ['Daniel 2:35, 44'] },
    { q: t('Revelation 19 and 22 say these events are soon. Why read them as future?'), r: t('The language symbolises the whole church age and applies throughout.'), f: t('If it applies throughout, the time statements mean little. A first-century fall of Babylon keeps them meaningful.'), refs: ['Revelation 22:6'] },
  ],
  romans: [
    { q: t('The olive tree is one tree. Where in Romans 11 is a separate Jewish programme, land or temple?'), r: t('The tree is Israel’s covenants; Gentiles are added, and Israel’s national future is still ahead.'), f: t('Paul speaks of branches entering by faith and grafted back by faith. Which verse names land, temple or throne rather than mercy and faith?'), refs: ['Romans 11:20, 23', 'Romans 11:28-29'] },
    { q: t('If “all Israel” means the nation at the end, why does Paul say not all Israel is Israel?'), r: t('That is about the remnant now; “all Israel” in chapter 11 is the national turning.'), f: t('Then Paul uses “Israel” in two senses within three chapters. What in 11:26 marks the switch, and why is Galatians 6:16 not a third?'), refs: ['Romans 9:6-8', 'Galatians 6:16'] },
    { q: t('Paul quotes Isaiah 59 and Jeremiah 31 for the Deliverer and the covenant. Why not a first-coming fulfilment?'), r: t('Paul says “will come”, so it is future, at his return.'), f: t('Jeremiah 31 is the new covenant that Hebrews says is already in force. Why would it need a later Jewish fulfilment?'), refs: ['Romans 11:26-27', 'Hebrews 8:8-13'] },
    { q: t('What would it take for “and so” to mean “and then”?'), r: t('The “until” in verse 25 gives it a time sense.'), f: t('The lexicons give manner as the main sense, and the verses before describe a process: jealousy and grafting. Is the time reading carrying more than the Greek bears?'), refs: ['Romans 11:25-26'] },
  ],
})

export const ROMANS_STEPS = () => [
  { k: t('Paul redefines Israel'), v: t('Not all who are descended from Israel are Israel; the true Jew is inward; the church is the Israel of God and the circumcision.'), refs: ['Romans 9:6-8', 'Romans 2:28-29', 'Galatians 6:16', 'Philippians 3:3'] },
  { k: t('One tree, entered by faith'), v: t('Branches stand by faith. Gentiles do not replace Israel; they join the commonwealth of Israel.'), refs: ['Romans 11:20', 'Ephesians 2:11-19', 'Galatians 3:7, 29'] },
  { k: t('“And so” means “in this way”'), v: t('Gentile inclusion makes Israel jealous, and Jews are saved the same way, by faith, as the fullness of the Gentiles comes in.'), refs: ['Romans 11:11, 14, 26'] },
  { k: t('The covenant quoted is the new covenant'), v: t('Isaiah 59 and Jeremiah 31 are already inaugurated, as Hebrews says.'), refs: ['Isaiah 59:20-21', 'Jeremiah 31:31-34', 'Hebrews 10:16-17'] },
  { k: t('No land, temple or throne'), v: t('Romans 9-11 never mentions them. Abraham’s promise was to inherit the world, and the aim is mercy to all.'), refs: ['Romans 4:13', 'Romans 11:32'] },
]

export const CRITICS = () => [
  { c: t('In 11:25-26 “Israel” is set against “the Gentiles”, so it means the nation.'), a: t('Paul contrasts hardened Israel with the Gentiles to show who is being added. Unbelieving Jews are grafted back only by faith. The contrast is about status, not two programmes.') },
  { c: t('“Their fullness” and “their acceptance” are ethnic.'), a: t('Yes, and the postmillennial version accepts a large Jewish turning. That is still gospel-age conversion, with no land or temple.') },
  { c: t('“Beloved for the sake of the fathers.”'), a: t('God keeps covenant faithfulness to Abraham’s seed through Jews who believe in every generation. The gifts are irrevocable because the promise stands in Christ.') },
  { c: t('“Until” implies an end point.'), a: t('It matches “the times of the Gentiles” and the hardening “in part”. It marks the end of the age without needing a separate Jewish era.') },
]

export const READY = () => [
  { c: t('Satan is loosed after the thousand years.'), a: t('The binding concerns deceiving the nations with the gospel in view; a final rebellion comes at the end of the age.'), care: t('Peter and Paul show Satan active now; define the binding as limited, and say so.'), refs: ['Revelation 20:7-10', '1 Peter 5:8', '2 Corinthians 4:4'] },
  { c: t('“All Israel will be saved.”'), a: t('Israel is the people of God, Jew and Gentile, one olive tree.'), care: t('Many read it as ethnic Israel; know Romans 9-11 thoroughly.'), refs: ['Romans 11:26', 'Galatians 6:16'] },
  { c: t('The saints’ reign is future.'), a: t('Revelation 5:10 describes what is already true of a kingdom of priests.'), care: t('In 1 Corinthians 4:8 Paul is ironic; keep the answer measured.'), refs: ['Revelation 1:6', 'Revelation 5:10', '1 Corinthians 4:8'] },
  { c: t('Is the church to overcome death?'), a: t('The church proclaims and walks in the life Christ brought to light.'), care: t('Christ abolishes death and destroys it at the resurrection; never say the church achieves it.'), refs: ['2 Timothy 1:10', '1 Corinthians 15:26, 54'] },
  { c: t('Is the trumpet only a message?'), a: t('Trumpets as proclamation are common in prophecy.'), care: t('Paul pairs the last trumpet with the dead being raised: present it as the event the message announces.'), refs: ['Isaiah 27:13', '1 Corinthians 15:52', '1 Thessalonians 4:16'] },
  { c: t('The date of Revelation.'), a: t('Internal evidence supports a date before AD 70: the temple measured, the sixth king reigning.'), care: t('Most scholars favour the 90s, following Irenaeus. Know both sides.'), refs: ['Revelation 11:1-2', 'Revelation 17:10'] },
  { c: t('Isaiah 65:20: death at a hundred called young.'), a: t('A gospel-age picture of the curse being reversed, ending in Revelation 21:4.'), care: t('Show from the text that it describes this age; do not simply assume it.'), refs: ['Isaiah 65:20', 'Revelation 21:4'] },
  { c: t('“We do not yet see all things subjected.”'), a: t('“But we see Jesus” crowned; the body brings subjection.'), care: t('Admit the already and not yet: every view shares it.'), refs: ['Hebrews 2:8-9'] },
]

/** Teachers in church history who held that Christ reigns now and that one coming brings the end. */
export const WITNESSES = () => [
  { y: 'c. 426', w: t('Augustine'), v: t('City of God, book 20: the thousand years are the church age, and the saints reign with Christ now.') },
  { y: '381', w: t('The Nicene Creed'), v: t('He will come again in glory to judge the living and the dead, and his kingdom will have no end: one coming, one judgement.') },
  { y: '1500s', w: t('The Reformers'), v: t('Luther and Calvin taught a present reign of Christ and one return to raise the dead and judge.') },
  { y: '1600s-1700s', w: t('Puritans: John Owen, Jonathan Edwards'), v: t('A reigning Christ and a gospel that would fill the earth, with a large Jewish turning to Christ inside the gospel age.') },
  { y: '1800s', w: t('Charles Hodge, B. B. Warfield'), v: t('The kingdom advancing through the gospel until the one return, resurrection and judgement.') },
  { y: t('Today'), w: t('Partial preterists and postmillennialists'), v: t('Christ enthroned since the ascension; AD 70 the end of the old covenant age; the final coming still ahead.') },
]

export const RELATED = () => [
  { to: '/rapture', label: t('Rapture, millennium & kingdom'), why: t('Every view of Revelation 20 in order.') },
  { to: '/kingdom-hope', label: t('Early church, Israel and a world getting worse?'), why: t('The early church, 1948, and the growing kingdom.') },
  { to: '/israel', label: t('Israel in prophecy'), why: t('Romans 11 read five ways, and the promises kept.') },
  { to: '/fulfilled', label: t('Matthew 24 verse by verse'), why: t('Why Matthew 24 is the AD 70 judgement.') },
  { to: '/new-creation', label: t('New heavens & new earth'), why: t('The new creation begun and completed.') },
  { to: '/revelation', label: t('Revelation Study'), why: t('What was near, and what was still future to John.') },
  { to: '/seventy-weeks', label: t('Daniel’s seventy weeks and the end-time timeline'), why: t('Daniel 2, 7 and 9 on one line.') },
  { to: '/objections', label: t('Objections answered'), why: t('Dispensational claims, answered fairly.') },
]

export const QUIZ = () => [
  { q: t('When does this study place Christ’s enthronement?'), options: [t('At his ascension'), t('At his second coming'), t('After a future thousand years')], answer: 0, explain: t('Peter ties the throne of David to the resurrection and ascension (Acts 2:30-36).') },
  { q: t('What is the thousand years of Revelation 20?'), options: [t('A literal future reign on earth'), t('The present gospel age'), t('The years AD 30-70 only')], answer: 1, explain: t('It is symbolic: the age in which Satan is bound as to the nations and the saints reign with Christ.') },
  { q: t('When is death, the last enemy, destroyed?'), options: [t('A thousand years after the return'), t('At the resurrection at his coming'), t('In AD 70')], answer: 1, explain: t('Death is swallowed up when we are changed at the last trumpet (1 Corinthians 15:26, 54).') },
  { q: t('How many resurrections and judgements does this view expect at the end?'), options: [t('Two, a thousand years apart'), t('One resurrection and one judgement'), t('None; all are past')], answer: 1, explain: t('Jesus speaks of one hour and one last day (John 5:28-29; 6:39-54).') },
  { q: t('Which age ended in AD 70?'), options: [t('The church age'), t('The old covenant age'), t('The physical universe')], answer: 1, explain: t('The old covenant was ready to vanish (Hebrews 8:13); the end of the age came on that generation.') },
  { q: t('What does the New Testament call the church?'), options: [t('A parenthesis before Israel’s kingdom'), t('Zion, Jerusalem above, temple and bride'), t('A temporary replacement')], answer: 1, explain: t('Galatians 4:26, Hebrews 12:22 and Ephesians 2:19-22.') },
  { q: t('What does Christ do after the end in 1 Corinthians 15?'), options: [t('Begins his reign'), t('Hands the kingdom to the Father'), t('Rebuilds the temple')], answer: 1, explain: t('He comes to finish the reign, not to begin it (1 Corinthians 15:24-28).') },
  { q: t('What is the main sense of “and so” in Romans 11:26?'), options: [t('And after that'), t('In this way'), t('Only then')], answer: 1, explain: t('Kai houtōs is mainly manner: in this way, by faith, as the Gentiles come in.') },
  { q: t('Why do premillennialists struggle with Luke 20:35-36?'), options: [t('It describes two resurrections'), t('Those raised cannot die, yet mortals would live beside them'), t('It mentions a temple')], answer: 1, explain: t('A thousand years of mortals and glorified saints together mixes the two ages.') },
  { q: t('Which test question does this study put to every view?'), options: [t('Where does Scripture say Christ’s reign begins after he returns?'), t('Who is the antichrist?'), t('When will the rapture happen?')], answer: 0, explain: t('If he already reigns (Acts 2:36; Revelation 1:5), the future is the consummation of the reign, not its start.') },
]
