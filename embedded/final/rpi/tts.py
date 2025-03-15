'''
1. 이상린 (2023.07.19)
2. tts.py
- 기능 : tts 인코딩 프로그램
- 내용 : text를 음성으로 변환
3. 수정목록
- 이충혁(2023.07.31) : tts 멀티프로세싱 위해 stream 수정
- 이충혁(2023.08.04) : tts 블로킹 문제 해결 위해 sounddevice로 변경
'''

from google.cloud import texttospeech # google tts 사용 라이브러리
import sounddevice as sd
import numpy as np
import os # 환경변수 설정을 위함

print("tts.py 시작")
# 환경변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/home/pi/ttspjt-265f90b6a97e.json"

# Google Cloud 서비스 계정 키 파일의 경로
GOOGLE_APPLICATION_CREDENTIALS = '/home/pi/ttspjt-265f90b6a97e-key.json'


'''
- 기능 : TTS 초기화 함수 (딜레이 감소를 위함)
- 인자 : X
- 반환값 : X
'''
def init_tts():
    global client, voice, audio_config


    voice = texttospeech.VoiceSelectionParams(
        language_code='ko-KR',
        name='ko-KR-Standard-A'
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )


    print("초기화 완료")

'''
- 기능 : TTS 변환 및 재생 함수
- 인자 : text_to_speech(변환할 텍스트)
- 반환값 : void
'''
def text_to_speech(text):
    global client


    client = texttospeech.TextToSpeechClient()
    print("재생중")
    synthesis_input = texttospeech.SynthesisInput(text=text)
    print("뭐가 문제")
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    print("진짜로")
    sd.play(np.frombuffer(response.audio_content, dtype=np.int16), samplerate=24000, blocking=False, device = 1)


def stop_audio():
    sd.stop()

'''
- 기능 : TTS exit 함수
- 인자 : X
- 반환값 : X
'''
def exit_tts():
    pass

