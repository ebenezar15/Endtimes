# Fairness audit of the content

Date: 2026-10-14. Scope: everything in `content/` except the generated `bible.json`.

## Method

1. **Read in full:** all 13 positions (`positions/*.json`), all 150 matrix cells (statements and notes), all 15 topics and their stance labels, all 16 argument trees, all 35 Passage Lab entries (every reading, its support and its objection), the flowchart, the tour, all combinations, the timeline summaries, the library and all quiz questions with their keyed answers and explanations. **Skimmed:** the glossary, scholars and flashcards. I read the key glossary entries in full and searched the rest for loaded terms.
2. **Steelman test.** For each position I asked whether a well-informed proponent would accept the description as their own. The proponents I had in mind were Riddlebarger, Storms and Hoekema for amillennialism; Ladd and Blomberg for historic premillennialism; Ryrie, Ice and Bock for dispensationalism; Hendriksen and Beale for idealism and the eclectic approach; Preston and King for full preterism; and Gentry and Mathison for postmillennialism and partial preterism.
3. **Lean checks.** Because the owner holds a postmillennial, partial-preterist view, I looked for:
   - loaded adjectives;
   - asymmetric verbs, such as "shows" for one side and "claims" for another;
   - critiques without answers;
   - rebuttals that are weaker than the objections they answer;
   - which side gets the last word.

   I applied the same checks in the other direction, to catch strawmen of postmillennialism.
4. **Label check.** I searched every file for pejorative labels that might be used as neutral terms: "replacement theology", "hyper-preterism", "pessimism", "escapism", "dualist", "sensational", "newspaper exegesis", "novelty", "obviously", "plainly". I also searched for one-sided evidential verbs: "shows", "proves", "demonstrates".
5. **Tally.** A script counted, for each argument tree, which position holds each final (counter-rebuttal) node.
6. **Edits.** I made minimal text edits in place. `npm run validate` passes after all edits.

## Overall finding

The content was already in good shape. The house style consistently attributes claims ("proponents argue", "critics reply"), pairs critiques with responses, and labels disputed facts as disputed. It handles the date of Revelation and full preterism carefully. It already handles several labels correctly:

- "Replacement theology" appears only as a critics' term, with covenant theologians' rejection of it.
- "Hyper-preterism" appears only as a critics' term, next to the proponents' own names for their view.
- "Realistic" is used for amillennialism.

I found no systematic tilt toward postmillennialism or partial preterism. I did find a scattering of small leans in both directions, plus a few factual slips:

- **Toward preterism:** a handful of strengths and replies took swipes at futurism ("newspapers", "headline-exegesis", "discredited other approaches"). The date-of-Revelation tree gave partial preterists both last words.
- **Against other views:** a few uses of "pessimism" or "pessimist" as a label, and one "dualist" label for a strand of amillennialism.
- **Factual slips:** four, listed under the changes below.

## Verdict for each position

- **Postmillennialism.** A Gentry or Mathison reader would recognise it, and it is not strawmanned. Its five critiques (persecution texts, the twentieth century, theonomy, the sequence of Revelation 19–20, imminence) are the standard ones, each with its strongest reply. Two small issues were fixed: an anachronism about Origen, and a promotional "is growing" claim.
- **Amillennialism.** This is faithful to Hoekema, Riddlebarger and Storms: the "realized millennium" self-description, the already/not yet, the two ages, and the replies on Satan's binding and *ezēsan*. The "pessimism" charge is properly attributed to postmillennial critics and answered. Two fixes: one subview called a strand "dualist", and two places overstated how many amillennialists prefer the term "realized millennialism".
- **Historic premillennialism.** The position page is strong and Ladd-shaped. In the Passage Lab its readings were noticeably shorter than other views' (about 170 characters on average, against 220–250 for the others). I strengthened three of the thinnest supports. One matrix note's use of "pessimism" was reworded.
- **Dispensational premillennialism.** Ryrie's *sine qua non* is stated accurately. Classic, revised and progressive forms are distinguished, and so are the pretribulational, midtribulational, prewrath and posttribulational views. Critiques about novelty and date-setting have fair replies. Four fixes:
  - "claim" in the history section was asymmetric;
  - a matrix line said the early church "uniformly" reported the late date, which overstates it;
  - another matrix line put a polemical motive in dispensationalists' mouths;
  - one Passage Lab objection called the view "pessimism" and gave it no reply.
