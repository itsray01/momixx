# Design skills for Claude Code

These are the design and testing skills requested for working on this site. None of them is in the organisation's Claude plugin catalogue, so install them on your own machine. Installing them in a temporary cloud session doesn't persist.

The sources below were checked on 2 Oct 2026. Install only from these repositories. Re-uploads and "bundles" of these skills by other accounts exist; avoid them.

| Skill | Official source | What it does | Runs code? |
|---|---|---|---|
| UI UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill` | Searchable design data (styles, palettes, font pairings, UX rules) and a design-system generator | Yes, local Python search scripts |
| Taste Skill | `Leonxlnx/taste-skill` | "Anti-slop" frontend design rules with variance, motion and density settings | No, instructions only |
| Impeccable | `pbakaus/impeccable` | Design audit, polish and critique commands, plus anti-pattern detection | **Yes.** Downloads a binary and installs hooks that run on every edit (see the note below) |
| Emil Kowalski's Skills | `emilkowalski/skills` | Design-engineering and animation taste (easing, motion review) | No, instructions only |
| Interface Design | `Dammyjay93/interface-design` | Consistent design decisions for product UI. Aimed at dashboards and apps more than marketing sites | No, instructions only |
| Web Design Guidelines | `vercel-labs/agent-skills` (`web-design-guidelines`) | Reviews UI against Vercel's Web Interface Guidelines | No, but fetches its rules from GitHub each time it runs |
| webapp-testing | `anthropics/skills` (`webapp-testing`) | Tests local web apps with Playwright (screenshots, logs) | Yes, Python with Playwright |

## Install commands (as published by each author)

```bash
# UI UX Pro Max
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill

# Taste Skill (main skill only)
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# Impeccable (run from the project root, then /impeccable init)
npx impeccable install

# Emil Kowalski's Skills
npx skills@latest add emilkowalski/skills

# Interface Design
npx skills add https://github.com/dammyjay93/interface-design --skill interface-design --agent claude-code -g

# Web Design Guidelines
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines

# webapp-testing (installs Anthropic's example-skills bundle, which includes it)
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
```

Lines starting with `/plugin` are typed inside Claude Code. The `npx` lines run in a terminal.

**Note on Impeccable.** It is the most invasive of these. Its hooks run on every file edit and when Claude stops, and it downloads a binary engine to `~/.impeccable/bin/`. Install it only if you're comfortable with that.

## Also requested

- **frontend-design.** Anthropic's skill, available in the organisation's plugin directory. Enable it from the claude.ai plugin card.
- **graphify** (`uv tool install graphifyy`, then `graphify install`). It turns a codebase into a queryable knowledge graph for AI assistants. It isn't a design tool.
