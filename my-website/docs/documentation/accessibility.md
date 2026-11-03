---
id: accessibility
title: "Usability & Digital Accessibility"
displayed_sidebar: null
---

This document records the accessibility evaluation of the DocShield web app. Each step of the anonymization flow (upload, processing, review and download) was tested, and every problem found was mapped to the affected user profile, the WCAG criterion it breaks, its severity and the proposed solution.

---

## Tools Used

| # | Tool | Purpose |
|---|---|---|
| 01 | Coblis | Color blindness simulation |
| 02 | Firefox DevTools | Accessibility tree and keyboard focus inspection |
| 03 | WebAIM Contrast Checker | Colour contrast verification |
| 04 | NVDA (Windows) | Screen reader testing |
| 05 | Lighthouse | Automated accessibility audit |

Reference for the WCAG criteria: [thewcag.com](https://www.thewcag.com/)

---

## Step 1: Upload

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/upload.png').default} alt="Upload step" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

| Screen – Element | Affected Profile | Problem | WCAG Criteria | Severity | Proposed Solution |
|---|---|---|---|---|---|
| Modal with information | Physical limitations | The focus didn't go inside the modal | 2.1.1 Keyboard | High | Ensure focus moves into the modal upon opening, traps Tab navigation inside, and returns to the triggering control when closed *(a general problem, noticed here)* |
| Drop zone – file feedback | Blind people | Adding files or rejecting an unsupported format wasn't announced | 4.1.3 Status messages | High | Always-present `role="status"` region announces "N files added" or "Unsupported format: …" |
| Settings – option groups (mode, method, language) | Physical limitations, blind people | The choices behaved like separate buttons, not a radio group, and arrow keys didn't work | 2.1.1 Keyboard | Medium | Radio pattern: one tab stop, arrow keys move and select the choice, focus follows |

---

## Step 2: Processing

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/processing.png').default} alt="Processing step" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

| Screen – Element | Affected Profile | Problem | WCAG Criteria | Severity | Proposed Solution |
|---|---|---|---|---|---|
| Processing – end of process | Blind people | When the process finished, it didn't tell the user | 4.1.3 Status messages | High | Added an `aria-live` message: "Documents processed. N entities detected." |
| Processing – review buttons | Blind people | Locked buttons didn't say why they were unavailable | 4.1.2 Name, role, value | Low | Added an `aria-describedby`: "Available when processing finishes." |
| Processing – change of step | Blind people | When the screen changed, nothing was announced and the tab title stayed the same | 2.4.2 Page titled | Medium | Update the title to the current step and move focus to the new step's heading *(a general problem, noticed here)* |

---

## Step 3: Review

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/review.png').default} alt="Review step" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

| Screen – Element | Affected Profile | Problem | WCAG Criteria | Severity | Proposed Solution |
|---|---|---|---|---|---|
| Tools bar and original document collapsed | Physical limitations | Collapsed bar loses visible focus state when using Tab | 2.1.1 Keyboard | High | Draw the focus ring inside the button so the card doesn't clip it |
| Entities anonymized on document | Physical limitations | They aren't reachable using Tab | 2.1.1 Keyboard | High | Added a tab stop to enter the anonymized document; each anonymized entity is then reachable with arrow keys |
| Entities on anonymized document | Blind people | The state of each entity (detected, confirmed, rejected) was shown only by colour and underline, so a screen reader gave no state | 1.4.1 Use of colour | High | Give each entity a spoken label with its text, type and state (e.g. "[PERSON_01], Name, detected"). A live message announces the selected entity when its state changes |

---

## Step 4: Download

<div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/download.png').default} alt="Download step" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

| Screen – Element | Affected Profile | Problem | WCAG Criteria | Severity | Proposed Solution |
|---|---|---|---|---|---|
| Download buttons (Download all, Download selected, Save workspace) | Blind people | After pressing a download button, nothing on the page said it had happened | 4.1.3 Status messages | High | Added an `aria-live` message: "N files downloaded" / "Workspace saved" |
| "Download selected" button | Blind people | The file that would download was only shown in a tooltip, which screen readers don't get | 1.3.1 Info and relationships | Medium | Added an `aria-describedby` with the file name |

---

## Summary

| Severity | Issues |
|---|---|
| High | 7 |
| Medium | 3 |
| Low | 1 |
