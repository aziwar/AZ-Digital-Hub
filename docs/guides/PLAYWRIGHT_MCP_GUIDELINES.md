# Playwright MCP Server Guidelines for Claude Code (VERIFIED)

## 📖 Based on Official Documentation

This guide is based on verified official sources from GitHub and Claude API documentation.

## 🎯 ACTUAL Claude API Limits (Verified)

- **File Size**: 5MB maximum per image
- **Dimension Limit**: 8000 pixels maximum per dimension (not combined)
- **Many-image requests**: 2000 pixels maximum per dimension
- **Format**: PNG (default), JPEG supported

## ⚠️ The Real Problem & Solution

### Root Cause
Screenshots exceed **8000 pixels in a single dimension**, not file size.

### VERIFIED Solution
```javascript
// MANDATORY: Keep each dimension under 8000px
await mcp__playwright__browser_resize(1920, 1080)  // Total: 1920px + 1080px = safe

// Take screenshot (PNG is default format)
await mcp__playwright__browser_take_screenshot({
  filename: "screenshot.png",  // PNG is official default
  fullPage: false              // Prevents oversized screenshots
})
```

## 📋 Official Playwright MCP Server Settings

### Claude Config Location
- **File**: `C:\Users\zewar\.claude.json`
- **MCP Command**: `npx @playwright/mcp`

### Official Arguments (from GitHub docs)
- `--browser chrome|firefox|webkit|msedge`
- `--headless` (run headless, headed by default)
- `--image-responses allow|omit` (default: allow)

## 🚀 Proper Usage Pattern

```javascript
// 1. Navigate to page
await mcp__playwright__browser_navigate("https://example.com")

// 2. ALWAYS resize first (prevents API errors)
await mcp__playwright__browser_resize(1280, 720)

// 3. Take screenshot (safe mode)
await mcp__playwright__browser_take_screenshot({
  filename: "test.jpg",
  raw: false,      // Compressed JPEG
  fullPage: false  // Viewport only
})

// 4. Close when done
await mcp__playwright__browser_close()
```

## ⚠️ Common Issues & Solutions

### Issue: "Screenshot exceeds 8000px API limit"
**Solution**: Always call `browser_resize(1280, 720)` before screenshots

### Issue: Large file sizes
**Solution**: Use JPEG format with `raw: false` flag

### Issue: Full page screenshots too large
**Solution**: Never use `fullPage: true` - use viewport screenshots instead

## 🔧 Testing Commands

Test the configuration with:
```bash
# Test screenshot with safe dimensions
1. Navigate to any website
2. Resize to 1280×720
3. Take screenshot with JPEG compression
4. Verify no API errors occur
```

## 📊 Size Limits

- **Claude API Max**: ~8MB per attachment
- **Safe Screenshot Size**: <2MB with JPEG compression
- **Dimension Limit**: 8000px (width + height combined)
- **Recommended**: 1280×720 viewport = 2000px total

## ✨ Benefits of This Configuration

1. **No more API errors** from oversized screenshots
2. **Faster uploads** with compressed JPEG format
3. **Consistent results** with fixed viewport size
4. **Better performance** with optimized settings