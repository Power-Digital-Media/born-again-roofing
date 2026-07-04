import os
import json
import urllib.request
import urllib.parse
import re
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed

# Bypass SSL verification issues if any
ssl_context = ssl._create_unverified_context()

map_output_path = r"C:\Users\User\.gemini\antigravity\brain\4ff05b91-c9b6-46b6-9788-6c9546966ced\.system_generated\steps\12\output.txt"
output_dir = r"E:\AntiGravity\born-again-roofing\public\images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Read the URLs from our sitemap mapping file (all 64 pages!)
with open(map_output_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

links = data.get("links", [])
urls = [item["url"] for item in links if "url" in item]

# Also add the root URL explicitly
if "https://www.bornagainroofing.com" not in urls:
    urls.append("https://www.bornagainroofing.com")

print(f"Loaded {len(urls)} page URLs to crawl for images. Starting parallel crawl...", flush=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

img_regex = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
bg_regex = re.compile(r'url\(["\']?([^"\')]+)["\']?\)', re.IGNORECASE)

image_urls = set()

# Crawl a single URL and return discovered image links
def crawl_url(url):
    discovered = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=8) as response:
            html = response.read().decode('utf-8', errors='ignore')
            for src in img_regex.findall(html):
                discovered.append(urllib.parse.urljoin(url, src))
            for src in bg_regex.findall(html):
                discovered.append(urllib.parse.urljoin(url, src))
    except Exception as e:
        print(f"Error crawling {url}: {e}", flush=True)
    return discovered

# Crawl pages in parallel
with ThreadPoolExecutor(max_workers=16) as executor:
    futures = {executor.submit(crawl_url, url): url for url in urls}
    for future in as_completed(futures):
        res = future.result()
        for img in res:
            image_urls.add(img)

print(f"Discovered {len(image_urls)} raw image links across all pages. Filtering...", flush=True)

# Filter down to local uploads and S3 checkin assets
filtered_images = []
for img in image_urls:
    is_local_wp = "wp-content/uploads" in img
    is_s3_photos = "checkinsandreviews.s3" in img
    is_logo_or_favicon = "logo.png" in img or "favicon" in img
    
    if (is_local_wp or is_s3_photos or is_logo_or_favicon) and not "google.com" in img:
        filtered_images.append(img)

print(f"Filtered down to {len(filtered_images)} high-intent asset images. Starting parallel download...", flush=True)

image_map = {}

# Download a single image
def download_image(img_url, idx):
    parsed = urllib.parse.urlparse(img_url)
    filename = os.path.basename(parsed.path)
    if not filename:
        filename = f"image_{idx}.jpg"
        
    filename = filename.split('?')[0]
    
    if "wp-content" in img_url:
        local_filename = f"wp_{filename}"
    elif "checkins" in img_url:
        local_filename = f"job_{filename}"
    else:
        local_filename = filename

    dest_path = os.path.join(output_dir, local_filename)
    
    # If already downloaded, skip
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return img_url, f"/images/{local_filename}"

    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=8) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        return img_url, f"/images/{local_filename}"
    except Exception as e:
        return img_url, None

# Download images in parallel
completed_count = 0
with ThreadPoolExecutor(max_workers=20) as executor:
    futures = {executor.submit(download_image, img_url, idx): img_url for idx, img_url in enumerate(filtered_images)}
    for future in as_completed(futures):
        img_url, local_path = future.result()
        completed_count += 1
        if local_path:
            image_map[img_url] = local_path
            
        if completed_count % 50 == 0 or completed_count == len(filtered_images):
            print(f"Progress: {completed_count}/{len(filtered_images)} downloads completed...", flush=True)

# Write image mapping file
map_file_path = os.path.join(output_dir, "image_map.json")
with open(map_file_path, 'w', encoding='utf-8') as map_f:
    json.dump(image_map, map_f, indent=2)

print(f"\nSuccess! Total downloaded files: {len(image_map)}", flush=True)
print(f"Downloaded images saved to: {output_dir}", flush=True)
print(f"Image map saved to: {map_file_path}", flush=True)
