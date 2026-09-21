# How to Write Better AI Prompts: A Practical Framework

Most people prompt AI the way they search Google: a few keywords and hope. That works for trivia. It fails for writing, code, analysis — anything where quality matters. After testing hundreds of prompts across ChatGPT, Claude, and Gemini, one structure consistently wins.

## The 5-Part Prompt Framework

Every strong prompt has five parts: **Role, Context, Task, Constraints, Format**. Miss one and the model guesses — and its guesses are average by design.

### 1. Role — who should the model be?

Roles prime the model's vocabulary and standards. Compare "explain indexes" with "you are a senior Postgres DBA explaining indexes to a backend developer." The second answer uses the right depth, terms, and trade-offs.

Useful roles: senior code reviewer, patient tutor, skeptical editor, hiring manager, financial planner (not advisor).

### 2. Context — what does it need to know?

Models can't read your mind or your codebase. Give them the audience, the background, and the materials: paste the error message, the paragraph you're rewriting, the job description, the constraints of your project.

```text
Context: I'm a second-year CS student. We've covered arrays,
linked lists, and Big-O. I have a technical interview in 2 weeks.
```

Thirty seconds of context saves three rounds of "that's too advanced" follow-ups.

### 3. Task — one verb, one outcome

Vague tasks get vague answers. "Help with my resume" is a wish. "Rewrite these 3 bullet points to start with action verbs and include metrics" is a task. One prompt, one outcome. Chain prompts for bigger jobs.

### 4. Constraints — what "good" means

Constraints are where quality comes from: length ("under 150 words"), tone ("direct, no hype"), scope ("Python only, no external libraries"), and exclusions ("don't explain what a loop is").

### 5. Format — how to deliver it

Always specify the shape: table, numbered steps, code block with language tag, pros/cons list. Formatting instructions are the highest-leverage tokens in your prompt.

## Putting It Together

```text
Role: You are a patient DSA tutor.
Context: I know arrays and Big-O basics. Interview in 2 weeks.
Task: Teach me the two-pointer technique with 3 examples.
Constraints: Python only. Easy → medium difficulty. No jargon without a definition.
Format: For each example: problem (1 line), intuition (2-3 sentences),
code with comments, complexity. End with 5 practice problems ranked by difficulty.
```

## Few-Shot Examples Beat Instructions

For style-sensitive tasks, show don't tell. Paste 2–3 examples of the tone or format you want. A model shown two of your edited paragraphs will match your voice better than any adjective ("professional but warm") ever could.

| Technique | When to use | Example |
|---|---|---|
| Role prompting | Expert depth needed | "You are a senior SRE…" |
| Few-shot | Style/format matters | Paste 2 examples |
| Chain-of-thought | Reasoning tasks | "Think step by step" |
| Constraints | Vague answers | Length, tone, exclusions |

## Iterate Like a Developer

Treat prompts as code: version them, change one variable at a time, and keep what works in a snippet library. The most common fix is adding a constraint ("the answer was too long" → "max 120 words"). The second most common is adding context the model couldn't have known.

## Key takeaways

- Use the 5-part structure: role, context, task, constraints, format.
- Show 2–3 examples when style matters more than facts.
- One prompt, one outcome — chain prompts for big jobs.
- Iterate: add constraints first, context second.
