#!/usr/bin/env python3
# build.py - SuperPig UI Builder with Progress Indicators

import subprocess
import sys
import os
import time
from pathlib import Path
import threading

# Configuration
ENTRY_POINTS = {
    'login': {
        'path': "src/static/js/app.js",
        'output': "static/js/bundle.min.js",
        'name': 'Login Bundle'
    },
    'core': {
        'path': "src/static/js/app_core.js",
        'output': "static/js/bundle.core.min.js",
        'name': 'Core Navigation Bundle'
    }
}

class BuildProgress:
    def __init__(self, bundle_name=""):
        self.bundle_name = bundle_name
        self.start_time = None
        self.running = False
        self.spinner_chars = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        self.spinner_idx = 0
        self.last_line_length = 0
        
    def start(self):
        self.start_time = time.time()
        self.running = True
        self.thread = threading.Thread(target=self._animate)
        self.thread.daemon = True
        self.thread.start()
    
    def _animate(self):
        while self.running:
            elapsed = time.time() - self.start_time
            spinner = self.spinner_chars[self.spinner_idx % len(self.spinner_chars)]
            
            # Show different messages based on build stage
            prefix = f"[{self.bundle_name}] " if self.bundle_name else ""
            
            if elapsed < 2:
                msg = f"{prefix}{spinner} Scanning files... ({elapsed:.1f}s)"
            elif elapsed < 5:
                msg = f"{prefix}{spinner} Resolving dependencies... ({elapsed:.1f}s)"
            elif elapsed < 10:
                msg = f"{prefix}{spinner} Bundling modules... ({elapsed:.1f}s)"
            else:
                msg = f"{prefix}{spinner} Still building... ({elapsed:.1f}s)"
            
            # Clear previous line and print new one
            print(f"\r{msg}", end="", flush=True)
            
            self.spinner_idx += 1
            time.sleep(0.1)
    
    def stop(self, success=True, output_file=None):
        self.running = False
        time.sleep(0.1)  # Give time for final spinner update
        
        elapsed = time.time() - self.start_time
        prefix = f"[{self.bundle_name}] " if self.bundle_name else ""
        
        if success and output_file and os.path.exists(output_file):
            size = os.path.getsize(output_file)
            size_str = self._format_size(size)
            status = f"{prefix}✅ Build complete! ({elapsed:.1f}s, {size_str})"
        elif success:
            status = f"{prefix}✅ Build complete! ({elapsed:.1f}s)"
        else:
            status = f"{prefix}❌ Build failed! ({elapsed:.1f}s)"
        
        # Clear line and print final status
        print(f"\r{' ' * self.last_line_length}\r{status}")
    
    def _format_size(self, size):
        for unit in ['B', 'KB', 'MB']:
            if size < 1024.0:
                return f"{size:.1f}{unit}"
            size /= 1024.0
        return f"{size:.1f}GB"

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        result = subprocess.run(["npx", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npx version: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Error: npx is not installed. Please install Node.js and npm.")
    print("   Visit: https://nodejs.org/")
    return False

def count_files():
    """Count JavaScript files to be bundled"""
    js_files = list(Path("src/static/js").rglob("*.js"))
    return len(js_files)

def build_entry_point(entry_config):
    """Build a single entry point"""
    entry_point = entry_config['path']
    output_file = entry_config['output']
    bundle_name = entry_config['name']
    
    print(f"\n📝 Building: {bundle_name}")
    print(f"   Entry: {entry_point}")
    print(f"   Output: {output_file}")
    print("-" * 50)
    
    # Check if entry point exists
    if not os.path.exists(entry_point):
        print(f"❌ Error: Entry point not found: {entry_point}")
        return False
    
    # Start progress indicator
    progress = BuildProgress(bundle_name)
    progress.start()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Build command
    cmd = [
        "npx", "esbuild", entry_point,
        "--bundle",
        "--minify",
        f"--outfile={output_file}"
    ]
    
    # Add source map in development
    if os.getenv("SUPERPIG_ENV") == "development":
        cmd.append("--sourcemap")
        print("   📍 Source maps enabled")
    
    # Add metafile to analyze build
    if os.getenv("ANALYZE"):
        meta_file = f"meta.{bundle_name.lower().replace(' ', '_')}.json"
        cmd.append(f"--metafile={meta_file}")
        print(f"   📊 Meta file: {meta_file}")
    
    try:
        # Run the build
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for process to complete
        stdout, stderr = process.communicate()
        
        # Stop progress indicator
        success = process.returncode == 0
        progress.stop(success, output_file)
        
        if success:
            # Show bundle size if file exists
            if os.path.exists(output_file):
                size = os.path.getsize(output_file)
                print(f"      📦 Final size: {progress._format_size(size)}")
            
            # Show warnings if any
            if stderr:
                warnings = [line for line in stderr.split('\n') 
                          if line.strip() and "warning" in line.lower()]
                if warnings:
                    print(f"\n   ⚠️  Warnings:")
                    for warning in warnings[:3]:  # Show first 3 warnings
                        print(f"      {warning.strip()}")
                    if len(warnings) > 3:
                        print(f"      ... and {len(warnings) - 3} more warnings")
            
            return True
        else:
            print(f"\n   ❌ Build failed with errors:")
            # Show last few lines of error
            error_lines = stderr.strip().split('\n')
            for line in error_lines[-5:]:  # Show last 5 lines
                if line.strip():
                    print(f"      {line.strip()}")
            return False
            
    except Exception as e:
        progress.stop(False)
        print(f"\n   ❌ Error: {e}")
        return False

def run_all_builds():
    """Run all configured builds"""
    print("📊 Found JavaScript files to process")
    
    # Show what will be built
    print("\n📋 Build Plan:")
    for key, config in ENTRY_POINTS.items():
        print(f"   • {config['name']}: {config['path']} → {config['output']}")
    
    print("\n" + "=" * 60)
    
    # Track overall success
    all_successful = True
    build_times = {}
    
    # Build each entry point
    for key, config in ENTRY_POINTS.items():
        start_time = time.time()
        success = build_entry_point(config)
        build_time = time.time() - start_time
        
        build_times[config['name']] = {
            'success': success,
            'time': build_time
        }
        
        if not success:
            all_successful = False
        
        # Small pause between builds
        if key != list(ENTRY_POINTS.keys())[-1]:
            print("\n" + "─" * 40)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Build Summary:")
    for name, stats in build_times.items():
        status = "✅" if stats['success'] else "❌"
        print(f"   {status} {name}: {stats['time']:.1f}s")
    
    return all_successful

def watch_mode():
    """Run in watch mode - simplified version"""
    print("\n👀 Watch mode enabled")
    print("   Note: Watch mode builds both bundles once")
    print("   For continuous watching, use: npx esbuild directly")
    print("-" * 50)
    
    # Just do one build
    success = run_all_builds()
    
    if success:
        print("\n✅ Initial build complete. For continuous watching, consider:")
        print("   npx esbuild src/static/js/app.js --bundle --watch --outfile=static/js/bundle.min.js")
        print("   npx esbuild src/static/js/app_core.js --bundle --watch --outfile=static/js/bundle.core.min.js")

def quick_scan():
    """Quick scan to estimate build time"""
    print("🔍 Quick scan...")
    
    # Find largest files (might be bottlenecks)
    js_files = []
    for path in Path("src/static/js").rglob("*.js"):
        size = path.stat().st_size
        js_files.append((size, path))
    
    js_files.sort(reverse=True)
    
    if js_files:
        print(f"\n📊 Top 5 largest files:")
        for size, path in js_files[:5]:
            rel_path = path.relative_to("src/static/js")
            size_kb = size / 1024
            print(f"   {size_kb:6.1f}KB  {rel_path}")
    
    # Estimate build time (rough approximation)
    total_size = sum(size for size, _ in js_files) / (1024 * 1024)  # MB
    estimated_time = total_size * 0.5  # Rough estimate: 0.5s per MB
    
    print(f"\n📈 Total JS: {total_size:.1f}MB")
    print(f"⏱️  Estimated build time: {estimated_time:.1f}s")
    
    if total_size > 5:
        print("\n💡 Tip: Your bundle is large. Consider:")
        print("   - Code splitting")
        print("   - Lazy loading")
        print("   - Removing unused imports")

def main():
    print("🐷 SuperPig UI Builder")
    print("=" * 50)
    
    # Parse arguments
    if len(sys.argv) > 1:
        if sys.argv[1] in ["--watch", "-w"]:
            watch_mode()
            return
        elif sys.argv[1] in ["--scan", "-s"]:
            quick_scan()
            return
        elif sys.argv[1] in ["--build-login"]:
            # Build just login
            success = build_entry_point(ENTRY_POINTS['login'])
            sys.exit(0 if success else 1)
        elif sys.argv[1] in ["--build-core"]:
            # Build just core
            success = build_entry_point(ENTRY_POINTS['core'])
            sys.exit(0 if success else 1)
        elif sys.argv[1] in ["--help", "-h"]:
            print("Usage: python build.py [options]")
            print("Options:")
            print("  --watch, -w        Watch for changes (simple mode)")
            print("  --scan, -s         Scan and analyze files")
            print("  --build-login      Build only login bundle")
            print("  --build-core       Build only core bundle")
            print("  --help, -h         Show this help")
            print("\nEnvironment:")
            print("  SUPERPIG_ENV=development    Enable source maps")
            print("  ANALYZE=1                   Generate build analysis")
            return
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Quick scan first
    quick_scan()
    print("-" * 50)
    
    # Run all builds
    start_time = time.time()
    success = run_all_builds()
    total_time = time.time() - start_time
    
    if success:
        print(f"\n✨ All builds completed in {total_time:.1f}s")
        print("\n💡 Tips:")
        print("   • Use --watch for development")
        print("   • Use --scan to analyze file sizes")
        print("   • Use --build-login or --build-core for single builds")
        print("   • Set SUPERPIG_ENV=development for source maps")
        sys.exit(0)
    else:
        print("\n❌ Some builds failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