- **Partial preterism.** Gentry would accept it, including his "orthodox preterism" label. Two fixes:
  - a core belief stated as fact that preterism is "the dominant patristic reading" and took a swipe at "reading newspapers into prophecy";
  - two strengths implied criticism of other views ("stretching", "headline-exegesis").
- **Full preterism.** This is factual and non-polemical. It uses the proponents' own terms (covenant or fulfilled eschatology, consistent preterism) and flags "hyper-preterism" as the critics' term. It states clearly that the view sits outside the historic creeds, gives the critics' reasons (Acts 1:11, 1 Corinthians 15, 2 Timothy 2:17-18) and includes the proponents' reply (sola scriptura, creeds as subordinate standards). Three fixes: the loaded word "recruiting", the word "obviously" in a critique, and two thin Passage Lab supports, which I strengthened with arguments Preston actually uses.
- **Historicism.** Accurate history, including Luther's 1530 preface, Westminster Confession 25.6 and its 1903 revision, and Seventh-day Adventism today. Critiques and replies are balanced. No change needed.
- **Futurism.** Fair. It covers the Ribera genealogy with the futurists' reply and *en tachei* as describing manner. Three strengths elsewhere criticised futurism indirectly; I fixed those (see the partial preterism, full preterism and idealism entries).
- **Idealism.** This is faithful to Hendriksen's progressive parallelism and to Milligan. Two fixes: one strength said other approaches had been "repeatedly discredited", and one reply contrasted idealism with matching symbols to "newspapers".
- **Eclectic.** Faithful to Beale's description of his own approach (a redemptive-historical, modified idealism). No change needed.
- **Covenant theology.** Fair, with the rejection of "replacement theology" and the range of views on Romans 11:26. No change needed.
- **Dispensationalism (framework).** Fair. One glossary overstatement fixed: it now says dispensationalists "usually" expect a pretribulational rapture.
- **Progressive covenantalism.** Fair to Gentry and Wellum. One strength implied a criticism of covenant theology ("rather than from theological constructs"); I removed the contrast.

## Changes made (36 edits in 15 files)

### Positions

**`positions/millennial.json`**

1. **Postmillennialism, history, early church.** Changed "Origen's and Eusebius's expectations after Constantine" to "Origen's expectation that the gospel would prevail, and Eusebius's after Constantine". Why: factual. Origen died before Constantine.
2. **Postmillennialism, history, today.** Changed "It is growing among…" to "Proponents report renewed interest among…". Why: an unsourced promotional claim, now attributed.
3. **Amillennialism subview name.** Changed "Optimistic vs. 'dualist' amillennialism" to "Optimistic vs. pilgrim (two-kingdoms) amillennialism". Why: "dualist" is a critics' label that Kline's followers do not use.
4. **Same subview, text.** Changed "A more 'dualist' strand" to "A more pilgrim-minded strand (… common-grace and two-kingdoms model …)". Why: same reason as change 3.
5. **Dispensational premillennialism, history.** Changed "Dispensationalists claim the early chiliasts as forebears" to "…see the early chiliasts as forebears". Why: the verb was asymmetric, since other views "find" or "trace" their roots.

**`positions/hermeneutic.json`**

6. **Partial preterism, core belief 7.** Replaced "the dominant patristic reading … removes the need to … read newspapers into prophecy" with "has patristic precedent (e.g. Eusebius, Chrysostom) … offers no basis for setting dates from current events". Why: "dominant" overstated the patristic evidence (Irenaeus and Hippolytus read these texts futuristically), and the phrase took a swipe at futurism.
7. **Partial preterism, strength 1.** Changed "stretching them across millennia" to "extending them across millennia". Why: loaded verb.
8. **Partial preterism, strength 6.** Changed "avoids the repeated failures of date-setting and headline-exegesis" to "offers no basis for setting dates from current events". Why: an implied attack on another view with no reply; futurism's own critique already handles date-setting.
9. **Full preterism, history.** Changed "recruiting from partial preterists" to "drawing adherents from partial preterists". Why: loaded word.
10. **Full preterism, critique 3.** Removed "obviously". Why: neutral voice.
11. **Full preterism, strength 4.** Changed "Avoids speculative date-setting and sensationalist prophecy teaching" to "Offers no basis for setting dates for a future end". Why: implied attack on another view.
12. **Idealism, strength 4.** Removed "that have repeatedly discredited other approaches". Why: same reason as change 11.
13. **Idealism, critique 2 response.** Changed "matching symbols to newspapers" to "matching symbols to particular current or ancient events". Why: loaded phrase.

