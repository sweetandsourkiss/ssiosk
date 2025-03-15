'''
1. 이상린 (2023.07.19)
2. tts.py
- 기능 : tts 인코딩 프로그램
- 내용 : text를 음성으로 변환
3. 수정목록
- 이충혁(2023.07.31) : tts 멀티프로세싱 위해 stream 수정
-
'''

from google.cloud import texttospeech # google tts 사용 라이브러리
import pyaudio # 음성을 바로 재생하기 위한 라이브러리
import os # 환경변수 설정을 위함

print("tts.py 시작")
# 환경변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/home/pi/ttspjt-265f90b6a97e.json"

# Google Cloud 서비스 계정 키 파일의 경로
GOOGLE_APPLICATION_CREDENTIALS = '/home/pi/ttspjt-265f90b6a97e.json'

'''
- 기능 : TTS 초기화 함수 (딜레이 감소를 위함)
- 인자 : X
- 반환값 : X
'''
def init_tts():
    global client, voice, audio_config, stream

    client = texttospeech.TextToSpeechClient()

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

    stream = pyaudio.PyAudio().open(
        format=pyaudio.paInt16,
        channels=1,
        rate=24000,
        output=True
    )


    input_text = texttospeech.SynthesisInput(text=text)
    
    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )

    print("where3")
    # 오디오 재생
    audio_content = response.audio_content

    print("where2")
    stream.write(audio_content)
    
    print("where1")
    stream.stop_stream()
    stream.close()
    pyaudio.PyAudio().terminate()

'''
- 기능 : TTS exit 함수
- 인자 : X
- 반환값 : X
'''
def exit_tts():
    pass

