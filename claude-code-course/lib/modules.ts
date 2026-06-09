export type BlockType =
  | 'text'
  | 'command'
  | 'code'
  | 'tip'
  | 'warning'
  | 'exercise'
  | 'checklist'
  | 'conversation'
  | 'download'

export interface Block {
  type: BlockType
  label?: string
  content?: string
  items?: string[]
  exchanges?: { role: 'you' | 'claude'; text: string }[]
  filename?: string
}

export interface Module {
  id: number
  emoji: string
  title: string
  subtitle: string
  duration: string
  blocks: Block[]
}

export const MODULES: Module[] = [
  {
    id: 1,
    emoji: '🤖',
    title: 'What is Claude Code?',
    subtitle: 'Understand what the tool is and why it matters for your career',
    duration: '10 min',
    blocks: [
      {
        type: 'text',
        content: `Claude Code is an **AI assistant that lives inside your terminal** (the black command-line window on your computer). You type plain English questions and instructions, and it reads your files, writes code, explains things, and makes changes — all without you needing to know how to program.

Think of it like having a very patient, very fast developer sitting next to you 24/7 who never gets tired of your questions.`,
      },
      {
        type: 'tip',
        label: 'Why should an auditor care?',
        content: `Auditors are increasingly expected to work with data files, scripts, and automated tools. Claude Code lets you:\n- Understand code written by others without needing to learn to code yourself\n- Write scripts to analyse large datasets (hundreds of thousands of rows)\n- Automate repetitive audit checks\n- Stand out in job interviews as someone who's embraced AI tools`,
      },
      {
        type: 'text',
        content: `**What can it actually do?**`,
      },
      {
        type: 'checklist',
        items: [
          'Read and explain any file — CSV, Python, JavaScript, SQL, Excel formulas',
          'Find anomalies in transaction data ("find all transactions over £10,000")',
          'Write audit scripts from your plain-English description',
          'Refactor or fix broken code',
          'Answer questions about a codebase you\'ve never seen before',
          'Commit code to Git and create pull requests',
          'Run tests and fix the failures',
        ],
      },
      {
        type: 'conversation',
        label: 'Real example',
        exchanges: [
          { role: 'you', text: 'Can you look at transactions.csv and flag any where the amount is above £50,000 and the approver and requester are the same person?' },
          { role: 'claude', text: 'I\'ve scanned transactions.csv (12,483 rows). Found 3 transactions matching your criteria:\n\n- Row 4,821: £67,200 — Requester & Approver both "J. Harrison"\n- Row 9,104: £55,000 — Requester & Approver both "M. Osei"\n- Row 11,230: £82,400 — Requester & Approver both "J. Harrison"\n\nWant me to export these to a separate file or add a flag column?' },
        ],
      },
      {
        type: 'text',
        content: `**How is this different from ChatGPT or Claude.ai on the web?**

The web chat versions can *talk about* code, but they can't actually *touch your files*. Claude Code runs on your computer, so it can open your actual files, make real edits, and run commands. It's the difference between asking someone to describe how to bake a cake versus having them in your kitchen doing it with you.`,
      },
    ],
  },
  {
    id: 2,
    emoji: '⚙️',
    title: 'Installation & Setup',
    subtitle: 'Get Claude Code installed and connected to your account',
    duration: '20 min',
    blocks: [
      {
        type: 'text',
        content: `You'll need two things: **Node.js** (a platform that runs JavaScript tools) and a **Claude account**. Both are free to get started.`,
      },
      {
        type: 'text',
        content: `**Step 1 — Install Node.js**

Go to [nodejs.org](https://nodejs.org) and download the **LTS version** (the one labelled "Recommended For Most Users"). Run the installer and click through the defaults.

To check it worked, open your terminal and run:`,
      },
      {
        type: 'command',
        content: 'node --version',
      },
      {
        type: 'tip',
        label: 'How to open a terminal',
        content: `**Mac:** Press ⌘ + Space, type "Terminal", press Enter.\n**Windows:** Press the Windows key, type "PowerShell", press Enter.\n**Windows (alternative):** Right-click the Start button → "Windows Terminal"`,
      },
      {
        type: 'text',
        content: `You should see something like \`v22.11.0\`. Any number is fine as long as the command runs.

**Step 2 — Install Claude Code**`,
      },
      {
        type: 'command',
        content: 'npm install -g @anthropic-ai/claude-code',
      },
      {
        type: 'text',
        content: `This downloads and installs Claude Code globally on your machine. It takes about 30 seconds.

**Step 3 — Sign in**

Run Claude Code for the first time:`,
      },
      {
        type: 'command',
        content: 'claude',
      },
      {
        type: 'text',
        content: `It will open a browser window asking you to sign in with your Anthropic account (or create one at claude.ai). Once you approve, you're connected.

**Step 4 — Verify it works**

Back in your terminal you should see the Claude Code prompt. Type:`,
      },
      {
        type: 'command',
        content: 'Hello! What can you help me with?',
      },
      {
        type: 'text',
        content: `Claude will reply and you're ready to go.`,
      },
      {
        type: 'warning',
        label: 'Pricing note',
        content: `Claude Code uses API credits. There is a free tier, but heavy usage will cost a small amount (typically a few pence per hour of active use). For learning purposes the free tier is more than enough. You can set spending limits in your Anthropic account dashboard.`,
      },
      {
        type: 'checklist',
        items: [
          'Node.js installed (`node --version` shows a number)',
          'Claude Code installed (`npm install -g @anthropic-ai/claude-code` ran without errors)',
          'Signed in to Anthropic account',
          'Successfully ran `claude` and got a response',
        ],
      },
    ],
  },
  {
    id: 3,
    emoji: '💬',
    title: 'Your First Session',
    subtitle: 'Learn the basic commands and how to navigate Claude Code',
    duration: '15 min',
    blocks: [
      {
        type: 'text',
        content: `The most important thing to understand: **Claude Code always operates inside a folder**. When you open a terminal in a folder, Claude can see all the files in it. So the first step is always to navigate to the folder you want to work in.`,
      },
      {
        type: 'text',
        content: `**Opening a folder in your terminal**`,
      },
      {
        type: 'tip',
        label: 'The easy way (Mac/Windows)',
        content: `**Mac:** In Finder, right-click any folder → "New Terminal at Folder"\n**Windows:** In File Explorer, right-click any folder while holding Shift → "Open PowerShell window here"\n**Or drag the folder** into an open terminal window — it automatically types the path for you.`,
      },
      {
        type: 'text',
        content: `**Key commands to know**`,
      },
      {
        type: 'checklist',
        items: [
          '`claude` — start a new Claude Code session in the current folder',
          '`/help` — show all available commands inside Claude Code',
          '`/exit` or Ctrl+C — quit Claude Code',
          '`/clear` — clear the current conversation (start fresh)',
          '`/status` — show what project you\'re in and recent changes',
          'Up arrow — recall your last command (just like a regular terminal)',
        ],
      },
      {
        type: 'text',
        content: `**Talking to Claude — tips for good results**

You don't need special syntax. Just write naturally, as you would to a colleague. But a few things help:`,
      },
      {
        type: 'checklist',
        items: [
          'Be specific: "find transactions over £10k" is better than "find big transactions"',
          'Give context: "this is an expense report CSV, the columns are Date, Amount, Employee, Approver"',
          'Say what format you want: "give me the result as a table" or "export to a new file"',
          'Ask follow-ups: "now add a column showing the variance from the average"',
          'Say no: "actually don\'t do that, just explain what you\'d do first"',
        ],
      },
      {
        type: 'conversation',
        label: 'Good vs better prompts',
        exchanges: [
          { role: 'you', text: '❌ Check this file' },
          { role: 'claude', text: 'I need more detail — what should I check for?' },
          { role: 'you', text: '✅ This is payroll_june.csv. Each row is an employee payment. Check for any employee who was paid more than twice in the same month, and flag any payments over £8,000.' },
          { role: 'claude', text: 'Understood. Scanning payroll_june.csv now…' },
        ],
      },
      {
        type: 'text',
        content: `**Understanding what Claude can and can't do**`,
      },
      {
        type: 'checklist',
        items: [
          '✅ Read any text file (CSV, JSON, Python, JavaScript, SQL, Markdown, plain text)',
          '✅ Write and edit files',
          '✅ Run terminal commands on your machine',
          '✅ Search the web (when connected)',
          '✅ Explain concepts in plain English',
          '❌ Open Excel/Word natively (but can read .csv and explain formulas)',
          '❌ See images in files unless you paste them',
          '❌ Access private systems or databases it doesn\'t have credentials for',
        ],
      },
      {
        type: 'exercise',
        label: 'Exercise 3.1 — Your first session',
        content: `1. Open your terminal in the practice data folder (downloaded in Module 1).\n2. Run \`claude\`.\n3. Ask: "What files are in this folder and what do they contain?"\n4. Ask: "Summarise the company this data seems to be about in 2 sentences."\n\nThere's no wrong answer — just notice how Claude scans the files and responds.`,
      },
    ],
  },
  {
    id: 4,
    emoji: '🔍',
    title: 'Reading & Understanding Files',
    subtitle: 'Use Claude to make sense of data and code files quickly',
    duration: '20 min',
    blocks: [
      {
        type: 'text',
        content: `One of the most immediately useful things Claude Code does is **explain files you\'ve never seen before**. As an auditor, you\'re often handed a folder of data or code and asked to review it. Claude can do the initial triage in minutes.`,
      },
      {
        type: 'text',
        content: `**Asking Claude to explain a file**`,
      },
      {
        type: 'conversation',
        label: 'Reading a CSV',
        exchanges: [
          { role: 'you', text: 'Open transactions.csv and explain what each column means.' },
          { role: 'claude', text: 'transactions.csv has 6 columns:\n\n- **transaction_id** — unique reference number\n- **date** — when the transaction occurred (YYYY-MM-DD format)\n- **amount** — value in GBP\n- **category** — expense type (Travel, Equipment, Consultancy, etc.)\n- **requester** — employee who raised the purchase\n- **approver** — employee who signed it off\n\nThere are 847 rows spanning Jan–Jun 2024.' },
        ],
      },
      {
        type: 'conversation',
        label: 'Reading a Python script',
        exchanges: [
          { role: 'you', text: 'I\'ve been given audit_checks.py but I don\'t know Python. Can you explain what it does in plain English?' },
          { role: 'claude', text: 'No problem. Here\'s what audit_checks.py does:\n\n1. It opens two CSV files: transactions.csv and approved_vendors.csv\n2. It checks each transaction to see if the vendor is on the approved list\n3. Any transaction from an unapproved vendor gets written to a new file called flagged_vendors.csv\n4. At the end it prints a summary of how many flags were found\n\nIt\'s essentially an automated vendor check — the same thing you might do manually in Excel with a VLOOKUP, but running automatically on the full dataset.' },
        ],
      },
      {
        type: 'text',
        content: `**Asking targeted questions**

You don't have to ask for a general summary — you can ask specific questions:`,
      },
      {
        type: 'checklist',
        items: [
          '"Are there any duplicate transaction IDs in this file?"',
          '"Which approver approved the most transactions?"',
          '"Are there any transactions where the date is a weekend?"',
          '"What\'s the total spend by category?"',
          '"Does this script have any obvious errors?"',
          '"Is there anything unusual in this data that I should investigate?"',
        ],
      },
      {
        type: 'tip',
        label: 'The "flag anything suspicious" prompt',
        content: `One of the most powerful prompts for auditors:\n\n"Review this file as an external auditor would. Identify anything that looks unusual, inconsistent, or potentially incorrect. List your findings in order of severity."\n\nClaude will apply basic audit intuition — looking for round numbers, self-approvals, late-night transactions, duplicate amounts, etc.`,
      },
      {
        type: 'conversation',
        label: 'Running a full audit scan',
        exchanges: [
          { role: 'you', text: 'Review transactions.csv as an external auditor. Flag anything suspicious.' },
          { role: 'claude', text: 'Scanned 847 transactions. Here are my findings:\n\n🔴 **High priority:**\n- 4 transactions where requester = approver (self-approval)\n- 2 transactions on public holidays (25 Dec, 1 Jan)\n\n🟡 **Medium priority:**\n- 12 round-number transactions (exactly £5,000 or £10,000) — common in fraud\n- 3 transactions with same amount, same vendor, same week (possible duplicates)\n\n🟢 **Low priority:**\n- 6 transactions categorised as "Other" with no description\n\nWant me to export any of these to a separate file for review?' },
        ],
      },
      {
        type: 'exercise',
        label: 'Exercise 4.1 — Triage the practice data',
        content: `Using the downloaded practice data:\n1. Ask Claude to explain what transactions.csv contains.\n2. Ask: "Which employee has the highest total spend?"\n3. Ask: "Flag any transactions where the amount is a round number over £1,000."\n4. Ask: "Are there any weekend transactions? Show me the dates."\n\nFor each answer, try asking a follow-up question based on what Claude found.`,
      },
    ],
  },
  {
    id: 5,
    emoji: '✏️',
    title: 'Making Changes with Claude',
    subtitle: 'Ask Claude to edit files, write scripts, and use Git safely',
    duration: '25 min',
    blocks: [
      {
        type: 'text',
        content: `Claude doesn't just read files — it can **edit them, create new ones, and run commands**. This is where it gets really powerful. You describe what you want in plain English and Claude makes the changes.`,
      },
      {
        type: 'warning',
        label: 'Always review before you accept',
        content: `When Claude makes a change, it shows you a diff (a before/after comparison highlighted in green and red). Always read it before saying "yes". Claude is very good but not perfect — treat it like a smart intern whose work you still review.`,
      },
      {
        type: 'text',
        content: `**Creating a new file**`,
      },
      {
        type: 'conversation',
        label: 'Creating an audit report',
        exchanges: [
          { role: 'you', text: 'Create a new file called summary_report.md with a professional audit summary of what we found in transactions.csv. Use the findings we discussed.' },
          { role: 'claude', text: 'I\'ve created summary_report.md with:\n- Executive summary\n- Methodology\n- Findings (high/medium/low priority)\n- Recommended next steps\n\nShall I open it so you can review?' },
        ],
      },
      {
        type: 'text',
        content: `**Editing an existing file**`,
      },
      {
        type: 'conversation',
        label: 'Fixing a script',
        exchanges: [
          { role: 'you', text: 'audit_checks.py crashes when it tries to run. Can you look at it and fix it?' },
          { role: 'claude', text: 'Found the issue — on line 14, the script tries to open "approved-vendors.csv" but the actual file is named "approved_vendors.csv" (underscore not hyphen). Fixed.\n\nAlso noticed the script will crash on empty rows. Added a check for that too. Want to review the changes before I save?' },
        ],
      },
      {
        type: 'text',
        content: `**Writing a script from scratch**`,
      },
      {
        type: 'conversation',
        label: 'Writing your first script',
        exchanges: [
          { role: 'you', text: 'Write a Python script that reads transactions.csv and produces a summary showing: total spend by category, number of transactions per month, and top 5 approvers by value. Save the output to report.txt.' },
          { role: 'claude', text: 'Written analysis.py. It:\n1. Groups by category and sums amounts\n2. Groups by month (extracted from the date column)\n3. Ranks approvers by total value they signed off\n4. Writes all three tables to report.txt\n\nRun it with: python analysis.py' },
        ],
      },
      {
        type: 'text',
        content: `**Using Git to save your work safely**

Git is a version control system — it's like a permanent "track changes" for any folder. Claude can use it for you. You don't need to understand Git deeply; just know these three commands Claude will run on your behalf:`,
      },
      {
        type: 'checklist',
        items: [
          '`git init` — turn a folder into a tracked project (do this once)',
          '`git add .` — stage all changes (tell Git "these are the changes I want to save")',
          '`git commit -m "message"` — save a snapshot with a description',
        ],
      },
      {
        type: 'conversation',
        label: 'Saving your work with Git',
        exchanges: [
          { role: 'you', text: 'Save all the changes we\'ve made today to Git.' },
          { role: 'claude', text: 'Staged and committed:\n\n```\n[main a3f2c1b] Add audit analysis scripts and summary report\n 3 files changed, 127 insertions(+), 2 deletions(-)\n```\n\nYour work is saved. You can always roll back to this point if anything breaks later.' },
        ],
      },
      {
        type: 'tip',
        label: 'The undo button',
        content: `If Claude makes a change you didn't want, just say "undo that" or "revert that change". Claude will reverse it. If you\'re using Git, it can also roll back to any previous commit — like a time machine for your files.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 5.1 — Write your first script',
        content: `1. Open a Claude session in the practice data folder.\n2. Say: "Write a Python script that reads transactions.csv and finds all self-approvals (where requester equals approver). Print each one with the date and amount."\n3. Ask Claude to run it: "Run the script now."\n4. Ask: "Save the output to self_approvals.txt instead of printing it."\n\nDon't worry if you've never written Python — you're directing Claude, not writing it yourself.`,
      },
    ],
  },
  {
    id: 6,
    emoji: '📊',
    title: 'Real Audit Tasks',
    subtitle: 'Apply Claude Code to tasks you actually do at work',
    duration: '30 min',
    blocks: [
      {
        type: 'text',
        content: `Here are **six common audit scenarios** and exactly how to use Claude Code for each. These are the prompts you can copy and adapt for real work.`,
      },
      {
        type: 'text',
        content: `**1. Segregation of Duties check**

Flag transactions where the same person requested and approved.`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'In transactions.csv, find all rows where the "requester" column equals the "approver" column. Show the transaction ID, date, amount, and the person\'s name.' },
          { role: 'claude', text: 'Found 4 SoD violations:\n\n| ID | Date | Amount | Person |\n|---|---|---|---|\n| TXN-0421 | 2024-03-14 | £8,200 | J. Harrison |\n| TXN-0558 | 2024-04-02 | £1,400 | M. Osei |\n| TXN-0712 | 2024-05-19 | £67,200 | J. Harrison |\n| TXN-0834 | 2024-06-08 | £3,100 | P. Wong |\n\nNotably J. Harrison self-approved twice, including a £67,200 transaction. Want me to export this and add a risk flag column?' },
        ],
      },
      {
        type: 'text',
        content: `**2. Duplicate payment check**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Check transactions.csv for potential duplicate payments: same amount, same vendor, within 7 days of each other.' },
          { role: 'claude', text: 'Found 3 potential duplicates. Exporting to duplicates.csv with columns showing the paired transactions and the days between them.' },
        ],
      },
      {
        type: 'text',
        content: `**3. Benford's Law analysis**

Benford's Law states that in large datasets of real numbers, the first digit follows a specific distribution. Deviations can signal manipulation.`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Run a Benford\'s Law analysis on the "amount" column in transactions.csv and tell me if any first-digit frequencies are suspicious.' },
          { role: 'claude', text: 'Ran Benford analysis on 847 transactions.\n\nAll digits within expected range except:\n- **Digit 6:** Expected 6.7%, actual 14.2% — significantly elevated\n- **Digit 7:** Expected 5.8%, actual 11.4% — significantly elevated\n\nThis could indicate clustering of transactions in the £6,000–7,999 range (potentially to stay under an £8,000 approval threshold). Recommend reviewing all transactions starting with 6 or 7.' },
        ],
      },
      {
        type: 'text',
        content: `**4. Vendor master clean-up**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Compare the vendors in transactions.csv against approved_vendors.csv. List any transactions from vendors not on the approved list.' },
          { role: 'claude', text: 'Found 8 transactions from unapproved vendors, totalling £23,400. The most frequent is "TechFix Ltd" (5 transactions, £14,200) — not on the approved list. Want me to check if this could be a name variation of an existing approved vendor?' },
        ],
      },
      {
        type: 'text',
        content: `**5. Writing audit documentation**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Write an audit memo summarising the findings from today\'s review. Make it suitable for a senior manager, in professional tone, max 1 page.' },
          { role: 'claude', text: 'Created audit_memo.md. It includes: scope of review, key findings with risk ratings, and recommended management actions. Want me to adjust the tone or add anything?' },
        ],
      },
      {
        type: 'text',
        content: `**6. Understanding someone else\'s code**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'The previous auditor left a folder of Python scripts. I need to understand what each one does before I present to management tomorrow. Can you give me a one-paragraph plain-English summary of each .py file in this folder?' },
          { role: 'claude', text: 'Here\'s a summary of each script:\n\n**audit_checks.py** — Validates each transaction against the approved vendor list and flags mismatches.\n\n**threshold_report.py** — Finds all transactions close to approval thresholds (within 10% below £5k, £10k, £25k limits).\n\n**month_end.py** — Calculates monthly totals by category and compares them to budget figures in budget.csv.\n\nWant me to add comments inside the scripts so they\'re easier to read?' },
        ],
      },
      {
        type: 'tip',
        label: 'Saving useful prompts',
        content: `When you find a prompt that works well, save it. Create a file called "my_audit_prompts.txt" in your Claude Code project and ask Claude to help you build a library. Over time you'll have reusable prompts for every common audit task.`,
      },
    ],
  },
  {
    id: 7,
    emoji: '🏋️',
    title: 'Practice Exercises',
    subtitle: 'Hands-on tasks using real-world audit data — do these yourself',
    duration: '45 min',
    blocks: [
      {
        type: 'text',
        content: `These exercises use the **practice audit project** (download below). Work through them in order — each one builds on the last. There\'s no single right answer; the goal is to get comfortable directing Claude.`,
      },
      {
        type: 'download',
        label: 'Practice Audit Project',
        content: 'Download the practice data folder. It contains realistic (fictional) transaction data, employee records, vendor lists, and a broken Python script.',
      },
      {
        type: 'exercise',
        label: 'Exercise 1 — Orient yourself (10 min)',
        content: `Open a Claude session in the practice-data folder.\n\n1. Ask Claude: "What files are here and what does each one contain?"\n2. Ask: "What company does this data relate to, and what time period does it cover?"\n3. Ask: "How many employees are in employees.csv, and what departments are represented?"\n\n**Goal:** Get comfortable with Claude scanning files and summarising them.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 2 — Find the red flags (15 min)',
        content: `1. Ask Claude to review transactions.csv as an auditor and list anything suspicious.\n2. Ask it to specifically check for: self-approvals, weekend transactions, and round-number amounts.\n3. Ask: "Which approver approved the highest total value of transactions?"\n4. Ask: "Are there any employees in transactions.csv who don't appear in employees.csv? That might indicate a ghost employee."\n\n**Goal:** Practice targeted audit questioning.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 3 — Fix the broken script (10 min)',
        content: `The file audit_checks.py in the practice folder has 2 deliberate bugs.\n\n1. Ask Claude: "Run audit_checks.py and tell me if there are any errors."\n2. Ask: "Fix all the errors you find."\n3. Ask: "Now run it again and show me the output."\n\n**Goal:** Practice using Claude to fix code you didn\'t write and don\'t understand.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 4 — Write a new check (10 min)',
        content: `1. Ask Claude to write a new Python script called threshold_check.py that:\n   - Reads transactions.csv\n   - Flags any transaction within 10% below £5,000 or £10,000 (these might be intentionally split to avoid approval limits)\n   - Saves results to threshold_flags.csv\n2. Ask Claude to run it.\n3. Ask Claude to explain the results in plain English.\n\n**Goal:** Direct Claude to write a complete audit tool from scratch.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 5 — Write the final report (10 min)',
        content: `1. Ask Claude to write a professional audit report summarising everything found in Exercises 1–4.\n2. Ask it to format it as Markdown with sections: Executive Summary, Scope, Findings (high/medium/low), Recommendations.\n3. Ask: "What\'s missing from this report that a senior auditor would want to see?"\n4. Add whatever Claude suggests.\n\n**Goal:** Turn raw findings into a polished deliverable — fast.`,
      },
      {
        type: 'tip',
        label: 'You\'re done — what next?',
        content: `You now know enough to use Claude Code in real audit work. The fastest way to get better is to bring it into your next actual task, even just for one step. Some ideas:\n\n- Paste a confusing formula or script and ask Claude to explain it\n- Ask Claude to help you write a data request\n- Use it to analyse a real (anonymised) dataset\n\nThe more you use it, the faster you\'ll develop your own library of prompts that work for your specific area.`,
      },
    ],
  },
]

export function getModule(id: number): Module | undefined {
  return MODULES.find(m => m.id === id)
}
