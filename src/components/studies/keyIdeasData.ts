import { t } from '../../lib/i18n'
import type { KeyIdea } from './KeyIdeas'

/** "The study in one minute" for each older study page, keyed by route. */
export const KEY_IDEAS: Record<string, () => KeyIdea[]> = {
  olivet: () => [
    { title: t('The question was about the temple'), text: t('Jesus had just said not one stone would be left on another. The disciples asked when, and what the sign would be.'), ref: 'Matthew 24:1-3' },
    { title: t('The signs fit that generation'), text: t('False messiahs, wars, famine, persecution and the gospel reaching the known world all appear in Acts and in Josephus before AD 70.'), ref: 'Acts 11:28' },
    { title: t('Flee Judea'), text: t('The escape is local: from Judea to the mountains, before the winter, not on a Sabbath. Luke explains the sign as armies surrounding Jerusalem.'), ref: 'Luke 21:20-21' },
    { title: t('“This generation”'), text: t('All these things would happen before Jesus’ hearers passed away. The other views read the phrase differently; the study weighs each.'), ref: 'Matthew 24:34' },
  ],
  fulfilled: () => [
    { title: t('Read it as the first hearers did'), text: t('Who was speaking, to whom, where, and about what? Asked first, these questions point to the temple standing in front of them.'), ref: 'Matthew 24:1-3' },
    { title: t('Every verse has a setting'), text: t('Each verse is traced to the events of AD 30-73, with the evidence and the other readings beside it.') },
    { title: t('Cosmic words, historic judgement'), text: t('Sun, moon and stars are the prophets’ language for the fall of nations, as with Babylon and Egypt.'), ref: 'Isaiah 13:9-10' },
    { title: t('Then the mission continues'), text: t('After the old order fell, the task remains the same: make disciples of all nations.'), ref: 'Matthew 28:18-20' },
  ],
  josephus: () => [
    { title: t('An eyewitness of the war'), text: t('Josephus was a Jewish commander who surrendered to Rome and wrote the history of the war he lived through.') },
    { title: t('Omens before the fall'), text: t('He records a sword-shaped star, a voice in the temple and a gate that opened by itself, which the people misread.') },
    { title: t('A siege of unspeakable suffering'), text: t('Famine, factions and fire: his account matches Jesus’ warnings closely, though his numbers should be read with care.'), ref: 'Luke 19:43-44' },
    { title: t('Read him well'), text: t('Josephus wrote for Rome and for himself. He is a vital witness, not an infallible one.') },
  ],
  signs: () => [
    { title: t('Every age saw the signs'), text: t('Wars, earthquakes and famines have been read as final signs in every century since the apostles.') },
    { title: t('Every date has passed'), text: t('From the Montanists to modern prophecy books, every specific date set for the end has failed.') },
    { title: t('Jesus gave the signs a time'), text: t('He said these things would come on his own generation, and told his hearers not to be alarmed.'), ref: 'Matthew 24:6, 34' },
    { title: t('Watch, but do not set dates'), text: t('No one knows the day or the hour of the final coming; readiness is faithfulness, not calculation.'), ref: 'Matthew 24:36' },
  ],
  dating: () => [
    { title: t('Two dates for one book'), text: t('Revelation was written either in the 60s, before the temple fell, or around AD 95 under Domitian.') },
    { title: t('The book’s own clues'), text: t('John measures a temple that is still standing, and the sixth king is reigning as he writes.'), ref: 'Revelation 11:1-2' },
    { title: t('The early-church witness'), text: t('The late date rests mainly on one sentence of Irenaeus, which can be read more than one way.') },
    { title: t('Why it matters'), text: t('If Revelation was written before AD 70, its “soon” points first to the fall of Jerusalem.'), ref: 'Revelation 1:1-3' },
  ],
  israel: () => [
    { title: t('Who is Israel?'), text: t('Not all who are descended from Israel are Israel; the promise belongs to Abraham’s seed.'), ref: 'Romans 9:6-8' },
    { title: t('The Seed is Christ'), text: t('Paul says the promise was to one Seed, Christ, and that all in him are heirs.'), ref: 'Galatians 3:16, 29' },
    { title: t('One olive tree'), text: t('Gentiles are grafted into Israel’s tree; Jewish people can be grafted back in by faith.'), ref: 'Romans 11:17-24' },
    { title: t('Views differ fairly'), text: t('Dispensational, covenantal and fulfilled readings are each set out in their own terms.') },
  ],
  rapture: () => [
    { title: t('Three questions'), text: t('When are believers gathered to Christ? What are the thousand years? Is the kingdom established at the return, or stewarded now?') },
    { title: t('The seven-year week'), text: t('Pre-, mid- and post-tribulation views all assume a future seven-year period; amillennial and postmillennial views see no such week ahead.'), ref: 'Daniel 9:27' },
    { title: t('Revelation 20'), text: t('The thousand years are read as the present reign of Christ, a coming golden age, or a reign on earth after his return.'), ref: 'Revelation 20:1-6' },
    { title: t('Common ground'), text: t('Every view confesses that Christ will come again, raise the dead and make all things new.'), ref: '1 Thessalonians 4:16-17' },
  ],
  'new-creation': () => [
    { title: t('“Heaven and earth” in covenant language'), text: t('Moses and the prophets called heaven and earth as witnesses, and used the words for Israel’s world and covenant.'), ref: 'Deuteronomy 32:1' },
    { title: t('The tabernacle as a small cosmos'), text: t('Court, holy place and most holy place pictured land, sky and God’s throne.') },
    { title: t('A new creation begun'), text: t('If anyone is in Christ, there is a new creation; Isaiah 65 is echoed in Revelation 21.'), ref: '2 Corinthians 5:17' },
    { title: t('And completed at the end'), text: t('Christians differ on how much is fulfilled now; all look for the renewal of all things.'), ref: 'Revelation 21:1-5' },
  ],
  questions: () => [
    { title: t('Ask any question'), text: t('Hundreds of questions on the end times, each with a short answer, a full answer, examples and the other views.') },
    { title: t('Reading keys first'), text: t('Audience, time words, the Old Testament background and the New Testament’s own fulfilments guide every answer.') },
    { title: t('Learn from history'), text: t('A graveyard of failed predictions and a wall of named “Antichrists” show why caution matters.') },
    { title: t('Search, then explore'), text: t('Pick a topic, search a word, or let “Surprise me” choose a question.') },
  ],
  spiritual: () => [
    { title: t('The unveiling of Jesus Christ'), text: t('Revelation is first a revelation of Christ: Lamb, Priest, King and Bridegroom.'), ref: 'Revelation 1:1' },
    { title: t('Images with roots'), text: t('Every image comes from the Old Testament, from the tabernacle to Eden.') },
    { title: t('The old and the new'), text: t('The book moves from the old covenant city to the new Jerusalem, from the harlot to the bride.') },
    { title: t('A journey for every believer'), text: t('Its call to overcome, to worship and to witness speaks to every generation.'), ref: 'Revelation 12:11' },
  ],
  revelation: () => [
    { title: t('Written to seven real churches'), text: t('Revelation is a letter to churches in Asia Minor, about things that must soon take place.'), ref: 'Revelation 1:1-4' },
    { title: t('A book of signs'), text: t('God “signified” it: its images come from the prophets and must be read through them.') },
    { title: t('Sevens and more sevens'), text: t('Seals, trumpets and bowls build in intensity, framed by the throne room and the Lamb.') },
    { title: t('Ten readings, one hope'), text: t('Every view is read chapter by chapter, and all end with the Lamb on the throne and all things new.'), ref: 'Revelation 21:5' },
  ],
}
