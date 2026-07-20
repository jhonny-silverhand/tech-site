## Most bad AI output is a prompting problem, not a model problem

When a response comes back generic, that's usually a signal the prompt was generic too. A more specific prompt almost always produces a more specific — and more useful — answer.

## The four things a good prompt gives the model

**Role.** Tell it who to be. "You're an editor at a technical publication" produces different sentences than no role at all — it sets a register and a standard.

**Context.** Give it the situation, not just the task. "Write a product description" is weak. "Write a product description for a $40 mechanical keyboard aimed at people upgrading from a laptop keyboard for the first time" tells the model who's reading and why.

**Constraints.** Length, format, tone, what to avoid. If you don't specify these, the model guesses — and its guess is usually the most generic, safest option, which is rarely what you actually wanted.

**Examples.** One good example of the output you want is worth several sentences of description. If you have a sample of the tone or format you're after, include it.

## A simple template

```
Role: [who the model should act as]
Task: [exactly what you want done]
Context: [the situation, audience, or background it needs]
Format: [length, structure, style]
Avoid: [anything specifically off-limits]
```

Fill in every line, even briefly. Skipping a line is the same as telling the model "guess."

## Iterate instead of starting over

If the first response is close but not right, don't rewrite the whole prompt — tell the model exactly what to change: "Keep the structure, but make the tone more casual and cut it to half the length." Treating it as a conversation instead of a vending machine gets to a good result faster than repeatedly rephrasing from scratch.

## One habit that fixes most problems

Before sending a prompt, read it as if you knew nothing about what you actually want. If a stranger could reasonably produce three very different answers to it, the model can too — and probably will pick the least useful one.
