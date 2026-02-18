# Chatterbox macOS UI Overview

## Main Interface

The application features a clean, native macOS interface with:

### Sidebar (Left)
- **Chatterbox** header
- **🎙️ Text-to-Speech** button (main view)
- **⚙️ Settings** button

### Text-to-Speech View (Main)

#### Text Input Section
- Large textarea for text input
- Paralinguistic tag buttons below:
  - [clear throat] [sigh] [shush] [cough] [groan]
  - [sniff] [gasp] [chuckle] [laugh]

#### Reference Audio
- "Choose Reference Audio..." button
- File name display

#### Model & Output Settings
Grid layout with:
- **Model**: Dropdown (Turbo, Multilingual, Standard)
- **Language**: Dropdown (shown for Multilingual)
- **Output Format**: MP3 / WAV / OGG
- **Output Filename**: Text input with auto-generated default

#### Advanced Parameters (Accordion)
Expandable section with:
- **Temperature**: 0.05 - 2.0 (slider)
- **Top P**: 0.0 - 1.0 (slider)
- **Top K**: 0 - 1000 (slider)
- **Repetition Penalty**: 1.0 - 2.0 (slider)
- **Min P**: 0.0 - 1.0 (slider)
- **Normalize Loudness**: Checkbox (checked by default)
- **Random Seed**: Number input

#### Generation
- **Generate Audio** button (primary, full width)
- Status message area
- Generated audio player (appears after generation)
- **Save Audio File** button

### Settings View

#### General Section
- **Models Download Path**: Read-only input + Browse button
- **Theme**: Auto (System) / Light / Dark dropdown
- **UI Language**: English / Deutsch dropdown

#### Python Environment Section
- **Use isolated virtual environment**: Checkbox (checked)
- **Virtual Environment Path**: Read-only display
- **Install/Update Dependencies**: Button
- Installation status message area

#### About Section
- Application name and version
- "Made with ♥️ by Resemble AI"

## Color Scheme

### Light Mode
- Background: White (#ffffff)
- Secondary BG: Light gray (#f5f5f7)
- Text: Dark (#1d1d1f)
- Accent: Indigo (#6366f1)
- Borders: Light gray (#d2d2d7)

### Dark Mode
- Background: Dark gray (#1d1d1f)
- Secondary BG: Medium gray (#2c2c2e)
- Text: Light (#f5f5f7)
- Accent: Indigo (#6366f1)
- Borders: Dark gray (#48484a)

## Typography
- System Font: -apple-system (San Francisco on macOS)
- Base Size: 14px
- Headers: 18-24px, weight 600
- Body: Regular weight

## Interactive Elements

### Buttons
- **Primary**: Indigo background, white text, rounded corners
- **Secondary**: Light gray background, bordered
- **Tag Buttons**: Light indigo background, smaller size

### Form Elements
- **Inputs**: Bordered, rounded, focus state with accent color
- **Sliders**: Custom styled with indigo thumb
- **Checkboxes**: Native with accent color

### States
- **Hover**: Subtle background change
- **Focus**: Accent color border
- **Active**: Slight scale transform
- **Disabled**: Reduced opacity

## Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast in both light and dark modes
- Clear focus indicators
- Descriptive help text

## Responsive Behavior
- Minimum window size: 800x600
- Default size: 1000x700
- Scrollable content areas
- Fixed sidebar width: 220px
- Fluid main content area

---

Note: Actual screenshots would show the rendered interface. This is a textual description of the UI design.