**`positions/frameworks.json`**

14. **Progressive covenantalism, strength 1.** Removed "rather than from theological constructs" and softened the verb to "Seeks to build". Why: an implied criticism of covenant theology, which already answers the "construct" charge in its own critique.

### Matrix and topics

**`matrix/part1.json`**

15. **Amillennialism × millennium.** Changed "Amillennialists prefer the label 'realised millennialism'" to "Some amillennialists, following Jay Adams and Anthony Hoekema, prefer…". Why: overstatement. Most still use "amillennialism".

**`matrix/part2.json`**

16. **Historic premillennialism × optimism, note.** Changed "Their 'pessimism' concerns…" to "Their expectation of decline concerns … not the church's mission". Why: pejorative label.
17. **Dispensational premillennialism × date of Revelation.** Changed "as the early church uniformly reported" to "as most early writers reported". Why: factual. Epiphanius and the Syriac title give other dates.
18. **Same cell.** Changed "regard the early date as an argument made to rescue preterism" to "argue that the case for an early date is driven largely by the needs of preterist interpretation". Why: the original wording assigned a polemical motive. It is now stated as an argument.
19. **Dispensational premillennialism × optimism.** Changed "evangelise individuals, not to Christianise society" to "evangelise and make disciples, not to Christianise society before the King returns". Why: closer to how dispensationalists state their own view, without a reductive framing.
20. **Futurism × church history.** Changed "most popular popular-level reading" to "most widespread popular-level reading". Why: typo.

**`topics/part2.json`**

21. **Optimism topic, internal `family` value for the two premillennial stances.** Changed `pessimistic` to `crisis-before-return`. Why: not displayed (used only for agreement scoring), but the content should not encode a pejorative label. Scoring is unchanged.

### Argument trees

**`arguments/part1.json`**

22. **Date-of-Revelation tree restructured.** It now opens with the partial-preterist early-date case. One objection comes from the eclectic side (Beale) and one from futurism (Irenaeus). The existing preterist replies are kept and merged as rebuttals. Two new counter-rebuttals were written:
    - forty-two months as Daniel's stock period of persecution, and the Nero-return legend as compatible with a late date (Beale, Bauckham);
    - the internal evidence is itself contested, so it cannot simply override the earliest external witness.

    Why: before this change, partial preterists had both last words on the one question where their case is most exposed and where most scholars hold the other view. Every original argument is kept.

**`arguments/part2.json`**

23. **Twentieth-century tree, claim.** Changed "Moorhead shows" to "Moorhead argues". Why: asymmetric verb.
24. **Same claim.** Changed "shows it remains a live exegetical option" to "indicates in their view that it remains…". Why: asymmetric verb.
25. **Same tree, amillennial objection.** Changed "premillennial pessimism" to "premillennial expectations of decline". Why: pejorative label.
26. **Fathers tree, postmillennial objection.** Changed "as Iain Murray shows" to "as Iain Murray argues". Why: asymmetric verb.

### Passages

**`passages/part2.json`**

27. **Matthew 28, dispensational reading, objection.** Changed "this pessimism" to "this outlook" and added a dispensational reply. Why: pejorative label. Also, the postmillennial and amillennial readings of this passage already had replies and this one did not.
28. **Hebrews 12, full-preterist support.** Added the argument that "things that have been made" echoes Hebrews' language for the handmade sanctuary (9:11, 24). Why: steelman. This was the thinnest support for the view.
29. **Zechariah 12, full-preterist support.** Added that "those who pierced him" names a first-century group. Why: steelman.
30. **Acts 3, historic premillennial support.** Added the prophets' renewed-earth pictures. Why: steelman of a thin reading.
31. **Revelation 21–22, historic premillennial support.** Added the earthly reign of Revelation 20:4 and 5:10 before 21:1. Why: steelman.

**`passages/part1.json`**

32. **Isaiah 9, historic premillennial support.** Added Luke 1:32-33 ("over the house of Jacob"). Why: steelman.

