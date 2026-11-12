# Working with Claude on this project

## The loop for every task

```
 ┌─ 1. git status clean? (commit or stash first)
 │  2. new branch for the phase:  git switch -c refactor/content-model
 │  3. paste the task Prompt from ROADMAP.md
 │  4. Claude explains the plan  ── you say "ok" or "change X"
 │  5. Claude codes
 │  6. you check: npm run lint · npm test · npm run words:check · open the page
 │  7. ask "explain this diff simply" if anything is unclear
 │  8. commit with the Commit name from ROADMAP.md, tick the box
 └─ back to 1
```

## Tips

1. **One task per conversation.** Start each one with:
   *"Read AGENTS.md and docs/ROADMAP.md. Let's do task 2.3."* Long conversations get summarised and lose detail.
2. **Ask for the plan before the code.** Add *"explain first, don't code yet"* when a task feels big.
3. **You are the Benga authority, Claude is not.** The PDF is OCR'd and damaged; Claude can misread it. For content tasks, ask Claude to list doubtful words and *you* decide.
4. **Small commits = easy undo.** If something goes wrong: `git restore .` (discard uncommitted changes) or `git revert <commit>` (undo a commit safely).
5. **Show, don't describe.** Paste the full error text, or ask Claude to open the page in the browser and look.
6. **Record decisions in AGENTS.md.** Anything you'd want a future session to know ("class 7 nouns never change", "we use Decap CMS") goes there — it's Claude's memory for this project.
7. **Learn as you go.** Useful phrases:
   - *"Explain this file like I'm new to Vue, with an example."*
   - *"Draw a diagram of how data flows from the JSON to the page."*
   - *"Give me a small exercise so I can make this change myself; then check my work."*
8. **Stop Claude when it goes too far.** "Only do X, nothing else" is a perfectly good instruction.
9. **Review before committing.** In VS Code's Source Control panel, read the changed lines. Ask about any line you don't understand.

## Mini glossary

| Word | Meaning here |
|---|---|
| Component | A reusable piece of page (`.vue` file), like a LEGO brick |
| Props | The inputs you give a component (`word="Epokolo"`) |
| JSON | The text format our content is stored in |
| Schema | The rules a JSON file must follow (which fields, which types) |
| Lexicon | Our list of every Benga word, each stored once |
| Route | A URL of the site and the page it shows |
| Branch | A parallel copy of the code to work on safely |
| Commit | A saved checkpoint with a message |
