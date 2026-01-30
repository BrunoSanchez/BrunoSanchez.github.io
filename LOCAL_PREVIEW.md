# Local Preview Instructions

This guide helps you preview the website on your local machine.

## 🚀 Quick Diagnostic

If you're having trouble, first open `test-assets.html` after starting Jekyll:

```bash
# Start Jekyll
jekyll serve

# Then visit:
http://localhost:4000/test-assets.html
```

This diagnostic page will tell you exactly what's wrong!

## Prerequisites

Make sure you have Jekyll installed:

```bash
# On macOS/Linux
gem install jekyll bundler

# On Windows, follow: https://jekyllrb.com/docs/installation/windows/
```

## Quick Start - Preview the Website

### Method 1: Standard Preview (Recommended)

```bash
# Navigate to the project directory
cd /path/to/BrunoSanchez.github.io

# Serve the site locally
jekyll serve

# Open your browser to: http://localhost:4000
```

### Method 2: With Development Config (Better for debugging)

```bash
# Use both config files for local development
jekyll serve --config _config.yml,_config_dev.yml

# Open your browser to: http://localhost:4000
```

### Method 3: Using Bundler (If you have a Gemfile)

```bash
bundle exec jekyll serve

# Open your browser to: http://localhost:4000
```

## Troubleshooting

### Assets (CSS/JS/Images) Not Loading

If you see plain HTML without styles:

1. **Check the terminal output** - Jekyll should show:
   ```
   Server address: http://127.0.0.1:4000/
   Server running... press ctrl-c to stop.
   ```

2. **Use the correct URL** - Open exactly `http://localhost:4000` (not file:// URLs)

3. **Clear your browser cache** - Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

4. **Check file permissions** - Ensure Jekyll can read all files:
   ```bash
   chmod -R 755 assets imgs _layouts
   ```

### Port Already in Use

If port 4000 is already in use:

```bash
jekyll serve --port 4001
# Then open http://localhost:4001
```

### CSS Changes Not Showing

Jekyll caches compiled CSS. To force regeneration:

```bash
# Remove the _site directory and rebuild
rm -rf _site
jekyll serve
```

## VS Code Live Preview

If using VS Code:

1. **Install "Live Server" extension** by Ritwick Dey
2. **Don't use it directly** - Jekyll sites need Jekyll's server, not just file serving
3. Instead, run `jekyll serve` in VS Code's terminal
4. The site will auto-reload when you make changes

## File Structure

```
BrunoSanchez.github.io/
├── _config.yml          # Main configuration
├── _config_dev.yml      # Local development overrides
├── _layouts/
│   └── default.html     # Custom layout
├── assets/
│   ├── css/
│   │   └── custom.css   # Custom styles
│   └── js/
│       └── animations.js # Custom JavaScript
├── imgs/
│   └── headshotBOS.jpg  # Profile image
└── README.md            # Main content
```

## Common Issues

### "Cannot load such file -- webrick"

On Ruby 3.0+, add webrick:

```bash
bundle add webrick
# or
gem install webrick
```

### "Liquid Exception: relative_url"

This means the URL configuration is incorrect. Make sure `_config.yml` has:
```yaml
url: "https://brunosanchez.github.io"
baseurl: ""
```

### Images Show as Broken Links

Check that:
- Images exist in the `imgs/` directory
- Jekyll is serving from the repository root
- You're accessing via `http://localhost:4000` (not opening HTML files directly)

## Need More Help?

- Jekyll Documentation: https://jekyllrb.com/docs/
- GitHub Pages Help: https://docs.github.com/en/pages
- Create an issue in this repository