### Other files

**`timelines.json`**

33. **Amillennialism summary.** Changed "preferring 'realized millennialism'" to "some prefer…". Why: overstatement.

**`library.json`**

34. Five wording changes:
    - *He Shall Have Dominion*: "The most comprehensive" became "Widely regarded as the most comprehensive", and "pessimist objections" became "objections drawn from texts on apostasy and suffering".
    - *When Shall These Things Be?*: "Gentry shows" became "Gentry argues".
    - *The Bible and the Future*: "Shows that" became "Argues that".
    - *The Puritan Hope*: "Credited with" became "Often credited with".

    Why: asymmetric verbs, and one pejorative label.

**`glossary.json`**

35. **Dispensationalism.** Changed "interprets prophecy literally, and expects a pretribulational rapture" to "…by a consistent literal (normal) hermeneutic, and usually expects…". Why: uses the dispensationalists' own term, and not all forms are pretribulational.

**`scholars.json` and `study/quizzes.json`**

36. Two changes:
    - **Chilton.** "The Days of Vengeance a full preterist-postmillennial commentary" became "a full-length partial-preterist, postmillennial commentary". Why: factual. The book is partial-preterist; Chilton adopted full preterism only later, as the same entry says.
    - **Whitby quiz.** "Murray … show" became "document". Why: neutral verb.

## Who gets the last word in the argument trees

Each tree has two branches. The final node (counter-rebuttal) belongs to the side that raised the objection.

| Camp | Before | After |
| --- | --- | --- |
| Amillennial | 8 | 8 |
| Dispensational premillennial | 5 | 5 |
| Partial preterist | 5 | 3 |
| Postmillennial | 4 | 4 |
| Historic premillennial | 4 | 4 |
| Futurist | 2 | 3 |
| Covenant theology | 2 | 2 |
| Progressive covenantalism | 2 | 2 |
| Eclectic | 0 | 1 |
| Full preterist | 0 | 0 |
| **Total** | **32** | **32** |

Grouped by camp, after the changes:

- **Premillennial and futurist family** (historic premillennial, dispensational premillennial, futurist): 12.
- **Amillennial:** 8.
- **Postmillennial and partial preterist together:** 7 (down from 9).
- **Covenant theology, progressive covenantalism and eclectic:** 5.

Partial preterists' three remaining last words are on:

- "this generation" (against dispensationalism);
- 2 Timothy 3;
- the full-preterism tree, where partial preterists answer full preterists.

The only tree where the postmillennial camp holds both last words is 2 Timothy 3 ("perilous times"), as objectors to an amillennial claim. It is mirrored by the Matthew 13 tree, where amillennial and dispensational objectors to a postmillennial claim hold both last words. I judged that pairing balanced and left it.

Roots (who makes the opening claim): dispensational premillennial or dispensational 5, amillennial 4, partial preterist 2, historic premillennial 2, postmillennial 2, full preterist 1.

## Remaining known limitations

- **Structure of the argument trees.** The objector always speaks last. A view that only ever makes the opening claim, as full preterism does in its one tree, never gets a final word. This suits the orthodoxy framing, but it is a structural feature, not a judgement on the arguments.
- **Passage Lab readings end with an objection and have no response field.** Some objections include a reply from proponents and some do not. I added one reply where the omission was asymmetric (Matthew 28). I did not go through all 200 readings to equalise this.
- **Historic premillennial readings in the Passage Lab are still shorter on average than other views'.** I strengthened four of the thinnest. A fuller pass would help.
- **Full-preterist supports remain shorter than the objections to them**, partly by design, since every objection also carries the creedal note. I strengthened the two thinnest supports.
- **Unattributed scholarly judgements remain**, for example that Gentry's book is "widely regarded as the most comprehensive" defence. They are now hedged but not sourced.
- **No source checking.** I did not re-check citations against the sources registry or online. Sources already marked `"verified": false` remain as they were.
- **Skimmed files.** I skimmed the scholars and flashcards files with keyword searches rather than reading every entry. Tone problems that a search for loaded terms would not catch could remain there.

## Revelation Study

Date: 2026-10-15. Scope: `content/revelation/intro.json` (12 sections) and `content/revelation/chapters/*.json` (22 chapters, every symbol note and every chapter-level reading).

### Method

