ACME CORP — PRACTICE AUDIT DATA
================================
This folder contains fictional data for the Claude Code training course.
All names, amounts, and company details are made up.

FILES:
------
transactions.csv    — 120 expense transactions, Jan–Jun 2024
                      Columns: transaction_id, date, amount, category, vendor,
                               requester, approver
                      Contains deliberate anomalies for you to find.

employees.csv       — 10 employees with department, role, and salary band info

approved_vendors.csv — The company's approved vendor list with contract limits

audit_checks.py     — A Python script to automate vendor and SoD checks.
                      Contains 2 deliberate bugs. Your job: ask Claude to fix them.

HOW TO USE:
-----------
1. Open your terminal in this folder
2. Run: claude
3. Ask: "What files are here and what do they contain?"
4. Work through the exercises in Module 7 of the course

DELIBERATE ANOMALIES IN THE DATA:
----------------------------------
There are hidden issues planted in transactions.csv for you to discover.
Don't peek! Use Claude to find them.
