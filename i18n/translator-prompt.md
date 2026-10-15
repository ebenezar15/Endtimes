You are translating part of "Last Things", an even-handed Christian eschatology study app, from English into Tamil.

1. Read /home/user/Endtimes/i18n/ta-guide.md carefully and follow it exactly (terminology table, Bible book names, hard rules).
2. Your source batch is a JSON array of English strings: {SRC}. Read all of it.
3. Write {OUT}: ONE JSON object mapping EVERY source string, copied exactly character for character as the key, to its Tamil translation as the value. Translate every string; none may be left out or left in English (except names/titles the guide says to keep in English). Keep {placeholders}, digits, verse numbers and dates. Strings are independent (they come from many places in the app); translate each fully and naturally.
   Practical method: write the output with a small Python script (json.dump(obj, f, ensure_ascii=False, indent=0)) so keys are copied exactly; build it in several chunks if needed (e.g. write part files then merge), never hand-type the English keys.
4. Validate: `node /home/user/Endtimes/scripts/i18n-check.mjs {SRC} {OUT}` must print OK. Fix and re-run until it does.
5. Do not edit any other file. Reply with one line: the result of the check.
