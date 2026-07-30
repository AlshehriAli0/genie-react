---
'genie-react': patch
---

Attribute React Native components to their real source files. Frames that resolve to a Metro bundle entry are now symbolicated through the dev server's `/symbolicate` endpoint, so `appOnly` keeps app components and still folds away `node_modules`. When symbolication is unavailable the bundle entry no longer counts as a library file, and any `appOnly` read that hides every result now says so as a warning instead of a parenthetical note.
</content>
</invoke>
