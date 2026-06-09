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
  | 'screenshot'

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
        content: `Claude Code is an **AI assistant that can read your files, write code, analyse data, and make changes** — all through a chat interface in your browser. You type plain English and it does the technical work.

Think of it like having a very patient, very fast developer sitting next to you 24/7 who never gets tired of your questions — and you never need to install anything.`,
      },
      {
        type: 'tip',
        label: 'Why should an auditor care?',
        content: `Auditors are increasingly expected to work with data files, scripts, and automated tools. Claude Code lets you:\n- Understand code written by others without needing to learn to code yourself\n- Write scripts to analyse large datasets (hundreds of thousands of rows)\n- Automate repetitive audit checks\n- Stand out in interviews as someone who has embraced AI tools`,
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
          'Fix broken code',
          'Answer questions about files you\'ve never seen before',
          'Create professional audit reports and memos',
          'Run the scripts it writes and show you the output',
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
        content: `**How is this different from ChatGPT or the regular Claude chat?**

Regular web chat versions can *talk about* your data, but they can't actually *touch your files*. Claude Code runs in a cloud environment connected to your files, so it can open them, run checks, produce output files, and make real edits. It\'s the difference between describing how to analyse a spreadsheet versus actually analysing it for you.`,
      },
      {
        type: 'text',
        content: `**Web version vs desktop version**

There are two ways to use Claude Code:\n- **Desktop/terminal** — installed on your computer (not for you — your IT team won't allow it)\n- **Web version (claude.ai/code)** — runs entirely in your browser, no installation, works with your Pro subscription ✅

This course covers the **web version** exclusively.`,
      },
    ],
  },
  {
    id: 2,
    emoji: '🚀',
    title: 'Getting Started',
    subtitle: 'Set up Claude Pro and open Claude Code in your browser',
    duration: '15 min',
    blocks: [
      {
        type: 'text',
        content: `Everything runs in your browser. No downloads, no IT approval needed. You just need a **Claude Pro subscription** ($20/month or £18/month).`,
      },
      {
        type: 'text',
        content: `**Step 1 — Get Claude Pro**

Go to **claude.ai** and sign up or sign in. Then go to **Settings → Subscription → Upgrade to Pro**.

Pro gives you access to the most powerful Claude models and — critically — access to Claude Code.`,
      },
      {
        type: 'tip',
        label: 'Check with your employer first',
        content: `Some firms have an enterprise Claude subscription that already includes this. Ask your IT or finance team before paying personally — you may already have access.`,
      },
      {
        type: 'text',
        content: `**Step 2 — Open Claude Code**

Once you have Pro, go to **claude.ai/code** in your browser.

You\'ll see a workspace that looks like a coding environment — a chat panel on one side, and a file area on the other. This is where everything happens.`,
      },
      {
        type: 'text',
        content: `**Step 3 — Load the practice data**

For this course, you\'ll work with a fictional audit dataset. Download it below, then drag the files into Claude Code\'s file panel (or use the upload button).

Alternatively, just tell Claude: *"I\'m going to paste in some CSV data for you to analyse"* and paste it directly into the chat.`,
      },
      {
        type: 'download',
        label: 'Practice Audit Data',
        content: 'Download the fictional Acme Corp dataset — transactions, employees, vendors, and a buggy Python script. Used in Modules 4–7.',
      },
      {
        type: 'text',
        content: `**Step 4 — Start a new session**

Click **"New Session"** or **"New Project"**. Give it a name like "Audit Practice". This keeps your practice work separate from anything else.

You\'re ready.`,
      },
      {
        type: 'checklist',
        items: [
          'Claude Pro subscription active at claude.ai',
          'Opened claude.ai/code in your browser',
          'Downloaded the practice data (or ready to paste it)',
          'Created a new session called "Audit Practice"',
        ],
      },
    ],
  },
  {
    id: 3,
    emoji: '💬',
    title: 'Your First Session',
    subtitle: 'Learn how the interface works and how to get good results',
    duration: '15 min',
    blocks: [
      {
        type: 'text',
        content: `The Claude Code web interface has three main areas:\n\n**Chat panel** — where you type your instructions and Claude responds\n**File panel** — where your uploaded files appear; Claude can read and edit these\n**Terminal panel** — where Claude runs scripts and shows output (you don\'t need to touch this directly)

You only ever need to interact with the **chat panel**. Everything else Claude handles.`,
      },
      {
        type: 'tip',
        label: 'You are the director, Claude is the developer',
        content: `You don\'t need to know how to code. Your job is to describe what you want in plain English. Claude figures out how to do it. Think of yourself as a manager briefing a very capable analyst.`,
      },
      {
        type: 'text',
        content: `**Uploading files**

Click the paperclip / upload button in the chat, or drag files from your desktop into the chat panel. Claude will immediately be able to read them.

You can also paste CSV data directly into the chat message — just say "here\'s the data:" and paste it below.`,
      },
      {
        type: 'text',
        content: `**Tips for good results**

You don\'t need special syntax. Just write naturally. But a few things help:`,
      },
      {
        type: 'checklist',
        items: [
          'Be specific: "find transactions over £10k" is better than "find big transactions"',
          'Give context: "this is an expense report, columns are: Date, Amount, Employee, Approver"',
          'Say what format you want: "give me the result as a table" or "save it as a new file"',
          'Ask follow-ups: "now group those by department"',
          'Say no: "actually don\'t change it, just explain what you\'d do first"',
        ],
      },
      {
        type: 'conversation',
        label: 'Good vs better prompts',
        exchanges: [
          { role: 'you', text: '❌ Check this file' },
          { role: 'claude', text: 'I need more detail — what should I check for?' },
          { role: 'you', text: '✅ This is payroll_june.csv. Each row is an employee payment. Check for any employee paid more than twice in the same month, and flag any payments over £8,000.' },
          { role: 'claude', text: 'Understood. Scanning payroll_june.csv now…' },
        ],
      },
      {
        type: 'text',
        content: `**Reviewing what Claude does**

When Claude edits a file, it shows you a diff (before/after) so you can review it before accepting. Always read it. Claude is very good but not perfect — treat it like a smart colleague whose work you still sense-check.

You can always say "undo that" and Claude will revert the change.`,
      },
      {
        type: 'text',
        content: `**Keeping your work**

Files you create or edit in a session are available to download. At the end of a session, download anything important. Claude Code web sessions are cloud-based — think of it like a workspace that clears between sessions unless you connect it to a GitHub repository.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 3.1 — Your first interaction',
        content: `1. Upload transactions.csv to Claude Code (or paste its contents into the chat).\n2. Ask: "What columns does this file have and what does each one mean?"\n3. Ask: "How many rows are there and what date range does the data cover?"\n4. Ask: "Summarise this dataset in 3 bullet points as if briefing a senior manager."\n\nThere\'s no wrong answer — just notice how Claude reads the file and responds conversationally.`,
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
          { role: 'claude', text: 'transactions.csv has 6 columns:\n\n- **transaction_id** — unique reference number\n- **date** — when the transaction occurred (YYYY-MM-DD format)\n- **amount** — value in GBP\n- **category** — expense type (Travel, Equipment, Consultancy, etc.)\n- **requester** — employee who raised the purchase\n- **approver** — employee who signed it off\n\nThere are 120 rows spanning Jan–Jun 2024.' },
        ],
      },
      {
        type: 'conversation',
        label: 'Reading a Python script',
        exchanges: [
          { role: 'you', text: 'I\'ve been given audit_checks.py but I don\'t know Python. Can you explain what it does in plain English?' },
          { role: 'claude', text: 'No problem. Here\'s what audit_checks.py does:\n\n1. It opens two files: transactions.csv and approved_vendors.csv\n2. It checks each transaction to see if the vendor is on the approved list\n3. Any transaction from an unapproved vendor gets flagged\n4. It also checks for self-approvals (same person as requester and approver)\n5. At the end it prints a summary of how many flags were found\n\nIt\'s essentially two automated audit checks — vendor compliance and segregation of duties.' },
        ],
      },
      {
        type: 'text',
        content: `**Asking targeted questions**

You don\'t have to ask for a general summary. Ask specific questions:`,
      },
      {
        type: 'checklist',
        items: [
          '"Are there any duplicate transaction IDs in this file?"',
          '"Which approver approved the most transactions by value?"',
          '"Are there any transactions where the date falls on a weekend?"',
          '"What\'s the total spend by category?"',
          '"Does this script have any obvious errors?"',
          '"Is there anything unusual in this data that I should investigate?"',
        ],
      },
      {
        type: 'tip',
        label: 'The "flag anything suspicious" prompt',
        content: `One of the most powerful prompts for auditors:\n\n"Review this file as an external auditor would. Identify anything that looks unusual, inconsistent, or potentially incorrect. List your findings in order of severity."\n\nClaude will apply basic audit intuition — looking for round numbers, self-approvals, late-night timestamps, duplicate amounts, and more.`,
      },
      {
        type: 'conversation',
        label: 'Running a full audit scan',
        exchanges: [
          { role: 'you', text: 'Review transactions.csv as an external auditor. Flag anything suspicious.' },
          { role: 'claude', text: 'Scanned 120 transactions. Here are my findings:\n\n🔴 **High priority:**\n- 4 transactions where requester = approver (self-approval)\n- 1 transaction for £67,200 with no approver other than the requester themselves\n\n🟡 **Medium priority:**\n- 2 vendors not on the approved list (TechFix Ltd, JH Consulting Ltd)\n- Several round-number transactions (£5,000, £10,000) — worth verifying\n\n🟢 **Low priority:**\n- No weekend transactions found\n- No duplicate transaction IDs\n\nWant me to export the high-priority items to a separate file?' },
        ],
      },
      {
        type: 'exercise',
        label: 'Exercise 4.1 — Triage the practice data',
        content: `Upload transactions.csv and employees.csv to Claude Code, then:\n\n1. Ask Claude to explain what transactions.csv contains.\n2. Ask: "Which employee has the highest total spend?"\n3. Ask: "Flag any transactions where the amount is a round number over £1,000."\n4. Ask: "Are there any names in transactions.csv that don\'t appear in employees.csv? That might indicate an unknown vendor or ghost employee."\n\nFor each answer, ask a follow-up based on what Claude finds.`,
      },
    ],
  },
  {
    id: 5,
    emoji: '✏️',
    title: 'Making Changes with Claude',
    subtitle: 'Ask Claude to edit files, write scripts, and save your work',
    duration: '25 min',
    blocks: [
      {
        type: 'text',
        content: `Claude doesn\'t just read files — it can **edit them, create new ones, and run scripts**. You describe what you want in plain English and Claude does the technical work.`,
      },
      {
        type: 'warning',
        label: 'Always review before you accept',
        content: `When Claude edits a file, it shows you what changed (highlighted in green and red). Always glance at it before confirming. Claude is very good but not infallible — you\'re still the auditor responsible for the output.`,
      },
      {
        type: 'text',
        content: `**Creating a new file**`,
      },
      {
        type: 'conversation',
        label: 'Creating an audit report',
        exchanges: [
          { role: 'you', text: 'Create a new file called summary_report.md with a professional audit summary based on the findings we discussed. Use headings for Executive Summary, Findings, and Recommendations.' },
          { role: 'claude', text: 'Created summary_report.md. It includes an executive summary, the three high-priority findings with risk ratings, and recommended next steps for management. Want me to adjust the tone or add anything?' },
        ],
      },
      {
        type: 'text',
        content: `**Fixing a broken script**`,
      },
      {
        type: 'conversation',
        label: 'Fixing a script',
        exchanges: [
          { role: 'you', text: 'audit_checks.py crashes when it tries to run. Can you look at it and fix it?' },
          { role: 'claude', text: 'Found 2 bugs:\n\n1. Line 10: the script opens "approved-vendors.csv" but the actual file is "approved_vendors.csv" (underscore not hyphen)\n2. Line 23: it\'s comparing against the wrong column — checking "category" instead of "vendor"\n\nFixed both. Want to run it now to confirm it works?' },
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
          { role: 'you', text: 'Write a Python script that reads transactions.csv and produces a summary showing: total spend by category, number of transactions per month, and top 5 approvers by value. Show me the output.' },
          { role: 'claude', text: 'Written and running analysis.py now…\n\n**Total spend by category:**\nConsultancy: £89,400 | Equipment: £78,200 | Marketing: £52,100 | Travel: £28,500 | Other: £14,200\n\n**Transactions per month:**\nJan: 18 | Feb: 20 | Mar: 22 | Apr: 20 | May: 22 | Jun: 18\n\n**Top 5 approvers by value:**\n1. David Wright — £98,400\n2. Sarah Chen — £72,100\n…\n\nWant me to save this as a formatted report?' },
        ],
      },
      {
        type: 'text',
        content: `**Downloading your work**

Any file Claude creates appears in the file panel. Click it to download to your computer. If you want everything, ask: *"Zip all the output files so I can download them."*`,
      },
      {
        type: 'tip',
        label: 'Connecting GitHub for persistent work',
        content: `If you want your work to persist across sessions, connect Claude Code to a GitHub repository (free at github.com). Claude can commit your scripts and reports there, and you can pick up exactly where you left off next time. You don\'t need to know how Git works — Claude handles it.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 5.1 — Write your first audit script',
        content: `1. Upload transactions.csv to Claude Code.\n2. Say: "Write a Python script that reads transactions.csv and finds all self-approvals (where requester equals approver). Print each one with the date and amount."\n3. Ask Claude to run it: "Run the script now and show me the output."\n4. Ask: "Save the output to self_approvals.txt as well."\n5. Download self_approvals.txt from the file panel.\n\nDon\'t worry if you\'ve never touched Python — you\'re directing Claude, not writing it yourself.`,
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
        content: `Here are **six common audit scenarios** and exactly how to approach them in Claude Code web. These are the prompts you can copy and adapt for real work.`,
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
          { role: 'claude', text: 'Found 4 SoD violations:\n\n| ID | Date | Amount | Person |\n|---|---|---|---|\n| TXN-0009 | 2024-01-18 | £8,200 | James Harrison |\n| TXN-0026 | 2024-02-12 | £1,400 | Priya Patel |\n| TXN-0049 | 2024-03-14 | £8,200 | James Harrison |\n| TXN-0094 | 2024-05-19 | £67,200 | James Harrison |\n\nJames Harrison self-approved three times, including a £67,200 transaction. Want me to export this and add a risk flag column?' },
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
          { role: 'claude', text: 'Found 2 potential duplicates. I\'ll create duplicates.csv with the paired transactions and days between them.' },
        ],
      },
      {
        type: 'text',
        content: `**3. Benford\'s Law analysis**

Benford\'s Law says in large genuine datasets, the first digit follows a specific distribution. Deviations can signal manipulation.`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Run a Benford\'s Law analysis on the "amount" column in transactions.csv and tell me if any first-digit frequencies are suspicious.' },
          { role: 'claude', text: 'Ran Benford analysis on 120 transactions.\n\nAll digits within expected range except:\n- **Digit 6:** Expected 6.7%, actual 13.3% — elevated\n- **Digit 7:** Expected 5.8%, actual 10.8% — elevated\n\nThis suggests clustering around the £6,000–7,900 range, which might indicate transactions being kept just below an £8,000 approval threshold. Worth reviewing all transactions starting with 6 or 7.' },
        ],
      },
      {
        type: 'text',
        content: `**4. Vendor compliance check**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Compare the vendors in transactions.csv against approved_vendors.csv. List any transactions from vendors not on the approved list.' },
          { role: 'claude', text: 'Found 2 unapproved vendors:\n- **TechFix Ltd** — 5 transactions, £26,850 total. Not on approved list.\n- **JH Consulting Ltd** — 1 transaction, £67,200 total. Not on approved list, and the requester/approver is James Harrison. This may warrant further investigation.' },
        ],
      },
      {
        type: 'text',
        content: `**5. Writing audit documentation**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'Write an audit memo summarising the findings from today\'s review. Professional tone, suitable for a senior manager, max one page.' },
          { role: 'claude', text: 'Created audit_memo.md. It includes: scope of review, key findings with risk ratings, and recommended management actions. Want me to adjust anything or add a section?' },
        ],
      },
      {
        type: 'text',
        content: `**6. Understanding someone else\'s code**`,
      },
      {
        type: 'conversation',
        exchanges: [
          { role: 'you', text: 'The previous auditor left a Python script. I need to understand what it does before I present to management tomorrow. Can you give me a plain-English explanation of audit_checks.py?' },
          { role: 'claude', text: '**audit_checks.py** does two things:\n\n1. **Vendor check** — reads each transaction and checks whether the vendor appears in the approved vendor list. Any transaction from an unapproved vendor gets flagged.\n\n2. **Self-approval check** — finds any transaction where the same person both requested and approved it (a segregation of duties failure).\n\nIt then prints a summary of how many flags were found. You could think of it as an automated version of two things you might do manually in Excel — a VLOOKUP against the vendor list, and a "does column A equal column B" check.\n\nWant me to add comments inside the script to make it more readable?' },
        ],
      },
      {
        type: 'tip',
        label: 'Build your own prompt library',
        content: `When you find a prompt that works well, save it. Ask Claude to create a file called "my_audit_prompts.txt" and collect your best ones there. Download it and keep it. Over time you\'ll have a personal toolkit of audit prompts you can reuse on any engagement.`,
      },
    ],
  },
  {
    id: 7,
    emoji: '🏋️',
    title: 'Practice Exercises',
    subtitle: 'Hands-on tasks using the practice data — do these yourself',
    duration: '45 min',
    blocks: [
      {
        type: 'text',
        content: `These exercises use the practice audit data. Work through them in order — each builds on the last. The goal isn\'t a single right answer; it\'s getting comfortable directing Claude.

**How to start:** Open claude.ai/code, start a new session, upload all four files from the practice data download, then work through the exercises below.`,
      },
      {
        type: 'download',
        label: 'Practice Audit Project',
        content: 'Download and upload all four files to Claude Code: transactions.csv, employees.csv, approved_vendors.csv, and audit_checks.py.',
      },
      {
        type: 'exercise',
        label: 'Exercise 1 — Orient yourself (10 min)',
        content: `After uploading the files:\n\n1. Ask Claude: "What files have I uploaded and what does each one contain?"\n2. Ask: "What company does this data relate to, and what time period does it cover?"\n3. Ask: "How many employees are in employees.csv, and what departments are represented?"\n\n**Goal:** Get comfortable with Claude scanning files and summarising them in plain English.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 2 — Find the red flags (15 min)',
        content: `1. Ask Claude to review transactions.csv as an auditor and list anything suspicious.\n2. Ask it to specifically check for: self-approvals, round-number amounts over £5,000, and transactions from vendors not in approved_vendors.csv.\n3. Ask: "Which approver approved the highest total value of transactions?"\n4. Ask: "Are there any names in transactions.csv that don\'t appear in employees.csv?"\n\n**Goal:** Practice targeted audit questioning. Notice how each answer leads naturally to the next question.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 3 — Fix the broken script (10 min)',
        content: `The file audit_checks.py has 2 deliberate bugs planted in it.\n\n1. Ask Claude: "Try to run audit_checks.py and tell me if there are any errors."\n2. Ask: "Fix all the errors you find."\n3. Ask: "Run it again and show me the output."\n\n**Goal:** Practice using Claude to diagnose and fix code you didn\'t write and don\'t understand. Notice how Claude explains what was wrong in plain English.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 4 — Write a new check (10 min)',
        content: `Ask Claude to write a new script called threshold_check.py that:\n- Reads transactions.csv\n- Flags any transaction within 10% below £5,000 or £10,000 (these might be split intentionally to avoid approval limits)\n- Saves results to threshold_flags.csv\n\nThen ask Claude to run it and explain the results in plain English.\n\n**Goal:** Direct Claude to write a complete audit tool from your description. You don\'t write a single line of code.`,
      },
      {
        type: 'exercise',
        label: 'Exercise 5 — Write the final report (10 min)',
        content: `1. Ask Claude to write a professional audit report summarising everything found in Exercises 1–4.\n2. Ask for it formatted with sections: Executive Summary, Scope, Findings (high/medium/low), Recommendations.\n3. Ask: "What would a senior auditor say is missing from this report?"\n4. Add whatever Claude suggests.\n5. Download the finished report from the file panel.\n\n**Goal:** Turn raw findings into a polished deliverable — the kind of thing that used to take hours now takes minutes.`,
      },
      {
        type: 'tip',
        label: 'You\'re done — what next?',
        content: `You now know enough to use Claude Code in real audit work. The fastest way to improve is to bring it into your next actual task. Some ideas:\n\n- Paste a confusing formula or script and ask Claude to explain it\n- Upload a real (anonymised) dataset and ask Claude to flag anything unusual\n- Ask Claude to draft a data request letter or audit scope document\n\nThe more you use it, the faster you\'ll build your own library of prompts that work for your specific area.`,
      },
    ],
  },
]

export function getModule(id: number): Module | undefined {
  return MODULES.find(m => m.id === id)
}
