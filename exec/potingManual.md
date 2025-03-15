# SSIOSK

시각장애인을 위한 단 하나의 솔루션 [SSIOSK](http://i9a201.p.ssafy.io)  
Team 개발새발

## 개요

1. 프로젝트 개요
2. 프로젝트 사용 도구
3. 개발환경
4. 외부 서비스

## 빌드

1. 환경변수 형태
2. 빌드하기
3. 배포하기
4. 서비스 이용방법

## 개요

- 프로젝트 개요
  일상생활에서 많은 불편함을 느끼는 시각장애인은 다른 이의 도움 없인 매장에서 주문하는 것조차 힘듭니다.
- SSIOSK는 시각장애인 친화적인 키오스크로, 점자 디스플레이와 조이스틱을 활용한 주문 시스템을 개발하여 시각장애인이 혼자서 주문을 할 수 있도록 돕는 서비스입니다.

## 프로젝트 사용 도구

이슈 관리 : JIRA
형상 관리 : Gitlab
커뮤니케이션 : Notion, Mattermost
디자인 : Figma
SSH연결 : mobaxterm
Serial Terminal : RealTerm
회로설계 : kicad
UCC : Microsoft Clipchamp
CI/CD : Jenkins

## 개발환경

VS Code : 1.80.2
IntelliJ : Ultimate 2023.1.3
JVM : 17.0.8
Node.js : 16.14.2
SERVER : AWS EC2 Ubuntu 20.04.3 LTS
DB : mysql 8.0.34
StmCubeIDE : 1.13.1
ArduinoIDE : 2.1.1
Python : 3.9.2
rpi kernel : 5.15.84-v7l+ 

## 사용 디바이스
STM32F407VET6 : 점자제어용 MCU
ESP32 : 조이스틱 이용 블루투스 조작모듈
raspberry PI 4B : 디바이스 전체 제어


## 외부 서비스

Amazone S3 Storage : 메뉴 이미지 저장소
google cloud : Text to Speech API

## 빌드

### 환경변수 형태

.application.yml

```
driver-class-name: com.mysql.cj.jdbc.Driver
url: url
username: username
password: password
```

## 빌드하기

1. Front  
    터미널 상 `~/front` 내에서  
   `npm i`  
   `npm run build`
2. Back-spring
   Gradle 실행
   Bootjar 실행
3. Back-flask

## 배포하기

Nginx 설정

```
server {
        listen                          443 ssl http2;
        server_name                     i9a201.p.ssafy.io;
        charset                         utf-8;

        ssl_certificate                 /etc/ssl/ssiosk/nginx_ssl.crt;
        ssl_certificate_key             /etc/ssl/ssiosk/private.key;

        ssl_session_timeout             5m;
        ssl_prefer_server_ciphers       on;

        add_header                      'Access-Control-Allow-Origin' '*';

        location / {
                proxy_pass http://localhost:3000;
                proxy_read_timeout 604800s;
                proxy_send_timeout 604800s;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header Origin "";
                proxy_cache_bypass $http_upgrade;
        }

        location /api {
                proxy_pass http://localhost:5500;
                proxy_read_timeout 604800s;
                proxy_send_timeout 604800s;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header Origin "";
                proxy_cache_bypass $http_upgrade;

        }

        location /ws {
                proxy_pass http://localhost:5500;
                proxy_read_timeout 604800s;
                proxy_send_timeout 604800s;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header Origin "";
                proxy_cache_bypass $http_upgrade;
        }

       location /device {
                proxy_pass http://127.0.0.1:5000;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-Server $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
       }
}

server {
        listen                          80 default;
        server_name                     i9a201.p.ssafy.io;

        location / {
                return 301 https://i9a201.p.ssafy.io$request_uri;
                expires epoch;
        }
}
```

이후 sudo service nginx start

## 서비스 이용 방법

**Amazone S3**

1. Aws S3 접속 후 버킷 만들기
2. AWS console > IAM > 엑세스 관리 > 사용자 > 사용자 추가
3. AWS Console > IAM > 엑세스 관리자 > 사용자 > 생성한 사용자 이름 클릭 > 보안 자격 증명 > 엑세스 키 만들기
4. 액세스 키와 비밀 액세스 키를 application.yml 파일에 입력

**Google cloud TTS API**
 1. google cloud project 생성
 2. text-to-speech 시작
 3. API 키 만들기
 4. pi에 설치
```
# 시간설정
$ sudo apt-get install ntpdate
$ sudo ntpdate time.bora.net

$ sudo date -s "2023-07-18 14:14:14"

# pi로 key 파일 옮기기

# GOOGLE_APPLICATION_CREDENTIALS 환경변수 설정 - 매번 해주어야함
$ export GOOGLE_APPLICATION_CREDENTIALS='/home/pi/ttspjt-265f90b6a97e.json'

# google cloud speech python 라이브러리 설치
$ pip3 install google-cloud-speech

# 이슈1 : import 에러가 난다면
$ pip3 install google-cloud-texttospeech
```
 5. sounddevice와 결합
```
import sounddevice as sd
import numpy as np
from google.cloud import texttospeech

import os # 환경변수 설정을 위함

print("tts.py 시작")
# 환경변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]='PATH'

# Google Cloud 서비스 계정 키 파일의 경로
GOOGLE_APPLICATION_CREDENTIALS = 'PATH'


def init_tts():
    global client, voice, audio_config

    client = texttospeech.TextToSpeechClient()

    voice = texttospeech.VoiceSelectionParams(
        language_code='ko-KR',
        name='ko-KR-Standard-A'
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )


    print("초기화 완료")

# TTS 함수
def text_to_speech(text):
    synthesis_input = texttospeech.SynthesisInput(text=text)

    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    play_audio(np.frombuffer(response.audio_content, dtype=np.int16), 24000)  # 적절한 sample_rate로 설정하여 재생
    return response.audio_content

# 오디오 재생 함수
def play_audio(data, sample_rate):
    sd.play(data, samplerate=sample_rate, blocking=True)


init_tts()
text_to_speech("젤리맛있다")
```

## 점자 회로 설계 
![Alt text](./pics/image.png)