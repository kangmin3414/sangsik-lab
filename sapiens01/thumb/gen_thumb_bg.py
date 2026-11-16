"""사피엔스 편 썸네일 A 배경(Grok). 사람·글자·로고 없음. usage: python3 gen_thumb_bg.py"""
import os, sys
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import xai
os.chdir(os.path.dirname(os.path.abspath(__file__)))
P = ('A soft healing picture-book illustration of a quiet city street in the early morning at sunrise: pastel buildings with small shops (blank signs, no letters), '
     'a few round trees with soft pink blossoms, warm golden sunlight streaming from the right, gentle long shadows on an empty sidewalk, a light pastel sky with fluffy clouds, '
     'calm and hopeful mood, thick clean cartoon outlines, flat pastel colors with subtle watercolor texture. The LEFT third of the image is a simple soft sky and wall area with few details. '
     'NO people, NO characters, NO animals, NO text, NO letters, NO numbers, NO logos.')
for i in (1, 2): xai.image(P, f'ai/street_{i}.jpg', aspect='16:9', resolution='2k'); print('ok', i)
