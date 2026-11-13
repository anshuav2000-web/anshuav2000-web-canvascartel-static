import os

path = 'src/components/home/HeroSection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the import to use separate plugin files
content = content.replace(
    'import { gsap, ScrollTrigger, Flip } from "gsap";',
    'import gsap from "gsap";\nimport ScrollTrigger from "gsap/ScrollTrigger";\nimport Flip from "gsap/Flip";'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed imports')
