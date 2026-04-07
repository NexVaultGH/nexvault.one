import re, json

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/_posts_data.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

posts_js = json.dumps(posts, ensure_ascii=False)

html = open('C:/Users/toonz/OneDrive/Desktop/NexVault/post_template.html', 'r', encoding='utf-8').read()
html = html.replace('POST_DATA_PLACEHOLDER', posts_js)

with open('C:/Users/toonz/OneDrive/Desktop/NexVault/post.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('post.html written,', len(posts), 'posts embedded')
