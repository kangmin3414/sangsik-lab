import sherpa_onnx, soundfile as sf, sys
d="vits-mimic3-ko_KO-kss_low/"
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=d+"ko_KO-kss_low.onnx",lexicon="",tokens=d+"tokens.txt",data_dir=d+"espeak-ng-data"),num_threads=2))
tts=sherpa_onnx.OfflineTts(cfg)
a=tts.generate("여러분, 산에서 내려온 날 밤, 유독 잠이 잘 오는 이유를 알고 계셨나요? 그건 기분 탓이 아닙니다.", sid=0, speed=1.0)
sf.write("test.wav", a.samples, a.sample_rate); print(a.sample_rate, len(a.samples)/a.sample_rate)
