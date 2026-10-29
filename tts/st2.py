import supertonic as s, time
tts = s.TTS(model='supertonic-3')
txt = "여러분, 산에서 내려온 날 밤, 유독 잠이 잘 오는 이유를 알고 계셨나요? 그건 기분 탓이 아닙니다. 산길에 발을 들인 지 딱 십오 분 만에, 뇌에서는 완전히 다른 일이 시작됩니다."
for v in ['M1','M2','M3','M4','M5']:
    st = tts.get_voice_style(v)
    t=time.time(); wav, dur = tts.synthesize(txt, voice_style=st, lang='ko', total_steps=10, speed=1.0)
    tts.save_audio(wav, f"ko_{v}.wav"); print(v, wav.shape, dur, round(time.time()-t,1))