1. **Read in full.** I turned each file into plain text and read all of it, one chapter file at a time: summaries, context essays, and every symbol's `jewish`, `cultural`, `meaning` and `readings` fields, plus the chapter `readings` and questions. I gave the contested passages the most attention: the date of the book (intro; 4:11; 11:1-2; 17:10), 666 (13:18), Babylon (11:8; 14:8; 16:19; 17–18), the 144,000 (7:4; 14:1), 3:10 and the rapture, and chapter 20.
2. **Meaning-field check.** A `meaning` field is meant to give the broadly shared explanation. I checked whether any of them quietly adopted one school's reading as the consensus, for example a symbolic reading of cosmic signs, Israel's vocation as "realized" in the church, or the unsealing of 22:10 as an argument for early fulfilment.
3. **Lean and strawman checks.** I applied the same tests as in the main audit: loaded words; asymmetric hedges (a caveat attached to one view's reading but not to another's); one view getting the last word inside another view's reading; full-preterist critiques with no answer from proponents; and pejorative asides ("popular writers", "speculative", "in the commentator's own day") placed inside a view's own reading. I checked for leans in both directions, toward and against partial preterism and postmillennialism.
4. **Length tally.** A script measured how long each view's readings are on average. **Symbol readings:** partial preterism 175 characters (174 readings), futurism 131 (175), idealism 121 (166), historicism 158 (123). **Chapter readings:** partial preterism 481 characters, futurism 376, historicism 364, idealism 314, eclectic 304.
5. **Edits.** I made minimal text edits in place. `npm run validate` and `npm test` pass after all edits. Note that another session committed (4ba32a3) while this audit was running, and that commit already contains some of these edits. The remaining edits are uncommitted working-tree changes.

### Overall finding

The Revelation Study was already careful:

- **The date** is labelled "disputed", with both sides' evidence set out in the introduction. Chapters 4, 11, 12, 13 and 17 say how a pre-70 or post-70 setting affects the reading.
- **666** lists five proposals. It calls Nero the majority view but disputed, and gives the critics' objections.
- **Babylon** is labelled disputed, with five identifications, and the Roman evidence (the seven hills, the cargo list) is stated fully.
- **3:10** gives the pretribulational case (Walvoord, Thomas) in its strongest form, alongside the John 17:15 reading.
- **Chapter 20** is even-handed. Each millennial view gets its strongest argument, the main critique and the reply.
- **Full preterism** is repeatedly noted as departing from the historic creeds, usually with the proponents' reply.

I found no systematic lean toward partial preterism or postmillennialism in what is argued. The leans I did find were of four kinds:

