# UX Options for Recommendations Screen Redesign

## Overview
The redesigned screen should display:
1. **Personalized Recommendations** - Deals based on user's transaction history
2. **All Available Deals** - Browse/search all gift card deals
3. **Future Features** - Hide and favorite functionality

---

## Option 1: Segmented Control with Search (Recommended)

### Layout
```
┌─────────────────────────────────┐
│  [Menu]  All Current Deals  [ ] │ ← Header
├─────────────────────────────────┤
│  [For You] [All Deals]          │ ← Segmented Control
├─────────────────────────────────┤
│  🔍 Search merchants...          │ ← Search Bar
├─────────────────────────────────┤
│  💰 Total Potential Savings      │ ← Summary Card (scrolls)
│     $1,234.56                   │
├─────────────────────────────────┤
│  [Recommendation Cards]          │
│  [Recommendation Cards]          │
│  ...                             │
└─────────────────────────────────┘
```

### Features
- **Segmented Control** at top to switch between "For You" and "All Deals"
- **Search bar** below segmented control (always visible)
- **Summary card** scrolls with content (only shown in "For You" view)
- **Filter/Sort button** next to search (future: category, discount %, price)
- **Action buttons** on each card (future: favorite, hide)

### Pros
✅ Clear separation between personalized and all deals
✅ Easy to understand and navigate
✅ Search always accessible
✅ Good foundation for filters/sorting
✅ Familiar pattern (iOS native)

### Cons
⚠️ Requires switching tabs to see different content
⚠️ Two separate data loads

---

## Option 2: Unified List with Sections

### Layout
```
┌─────────────────────────────────┐
│  [Menu]  All Current Deals  [ ] │ ← Header
├─────────────────────────────────┤
│  🔍 Search merchants...          │ ← Search Bar
├─────────────────────────────────┤
│  ▼ Recommended for You           │ ← Collapsible Section
│  💰 Total Potential Savings       │
│     $1,234.56                   │
│  [Recommendation Cards]          │
│  [Recommendation Cards]          │
├─────────────────────────────────┤
│  ▼ All Deals (50)                │ ← Collapsible Section
│  [All Deal Cards]                │
│  [All Deal Cards]                │
│  ...                             │
└─────────────────────────────────┘
```

### Features
- **Single scrollable list** with two sections
- **Collapsible sections** (tap to expand/collapse)
- **Search bar** at top filters both sections
- **Section headers** show count of deals
- **Summary card** only in "Recommended" section
- **Action buttons** on cards (favorite, hide)

### Pros
✅ See both types of deals in one view
✅ Natural scrolling experience
✅ Search filters entire list
✅ Can collapse sections user doesn't need
✅ Good for users who want to browse everything

### Cons
⚠️ Can be long if many deals
⚠️ Less clear separation between personalized vs all
⚠️ Summary card might get lost when scrolling

---

## Option 3: Search-First with View Toggle

### Layout
```
┌─────────────────────────────────┐
│  [Menu]  All Current Deals  [ ] │ ← Header
├─────────────────────────────────┤
│  🔍 Search merchants...          │ ← Prominent Search
│  [Filter] [Sort]                 │ ← Action Buttons
├─────────────────────────────────┤
│  [Recommended] [All] [Favorites]│ ← View Toggle Pills
├─────────────────────────────────┤
│  💰 Total Potential Savings      │ ← Summary (if Recommended)
│     $1,234.56                   │
├─────────────────────────────────┤
│  [Deal Cards]                    │
│  [Deal Cards]                    │
│  ...                             │
└─────────────────────────────────┘
```

### Features
- **Prominent search bar** at top (main interaction)
- **View toggle pills** below search (Recommended/All/Favorites)
- **Filter and Sort buttons** next to search
- **Summary card** only in Recommended view
- **Search results** update in real-time as user types
- **Empty states** show helpful messages

### Pros
✅ Search is primary action (good for power users)
✅ Quick switching between views
✅ Favorites view ready for future feature
✅ Modern, clean interface
✅ Good for users who know what they want

### Cons
⚠️ Might be overwhelming for casual browsers
⚠️ Requires typing to find deals
⚠️ Less discovery of new deals

---

## Option 4: Hybrid with Floating Actions

### Layout
```
┌─────────────────────────────────┐
│  [Menu]  All Current Deals  [ ] │ ← Header
├─────────────────────────────────┤
│  [For You] [All Deals]          │ ← Segmented Control
├─────────────────────────────────┤
│  💰 Total Potential Savings      │ ← Summary Card
│     $1,234.56                   │
├─────────────────────────────────┤
│  [Recommendation Cards]          │
│  [Recommendation Cards]          │
│  ...                             │
│                                  │
│                    [🔍] [⚙️]    │ ← Floating Buttons
└─────────────────────────────────┘
```

### Features
- **Segmented control** for view switching
- **Floating search button** (bottom right) - opens search modal
- **Floating filter button** (bottom right) - opens filter sheet
- **Summary card** scrolls with content
- **Cards have action buttons** (favorite, hide) on long-press or swipe
- **Search modal** overlays the screen with results

### Pros
✅ Clean, uncluttered main view
✅ Search doesn't take up space when not needed
✅ Good for mobile-first design
✅ Floating actions are discoverable
✅ More screen space for deals

### Cons
⚠️ Search requires extra tap
⚠️ Less discoverable for new users
⚠️ Floating buttons might interfere with scrolling

---

## Recommendation Matrix

| Feature | Option 1 | Option 2 | Option 3 | Option 4 |
|---------|----------|----------|---------|----------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Discoverability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Search Experience** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Mobile-Friendly** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Future-Proof** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Implementation** | Easy | Medium | Medium | Medium |

---

## Recommended: Option 1 (Segmented Control)

**Why Option 1?**
- Most intuitive for users
- Clear separation of concerns
- Easy to implement and maintain
- Good foundation for future features (favorites, filters)
- Familiar iOS pattern
- Search always accessible but not intrusive

### Implementation Details for Option 1:

1. **Segmented Control**
   - Two segments: "For You" | "All Deals"
   - Active segment highlighted in terracotta
   - Smooth transition between views

2. **Search Bar**
   - Below segmented control
   - Placeholder: "Search merchants..."
   - Real-time filtering as user types
   - Clear button (X) when text entered
   - Shows result count: "12 results"

3. **Summary Card** (For You view only)
   - Shows total potential annual savings
   - Scrolls with content (ListHeaderComponent)
   - Green background (COLORS.success)

4. **Deal Cards**
   - Same RecommendationCard component
   - Future: Add favorite icon (heart) in top-right corner
   - Future: Add hide option in menu (three dots)

5. **Empty States**
   - "For You": "Connect your bank to see personalized deals"
   - "All Deals": "No deals found. Try a different search."
   - Search: "No results for '[search term]'"

6. **Future Enhancements**
   - Filter button next to search (category, discount %, source)
   - Sort options (discount %, price, merchant name)
   - Favorite toggle on cards
   - Hide/Unhide functionality
   - "Favorites" tab in segmented control

---

## Next Steps

1. Choose preferred option
2. Create wireframes/mockups
3. Implement search functionality
4. Add segmented control
5. Update data loading logic
6. Add empty states
7. Prepare for favorite/hide features (database schema)

