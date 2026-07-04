import os
import json
import urllib.request
import urllib.parse
import re
import ssl

# Bypass SSL verification issues if any
ssl_context = ssl._create_unverified_context()

map_output_path = r"C:\Users\User\.gemini\antigravity\brain\4ff05b91-c9b6-46b6-9788-6c9546966ced\.system_generated\steps\12\output.txt"
output_dir = r"E:\AntiGravity\born-again-roofing\public\images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Crawl only the core pages where images reside
urls = [
    "https://www.bornagainroofing.com",
    "https://www.bornagainroofing.com/pins",
    "https://www.bornagainroofing.com/about-us",
    "https://www.bornagainroofing.com/reviews",
    "https://www.bornagainroofing.com/residential-roofing",
    "https://www.bornagainroofing.com/storm-damage-roof-repair",
    "https://www.bornagainroofing.com/metal-roofing-repair-and-installation"
]

print(f"Loaded {len(urls)} page URLs to crawl for images.", flush=True)

image_urls = set()

# Headers to prevent getting blocked by basic anti-bot filters
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Regex to find img tags and their src attributes
img_regex = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
# Regex to find background-image styles
bg_regex = re.compile(r'url\(["\']?([^"\')]+)["\']?\)', re.IGNORECASE)

for i, url in enumerate(urls):
    print(f"[{i+1}/{len(urls)}] Crawling: {url}", flush=True)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Find all image links in img tags
            for src in img_regex.findall(html):
                # Resolve relative URLs
                full_src = urllib.parse.urljoin(url, src)
                image_urls.add(full_src)
                
            # Find background-images
            for src in bg_regex.findall(html):
                full_src = urllib.parse.urljoin(url, src)
                image_urls.add(full_src)
                
    except Exception as e:
        print(f"Error crawling {url}: {e}", flush=True)

print(f"Discovered {len(image_urls)} raw image links. Filtering...", flush=True)

# Filter down to relevant brand/project/uploads images
# We exclude google maps tiles, transparent spacers, and external icons
filtered_images = []
for img in image_urls:
    # We want local uploads or S3 checkin assets
    is_local_wp = "wp-content/uploads" in img
    is_s3_photos = "checkinsandreviews.s3" in img
    is_logo_or_favicon = "logo.png" in img or "favicon" in img
    
    if (is_local_wp or is_s3_photos or is_logo_or_favicon) and not "google.com" in img:
        filtered_images.append(img)

print(f"Filtered down to {len(filtered_images)} high-intent asset images. Starting download...", flush=True)

image_map = {}

for i, img_url in enumerate(filtered_images):
    # Determine local filename
    parsed = urllib.parse.urlparse(img_url)
    filename = os.path.basename(parsed.path)
    if not filename:
        filename = f"image_{i}.jpg"
        
    # Clean filename from version queries
    filename = filename.split('?')[0]
    
    # Prefix folders if from s3 or wp-content to keep organized
    if "wp-content" in img_url:
        local_filename = f"wp_{filename}"
    elif "checkins" in img_url:
        local_filename = f"job_{filename}"
    else:
        local_filename = filename

    dest_path = os.path.join(output_dir, local_filename)
    
    print(f"[{i+1}/{len(filtered_images)}] Downloading: {img_url} -> {local_filename}", flush=True)
    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        image_map[img_url] = f"/images/{local_filename}"
    except Exception as e:
        print(f"Error downloading {img_url}: {e}", flush=True)

# Write image mapping file
map_file_path = os.path.join(output_dir, "image_map.json")
with open(map_file_path, 'w', encoding='utf-8') as map_f:
    json.dump(image_map, map_f, indent=2)

print(f"\nFinished! Downloaded images saved to: {output_dir}", flush=True)
print(f"Image map saved to: {map_file_path}", flush=True)
