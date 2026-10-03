---
title: "CamusGPT"
plateTitle: "CamusGPT"
version: "v0.4.0"
level: 3
order: 3
kind: "ML"
summary: "A fine-tuned 12B Camus persona that keeps his biography in a retrieval layer, so a wrong fact is a data bug and not a retrain."
role: "Trained the weights, built the knowledge base and the evaluation harness"
team: "Solo build"
duration: "About 2 months"
status: "In progress"
stack: ["Python", "PyTorch", "Ollama", "Unsloth", "rank-bm25", "Gradio"]
links:
  repo: "https://github.com/RafatH0ssain/camus-gpt"
figure:
  image: "../../src/assets/projects/camusgpt.png"
  alt: "Architecture diagram of CamusGPT: training the persona weights, a knowledge base feeding retrieval, the chat layer on Ollama, and the evaluation harness."
  schematic: "nodes"
  callouts:
    - { x: 0.49, y: 0.57, title: "Identity card", note: "About 230 tokens of verified facts sit in the prompt, so trivia cannot miss." }
    - { x: 0.69, y: 0.38, title: "Hybrid retrieval", note: "BM25 and dense fused by reciprocal rank, then a cross-encoder reranks the top 30." }
    - { x: 0.29, y: 0.77, title: "34 probes", note: "Ten categories, scored 1 to 5 by a judge, history keyed to the git commit." }
    - { x: 0.29, y: 0.37, title: "13,794 entries", note: "Semantic dedup cut about 19.6k extracted rows down without losing a curated fact." }
added:
  - "Shipped a 12B two-pass fine-tune, judged at factuality 4.06 against 3.44 for the 8B build it replaced."
  - "A knowledge base of 13,794 entries holding 109 hand-verified facts, trimmed so those facts surface more often."
  - "34 probes across 10 categories, scored through the real chat pipeline and tracked per commit."
  - "A memory layer, off by default, that fixed a self-reference probe scoring 0 of 5."
changed:
  - "Dropped DPO for a second balanced SFT pass after DPO caused mode collapse."
  - "Replaced the flat curated boost with BM25 fused into dense, then a cross-encoder reranker."
  - "Rejected a leaner CORE prompt after a blind A/B: median reply length only moved from 40 words to 38."
issues:
  - "Asking for a full list of works is bimodal: it refuses to catalogue in about half of runs."
  - "It still invents titles for posthumous work, and swaps the dogs out for cats."
  - "The public Space is inactive and its code still targets the 8B build."
decisions:
  - title: "Facts in retrieval, not in the weights"
    chose: "retrieve every biographical fact from a curated knowledge base at query time"
    instead: "baking his life into the fine-tuned weights"
    because: "an 8B holds a voice well but cannot store thousands of specific facts without confabulating them."
  - title: "Balanced SFT, no DPO"
    chose: "a second balanced supervised pass with a fresh guardrail adapter"
    instead: "DPO on adversarial preference pairs"
    because: "DPO caused mode collapse, and every narrow behaviour over-generalized until it was balanced with contrastive examples."
  - title: "Let the reranker promote, not decide"
    chose: "add the cross-encoder score to cosine, so it cannot sink a strong hit"
    instead: "letting the reranker set the final order on its own"
    because: "ms-marco scores conversational first-person facts negatively, so a hard rerank lost the pets that dense retrieval had found."
history:
  - { version: "v0.1.0", date: "2026-06", note: "First commit: files, cleanup and documentation." }
  - { version: "v0.2.0", date: "2026-07", note: "v1 shipped: 8B on Ollama locally and on a ZeroGPU Space, KB trimmed to 13,794 entries." }
  - { version: "v0.3.0", date: "2026-08", note: "v2 shipped: 12B two-pass fine-tune, factuality 3.44 to 4.06 on the judged probes." }
  - { version: "v0.3.0", date: "2026-08", note: "Memory layer added behind a flag, and a blind human A/B harness authored." }
  - { version: "v0.4.0", date: "2026-09", note: "First blind A/B rejected the lean prompt: median reply length only moved 40 words to 38." }
---

The project splits the problem in two: the weights are trained once to make the model speak and behave like Camus, and everything it knows about his life is retrieved at query time from a knowledge base mined from biographies and his own notebooks. A wrong fact is a data edit, not a retraining job.

Retrieval is the part that kept needing work. It started as one flat boost for hand-verified facts, which flooded unrelated prompts. It ended as BM25 fused with dense vectors by reciprocal rank, a cross-encoder reranking the top 30, and a small identity card in the prompt so the cat and the dogs are right even when retrieval misses. The judge scores 34 probes over 10 categories after every change, keyed to the commit, so a retrain cannot quietly make things worse.

The 12B build beat the 8B one, factuality 4.06 against 3.44, and it still confabulates trivia: it lists works as a refusal about half the time, invents a title or two, and calls the dogs cats. Those are weights problems, and the next retrain is scheduled around them.