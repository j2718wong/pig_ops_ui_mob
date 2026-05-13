#!/usr/bin/env python3
# build.py - SuperPig UI Builder with Versioning, Minification, and Cleanup
# Features: JS bundling, CSS minification, versioning, and automatic cleanup

import subprocess
import sys
import os
import time
import json
import hashlib
import shutil
from pathlib import Path
import threading

# Configuration
ENABLE_VERSIONING = os.getenv("ENABLE_VERSIONING", "false").lower() == "true"
# Or force versioning with --version flag

ENTRY_POINTS = {
    'login': {
        'path': "src/static/js/app.js",
        'output_base': "static/js/bundle.min.js",
        'output_name': "bundle",
        'bundle_key': 'login',
        'name': 'Login Bundle',
        'type': 'js'
    },
    
    'core': {
        'path': "src/static/js/app_core.js",
        'output_base': "static/js/bundle.core.min.js",
        'output_name': "bundle.core",
        'bundle_key': 'core',
        'name': 'Core Navigation Bundle',
        'type': 'js'
    },
    
    'receipt_data_entry': {
        'path': "src/static/js/admin_receipt_data_entry.js",
        'output_base': "static/js/bundle.receipt_data_entry.min.js",
        'output_name': "bundle.receipt_data_entry",
        'bundle_key': 'receipt_data_entry',
        'name': 'Receipt Data Entry',
        'type': 'js'
    },
    
    
    
    # Add CSS entry point
    'main_css': {
        'path': "src/static/css/main.css",
        'output_base': "static/css/main.min.css",
        'output_name': "main",
        'bundle_key': 'main_css',
        'name': 'Main Stylesheet',
        'type': 'css'
    }
}


