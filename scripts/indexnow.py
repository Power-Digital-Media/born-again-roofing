import urllib.request
import urllib.parse
import json
import xml.etree.ElementTree as ET
import sys

def main():
    host = "www.bornagainroofing.com"
    key = "93f2ea70d65b4c10a8ef18cd301e52ba"
    key_location = f"https://{host}/{key}.txt"
    sitemap_url = f"https://{host}/sitemap.xml"
    
    print(f"IndexNow Submission Tool")
    print(f"========================")
    print(f"Host: {host}")
    print(f"Key: {key}")
    print(f"Key Location: {key_location}")
    print(f"Sitemap URL: {sitemap_url}")
    print(f"Pinging sitemap.xml to extract URLs...", flush=True)
    
    # 1. Fetch and parse sitemap
    try:
        req = urllib.request.Request(
            sitemap_url, 
            headers={'User-Agent': 'Mozilla/5.0 IndexNow Submission Script'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            sitemap_content = response.read()
    except Exception as e:
        print(f"Error fetching sitemap.xml: {e}")
        print("Please ensure the domain is fully pointed to Netlify and the site is loading before running this script.")
        sys.exit(1)
        
    try:
        root = ET.fromstring(sitemap_content)
        # Handle namespaces
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for url_node in root.findall('ns:url', namespace):
            loc_node = url_node.find('ns:loc', namespace)
            if loc_node is not None and loc_node.text:
                urls.append(loc_node.text)
                
        if not urls:
            # Fallback if no namespace is found
            for url_node in root.findall('url'):
                loc_node = url_node.find('loc')
                if loc_node is not None and loc_node.text:
                    urls.append(loc_node.text)
    except Exception as e:
        print(f"Error parsing sitemap XML: {e}")
        sys.exit(1)
        
    print(f"Successfully extracted {len(urls)} URLs from sitemap.")
    if not urls:
        print("No URLs found to submit.")
        sys.exit(1)
        
    # 2. Submit to IndexNow API
    indexnow_url = "https://api.indexnow.org/indexnow"
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    print("Submitting URLs to IndexNow API...", flush=True)
    try:
        api_req = urllib.request.Request(
            indexnow_url,
            data=data,
            headers={
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': 'Mozilla/5.0 IndexNow Submission Script'
            },
            method='POST'
        )
        with urllib.request.urlopen(api_req, timeout=10) as api_response:
            status = api_response.getcode()
            response_text = api_response.read().decode('utf-8')
            
        print(f"IndexNow API response status: {status}")
        if status in [200, 202]:
            print("SUCCESS: URLs submitted successfully to IndexNow! Search engines will begin crawling immediately.")
        else:
            print(f"Warning: Received unexpected status code {status}. Response: {response_text}")
    except Exception as e:
        print(f"Error submitting to IndexNow API: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