- **Space.** Partial-preterist readings are consistently the longest. They therefore usually carry more specific evidence (Josephus, Gentry's counts) than the futurist and idealist readings beside them. This is the clearest structural tilt.
- **Meaning fields.** A handful of meaning fields adopted a covenantal or preterist framing as the shared view.
- **Hedges in both directions.** Some hedges and rebuttals were asymmetric. Several partial-preterist readings ended with "most scholars dispute" or with the critics having the last word. Several futurist readings carried pejorative asides.
- **Full preterism.** A few full-preterist notes gave the critics' charge with no reply from proponents.

### Verdict for each view

- **Partial preterism.** Gentry, Chilton and DeMar would recognise it. It is not strawmanned. If anything it is the best-evidenced view in the study. I removed hedges that applied to it alone ("which most scholars dispute"; "a minority view even among scholars"), made its date caveat uniform ("depends on a pre-70 date, which is disputed"), and added its standard replies on Babylon where the critics previously had the last word.
- **Full preterism.** The notes are factual and non-polemical, use the proponents' own terms (covenantal resurrection, the time texts), and repeat the creedal note throughout. I added the proponents' reply in the seven places where only the critique appeared.
- **Historicism.** The notes are accurate to Elliott and Barnes, with dates and identifications, and they distinguish Adventist historicism. I removed one dismissive aside ("often expected in the near future of the commentator").
- **Futurism.** The dispensational and historic-premillennial forms are kept apart, and 3:10, the 144,000, the seventieth week and Babylon are all well stated. Its readings were the thinnest. I strengthened six chapter readings (1, 8, 12, 14, 19, 22) with arguments futurists actually make, and removed three asides inside its own readings: speculation about the ark, "speculative" for Petra, and "popular writers… little support" on Babylon. I also made the dispensational assumptions in two notes explicit, since historic premillennialists do not share them.
- **Idealism.** The notes are faithful to Hendriksen, Beale and Milligan. They are short but accurate. I strengthened four chapter readings (1, 12, 21, 22).
- **Eclectic.** Faithful to Beale, Bauckham, Osborne and Koester. No change needed.
- **Postmillennialism.** Stated in its own terms (Warfield, Boettner, Gentry, Mathison), with the "sand of the seashore" critique and the reply. One reading credited postmillennial optimism to partial preterism as such. I now attribute it to postmillennial partial preterists, since some partial preterists are amillennial.
- **Amillennialism.** Faithful to Hoekema, Riddlebarger, Storms, Beale and Kline. No change needed.
- **Historic premillennialism.** Ladd's position and Alford's argument on *ezēsan* are stated well. It has few separate readings (13 symbols), but where it appears it is fair.
- **Dispensational premillennialism.** Walvoord, Pentecost and Thomas are stated in their own terms on the elders, 3:10, 19:7-9, the Israel distinctions and the two battles. I corrected two meaning fields that had quietly assumed the covenantal view (5:10 and 21:12).

### Changes made (41 edits in 7 files)

**`intro.json`**

1. **Date section.** "Syriac Peshitta heading" became "the heading of the sixth-century Syriac version of Revelation, which the original Peshitta lacked". Why: factual. The Peshitta did not contain Revelation.
2. **Date section.** I added the late-date reply to the argument from silence about Jerusalem's fall. Why: it was the only early-date argument left unanswered.
3. **Numbers section.** "Preterists usually treat time periods as symbolic" now notes that Gentry matches the 42 months to the Neronic persecution or the Jewish War. Why: factual, since Gentry reads them closely.
4. **3½ fact.** Added each school's reading. Why: the entry gave only the symbolic reading.
5. **144,000 fact.** Changed from "the complete people of God (literal Jewish remnant in many futurist readings)" to an entry marked "Disputed" with three readings. Why: the entry presented the symbolic view as the meaning.

**`chapters/01-03.json`**

6. **1:6 kingdom of priests, meaning.** "the fulfilment of Israel's vocation" became "taking up the vocation of Exodus 19:6", with a note that covenantal and dispensational interpreters relate this differently. Why: a meaning field had adopted the covenantal view.
7. **1:5 faithful witness, partial-preterism reading.** Postmillennial optimism is now attributed to postmillennial partial preterists, and amillennial partial preterists are noted. Why: postmillennialism had been conflated with partial preterism.
8. **1:12 lampstands, futurism reading.** "which follow the church's departure" became an explicitly dispensational statement, with the historic-premillennial view noted. Why: a futurist strawman by omission.
9. **3:10 hour of testing, cultural.** Added that Revelation 12:9 and 16:14 use *oikoumenē* for the whole world. Why: the note gave only the evidence that favours the preterist reading.
10. **Chapter 1, futurism reading.** Added the futurist case from 1:7 and Acts 1:11 and on *en tachei*. Why: thin compared with the preterist reading.
11. **Chapter 1, idealism reading.** Strengthened. Why: same reason.

**`chapters/04-07.json`**

12. **5:10 kingdom and priests, meaning.** "now realized in" became "now given to", with the covenantal and dispensational readings noted. Why: a meaning field had adopted the covenantal view.
13. **6:12 sun and moon, meaning.** "Stock imagery for the collapse of political orders, sometimes also taken as literal" became a neutral statement of the options. Why: a meaning field leaned preterist and idealist.
14. **Chapter 7, full-preterism reading.** Added the proponents' reply. Why: the critique had been left unanswered.

**`chapters/08-11.json`**

15. **Chapter 9, partial-preterism reading.** "which most scholars dispute" became "which is disputed". Why: an asymmetric hedge, worded differently from chapters 8 and 10.
16. **11:8 great city, partial-preterism reading.** Removed "(a minority view even among scholars)" and pointed to chapter 17, where the dispute is set out. Why: an asymmetric hedge inside the view's own reading.
17. **11:1 temple of God, partial-preterism reading.** Added Gentry's answer to the critics. Why: the critics had the last word.
18. **Chapter 11, partial-preterism reading.** "Most scholars … dispute this dating argument" became a neutral date caveat. Why: an asymmetric hedge, already covered by the chapter's context essay.
19. **11:19 ark, futurism reading.** Replaced the aside about popular speculation over the ark with Walvoord and Thomas's actual reading (covenant faithfulness, including to Israel). Why: a strawman.
20. **11:18 judgment of the dead, full-preterism reading.** Added the proponents' reply. Why: the critique had been left unanswered.
21. **11:15 seventh trumpet, historicism reading.** Removed "often expected in the near future of the commentator". Why: a dismissive aside.
22. **Chapter 8, futurism reading.** Strengthened with the Exodus-realism and escalation arguments. Why: thin.

**`chapters/12-14.json`**

23. **12:6 woman in the wilderness, futurism reading.** "though that is speculative" became a neutral note that others decline to name a place. Why: a pejorative hedge.
24. **Chapter 12, futurism reading.** Strengthened with Daniel's half-week and Matthew 24:15-21. Why: thin.
25. **Chapter 12, idealism reading.** Strengthened. Why: same reason.
26. **Chapter 14, futurism reading.** Strengthened with Matthew 24:14. Why: same reason.

**`chapters/15-18.json`**

27. **17:5 Babylon, partial-preterism reading.** "Other early-date preterists (e.g. those following Bauckham…)" became "Other preterists identify Babylon with Rome…". Why: factual. Bauckham holds the late date and is not a preterist.
28. **17:5 Babylon, futurism reading.** Removed the aside "Popular writers have proposed … with little support". Why: a pejorative aside inside the view's own reading.
29. **18:12 cargo list, partial-preterism reading.** Added the preterist reply that the list is modelled on Ezekiel 27. Why: the critics had the last word.
30. **18:24 blood of the prophets, partial-preterism reading.** Added the preterist reply from Matthew 23:35. Why: same reason.

**`chapters/19-22.json`**

31. **20:5-6 first resurrection, full-preterism reading.** Added the proponents' reply. Why: the critique had been left unanswered.
32. **19:11 rider, full-preterism reading.** Added the proponents' reply. Why: same reason.
33. **21:1 new heaven and new earth, full-preterism reading.** Added the proponents' reply. Why: same reason.
34. **22:6 "soon", full-preterism reading.** Added the proponents' reply. Why: same reason.
35. **22:20 "Come, Lord Jesus", full-preterism reading.** Added the proponents' reply. Why: same reason.
36. **21:12 twelve gates, meaning.** "inherits Israel's identity" became a statement that this is debated. Why: a meaning field had adopted the covenantal view.
37. **22:10 "do not seal", meaning.** "Among the strongest arguments for an early fulfilment" is now attributed to preterists, with the alternative reading given. Why: a meaning field had adopted the preterist view.
38. **Chapter 19, futurism reading.** Strengthened. Why: thin.
39. **Chapter 21, idealism reading.** Strengthened. Why: same reason.
40. **Chapter 22, futurism reading.** Strengthened. Why: same reason.
41. **Chapter 22, idealism reading.** Strengthened. Why: same reason.

### Remaining limitations

- **Space imbalance persists.** Partial-preterist symbol readings remain about a third longer than futurist and idealist ones, and partial-preterist chapter readings remain the longest. I strengthened 10 chapter readings but did not rebalance the 340-odd thin futurist and idealist symbol readings, many of which are one line ("Literal X in the Tribulation"). A fuller pass should give those readings the specific evidence their proponents cite.
- **Millennial positions appear rarely in symbol notes.** Historic premillennialism has 13 symbol readings, postmillennialism 22 and amillennialism 37, so the millennial views are compared mainly in chapters 1–5, 11, 12, 15–16 and 19–22. That is defensible, since most symbols do not divide them, but it limits comparison.
- **Critique-and-reply inside readings is uneven.** Partial-preterist and full-preterist readings often contain a critique plus a reply. Futurist and historicist readings rarely contain a critique at all. The pattern is now balanced in the sense that every critique carries a reply, but critiques are still concentrated on the preterist views.
- **No source checking.** I did not re-check citations or scholars' attributions against the books, for example exactly how Chilton and Gentry each identify the 144,000, or Ladd on 7:4.
- **Jewish and cultural fields.** I read these for leaning claims only and did not fact-check every ancient reference.
