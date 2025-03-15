#!/usr/bin/env python3
import serial
import os
from pynput.keyboard import Controller
import time

# 키보드 컨트롤러 생성
keyboard = Controller()

ser_arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=1)  # 시리얼 포트 설정
ser_arduino.flush()

def typing(key):
    # 이 함수에서 수행하고자 하는 동작을 정의합니다.
    print("Received:", key)
    # 여기서 key.py 파일의 typing 함수를 호출하고 a에 1을 대입하여 실행합니다.
    # 예를 들면 아래와 같이 수행할 수 있습니다.
    # typing_result = typing(a)
    keyboard.press(key)
    keyboard.release(key)

while True:
    if ser_arduino.in_waiting >0:
        # print("값이 들어오는지 기다리는중")
        data = ser_arduino.readline()  # 시리얼 데이터 읽기
        command = data.decode().strip()  # 바이트 데이터를 문자열로 변환하고 불필요한 공백 제거
        typing(command)
