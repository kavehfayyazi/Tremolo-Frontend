# Frontend Development Specification Template

Fill out this template with as much detail as possible. The more information you provide, the better the frontend will be tailored to your needs.

---

## 1. PROJECT OVERVIEW

### Project Name
[Your project name]

### One-Line Description
[Describe your project in one sentence]

### Core Value Proposition
[What problem does this solve? What makes it unique?]

---

## 2. HOW IT WORKS (Functionality & Features)

### Primary Features
[List the main features your app provides]
- Feature 1: [Description]
- Feature 2: [Description]
- Feature 3: [Description]

### Core User Actions
[What are the primary things users will DO in your app?]
- Action 1: [What users do and why]
- Action 2: [What users do and why]
- Action 3: [What users do and why]

### Data Flow
[How does data move through your system?]
- User input → [What happens?] → [What's displayed?]
- [External data source] → [How it's processed] → [How it's shown]

### Key Workflows
[Describe the main user journeys]
1. **Workflow Name**: [Step-by-step description of what happens]
2. **Workflow Name**: [Step-by-step description of what happens]

---

## 3. PURPOSE & TARGET AUDIENCE

### Primary Purpose
[What is the main goal of this application?]

### Target Audience
- **Primary Users**: [Who are they? Demographics, technical skill level, use case]
- **Secondary Users**: [If applicable]
- **User Context**: [When/where/how will they use this? Mobile? Desktop? On-the-go?]

### User Goals
[What do users want to achieve by using your app?]
- Goal 1: [Description]
- Goal 2: [Description]

---

## 4. USER INTERACTIONS & FRONTEND FLOWS

### Main Screens/Pages
[List all the main screens users will see]
1. **Screen Name**: [Purpose and key elements]
2. **Screen Name**: [Purpose and key elements]
3. **Screen Name**: [Purpose and key elements]

### Navigation Structure
[How do users move between screens?]
- [Screen] → [Screen] (via [action/button/link])
- [Screen] → [Screen] (via [action/button/link])

### User Interaction Patterns
[How do users interact with the interface?]
- **Input Methods**: [Forms, buttons, drag-and-drop, voice, etc.]
- **Feedback Mechanisms**: [How do users know their actions worked?]
- **Error Handling**: [How should errors be displayed?]

### Key UI Interactions
[Specific interactions that are important]
- [Interaction]: [What happens when user does X?]
- [Interaction]: [What happens when user does Y?]

---

## 5. BACKEND INTEGRATION

### API Endpoints
[List the backend endpoints you'll be using]
- `GET /endpoint`: [Purpose, expected response format]
- `POST /endpoint`: [Purpose, request body format, response format]
- [Continue for all endpoints]

### Authentication
[How do users authenticate?]
- Method: [OAuth, JWT, session-based, etc.]
- Login flow: [Describe the process]
- Protected routes: [Which screens require auth?]

### Data Models
[What data structures will you be working with?]
```json
{
  "modelName": {
    "field1": "type/description",
    "field2": "type/description"
  }
}
```

### Real-time Features
[Any WebSocket, SSE, or polling requirements?]
- [Feature]: [How it works, update frequency]

---

## 6. TECHNICAL REQUIREMENTS

### Preferred Tech Stack
[If you have preferences, list them. Otherwise, I'll suggest optimal choices]
- Framework: [React, Vue, Next.js, etc. or "your recommendation"]
- Styling: [CSS, Tailwind, styled-components, etc. or "your recommendation"]
- State Management: [Redux, Zustand, Context API, etc. or "your recommendation"]
- Other: [Any other specific libraries or tools]

### Browser Support
[Which browsers/devices must be supported?]
- Desktop: [Chrome, Safari, Firefox, etc.]
- Mobile: [iOS Safari, Chrome Mobile, etc.]
- Minimum screen size: [e.g., 320px width]

### Performance Requirements
[Any specific performance needs?]
- [e.g., "Must load in under 2 seconds", "Handle 1000+ items in lists"]

---

## 7. DESIGN & UX PREFERENCES

### Visual Style
[Describe the look and feel you want]
- **Aesthetic**: [Modern, minimalist, playful, professional, etc.]
- **Color Scheme**: [Preferred colors, brand colors, or "your recommendation"]
- **Typography**: [Any font preferences or "your recommendation"]

### Design Inspiration
[Links to websites/apps you like, or describe styles you want to emulate]

### Key Design Principles
[What's most important in the design?]
- [e.g., "Clarity over features", "Speed of interaction", "Visual appeal"]

### Accessibility Requirements
[Any specific accessibility needs?]
- [WCAG level, screen reader support, keyboard navigation, etc.]

---

## 8. CONTENT & COPY

### Key Messages
[Important text that needs to appear]
- Landing page headline: [If applicable]
- Call-to-action text: [What should buttons say?]
- Error messages: [Tone and style preferences]

### Content Types
[What kind of content will be displayed?]
- [Text, images, videos, charts, maps, etc.]

---

## 9. PRIORITIES & CONSTRAINTS

### Must-Have Features
[Features that are absolutely essential for MVP]
1. [Feature]
2. [Feature]

### Nice-to-Have Features
[Features that can be added later]
1. [Feature]
2. [Feature]

### Constraints
[Any limitations I should know about?]
- Time constraints: [Hackathon deadline, etc.]
- Technical constraints: [Backend limitations, etc.]
- Resource constraints: [Team size, etc.]

---

## 10. SUCCESS METRICS

### How Will You Know It's Good?
[What makes a successful frontend for your project?]
- [e.g., "Users can complete [action] in under 30 seconds"]
- [e.g., "Interface is intuitive enough that no tutorial is needed"]

---

## ADDITIONAL NOTES

[Any other information, edge cases, special considerations, or context that would be helpful]

