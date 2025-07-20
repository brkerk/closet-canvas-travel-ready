# App Icons Required for iOS App Store

## Required Icon Sizes

You need to create the following app icon sizes for iOS:

### App Icon (App Store and Device)
- **1024x1024** - App Store (PNG, no transparency)
- **180x180** - iPhone (60pt @3x)
- **120x120** - iPhone (60pt @2x)  
- **167x167** - iPad Pro (83.5pt @2x)
- **152x152** - iPad (76pt @2x)
- **76x76** - iPad (76pt @1x)

### Additional Required Sizes
- **60x60** - iPhone (20pt @3x)
- **40x40** - iPhone/iPad (20pt @2x)
- **58x58** - iPhone (29pt @2x)
- **87x87** - iPhone (29pt @3x)
- **80x80** - iPhone/iPad (40pt @2x)
- **120x120** - iPhone/iPad (40pt @3x)
- **29x29** - iPad (29pt @1x)
- **20x20** - iPad (20pt @1x)

## Icon Design Guidelines

### Visual Requirements
- **No transparency** - All icons must have opaque backgrounds
- **No rounded corners** - iOS automatically applies corner radius
- **Square format** - All icons must be perfect squares
- **High resolution** - Use vector graphics when possible
- **Consistent style** - Maintain visual consistency across all sizes

### Design Recommendations
- Use a clean, memorable design that works at all sizes
- Ensure the icon is recognizable even at 29x29 pixels
- Use colors that stand out on various backgrounds
- Avoid fine details that won't be visible at small sizes
- Consider the icon's appearance on both light and dark backgrounds

### File Format
- **PNG format only**
- **RGB color space**
- **No alpha channel/transparency**

## Current Icon Configuration

The app currently uses the basic Capacitor icon configuration. You'll need to:

1. Create a master 1024x1024 icon design
2. Generate all required sizes from the master
3. Replace the default icons in the iOS project
4. Update the Capacitor configuration

## Tools for Icon Generation

### Recommended Tools:
- **App Icon Generator**: https://appicon.co/
- **Icon Set Creator**: https://icon.kitchen/
- **Xcode**: Built-in icon generation tools

### Manual Creation:
- Adobe Illustrator/Photoshop
- Sketch
- Figma
- Canva

## Installation Steps (After Icon Creation)

1. Generate all required sizes
2. Place icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
3. Update `Contents.json` with proper file references
4. Run `npx cap sync ios`
5. Test in Xcode simulator and device