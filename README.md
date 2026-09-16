# Personal website

Portfolio site for Yizhou (Russell) Lu — static HTML/CSS/JS, no build step.

Live: https://www.russyizhoulu.site (English) · https://www.russyizhoulu.site/zh.html (中文)

## Pages

- `index.html` / `zh.html` — homepage (EN / 中文): positioning, JobSignal flagship, selected cases, more engineering work, learning, experience, contact
- `work/jobsignal.html` — JobSignal engineering case study
- `work/cross-llm-workflow.html` — Cross-LLM Development Workflow case study
- `work/freshlens.html` — FreshLens internship case study
- `resume.pdf` — linked from the header, hero, experience, and footer; drop the PDF at the repo root

Case study pages are English only; the Chinese homepage links to them.

## Develop

Open `index.html` in a browser, or serve locally:

```
python -m http.server 8000
```

## Deploy

```
vercel deploy          # preview
vercel deploy --prod   # production
```
