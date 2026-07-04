import os
import json

images_dir = r"E:\AntiGravity\born-again-roofing\public\images"
files = os.listdir(images_dir)

image_map = {}
for f in files:
    if f.endswith(".jpg") or f.endswith(".png") or f.endswith(".ico"):
        # Synthesize original URLs
        if f.startswith("wp_"):
            orig = f"https://www.bornagainroofing.com/site/wp-content/uploads/{f[3:]}"
        elif f.startswith("job_"):
            # Could be maps or photos
            if f.startswith("job_1") or f.startswith("job_205740"):
                orig = f"https://checkinsandreviews.s3.us-east-2.amazonaws.com/pins_maps/{f[4:]}"
            else:
                orig = f"https://checkinsandreviews.s3.us-east-2.amazonaws.com/checkin_photos/{f[4:]}"
        else:
            orig = f"https://www.bornagainroofing.com/{f}"
            
        image_map[orig] = f"/images/{f}"

map_file_path = os.path.join(images_dir, "image_map.json")
with open(map_file_path, 'w', encoding='utf-8') as map_f:
    json.dump(image_map, map_f, indent=2)

print("Generated image_map.json containing", len(image_map), "entries.")
