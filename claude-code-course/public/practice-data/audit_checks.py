"""
Acme Corp - Automated Audit Checks
Vendor validation and SoD detection script
"""

import csv

# Bug 1: wrong filename (hyphen instead of underscore)
APPROVED_VENDORS_FILE = "approved-vendors.csv"
TRANSACTIONS_FILE = "transactions.csv"

def load_approved_vendors():
    """Load approved vendor names from the CSV file."""
    vendors = set()
    with open(APPROVED_VENDORS_FILE, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            vendors.add(row["vendor_name"].strip())
    return vendors

def check_vendor_compliance(transactions, approved_vendors):
    """Flag any transaction from a vendor not on the approved list."""
    flags = []
    for row in transactions:
        vendor = row.get("vendor", "").strip()
        # Bug 2: comparing against wrong column — should be vendor, not category
        if row.get("category", "") not in approved_vendors:
            flags.append({
                "transaction_id": row["transaction_id"],
                "date": row["date"],
                "amount": row["amount"],
                "vendor": vendor,
                "reason": "Vendor not on approved list"
            })
    return flags

def check_sod(transactions):
    """Flag self-approvals (requester == approver)."""
    flags = []
    for row in transactions:
        if row.get("requester", "").strip() == row.get("approver", "").strip():
            flags.append({
                "transaction_id": row["transaction_id"],
                "date": row["date"],
                "amount": row["amount"],
                "person": row["requester"],
                "reason": "Self-approval detected"
            })
    return flags

def main():
    # Load data
    approved = load_approved_vendors()

    transactions = []
    with open(TRANSACTIONS_FILE, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            transactions.append(row)

    print(f"Loaded {len(transactions)} transactions")
    print(f"Loaded {len(approved)} approved vendors")
    print()

    # Run checks
    vendor_flags = check_vendor_compliance(transactions, approved)
    sod_flags = check_sod(transactions)

    # Print results
    print("=== VENDOR COMPLIANCE FLAGS ===")
    if vendor_flags:
        for f in vendor_flags:
            print(f"  {f['transaction_id']} | {f['date']} | £{f['amount']} | {f['vendor']} | {f['reason']}")
    else:
        print("  No issues found.")

    print()
    print("=== SEGREGATION OF DUTIES FLAGS ===")
    if sod_flags:
        for f in sod_flags:
            print(f"  {f['transaction_id']} | {f['date']} | £{f['amount']} | {f['person']} | {f['reason']}")
    else:
        print("  No issues found.")

    print()
    print(f"Summary: {len(vendor_flags)} vendor flags, {len(sod_flags)} SoD flags")

if __name__ == "__main__":
    main()
