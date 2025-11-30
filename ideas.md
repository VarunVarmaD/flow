# Project Ideas & Roadmap

This document outlines potential improvements for Flow. Contributions are welcome.

## Quick Wins

*   **Use a `<form>` element**: Wrap the input and button in a form to handle "Enter" key submission automatically and improve accessibility.
*   **Better ID Generation**: Replace the current incrementing ID logic with `Date.now()` or `crypto.randomUUID()` for unique IDs.
*   **Accessible Delete Buttons**: Add `aria-label` attributes to delete buttons for better screen reader support.

## New Features

*   **Edit Tasks**: Allow users to double-click a task to edit the text.
*   **Clear Completed Button**: Add a button to remove all completed tasks at once.
*   **Filter Tabs**: Implement tabs to filter tasks by "All", "Active", and "Completed".

## UI/UX Improvements

*   **Empty State**: Replace the "No tasks added" text with a visual illustration or icon.
*   **Undo Notification**: Implement a toast notification with an undo option when a task is deleted.

## Project Structure

*   **Separate Storage Logic**: Refactor `localStorage` logic from `app.js` into a separate module or function.