class BuildProgress:
    """Progress indicator with spinner for builds"""
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
        # Check for npx (for JS builds)
        result = subprocess.run(["npx", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npx version: {result.stdout.strip()}")
        else:
            print("❌ npx not found")
            return False
    except FileNotFoundError:
        print("❌ npx not installed")
        return False
    
    # Check for csscompressor (for CSS builds)
    try:
        import csscompressor
        print(f"✅ csscompressor installed")
    except ImportError:
        print("❌ csscompressor not installed. Run: pip install csscompressor")
        return False
    
    return True


def calculate_file_hash(filepath):
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()[:8]  # First 8 chars


def minify_css(css_content):
    """Minify CSS using csscompressor"""
    try:
        import csscompressor
        return csscompressor.compress(css_content)
    except ImportError:
        print("⚠️  csscompressor not found, skipping CSS minification")
        return css_content


def build_css_entry(entry_config, enable_versioning=False):
    """Build CSS entry point with minification and versioning"""
    entry_point = entry_config['path']
    output_base = entry_config['output_base']
    output_name = entry_config['output_name']
    bundle_key  = entry_config['bundle_key']
    bundle_name = entry_config['name']
    
    print(f"\n📝 Building: {bundle_name}")
    print(f"   Entry: {entry_point}")
    print(f"   Base Output: {output_base}")
    if enable_versioning:
        print(f"   Versioning: Enabled")
    print("-" * 50)
    
    # Check if entry point exists
    if not os.path.exists(entry_point):
        print(f"❌ Error: Entry point not found: {entry_point}")
        return None
    
    # Start progress indicator
    progress = BuildProgress(bundle_name)
    progress.start()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_base), exist_ok=True)
    
    # Read original CSS
    with open(entry_point, 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Minify CSS
    minified_css = minify_css(css_content)
    
    # Write to temp file first
    temp_file = f"static/css/{output_name}.temp.css"
    os.makedirs(os.path.dirname(temp_file), exist_ok=True)
    
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(minified_css)
    
    # Determine final output filename
    if enable_versioning:
        # Calculate hash and create versioned filename
        file_hash = calculate_file_hash(temp_file)
        versioned_file = f"static/css/{output_name}.{file_hash}.min.css"
        shutil.move(temp_file, versioned_file)
        final_file = versioned_file
        bundle_filename = f"{output_name}.{file_hash}.min.css"
        print(f"   🔖 Hash: {file_hash}")
    else:
        # Use base filename
        if os.path.exists(output_base):
            os.remove(output_base)
        shutil.move(temp_file, output_base)
        final_file = output_base
        bundle_filename = os.path.basename(output_base)
    
    # Stop progress indicator
    progress.stop(True, final_file)
    
    # Show bundle size
    if os.path.exists(final_file):
        original_size = os.path.getsize(entry_point)
        new_size = os.path.getsize(final_file)
        saved = original_size - new_size
        percent = (saved / original_size) * 100 if original_size > 0 else 0
        print(f"      📦 Original: {progress._format_size(original_size)}")
        print(f"      📦 Minified: {progress._format_size(new_size)}")
        print(f"      💾 Saved: {progress._format_size(saved)} ({percent:.1f}%)")
    
    # Return bundle info for manifest
    return {
        'key': bundle_key,
        'filename': bundle_filename,
        'path': final_file,
        'size': os.path.getsize(final_file),
        'hash': file_hash if enable_versioning else None
    }


def build_js_entry(entry_config, enable_versioning=False):
    """Build JS entry point with esbuild and versioning"""
    entry_point = entry_config['path']
    output_base = entry_config['output_base']
    output_name = entry_config['output_name']
    bundle_key  = entry_config['bundle_key']
    bundle_name = entry_config['name']
    
    print(f"\n📝 Building: {bundle_name}")
    print(f"   Entry: {entry_point}")
    print(f"   Base Output: {output_base}")
    if enable_versioning:
        print(f"   Versioning: Enabled")
    print("-" * 50)
    
    # Check if entry point exists
    if not os.path.exists(entry_point):
        print(f"❌ Error: Entry point not found: {entry_point}")
        return None
    
    # Start progress indicator
    progress = BuildProgress(bundle_name)
    progress.start()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_base), exist_ok=True)
    
    # Build to a temporary file first
    temp_file = f"static/js/{output_name}.temp.js"
    
    # Build command
    cmd = [
        "npx", "esbuild", entry_point,
        "--bundle",
        "--minify",
        f"--outfile={temp_file}"
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
        
        if process.returncode != 0:
            progress.stop(False)
            print(f"\n   ❌ Build failed with errors:")
            error_lines = stderr.strip().split('\n')
            for line in error_lines[-5:]:
                if line.strip():
                    print(f"      {line.strip()}")
            return None
        
        # Check if temp file was created
        if not os.path.exists(temp_file):
            progress.stop(False)
            print(f"\n   ❌ Build failed: Output file not created")
            return None
        
        # Determine final output filename
        if enable_versioning:
            # Calculate hash and create versioned filename
            file_hash = calculate_file_hash(temp_file)
            versioned_file = f"static/js/{output_name}.{file_hash}.min.js"
            shutil.move(temp_file, versioned_file)
            final_file = versioned_file
            bundle_filename = f"{output_name}.{file_hash}.min.js"
            print(f"   🔖 Hash: {file_hash}")
        else:
            # Use base filename
            if os.path.exists(output_base):
                os.remove(output_base)
            shutil.move(temp_file, output_base)
            final_file = output_base
            bundle_filename = os.path.basename(output_base)
        
        # Stop progress indicator
        progress.stop(True, final_file)
        
        # Show bundle size
        if os.path.exists(final_file):
            size = os.path.getsize(final_file)
            print(f"      📦 Final size: {progress._format_size(size)}")
        
        # Show warnings if any
        if stderr:
            warnings = [line for line in stderr.split('\n') 
                      if line.strip() and "warning" in line.lower()]
            if warnings:
                print(f"\n   ⚠️  Warnings:")
                for warning in warnings[:3]:
                    print(f"      {warning.strip()}")
                if len(warnings) > 3:
                    print(f"      ... and {len(warnings) - 3} more warnings")
        
        # Return bundle info for manifest
        return {
            'key': bundle_key,
            'filename': bundle_filename,
            'path': final_file,
            'size': os.path.getsize(final_file),
            'hash': file_hash if enable_versioning else None
        }
            
    except Exception as e:
        progress.stop(False)
        print(f"\n   ❌ Error: {e}")
        return None


def build_entry_point(entry_config, enable_versioning=False):
    """Route to appropriate builder based on type"""
    if entry_config.get('type') == 'css':
        return build_css_entry(entry_config, enable_versioning)
    else:
        return build_js_entry(entry_config, enable_versioning)


def save_manifest(bundle_infos, enable_versioning=False):
    """Save manifest JSON file"""
    manifest = {}
    
    for info in bundle_infos:
        if info:
            manifest[info['key']] = info['filename']
    
    # Also add a version file with timestamp
    manifest['version'] = {
        'build_time': time.strftime('%Y-%m-%d %H:%M:%S'),
        'versioning_enabled': enable_versioning
    }
    
    # Save main manifest
    manifest_path = 'static/js/manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    # Also save to CSS directory for convenience
    css_manifest_path = 'static/css/manifest.json'
    os.makedirs(os.path.dirname(css_manifest_path), exist_ok=True)
    with open(css_manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    # Also save a simple text file with just the version
    if enable_versioning:
        version_txt_path = 'static/js/version.txt'
        with open(version_txt_path, 'w') as f:
            f.write(str(int(time.time())))
    
    print(f"\n📝 Manifest saved: {manifest_path} and {css_manifest_path}")
    if enable_versioning:
        print(f"   Version info included")


def clean_old_versions(keep_last=2):
    """
    Clean up old versioned files, keeping only the most recent 'keep_last' versions
    Automatically discovers bundles from filename patterns.
    """
    print(f"\n🧹 Cleaning old versioned files (keeping last {keep_last})...")
    
    # Process JS directory
    js_dir = Path("static/js")
    if js_dir.exists():
        # Find all versioned JS files (pattern: name.hash.min.js)
        versioned_js_files = {}
        
        for f in js_dir.glob("*.min.js"):
            parts = f.name.split('.')
            # Versioned files have 4 parts: bundle.hash.min.js
            if len(parts) >= 4 and len(parts[1]) == 8:  # hash is 8 chars
                bundle_name = parts[0]  # bundle, bundle.core, etc.
                if bundle_name not in versioned_js_files:
                    versioned_js_files[bundle_name] = []
                versioned_js_files[bundle_name].append(f)
        
        # Clean up each bundle group
        for bundle_name, files in versioned_js_files.items():
            files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
            
            if len(files) > keep_last:
                for old_file in files[keep_last:]:
                    print(f"   🗑️  Removing old {bundle_name} bundle: {old_file.name}")
                    old_file.unlink()
            
            print(f"\n   📌 Keeping {bundle_name} bundles ({len(files[:keep_last])} files):")
            for f in files[:keep_last]:
                size_kb = f.stat().st_size / 1024
                mtime = time.strftime('%Y-%m-%d', time.localtime(f.stat().st_mtime))
                print(f"      • {f.name} ({size_kb:.1f}KB) - {mtime}")
            
            # Remove non-versioned version if exists
            non_versioned = js_dir / f"{bundle_name}.min.js"
            if non_versioned.exists():
                print(f"\n   🗑️  Removing non-versioned: {non_versioned.name}")
                non_versioned.unlink()
    
    # Process CSS directory similarly
    css_dir = Path("static/css")
    if css_dir.exists():
        css_versioned = {}
        for f in css_dir.glob("*.min.css"):
            parts = f.name.split('.')
            if len(parts) >= 3 and len(parts[1]) == 8:
                bundle_name = parts[0]
                if bundle_name not in css_versioned:
                    css_versioned[bundle_name] = []
                css_versioned[bundle_name].append(f)
        
        for bundle_name, files in css_versioned.items():
            files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
            
            if len(files) > keep_last:
                for old_file in files[keep_last:]:
                    print(f"   🗑️  Removing old CSS {bundle_name} bundle: {old_file.name}")
                    old_file.unlink()
            
            print(f"\n   📌 Keeping CSS {bundle_name} bundles ({len(files[:keep_last])} files):")
            for f in files[:keep_last]:
                size_kb = f.stat().st_size / 1024
                mtime = time.strftime('%Y-%m-%d', time.localtime(f.stat().st_mtime))
                print(f"      • {f.name} ({size_kb:.1f}KB) - {mtime}")
    
    print("\n   ✅ Cleanup complete")


def quick_scan():
    """Quick scan to estimate build time"""
    print("🔍 Quick scan...")
    
    js_files = []
    for path in Path("src/static/js").rglob("*.js"):
        size = path.stat().st_size
        js_files.append((size, path))
    
    js_files.sort(reverse=True)
    
    if js_files:
        print(f"\n📊 Top 5 largest JS files:")
        for size, path in js_files[:5]:
            rel_path = path.relative_to("src/static/js")
            size_kb = size / 1024
            print(f"   {size_kb:6.1f}KB  {rel_path}")
    
    # Also scan CSS
    css_files = []
    for path in Path("src/static/css").rglob("*.css"):
        size = path.stat().st_size
        css_files.append((size, path))
    
    if css_files:
        print(f"\n📊 CSS files:")
        for size, path in css_files:
            rel_path = path.relative_to("src/static/css")
            size_kb = size / 1024
            print(f"   {size_kb:6.1f}KB  {rel_path}")
    
    total_size = sum(size for size, _ in js_files) / (1024 * 1024)
    total_size += sum(size for size, _ in css_files) / (1024 * 1024)
    print(f"\n📈 Total assets: {total_size:.1f}MB")


def run_all_builds(enable_versioning=False):
    """Run all configured builds with optional versioning"""
    print("📊 Found files to process")
    
    # Show what will be built
    print("\n📋 Build Plan:")
    for key, config in ENTRY_POINTS.items():
        version_msg = " (versioned)" if enable_versioning else ""
        file_type = config.get('type', 'js').upper()
        print(f"   • {config['name']}{version_msg}: {config['path']} [{file_type}]")
    
    print("\n" + "=" * 60)
    
    # Track build results
    bundle_infos = []
    build_times = {}
    all_successful = True
    
    # Build each entry point
    for key, config in ENTRY_POINTS.items():
        start_time = time.time()
        bundle_info = build_entry_point(config, enable_versioning)
        build_time = time.time() - start_time
        
        if bundle_info:
            bundle_infos.append(bundle_info)
            build_times[config['name']] = {
                'success': True,
                'time': build_time
            }
        else:
            all_successful = False
            build_times[config['name']] = {
                'success': False,
                'time': build_time
            }
        
        # Small pause between builds
        if key != list(ENTRY_POINTS.keys())[-1]:
            print("\n" + "─" * 40)
    
    # Save manifest if we have any successful builds
    if bundle_infos and all_successful:
        save_manifest(bundle_infos, enable_versioning)
        
        # Clean up old versions after successful build
        if enable_versioning:
            clean_old_versions(keep_last=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Build Summary:")
    for name, stats in build_times.items():
        status = "✅" if stats['success'] else "❌"
        print(f"   {status} {name}: {stats['time']:.1f}s")
    
    return all_successful


def watch_mode():
    """Run in watch mode - simplified version"""
    print("\n👀 Watch mode enabled (without versioning)")
    print("-" * 50)
    
    success = run_all_builds(enable_versioning=False)
    
    if success:
        print("\n✅ Initial build complete. For continuous watching, use:")
        print("   npx esbuild src/static/js/app.js --bundle --watch --outfile=static/js/bundle.min.js")
        print("   npx esbuild src/static/js/app_core.js --bundle --watch --outfile=static/js/bundle.core.min.js")



def main():
    print("🐷 SuperPig UI Builder with Versioning")
    print("=" * 60)
    
    # Parse arguments
    enable_versioning = ENABLE_VERSIONING
    
    if len(sys.argv) > 1:
        if sys.argv[1] in ["--version", "-v"]:
            enable_versioning = True
        
        elif sys.argv[1] in ["--watch", "-w"]:
            watch_mode()
            return
        
        elif sys.argv[1] in ["--scan", "-s"]:
            quick_scan()
            return
        
        elif sys.argv[1] in ["--clean"]:
            clean_old_versions(keep_last=2)
            return
        
        elif sys.argv[1] in ["--build-login"]:
            # Build just login
            bundle_info = build_js_entry(ENTRY_POINTS['login'], enable_versioning)
            if bundle_info:
                save_manifest([bundle_info], enable_versioning)
            sys.exit(0 if bundle_info else 1)
        
        elif sys.argv[1] in ["--build-core"]:
            # Build just core
            bundle_info = build_js_entry(ENTRY_POINTS['core'], enable_versioning)
            if bundle_info:
                save_manifest([bundle_info], enable_versioning)
            sys.exit(0 if bundle_info else 1)
        
        elif sys.argv[1] in ["--build-receipt"]:
            # Build just receipt data entry
            bundle_info = build_js_entry(ENTRY_POINTS['receipt_data_entry'], enable_versioning)
            if bundle_info:
                save_manifest([bundle_info], enable_versioning)
            sys.exit(0 if bundle_info else 1)
        
        
        elif sys.argv[1] in ["--build-css"]:
            # Build just CSS
            bundle_info = build_css_entry(ENTRY_POINTS['main_css'], enable_versioning)
            if bundle_info:
                save_manifest([bundle_info], enable_versioning)
            sys.exit(0 if bundle_info else 1)
        
        elif sys.argv[1] in ["--help", "-h"]:
            print("Usage: python build.py [options]")
            print("Options:")
            print("  --version, -v      Enable versioned outputs (hash in filename)")
            print("  --watch, -w        Build once (simplified watch)")
            print("  --scan, -s         Scan and analyze files")
            print("  --clean            Clean old versioned files (keeps last 2)")
            print("  --build-login      Build only login bundle")
            print("  --build-core       Build only core bundle")
            print("  --build-receipt    Build only receipt data entry bundle")
            print("  --build-css        Build only CSS")
            print("  --help, -h         Show this help")
            
            print("\nEnvironment:")
            print("  ENABLE_VERSIONING=true    Enable versioned outputs")
            print("  SUPERPIG_ENV=development  Enable source maps")
            print("  ANALYZE=1                 Generate build analysis")
            return
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Quick scan first
    quick_scan()
    print("-" * 50)
    
    # Run all builds
    start_time = time.time()
    success = run_all_builds(enable_versioning)
    total_time = time.time() - start_time
    
    if success:
        print(f"\n✨ All builds completed in {total_time:.1f}s")
        
        if enable_versioning:
            print("\n📦 Versioned files created:")
            
            # Show JS bundles
            js_dir = Path("static/js")
            for pattern in ["bundle.*.min.js"]:
                for f in js_dir.glob(pattern):
                    if f.name.count('.') >= 3:
                        size = f.stat().st_size / 1024
                        print(f"   • {f.name} ({size:.1f}KB)")
            
            # Show CSS bundles
            css_dir = Path("static/css")
            for f in css_dir.glob("main.*.min.css"):
                if f.name.count('.') >= 3:
                    size = f.stat().st_size / 1024
                    print(f"   • {f.name} ({size:.1f}KB)")
            
            print("\n💡 To use in templates:")
            print("   Read static/js/manifest.json or static/css/manifest.json to get current filenames")
            print("\n🧹 Cleanup: Old versions automatically removed (kept last 2)")
        else:
            print("\n💡 Tip: Use --version flag for cache-busting filenames")
        
        sys.exit(0)
    else:
        print("\n❌ Some builds failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
