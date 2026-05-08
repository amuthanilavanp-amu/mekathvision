import os
import re

directory = 'public/motion'
for filename in os.listdir(directory):
    if filename.endswith('.jpg'):
        match = re.search(r'frame_(\d+)', filename)
        if match:
            frame_num = match.group(1)
            new_name = f'frame_{frame_num}.jpg'
            os.rename(os.path.join(directory, filename), os.path.join(directory, new_name))
print("Renaming complete.")
